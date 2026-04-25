<?php

namespace App\Services\Houzez;

use App\Jobs\DownloadHouzezImage;
use App\Models\ImportBatch;
use App\Models\Property;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Imports `wp_posts` rows where post_type='property' (Houzez listings) into
 * the Laravel `properties` table. Handles the long list of Houzez `fave_*`
 * postmeta keys, taxonomy lookups (property_type / property_status / city /
 * state / country / area / features / label), and queues image downloads via
 * DownloadHouzezImage.
 *
 * Idempotent: properties are matched on `wp_id`, so re-running updates the
 * same row instead of duplicating.
 */
class HouzezPropertyImporter
{
    /** Houzez post_status → Laravel listing_status. */
    private const POST_STATUS_TO_LISTING_STATUS = [
        'publish' => 'for_sale',
        'private' => 'for_sale',
        'pending' => 'for_sale',
        'draft' => 'inactive',
        'on_hold' => 'inactive',
        'expired' => 'inactive',
        'trash' => 'inactive',
    ];

    /**
     * Houzez `property_label` slug/key → Laravel boolean column on properties.
     * (The remainder become free-form `listing_label` strings.)
     */
    private const LABEL_FLAG_MAP = [
        'motivated_seller' => 'is_motivated_seller',
        'open_house' => null, // tracked via OpenHouse model — we don't auto-create
        'new_listing' => null,
        'price_reduced' => null,
        'back_on_market' => null,
    ];

    public function __construct(
        private readonly array $userMap, // wp_user_id → laravel_user_id
        private readonly array $termMap, // wp_term_id → ['type','key','label']
        private readonly ?ImportBatch $batch = null,
        private readonly bool $downloadImages = true,
    ) {}

    /** @return array{imported:int, updated:int, skipped:int, image_jobs:int, errors:array} */
    public function run(?int $limit = null): array
    {
        $imported = 0;
        $updated = 0;
        $skipped = 0;
        $imageJobs = 0;
        $errors = [];

        $query = HouzezDb::table('posts')
            ->where('post_type', 'property')
            ->whereNotIn('post_status', ['trash', 'auto-draft', 'inherit'])
            ->orderBy('ID');
        if ($limit) $query->limit($limit);

        $rows = $query->get();

        // Default fallback owner: first admin user (avoids null user_id).
        $fallbackOwnerId = \App\Models\User::where('role', 'admin')->orderBy('id')->value('id') ?? \App\Models\User::orderBy('id')->value('id');

        foreach ($rows as $wp) {
            try {
                $meta = $this->loadMeta((int) $wp->ID);
                $terms = $this->loadTerms((int) $wp->ID);

                $existing = Property::where('wp_id', $wp->ID)->first();
                $isNew = !$existing;

                $data = $this->mapToProperty($wp, $meta, $terms, $fallbackOwnerId);

                if ($existing) {
                    // Don't overwrite the slug (immutable) or claim_token (random).
                    unset($data['slug'], $data['claim_token']);
                    $existing->fill($data)->save();
                    $property = $existing;
                    $updated++;
                } else {
                    $property = Property::create($data);
                    $imported++;
                }

                // Images — queue one job per attachment so the UI returns fast.
                if ($this->downloadImages) {
                    $imageJobs += $this->queueImages($property, $meta, (int) $wp->ID);
                }
            } catch (\Throwable $e) {
                $skipped++;
                $errors[] = ['wp_id' => (int) $wp->ID, 'message' => $e->getMessage()];
                report($e);
            }
        }

        if ($this->batch) {
            $this->batch->update([
                'imported_count' => $imported,
                'failed_count' => $skipped,
                'errors' => $errors ?: null,
            ]);
        }

        return compact('imported', 'updated', 'skipped', 'imageJobs', 'errors')
            + ['image_jobs' => $imageJobs];
    }

    private function mapToProperty(object $wp, array $meta, array $terms, ?int $fallbackOwnerId): array
    {
        // ---- Taxonomy resolution ----
        // Houzez allows property_type to be unset; the Laravel column is NOT
        // NULL, so default to single-family-home (the most common type).
        $propertyTypeKey = $this->pickTermKey($terms, 'property_type') ?: 'single-family-home';
        $transactionKey = $this->pickTermKey($terms, 'property_status') ?: 'for_sale';
        $labelKey = $this->pickTermKey($terms, 'property_label');
        $features = $this->collectFeatures($terms);

        // ---- Listing status ----
        $listingStatus = self::POST_STATUS_TO_LISTING_STATUS[$wp->post_status] ?? 'for_sale';
        // Houzez uses property_status taxonomy "Sold"/"Pending" too; honour those.
        if (str_contains(strtolower($transactionKey), 'sold')) $listingStatus = 'sold';
        elseif (str_contains(strtolower($transactionKey), 'pending')) $listingStatus = 'pending';

        // Normalise transaction_type to one of the known keys.
        $transactionType = match (true) {
            str_contains($transactionKey, 'rent') => 'for_rent',
            default => 'for_sale',
        };

        // ---- Pricing ----
        // Clamp to fit decimal(12,2). The legacy DB has at least one test
        // listing with price=10_000_000_000 that overflows the column.
        $price = min($this->floatOrNull($meta['fave_property_price'] ?? null) ?? 0, 9_999_999_999.99);
        $monthlyRent = $transactionType === 'for_rent' ? $price : null;

        // ---- Lat/lng (Houzez stores either combined "lat,lng,zoom" or split). ----
        [$lat, $lng] = $this->resolveLatLng($meta);

        // ---- Address ----
        $mapAddress = $meta['fave_property_map_address'] ?? null;
        $streetAddress = $meta['fave_property_address'] ?? $mapAddress ?? '';
        [$city, $state, $zip] = $this->resolveCityStateZip($terms, $meta, $mapAddress);

        // ---- Bathrooms ----
        $halfBath = (int) ($meta['fave_half-bathrooms'] ?? 0);
        $fullBath = (int) ($meta['fave_property_bathrooms'] ?? 0);
        $bathrooms = $fullBath + ($halfBath * 0.5);

        // ---- Boolean label flags ----
        $isFeatured = (string) ($meta['fave_featured'] ?? '0') === '1';
        $isMotivated = $labelKey === 'motivated_seller'
            || (string) ($meta['fave_motivated_seller'] ?? '0') === '1';

        // ---- Owner ----
        $ownerId = $this->userMap[(int) $wp->post_author] ?? $fallbackOwnerId;
        $owner = $ownerId ? \App\Models\User::find($ownerId) : null;

        // Contact fields are NOT NULL on properties — fall back to the owner.
        $contactName = $owner?->name ?: 'Property Owner';
        $contactEmail = $owner?->email ?: 'unknown@saveonyourhome.com';
        $contactPhone = $owner?->phone ?: '';

        return [
            'wp_id' => (int) $wp->ID,
            'user_id' => $ownerId,
            'property_title' => trim((string) $wp->post_title) ?: ('Property #' . $wp->ID),
            'property_type' => $propertyTypeKey,
            'transaction_type' => $transactionType,
            'listing_status' => $listingStatus,
            'listing_label' => $labelKey,
            'status' => $listingStatus === 'for_sale' ? 'for-sale' : $listingStatus,
            'price' => $price,
            'monthly_rent' => $monthlyRent,
            'address' => trim($streetAddress),
            'city' => $city,
            'state' => $state,
            'zip_code' => $zip,
            'county' => $this->pickTermLabelByTaxonomy($terms, 'property_county_state'),
            'subdivision' => $this->pickTermLabelByTaxonomy($terms, 'property_area'),
            'bedrooms' => (int) ($meta['fave_property_bedrooms'] ?? 0),
            'bathrooms' => $bathrooms ?: null,
            // `full_bathrooms` is NOT NULL with default 0 — keep 0 if Houzez didn't have a value.
            'full_bathrooms' => $fullBath,
            'half_bathrooms' => $halfBath ?: null,
            'sqft' => (int) ($meta['fave_property_size'] ?? 0) ?: null,
            'lot_size' => ($lot = $this->floatOrNull($meta['fave_property_land'] ?? null)) !== null ? (int) $lot : null,
            'acres' => $this->floatOrNull($meta['fave_acreage-of-property'] ?? null),
            'year_built' => (int) ($meta['fave_property_year'] ?? 0) ?: null,
            'garage' => $this->extractInt($meta['fave_property_garage'] ?? null),
            'has_hoa' => !empty($meta['fave_hoa']),
            'hoa_fee' => $this->floatOrNull($meta['fave_hoa'] ?? null),
            'annual_property_tax' => $this->floatOrNull($meta['fave_annual-property-tax'] ?? null),
            'description' => trim((string) $wp->post_content) ?: '—',
            'contact_name' => $contactName,
            'contact_email' => $contactEmail,
            'contact_phone' => $contactPhone,
            'features' => $features ?: null,
            'photos' => [], // populated by DownloadHouzezImage jobs as PropertyImage rows
            'floor_plans' => $this->mapFloorPlans($meta['floor_plans'] ?? null),
            'video_url' => $this->cleanUrl($meta['fave_video_url'] ?? null),
            ...$this->virtualTourFields($meta['fave_virtual_tour'] ?? null),
            'has_video' => !empty($meta['fave_video_url']),
            'is_featured' => $isFeatured,
            'is_motivated_seller' => $isMotivated,
            'is_active' => $wp->post_status === 'publish',
            'is_licensed_agent' => (string) ($meta['fave_seller-is-licensed-real-estate-agent'] ?? '0') === '1',
            'open_to_realtors' => (string) ($meta['fave_seller-is-open-to-contact-from-realtors'] ?? '0') === '1',
            'requires_pre_approval' => (string) ($meta['fave_seller-requires-a-pre-approval-from-a-licenses-mortgage-company-prior-to-viewing-the-home'] ?? '0') === '1',
            'approval_status' => 'approved',
            'approved_at' => $wp->post_date,
            'latitude' => $lat,
            'longitude' => $lng,
            'import_source' => 'houzez',
            'import_batch_id' => $this->batch?->id,
            'claim_token' => Str::uuid()->toString(),
            'claim_expires_at' => $this->batch?->expires_at,
            'created_at' => $wp->post_date,
            'updated_at' => $wp->post_modified,
        ];
    }

    // ----- Helpers -------------------------------------------------------

    /**
     * Load all postmeta for a post. Only `fave_property_images` (the Houzez
     * gallery — one row per attachment) is collected as an array; every other
     * key keeps its first value, matching `get_post_meta($id, $key, true)`
     * semantics in WordPress.
     */
    private function loadMeta(int $postId): array
    {
        $rows = HouzezDb::table('postmeta')
            ->where('post_id', $postId)
            ->orderBy('meta_id')
            ->get(['meta_key', 'meta_value']);

        $out = [];
        $gallery = [];
        foreach ($rows as $r) {
            if ($r->meta_key === 'fave_property_images') {
                $gallery[] = $r->meta_value;
                continue;
            }
            if (!array_key_exists($r->meta_key, $out)) {
                $out[$r->meta_key] = $r->meta_value;
            }
        }
        if (!empty($gallery)) {
            $out['fave_property_images'] = $gallery;
        }
        return $out;
    }

    /** @return array<int,array{taxonomy:string,name:string,slug:string,term_id:int}> */
    private function loadTerms(int $postId): array
    {
        return HouzezDb::table('term_relationships')
            ->join('wp_term_taxonomy', 'wp_term_relationships.term_taxonomy_id', '=', 'wp_term_taxonomy.term_taxonomy_id')
            ->join('wp_terms', 'wp_term_taxonomy.term_id', '=', 'wp_terms.term_id')
            ->where('wp_term_relationships.object_id', $postId)
            ->get([
                'wp_term_taxonomy.taxonomy',
                'wp_terms.term_id',
                'wp_terms.name',
                'wp_terms.slug',
            ])
            ->map(fn ($r) => [
                'taxonomy' => $r->taxonomy,
                'term_id' => (int) $r->term_id,
                'name' => (string) $r->name,
                'slug' => (string) $r->slug,
            ])
            ->all();
    }

    private function pickTermKey(array $terms, string $taxonomy): ?string
    {
        foreach ($terms as $t) {
            if ($t['taxonomy'] !== $taxonomy) continue;
            $mapped = $this->termMap[$t['term_id']] ?? null;
            if ($mapped) return $mapped['key'];
            return Str::slug($t['name'], '_');
        }
        return null;
    }

    private function pickTermLabelByTaxonomy(array $terms, string $taxonomy): ?string
    {
        foreach ($terms as $t) {
            if ($t['taxonomy'] === $taxonomy) return $t['name'];
        }
        return null;
    }

    /**
     * Houzez uses the singular taxonomy name `property_feature`. Accept the
     * plural too just in case some installs differ.
     *
     * @return string[]
     */
    private function collectFeatures(array $terms): array
    {
        $out = [];
        foreach ($terms as $t) {
            if ($t['taxonomy'] === 'property_feature' || $t['taxonomy'] === 'property_features') {
                $out[] = $t['name'];
            }
        }
        return array_values(array_unique($out));
    }

    /**
     * Resolve coordinates, defending against the junk values (year numbers,
     * zero, etc.) that occasionally crept into the legacy DB. We drop
     * anything outside valid lat/lng ranges rather than try to fix it.
     *
     * @return array{0:?float, 1:?float}
     */
    private function resolveLatLng(array $meta): array
    {
        $lat = $this->floatOrNull($meta['houzez_geolocation_lat'] ?? null);
        $lng = $this->floatOrNull($meta['houzez_geolocation_long'] ?? null);

        if ($lat === null || $lng === null) {
            // fave_property_location is "lat,lng,zoom"
            $loc = (string) ($meta['fave_property_location'] ?? '');
            if ($loc !== '') {
                $parts = array_map('trim', explode(',', $loc));
                $lat = $lat ?? $this->floatOrNull($parts[0] ?? null);
                $lng = $lng ?? $this->floatOrNull($parts[1] ?? null);
            }
        }

        $validLat = $lat !== null && $lat >= -90 && $lat <= 90 && abs($lat) > 0.0001;
        $validLng = $lng !== null && $lng >= -180 && $lng <= 180 && abs($lng) > 0.0001;
        return [$validLat ? $lat : null, $validLng ? $lng : null];
    }

    /** @return array{0:?string,1:?string,2:?string} */
    private function resolveCityStateZip(array $terms, array $meta, ?string $mapAddress): array
    {
        $city = $this->pickTermLabelByTaxonomy($terms, 'property_city');
        $state = $this->pickTermLabelByTaxonomy($terms, 'property_state');
        $zip = trim((string) ($meta['fave_property_zip'] ?? ''));

        // Fallback: parse "..., City, ST 12345, USA"
        if ((!$city || !$state || !$zip) && $mapAddress) {
            $parts = array_map('trim', explode(',', $mapAddress));
            // Common shape: ["3401 NW 7th Ave", "Miami", "FL 33127", "USA"]
            if (count($parts) >= 3) {
                $city = $city ?: ($parts[count($parts) - 3] ?? null);
                if (preg_match('/^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/', $parts[count($parts) - 2] ?? '', $m)) {
                    $state = $state ?: $m[1];
                    $zip = $zip ?: $m[2];
                }
            }
        }
        return [$city ?: null, $state ?: null, $zip ?: null];
    }

    /**
     * Houzez stores `fave_virtual_tour` as either a plain URL OR an `<iframe>`
     * HTML snippet — sometimes hundreds of chars long. The `virtual_tour_url`
     * column is varchar(255), so we route HTML embeds into the longer
     * `virtual_tour_embed` text column instead.
     *
     * @return array{virtual_tour_url:?string, virtual_tour_embed:?string, virtual_tour_type:?string, has_virtual_tour:bool}
     */
    private function virtualTourFields(mixed $raw): array
    {
        $value = is_string($raw) ? trim($raw) : '';
        if ($value === '') {
            return [
                'virtual_tour_url' => null,
                'virtual_tour_embed' => null,
                'virtual_tour_type' => null,
                'has_virtual_tour' => false,
            ];
        }
        if (stripos($value, '<iframe') !== false || str_starts_with($value, '<')) {
            return [
                'virtual_tour_url' => null,
                'virtual_tour_embed' => $value,
                'virtual_tour_type' => 'embed',
                'has_virtual_tour' => true,
            ];
        }
        // Plain URL — but keep it under 255 chars to be safe.
        $url = mb_substr($value, 0, 250);
        return [
            'virtual_tour_url' => $url,
            'virtual_tour_embed' => null,
            'virtual_tour_type' => 'video',
            'has_virtual_tour' => true,
        ];
    }

    private function cleanUrl(mixed $v): ?string
    {
        $s = is_string($v) ? trim($v) : '';
        if ($s === '') return null;
        return mb_substr($s, 0, 250);
    }

    /** Pull the first integer out of a free-form string like "2 Car" → 2. */
    private function extractInt(mixed $v): ?int
    {
        if ($v === null) return null;
        if (preg_match('/-?\d+/', (string) $v, $m)) {
            return (int) $m[0];
        }
        return null;
    }

    private function floatOrNull(mixed $v): ?float
    {
        if ($v === null) return null;
        $s = trim((string) $v);
        if ($s === '') return null;
        // Strip currency / commas: "$3,700,000" → "3700000"
        $s = preg_replace('/[^\d.\-]/', '', $s);
        return $s === '' ? null : (float) $s;
    }

    /** Houzez `floor_plans` is a serialised array of objects. */
    private function mapFloorPlans(mixed $serialized): ?array
    {
        $plans = PhpSerialized::decode($serialized);
        if (!is_array($plans)) return null;
        $out = [];
        foreach ($plans as $p) {
            if (!is_array($p)) continue;
            $out[] = [
                'title' => $p['title'] ?? null,
                'rooms' => $p['rooms'] ?? null,
                'bathrooms' => $p['bathrooms'] ?? null,
                'price' => $p['price'] ?? null,
                'size' => $p['size'] ?? null,
                'description' => $p['description'] ?? null,
                'image_url' => $p['image'] ?? null,
            ];
        }
        return $out ?: null;
    }

    private function queueImages(Property $property, array $meta, int $wpPostId): int
    {
        $attachmentIds = [];

        // Featured image first (primary).
        if (!empty($meta['_thumbnail_id'])) {
            $attachmentIds[] = (int) $meta['_thumbnail_id'];
        }

        // Gallery — Houzez stores fave_property_images as one row per image.
        $gallery = $meta['fave_property_images'] ?? null;
        if (is_array($gallery)) {
            foreach ($gallery as $id) $attachmentIds[] = (int) $id;
        } elseif ($gallery !== null && (string) $gallery !== '') {
            $attachmentIds[] = (int) $gallery;
        }

        $attachmentIds = array_values(array_unique(array_filter($attachmentIds)));
        if (empty($attachmentIds)) return 0;

        // Look up the attachment post rows in a single query.
        $attachments = HouzezDb::table('posts')
            ->whereIn('ID', $attachmentIds)
            ->where('post_type', 'attachment')
            ->get(['ID', 'guid', 'post_title']);

        $byId = [];
        foreach ($attachments as $a) $byId[(int) $a->ID] = $a;

        $primaryId = (int) ($meta['_thumbnail_id'] ?? 0);
        $queued = 0;

        foreach ($attachmentIds as $i => $attId) {
            $att = $byId[$attId] ?? null;
            if (!$att || empty($att->guid)) continue;

            DownloadHouzezImage::dispatch(
                propertyId: $property->id,
                attachmentId: (int) $att->ID,
                imageUrl: (string) $att->guid,
                isPrimary: $attId === $primaryId,
                sortOrder: $i,
            )->onQueue('imports');
            $queued++;
        }
        return $queued;
    }
}

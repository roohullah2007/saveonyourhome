<?php

namespace App\Services\Houzez;

use App\Models\TaxonomyTerm;
use Illuminate\Support\Str;

/**
 * Imports Houzez taxonomies from the legacy WP DB into the Laravel
 * `taxonomy_terms` table. Most Houzez taxonomies map onto string columns on
 * `properties` directly (city, state, zip), but four of them belong in the
 * managed taxonomy catalog: property_type, transaction_type (from Houzez
 * `property_status`), listing_label (from Houzez `property_label`) and
 * listing_status (synthetic — derived from the Houzez status taxonomy).
 *
 * Other Houzez taxonomies (city/state/country/area/features) are *not* copied
 * here — they live as plain strings on properties or in the `features` JSON.
 */
class HouzezTaxonomyImporter
{
    /** WP taxonomy → managed Laravel TaxonomyTerm.type */
    private const TAXONOMY_MAP = [
        'property_type' => TaxonomyTerm::TYPE_PROPERTY_TYPE,
        'property_status' => TaxonomyTerm::TYPE_TRANSACTION_TYPE,
        'property_label' => TaxonomyTerm::TYPE_LISTING_LABEL,
    ];

    /**
     * Houzez `property_status` term name → Laravel transaction_type key.
     * Anything not in this map is slug-cased and inserted as-is.
     */
    private const TRANSACTION_KEY_MAP = [
        'for sale by owner' => 'for_sale',
        'for sale' => 'for_sale',
        'sale' => 'for_sale',
        'for rent by owner' => 'for_rent',
        'for rent' => 'for_rent',
        'rent' => 'for_rent',
        'rental' => 'for_rent',
    ];

    /** Houzez property type term name → Laravel property_type key. */
    private const PROPERTY_TYPE_KEY_MAP = [
        'single family home' => 'single-family-home',
        'two family home' => 'two-family-home',
        'three family home' => 'three-family-home',
        'four family home' => 'four-family-home',
        'apartment' => 'condo',
        'condo' => 'condo',
        'condos' => 'condo',
        'townhouse' => 'townhouse',
        'townhomes' => 'townhouse',
        'condos / townhomes / co-ops' => 'condos-townhomes-co-ops',
        'multi family' => 'multi-family',
        'multi-family' => 'multi-family',
        'land' => 'land',
        'lot / land' => 'land',
        'farms / ranches' => 'farms-ranches',
        'manufactured / mobile home' => 'mfd-mobile-homes',
        'mobile home' => 'mfd-mobile-homes',
    ];

    /**
     * @return array{imported:int, skipped:int, term_map:array<int,array{type:string,key:string,label:string}>}
     *   `term_map` is keyed by wp_terms.term_id so the property importer can
     *   look up the Laravel target without re-querying the WP DB.
     */
    public function run(): array
    {
        $rows = HouzezDb::table('term_taxonomy')
            ->join('wp_terms', 'wp_term_taxonomy.term_id', '=', 'wp_terms.term_id')
            ->whereIn('wp_term_taxonomy.taxonomy', array_keys(self::TAXONOMY_MAP))
            ->get([
                'wp_term_taxonomy.term_id', 'wp_term_taxonomy.taxonomy',
                'wp_terms.name', 'wp_terms.slug',
            ]);

        $imported = 0;
        $skipped = 0;
        $termMap = [];

        foreach ($rows as $row) {
            $type = self::TAXONOMY_MAP[$row->taxonomy];
            [$key, $label] = $this->normaliseTerm($row->taxonomy, (string) $row->name, (string) $row->slug);

            if ($key === '' || $label === '') { $skipped++; continue; }

            $term = TaxonomyTerm::firstOrNew(['type' => $type, 'key' => $key]);
            $term->label = $term->label ?: $label;
            $term->is_active = true;
            $term->wp_term_id = $term->wp_term_id ?: (int) $row->term_id;
            $term->save();

            $termMap[(int) $row->term_id] = ['type' => $type, 'key' => $key, 'label' => $label];
            $imported++;
        }

        // Houzez also treats listing_status implicitly (status === sold/pending).
        // Make sure the four canonical listing_status terms exist.
        foreach ([
            ['for_sale', 'Active (For Sale)'],
            ['pending', 'Pending (Under Contract)'],
            ['sold', 'Sold'],
            ['inactive', 'Inactive (Off-Market)'],
        ] as [$key, $label]) {
            TaxonomyTerm::firstOrCreate(
                ['type' => TaxonomyTerm::TYPE_LISTING_STATUS, 'key' => $key],
                ['label' => $label, 'is_active' => true]
            );
        }

        TaxonomyTerm::clearCache();
        return ['imported' => $imported, 'skipped' => $skipped, 'term_map' => $termMap];
    }

    /** @return array{0:string,1:string} [key, label] */
    private function normaliseTerm(string $taxonomy, string $name, string $slug): array
    {
        $name = trim($name);
        $lower = strtolower($name);

        if ($taxonomy === 'property_status') {
            $key = self::TRANSACTION_KEY_MAP[$lower] ?? Str::slug($name, '_');
            return [$key, $name];
        }
        if ($taxonomy === 'property_type') {
            $key = self::PROPERTY_TYPE_KEY_MAP[$lower] ?? Str::slug($name);
            return [$key, $name];
        }
        // property_label
        $key = Str::slug($name, '_');
        return [$key, $name];
    }

    /**
     * Build the term map again (without writing anything) — used by the
     * property importer when taxonomies were imported in a previous run.
     *
     * @return array<int,array{type:string,key:string,label:string}>
     */
    public function loadTermMap(): array
    {
        $rows = HouzezDb::table('term_taxonomy')
            ->join('wp_terms', 'wp_term_taxonomy.term_id', '=', 'wp_terms.term_id')
            ->whereIn('wp_term_taxonomy.taxonomy', array_keys(self::TAXONOMY_MAP))
            ->get(['wp_term_taxonomy.term_id', 'wp_term_taxonomy.taxonomy', 'wp_terms.name', 'wp_terms.slug']);

        $map = [];
        foreach ($rows as $row) {
            [$key, $label] = $this->normaliseTerm($row->taxonomy, (string) $row->name, (string) $row->slug);
            $map[(int) $row->term_id] = [
                'type' => self::TAXONOMY_MAP[$row->taxonomy],
                'key' => $key,
                'label' => $label,
            ];
        }
        return $map;
    }
}

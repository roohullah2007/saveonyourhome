<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ZillowApiService
{
    protected string $apiKey;
    protected string $apiHost;
    protected string $imagesHost;
    protected int $maxRetries = 3;

    public function __construct()
    {
        $this->apiKey = config('services.zillow_rapidapi.key', '');
        $this->apiHost = config('services.zillow_rapidapi.host', 'real-estate101.p.rapidapi.com');
        $this->imagesHost = config('services.zillow_rapidapi.images_host', 'zillow-com1.p.rapidapi.com');
    }

    /**
     * Make an API request with retry logic for 429 rate limits.
     */
    protected function requestWithRetry(string $host, string $url, array $params, int $timeout = 30): ?\Illuminate\Http\Client\Response
    {
        $attempt = 0;

        while ($attempt < $this->maxRetries) {
            $response = Http::withHeaders([
                'x-rapidapi-host' => $host,
                'x-rapidapi-key' => $this->apiKey,
            ])->timeout($timeout)->get($url, $params);

            if ($response->status() !== 429) {
                return $response;
            }

            $attempt++;
            if ($attempt < $this->maxRetries) {
                // Exponential backoff: 2s, 4s
                $wait = pow(2, $attempt);
                Log::info("Zillow API rate limited (429), retrying in {$wait}s (attempt {$attempt}/{$this->maxRetries})");
                sleep($wait);
            }
        }

        // All retries exhausted, return the last 429 response
        return $response;
    }

    /**
     * Check if the API is configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->apiKey);
    }

    /**
     * Search by location using /api/search/byurl endpoint with constructed Zillow URLs.
     */
    public function searchByLocation(string $location, int $page = 1, string $listingType = 'fsbo', ?int $minPrice = null, ?int $maxPrice = null): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'Zillow API not configured'];
        }

        try {
            $zillowUrl = $this->buildZillowSearchUrl($location, $listingType, $minPrice, $maxPrice);

            $response = $this->requestWithRetry(
                $this->apiHost,
                "https://{$this->apiHost}/api/search/byurl",
                ['url' => $zillowUrl, 'page' => $page],
                30
            );

            if ($response->failed()) {
                $body = $response->json();
                $status = $response->status();

                if ($status === 404 && str_contains($body['message'] ?? $body['error'] ?? '', "doesn't exists")) {
                    $error = 'Zillow API subscription expired or not active. Please re-subscribe to the Zillow API on RapidAPI.';
                } elseif ($status === 429) {
                    $error = 'Rate limited by Zillow API. Please wait a moment and try again.';
                } elseif ($status === 403) {
                    $error = 'Zillow API access denied. Please check your RapidAPI key and subscription.';
                } elseif ($status === 400) {
                    $error = $body['error'] ?? 'Invalid search. Please try a different location.';
                } else {
                    $error = $body['message'] ?? $body['error'] ?? 'API request failed (HTTP ' . $status . ')';
                }

                Log::warning("Zillow search failed: HTTP {$status} - {$error}");
                return [
                    'success' => false,
                    'error' => $error,
                ];
            }

            $data = $response->json();

            if (!($data['success'] ?? true) && isset($data['error'])) {
                return [
                    'success' => false,
                    'error' => $data['error'],
                ];
            }

            $results = $this->normalizeResults($data['results'] ?? []);

            // When searching by a specific zip code, filter out results from other zip codes.
            // The Zillow API uses viewport bounds (a geographic bounding box) which can overlap
            // into neighboring zip codes, so we need to enforce strict zip code matching.
            $trimmedLocation = trim($location);
            if (preg_match('/^\d{5}$/', $trimmedLocation)) {
                $results = array_values(array_filter($results, function ($listing) use ($trimmedLocation) {
                    return ($listing['zip_code'] ?? '') === $trimmedLocation;
                }));
            }

            return [
                'success' => true,
                'totalCount' => count($results),
                'currentPage' => (int) ($data['currentPage'] ?? $page),
                'results' => $results,
            ];
        } catch (\Exception $e) {
            Log::error('Zillow API error: ' . $e->getMessage());
            return ['success' => false, 'error' => 'API connection error: ' . $e->getMessage()];
        }
    }

    /**
     * Build a Zillow search URL with filters for the byurl endpoint.
     */
    protected function buildZillowSearchUrl(string $location, string $listingType, ?int $minPrice, ?int $maxPrice): string
    {
        // Convert location to URL slug
        $slug = $this->locationToSlug($location);

        // Build filterState
        $filterState = [
            'sort' => ['value' => 'globalrelevanceex'],
        ];

        if ($listingType === 'fsbo') {
            $filterState['fsbo'] = ['value' => true];
            $filterState['isForSaleByAgent'] = ['value' => false];
            $filterState['isNewConstruction'] = ['value' => false];
            $filterState['isAuction'] = ['value' => false];
            $filterState['isComingSoon'] = ['value' => false];
            $filterState['isForSaleForeclosure'] = ['value' => false];
        }

        if ($minPrice || $maxPrice) {
            $price = [];
            if ($minPrice) $price['min'] = $minPrice;
            if ($maxPrice) $price['max'] = $maxPrice;
            $filterState['price'] = $price;
        }

        $searchQueryState = [
            'isMapVisible' => true,
            'isListVisible' => true,
            'usersSearchTerm' => $location,
            'filterState' => $filterState,
        ];

        // Get viewport bounds via geocoding - required by the API
        $bounds = GeocodingService::getViewportBounds($location);
        if ($bounds) {
            $searchQueryState['mapBounds'] = $bounds;
        }

        // The API requires the listing type in the URL path (e.g., /tulsa-ok/fsbo/)
        $typePath = $listingType === 'fsbo' ? 'fsbo/' : '';

        return 'https://www.zillow.com/' . $slug . '/' . $typePath . '?searchQueryState=' . json_encode($searchQueryState);
    }

    /**
     * Convert a user location input to a Zillow URL slug.
     * Examples: "Tulsa, OK" => "tulsa-ok", "74105" => "74105", "Oklahoma" => "ok"
     */
    protected function locationToSlug(string $location): string
    {
        $location = trim($location);

        // If it's a zip code, use as-is
        if (preg_match('/^\d{5}$/', $location)) {
            return $location;
        }

        // State name to abbreviation mapping
        $states = [
            'oklahoma' => 'ok', 'texas' => 'tx', 'kansas' => 'ks', 'arkansas' => 'ar',
            'missouri' => 'mo', 'colorado' => 'co', 'new mexico' => 'nm', 'nebraska' => 'ne',
            'california' => 'ca', 'florida' => 'fl', 'new york' => 'ny', 'georgia' => 'ga',
        ];

        $lower = strtolower($location);

        // If it's a full state name, return abbreviation
        if (isset($states[$lower])) {
            return $states[$lower];
        }

        // Convert "City, ST" to "city-st" slug
        $slug = strtolower($location);
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/\s+/', '-', trim($slug));

        return $slug;
    }

    /**
     * Fetch property details (images + contact info) by zpid using zillow-com1 API.
     * Returns ['images' => [...], 'contact' => ['name' => ..., 'phone' => ..., 'email' => ...]].
     */
    public function fetchPropertyDetails(string $zpid): array
    {
        $empty = ['images' => [], 'contact' => ['name' => '', 'phone' => '', 'email' => '']];

        if (!$this->isConfigured()) {
            return $empty;
        }

        try {
            $response = $this->requestWithRetry(
                $this->imagesHost,
                "https://{$this->imagesHost}/property",
                ['zpid' => $zpid],
                15
            );

            if ($response->failed()) {
                $status = $response->status();
                $body = $response->json();
                if ($status === 404 && str_contains($body['message'] ?? '', "doesn't exists")) {
                    Log::error("Zillow API subscription expired - /property returned 404");
                } else {
                    Log::warning("Zillow /property API failed for zpid {$zpid}: HTTP {$status}");
                }
                return $empty;
            }

            $data = $response->json();
            if (!$data) {
                Log::warning("Zillow /property API returned empty response for zpid {$zpid}");
                return $empty;
            }

            $images = $this->extractImages($data);
            Log::info("Zillow /property for zpid {$zpid}: extracted " . count($images) . " images");

            return [
                'images' => $images,
                'contact' => $this->extractContact($data),
            ];
        } catch (\Exception $e) {
            Log::warning("Zillow property API error for zpid {$zpid}: " . $e->getMessage());
            return $empty;
        }
    }

    /**
     * Scrape all property images from a Zillow listing page using Puppeteer with stealth mode.
     * Calls a Node.js script that uses a real Chrome browser to bypass PerimeterX bot detection.
     * Returns array of hi-res image URLs (cc_ft_1536.jpg format, ~1536px wide).
     */
    public function scrapePropertyImages(string $detailUrl): array
    {
        try {
            // Ensure full URL
            if (!str_starts_with($detailUrl, 'http')) {
                $detailUrl = "https://www.zillow.com{$detailUrl}";
            }

            $scriptPath = base_path('scripts/scrape-zillow-images.cjs');
            if (!file_exists($scriptPath)) {
                Log::warning("Zillow scraper script not found at {$scriptPath}");
                return [];
            }

            $escapedUrl = escapeshellarg($detailUrl);
            $scriptPathNormalized = str_replace('\\', '/', $scriptPath);
            $command = 'node "' . $scriptPathNormalized . '" ' . $escapedUrl . ' 2>&1';

            Log::info("Scraping Zillow images from: {$detailUrl}");

            $output = null;
            $returnCode = null;
            exec($command, $output, $returnCode);

            // The last line of output is the JSON array (stdout), earlier lines are debug (stderr)
            $jsonOutput = end($output) ?: '[]';
            $images = json_decode($jsonOutput, true);

            if (!is_array($images)) {
                Log::warning("Zillow scraper returned invalid JSON for {$detailUrl}");
                return [];
            }

            Log::info("Zillow scraper for {$detailUrl}: found " . count($images) . " property photos");

            return $images;
        } catch (\Exception $e) {
            Log::warning("Zillow scrape error for {$detailUrl}: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Extract contact info from property detail response.
     * Checks attributionInfo (agent/broker) and contactRecipients.
     */
    protected function extractContact(array $data): array
    {
        $name = '';
        $phone = '';
        $email = '';

        // Try attributionInfo first (agent info — for FSBO, the "agent" is the owner)
        $attr = $data['attributionInfo'] ?? [];
        if (!empty($attr['agentName'])) {
            $name = $attr['agentName'];
        }
        if (!empty($attr['agentPhoneNumber'])) {
            $phone = $attr['agentPhoneNumber'];
        }
        if (!empty($attr['agentEmail'])) {
            $email = $attr['agentEmail'];
        }

        // Fall back to broker info if no agent info
        if (empty($name) && !empty($attr['brokerName'])) {
            $name = $attr['brokerName'];
        }
        if (empty($phone) && !empty($attr['brokerPhoneNumber'])) {
            $phone = $attr['brokerPhoneNumber'];
        }

        // Try contactRecipients array as another fallback
        $recipients = $data['contactRecipients'] ?? [];
        if (!empty($recipients) && is_array($recipients)) {
            $first = $recipients[0] ?? [];
            if (empty($name) && !empty($first['agent_reason'])) {
                // contactRecipients uses different field names
                $name = $first['display_name'] ?? $first['full_name'] ?? '';
            } elseif (empty($name)) {
                $name = $first['display_name'] ?? $first['full_name'] ?? '';
            }
            if (empty($phone) && !empty($first['phone'])) {
                $phone = is_array($first['phone']) ? ($first['phone']['areacode'] ?? '') . ($first['phone']['number'] ?? '') : $first['phone'];
            }
            if (empty($email) && !empty($first['email'])) {
                $email = $first['email'];
            }
        }

        // Also check top-level listing fields
        if (empty($name) && !empty($data['listingAgent']['name'])) {
            $name = $data['listingAgent']['name'];
        }
        if (empty($phone) && !empty($data['listingAgent']['phone'])) {
            $phone = $data['listingAgent']['phone'];
        }

        return [
            'name' => trim($name),
            'phone' => trim($phone),
            'email' => trim($email),
        ];
    }

    /**
     * Extract all image URLs from a property detail response.
     * Handles various response structures from different zillow-com1 endpoints.
     */
    protected function extractImages(array $data): array
    {
        $images = [];

        // Try common image fields from zillow-com1 API
        if (!empty($data['responsivePhotos'])) {
            foreach ($data['responsivePhotos'] as $photo) {
                // Each responsive photo has multiple sizes, get the largest
                if (!empty($photo['mixedSources']['jpeg'])) {
                    $jpegs = $photo['mixedSources']['jpeg'];
                    // Sort by width descending to get largest
                    usort($jpegs, fn($a, $b) => ($b['width'] ?? 0) - ($a['width'] ?? 0));
                    if (!empty($jpegs[0]['url'])) {
                        $images[] = $jpegs[0]['url'];
                    }
                } elseif (!empty($photo['url'])) {
                    $images[] = $photo['url'];
                }
            }
        }

        if (empty($images) && !empty($data['photos'])) {
            foreach ($data['photos'] as $photo) {
                if (is_string($photo)) {
                    $images[] = $photo;
                } elseif (!empty($photo['url'])) {
                    $images[] = $photo['url'];
                } elseif (!empty($photo['mixedSources']['jpeg'])) {
                    // Get largest JPEG like we do for responsivePhotos
                    $jpegs = $photo['mixedSources']['jpeg'];
                    usort($jpegs, fn($a, $b) => ($b['width'] ?? 0) - ($a['width'] ?? 0));
                    if (!empty($jpegs[0]['url'])) {
                        $images[] = $jpegs[0]['url'];
                    }
                } elseif (!empty($photo['mixedSources']['jpeg'][0]['url'])) {
                    $images[] = $photo['mixedSources']['jpeg'][0]['url'];
                }
            }
        }

        if (empty($images) && !empty($data['originalPhotos'])) {
            foreach ($data['originalPhotos'] as $photo) {
                if (is_string($photo)) {
                    $images[] = $photo;
                } elseif (!empty($photo['url'])) {
                    $images[] = $photo['url'];
                } elseif (!empty($photo['mixedSources']['jpeg'])) {
                    $jpegs = $photo['mixedSources']['jpeg'];
                    usort($jpegs, fn($a, $b) => ($b['width'] ?? 0) - ($a['width'] ?? 0));
                    if (!empty($jpegs[0]['url'])) {
                        $images[] = $jpegs[0]['url'];
                    }
                }
            }
        }

        if (empty($images) && !empty($data['hugePhotos'])) {
            foreach ($data['hugePhotos'] as $photo) {
                if (is_string($photo)) {
                    $images[] = $photo;
                } elseif (!empty($photo['url'])) {
                    $images[] = $photo['url'];
                }
            }
        }

        // Try 'images' array (common in /images endpoint response)
        if (empty($images) && !empty($data['images'])) {
            foreach ($data['images'] as $img) {
                if (is_string($img)) {
                    $images[] = $img;
                } elseif (is_array($img) && !empty($img['url'])) {
                    $images[] = $img['url'];
                }
            }
        }

        // Fall back to imgSrc if nothing else found
        if (empty($images) && !empty($data['imgSrc'])) {
            $images[] = $data['imgSrc'];
        }

        return array_values(array_unique($images));
    }

    /**
     * Upgrade a Zillow thumbnail URL to high resolution.
     * Converts -p_e.jpg (thumbnail) to -uncropped_scaled_within_1344_1008.jpg (hi-res).
     */
    public static function upgradeImageUrl(?string $url): ?string
    {
        if (!$url) {
            return null;
        }

        // Replace thumbnail suffix with high-res suffix
        return preg_replace(
            '/-p_[a-e]\.jpg$/i',
            '-uncropped_scaled_within_1344_1008.jpg',
            $url
        );
    }

    /**
     * Normalize Zillow API results into a consistent format for our import system.
     */
    protected function normalizeResults(array $results): array
    {
        return array_map(function ($listing) {
            $address = $listing['address'] ?? [];

            return [
                'zillow_id' => $listing['id'] ?? null,
                'address' => $address['street'] ?? '',
                'city' => $address['city'] ?? '',
                'state' => $address['state'] ?? 'OK',
                'zip_code' => $address['zipcode'] ?? '',
                'price' => $listing['unformattedPrice'] ?? 0,
                'price_formatted' => $listing['price'] ?? '',
                'bedrooms' => $listing['beds'] ?? 0,
                'bathrooms' => $listing['baths'] ?? 0,
                'sqft' => $listing['area'] ?? $listing['livingArea'] ?? 0,
                'property_type' => $this->mapHomeType($listing['homeType'] ?? ''),
                'home_type_raw' => $listing['homeType'] ?? '',
                'latitude' => $listing['latLong']['latitude'] ?? null,
                'longitude' => $listing['latLong']['longitude'] ?? null,
                'image_url' => $listing['imgSrc'] ?? null,
                'zillow_url' => $listing['detailUrl'] ?? null,
                'days_on_zillow' => $listing['daysOnZillow'] ?? null,
                'zestimate' => $listing['zestimate'] ?? null,
                'lot_size' => $listing['lotAreaValue'] ?? null,
                'lot_size_unit' => $listing['lotAreaUnit'] ?? null,
                'status_text' => $listing['statusText'] ?? '',
                'is_fsbo' => ($listing['listingSubType']['is_FSBO'] ?? false),
            ];
        }, $results);
    }

    /**
     * Map Zillow homeType to our property_type values.
     */
    protected function mapHomeType(string $homeType): string
    {
        return match (strtoupper($homeType)) {
            'SINGLE_FAMILY' => 'single_family',
            'CONDO' => 'condo',
            'TOWNHOUSE' => 'townhouse',
            'MULTI_FAMILY' => 'multi_family',
            'LOT', 'LAND' => 'land',
            'MANUFACTURED', 'MOBILE' => 'mobile_home',
            default => 'single_family',
        };
    }
}

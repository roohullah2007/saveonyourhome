<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Powers the "What's Nearby?" (Yelp Fusion) and Walkscore cards on the
 * listing detail page. Both endpoints are public — only the property id /
 * slug is used, and the API keys stay server-side.
 *
 * Responses are cached per property for 24 hours so repeat visitors (and
 * random bots) don't burn through the Yelp / Walkscore free tier.
 */
class PropertyNearbyController extends Controller
{
    private const CACHE_TTL = 60 * 60 * 24; // 24h
    private const YELP_RADIUS_METERS = 1600; // ~1 mile

    /**
     * Category buckets displayed on the page. Keys are the Yelp `categories`
     * filter values; display labels are the section headers.
     */
    private const YELP_BUCKETS = [
        'education'  => ['label' => 'Education',       'icon' => 'graduation-cap'],
        'health'     => ['label' => 'Health & Medical', 'icon' => 'briefcase-medical'],
        'restaurants'=> ['label' => 'Restaurants',     'icon' => 'utensils'],
        'grocery'    => ['label' => 'Grocery',         'icon' => 'shopping-basket'],
        'shopping'   => ['label' => 'Shopping',        'icon' => 'shopping-bag'],
        'active'     => ['label' => 'Active Life',     'icon' => 'tree'],
    ];

    public function nearby(Property $property): JsonResponse
    {
        if (!$property->latitude || !$property->longitude) {
            return response()->json(['error' => 'Property has no coordinates'], 422);
        }

        $apiKey = config('services.yelp.api_key');

        // No Yelp key configured? Fall back to OpenStreetMap Overpass so the
        // "What's Nearby" card still populates instead of disappearing.
        if (empty($apiKey)) {
            $osm = Cache::remember("nearby:osm:{$property->id}", self::CACHE_TTL, function () use ($property) {
                return $this->osmNearby((float) $property->latitude, (float) $property->longitude);
            });
            return response()->json(['categories' => $osm, 'source' => 'osm']);
        }

        $data = Cache::remember("nearby:prop:{$property->id}", self::CACHE_TTL, function () use ($property, $apiKey) {
            $lat = (float) $property->latitude;
            $lng = (float) $property->longitude;
            $result = [];

            foreach (self::YELP_BUCKETS as $categoryKey => $meta) {
                try {
                    $resp = Http::withToken($apiKey)
                        ->timeout(6)
                        ->get('https://api.yelp.com/v3/businesses/search', [
                            'latitude' => $lat,
                            'longitude' => $lng,
                            'categories' => $categoryKey,
                            'radius' => self::YELP_RADIUS_METERS,
                            'limit' => 5,
                            'sort_by' => 'distance',
                        ]);
                    if (!$resp->successful()) {
                        Log::warning('Yelp request failed', ['status' => $resp->status(), 'body' => $resp->body()]);
                        $result[$categoryKey] = ['label' => $meta['label'], 'icon' => $meta['icon'], 'items' => []];
                        continue;
                    }
                    $businesses = collect($resp->json('businesses') ?? [])
                        ->map(fn ($b) => [
                            'id' => $b['id'] ?? null,
                            'name' => $b['name'] ?? '',
                            'rating' => $b['rating'] ?? null,
                            'review_count' => $b['review_count'] ?? 0,
                            'url' => $b['url'] ?? null,
                            // Yelp gives distance in meters; convert to miles.
                            'miles' => isset($b['distance']) ? round($b['distance'] / 1609.344, 2) : null,
                        ])
                        ->all();
                    $result[$categoryKey] = ['label' => $meta['label'], 'icon' => $meta['icon'], 'items' => $businesses];
                } catch (\Throwable $e) {
                    Log::warning('Yelp call threw', ['err' => $e->getMessage()]);
                    $result[$categoryKey] = ['label' => $meta['label'], 'icon' => $meta['icon'], 'items' => []];
                }
            }
            return $result;
        });

        return response()->json(['categories' => $data, 'source' => 'yelp']);
    }

    /**
     * OSM Overpass fallback for nearby businesses when no Yelp key is set.
     * Returns the same {label, icon, items[]} shape so the UI doesn't care
     * which provider answered.
     */
    private function osmNearby(float $lat, float $lng): array
    {
        $r = 1600; // ~1 mile, matches Yelp default
        $defs = [
            'education'   => ['Education',       'graduation-cap',     '"amenity"~"school|university|college|library|kindergarten"'],
            'health'      => ['Health & Medical', 'briefcase-medical', '"amenity"~"hospital|clinic|doctors|pharmacy|dentist"'],
            'restaurants' => ['Restaurants',      'utensils',          '"amenity"~"restaurant|cafe|fast_food|bar|pub"'],
            'grocery'     => ['Grocery',          'shopping-basket',   '"shop"~"supermarket|convenience|greengrocer|butcher|bakery"'],
            'shopping'    => ['Shopping',         'shopping-bag',      '"shop"~"mall|department_store|clothes|electronics|hardware"'],
            'active'      => ['Active Life',      'tree',              '"leisure"~"park|fitness_centre|sports_centre|swimming_pool|playground"'],
        ];

        $result = [];
        foreach ($defs as $key => [$label, $icon, $filter]) {
            $query = "[out:json][timeout:10];(node[{$filter}](around:{$r},{$lat},{$lng}););out tags center 8;";
            try {
                $resp = Http::asForm()->timeout(12)->post('https://overpass-api.de/api/interpreter', ['data' => $query]);
                if (!$resp->successful()) {
                    Log::info('Overpass nearby non-200', ['status' => $resp->status(), 'cat' => $key]);
                    $result[$key] = ['label' => $label, 'icon' => $icon, 'items' => []];
                    continue;
                }
                $items = collect($resp->json('elements') ?? [])
                    ->filter(fn ($el) => !empty($el['tags']['name']))
                    ->map(function ($el) use ($lat, $lng) {
                        $elat = $el['lat'] ?? ($el['center']['lat'] ?? null);
                        $elng = $el['lon'] ?? ($el['center']['lon'] ?? null);
                        $miles = null;
                        if ($elat !== null && $elng !== null) {
                            // Equirectangular approximation — plenty accurate for ~1 mile.
                            $dx = ($elng - $lng) * cos(deg2rad($lat)) * 69;
                            $dy = ($elat - $lat) * 69;
                            $miles = round(sqrt($dx * $dx + $dy * $dy), 2);
                        }
                        return [
                            'id' => $el['id'] ?? null,
                            'name' => $el['tags']['name'],
                            'rating' => null,
                            'review_count' => 0,
                            'url' => null,
                            'miles' => $miles,
                        ];
                    })
                    ->sortBy(fn ($i) => $i['miles'] ?? PHP_INT_MAX)
                    ->take(5)
                    ->values()
                    ->all();
                $result[$key] = ['label' => $label, 'icon' => $icon, 'items' => $items];
            } catch (\Throwable $e) {
                Log::warning('Overpass nearby threw', ['err' => $e->getMessage(), 'cat' => $key]);
                $result[$key] = ['label' => $label, 'icon' => $icon, 'items' => []];
            }
        }
        return $result;
    }

    public function walkscore(Property $property): JsonResponse
    {
        if (!$property->latitude || !$property->longitude) {
            return response()->json(['error' => 'Property has no coordinates'], 422);
        }

        $apiKey = config('services.walkscore.api_key');
        if (empty($apiKey)) {
            return response()->json(['error' => 'Walkscore API key not configured'], 503);
        }

        $data = Cache::remember("walkscore:prop:{$property->id}", self::CACHE_TTL, function () use ($property, $apiKey) {
            try {
                $address = trim(implode(', ', array_filter([
                    $property->address,
                    $property->city,
                    $property->state,
                    $property->zip_code,
                ])));

                $resp = Http::timeout(6)->get('https://api.walkscore.com/score', [
                    'format' => 'json',
                    'address' => $address,
                    'lat' => (float) $property->latitude,
                    'lon' => (float) $property->longitude,
                    'transit' => 1,
                    'bike' => 1,
                    'wsapikey' => $apiKey,
                ]);

                if (!$resp->successful()) {
                    Log::warning('Walkscore request failed', ['status' => $resp->status(), 'body' => $resp->body()]);
                    return null;
                }

                $json = $resp->json();
                // status 1 = success; anything else = no data available
                if (($json['status'] ?? null) !== 1) {
                    return null;
                }

                return [
                    'address' => $address,
                    'walk' => [
                        'score' => $json['walkscore'] ?? null,
                        'description' => $json['description'] ?? null,
                    ],
                    'bike' => [
                        'score' => $json['bike']['score'] ?? null,
                        'description' => $json['bike']['description'] ?? null,
                    ],
                    'transit' => [
                        'score' => $json['transit']['score'] ?? null,
                        'description' => $json['transit']['description'] ?? null,
                        'summary' => $json['transit']['summary'] ?? null,
                    ],
                ];
            } catch (\Throwable $e) {
                Log::warning('Walkscore call threw', ['err' => $e->getMessage()]);
                return null;
            }
        });

        if ($data === null) {
            return response()->json(['error' => 'Walkscore unavailable for this address'], 503);
        }

        return response()->json($data);
    }
}

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
                $resp = Http::withHeaders([
                        'User-Agent' => 'saveonyourhome.com/1.0',
                        'Accept' => '*/*',
                    ])->asForm()->timeout(12)->post('https://overpass-api.de/api/interpreter', ['data' => $query]);
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

    /**
     * Nearby schools within ~10 km of the property, powered by Google
     * Places (legacy Nearby Search). Falls back to OpenStreetMap
     * Overpass (amenity=school) when no Maps API key is configured or
     * the upstream call fails so the section still populates.
     */
    public function schools(Property $property): JsonResponse
    {
        if (!$property->latitude || !$property->longitude) {
            return response()->json(['error' => 'Property has no coordinates'], 422);
        }

        $lat = (float) $property->latitude;
        $lng = (float) $property->longitude;
        $radiusMeters = 10000; // 10 km

        $apiKey = config('services.google.maps_api_key');

        $items = Cache::remember("schools:prop:{$property->id}", self::CACHE_TTL, function () use ($lat, $lng, $radiusMeters, $apiKey) {
            $results = [];

            // Try Google Places first if a key is configured.
            if (!empty($apiKey)) {
                try {
                    $resp = Http::timeout(8)->get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', [
                        'location' => "{$lat},{$lng}",
                        'radius' => $radiusMeters,
                        'type' => 'school',
                        'key' => $apiKey,
                    ]);
                    if ($resp->successful() && in_array($resp->json('status'), ['OK', 'ZERO_RESULTS'], true)) {
                        $results = collect($resp->json('results') ?? [])
                            ->map(function ($p) use ($lat, $lng) {
                                $plat = $p['geometry']['location']['lat'] ?? null;
                                $plng = $p['geometry']['location']['lng'] ?? null;
                                return [
                                    'id' => $p['place_id'] ?? null,
                                    'name' => $p['name'] ?? '',
                                    'address' => $p['vicinity'] ?? '',
                                    'rating' => $p['rating'] ?? null,
                                    'review_count' => $p['user_ratings_total'] ?? 0,
                                    'lat' => $plat,
                                    'lng' => $plng,
                                    'meters' => ($plat !== null && $plng !== null)
                                        ? self::haversineMeters($lat, $lng, $plat, $plng)
                                        : null,
                                    'maps_url' => isset($p['place_id'])
                                        ? 'https://www.google.com/maps/place/?q=place_id:' . $p['place_id']
                                        : null,
                                    'icon' => $p['icon'] ?? null,
                                ];
                            })
                            ->filter(fn ($s) => !empty($s['name']))
                            ->sortBy('meters')
                            ->take(20)
                            ->values()
                            ->all();
                        return [
                            'source' => 'google',
                            'items' => $results,
                        ];
                    }
                    Log::info('Google Places schools non-OK', ['status' => $resp->status(), 'apiStatus' => $resp->json('status'), 'body' => $resp->body()]);
                } catch (\Throwable $e) {
                    Log::warning('Google Places schools threw', ['err' => $e->getMessage()]);
                }
            }

            // Overpass fallback — broader school amenity classes.
            try {
                $query = "[out:json][timeout:10];(node[\"amenity\"~\"school|college|university|kindergarten\"](around:{$radiusMeters},{$lat},{$lng});way[\"amenity\"~\"school|college|university|kindergarten\"](around:{$radiusMeters},{$lat},{$lng}););out center 25;";
                // Overpass returns 406 Not Acceptable if the default
                // Accept header is application/json — the public servers
                // expect a more permissive accept type. Same for missing
                // User-Agent (rate-limiter throttles defaultless clients).
                $resp = Http::withHeaders([
                    'User-Agent' => 'saveonyourhome.com/1.0',
                    'Accept' => '*/*',
                ])->timeout(15)->asForm()->post('https://overpass-api.de/api/interpreter', ['data' => $query]);
                if ($resp->successful()) {
                    $elements = $resp->json('elements') ?? [];
                    $items = [];
                    foreach ($elements as $el) {
                        $name = $el['tags']['name'] ?? null;
                        if (!$name) continue;
                        $plat = $el['lat'] ?? ($el['center']['lat'] ?? null);
                        $plng = $el['lon'] ?? ($el['center']['lon'] ?? null);
                        if ($plat === null || $plng === null) continue;
                        $items[] = [
                            'id' => 'osm-' . ($el['id'] ?? uniqid()),
                            'name' => $name,
                            'address' => $el['tags']['addr:street'] ?? '',
                            'rating' => null,
                            'review_count' => 0,
                            'lat' => $plat,
                            'lng' => $plng,
                            'meters' => self::haversineMeters($lat, $lng, $plat, $plng),
                            'maps_url' => "https://www.google.com/maps/search/?api=1&query={$plat},{$plng}",
                            'icon' => null,
                        ];
                    }
                    usort($items, fn ($a, $b) => ($a['meters'] ?? PHP_INT_MAX) <=> ($b['meters'] ?? PHP_INT_MAX));
                    return [
                        'source' => 'osm',
                        'items' => array_slice($items, 0, 20),
                    ];
                }
            } catch (\Throwable $e) {
                Log::warning('Overpass schools threw', ['err' => $e->getMessage()]);
            }

            return ['source' => 'none', 'items' => []];
        });

        return response()->json([
            'radius_km' => 10,
            'source' => $items['source'] ?? 'none',
            'items' => $items['items'] ?? [],
        ]);
    }

    /**
     * Great-circle distance between two lat/lng points in meters.
     */
    private static function haversineMeters(float $lat1, float $lng1, float $lat2, float $lng2): int
    {
        $earth = 6371000.0;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return (int) round($earth * $c);
    }
}

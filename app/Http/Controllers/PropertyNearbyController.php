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
        if (empty($apiKey)) {
            return response()->json(['error' => 'Yelp API key not configured'], 503);
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

        return response()->json(['categories' => $data]);
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

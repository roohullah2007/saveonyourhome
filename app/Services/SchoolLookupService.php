<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Looks up nearby schools by lat/lng using the free OpenStreetMap Overpass API.
 * No API key required; results are best-effort and categorized into elementary
 * / middle / high based on the isced:level tag and name keywords.
 *
 * Always returns an array (possibly empty for any field). Never throws so the
 * listing form auto-fill flow keeps moving even when Overpass is slow/down.
 */
class SchoolLookupService
{
    private const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
    private const SEARCH_RADIUS_METERS = 8000; // ~5 miles

    /**
     * @return array{
     *   schoolDistrict?: string,
     *   gradeSchool?: string,
     *   middleSchool?: string,
     *   highSchool?: string
     * }
     */
    public function lookup(?float $latitude, ?float $longitude): array
    {
        if ($latitude === null || $longitude === null) {
            return [];
        }

        $query = <<<QL
            [out:json][timeout:15];
            (
              node["amenity"="school"](around:%d,%F,%F);
              way["amenity"="school"](around:%d,%F,%F);
              relation["amenity"="school"](around:%d,%F,%F);
            );
            out tags center;
        QL;
        $r = self::SEARCH_RADIUS_METERS;
        $body = sprintf($query, $r, $latitude, $longitude, $r, $latitude, $longitude, $r, $latitude, $longitude);

        try {
            $response = Http::asForm()
                ->timeout(15)
                ->post(self::OVERPASS_URL, ['data' => $body]);

            if (!$response->successful()) {
                Log::info('Overpass schools lookup non-200', [
                    'status' => $response->status(),
                ]);
                return [];
            }

            $elements = $response->json('elements') ?? [];
        } catch (\Throwable $e) {
            Log::warning('Overpass schools lookup threw', ['error' => $e->getMessage()]);
            return [];
        }

        $byLevel = [
            'elementary' => null,
            'middle' => null,
            'high' => null,
        ];
        $district = null;

        foreach ($elements as $el) {
            $tags = $el['tags'] ?? [];
            $name = trim((string) ($tags['name'] ?? ''));
            if ($name === '') {
                continue;
            }

            // Pull district from operator/operator:type (best signal we have).
            if ($district === null) {
                $op = $tags['operator'] ?? null;
                if (is_string($op) && $op !== '' && stripos($op, 'school') !== false) {
                    $district = $op;
                }
            }

            $level = $this->classifyLevel($tags, $name);
            if ($level && $byLevel[$level] === null) {
                $byLevel[$level] = $name;
            }
        }

        $result = [];
        if ($district)              $result['schoolDistrict'] = $district;
        if ($byLevel['elementary']) $result['gradeSchool']    = $byLevel['elementary'];
        if ($byLevel['middle'])     $result['middleSchool']   = $byLevel['middle'];
        if ($byLevel['high'])       $result['highSchool']     = $byLevel['high'];

        return $result;
    }

    /**
     * Best-effort classification of an OSM school node into elementary / middle
     * / high. Tries the standardized isced:level tag first, then min_age /
     * max_age, then name keywords as a final fallback.
     */
    private function classifyLevel(array $tags, string $name): ?string
    {
        $isced = (string) ($tags['isced:level'] ?? '');
        if ($isced !== '') {
            // ISCED levels: 0=pre, 1=primary, 2=lower secondary, 3=upper secondary
            if (str_contains($isced, '1'))  return 'elementary';
            if (str_contains($isced, '3'))  return 'high';
            if (str_contains($isced, '2'))  return 'middle';
        }

        $maxAge = isset($tags['max_age']) ? (int) $tags['max_age'] : null;
        $minAge = isset($tags['min_age']) ? (int) $tags['min_age'] : null;
        if ($maxAge !== null) {
            if ($maxAge <= 11)               return 'elementary';
            if ($maxAge >= 17)               return 'high';
            if ($maxAge >= 13 && $maxAge <= 14) return 'middle';
        }
        if ($minAge !== null) {
            if ($minAge <= 5)                return 'elementary';
            if ($minAge >= 14)               return 'high';
            if ($minAge >= 11 && $minAge <= 13) return 'middle';
        }

        $lower = strtolower($name);
        if (preg_match('/\b(high\s*school|sr\.?\s*high|secondary)\b/i', $name)) return 'high';
        if (preg_match('/\b(middle\s*school|jr\.?\s*high|junior\s*high|intermediate)\b/i', $name)) return 'middle';
        if (preg_match('/\b(elementary|primary|grade\s*school|k-?6|k-?5|k-?8)\b/i', $name)) return 'elementary';
        // Generic "School" with no other signal — skip.
        return null;
    }
}

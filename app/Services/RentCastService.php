<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Thin wrapper around the RentCast API (https://app.rentcast.io/app/api).
 * Used to auto-fill property records on the list-your-property form.
 *
 * Returns null when no key is configured or the upstream call fails so the
 * seller just types the fields manually — we never block the flow.
 */
class RentCastService
{
    public function isConfigured(): bool
    {
        return filled(config('services.rentcast.key'));
    }

    /**
     * Look up a property record by full street address. RentCast returns an
     * array of matches — we take the first. Returns the normalized payload
     * our ListProperty.jsx form expects.
     */
    public function lookupByAddress(string $address): ?array
    {
        if (!$this->isConfigured() || trim($address) === '') {
            return null;
        }

        try {
            $response = Http::withHeaders([
                'X-Api-Key' => config('services.rentcast.key'),
                'Accept' => 'application/json',
            ])
                ->timeout(20)
                ->get('https://api.rentcast.io/v1/properties', [
                    'address' => $address,
                ]);

            if (!$response->successful()) {
                Log::info('RentCast lookup non-200', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            $data = $response->json();
            // The endpoint can return either a single object or an array of matches.
            $record = is_array($data) && array_is_list($data) ? ($data[0] ?? null) : $data;
            if (!is_array($record) || empty($record)) {
                return null;
            }

            return $this->normalize($record);
        } catch (\Throwable $e) {
            Log::warning('RentCast lookup threw', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Map RentCast fields to our form field names (camelCase, matching the
     * useForm state on ListProperty.jsx).
     */
    protected function normalize(array $r): array
    {
        // RentCast property types: "Single Family", "Condo", "Townhouse",
        // "Multi-Family", "Manufactured", "Land", "Apartment" etc.
        $typeMap = [
            'single family' => 'single-family-home',
            'condo' => 'condos-townhomes-co-ops',
            'townhouse' => 'condos-townhomes-co-ops',
            'co-op' => 'condos-townhomes-co-ops',
            'multi-family' => 'multi-family',
            'multi family' => 'multi-family',
            'land' => 'land',
            'manufactured' => 'mfd-mobile-homes',
            'mobile' => 'mfd-mobile-homes',
            'apartment' => 'multi-family',
        ];
        $rawType = strtolower((string) ($r['propertyType'] ?? ''));
        $propertyType = $typeMap[$rawType] ?? null;

        $features = [];
        if (!empty($r['features']) && is_array($r['features'])) {
            foreach ($r['features'] as $k => $v) {
                if ($v === true || $v === 1) $features[] = $this->humanize($k);
                elseif (is_string($v) && $v !== '') $features[] = trim($v);
            }
        }

        // Latest annual property tax value, if RentCast returns a history map.
        $annualTax = null;
        if (!empty($r['propertyTaxes']) && is_array($r['propertyTaxes'])) {
            krsort($r['propertyTaxes']);
            $first = reset($r['propertyTaxes']);
            $annualTax = is_array($first) ? ($first['total'] ?? null) : $first;
        }

        // HOA fee (monthly).
        $hoaFee = null;
        $hasHoa = false;
        if (!empty($r['hoa']) && is_array($r['hoa'])) {
            $hoaFee = $r['hoa']['fee'] ?? null;
            $hasHoa = $hoaFee ? true : false;
        }

        return array_filter([
            'propertyType' => $propertyType,
            'address' => $r['addressLine1'] ?? ($r['formattedAddress'] ?? null),
            'city' => $r['city'] ?? null,
            'state' => $r['state'] ?? null,
            'zipCode' => $r['zipCode'] ?? null,
            'county' => $r['county'] ?? null,
            'latitude' => $r['latitude'] ?? null,
            'longitude' => $r['longitude'] ?? null,
            'bedrooms' => $r['bedrooms'] ?? null,
            'fullBathrooms' => isset($r['bathrooms']) ? (int) floor((float) $r['bathrooms']) : null,
            'halfBathrooms' => isset($r['bathrooms']) && fmod((float) $r['bathrooms'], 1) >= 0.5 ? 1 : 0,
            'sqft' => $r['squareFootage'] ?? null,
            'yearBuilt' => $r['yearBuilt'] ?? null,
            'lotSize' => $r['lotSize'] ?? null,
            'annualPropertyTax' => $annualTax,
            'hasHoa' => $hasHoa,
            'hoaFee' => $hoaFee,
            'features' => $features,
        ], fn ($v) => $v !== null && $v !== '');
    }

    private function humanize(string $key): string
    {
        $pretty = preg_replace('/([a-z])([A-Z])/', '$1 $2', $key);
        return ucwords(strtolower($pretty));
    }
}

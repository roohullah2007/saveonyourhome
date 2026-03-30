<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeocodingService
{
    /**
     * Geocode an address using Google Geocoding API
     *
     * @param string $address
     * @param string $city
     * @param string $state
     * @param string $zipCode
     * @return array|null Returns ['latitude' => float, 'longitude' => float] or null on failure
     */
    public static function geocode(string $address, string $city, string $state, string $zipCode): ?array
    {
        $apiKey = config('services.google.maps_api_key');

        if (empty($apiKey)) {
            Log::warning('Google Maps API key not configured');
            return self::geocodeWithNominatim($address, $city, $state, $zipCode);
        }

        try {
            $fullAddress = "{$address}, {$city}, {$state} {$zipCode}, USA";

            $response = Http::timeout(10)
                ->get('https://maps.googleapis.com/maps/api/geocode/json', [
                    'address' => $fullAddress,
                    'key' => $apiKey,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                if ($data['status'] === 'OK' && !empty($data['results'])) {
                    $location = $data['results'][0]['geometry']['location'];
                    return [
                        'latitude' => (float) $location['lat'],
                        'longitude' => (float) $location['lng'],
                    ];
                }

                Log::warning('Google Geocoding returned no results', [
                    'address' => $fullAddress,
                    'status' => $data['status'] ?? 'unknown',
                ]);

                // Fallback to Nominatim if Google fails (REQUEST_DENIED, ZERO_RESULTS, etc.)
                return self::geocodeWithNominatim($address, $city, $state, $zipCode);
            }

            // Fallback to Nominatim on HTTP failure
            return self::geocodeWithNominatim($address, $city, $state, $zipCode);
        } catch (\Exception $e) {
            Log::error('Google Geocoding error', [
                'error' => $e->getMessage(),
                'address' => "{$address}, {$city}, {$state} {$zipCode}",
            ]);

            // Fallback to Nominatim
            return self::geocodeWithNominatim($address, $city, $state, $zipCode);
        }
    }

    /**
     * Fallback geocoding using OpenStreetMap Nominatim API (free, no API key required)
     */
    private static function geocodeWithNominatim(string $address, string $city, string $state, string $zipCode): ?array
    {
        try {
            $fullAddress = "{$address}, {$city}, {$state} {$zipCode}, USA";

            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'SaveOnYourHome/1.0 (contact@saveonyourhome.com)',
                ])
                ->get('https://nominatim.openstreetmap.org/search', [
                    'q' => $fullAddress,
                    'format' => 'json',
                    'limit' => 1,
                    'addressdetails' => 1,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                if (!empty($data) && isset($data[0]['lat']) && isset($data[0]['lon'])) {
                    return [
                        'latitude' => (float) $data[0]['lat'],
                        'longitude' => (float) $data[0]['lon'],
                    ];
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Nominatim Geocoding error', [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Reverse geocode coordinates to get address components using Google Geocoding API
     *
     * @param float $latitude
     * @param float $longitude
     * @return array|null Returns address components or null on failure
     */
    public static function reverseGeocode(float $latitude, float $longitude): ?array
    {
        $apiKey = config('services.google.maps_api_key');

        if (empty($apiKey)) {
            Log::warning('Google Maps API key not configured for reverse geocoding');
            return self::reverseGeocodeWithNominatim($latitude, $longitude);
        }

        try {
            $response = Http::timeout(10)
                ->get('https://maps.googleapis.com/maps/api/geocode/json', [
                    'latlng' => "{$latitude},{$longitude}",
                    'key' => $apiKey,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                if ($data['status'] === 'OK' && !empty($data['results'])) {
                    return self::parseGoogleAddressComponents($data['results'][0]);
                }

                Log::warning('Google Reverse Geocoding returned no results', [
                    'lat' => $latitude,
                    'lng' => $longitude,
                    'status' => $data['status'] ?? 'unknown',
                ]);

                // Fallback to Nominatim
                return self::reverseGeocodeWithNominatim($latitude, $longitude);
            }

            // Fallback to Nominatim on HTTP failure
            return self::reverseGeocodeWithNominatim($latitude, $longitude);
        } catch (\Exception $e) {
            Log::error('Google Reverse Geocoding error', [
                'error' => $e->getMessage(),
                'lat' => $latitude,
                'lng' => $longitude,
            ]);

            // Fallback to Nominatim
            return self::reverseGeocodeWithNominatim($latitude, $longitude);
        }
    }

    /**
     * Parse Google address components into a structured array
     */
    private static function parseGoogleAddressComponents(array $result): array
    {
        $address = [
            'address' => '',
            'city' => '',
            'state' => '',
            'zip_code' => '',
            'formatted_address' => $result['formatted_address'] ?? '',
        ];

        $streetNumber = '';
        $route = '';

        foreach ($result['address_components'] as $component) {
            $types = $component['types'];

            if (in_array('street_number', $types)) {
                $streetNumber = $component['long_name'];
            }
            if (in_array('route', $types)) {
                $route = $component['long_name'];
            }
            if (in_array('locality', $types)) {
                $address['city'] = $component['long_name'];
            }
            if (in_array('administrative_area_level_1', $types)) {
                $address['state'] = $component['long_name'];
            }
            if (in_array('postal_code', $types)) {
                $address['zip_code'] = $component['long_name'];
            }
        }

        // Combine street number and route
        $address['address'] = trim("{$streetNumber} {$route}");

        return $address;
    }

    /**
     * Fallback reverse geocoding using OpenStreetMap Nominatim API
     */
    private static function reverseGeocodeWithNominatim(float $latitude, float $longitude): ?array
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'SaveOnYourHome/1.0 (contact@saveonyourhome.com)',
                ])
                ->get('https://nominatim.openstreetmap.org/reverse', [
                    'lat' => $latitude,
                    'lon' => $longitude,
                    'format' => 'json',
                    'addressdetails' => 1,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                if (!empty($data) && isset($data['address'])) {
                    $addr = $data['address'];
                    $streetNumber = $addr['house_number'] ?? '';
                    $road = $addr['road'] ?? '';

                    return [
                        'address' => trim("{$streetNumber} {$road}"),
                        'city' => $addr['city'] ?? $addr['town'] ?? $addr['village'] ?? '',
                        'state' => $addr['state'] ?? '',
                        'zip_code' => $addr['postcode'] ?? '',
                        'formatted_address' => $data['display_name'] ?? '',
                    ];
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Nominatim Reverse Geocoding error', [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Geocode a location string and return viewport bounds (for Zillow search).
     * Returns ['north' => float, 'south' => float, 'east' => float, 'west' => float] or null.
     */
    public static function getViewportBounds(string $location): ?array
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'SaveOnYourHome/1.0 (contact@saveonyourhome.com)',
                ])
                ->get('https://nominatim.openstreetmap.org/search', [
                    'q' => $location . ', USA',
                    'format' => 'json',
                    'limit' => 1,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                if (!empty($data[0]['boundingbox'])) {
                    // Nominatim boundingbox: [south, north, west, east]
                    $bb = $data[0]['boundingbox'];
                    return [
                        'north' => (float) $bb[1],
                        'south' => (float) $bb[0],
                        'east' => (float) $bb[3],
                        'west' => (float) $bb[2],
                    ];
                }

                // Fallback: create bounds from center point
                if (isset($data[0]['lat'], $data[0]['lon'])) {
                    $padding = 0.15;
                    return [
                        'north' => (float) $data[0]['lat'] + $padding,
                        'south' => (float) $data[0]['lat'] - $padding,
                        'east' => (float) $data[0]['lon'] + $padding,
                        'west' => (float) $data[0]['lon'] - $padding,
                    ];
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Geocoding viewport error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Geocode a property if it doesn't have coordinates
     *
     * @param \App\Models\Property $property
     * @return bool Returns true if coordinates were updated
     */
    public static function geocodeProperty($property): bool
    {
        // Skip if already has coordinates
        if ($property->latitude && $property->longitude) {
            return false;
        }

        $coordinates = self::geocode(
            $property->address,
            $property->city,
            $property->state,
            $property->zip_code
        );

        if ($coordinates) {
            $property->update([
                'latitude' => $coordinates['latitude'],
                'longitude' => $coordinates['longitude'],
            ]);
            return true;
        }

        return false;
    }
}

<?php

namespace App\Services;

use App\Models\Property;
use App\Models\SavedSearch;

/**
 * Matches a Property against a SavedSearch's filter set using the same
 * semantics as the public /properties query.
 *
 * Filter keys recognised (they correspond to the Properties.jsx search state):
 *   - keyword     → matches property_title / address / city / description
 *   - city        → case-insensitive city equality
 *   - state       → case-insensitive state equality
 *   - propertyType
 *   - status           for-sale | for-rent | pending | sold | all
 *   - transactionType  for_sale | for_rent
 *   - minPrice / maxPrice
 *   - beds / bedrooms  (minimum)
 *   - baths / bathrooms (minimum; counts full + half/2)
 *   - sqftMin / sqftMax
 *   - lotSizeMin / lotSizeMax
 *   - yearBuiltMin
 *   - amenities[]      every listed amenity must be present in property.features
 *   - hasVirtualTour   yes → requires virtual_tour_url OR virtual_tour_embed
 *   - hasOpenHouse     yes → requires an upcoming open house (not enforced here)
 */
class SavedSearchMatcher
{
    public function matches(Property $property, SavedSearch $search): bool
    {
        $f = $search->filters ?? [];
        if (!is_array($f)) return false;

        // Base gate — saved searches only ever match live listings.
        if (!$property->is_active) return false;
        if ($property->approval_status !== 'approved') return false;

        $status = $f['status'] ?? 'for-sale';
        if ($status === 'for-rent') {
            if (($property->transaction_type ?? 'for_sale') !== 'for_rent') return false;
        } elseif ($status !== 'all') {
            $map = ['for-sale' => 'for_sale', 'pending' => 'pending', 'sold' => 'sold'];
            $expected = $map[$status] ?? 'for_sale';
            if (($property->listing_status ?? 'for_sale') !== $expected) return false;
        }

        if (!empty($f['transactionType']) && ($property->transaction_type ?? 'for_sale') !== $f['transactionType']) {
            return false;
        }

        if (!empty($f['propertyType']) && $property->property_type !== $f['propertyType']) {
            return false;
        }

        if (!empty($f['city']) && mb_strtolower($property->city ?? '') !== mb_strtolower($f['city'])) {
            return false;
        }
        if (!empty($f['state']) && mb_strtolower($property->state ?? '') !== mb_strtolower($f['state'])) {
            return false;
        }

        if (!empty($f['minPrice']) && (float) $property->price < (float) $f['minPrice']) return false;
        if (!empty($f['maxPrice']) && (float) $property->price > (float) $f['maxPrice']) return false;

        $minBeds = $f['bedrooms'] ?? $f['beds'] ?? null;
        if ($minBeds !== null && $minBeds !== '' && (int) ($property->bedrooms ?? 0) < (int) $minBeds) return false;

        $minBaths = $f['bathrooms'] ?? $f['baths'] ?? null;
        if ($minBaths !== null && $minBaths !== '') {
            $baths = (float) ($property->full_bathrooms ?? 0) + ((float) ($property->half_bathrooms ?? 0) * 0.5);
            if ($baths < (float) $minBaths) return false;
        }

        if (!empty($f['sqftMin']) && (int) ($property->sqft ?? 0) < (int) $f['sqftMin']) return false;
        if (!empty($f['sqftMax']) && (int) ($property->sqft ?? 0) > (int) $f['sqftMax']) return false;

        if (!empty($f['lotSizeMin']) && (int) ($property->lot_size ?? 0) < (int) $f['lotSizeMin']) return false;
        if (!empty($f['yearBuiltMin']) && (int) ($property->year_built ?? 0) < (int) $f['yearBuiltMin']) return false;

        if (!empty($f['amenities']) && is_array($f['amenities'])) {
            $propFeatures = is_array($property->features) ? $property->features : [];
            foreach ($f['amenities'] as $wanted) {
                if (!in_array($wanted, $propFeatures, true)) return false;
            }
        }

        if (($f['hasVirtualTour'] ?? '') === 'yes') {
            if (empty($property->virtual_tour_url) && empty($property->virtual_tour_embed)) return false;
        }

        if (!empty($f['keyword'])) {
            $k = mb_strtolower($f['keyword']);
            $haystack = mb_strtolower(implode(' ', array_filter([
                $property->property_title,
                $property->address,
                $property->city,
                $property->description,
            ])));
            if (mb_strpos($haystack, $k) === false) return false;
        }

        return true;
    }
}

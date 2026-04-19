<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Generates a draft property description from the listing fields.
 *
 * MVP: template-based. Swap the body of buildDescription() for a real LLM call
 * (Anthropic / OpenAI) when an API key is configured — the contract stays the same.
 */
class PropertyDescriptionController extends Controller
{
    public function generate(Request $request, Property $property): JsonResponse
    {
        abort_unless($property->user_id === $request->user()->id, 403);

        $html = $this->buildDescription($property);

        return response()->json(['description' => $html]);
    }

    /**
     * Generate a description from an unsaved (draft) form payload. Used by the
     * Create Listing page where no Property row exists yet.
     */
    public function generateDraft(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'property_type' => 'nullable|string|max:60',
            'bedrooms' => 'nullable|integer|min:0',
            'full_bathrooms' => 'nullable|integer|min:0',
            'half_bathrooms' => 'nullable|integer|min:0',
            'sqft' => 'nullable|integer|min:0',
            'year_built' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'price' => 'nullable|numeric|min:0',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:120',
            'state' => 'nullable|string|max:50',
            'school_district' => 'nullable|string|max:255',
            'grade_school' => 'nullable|string|max:255',
            'middle_school' => 'nullable|string|max:255',
            'high_school' => 'nullable|string|max:255',
            'has_hoa' => 'nullable|boolean',
            'hoa_fee' => 'nullable|numeric|min:0',
            'annual_property_tax' => 'nullable|numeric|min:0',
            'features' => 'nullable|array',
            'features.*' => 'string',
        ]);

        $p = new Property($validated);
        // Features is cast to array on the model, but for an unsaved instance we set it directly.
        $p->features = $validated['features'] ?? [];

        return response()->json([
            'description' => $this->buildDescription($p),
        ]);
    }

    protected function buildDescription(Property $p): string
    {
        $bedrooms = (int) ($p->bedrooms ?? 0);
        $baths = (float) (($p->full_bathrooms ?? 0) + (($p->half_bathrooms ?? 0) * 0.5));
        $sqft = (int) ($p->sqft ?? 0);
        $year = $p->year_built;
        $city = $p->city ?: 'a great neighborhood';
        $state = $p->state ?: '';
        $price = $p->price ? number_format((float) $p->price) : null;
        $address = $p->address;
        $features = is_array($p->features) ? $p->features : (json_decode($p->features ?? '[]', true) ?: []);

        $typeLabel = match ($p->property_type) {
            'single-family-home', 'single_family' => 'single-family home',
            'condos-townhomes-co-ops', 'condo' => 'condo',
            'townhouse' => 'townhouse',
            'multi-family', 'multi_family' => 'multi-family home',
            'land' => 'lot',
            'mfd-mobile-homes', 'mobile_home' => 'manufactured home',
            default => 'home',
        };

        $lines = [];

        // Opening
        $openingBits = [];
        if ($bedrooms > 0) $openingBits[] = "{$bedrooms}-bedroom";
        if ($baths > 0) $openingBits[] = $this->formatBaths($baths) . '-bathroom';
        $opening = 'Welcome to this beautifully maintained ' . implode(' ', $openingBits) . ' ' . $typeLabel;
        if ($sqft > 0) $opening .= " with approximately " . number_format($sqft) . ' sq ft of living space';
        $opening .= ", tucked into {$city}" . ($state ? ", {$state}" : '') . '.';
        $lines[] = $opening;

        // Year built
        if ($year) {
            $lines[] = "Built in {$year}, the home blends everyday practicality with plenty of character.";
        }

        // Features
        if (!empty($features)) {
            $selected = array_slice(array_values(array_filter($features)), 0, 8);
            if (!empty($selected)) {
                $lines[] = 'Standout features include ' . $this->joinWithAnd($selected) . '.';
            }
        }

        // Schools (if provided)
        $schoolBits = array_filter([$p->grade_school, $p->middle_school, $p->high_school]);
        if ($p->school_district) {
            $line = "Located in the {$p->school_district} school district";
            if (!empty($schoolBits)) {
                $line .= ' (' . implode(', ', $schoolBits) . ')';
            }
            $line .= '.';
            $lines[] = $line;
        }

        // HOA / taxes
        $financial = [];
        if ($p->has_hoa && $p->hoa_fee) {
            $financial[] = 'HOA fees are $' . number_format((float) $p->hoa_fee) . '/month';
        }
        if ($p->annual_property_tax) {
            $financial[] = 'annual property taxes run about $' . number_format((float) $p->annual_property_tax);
        }
        if ($financial) {
            $lines[] = ucfirst(implode('; ', $financial)) . '.';
        }

        // FSBO closer
        $closer = 'Listed for sale by owner on SaveOnYourHome';
        if ($price) $closer .= ' at $' . $price;
        $closer .= ' — book a showing directly through the platform and keep the conversation simple, fast, and commission-free.';
        $lines[] = $closer;

        // Render as HTML paragraphs
        return implode('', array_map(fn ($p) => '<p>' . e($p) . '</p>', $lines));
    }

    private function formatBaths(float $n): string
    {
        if ($n == (int) $n) return (string) (int) $n;
        return rtrim(rtrim(number_format($n, 1), '0'), '.');
    }

    private function joinWithAnd(array $items): string
    {
        $items = array_values($items);
        if (count($items) <= 1) return $items[0] ?? '';
        $last = array_pop($items);
        return implode(', ', $items) . ' and ' . $last;
    }
}

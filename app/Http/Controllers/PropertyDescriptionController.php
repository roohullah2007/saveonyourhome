<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Services\OpenAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Generates a draft property description from the listing fields.
 *
 * Uses OpenAI when OPENAI_API_KEY is set; falls back to the local template
 * if the key is missing or the API call fails so sellers always get a draft.
 */
class PropertyDescriptionController extends Controller
{
    public function __construct(private OpenAiService $openAi) {}

    public function generate(Request $request, Property $property): JsonResponse
    {
        abort_unless($property->user_id === $request->user()->id, 403);

        $html = $this->aiOrTemplate($property);

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
            'description' => $this->aiOrTemplate($p),
        ]);
    }

    protected function aiOrTemplate(Property $p): string
    {
        $ai = $this->generateWithAi($p);
        return $ai ?: $this->buildDescription($p);
    }

    protected function generateWithAi(Property $p): ?string
    {
        if (!$this->openAi->isConfigured()) {
            return null;
        }

        $features = is_array($p->features) ? $p->features : (json_decode($p->features ?? '[]', true) ?: []);
        $baths = (float) (($p->full_bathrooms ?? 0) + (($p->half_bathrooms ?? 0) * 0.5));

        $facts = [
            'Property type' => $p->property_type,
            'Bedrooms' => $p->bedrooms,
            'Bathrooms' => $baths ?: null,
            'Square feet' => $p->sqft,
            'Year built' => $p->year_built,
            'Address' => $p->address,
            'City' => $p->city,
            'State' => $p->state,
            'Price' => $p->price ? '$' . number_format((float) $p->price) : null,
            'School district' => $p->school_district,
            'Grade school' => $p->grade_school,
            'Middle school' => $p->middle_school,
            'High school' => $p->high_school,
            'HOA fee (monthly)' => $p->has_hoa && $p->hoa_fee ? '$' . number_format((float) $p->hoa_fee) : null,
            'Annual property tax' => $p->annual_property_tax ? '$' . number_format((float) $p->annual_property_tax) : null,
            'Standout features' => !empty($features) ? implode(', ', array_filter($features)) : null,
        ];

        $factLines = [];
        foreach ($facts as $k => $v) {
            if ($v !== null && $v !== '' && $v !== 0) {
                $factLines[] = "- {$k}: {$v}";
            }
        }

        $system = 'You are a professional real-estate copywriter. Write warm, concrete, specific listing descriptions for For Sale By Owner homes on SaveOnYourHome. Never invent amenities, neighborhoods, or facts that were not provided. Never mention agents, commissions, or MLS. Output plain HTML: three to five short <p> paragraphs, no headings, no lists. Around 150-220 words total.';

        $user = "Write a listing description for this home using only the facts below.\n\n" . implode("\n", $factLines);

        $content = $this->openAi->chat([
            ['role' => 'system', 'content' => $system],
            ['role' => 'user', 'content' => $user],
        ], ['temperature' => 0.75]);

        if (!$content) return null;

        $content = trim($content);
        // Strip any stray markdown fences just in case.
        $content = preg_replace('/^```(?:html)?\s*|\s*```$/i', '', $content);

        // If the model returned plain prose without <p>, wrap each paragraph.
        if (stripos($content, '<p') === false) {
            $paragraphs = preg_split('/\n\s*\n/', $content);
            $content = implode('', array_map(fn ($para) => '<p>' . e(trim($para)) . '</p>', $paragraphs));
        }

        return $content;
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

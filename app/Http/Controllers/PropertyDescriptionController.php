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

        try {
            return response()->json(['description' => $this->aiOrTemplate($property)]);
        } catch (\Throwable $e) {
            \Log::warning('generate description failed', ['property' => $property->id, 'error' => $e->getMessage()]);
            // Fall back to template directly — never 500 on this user-facing path.
            try {
                return response()->json(['description' => $this->buildDescription($property)]);
            } catch (\Throwable $inner) {
                return response()->json(['description' => '<p>Add a few words about what makes your home special — the layout, recent updates, the neighborhood, and how it lives day-to-day.</p>']);
            }
        }
    }

    /**
     * Generate a description from an unsaved (draft) form payload. Used by the
     * Create Listing page where no Property row exists yet.
     *
     * This endpoint is best-effort: validation failures, malformed input,
     * and OpenAI outages all fall back to the local template so the seller
     * always gets *something* useful when they click "Generate with AI".
     */
    public function generateDraft(Request $request): JsonResponse
    {
        try {
            $intOrNull = function ($v) {
                if ($v === null || $v === '') return null;
                if (is_numeric($v)) return (int) $v;
                return null;
            };
            $floatOrNull = function ($v) {
                if ($v === null || $v === '') return null;
                if (is_numeric($v)) return (float) $v;
                return null;
            };
            $strOrNull = function ($v, $max = 255) {
                if ($v === null) return null;
                $v = is_string($v) ? trim($v) : (string) $v;
                if ($v === '') return null;
                return mb_substr($v, 0, $max);
            };

            // Features may arrive as either an array (JS) or a JSON string
            // (older form submissions). Normalise to an array of strings.
            $featuresIn = $request->input('features', []);
            if (is_string($featuresIn)) {
                $decoded = json_decode($featuresIn, true);
                $featuresIn = is_array($decoded) ? $decoded : [];
            }
            if (!is_array($featuresIn)) {
                $featuresIn = [];
            }
            $features = array_values(array_filter(
                array_map(fn ($x) => is_string($x) ? trim($x) : null, $featuresIn),
                fn ($x) => $x !== null && $x !== ''
            ));

            $payload = [
                'property_type' => $strOrNull($request->input('property_type'), 60),
                'bedrooms' => $intOrNull($request->input('bedrooms')),
                'full_bathrooms' => $intOrNull($request->input('full_bathrooms')),
                'half_bathrooms' => $intOrNull($request->input('half_bathrooms')),
                'sqft' => $intOrNull($request->input('sqft')),
                'year_built' => $intOrNull($request->input('year_built')),
                'price' => $floatOrNull($request->input('price')),
                'address' => $strOrNull($request->input('address')),
                'city' => $strOrNull($request->input('city'), 120),
                'state' => $strOrNull($request->input('state'), 50),
                'school_district' => $strOrNull($request->input('school_district')),
                'grade_school' => $strOrNull($request->input('grade_school')),
                'middle_school' => $strOrNull($request->input('middle_school')),
                'high_school' => $strOrNull($request->input('high_school')),
                'has_hoa' => $request->boolean('has_hoa'),
                'hoa_fee' => $floatOrNull($request->input('hoa_fee')),
                'annual_property_tax' => $floatOrNull($request->input('annual_property_tax')),
            ];

            $p = new Property($payload);
            $p->features = $features;

            return response()->json([
                'description' => $this->aiOrTemplate($p),
            ]);
        } catch (\Throwable $e) {
            \Log::warning('generateDraft failed, returning empty fallback', [
                'error' => $e->getMessage(),
            ]);
            // Last-resort template with whatever raw input we have so the
            // user still gets a useful starting draft.
            try {
                $p = new Property([
                    'property_type' => (string) $request->input('property_type', ''),
                    'address' => (string) $request->input('address', ''),
                    'city' => (string) $request->input('city', ''),
                    'state' => (string) $request->input('state', ''),
                ]);
                $p->features = is_array($request->input('features')) ? $request->input('features') : [];
                return response()->json([
                    'description' => $this->buildDescription($p),
                ]);
            } catch (\Throwable $inner) {
                return response()->json([
                    'description' => '<p>Add a few words about what makes your home special — the layout, recent updates, the neighborhood, and how it lives day-to-day.</p>',
                ]);
            }
        }
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

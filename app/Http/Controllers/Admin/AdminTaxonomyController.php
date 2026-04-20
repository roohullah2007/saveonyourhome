<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaxonomyTerm;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminTaxonomyController extends Controller
{
    private const TYPE_META = [
        TaxonomyTerm::TYPE_PROPERTY_TYPE => ['label' => 'Property Types', 'singular' => 'Property Type'],
        TaxonomyTerm::TYPE_TRANSACTION_TYPE => ['label' => 'Transaction Types', 'singular' => 'Transaction Type'],
        TaxonomyTerm::TYPE_LISTING_LABEL => ['label' => 'Special Notices', 'singular' => 'Special Notice'],
        TaxonomyTerm::TYPE_LISTING_STATUS => ['label' => 'Listing Statuses', 'singular' => 'Listing Status'],
    ];

    public function index()
    {
        $terms = TaxonomyTerm::query()
            ->orderBy('type')
            ->orderBy('sort_order')
            ->orderBy('label')
            ->get()
            ->groupBy('type')
            ->toArray();

        $grouped = [];
        foreach (array_keys(self::TYPE_META) as $type) {
            $grouped[$type] = $terms[$type] ?? [];
        }

        return Inertia::render('Admin/Taxonomies/Index', [
            'groups' => $grouped,
            'typeMeta' => self::TYPE_META,
        ]);
    }

    /**
     * Dedicated page for the amenity catalog — richer UX than cramming it into
     * the generic taxonomies tab-list since amenities are hierarchical.
     */
    public function amenities()
    {
        $categories = TaxonomyTerm::query()
            ->where('type', TaxonomyTerm::TYPE_AMENITY_CATEGORY)
            ->orderBy('sort_order')->orderBy('label')
            ->get();

        $items = TaxonomyTerm::query()
            ->where('type', TaxonomyTerm::TYPE_AMENITY)
            ->orderBy('sort_order')->orderBy('label')
            ->get()
            ->groupBy('parent_id');

        $amenityTree = $categories->map(fn ($cat) => [
            'category' => $cat,
            'items' => ($items->get($cat->id) ?? collect())->values()->all(),
        ])->values()->all();

        return Inertia::render('Admin/Amenities/Index', [
            'amenityTree' => $amenityTree,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateTerm($request);

        TaxonomyTerm::create([
            'type' => $validated['type'],
            'parent_id' => $validated['parent_id'] ?? null,
            'key' => $validated['key'] ?: Str::slug($validated['label'], '_'),
            'label' => $validated['label'],
            'sub_label' => $validated['sub_label'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? (int) TaxonomyTerm::where('type', $validated['type'])->max('sort_order') + 10,
        ]);

        TaxonomyTerm::clearCache();
        return back()->with('success', 'Added.');
    }

    public function update(Request $request, TaxonomyTerm $term)
    {
        $validated = $this->validateTerm($request, $term->id);

        $term->update([
            'parent_id' => array_key_exists('parent_id', $validated) ? $validated['parent_id'] : $term->parent_id,
            'key' => $validated['key'] ?: Str::slug($validated['label'], '_'),
            'label' => $validated['label'],
            'sub_label' => array_key_exists('sub_label', $validated) ? $validated['sub_label'] : $term->sub_label,
            'is_active' => $validated['is_active'] ?? $term->is_active,
            'sort_order' => $validated['sort_order'] ?? $term->sort_order,
        ]);

        TaxonomyTerm::clearCache();
        return back()->with('success', 'Updated.');
    }

    public function destroy(TaxonomyTerm $term)
    {
        // Deleting a category cascades its items so the UI stays consistent.
        if ($term->type === TaxonomyTerm::TYPE_AMENITY_CATEGORY) {
            TaxonomyTerm::where('type', TaxonomyTerm::TYPE_AMENITY)
                ->where('parent_id', $term->id)
                ->delete();
        }
        $term->delete();
        TaxonomyTerm::clearCache();
        return back()->with('success', 'Removed.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', Rule::in(TaxonomyTerm::TYPES)],
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:taxonomy_terms,id',
        ]);

        foreach ($validated['ids'] as $i => $id) {
            TaxonomyTerm::where('id', $id)->where('type', $validated['type'])->update(['sort_order' => ($i + 1) * 10]);
        }
        TaxonomyTerm::clearCache();

        return back();
    }

    private function validateTerm(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'type' => ['required', Rule::in(TaxonomyTerm::TYPES)],
            'parent_id' => ['nullable', 'integer', 'exists:taxonomy_terms,id'],
            'key' => ['nullable', 'string', 'max:100', 'regex:/^[a-z0-9_-]+$/', function ($attr, $value, $fail) use ($request, $ignoreId) {
                if (!$value) return;
                $type = $request->input('type');
                $parentId = $request->input('parent_id');
                $query = TaxonomyTerm::where('type', $type)->where('key', $value);
                // Uniqueness of item keys is scoped to their parent category so
                // two categories can carry the same slug (e.g. "pool").
                if ($type === TaxonomyTerm::TYPE_AMENITY && $parentId) {
                    $query->where('parent_id', $parentId);
                }
                if ($ignoreId) $query->where('id', '!=', $ignoreId);
                if ($query->exists()) $fail('This key is already used.');
            }],
            'label' => 'required|string|max:255',
            'sub_label' => 'nullable|string|max:120',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);
    }
}

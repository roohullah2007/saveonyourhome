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

        // Ensure every known type exists in the payload even if empty.
        $grouped = [];
        foreach (array_keys(self::TYPE_META) as $type) {
            $grouped[$type] = $terms[$type] ?? [];
        }

        return Inertia::render('Admin/Taxonomies/Index', [
            'groups' => $grouped,
            'typeMeta' => self::TYPE_META,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateTerm($request);

        TaxonomyTerm::create([
            'type' => $validated['type'],
            'key' => $validated['key'] ?: Str::slug($validated['label']),
            'label' => $validated['label'],
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? (int) TaxonomyTerm::where('type', $validated['type'])->max('sort_order') + 10,
        ]);

        return back()->with('success', 'Added.');
    }

    public function update(Request $request, TaxonomyTerm $term)
    {
        $validated = $this->validateTerm($request, $term->id);

        $term->update([
            'key' => $validated['key'] ?: Str::slug($validated['label']),
            'label' => $validated['label'],
            'is_active' => $validated['is_active'] ?? $term->is_active,
            'sort_order' => $validated['sort_order'] ?? $term->sort_order,
        ]);

        return back()->with('success', 'Updated.');
    }

    public function destroy(TaxonomyTerm $term)
    {
        $term->delete();
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
            'key' => ['nullable', 'string', 'max:100', 'regex:/^[a-z0-9_-]+$/', function ($attr, $value, $fail) use ($request, $ignoreId) {
                if (!$value) return;
                $exists = TaxonomyTerm::where('type', $request->input('type'))
                    ->where('key', $value)
                    ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                    ->exists();
                if ($exists) $fail('This key is already used for this taxonomy.');
            }],
            'label' => 'required|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);
    }
}

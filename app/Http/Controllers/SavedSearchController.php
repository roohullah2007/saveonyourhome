<?php

namespace App\Http\Controllers;

use App\Models\SavedSearch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SavedSearchController extends Controller
{
    public function index(Request $request)
    {
        $searches = SavedSearch::where('user_id', $request->user()->id)
            ->latest()
            ->get(['id', 'name', 'filters', 'created_at']);

        return Inertia::render('Dashboard/SavedSearches', [
            'savedSearches' => $searches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'filters' => 'required|array',
        ]);

        SavedSearch::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'filters' => $validated['filters'],
        ]);

        return back()->with('success', 'Search saved.');
    }

    public function destroy(Request $request, SavedSearch $savedSearch)
    {
        abort_unless($savedSearch->user_id === $request->user()->id, 403);
        $savedSearch->delete();

        return back()->with('success', 'Search removed.');
    }
}

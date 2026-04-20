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
            ->get(['id', 'name', 'filters', 'alerts_enabled', 'last_alerted_at', 'created_at']);

        return Inertia::render('Dashboard/SavedSearches', [
            'savedSearches' => $searches,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'filters' => 'required|array',
            'alerts_enabled' => 'nullable|boolean',
        ]);

        SavedSearch::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'filters' => $validated['filters'],
            'alerts_enabled' => (bool) ($validated['alerts_enabled'] ?? false),
        ]);

        return back()->with('success', 'Search saved.');
    }

    public function update(Request $request, SavedSearch $savedSearch)
    {
        abort_unless($savedSearch->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'alerts_enabled' => 'required|boolean',
        ]);

        $savedSearch->update(['alerts_enabled' => (bool) $validated['alerts_enabled']]);

        return back()->with('success', $validated['alerts_enabled'] ? 'Alerts enabled.' : 'Alerts paused.');
    }

    public function destroy(Request $request, SavedSearch $savedSearch)
    {
        abort_unless($savedSearch->user_id === $request->user()->id, 403);
        $savedSearch->delete();

        return back()->with('success', 'Search removed.');
    }

    /**
     * Public, token-signed endpoint hit from the "turn off alerts" link in
     * the notification email. Matches the sha1 hash the mail builds, so we
     * don't need the user to be signed in to unsubscribe.
     */
    public function unsubscribe(Request $request, SavedSearch $savedSearch)
    {
        $expected = $savedSearch->user_id . '-' . sha1($savedSearch->id . config('app.key'));
        abort_unless(hash_equals($expected, (string) $request->query('token')), 403);

        $savedSearch->update(['alerts_enabled' => false]);

        return redirect('/')->with('success', 'Alerts turned off for "' . $savedSearch->name . '". You can re-enable them any time from your dashboard.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\ExternalCalendar;
use App\Services\CalendarSyncService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CalendarImportController extends Controller
{
    public function __construct(private CalendarSyncService $syncService) {}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:120',
            'ics_url' => 'required|string|max:1000',
        ]);

        // Accept webcal:// in addition to http/https
        $url = trim($validated['ics_url']);
        $url = str_starts_with($url, 'webcal://') ? 'https://' . substr($url, 9) : $url;

        if (!preg_match('#^https?://#i', $url)) {
            return back()->withErrors(['ics_url' => 'Please enter a valid http(s):// or webcal:// URL.'])->withInput();
        }

        $calendar = ExternalCalendar::create([
            'user_id' => $request->user()->id,
            'label' => $validated['label'],
            'ics_url' => $url,
            'is_active' => true,
        ]);

        // Try an initial sync; failures get saved on the row.
        $this->syncService->sync($calendar);

        return back()->with('success', 'Calendar added.');
    }

    public function destroy(Request $request, ExternalCalendar $calendar)
    {
        abort_unless($calendar->user_id === $request->user()->id, 403);
        $calendar->delete();
        return back()->with('success', 'Calendar removed.');
    }

    public function sync(Request $request, ExternalCalendar $calendar)
    {
        abort_unless($calendar->user_id === $request->user()->id, 403);
        $ok = $this->syncService->sync($calendar);
        return back()->with($ok ? 'success' : 'error', $ok ? 'Calendar refreshed.' : 'Sync failed. Check the URL and try again.');
    }

    public function regenerateFeed(Request $request)
    {
        $user = $request->user();
        $user->calendar_feed_token = Str::random(48);
        $user->save();
        return back()->with('success', 'New calendar feed URL generated. Update any calendars subscribed to the old link.');
    }
}

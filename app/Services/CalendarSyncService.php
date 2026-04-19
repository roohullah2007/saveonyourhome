<?php

namespace App\Services;

use App\Models\ExternalBusyEvent;
use App\Models\ExternalCalendar;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class CalendarSyncService
{
    public const FETCH_TIMEOUT = 15;
    public const WINDOW_DAYS_AHEAD = 60;
    public const WINDOW_DAYS_BEHIND = 1;

    public function sync(ExternalCalendar $calendar): bool
    {
        $url = $calendar->ics_url;

        // Google Calendar often shares a `webcal://` URL — translate to https://.
        if (str_starts_with($url, 'webcal://')) {
            $url = 'https://' . substr($url, 9);
        }

        try {
            $response = Http::withOptions(['allow_redirects' => true])
                ->timeout(self::FETCH_TIMEOUT)
                ->get($url);
        } catch (\Throwable $e) {
            $calendar->update(['last_sync_error' => substr($e->getMessage(), 0, 500), 'last_synced_at' => now()]);
            return false;
        }

        if (!$response->ok()) {
            $calendar->update([
                'last_sync_error' => 'HTTP ' . $response->status() . ' from calendar URL.',
                'last_synced_at' => now(),
            ]);
            return false;
        }

        $body = $response->body();
        if (!str_contains($body, 'BEGIN:VCALENDAR')) {
            $calendar->update([
                'last_sync_error' => 'Response does not look like an iCalendar feed.',
                'last_synced_at' => now(),
            ]);
            return false;
        }

        $events = CalendarIcsParser::parse($body);

        $windowStart = Carbon::now()->subDays(self::WINDOW_DAYS_BEHIND);
        $windowEnd = Carbon::now()->addDays(self::WINDOW_DAYS_AHEAD);

        $kept = [];
        foreach ($events as $ev) {
            if (!$ev['starts_at'] || !$ev['ends_at']) continue;
            if ($ev['ends_at']->lt($windowStart)) continue;
            if ($ev['starts_at']->gt($windowEnd)) continue;
            $kept[] = $ev;
        }

        DB::transaction(function () use ($calendar, $kept) {
            // Clean slate for this calendar — we re-write the busy window each sync.
            $calendar->events()->delete();
            foreach ($kept as $ev) {
                ExternalBusyEvent::create([
                    'external_calendar_id' => $calendar->id,
                    'starts_at' => $ev['starts_at'],
                    'ends_at' => $ev['ends_at'],
                    'source_uid' => $ev['uid'] ? substr($ev['uid'], 0, 500) : null,
                    'summary' => $ev['summary'] ? substr($ev['summary'], 0, 500) : null,
                ]);
            }
            $calendar->update([
                'last_synced_at' => now(),
                'last_sync_error' => null,
                'last_event_count' => count($kept),
            ]);
        });

        return true;
    }
}

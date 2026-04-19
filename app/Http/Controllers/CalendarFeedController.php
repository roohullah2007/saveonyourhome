<?php

namespace App\Http\Controllers;

use App\Models\PropertyShowing;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

class CalendarFeedController extends Controller
{
    /**
     * Public ICS feed for a seller — subscribe to this URL from Google/Outlook/Apple Calendar.
     * Token in the URL is the only protection; if leaked, the seller can regenerate it.
     */
    public function show(string $token): Response
    {
        $user = User::where('calendar_feed_token', $token)->firstOrFail();

        $from = Carbon::now()->subDays(7);
        $to = Carbon::now()->addDays(90);

        $showings = PropertyShowing::query()
            ->where('seller_user_id', $user->id)
            ->whereIn('status', ['confirmed', 'completed'])
            ->whereBetween('scheduled_at', [$from, $to])
            ->with('property')
            ->orderBy('scheduled_at')
            ->get();

        $host = parse_url(config('app.url'), PHP_URL_HOST) ?: 'saveonyourhome.com';
        $now = Carbon::now()->utc()->format('Ymd\THis\Z');

        $lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//SaveOnYourHome//Feed//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'X-WR-CALNAME:' . self::escape('SaveOnYourHome — ' . $user->name),
            'X-WR-CALDESC:' . self::escape('Confirmed showings booked through SaveOnYourHome.com'),
            'X-WR-TIMEZONE:UTC',
        ];

        foreach ($showings as $s) {
            $start = $s->scheduled_at->copy()->utc()->format('Ymd\THis\Z');
            $end = $s->endsAt()->copy()->utc()->format('Ymd\THis\Z');
            $typeLabel = $s->meeting_type === 'phone' ? 'Phone call' : 'In-person showing';
            $summary = sprintf('%s — %s', $typeLabel, $s->property?->property_title ?? 'Property');
            $descLines = array_filter([
                'Buyer: ' . $s->buyer_name . ' <' . $s->buyer_email . '>',
                $s->buyer_phone ? 'Phone: ' . $s->buyer_phone : null,
                $s->buyer_notes ? 'Notes: ' . $s->buyer_notes : null,
            ]);
            $location = $s->meeting_type === 'in_person'
                ? trim(implode(', ', array_filter([$s->property?->address, $s->property?->city, $s->property?->state, $s->property?->zip_code])))
                : 'Phone';

            $lines[] = 'BEGIN:VEVENT';
            $lines[] = 'UID:showing-' . $s->id . '@' . $host;
            $lines[] = 'DTSTAMP:' . $now;
            $lines[] = 'DTSTART:' . $start;
            $lines[] = 'DTEND:' . $end;
            $lines[] = 'SUMMARY:' . self::escape($summary);
            if ($descLines) $lines[] = 'DESCRIPTION:' . self::escape(implode("\\n", $descLines));
            if ($location) $lines[] = 'LOCATION:' . self::escape($location);
            $lines[] = 'STATUS:CONFIRMED';
            $lines[] = 'END:VEVENT';
        }

        $lines[] = 'END:VCALENDAR';
        $body = implode("\r\n", $lines);

        return response($body, 200, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Content-Disposition' => 'inline; filename="saveonyourhome-' . $user->id . '.ics"',
            'Cache-Control' => 'private, max-age=300',
        ]);
    }

    private static function escape(string $value): string
    {
        return str_replace(["\\", ",", ";", "\n"], ["\\\\", "\\,", "\\;", "\\n"], $value);
    }
}

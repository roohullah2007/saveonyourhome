<?php

namespace App\Services;

use App\Models\PropertyShowing;

class IcsGenerator
{
    public static function forShowing(PropertyShowing $showing): string
    {
        $uid = sprintf('showing-%d@%s', $showing->id, parse_url(config('app.url'), PHP_URL_HOST) ?: 'saveonyourhome.com');
        $start = $showing->scheduled_at->copy()->utc();
        $end = $showing->endsAt()->utc();
        $now = now()->utc();

        $property = $showing->property;
        $typeLabel = $showing->meeting_type === 'phone' ? 'Phone call' : 'In-person showing';
        $summary = sprintf('%s — %s', $typeLabel, $property?->property_title ?? 'Property');

        // Build the description with REAL newlines; escape() converts them
        // to the iCal "\n" two-char sequence per RFC 5545. The previous
        // version pre-inserted "\n" (literal backslash-n) and then ran it
        // through escape, which turned the backslash into "\\" — so Google
        // Calendar received "\\n" and refused to parse the event ("Unable
        // to load event").
        $descLines = array_filter([
            "Meeting type: {$typeLabel}",
            $property?->property_title ? ('Property: ' . $property->property_title) : null,
            ($addr = trim(implode(', ', array_filter([$property?->address, $property?->city, $property?->state, $property?->zip_code]))))
                ? ('Address: ' . $addr) : null,
            'Buyer: ' . $showing->buyer_name . ' (' . $showing->buyer_email . ($showing->buyer_phone ? ', ' . $showing->buyer_phone : '') . ')',
            $showing->buyer_notes ? ('Notes: ' . $showing->buyer_notes) : null,
        ]);
        $description = self::escape(implode("\n", $descLines));

        $locationRaw = $showing->meeting_type === 'in_person'
            ? trim(implode(', ', array_filter([$property?->address, $property?->city, $property?->state, $property?->zip_code])))
            : 'Phone';
        $location = self::escape($locationRaw !== '' ? $locationRaw : 'Online');

        $lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//SaveOnYourHome//Showings//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:REQUEST',
            'BEGIN:VEVENT',
            'UID:' . $uid,
            'DTSTAMP:' . $now->format('Ymd\THis\Z'),
            'DTSTART:' . $start->format('Ymd\THis\Z'),
            'DTEND:' . $end->format('Ymd\THis\Z'),
            'SUMMARY:' . self::escape($summary),
            'DESCRIPTION:' . $description,
            'LOCATION:' . $location,
            'STATUS:' . ($showing->status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'),
            'TRANSP:OPAQUE',
            'SEQUENCE:0',
            'ORGANIZER;CN=' . self::escape($showing->seller?->name ?? 'SaveOnYourHome') . ':mailto:' . ($showing->seller?->email ?? 'noreply@saveonyourhome.com'),
            'ATTENDEE;CN=' . self::escape($showing->buyer_name) . ';ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:' . $showing->buyer_email,
            'END:VEVENT',
            'END:VCALENDAR',
        ];

        // RFC 5545 requires content lines longer than 75 octets to be
        // folded with CRLF + a single SP at every 75 bytes. Gmail's parser
        // is strict about this — long DESCRIPTION lines without folding
        // surface as "Unable to load event".
        return implode("\r\n", array_map([self::class, 'foldLine'], $lines));
    }

    /**
     * Fold an iCalendar content line at 75 octets per RFC 5545 §3.1.
     * Continuation lines start with CRLF + single space.
     */
    private static function foldLine(string $line): string
    {
        if (strlen($line) <= 75) {
            return $line;
        }
        $out = '';
        $remaining = $line;
        // First chunk: 75 chars; subsequent chunks: 74 (room for the leading space).
        $first = true;
        while (strlen($remaining) > 0) {
            $size = $first ? 75 : 74;
            $chunk = substr($remaining, 0, $size);
            $out .= ($first ? '' : "\r\n ") . $chunk;
            $remaining = substr($remaining, $size);
            $first = false;
        }
        return $out;
    }

    private static function escape(string $value): string
    {
        // Order matters: backslash first so we don't double-escape the
        // backslashes we insert for the other characters.
        return str_replace(["\\", ";", ",", "\n"], ["\\\\", "\\;", "\\,", "\\n"], $value);
    }
}

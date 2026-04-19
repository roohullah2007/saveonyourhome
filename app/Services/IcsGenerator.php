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

        $descLines = [
            "Meeting type: {$typeLabel}",
            'Property: ' . ($property?->property_title ?? ''),
            'Address: ' . trim(implode(', ', array_filter([$property?->address, $property?->city, $property?->state, $property?->zip_code]))),
            'Buyer: ' . $showing->buyer_name . ' (' . $showing->buyer_email . ($showing->buyer_phone ? ', ' . $showing->buyer_phone : '') . ')',
        ];
        if ($showing->buyer_notes) {
            $descLines[] = 'Notes: ' . $showing->buyer_notes;
        }
        $description = self::escape(implode("\\n", $descLines));

        $location = $showing->meeting_type === 'in_person'
            ? self::escape(trim(implode(', ', array_filter([$property?->address, $property?->city, $property?->state, $property?->zip_code]))))
            : 'Phone';

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
            'ORGANIZER;CN=' . self::escape($showing->seller?->name ?? 'SaveOnYourHome') . ':mailto:' . ($showing->seller?->email ?? 'noreply@saveonyourhome.com'),
            'ATTENDEE;CN=' . self::escape($showing->buyer_name) . ';RSVP=TRUE:mailto:' . $showing->buyer_email,
            'END:VEVENT',
            'END:VCALENDAR',
        ];

        return implode("\r\n", $lines);
    }

    private static function escape(string $value): string
    {
        return str_replace(["\\", ",", ";", "\n"], ["\\\\", "\\,", "\\;", "\\n"], $value);
    }
}

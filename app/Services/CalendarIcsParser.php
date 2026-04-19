<?php

namespace App\Services;

use Illuminate\Support\Carbon;

/**
 * Minimal iCalendar (RFC 5545) parser just for VEVENT busy-time extraction.
 * Handles the common cases emitted by Google Calendar / Outlook / Apple:
 *   - DTSTART / DTEND with or without TZID
 *   - DTSTART:YYYYMMDDTHHMMSSZ  (UTC)
 *   - DTSTART;TZID=America/...:YYYYMMDDTHHMMSS
 *   - DTSTART;VALUE=DATE:YYYYMMDD  (all-day)
 *   - UID, SUMMARY
 *   - Line folding (CRLF followed by space)
 *   - Simple DURATION in place of DTEND
 *
 * Recurring events (RRULE) are NOT fully expanded — only the first occurrence is
 * captured. For FSBO scheduling that's acceptable: users who need fine-grained
 * recurring busy times can export a dated occurrence list from their calendar.
 */
class CalendarIcsParser
{
    /**
     * @return array<int, array{uid: ?string, summary: ?string, starts_at: \Illuminate\Support\Carbon, ends_at: \Illuminate\Support\Carbon}>
     */
    public static function parse(string $body): array
    {
        // Unfold per RFC 5545 §3.1: a CRLF followed by a space/tab means continuation.
        $body = preg_replace("/\r\n[ \t]/", '', $body);
        $body = preg_replace("/\n[ \t]/", '', $body);

        $lines = preg_split("/\r\n|\n|\r/", $body) ?: [];
        $events = [];
        $current = null;

        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '') continue;

            if ($line === 'BEGIN:VEVENT') {
                $current = ['uid' => null, 'summary' => null, 'starts_at' => null, 'ends_at' => null, 'duration' => null];
                continue;
            }
            if ($line === 'END:VEVENT') {
                if ($current && $current['starts_at']) {
                    if (!$current['ends_at'] && $current['duration']) {
                        $current['ends_at'] = $current['starts_at']->copy()->add($current['duration']);
                    }
                    if (!$current['ends_at']) {
                        $current['ends_at'] = $current['starts_at']->copy()->addHour();
                    }
                    $events[] = [
                        'uid' => $current['uid'],
                        'summary' => $current['summary'],
                        'starts_at' => $current['starts_at'],
                        'ends_at' => $current['ends_at'],
                    ];
                }
                $current = null;
                continue;
            }
            if (!$current) continue;

            // Split "KEY;PARAMS:VALUE" into key, params, value
            $colon = strpos($line, ':');
            if ($colon === false) continue;
            $leftPart = substr($line, 0, $colon);
            $value = substr($line, $colon + 1);

            $semi = strpos($leftPart, ';');
            $name = strtoupper($semi === false ? $leftPart : substr($leftPart, 0, $semi));
            $params = [];
            if ($semi !== false) {
                foreach (explode(';', substr($leftPart, $semi + 1)) as $p) {
                    [$k, $v] = array_pad(explode('=', $p, 2), 2, null);
                    if ($k !== null) $params[strtoupper($k)] = $v;
                }
            }

            switch ($name) {
                case 'UID':
                    $current['uid'] = $value;
                    break;
                case 'SUMMARY':
                    $current['summary'] = self::unescape($value);
                    break;
                case 'DTSTART':
                    $current['starts_at'] = self::parseDateTime($value, $params);
                    break;
                case 'DTEND':
                    $current['ends_at'] = self::parseDateTime($value, $params);
                    break;
                case 'DURATION':
                    $current['duration'] = self::parseDuration($value);
                    break;
            }
        }

        return $events;
    }

    protected static function parseDateTime(string $value, array $params): ?Carbon
    {
        try {
            // All-day (VALUE=DATE, YYYYMMDD)
            if (($params['VALUE'] ?? null) === 'DATE' || strlen($value) === 8) {
                return Carbon::createFromFormat('Ymd', $value, 'UTC')->startOfDay();
            }

            // UTC with trailing Z
            if (str_ends_with($value, 'Z')) {
                return Carbon::createFromFormat('Ymd\THis\Z', $value, 'UTC');
            }

            // Floating or TZ-tagged local time
            $tz = $params['TZID'] ?? 'UTC';
            return Carbon::createFromFormat('Ymd\THis', $value, $tz)->setTimezone('UTC');
        } catch (\Throwable $e) {
            return null;
        }
    }

    protected static function parseDuration(string $value): ?\DateInterval
    {
        // ICS durations: PT1H30M, PT45M, P1D, etc. DateInterval accepts directly.
        try {
            return new \DateInterval($value);
        } catch (\Throwable $e) {
            return null;
        }
    }

    protected static function unescape(string $s): string
    {
        return str_replace(['\\n', '\\,', '\\;', '\\\\'], ["\n", ',', ';', '\\'], $s);
    }
}

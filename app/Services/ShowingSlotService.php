<?php

namespace App\Services;

use App\Models\PropertyShowing;
use App\Models\SellerAvailabilityRule;
use App\Models\User;
use Illuminate\Support\Carbon;

/**
 * Expands a seller's weekly availability rules into concrete bookable slots
 * across a date range, subtracting already-booked (non-cancelled) showings.
 */
class ShowingSlotService
{
    /**
     * Minimum minutes of notice a buyer must give when booking.
     */
    public const MIN_NOTICE_MINUTES = 60;

    /**
     * @return array<int, array{date: string, day: string, slots: array<int, array{start: string, end: string, meeting_types: array<int, string>}>}>
     */
    public function forSeller(User $seller, ?Carbon $from = null, ?Carbon $to = null): array
    {
        $from = ($from ?? Carbon::now())->copy()->startOfDay();
        $to = ($to ?? Carbon::now()->addDays(30))->copy()->endOfDay();

        $rules = SellerAvailabilityRule::query()
            ->where('user_id', $seller->id)
            ->active()
            ->get()
            ->groupBy('day_of_week');

        if ($rules->isEmpty()) {
            return [];
        }

        // Fetch all non-cancelled showings in window once; filter in memory.
        $showings = PropertyShowing::query()
            ->where('seller_user_id', $seller->id)
            ->whereIn('status', ['confirmed', 'completed'])
            ->whereBetween('scheduled_at', [$from, $to])
            ->get(['scheduled_at', 'duration_minutes']);

        $cutoff = Carbon::now()->addMinutes(self::MIN_NOTICE_MINUTES);
        $out = [];

        for ($cursor = $from->copy(); $cursor->lte($to); $cursor->addDay()) {
            $dow = (int) $cursor->dayOfWeek; // 0=Sun..6=Sat
            $dayRules = $rules->get($dow);
            if (!$dayRules) {
                continue;
            }

            $slots = [];
            foreach ($dayRules as $rule) {
                [$sh, $sm] = array_map('intval', explode(':', substr($rule->start_time, 0, 5)));
                [$eh, $em] = array_map('intval', explode(':', substr($rule->end_time, 0, 5)));
                $start = $cursor->copy()->setTime($sh, $sm);
                $end = $cursor->copy()->setTime($eh, $em);
                $duration = max(15, (int) $rule->slot_duration_minutes);

                for ($t = $start->copy(); $t->copy()->addMinutes($duration)->lte($end); $t->addMinutes($duration)) {
                    $slotStart = $t->copy();
                    $slotEnd = $t->copy()->addMinutes($duration);

                    if ($slotStart->lt($cutoff)) {
                        continue;
                    }

                    // Skip if conflicts with any existing showing
                    $conflicts = false;
                    foreach ($showings as $s) {
                        $bStart = $s->scheduled_at;
                        $bEnd = $bStart->copy()->addMinutes((int) $s->duration_minutes);
                        if ($slotStart->lt($bEnd) && $slotEnd->gt($bStart)) {
                            $conflicts = true;
                            break;
                        }
                    }
                    if ($conflicts) {
                        continue;
                    }

                    $types = [];
                    if ($rule->allow_phone) $types[] = 'phone';
                    if ($rule->allow_in_person) $types[] = 'in_person';
                    if (empty($types)) continue;

                    $slots[] = [
                        'start' => $slotStart->toIso8601String(),
                        'end' => $slotEnd->toIso8601String(),
                        'time' => $slotStart->format('H:i'),
                        'label' => $slotStart->format('g:i A'),
                        'meeting_types' => $types,
                        'duration' => $duration,
                    ];
                }
            }

            if (!empty($slots)) {
                // Sort and de-duplicate slots that start at the same time
                usort($slots, fn ($a, $b) => strcmp($a['start'], $b['start']));
                $seen = [];
                $unique = [];
                foreach ($slots as $s) {
                    if (isset($seen[$s['start']])) continue;
                    $seen[$s['start']] = true;
                    $unique[] = $s;
                }

                $out[] = [
                    'date' => $cursor->toDateString(),
                    'day' => $cursor->format('l'),
                    'slots' => $unique,
                ];
            }
        }

        return $out;
    }

    /**
     * Quick check used by the booking controller to make sure a requested
     * slot is still free and matches an active rule.
     */
    public function isSlotValid(User $seller, Carbon $start, int $durationMinutes, string $meetingType): bool
    {
        if ($start->lt(Carbon::now()->addMinutes(self::MIN_NOTICE_MINUTES))) {
            return false;
        }

        $rules = SellerAvailabilityRule::query()
            ->where('user_id', $seller->id)
            ->where('day_of_week', $start->dayOfWeek)
            ->active()
            ->get();

        $matchesRule = $rules->contains(function (SellerAvailabilityRule $rule) use ($start, $durationMinutes, $meetingType) {
            if ($meetingType === 'phone' && !$rule->allow_phone) return false;
            if ($meetingType === 'in_person' && !$rule->allow_in_person) return false;
            if ((int) $rule->slot_duration_minutes !== $durationMinutes) return false;

            [$sh, $sm] = array_map('intval', explode(':', substr($rule->start_time, 0, 5)));
            [$eh, $em] = array_map('intval', explode(':', substr($rule->end_time, 0, 5)));
            $ruleStart = $start->copy()->setTime($sh, $sm);
            $ruleEnd = $start->copy()->setTime($eh, $em);
            $slotEnd = $start->copy()->addMinutes($durationMinutes);

            if ($start->lt($ruleStart) || $slotEnd->gt($ruleEnd)) return false;

            // Slot must align to the rule's grid
            $offset = $start->diffInMinutes($ruleStart);
            return $offset % $durationMinutes === 0;
        });

        if (!$matchesRule) return false;

        // Check for conflicts with existing showings
        $slotEnd = $start->copy()->addMinutes($durationMinutes);
        $conflict = PropertyShowing::query()
            ->where('seller_user_id', $seller->id)
            ->whereIn('status', ['confirmed', 'completed'])
            ->where('scheduled_at', '<', $slotEnd)
            ->whereRaw('DATE_ADD(scheduled_at, INTERVAL duration_minutes MINUTE) > ?', [$start])
            ->exists();

        return !$conflict;
    }
}

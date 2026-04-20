<?php

namespace App\Services;

use App\Mail\ListingAlert;
use App\Models\Property;
use App\Models\SavedSearch;
use App\Models\SavedSearchAlert;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Fires listing alerts when a property becomes live (approved + active).
 *
 * For each SavedSearch where alerts_enabled=true, if the property matches
 * the saved filters and we haven't already alerted that (search, property)
 * pair, send one email and record the ledger row.
 */
class SavedSearchAlertDispatcher
{
    public function __construct(private SavedSearchMatcher $matcher) {}

    public function dispatchForProperty(Property $property): int
    {
        if ($property->approval_status !== 'approved' || !$property->is_active) {
            return 0;
        }

        $sent = 0;

        SavedSearch::query()
            ->where('alerts_enabled', true)
            ->with('user:id,name,email')
            ->chunkById(100, function ($searches) use ($property, &$sent) {
                foreach ($searches as $search) {
                    if (!$search->user?->email) continue;
                    if (!$this->matcher->matches($property, $search)) continue;

                    // Skip if this search already got alerted on this property
                    // (admin could re-approve; we only fire once per pair).
                    $already = SavedSearchAlert::where('saved_search_id', $search->id)
                        ->where('property_id', $property->id)
                        ->exists();
                    if ($already) continue;

                    try {
                        Mail::to($search->user->email)
                            ->send(new ListingAlert($property, $search));

                        SavedSearchAlert::create([
                            'saved_search_id' => $search->id,
                            'property_id' => $property->id,
                            'alerted_at' => now(),
                        ]);
                        $search->forceFill(['last_alerted_at' => now()])->saveQuietly();
                        $sent++;
                    } catch (\Throwable $e) {
                        Log::warning('Listing alert mail failed', [
                            'saved_search_id' => $search->id,
                            'property_id' => $property->id,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }
            });

        return $sent;
    }
}

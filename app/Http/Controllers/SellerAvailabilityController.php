<?php

namespace App\Http\Controllers;

use App\Models\SellerAvailabilityRule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerAvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $rules = SellerAvailabilityRule::where('user_id', $request->user()->id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('Dashboard/Availability', [
            'rules' => $rules,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRule($request);

        SellerAvailabilityRule::create(array_merge($validated, [
            'user_id' => $request->user()->id,
        ]));

        return back()->with('success', 'Availability added.');
    }

    public function update(Request $request, SellerAvailabilityRule $rule)
    {
        abort_unless($rule->user_id === $request->user()->id, 403);
        $validated = $this->validateRule($request);
        $rule->update($validated);

        return back()->with('success', 'Availability updated.');
    }

    public function destroy(Request $request, SellerAvailabilityRule $rule)
    {
        abort_unless($rule->user_id === $request->user()->id, 403);
        $rule->delete();

        return back()->with('success', 'Availability removed.');
    }

    private function validateRule(Request $request): array
    {
        return $request->validate([
            'day_of_week' => 'required|integer|min:0|max:6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'slot_duration_minutes' => 'required|integer|in:15,30,45,60,90,120',
            'allow_phone' => 'boolean',
            'allow_in_person' => 'boolean',
            'is_active' => 'boolean',
        ]);
    }
}

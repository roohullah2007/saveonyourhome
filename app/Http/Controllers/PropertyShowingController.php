<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyShowing;
use App\Services\EmailService;
use App\Services\IcsGenerator;
use App\Services\ShowingSlotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PropertyShowingController extends Controller
{
    public function __construct(private ShowingSlotService $slotService) {}

    /**
     * Public endpoint used by the PropertyDetail modal to render the date/slot picker.
     */
    public function availability(Property $property): JsonResponse
    {
        if (!$property->user_id) {
            return response()->json(['days' => [], 'reason' => 'no_seller']);
        }

        $days = $this->slotService->forSeller(
            $property->user,
            Carbon::now(),
            Carbon::now()->addDays(30),
        );

        return response()->json([
            'seller_name' => $property->user->name ?? 'Seller',
            'days' => $days,
        ]);
    }

    /**
     * Public booking endpoint. Creates a confirmed showing and emails both parties.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'scheduled_at' => 'required|date',
            'duration_minutes' => 'required|integer|min:15|max:240',
            'meeting_type' => 'required|in:phone,in_person',
            'buyer_name' => 'required|string|max:255',
            'buyer_email' => 'required|email|max:255',
            'buyer_phone' => 'nullable|string|max:50',
            'buyer_notes' => 'nullable|string|max:2000',
        ]);

        $property = Property::findOrFail($validated['property_id']);
        abort_unless($property->user_id && $property->user, 422, 'This listing cannot accept showing requests right now.');

        $start = Carbon::parse($validated['scheduled_at']);

        if (!$this->slotService->isSlotValid($property->user, $start, (int) $validated['duration_minutes'], $validated['meeting_type'])) {
            return back()->withErrors(['scheduled_at' => 'That slot is no longer available. Please pick another time.'])->withInput();
        }

        $showing = DB::transaction(function () use ($validated, $property, $start, $request) {
            return PropertyShowing::create([
                'property_id' => $property->id,
                'seller_user_id' => $property->user_id,
                'buyer_user_id' => optional($request->user())->id,
                'buyer_name' => $validated['buyer_name'],
                'buyer_email' => $validated['buyer_email'],
                'buyer_phone' => $validated['buyer_phone'] ?? null,
                'meeting_type' => $validated['meeting_type'],
                'scheduled_at' => $start,
                'duration_minutes' => (int) $validated['duration_minutes'],
                'status' => 'confirmed',
                'buyer_notes' => $validated['buyer_notes'] ?? null,
            ]);
        });

        $showing->load(['property', 'seller']);
        $this->sendConfirmationEmails($showing);

        return back()->with('success', 'Your viewing is confirmed. A calendar invite has been emailed to you.');
    }

    public function showCancel(string $token)
    {
        $showing = PropertyShowing::where('cancellation_token', $token)->with('property', 'seller')->firstOrFail();

        return Inertia::render('CancelShowing', [
            'showing' => [
                'id' => $showing->id,
                'property_title' => $showing->property?->property_title,
                'property_slug' => $showing->property?->slug,
                'scheduled_at' => $showing->scheduled_at->toIso8601String(),
                'meeting_type' => $showing->meeting_type,
                'status' => $showing->status,
                'is_cancellable' => $showing->isCancellable(),
                'seller_name' => $showing->seller?->name,
            ],
            'token' => $token,
        ]);
    }

    public function cancel(Request $request, string $token)
    {
        $showing = PropertyShowing::where('cancellation_token', $token)->firstOrFail();

        abort_unless($showing->isCancellable(), 422, 'This showing can no longer be cancelled.');

        $validated = $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        $showing->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancelled_by' => 'buyer',
            'cancellation_reason' => $validated['reason'] ?? null,
        ]);

        $showing->load(['property', 'seller']);
        $this->sendCancellationEmails($showing, 'buyer');

        return redirect()->route('showings.cancel', $token)->with('success', 'Showing cancelled. The seller has been notified.');
    }

    protected function sendConfirmationEmails(PropertyShowing $showing): void
    {
        $ics = IcsGenerator::forShowing($showing);
        $when = $showing->scheduled_at->format('l, F j \a\t g:i A');
        $typeLabel = $showing->meeting_type === 'phone' ? 'Phone call' : 'In-person showing';
        $propertyTitle = $showing->property?->property_title ?? 'the property';
        $propertyAddress = trim(implode(', ', array_filter([$showing->property?->address, $showing->property?->city, $showing->property?->state])));
        $cancelUrl = route('showings.cancel', $showing->cancellation_token);

        // Buyer
        try {
            Mail::send([], [], function ($m) use ($showing, $ics, $when, $typeLabel, $propertyTitle, $propertyAddress, $cancelUrl) {
                $body = view('emails.showing-confirmed-buyer', [
                    'showing' => $showing,
                    'when' => $when,
                    'typeLabel' => $typeLabel,
                    'propertyTitle' => $propertyTitle,
                    'propertyAddress' => $propertyAddress,
                    'cancelUrl' => $cancelUrl,
                ])->render();
                $m->to($showing->buyer_email, $showing->buyer_name)
                    ->subject("Your viewing is confirmed — {$propertyTitle}")
                    ->html($body)
                    ->attachData($ics, 'viewing.ics', ['mime' => 'text/calendar; charset=UTF-8; method=REQUEST']);
            });
        } catch (\Throwable $e) {
            report($e);
        }

        // Seller
        if ($showing->seller?->email) {
            try {
                Mail::send([], [], function ($m) use ($showing, $ics, $when, $typeLabel, $propertyTitle) {
                    $body = view('emails.showing-received-seller', [
                        'showing' => $showing,
                        'when' => $when,
                        'typeLabel' => $typeLabel,
                        'propertyTitle' => $propertyTitle,
                    ])->render();
                    $m->to($showing->seller->email, $showing->seller->name)
                        ->subject("New viewing booked — {$propertyTitle}")
                        ->html($body)
                        ->attachData($ics, 'viewing.ics', ['mime' => 'text/calendar; charset=UTF-8; method=REQUEST']);
                });
            } catch (\Throwable $e) {
                report($e);
            }
        }

        // Admin — visibility into every booked showing.
        $adminEmail = EmailService::getAdminEmail();
        if ($adminEmail) {
            try {
                Mail::send([], [], function ($m) use ($adminEmail, $showing, $when, $typeLabel, $propertyTitle, $propertyAddress) {
                    $body = view('emails.showing-received-seller', [
                        'showing' => $showing,
                        'when' => $when,
                        'typeLabel' => $typeLabel,
                        'propertyTitle' => $propertyTitle,
                    ])->render();
                    $m->to($adminEmail)
                        ->subject("[Admin] New viewing booked — {$propertyTitle} ({$propertyAddress})")
                        ->html($body);
                });
            } catch (\Throwable $e) {
                report($e);
            }
        }
    }

    protected function sendCancellationEmails(PropertyShowing $showing, string $cancelledBy): void
    {
        $when = $showing->scheduled_at->format('l, F j \a\t g:i A');
        $propertyTitle = $showing->property?->property_title ?? 'the property';

        try {
            Mail::send([], [], function ($m) use ($showing, $when, $propertyTitle, $cancelledBy) {
                $body = view('emails.showing-cancelled', [
                    'showing' => $showing,
                    'when' => $when,
                    'propertyTitle' => $propertyTitle,
                    'cancelledBy' => $cancelledBy,
                    'audience' => 'buyer',
                ])->render();
                $m->to($showing->buyer_email, $showing->buyer_name)
                    ->subject("Viewing cancelled — {$propertyTitle}")
                    ->html($body);
            });
        } catch (\Throwable $e) {
            report($e);
        }

        if ($showing->seller?->email) {
            try {
                Mail::send([], [], function ($m) use ($showing, $when, $propertyTitle, $cancelledBy) {
                    $body = view('emails.showing-cancelled', [
                        'showing' => $showing,
                        'when' => $when,
                        'propertyTitle' => $propertyTitle,
                        'cancelledBy' => $cancelledBy,
                        'audience' => 'seller',
                    ])->render();
                    $m->to($showing->seller->email, $showing->seller->name)
                        ->subject("Viewing cancelled — {$propertyTitle}")
                        ->html($body);
                });
            } catch (\Throwable $e) {
                report($e);
            }
        }

        // Admin — also notified on cancellations.
        $adminEmail = EmailService::getAdminEmail();
        if ($adminEmail) {
            try {
                Mail::send([], [], function ($m) use ($adminEmail, $showing, $when, $propertyTitle, $cancelledBy) {
                    $body = view('emails.showing-cancelled', [
                        'showing' => $showing,
                        'when' => $when,
                        'propertyTitle' => $propertyTitle,
                        'cancelledBy' => $cancelledBy,
                        'audience' => 'seller',
                    ])->render();
                    $m->to($adminEmail)
                        ->subject("[Admin] Viewing cancelled — {$propertyTitle}")
                        ->html($body);
                });
            } catch (\Throwable $e) {
                report($e);
            }
        }
    }
}

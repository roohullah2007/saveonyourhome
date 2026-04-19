<?php

namespace App\Http\Controllers;

use App\Models\PropertyShowing;
use App\Services\IcsGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class SellerShowingsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $upcoming = PropertyShowing::where('seller_user_id', $user->id)
            ->where('status', 'confirmed')
            ->where('scheduled_at', '>=', now())
            ->with('property:id,property_title,address,city,state,slug')
            ->orderBy('scheduled_at')
            ->get();

        $past = PropertyShowing::where('seller_user_id', $user->id)
            ->where(function ($q) {
                $q->where('status', '!=', 'confirmed')
                    ->orWhere('scheduled_at', '<', now());
            })
            ->with('property:id,property_title,address,city,state,slug')
            ->orderByDesc('scheduled_at')
            ->limit(50)
            ->get();

        return Inertia::render('Dashboard/Showings', [
            'upcoming' => $upcoming,
            'past' => $past,
        ]);
    }

    public function cancel(Request $request, PropertyShowing $showing)
    {
        abort_unless($showing->seller_user_id === $request->user()->id, 403);
        abort_unless($showing->isCancellable(), 422, 'This showing can no longer be cancelled.');

        $validated = $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        $showing->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancelled_by' => 'seller',
            'cancellation_reason' => $validated['reason'] ?? null,
        ]);

        $showing->load(['property', 'seller']);
        $this->notifyBuyerOfCancellation($showing);

        return back()->with('success', 'Showing cancelled and buyer notified.');
    }

    public function complete(Request $request, PropertyShowing $showing)
    {
        abort_unless($showing->seller_user_id === $request->user()->id, 403);

        $showing->update(['status' => 'completed']);

        return back()->with('success', 'Showing marked as completed.');
    }

    protected function notifyBuyerOfCancellation(PropertyShowing $showing): void
    {
        $when = $showing->scheduled_at->format('l, F j \a\t g:i A');
        $propertyTitle = $showing->property?->property_title ?? 'the property';

        try {
            Mail::send([], [], function ($m) use ($showing, $when, $propertyTitle) {
                $body = view('emails.showing-cancelled', [
                    'showing' => $showing,
                    'when' => $when,
                    'propertyTitle' => $propertyTitle,
                    'cancelledBy' => 'seller',
                    'audience' => 'buyer',
                ])->render();
                $m->to($showing->buyer_email, $showing->buyer_name)
                    ->subject("Viewing cancelled — {$propertyTitle}")
                    ->html($body);
            });
        } catch (\Throwable $e) {
            report($e);
        }
    }
}

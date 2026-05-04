<?php

namespace App\Http\Controllers;

use App\Models\PropertyShowing;
use App\Services\EmailService;
use App\Services\IcsGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class SellerShowingsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $baseQuery = fn () => PropertyShowing::query()
            ->where(function ($q) use ($user) {
                $q->where('seller_user_id', $user->id)
                    ->orWhere('buyer_user_id', $user->id);
            })
            ->with([
                'property:id,property_title,address,city,state,slug',
                'seller:id,name,email',
            ]);

        $upcoming = $baseQuery()
            ->where('status', 'confirmed')
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at')
            ->get();

        $past = $baseQuery()
            ->where(function ($q) {
                $q->where('status', '!=', 'confirmed')
                    ->orWhere('scheduled_at', '<', now());
            })
            ->orderByDesc('scheduled_at')
            ->limit(50)
            ->get();

        $decorate = function (PropertyShowing $s) use ($user) {
            $role = $s->seller_user_id === $user->id ? 'seller' : 'buyer';
            $data = $s->toArray();
            $data['viewer_role'] = $role;
            $data['seller_name'] = $s->seller?->name;
            return $data;
        };

        return Inertia::render('Dashboard/Showings', [
            'upcoming' => $upcoming->map($decorate)->values(),
            'past' => $past->map($decorate)->values(),
        ]);
    }

    public function cancel(Request $request, PropertyShowing $showing)
    {
        $user = $request->user();
        $isSeller = $showing->seller_user_id === $user->id;
        $isBuyer = $showing->buyer_user_id === $user->id;
        abort_unless($isSeller || $isBuyer, 403);
        abort_unless($showing->isCancellable(), 422, 'This showing can no longer be cancelled.');

        $validated = $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        $cancelledBy = $isSeller ? 'seller' : 'buyer';

        $showing->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancelled_by' => $cancelledBy,
            'cancellation_reason' => $validated['reason'] ?? null,
        ]);

        $showing->load(['property', 'seller']);
        $this->notifyCounterpartyOfCancellation($showing, $cancelledBy);

        $msg = $isSeller ? 'Showing cancelled and buyer notified.' : 'Showing cancelled. The seller has been notified.';

        return back()->with('success', $msg);
    }

    public function complete(Request $request, PropertyShowing $showing)
    {
        abort_unless($showing->seller_user_id === $request->user()->id, 403);

        $showing->update(['status' => 'completed']);

        return back()->with('success', 'Showing marked as completed.');
    }

    protected function notifyCounterpartyOfCancellation(PropertyShowing $showing, string $cancelledBy): void
    {
        $when = $showing->scheduled_at->format('l, F j \a\t g:i A');
        $propertyTitle = $showing->property?->property_title ?? 'the property';

        // Notify buyer when seller cancels, or seller when buyer cancels.
        if ($cancelledBy === 'seller') {
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
            return;
        }

        if ($showing->seller?->email) {
            try {
                Mail::send([], [], function ($m) use ($showing, $when, $propertyTitle) {
                    $body = view('emails.showing-cancelled', [
                        'showing' => $showing,
                        'when' => $when,
                        'propertyTitle' => $propertyTitle,
                        'cancelledBy' => 'buyer',
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

        // Admin — get a copy of every showing cancellation regardless of who cancelled.
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

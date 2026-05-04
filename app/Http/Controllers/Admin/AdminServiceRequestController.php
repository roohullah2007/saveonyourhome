<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ServiceRequestReceived;
use App\Mail\ServiceRequestToAdmin;
use App\Models\ActivityLog;
use App\Models\Property;
use App\Models\ServiceRequest;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminServiceRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = ServiceRequest::with(['user', 'property'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by service type
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('service_type', $request->type);
        }

        // Search by user name, email, or property address
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })->orWhereHas('property', function ($pq) use ($search) {
                    $pq->where('address', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%");
                })->orWhere('notes', 'like', "%{$search}%");
            });
        }

        $serviceRequests = $query->paginate(20)->withQueryString();

        // Get counts for status tabs
        $counts = [
            'all' => ServiceRequest::count(),
            'pending' => ServiceRequest::where('status', 'pending')->count(),
            'approved' => ServiceRequest::where('status', 'approved')->count(),
            'in_progress' => ServiceRequest::where('status', 'in_progress')->count(),
            'completed' => ServiceRequest::where('status', 'completed')->count(),
            'cancelled' => ServiceRequest::where('status', 'cancelled')->count(),
        ];

        return Inertia::render('Admin/ServiceRequests/Index', [
            'serviceRequests' => $serviceRequests,
            'counts' => $counts,
            'filters' => $request->only(['status', 'type', 'search']),
        ]);
    }

    public function updateStatus(Request $request, ServiceRequest $serviceRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,in_progress,completed,cancelled',
        ]);

        $oldStatus = $serviceRequest->status;
        $serviceRequest->status = $validated['status'];
        $serviceRequest->processed_by = auth()->id();
        $serviceRequest->processed_at = now();

        if ($validated['status'] === 'completed') {
            $serviceRequest->completed_at = now();
        }

        $serviceRequest->save();

        ActivityLog::log(
            'service_request_status_updated',
            $serviceRequest->property,
            ['status' => $oldStatus],
            ['status' => $validated['status']],
            "Updated service request #{$serviceRequest->id} status from {$oldStatus} to {$validated['status']}"
        );

        return back()->with('success', 'Service request status updated successfully.');
    }

    public function addNote(Request $request, ServiceRequest $serviceRequest)
    {
        $validated = $request->validate([
            'admin_notes' => 'required|string|max:2000',
        ]);

        $serviceRequest->update([
            'admin_notes' => $validated['admin_notes'],
        ]);

        return back()->with('success', 'Admin note saved successfully.');
    }

    /**
     * Admin places a yard sign / QR sticker order on behalf of a seller.
     * Bypasses the ownership check used by the seller-side endpoint, but
     * still records the order under the property owner's user_id so the
     * downstream emails go to the right person.
     */
    public function storeOnBehalf(Request $request, Property $property)
    {
        $validated = $request->validate([
            'service_type' => 'required|in:yard_sign,qr_stickers',
            'shipping_name' => 'required|string|max:255',
            'shipping_address' => 'required|string|max:255',
            'shipping_city' => 'required|string|max:100',
            'shipping_state' => 'required|string|max:50',
            'shipping_zip' => 'required|string|max:20',
            'shipping_phone' => 'required|string|max:20',
            'quantity' => 'nullable|integer|min:1|max:10',
            'notes' => 'nullable|string|max:1000',
        ]);

        $existingRequest = $property->serviceRequests()
            ->where('service_type', $validated['service_type'])
            ->whereIn('status', ['pending', 'approved', 'in_progress'])
            ->first();

        if ($existingRequest) {
            return back()->withErrors(['service_type' => 'This property already has a pending order for that item.']);
        }

        $shippingInfo = "Ship to:\n" .
            $validated['shipping_name'] . "\n" .
            $validated['shipping_address'] . "\n" .
            $validated['shipping_city'] . ', ' . $validated['shipping_state'] . ' ' . $validated['shipping_zip'] . "\n" .
            'Phone: ' . $validated['shipping_phone'];

        if ($validated['service_type'] === 'qr_stickers') {
            $shippingInfo .= "\nQuantity: " . ($validated['quantity'] ?? 2) . ' stickers';
        }

        if ($validated['service_type'] === 'yard_sign') {
            $listingUrl = url('/properties/' . ($property->slug ?: $property->id));
            $qrImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=' . urlencode($listingUrl);
            $shippingInfo .= "\n\n— Print details —" .
                "\nProperty address: " . trim($property->address . ', ' . $property->city . ', ' . $property->state . ' ' . $property->zip_code, ', ') .
                "\nListing URL: " . $listingUrl .
                "\nQR code (500×500 PNG): " . $qrImageUrl;
        }

        if (!empty($validated['notes'])) {
            $shippingInfo .= "\n\nAdmin notes (placed on behalf of seller): " . $validated['notes'];
        } else {
            $shippingInfo .= "\n\nPlaced by admin on behalf of seller (admin: " . (auth()->user()?->email ?: 'unknown') . ').';
        }

        $serviceRequest = ServiceRequest::create([
            'user_id' => $property->user_id,
            'property_id' => $property->id,
            'service_type' => $validated['service_type'],
            'notes' => $shippingInfo,
            'admin_notes' => 'Placed by admin on behalf of seller.',
            'status' => 'pending',
            'processed_by' => auth()->id(),
            'processed_at' => now(),
        ]);

        $serviceRequest->load(['user', 'property']);

        if ($serviceRequest->user && $serviceRequest->user->email) {
            EmailService::sendToUserAndAdmin(
                $serviceRequest->user->email,
                new ServiceRequestReceived($serviceRequest),
                new ServiceRequestToAdmin($serviceRequest)
            );
        }

        ActivityLog::log(
            'admin_placed_service_request',
            $property,
            null,
            ['service_request_id' => $serviceRequest->id, 'service_type' => $validated['service_type']],
            "Admin placed a {$validated['service_type']} order on behalf of {$property->user_id}"
        );

        $itemName = $validated['service_type'] === 'qr_stickers' ? 'QR stickers' : 'yard sign';
        return back()->with('success', "Order placed on behalf of seller — {$itemName} request #{$serviceRequest->id} created.");
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminMediaOrderController extends Controller
{
    /**
     * Display a listing of media orders
     */
    public function index(Request $request)
    {
        $query = MediaOrder::with(['user', 'property', 'processor']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('address', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by MLS
        if ($request->has('has_mls') && $request->has_mls) {
            $query->whereNotNull('mls_package');
        }

        // Filter by broker assisted
        if ($request->has('broker_assisted') && $request->broker_assisted) {
            $query->where('broker_assisted', true);
        }

        $orders = $query->latest()->paginate(15);

        // Get counts for status tabs
        $counts = [
            'all' => MediaOrder::count(),
            'pending' => MediaOrder::where('status', 'pending')->count(),
            'confirmed' => MediaOrder::where('status', 'confirmed')->count(),
            'scheduled' => MediaOrder::where('status', 'scheduled')->count(),
            'in_progress' => MediaOrder::where('status', 'in_progress')->count(),
            'completed' => MediaOrder::where('status', 'completed')->count(),
            'cancelled' => MediaOrder::where('status', 'cancelled')->count(),
        ];

        return Inertia::render('Admin/MediaOrders/Index', [
            'orders' => $orders,
            'counts' => $counts,
            'filters' => $request->only(['status', 'search', 'has_mls', 'broker_assisted']),
        ]);
    }

    /**
     * Show a specific media order
     */
    public function show(MediaOrder $mediaOrder)
    {
        return Inertia::render('Admin/MediaOrders/Show', [
            'order' => $mediaOrder->load(['user', 'property', 'processor']),
        ]);
    }

    /**
     * Update media order status
     */
    public function updateStatus(Request $request, MediaOrder $mediaOrder)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,scheduled,in_progress,completed,cancelled',
            'admin_notes' => 'nullable|string|max:2000',
            'scheduled_at' => 'nullable|date',
        ]);

        $updateData = [
            'status' => $validated['status'],
            'processed_by' => Auth::id(),
            'processed_at' => now(),
        ];

        if (isset($validated['admin_notes'])) {
            $updateData['admin_notes'] = $validated['admin_notes'];
        }

        if (isset($validated['scheduled_at'])) {
            $updateData['scheduled_at'] = $validated['scheduled_at'];
        }

        $mediaOrder->update($updateData);

        return back()->with('success', 'Order status updated successfully.');
    }

    /**
     * Mark order as paid
     */
    public function markPaid(Request $request, MediaOrder $mediaOrder)
    {
        $validated = $request->validate([
            'payment_method' => 'required|in:venmo,cashapp,paypal,cash,check',
            'payment_reference' => 'nullable|string|max:255',
        ]);

        $mediaOrder->update([
            'is_paid' => true,
            'paid_at' => now(),
            'payment_method' => $validated['payment_method'],
            'payment_reference' => $validated['payment_reference'] ?? null,
        ]);

        return back()->with('success', 'Order marked as paid.');
    }

    /**
     * Add admin notes
     */
    public function addNotes(Request $request, MediaOrder $mediaOrder)
    {
        $validated = $request->validate([
            'admin_notes' => 'required|string|max:2000',
        ]);

        $mediaOrder->update([
            'admin_notes' => $validated['admin_notes'],
        ]);

        return back()->with('success', 'Notes updated.');
    }

    /**
     * Schedule an order
     */
    public function schedule(Request $request, MediaOrder $mediaOrder)
    {
        $validated = $request->validate([
            'scheduled_at' => 'required|date|after:now',
        ]);

        $mediaOrder->update([
            'scheduled_at' => $validated['scheduled_at'],
            'status' => 'scheduled',
            'processed_by' => Auth::id(),
            'processed_at' => now(),
        ]);

        return back()->with('success', 'Order scheduled successfully.');
    }

    /**
     * Delete a media order
     */
    public function destroy(MediaOrder $mediaOrder)
    {
        $mediaOrder->delete();

        return redirect()->route('admin.media-orders.index')
            ->with('success', 'Order deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\ServiceRequest;
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
}

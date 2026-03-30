<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminInquiryController extends Controller
{
    public function index(Request $request)
    {
        $query = Inquiry::with(['property', 'user']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $inquiries = $query->latest()
            ->paginate(15)
            ->withQueryString();

        // Get counts for tabs
        $counts = [
            'all' => Inquiry::count(),
            'new' => Inquiry::where('status', 'new')->count(),
            'read' => Inquiry::where('status', 'read')->count(),
            'responded' => Inquiry::where('status', 'responded')->count(),
            'archived' => Inquiry::where('status', 'archived')->count(),
        ];

        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => $inquiries,
            'filters' => $request->only(['search', 'status', 'type']),
            'counts' => $counts,
        ]);
    }

    public function show(Inquiry $inquiry)
    {
        $inquiry->load(['property', 'user']);

        // Mark as read when viewed
        $inquiry->markAsRead();

        return Inertia::render('Admin/Inquiries/Show', [
            'inquiry' => $inquiry,
        ]);
    }

    public function update(Request $request, Inquiry $inquiry)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,read,responded,archived',
            'admin_notes' => 'nullable|string',
        ]);

        $oldValues = $inquiry->toArray();

        if ($validated['status'] === 'responded' && $inquiry->status !== 'responded') {
            $validated['responded_at'] = now();
        }

        $inquiry->update($validated);

        ActivityLog::log('inquiry_updated', $inquiry, $oldValues, $validated, "Updated inquiry from {$inquiry->name}");

        return back()->with('success', 'Inquiry updated successfully.');
    }

    public function destroy(Inquiry $inquiry)
    {
        $inquiryName = $inquiry->name;

        ActivityLog::log('inquiry_deleted', $inquiry, $inquiry->toArray(), null, "Deleted inquiry from {$inquiryName}");

        $inquiry->delete();

        return redirect()->route('admin.inquiries.index')
            ->with('success', 'Inquiry deleted successfully.');
    }

    public function markAsRead(Inquiry $inquiry)
    {
        $inquiry->markAsRead();

        return back()->with('success', 'Marked as read.');
    }

    public function markAsResponded(Inquiry $inquiry)
    {
        $inquiry->markAsResponded();

        ActivityLog::log('inquiry_responded', $inquiry, null, null, "Responded to inquiry from {$inquiry->name}");

        return back()->with('success', 'Marked as responded.');
    }

    public function archive(Inquiry $inquiry)
    {
        $inquiry->update(['status' => 'archived']);

        return back()->with('success', 'Inquiry archived.');
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:inquiries,id',
            'action' => 'required|in:read,responded,archive,delete',
        ]);

        $inquiries = Inquiry::whereIn('id', $request->ids)->get();

        foreach ($inquiries as $inquiry) {
            switch ($request->action) {
                case 'read':
                    $inquiry->markAsRead();
                    break;
                case 'responded':
                    $inquiry->markAsResponded();
                    break;
                case 'archive':
                    $inquiry->update(['status' => 'archived']);
                    break;
                case 'delete':
                    $inquiry->delete();
                    break;
            }
        }

        ActivityLog::log("bulk_{$request->action}_inquiries", null, null, ['count' => count($request->ids)], "Bulk action: {$request->action} on " . count($request->ids) . " inquiries");

        return back()->with('success', 'Bulk action completed successfully.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminContactController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactMessage::query();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $messages = $query->latest()
            ->paginate(15)
            ->withQueryString();

        // Get counts for tabs
        $counts = [
            'all' => ContactMessage::count(),
            'new' => ContactMessage::where('status', 'new')->count(),
            'read' => ContactMessage::where('status', 'read')->count(),
            'responded' => ContactMessage::where('status', 'responded')->count(),
            'archived' => ContactMessage::where('status', 'archived')->count(),
        ];

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
            'filters' => $request->only(['search', 'status']),
            'counts' => $counts,
        ]);
    }

    public function show(ContactMessage $message)
    {
        // Mark as read when viewed
        $message->markAsRead();

        return Inertia::render('Admin/Messages/Show', [
            'message' => $message,
        ]);
    }

    public function update(Request $request, ContactMessage $message)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,read,responded,archived',
            'admin_notes' => 'nullable|string',
        ]);

        $oldValues = $message->toArray();

        if ($validated['status'] === 'responded' && $message->status !== 'responded') {
            $validated['responded_at'] = now();
        }

        $message->update($validated);

        ActivityLog::log('message_updated', $message, $oldValues, $validated, "Updated message from {$message->name}");

        return back()->with('success', 'Message updated successfully.');
    }

    public function destroy(ContactMessage $message)
    {
        $messageName = $message->name;

        ActivityLog::log('message_deleted', $message, $message->toArray(), null, "Deleted message from {$messageName}");

        $message->delete();

        return redirect()->route('admin.messages.index')
            ->with('success', 'Message deleted successfully.');
    }

    public function markAsRead(ContactMessage $message)
    {
        $message->markAsRead();

        return back()->with('success', 'Marked as read.');
    }

    public function markAsResponded(ContactMessage $message)
    {
        $message->markAsResponded();

        ActivityLog::log('message_responded', $message, null, null, "Responded to message from {$message->name}");

        return back()->with('success', 'Marked as responded.');
    }

    public function archive(ContactMessage $message)
    {
        $message->update(['status' => 'archived']);

        return back()->with('success', 'Message archived.');
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_messages,id',
            'action' => 'required|in:read,responded,archive,delete',
        ]);

        $messages = ContactMessage::whereIn('id', $request->ids)->get();

        foreach ($messages as $message) {
            switch ($request->action) {
                case 'read':
                    $message->markAsRead();
                    break;
                case 'responded':
                    $message->markAsResponded();
                    break;
                case 'archive':
                    $message->update(['status' => 'archived']);
                    break;
                case 'delete':
                    $message->delete();
                    break;
            }
        }

        ActivityLog::log("bulk_{$request->action}_messages", null, null, ['count' => count($request->ids)], "Bulk action: {$request->action} on " . count($request->ids) . " messages");

        return back()->with('success', 'Bulk action completed successfully.');
    }
}

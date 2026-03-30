<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by action
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        // Filter by model type
        if ($request->filled('model')) {
            $query->where('model_type', 'like', "%{$request->model}%");
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->latest()
            ->paginate(25)
            ->withQueryString();

        // Get unique actions for filter dropdown
        $actions = ActivityLog::distinct()->pluck('action');

        // Get unique model types for filter dropdown
        $modelTypes = ActivityLog::distinct()
            ->whereNotNull('model_type')
            ->pluck('model_type')
            ->map(fn($type) => class_basename($type));

        return Inertia::render('Admin/Activity/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'action', 'model', 'user_id', 'date_from', 'date_to']),
            'actions' => $actions,
            'modelTypes' => $modelTypes,
        ]);
    }

    public function show(ActivityLog $activity)
    {
        $activity->load('user');

        return Inertia::render('Admin/Activity/Show', [
            'activity' => $activity,
        ]);
    }

    public function clear(Request $request)
    {
        $request->validate([
            'older_than' => 'required|integer|min:7', // Days
        ]);

        $date = now()->subDays($request->older_than);
        $count = ActivityLog::where('created_at', '<', $date)->count();

        ActivityLog::where('created_at', '<', $date)->delete();

        ActivityLog::log('activity_logs_cleared', null, null, ['count' => $count, 'older_than_days' => $request->older_than], "Cleared {$count} activity logs older than {$request->older_than} days");

        return back()->with('success', "Deleted {$count} activity logs older than {$request->older_than} days.");
    }
}

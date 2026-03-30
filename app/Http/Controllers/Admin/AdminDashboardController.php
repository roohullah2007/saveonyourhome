<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\User;
use App\Models\Inquiry;
use App\Models\ContactMessage;
use App\Models\ActivityLog;
use App\Models\ImportBatch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Get statistics
        $stats = [
            'total_properties' => Property::count(),
            'active_properties' => Property::active()->approved()->count(),
            'pending_properties' => Property::pending()->count(),
            'featured_properties' => Property::featured()->count(),
            'total_users' => User::count(),
            'sellers' => User::where('role', 'seller')->count(),
            'buyers' => User::where('role', 'buyer')->count(),
            'new_inquiries' => Inquiry::new()->count(),
            'unread_messages' => ContactMessage::unread()->count(),
            'total_views' => Property::sum('views'),
        ];

        // Recent properties
        $recentProperties = Property::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($property) {
                return [
                    'id' => $property->id,
                    'title' => $property->property_title,
                    'price' => $property->formatted_price,
                    'status' => $property->status,
                    'approval_status' => $property->approval_status,
                    'owner' => $property->user?->name ?? $property->contact_name,
                    'created_at' => $property->created_at->diffForHumans(),
                    'views' => $property->views,
                ];
            });

        // Recent users
        $recentUsers = User::latest()
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_active' => $user->is_active,
                    'created_at' => $user->created_at->diffForHumans(),
                ];
            });

        // Recent inquiries
        $recentInquiries = Inquiry::with('property')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($inquiry) {
                return [
                    'id' => $inquiry->id,
                    'name' => $inquiry->name,
                    'email' => $inquiry->email,
                    'property' => $inquiry->property?->property_title,
                    'type' => $inquiry->type,
                    'status' => $inquiry->status,
                    'created_at' => $inquiry->created_at->diffForHumans(),
                ];
            });

        // Recent activity
        $recentActivity = ActivityLog::with('user')
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'user' => $log->user?->name ?? 'System',
                    'action' => $log->action_label,
                    'description' => $log->description,
                    'model_type' => class_basename($log->model_type ?? ''),
                    'created_at' => $log->created_at->diffForHumans(),
                ];
            });

        // Import stats
        $importStats = [
            'total_imported' => ImportBatch::sum('imported_count'),
            'total_claimed' => ImportBatch::sum('claimed_count'),
            'unclaimed' => ImportBatch::sum('imported_count') - ImportBatch::sum('claimed_count'),
            'active_batches' => ImportBatch::active()->count(),
        ];

        // Monthly stats for charts (last 6 months)
        $monthlyStats = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthlyStats[] = [
                'month' => $date->format('M'),
                'properties' => Property::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->count(),
                'users' => User::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->count(),
                'inquiries' => Inquiry::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->count(),
            ];
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentProperties' => $recentProperties,
            'recentUsers' => $recentUsers,
            'recentInquiries' => $recentInquiries,
            'recentActivity' => $recentActivity,
            'monthlyStats' => $monthlyStats,
            'importStats' => $importStats,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ebook;
use App\Models\EbookDownload;
use App\Models\Inquiry;
use App\Models\Property;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminAnalyticsController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $last7 = $now->copy()->subDays(7);
        $last30 = $now->copy()->subDays(30);

        // Headline counters
        $stats = [
            'total_ebooks' => Ebook::count(),
            'active_ebooks' => Ebook::active()->count(),
            'total_downloads' => EbookDownload::count(),
            'downloads_7d' => EbookDownload::where('created_at', '>=', $last7)->count(),
            'downloads_30d' => EbookDownload::where('created_at', '>=', $last30)->count(),
            'unique_downloaders_30d' => EbookDownload::where('created_at', '>=', $last30)
                ->whereNotNull('user_id')->distinct('user_id')->count('user_id'),
            'total_users' => User::count(),
            'new_users_7d' => User::where('created_at', '>=', $last7)->count(),
            'total_properties' => Property::count(),
            'approved_properties' => Property::where('approval_status', 'approved')->count(),
            'new_listings_7d' => Property::where('created_at', '>=', $last7)->count(),
            'new_inquiries_7d' => Inquiry::where('created_at', '>=', $last7)->count(),
        ];

        // Top-downloaded ebooks
        $topEbooks = Ebook::query()
            ->orderByDesc('download_count')
            ->limit(10)
            ->get(['id', 'title', 'slug', 'cover_path', 'download_count']);

        // Downloads per day for the last 30 days. Pad the result so every
        // day in the window appears (zero-count days included) — otherwise
        // a single download renders as one full-width bar instead of a
        // small spike on the correct day.
        $countsByDate = EbookDownload::query()
            ->where('created_at', '>=', $last30)
            ->selectRaw('DATE(created_at) as d, COUNT(*) as c')
            ->groupBy('d')
            ->pluck('c', 'd');

        $downloadSeries = [];
        for ($i = 29; $i >= 0; $i--) {
            $day = $now->copy()->subDays($i)->toDateString();
            $downloadSeries[] = ['date' => $day, 'count' => (int) ($countsByDate[$day] ?? 0)];
        }

        // Recent downloads log (last 50)
        $recentDownloads = EbookDownload::query()
            ->with([
                'ebook:id,title,slug',
                'user:id,name,email',
            ])
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        return Inertia::render('Admin/Analytics/Index', [
            'stats' => $stats,
            'topEbooks' => $topEbooks,
            'downloadSeries' => $downloadSeries,
            'recentDownloads' => $recentDownloads,
        ]);
    }
}

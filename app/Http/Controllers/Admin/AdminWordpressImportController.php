<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\ImportBatch;
use App\Services\Houzez\HouzezDb;
use App\Services\Houzez\WordpressImporter;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Admin UI for the WordPress (Houzez) → Laravel import flow.
 *
 * The legacy DB connection (`wp_legacy`) is expected to already hold the
 * dump — see WP_LEGACY_DB_* env vars and config/database.php. This page
 * shows what's in there and lets an admin kick off any subset of the
 * importers (users / taxonomies / listings / posts).
 */
class AdminWordpressImportController extends Controller
{
    public function index()
    {
        $available = HouzezDb::isAvailable();
        $summary = $available ? HouzezDb::summary() : null;

        $recentBatches = ImportBatch::where('source', 'houzez')
            ->latest()
            ->limit(10)
            ->get(['id', 'imported_count', 'failed_count', 'expires_at', 'notes', 'created_at']);

        return Inertia::render('Admin/WordpressImport/Index', [
            'available' => $available,
            'summary' => $summary,
            'recentBatches' => $recentBatches,
            'connection' => [
                'name' => HouzezDb::CONNECTION,
                'database' => config('database.connections.wp_legacy.database'),
                'host' => config('database.connections.wp_legacy.host'),
            ],
        ]);
    }

    public function run(Request $request)
    {
        $request->validate([
            'users' => 'nullable|boolean',
            'taxonomies' => 'nullable|boolean',
            'listings' => 'nullable|boolean',
            'posts' => 'nullable|boolean',
            'download_images' => 'nullable|boolean',
            'limit' => 'nullable|integer|min:1|max:10000',
            'notes' => 'nullable|string|max:1000',
        ]);

        if (!HouzezDb::isAvailable()) {
            return back()->withErrors([
                'connection' => 'Legacy WordPress DB not reachable on connection "' . HouzezDb::CONNECTION
                    . '". Load the dump first and re-check WP_LEGACY_DB_* env vars.',
            ]);
        }

        $doUsers = (bool) $request->boolean('users');
        $doTax = (bool) $request->boolean('taxonomies');
        $doListings = (bool) $request->boolean('listings');
        $doPosts = (bool) $request->boolean('posts');

        if (!($doUsers || $doTax || $doListings || $doPosts)) {
            return back()->withErrors(['flags' => 'Pick at least one section to import.']);
        }

        $batch = null;
        if ($doListings) {
            $batch = WordpressImporter::createBatch(
                auth()->id(),
                $request->input('notes'),
                90,
            );
        }

        // Run synchronously — for 170 listings this completes in seconds.
        // Image downloads are queued separately by the property importer.
        try {
            $importer = new WordpressImporter(
                importUsers: $doUsers,
                importTaxonomies: $doTax,
                importProperties: $doListings,
                importPosts: $doPosts,
                downloadImages: (bool) $request->boolean('download_images', true),
                propertyLimit: $request->filled('limit') ? (int) $request->input('limit') : null,
            );
            $report = $importer->run($batch);
        } catch (\Throwable $e) {
            report($e);
            return back()->withErrors(['run' => 'Import failed: ' . $e->getMessage()]);
        }

        ActivityLog::log(
            'wordpress_import_run',
            $batch,
            null,
            null,
            'WordPress import completed: ' . json_encode($this->summariseReport($report))
        );

        $message = $this->buildFlashMessage($report, $batch);

        if ($batch) {
            return redirect()->route('admin.imports.show', $batch)->with('success', $message);
        }
        return redirect()->route('admin.wordpress-import.index')->with('success', $message);
    }

    private function summariseReport(array $report): array
    {
        $out = [];
        foreach ($report as $section => $data) {
            if ($section === 'summary') continue;
            if (!is_array($data)) { $out[$section] = $data; continue; }
            $out[$section] = array_filter($data, fn ($v) => !is_array($v));
        }
        return $out;
    }

    private function buildFlashMessage(array $report, ?ImportBatch $batch): string
    {
        $parts = [];
        if (isset($report['users'])) {
            $parts[] = "users: {$report['users']['imported']} new / {$report['users']['updated']} updated";
        }
        if (isset($report['taxonomies'])) {
            $parts[] = "taxonomies: {$report['taxonomies']['imported']}";
        }
        if (isset($report['properties'])) {
            $p = $report['properties'];
            $parts[] = "listings: {$p['imported']} new / {$p['updated']} updated, {$p['image_jobs']} images queued";
        }
        if (isset($report['posts'])) {
            $parts[] = "posts: {$report['posts']['imported']} new / {$report['posts']['updated']} updated";
        }
        $msg = 'WordPress import complete — ' . implode(', ', $parts);
        if ($batch) $msg .= ". Batch #{$batch->id}.";
        return $msg;
    }
}

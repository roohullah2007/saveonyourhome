<?php

namespace App\Services\Houzez;

use App\Models\ImportBatch;
use Illuminate\Support\Facades\DB;

/**
 * Top-level orchestrator for the WordPress (Houzez) → Laravel import.
 *
 * The expected sequence is:
 *  1. Taxonomies — populate `taxonomy_terms` so step 3 can resolve term keys.
 *  2. Users — `wp_users` → `users`. Returns wp_id → laravel_id map.
 *  3. Properties — `wp_posts` (post_type=property) + postmeta + relationships.
 *     Queues image-download jobs.
 *  4. Posts — `wp_posts` (post_type=post) → `resources`.
 *
 * Each step is idempotent (matched on wp_id), so a failed run can be retried
 * without producing duplicates.
 */
class WordpressImporter
{
    public function __construct(
        private readonly bool $importUsers = true,
        private readonly bool $importTaxonomies = true,
        private readonly bool $importProperties = true,
        private readonly bool $importPosts = true,
        private readonly bool $downloadImages = true,
        private readonly ?int $propertyLimit = null,
    ) {}

    public function run(?ImportBatch $batch = null): array
    {
        if (!HouzezDb::isAvailable()) {
            throw new \RuntimeException(
                'Legacy WordPress DB is not reachable on connection "' . HouzezDb::CONNECTION
                . '". Load the .sql dump first (mysql -u root saveonyourhomeold < saveonyourhomeold.sql) '
                . 'and check the WP_LEGACY_DB_* env vars.'
            );
        }

        $report = ['summary' => HouzezDb::summary()];

        // 1. Taxonomies — always loaded (needed by property mapper) but only
        //    *written* when explicitly requested.
        $taxImporter = new HouzezTaxonomyImporter();
        if ($this->importTaxonomies) {
            $report['taxonomies'] = $taxImporter->run();
            $termMap = $report['taxonomies']['term_map'];
        } else {
            $termMap = $taxImporter->loadTermMap();
        }

        // 2. Users
        $userMap = [];
        if ($this->importUsers) {
            $report['users'] = (new HouzezUserImporter())->run();
            $userMap = $report['users']['user_map'];
        } else {
            $userMap = $this->loadUserMap();
        }

        // 3. Properties (queues image jobs)
        if ($this->importProperties) {
            $report['properties'] = (new HouzezPropertyImporter(
                userMap: $userMap,
                termMap: $termMap,
                batch: $batch,
                downloadImages: $this->downloadImages,
            ))->run($this->propertyLimit);
        }

        // 4. Blog posts
        if ($this->importPosts) {
            $report['posts'] = (new HouzezPostImporter())->run();
        }

        return $report;
    }

    /**
     * Build wp_user_id → laravel_user_id from previously-imported users.
     */
    private function loadUserMap(): array
    {
        return \App\Models\User::query()
            ->whereNotNull('wp_id')
            ->pluck('id', 'wp_id')
            ->toArray();
    }

    public static function createBatch(int $importerUserId, ?string $notes = null, int $expirationDays = 90): ImportBatch
    {
        return ImportBatch::create([
            'imported_by' => $importerUserId,
            'source' => 'houzez',
            'original_filename' => 'wordpress-import',
            'total_records' => 0,
            'imported_count' => 0,
            'failed_count' => 0,
            'claimed_count' => 0,
            'expires_at' => now()->addDays($expirationDays),
            'notes' => $notes,
        ]);
    }
}

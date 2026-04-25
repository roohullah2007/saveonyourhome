<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\Houzez\HouzezDb;
use App\Services\Houzez\WordpressImporter;
use Illuminate\Console\Command;

class ImportWordpress extends Command
{
    protected $signature = 'wp:import
        {--users : Import users from wp_users + wp_usermeta}
        {--taxonomies : Import Houzez taxonomies into taxonomy_terms}
        {--listings : Import Houzez properties (post_type=property) and queue image jobs}
        {--posts : Import blog posts (post_type=post) into resources}
        {--all : Run every importer above}
        {--no-images : Skip queueing image-download jobs (listings only)}
        {--limit= : Cap the number of properties processed (testing)}
        {--notes= : Notes attached to the ImportBatch row}';

    protected $description = 'Import legacy WordPress (Houzez) content into Laravel. '
        . 'Reads from the wp_legacy connection — load the .sql dump first.';

    public function handle(): int
    {
        if (!HouzezDb::isAvailable()) {
            $this->error('wp_legacy DB not reachable. Load the dump first:');
            $this->line('  mysql -u root saveonyourhomeold < saveonyourhomeold.sql');
            $this->line('Then ensure WP_LEGACY_DB_* env vars match in .env.');
            return self::FAILURE;
        }

        $all = (bool) $this->option('all');
        $doUsers = $all || $this->option('users');
        $doTax = $all || $this->option('taxonomies');
        $doListings = $all || $this->option('listings');
        $doPosts = $all || $this->option('posts');

        if (!($doUsers || $doTax || $doListings || $doPosts)) {
            $this->warn('Nothing to do. Pass --all (or any of --users / --taxonomies / --listings / --posts).');
            return self::INVALID;
        }

        $summary = HouzezDb::summary();
        $this->table(
            ['Source rows', 'Count'],
            collect($summary)->map(fn ($v, $k) => [$k, $v])->values()->all()
        );

        $batch = null;
        if ($doListings) {
            $admin = User::where('role', 'admin')->orderBy('id')->first();
            if (!$admin) {
                $this->error('No admin user found — create one before importing listings.');
                return self::FAILURE;
            }
            $batch = WordpressImporter::createBatch(
                $admin->id,
                $this->option('notes') ?: 'Imported via wp:import command',
                90,
            );
            $this->info("Created ImportBatch #{$batch->id}");
        }

        $importer = new WordpressImporter(
            importUsers: $doUsers,
            importTaxonomies: $doTax,
            importProperties: $doListings,
            importPosts: $doPosts,
            downloadImages: !$this->option('no-images'),
            propertyLimit: $this->option('limit') ? (int) $this->option('limit') : null,
        );

        $report = $importer->run($batch);

        $this->newLine();
        $this->info('Import complete.');
        foreach ($report as $section => $data) {
            if ($section === 'summary') continue;
            $this->line("→ {$section}: " . $this->formatLine($data));
        }
        if ($batch) {
            $this->line("Batch: " . url('/admin/imports/' . $batch->id));
        }
        return self::SUCCESS;
    }

    private function formatLine(mixed $data): string
    {
        if (!is_array($data)) return (string) $data;
        $parts = [];
        foreach ($data as $k => $v) {
            if (is_array($v)) continue; // skip detailed maps
            $parts[] = "{$k}={$v}";
        }
        return implode(', ', $parts);
    }
}

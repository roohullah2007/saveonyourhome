<?php

namespace App\Console\Commands;

use App\Models\Property;
use App\Services\BunnyCDNService;
use App\Services\ImageService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class MigrateImagesToCdn extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'cdn:migrate-images
                            {--property= : Migrate images for a specific property ID}
                            {--dry-run : Show what would be migrated without actually migrating}
                            {--limit= : Limit the number of properties to process}';

    /**
     * The console command description.
     */
    protected $description = 'Migrate existing property images from local storage to Bunny CDN';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if (!BunnyCDNService::isConfigured()) {
            $this->error('Bunny CDN is not configured. Please check your .env file.');
            return Command::FAILURE;
        }

        $dryRun = $this->option('dry-run');
        $propertyId = $this->option('property');
        $limit = $this->option('limit');

        if ($dryRun) {
            $this->info('Running in dry-run mode - no changes will be made.');
        }

        // Build query
        $query = Property::query();

        if ($propertyId) {
            $query->where('id', $propertyId);
        }

        if ($limit) {
            $query->limit((int) $limit);
        }

        $properties = $query->get();
        $totalMigrated = 0;
        $totalFailed = 0;
        $totalSkipped = 0;

        $this->info("Found {$properties->count()} properties to process.");

        $bar = $this->output->createProgressBar($properties->count());
        $bar->start();

        foreach ($properties as $property) {
            $photos = $property->photos ?? [];

            if (empty($photos)) {
                $bar->advance();
                continue;
            }

            $updatedPhotos = [];
            $propertyMigrated = 0;
            $propertySkipped = 0;

            foreach ($photos as $photo) {
                // Skip if already a CDN URL
                if (str_contains($photo, config('services.bunnycdn.pull_zone'))) {
                    $updatedPhotos[] = $photo;
                    $propertySkipped++;
                    $totalSkipped++;
                    continue;
                }

                // Skip external URLs
                if (str_starts_with($photo, 'http://') || str_starts_with($photo, 'https://')) {
                    $updatedPhotos[] = $photo;
                    $propertySkipped++;
                    $totalSkipped++;
                    continue;
                }

                if ($dryRun) {
                    $this->line("\n  Would migrate: {$photo}");
                    $updatedPhotos[] = $photo;
                    $propertyMigrated++;
                    $totalMigrated++;
                    continue;
                }

                // Migrate to CDN
                $cdnUrl = ImageService::migrateToCdn($photo);

                if ($cdnUrl) {
                    $updatedPhotos[] = $cdnUrl;
                    $propertyMigrated++;
                    $totalMigrated++;
                } else {
                    // Keep original path if migration fails
                    $updatedPhotos[] = $photo;
                    $totalFailed++;
                    Log::warning('Failed to migrate image to CDN', [
                        'property_id' => $property->id,
                        'photo' => $photo
                    ]);
                }
            }

            // Update property if any photos were migrated
            if (!$dryRun && $propertyMigrated > 0) {
                $property->update(['photos' => $updatedPhotos]);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Migration complete!");
        $this->table(
            ['Metric', 'Count'],
            [
                ['Properties processed', $properties->count()],
                ['Images migrated', $totalMigrated],
                ['Images skipped (already on CDN)', $totalSkipped],
                ['Images failed', $totalFailed],
            ]
        );

        if ($dryRun) {
            $this->warn('This was a dry run. Run without --dry-run to actually migrate images.');
        }

        return Command::SUCCESS;
    }
}

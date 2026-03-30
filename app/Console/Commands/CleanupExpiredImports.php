<?php

namespace App\Console\Commands;

use App\Models\ActivityLog;
use App\Models\ImportBatch;
use App\Models\Property;
use Illuminate\Console\Command;

class CleanupExpiredImports extends Command
{
    protected $signature = 'imports:cleanup {--dry-run : Show what would be deleted without actually deleting}';

    protected $description = 'Soft-delete unclaimed imported properties past their claim expiration';

    public function handle(): int
    {
        $dryRun = $this->option('dry-run');

        $expired = Property::imported()
            ->whereNull('claimed_at')
            ->whereNotNull('claim_expires_at')
            ->where('claim_expires_at', '<=', now())
            ->whereNull('deleted_at')
            ->get();

        if ($expired->isEmpty()) {
            $this->info('No expired unclaimed imports found.');
            return Command::SUCCESS;
        }

        $this->info(($dryRun ? '[DRY RUN] ' : '') . "Found {$expired->count()} expired unclaimed imports.");

        $batchIds = $expired->pluck('import_batch_id')->unique()->filter();

        if (!$dryRun) {
            foreach ($expired as $property) {
                $property->delete();
                $this->line("  Deleted property #{$property->id}: {$property->address}");
            }

            // Update batch counts
            foreach ($batchIds as $batchId) {
                $batch = ImportBatch::find($batchId);
                if ($batch) {
                    $remaining = $batch->properties()->whereNull('deleted_at')->count();
                    $this->line("  Batch #{$batch->id}: {$remaining} properties remaining");
                }
            }

            ActivityLog::log('expired_imports_cleaned', null, null, null,
                "Cleaned up {$expired->count()} expired unclaimed imported properties");
        } else {
            foreach ($expired as $property) {
                $this->line("  Would delete property #{$property->id}: {$property->address} (expired {$property->claim_expires_at->diffForHumans()})");
            }
        }

        $this->info(($dryRun ? '[DRY RUN] ' : '') . "Done. {$expired->count()} properties " . ($dryRun ? 'would be' : 'were') . " soft-deleted.");

        return Command::SUCCESS;
    }
}

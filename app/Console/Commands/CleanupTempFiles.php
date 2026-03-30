<?php

namespace App\Console\Commands;

use App\Services\ImageService;
use Illuminate\Console\Command;

class CleanupTempFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cleanup:temp-files {--age=60 : Maximum age in minutes for temp files}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up old temporary files (ZIP downloads, etc.)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $maxAge = (int) $this->option('age');

        $this->info("Cleaning up temporary files older than {$maxAge} minutes...");

        $deleted = ImageService::cleanupTempFiles($maxAge);

        $this->info("Deleted {$deleted} temporary file(s).");

        return Command::SUCCESS;
    }
}

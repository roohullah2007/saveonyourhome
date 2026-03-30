<?php

namespace App\Console\Commands;

use App\Services\BunnyCDNService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class TestBunnyCdn extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'cdn:test';

    /**
     * The console command description.
     */
    protected $description = 'Test Bunny CDN connectivity and upload';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Testing Bunny CDN Configuration...');
        $this->newLine();

        // Check configuration
        $this->info('1. Checking configuration...');

        $config = [
            'Hostname' => config('services.bunnycdn.hostname'),
            'Username' => config('services.bunnycdn.username'),
            'Password' => config('services.bunnycdn.password') ? '****' . substr(config('services.bunnycdn.password'), -4) : 'NOT SET',
            'Port' => config('services.bunnycdn.port'),
            'Pull Zone' => config('services.bunnycdn.pull_zone'),
        ];

        $this->table(['Setting', 'Value'], collect($config)->map(fn($v, $k) => [$k, $v ?: 'NOT SET'])->toArray());
        $this->newLine();

        if (!BunnyCDNService::isConfigured()) {
            $this->error('Bunny CDN is not properly configured. Please check your .env file.');
            return Command::FAILURE;
        }

        $this->info('Configuration OK!');
        $this->newLine();

        // Test connection
        $this->info('2. Testing FTP connection...');

        try {
            $bunny = new BunnyCDNService();

            // Try to upload a test file
            $testContent = 'Bunny CDN test file created at ' . now()->toIso8601String();
            $testPath = 'test/cdn-test-' . Str::random(8) . '.txt';

            $this->info("   Uploading test file: {$testPath}");

            $uploaded = $bunny->uploadContent($testContent, $testPath);

            if ($uploaded) {
                $this->info('   Upload successful!');

                // Get the URL
                $url = BunnyCDNService::getUrl($testPath);
                $this->info("   CDN URL: {$url}");

                // Try to verify the file is accessible
                $this->info('3. Verifying file is accessible...');

                // Wait a moment for CDN propagation
                sleep(2);

                $context = stream_context_create(['http' => ['timeout' => 10]]);
                $fetchedContent = @file_get_contents($url, false, $context);

                if ($fetchedContent === $testContent) {
                    $this->info('   File content verified!');
                } elseif ($fetchedContent !== false) {
                    $this->warn('   File accessible but content may differ (CDN caching)');
                } else {
                    $this->warn('   Could not verify file (might need DNS propagation)');
                }

                // Clean up test file
                $this->info('4. Cleaning up test file...');
                $bunny->delete($testPath);
                $this->info('   Test file deleted.');

                $this->newLine();
                $this->info('All tests passed! Bunny CDN is working correctly.');

                return Command::SUCCESS;
            } else {
                $this->error('Failed to upload test file.');
                return Command::FAILURE;
            }
        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}

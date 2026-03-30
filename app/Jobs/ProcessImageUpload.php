<?php

namespace App\Jobs;

use App\Services\BunnyCDNService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\Encoders\WebpEncoder;

class ProcessImageUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 10;

    /**
     * The maximum number of exceptions to allow before failing.
     */
    public int $maxExceptions = 2;

    protected string $tempFilePath;
    protected string $originalName;
    protected string $directory;
    protected ?string $callbackUrl;
    protected ?int $propertyId;

    /**
     * Create a new job instance.
     */
    public function __construct(
        string $tempFilePath,
        string $originalName,
        string $directory = 'properties',
        ?string $callbackUrl = null,
        ?int $propertyId = null
    ) {
        $this->tempFilePath = $tempFilePath;
        $this->originalName = $originalName;
        $this->directory = $directory;
        $this->callbackUrl = $callbackUrl;
        $this->propertyId = $propertyId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('ProcessImageUpload: Starting job', [
            'temp_file' => $this->tempFilePath,
            'original_name' => $this->originalName
        ]);

        try {
            // Check if temp file exists
            if (!file_exists($this->tempFilePath)) {
                Log::error('ProcessImageUpload: Temp file not found', [
                    'path' => $this->tempFilePath
                ]);
                return;
            }

            // Generate unique filename
            $filename = Str::uuid() . '.webp';
            $remotePath = $this->directory . '/' . $filename;

            // Process image with Intervention Image
            $image = Image::read($this->tempFilePath);
            $image = $image->orient();

            // Resize if larger than max dimension
            $maxDimension = 1920;
            if ($image->width() > $maxDimension || $image->height() > $maxDimension) {
                $image = $image->scaleDown($maxDimension, $maxDimension);
            }

            // Encode to WebP
            $encoded = $image->encode(new WebpEncoder(85));
            $webpContent = (string) $encoded;

            // Upload to Bunny CDN if configured
            if (BunnyCDNService::isConfigured()) {
                $bunny = new BunnyCDNService();
                $uploaded = $bunny->uploadContent($webpContent, $remotePath);

                if ($uploaded) {
                    Log::info('ProcessImageUpload: Uploaded to Bunny CDN', [
                        'path' => $remotePath
                    ]);

                    // Also store locally as backup (optional - can be disabled)
                    if (config('services.bunnycdn.local_backup', false)) {
                        Storage::disk('public')->put($remotePath, $webpContent);
                    }
                } else {
                    // Fallback to local storage
                    Log::warning('ProcessImageUpload: Bunny CDN upload failed, using local storage');
                    Storage::disk('public')->put($remotePath, $webpContent);
                }
            } else {
                // Use local storage
                Storage::disk('public')->put($remotePath, $webpContent);
                Log::info('ProcessImageUpload: Stored locally', [
                    'path' => $remotePath
                ]);
            }

            // Clean up temp file
            @unlink($this->tempFilePath);

            Log::info('ProcessImageUpload: Job completed successfully', [
                'path' => $remotePath
            ]);

        } catch (\Exception $e) {
            Log::error('ProcessImageUpload: Job failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Clean up temp file on failure too
            if (file_exists($this->tempFilePath)) {
                @unlink($this->tempFilePath);
            }

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('ProcessImageUpload: Job permanently failed', [
            'error' => $exception->getMessage(),
            'temp_file' => $this->tempFilePath,
            'original_name' => $this->originalName
        ]);

        // Clean up temp file
        if (file_exists($this->tempFilePath)) {
            @unlink($this->tempFilePath);
        }
    }
}

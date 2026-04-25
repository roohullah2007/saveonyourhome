<?php

namespace App\Jobs;

use App\Models\Property;
use App\Models\PropertyImage;
use App\Services\BunnyCDNService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Laravel\Facades\Image;

/**
 * Downloads a single Houzez attachment from its original URL, resizes /
 * encodes to WebP, and creates a `property_images` row pointing at it.
 *
 * One job per image so a single failure doesn't take down a whole batch, and
 * the queue worker can fan them out in parallel. Idempotent: if a
 * PropertyImage with the same wp_attachment_id already exists for the
 * property we skip — re-running the importer is safe.
 */
class DownloadHouzezImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;
    public int $maxExceptions = 2;
    public int $timeout = 120;

    private const MAX_DIMENSION = 1920;
    private const WEBP_QUALITY = 85;

    public function __construct(
        public readonly int $propertyId,
        public readonly int $attachmentId,
        public readonly string $imageUrl,
        public readonly bool $isPrimary = false,
        public readonly int $sortOrder = 0,
    ) {}

    public function handle(): void
    {
        $property = Property::find($this->propertyId);
        if (!$property) {
            Log::warning('DownloadHouzezImage: property not found', ['property_id' => $this->propertyId]);
            return;
        }

        // Idempotency — already imported this attachment.
        $existing = PropertyImage::where('property_id', $property->id)
            ->where('wp_attachment_id', $this->attachmentId)
            ->first();
        if ($existing) {
            return;
        }

        $tempFile = null;
        try {
            $tempFile = $this->downloadToTemp($this->imageUrl);
            if (!$tempFile) {
                throw new \RuntimeException('Failed to download image: ' . $this->imageUrl);
            }

            $remotePath = 'properties/' . Str::uuid() . '.webp';
            $webpBytes = $this->encodeWebp($tempFile);

            $stored = $this->store($remotePath, $webpBytes);
            if (!$stored) {
                throw new \RuntimeException('Failed to store WebP image');
            }

            // If this is the primary image, demote any previous primary first.
            if ($this->isPrimary) {
                PropertyImage::where('property_id', $property->id)
                    ->where('is_primary', true)
                    ->update(['is_primary' => false]);
            }

            // Some legacy filenames contain non-utf8mb4 bytes (Eastern
            // European / CJK). Strip anything that won't survive insert.
            $rawName = basename(parse_url($this->imageUrl, PHP_URL_PATH) ?: $this->imageUrl);
            $cleanName = mb_convert_encoding($rawName, 'UTF-8', 'UTF-8');
            $cleanName = preg_replace('/[^\PC\s]/u', '', (string) $cleanName) ?: 'image';
            $cleanName = mb_substr($cleanName, 0, 200);

            PropertyImage::create([
                'property_id' => $property->id,
                'wp_attachment_id' => $this->attachmentId,
                'image_path' => $stored,
                'image_name' => $cleanName,
                'is_primary' => $this->isPrimary,
                'sort_order' => $this->sortOrder,
            ]);

            // The PropertyCard component reads `properties.photos` (JSON column)
            // for thumbnail rendering, so we mirror the URL there too. Use a
            // path-relative URL (or full CDN URL) so it works across hosts.
            $url = str_starts_with($stored, 'http') ? $stored : '/storage/' . $stored;
            $photos = $property->photos ?? [];
            if (!in_array($url, $photos, true)) {
                if ($this->isPrimary) {
                    array_unshift($photos, $url);
                } else {
                    $photos[] = $url;
                }
                $property->forceFill(['photos' => array_values(array_unique($photos))])->saveQuietly();
            }
        } finally {
            if ($tempFile && file_exists($tempFile)) {
                @unlink($tempFile);
            }
        }
    }

    public function failed(\Throwable $e): void
    {
        Log::error('DownloadHouzezImage: permanently failed', [
            'property_id' => $this->propertyId,
            'attachment_id' => $this->attachmentId,
            'url' => $this->imageUrl,
            'error' => $e->getMessage(),
        ]);
    }

    private function downloadToTemp(string $url): ?string
    {
        $response = Http::timeout(60)
            ->withUserAgent('SaveOnYourHome-Importer/1.0')
            ->withOptions(['stream' => false])
            ->get($url);

        if (!$response->successful()) {
            Log::warning('DownloadHouzezImage: HTTP error', ['url' => $url, 'status' => $response->status()]);
            return null;
        }

        $tempDir = storage_path('app/temp/wp-import');
        if (!is_dir($tempDir)) {
            @mkdir($tempDir, 0755, true);
        }
        $tempFile = $tempDir . '/' . Str::uuid() . '.tmp';
        file_put_contents($tempFile, $response->body());
        return $tempFile;
    }

    private function encodeWebp(string $tempFile): string
    {
        $img = Image::read($tempFile)->orient();

        if ($img->width() > self::MAX_DIMENSION || $img->height() > self::MAX_DIMENSION) {
            $img = $img->scaleDown(self::MAX_DIMENSION, self::MAX_DIMENSION);
        }

        return (string) $img->encode(new WebpEncoder(self::WEBP_QUALITY));
    }

    /**
     * Store the WebP bytes either on Bunny CDN (if configured) or the public
     * disk. Returns the value to persist as PropertyImage.image_path —
     * matches what ImageService::processAndStore() returns elsewhere.
     */
    private function store(string $remotePath, string $bytes): ?string
    {
        if (BunnyCDNService::isConfigured()) {
            $bunny = new BunnyCDNService();
            if ($bunny->uploadContent($bytes, $remotePath)) {
                return BunnyCDNService::getUrl($remotePath);
            }
            // fall through to local
        }

        Storage::disk('public')->put($remotePath, $bytes);
        return $remotePath; // PropertyImage stores the relative path; URL helper prepends /storage/
    }
}

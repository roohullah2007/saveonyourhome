<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class QrSticker extends Model
{
    protected $fillable = [
        'property_id',
        'short_code',
        'scan_count',
        'last_scanned_at',
    ];

    protected $casts = [
        'last_scanned_at' => 'datetime',
        'scan_count' => 'integer',
    ];

    /**
     * Get the property this sticker belongs to
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Generate a unique short code
     */
    public static function generateShortCode(): string
    {
        do {
            // Generate 6 character alphanumeric code (uppercase)
            $code = strtoupper(Str::random(6));
        } while (self::where('short_code', $code)->exists());

        return $code;
    }

    /**
     * Get the short URL for this sticker
     */
    public function getShortUrlAttribute(): string
    {
        return url('/p/' . $this->short_code);
    }

    /**
     * Record a scan
     */
    public function recordScan(): void
    {
        $this->increment('scan_count');
        $this->update(['last_scanned_at' => now()]);
    }
}

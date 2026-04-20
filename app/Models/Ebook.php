<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Ebook extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'description', 'cover_path', 'file_path',
        'file_size', 'file_mime', 'download_count', 'is_active', 'sort_order', 'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'file_size' => 'integer',
        'download_count' => 'integer',
        'sort_order' => 'integer',
    ];

    protected $appends = ['cover_url', 'file_size_human'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function downloads(): HasMany
    {
        return $this->hasMany(EbookDownload::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Public URL for the cover image (stored on the public disk).
     */
    public function getCoverUrlAttribute(): ?string
    {
        if (!$this->cover_path) return null;
        return \Storage::disk('public')->url($this->cover_path);
    }

    public function getFileSizeHumanAttribute(): string
    {
        $bytes = (int) $this->file_size;
        if ($bytes <= 0) return '—';
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }
        return round($bytes, $i === 0 ? 0 : 1) . ' ' . $units[$i];
    }

    /**
     * Build a unique slug from the title. Once set, callers should keep it
     * stable — download URLs and analytics references rely on it.
     */
    public static function buildUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'ebook';
        $slug = $base;
        $i = 2;
        while (self::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }
}

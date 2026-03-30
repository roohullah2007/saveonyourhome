<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ImportBatch extends Model
{
    protected $fillable = [
        'imported_by',
        'source',
        'original_filename',
        'total_records',
        'imported_count',
        'failed_count',
        'claimed_count',
        'expires_at',
        'errors',
        'notes',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'errors' => 'array',
    ];

    public function importer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'imported_by');
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'import_batch_id');
    }

    public function scopeActive($query)
    {
        return $query->where('expires_at', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->expires_at->isPast();
    }

    public function getUnclaimedCountAttribute(): int
    {
        return $this->imported_count - $this->claimed_count;
    }
}

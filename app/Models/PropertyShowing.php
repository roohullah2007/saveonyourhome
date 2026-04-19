<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class PropertyShowing extends Model
{
    protected $fillable = [
        'property_id',
        'seller_user_id',
        'buyer_user_id',
        'buyer_name',
        'buyer_email',
        'buyer_phone',
        'meeting_type',
        'scheduled_at',
        'duration_minutes',
        'status',
        'buyer_notes',
        'cancellation_token',
        'cancelled_at',
        'cancelled_by',
        'cancellation_reason',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'duration_minutes' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $showing) {
            if (!$showing->cancellation_token) {
                $showing->cancellation_token = Str::random(48);
            }
        });
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_user_id');
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_user_id');
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['confirmed', 'completed']);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('status', 'confirmed')->where('scheduled_at', '>=', now());
    }

    public function scopePast($query)
    {
        return $query->where('scheduled_at', '<', now());
    }

    public function endsAt(): \Illuminate\Support\Carbon
    {
        return $this->scheduled_at->copy()->addMinutes($this->duration_minutes);
    }

    public function isCancellable(): bool
    {
        return $this->status === 'confirmed' && $this->scheduled_at->isFuture();
    }
}

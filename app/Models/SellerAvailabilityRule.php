<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerAvailabilityRule extends Model
{
    protected $fillable = [
        'user_id',
        'day_of_week',
        'start_time',
        'end_time',
        'slot_duration_minutes',
        'allow_phone',
        'allow_in_person',
        'is_active',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'slot_duration_minutes' => 'integer',
        'allow_phone' => 'boolean',
        'allow_in_person' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public static function dayName(int $dow): string
    {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][$dow] ?? '';
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExternalCalendar extends Model
{
    protected $fillable = [
        'user_id',
        'label',
        'ics_url',
        'last_synced_at',
        'last_sync_error',
        'last_event_count',
        'is_active',
    ];

    protected $casts = [
        'last_synced_at' => 'datetime',
        'last_event_count' => 'integer',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(ExternalBusyEvent::class);
    }
}

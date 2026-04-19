<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExternalBusyEvent extends Model
{
    protected $fillable = [
        'external_calendar_id',
        'starts_at',
        'ends_at',
        'source_uid',
        'summary',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function calendar(): BelongsTo
    {
        return $this->belongsTo(ExternalCalendar::class, 'external_calendar_id');
    }
}

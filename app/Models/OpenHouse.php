<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OpenHouse extends Model
{
    protected $fillable = [
        'property_id',
        'date',
        'start_time',
        'end_time',
        'description',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->orderBy('start_time');
    }

    public function getFormattedDateAttribute(): string
    {
        return $this->date->format('l, F j, Y');
    }

    public function getFormattedTimeAttribute(): string
    {
        $start = \Carbon\Carbon::parse($this->start_time)->format('g:i A');
        $end = \Carbon\Carbon::parse($this->end_time)->format('g:i A');
        return "{$start} - {$end}";
    }
}

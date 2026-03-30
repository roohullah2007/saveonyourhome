<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrScan extends Model
{
    protected $fillable = [
        'property_id',
        'ip_address',
        'user_agent',
        'referer',
        'city',
        'region',
        'country',
        'scanned_at',
    ];

    protected $casts = [
        'scanned_at' => 'datetime',
    ];

    /**
     * Get the property that was scanned
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}

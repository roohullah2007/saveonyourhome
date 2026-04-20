<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedSearchAlert extends Model
{
    public $timestamps = false;

    protected $fillable = ['saved_search_id', 'property_id', 'alerted_at'];

    protected $casts = [
        'alerted_at' => 'datetime',
    ];

    public function savedSearch(): BelongsTo
    {
        return $this->belongsTo(SavedSearch::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}

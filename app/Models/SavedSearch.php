<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SavedSearch extends Model
{
    protected $fillable = ['user_id', 'name', 'filters', 'alerts_enabled', 'last_alerted_at'];

    protected $casts = [
        'filters' => 'array',
        'alerts_enabled' => 'boolean',
        'last_alerted_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function alerts(): HasMany
    {
        return $this->hasMany(\App\Models\SavedSearchAlert::class);
    }
}

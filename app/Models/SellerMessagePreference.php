<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerMessagePreference extends Model
{
    protected $fillable = [
        'user_id',
        'delivery_method',
        'show_phone_publicly',
        'show_email_publicly',
        'preferred_contact_hours',
    ];

    protected $casts = [
        'show_phone_publicly' => 'boolean',
        'show_email_publicly' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

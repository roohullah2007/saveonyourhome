<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuyerInquiry extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'preferred_area',
        'price_min',
        'price_max',
        'mls_setup',
        'preapproved',
        'status',
        'notes',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}

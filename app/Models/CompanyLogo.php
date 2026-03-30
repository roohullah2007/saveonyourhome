<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class CompanyLogo extends Model
{
    protected $fillable = [
        'name',
        'image_path',
        'text_logo',
        'text_color',
        'text_size',
        'link_url',
        'hover_color',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public static function getActive()
    {
        return Cache::remember('company_logos_active', 3600, function () {
            return static::where('is_active', true)
                ->orderBy('sort_order')
                ->get();
        });
    }

    public static function clearCache()
    {
        Cache::forget('company_logos_active');
    }

    protected static function booted()
    {
        static::saved(fn () => static::clearCache());
        static::deleted(fn () => static::clearCache());
    }
}

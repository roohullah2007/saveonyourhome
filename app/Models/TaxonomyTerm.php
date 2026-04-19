<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class TaxonomyTerm extends Model
{
    public const TYPE_PROPERTY_TYPE = 'property_type';
    public const TYPE_TRANSACTION_TYPE = 'transaction_type';
    public const TYPE_LISTING_LABEL = 'listing_label';
    public const TYPE_LISTING_STATUS = 'listing_status';

    public const TYPES = [
        self::TYPE_PROPERTY_TYPE,
        self::TYPE_TRANSACTION_TYPE,
        self::TYPE_LISTING_LABEL,
        self::TYPE_LISTING_STATUS,
    ];

    protected $fillable = ['type', 'key', 'label', 'is_active', 'sort_order'];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopeType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public static function clearCache(): void
    {
        foreach (self::TYPES as $t) Cache::forget("taxonomy:{$t}");
    }

    /**
     * Active terms keyed by their slug. Cached 10 minutes.
     */
    public static function activeByType(string $type): array
    {
        return Cache::remember("taxonomy:{$type}", 600, function () use ($type) {
            return self::query()
                ->where('type', $type)
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('label')
                ->get(['id', 'key', 'label'])
                ->map(fn ($t) => ['value' => $t->key, 'label' => $t->label])
                ->values()
                ->all();
        });
    }

    protected static function booted(): void
    {
        $bust = fn () => self::clearCache();
        static::saved($bust);
        static::deleted($bust);
    }
}

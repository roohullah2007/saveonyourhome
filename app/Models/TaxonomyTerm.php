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
    public const TYPE_AMENITY_CATEGORY = 'amenity_category';
    public const TYPE_AMENITY = 'amenity';

    public const TYPES = [
        self::TYPE_PROPERTY_TYPE,
        self::TYPE_TRANSACTION_TYPE,
        self::TYPE_LISTING_LABEL,
        self::TYPE_LISTING_STATUS,
        self::TYPE_AMENITY_CATEGORY,
        self::TYPE_AMENITY,
    ];

    protected $fillable = ['type', 'parent_id', 'key', 'label', 'sub_label', 'is_active', 'sort_order'];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'parent_id' => 'integer',
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
        Cache::forget('taxonomy:amenity_tree');
    }

    /**
     * Amenity catalog in the shape the frontend expects: an array of groups,
     * each with either `items: string[]` (flat categories) or
     * `subgroups: [{ label, items: string[] }]` (when any item carries a sub_label).
     * Cached for 10 minutes; bust via TaxonomyTerm::clearCache() on any write.
     */
    public static function amenityTree(): array
    {
        return Cache::remember('taxonomy:amenity_tree', 600, function () {
            $categories = self::query()
                ->where('type', self::TYPE_AMENITY_CATEGORY)
                ->where('is_active', true)
                ->orderBy('sort_order')->orderBy('label')
                ->get(['id', 'label']);

            $items = self::query()
                ->where('type', self::TYPE_AMENITY)
                ->where('is_active', true)
                ->orderBy('sort_order')->orderBy('label')
                ->get(['id', 'parent_id', 'label', 'sub_label']);

            $grouped = $items->groupBy('parent_id');

            return $categories->map(function ($cat) use ($grouped) {
                $catItems = $grouped->get($cat->id, collect());
                // If any item in this category has a sub_label, render as subgroups.
                $hasSubgroups = $catItems->contains(fn ($i) => !empty($i->sub_label));
                if ($hasSubgroups) {
                    $sub = $catItems->groupBy(fn ($i) => $i->sub_label ?? '')
                        ->map(fn ($list, $label) => [
                            'label' => $label !== '' ? $label : 'Other',
                            'items' => $list->pluck('label')->values()->all(),
                        ])
                        ->values()
                        ->all();
                    return ['category' => $cat->label, 'subgroups' => $sub];
                }
                return ['category' => $cat->label, 'items' => $catItems->pluck('label')->values()->all()];
            })->all();
        });
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

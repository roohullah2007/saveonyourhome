<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Partner extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'contact_name',
        'category',
        'phone',
        'email',
        'website',
        'address',
        'description',
        'logo',
        'services',
        'sort_order',
        'is_active',
        'approval_status',
        'rejection_reason',
        'approved_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'services' => 'array',
        'approved_at' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeApproved($query)
    {
        return $query->where('approval_status', 'approved');
    }

    public function scopePublic($query)
    {
        return $query->where('is_active', true)->where('approval_status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('approval_status', 'pending');
    }

    public static function categories(): array
    {
        return [
            'Accountants/Financial Planners',
            'Alarm',
            'Appliances',
            'Appraisers',
            'Architects',
            'Chimney',
            'Cleaning',
            'Attorney',
            'Contractors',
            'Credit Repair',
            'Electricians',
            'Fencing',
            'Flooring/Carpeting',
            'Handyman',
            'Home Inspectors',
            'Home Insurance',
            'HVAC',
            'Lawn/Gardener',
            'Life Insurance Agents',
            'Locksmith',
            'Mortgage',
            'Movers',
            'Oil Tank Removal/Environmental Services',
            'Painters/Wallpaper',
            'Paving/Mason/Pavers',
            'Pest Control/Termites',
            'Photography for Listings',
            'Plumbers',
            'Real Estate Agents',
            'Roofers',
            'Siding',
            'Smart Home',
            'Snow Removal',
            'Staging',
            'Title Companies',
            'Virtual Tours',
            'Waterproofing',
            'Windows',
        ];
    }

    public static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'partner';
        $slug = $base;
        $i = 2;
        while (static::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }
}

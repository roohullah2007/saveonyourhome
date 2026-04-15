<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    protected $fillable = [
        'name', 'category', 'phone', 'email', 'website', 'address', 'description', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
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
}

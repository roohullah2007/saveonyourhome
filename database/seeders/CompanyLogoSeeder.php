<?php

namespace Database\Seeders;

use App\Models\CompanyLogo;
use Illuminate\Database\Seeder;

class CompanyLogoSeeder extends Seeder
{
    public function run(): void
    {
        $logos = [
            [
                'name' => 'Zillow',
                'image_path' => '/images/zillow.png',
                'text_logo' => 'Zillow',
                'text_color' => '#006AFF',
                'text_size' => 'text-xl',
                'link_url' => 'https://www.zillow.com',
                'hover_color' => '#006AFF',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Realtor.com',
                'image_path' => null,
                'text_logo' => 'realtor.com',
                'text_color' => '#D92228',
                'text_size' => 'text-lg',
                'link_url' => 'https://www.realtor.com',
                'hover_color' => '#D92228',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Trulia',
                'image_path' => null,
                'text_logo' => 'Trulia',
                'text_color' => '#00ADBB',
                'text_size' => 'text-xl',
                'link_url' => 'https://www.trulia.com',
                'hover_color' => '#00ADBB',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Redfin',
                'image_path' => null,
                'text_logo' => 'Redfin',
                'text_color' => '#A02021',
                'text_size' => 'text-xl',
                'link_url' => 'https://www.redfin.com',
                'hover_color' => '#A02021',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'homes.com',
                'image_path' => null,
                'text_logo' => 'homes.com',
                'text_color' => '#FF6B00',
                'text_size' => 'text-lg',
                'link_url' => 'https://www.homes.com',
                'hover_color' => '#FF6B00',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'MLS',
                'image_path' => null,
                'text_logo' => 'MLS',
                'text_color' => '#1a365d',
                'text_size' => 'text-xl',
                'link_url' => null,
                'hover_color' => '#1a365d',
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($logos as $logo) {
            CompanyLogo::updateOrCreate(
                ['name' => $logo['name']],
                $logo
            );
        }
    }
}

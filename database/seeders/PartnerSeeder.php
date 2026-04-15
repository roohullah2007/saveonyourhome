<?php

namespace Database\Seeders;

use App\Models\Partner;
use Illuminate\Database\Seeder;

class PartnerSeeder extends Seeder
{
    public function run(): void
    {
        $partners = [
            ['name' => 'Josh Greenberg', 'category' => 'Accountants/Financial Planners', 'phone' => '201.707.0846', 'email' => 'Josh@JagBusinessSolutions.com'],
            ['name' => 'Daniel Shlufman', 'category' => 'Attorney', 'phone' => '917.575.6977'],
            ['name' => 'David I Flamholz & Veronika Garber', 'category' => 'Attorney', 'phone' => '201.578.1578'],
            ['name' => 'YA Contractor', 'category' => 'Contractors', 'phone' => '973.472.9737', 'website' => 'www.yacontractor.com'],
            ['name' => 'Daniel Shlufman', 'category' => 'Mortgage', 'phone' => '917.575.6977'],
            ['name' => 'GMS Painting Services LLC', 'category' => 'Painters/Wallpaper', 'phone' => '201-336-4748', 'description' => 'GMS Painting Services LLC is a full-service, licensed and insured company based in Bergen County serving all of NJ.'],
            ['name' => 'Levy Tewel', 'category' => 'Real Estate Agents', 'phone' => '347.446.0567', 'website' => 'www.TewelTeam.com'],
            ['name' => 'QAF LLC - Yehuda Kohn', 'category' => 'Virtual Tours', 'phone' => '201.538.8437', 'email' => 'ykohn@qafllc.com'],
        ];

        foreach ($partners as $p) {
            Partner::firstOrCreate(
                ['name' => $p['name'], 'category' => $p['category']],
                array_merge($p, ['is_active' => true, 'sort_order' => 0])
            );
        }
    }
}

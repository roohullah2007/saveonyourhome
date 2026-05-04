<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$listings = [
    [
        'property_title' => 'Charming Brickell Condo with Bay Views',
        'address' => '905 Brickell Bay Dr',
        'city' => 'Miami',
        'state' => 'FL',
        'zip_code' => '33131',
        'county' => 'Miami-Dade',
        'price' => 685000,
        'bedrooms' => 2,
        'full_bathrooms' => 2,
        'half_bathrooms' => 0,
        'sqft' => 1180,
        'year_built' => 2008,
        'property_type' => 'condos-townhomes-co-ops',
        'description' => "High-floor 2BR/2BA condo in the heart of Brickell with sweeping Biscayne Bay views. Open kitchen, floor-to-ceiling glass, in-unit washer/dryer, and assigned covered parking. Building amenities include a rooftop pool, 24/7 concierge, gym, and resident lounge. Walkable to Mary Brickell Village and Brickell City Centre.",
        'latitude' => 25.7626,
        'longitude' => -80.1899,
        'photos' => [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600',
        ],
        'features' => ['Central AC', 'Hardwood Floors', 'Granite Countertops', 'Stainless Steel Appliances', 'Updated Kitchen', 'Walk-In Closet', 'Balcony'],
        'school_district' => 'Miami-Dade County Public Schools',
        'grade_school' => 'Southside Elementary',
        'middle_school' => 'Mast Academy Middle',
        'high_school' => 'Miami Senior High',
    ],
    [
        'property_title' => 'Spacious South Tampa Single-Family Home',
        'address' => '4218 W San Miguel St',
        'city' => 'Tampa',
        'state' => 'FL',
        'zip_code' => '33629',
        'county' => 'Hillsborough',
        'price' => 749000,
        'bedrooms' => 4,
        'full_bathrooms' => 3,
        'half_bathrooms' => 0,
        'sqft' => 2640,
        'year_built' => 2015,
        'property_type' => 'single-family-home',
        'description' => "Move-in ready 4BR/3BA in Plant High district. Open-concept main floor, gourmet kitchen with quartz island, primary suite on main with walk-in closet. Heated pool, fenced backyard with mature oaks, attached two-car garage, hurricane-impact windows. Top-rated South Tampa schools.",
        'latitude' => 27.9180,
        'longitude' => -82.5230,
        'photos' => [
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600',
            'https://images.unsplash.com/photo-1583608205776-bfb35f0d9f83?w=1600',
        ],
        'features' => ['Central AC', 'Central Heat', 'Swimming Pool', 'Garage', 'Hardwood Floors', 'Granite Countertops', 'Stainless Steel Appliances', 'Updated Kitchen', 'Updated Bathroom', 'Fenced Yard', 'Mature Trees', 'Sprinkler System', 'Walk-In Closet'],
        'school_district' => 'Hillsborough County Public Schools',
        'grade_school' => 'Dale Mabry Elementary',
        'middle_school' => 'Coleman Middle',
        'high_school' => 'Plant High',
    ],
    [
        'property_title' => 'Mid-Century Bungalow Near Downtown Austin',
        'address' => '1208 Brentwood St',
        'city' => 'Austin',
        'state' => 'TX',
        'zip_code' => '78757',
        'county' => 'Travis',
        'price' => 525000,
        'bedrooms' => 3,
        'full_bathrooms' => 2,
        'half_bathrooms' => 0,
        'sqft' => 1480,
        'year_built' => 1962,
        'property_type' => 'single-family-home',
        'description' => "Updated 3BR/2BA mid-century bungalow on a quiet street in Brentwood. Original hardwoods refinished, kitchen reworked with butcher-block counters and stainless appliances, both bathrooms tastefully renovated. Large fenced backyard with deck and detached studio (currently used as a home office). 10 minutes to downtown.",
        'latitude' => 30.3477,
        'longitude' => -97.7321,
        'photos' => [
            'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600',
        ],
        'features' => ['Central AC', 'Central Heat', 'Hardwood Floors', 'Stainless Steel Appliances', 'Updated Kitchen', 'Updated Bathroom', 'Fenced Yard', 'Deck', 'Mature Trees', 'Guest Quarters'],
        'school_district' => 'Austin ISD',
        'grade_school' => 'Brentwood Elementary',
        'middle_school' => 'Lamar Middle',
        'high_school' => 'McCallum High',
    ],
];

$user = App\Models\User::find(1);
if (!$user) {
    echo "User id=1 (John Seller) not found. Aborting.\n";
    exit(1);
}

$createdIds = [];
foreach ($listings as $data) {
    $now = now();
    $base = Illuminate\Support\Str::slug($data['address'] . ' ' . $data['city'] . ' ' . $data['state']);
    $slug = $base;
    $i = 2;
    while (App\Models\Property::where('slug', $slug)->exists()) {
        $slug = $base . '-' . $i++;
    }

    $property = App\Models\Property::create(array_merge($data, [
        'user_id' => $user->id,
        'slug' => $slug,
        'status' => 'for-sale',
        'transaction_type' => 'for_sale',
        'listing_status' => 'for_sale',
        'is_active' => true,
        'approval_status' => 'approved',
        'approved_at' => $now,
        'approved_by' => 1,
        'is_featured' => false,
        'is_motivated_seller' => false,
        'is_licensed_agent' => false,
        'open_to_realtors' => true,
        'requires_pre_approval' => false,
        'is_showcase' => false,
        'contact_name' => $user->name,
        'contact_email' => $user->email,
        'contact_phone' => $user->phone ?: '(305) 555-0142',
        'has_hoa' => false,
        'has_professional_photos' => false,
        'has_virtual_tour' => false,
        'has_video' => false,
        'is_mls_listed' => false,
    ]));
    $createdIds[] = $property->id;
    echo "Created #{$property->id} — {$property->property_title} ({$property->city}, {$property->state})\n";
    echo "  /properties/{$property->slug}\n";
}

echo "\nDone. " . count($createdIds) . " listings now under John Seller (user_id={$user->id}).\n";

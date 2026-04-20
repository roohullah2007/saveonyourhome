<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Ports the hardcoded AMENITY_GROUPS catalog (resources/js/constants/amenities.js)
 * into the taxonomy_terms table so admins can add / rename / reorder / deactivate
 * categories and items. Idempotent: rows are upserted on (type, key).
 */
return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        // [Category, subgroup|null, ...items]
        $catalog = [
            ['Interior Features', null, [
                'Spacious Bedrooms','Bedroom on Main Floor','Modern Bathrooms','Whirlpool Bath','Steam Shower',
                'Ensuite Bathroom(s)','Walk-in Closets','Custom Built In Closets','Built-in Bookshelves or Cabinets',
                'High Ceilings','Crown Molding','Wainscoting','Recessed Lighting','Central Heating',
                'Central Air Conditioning','Radiant Heated Floors','Fireplace','Skylights','Ceiling Fans',
                'Hardwood Floors','Carpeted Floors','Tile Floors',
            ]],
            ['Kitchen Features', 'Appliances', [
                'Stainless steel refrigerator','Gas or electric range/oven','Microwave with convection features',
                'Dishwasher','Wine cooler or wine refrigerator','Built-in coffee machine','Double ovens','Double dishwashers',
            ]],
            ['Kitchen Features', 'Cabinetry', [
                'Custom-built cabinetry','Soft-close drawers and cabinets','Under-cabinet lighting',
            ]],
            ['Kitchen Features', 'Countertops', [
                'Granite countertops','Quartz countertops','Marble countertops','Butcher block island countertop',
                'Stainless steel countertops','Concrete countertops','Solid surface countertops',
            ]],
            ['Kitchen Features', 'Kitchen Islands', [
                'Large center island with seating','Multi-level island with breakfast bar','Prep sink in the island',
            ]],
            ['Kitchen Features', 'Appliance Upgrades', [
                'Commercial-grade range/oven','Sub-Zero or high-end refrigerator','Stainless Steel Appliances','Warming drawer for food storage',
            ]],
            ['Kitchen Features', 'Sinks and Faucets', [
                'Apron-front farmhouse sink','Undermount sink','Pot-filler faucet above the stove',
            ]],
            ['Kitchen Features', 'Entertainment and Seating', [
                'Open concept kitchen with bar seating','Breakfast nook with built-in bench seating',
            ]],
            ['Outdoor Features', null, [
                'Low-Maintenance Landscaping','Brick Construction','Fenced Yard','Outdoor Lighting',
                'Fruit Trees or Vegetable Garden','Patio or Deck','Garden Area',
                'Pet-friendly Features (e.g., Pet Door, Fenced Yard)','Hot Tub or Jacuzzi','Public Sewer','Septic Tank',
                'Inground Sprinklers','BBQ Area','Landscaped Yard','Swimming Pool','Swingset or Tree House','Tennis Court or Sports Court',
            ]],
            ['Additional Rooms and Spaces', null, [
                'Additional Storage Space (Basement, Attic, etc.)','Attic or Loft','Balcony/Terrace','Finished Basement',
                'Formal Dining Room','Guest House or Mother-in-Law Suite','Gym or Fitness Room','Home Office or Study',
                'Laundry Room','Media Room or Home Theater','Mudroom or Entryway Bench','Nursery','Playroom or Recreation Room',
                'Unfinished Basement','Wine Cellar','Workshop or Hobby Room',
            ]],
            ['Safety and Security Features', null, [
                'Carbon Monoxide Detectors','Gated Community','Security Doors','Security System','Smoke Detectors','Surveillance Cameras',
            ]],
            ['Energy Efficiency and Technology', null, [
                'Energy Star Appliances','Energy-Efficient Windows','Programmable Thermostat','Smart Home Technology','Solar Panels',
            ]],
            ['Garage and Parking', null, [
                'Attached Garage','Carport','Detached Garage','Driveway Parking','RV or Boat Parking',
            ]],
            ['Accessibility Features', null, [
                'Elevator','Handicap Accessible Bathroom','Single-Level Living','Wheelchair Ramp',
            ]],
            ['Location and Surroundings', null, [
                'Close to Parks or Recreational Facilities','Nearby Schools','Nearby Shopping Centers or Restaurants',
                'Private Driveway or Cul-de-sac Location','Walking Distance to Houses of Worship','Public Transportation Access',
                'Scenic Views','Shopping and Dining Options','Waterfront Property',
            ]],
            ['Community Amenities', null, [
                'Clubhouse','Playground','Pool','Sports Courts','Tennis Courts','Walking Trails',
            ]],
        ];

        // Upsert categories — preserve any existing edits by keying on (type, key).
        $categoryIds = [];
        $catOrder = 10;
        foreach ($catalog as [$categoryName, , ]) {
            if (isset($categoryIds[$categoryName])) continue;
            $key = Str::slug($categoryName, '_');
            $existing = DB::table('taxonomy_terms')
                ->where('type', 'amenity_category')
                ->where('key', $key)
                ->first();
            if ($existing) {
                $categoryIds[$categoryName] = $existing->id;
            } else {
                $id = DB::table('taxonomy_terms')->insertGetId([
                    'type' => 'amenity_category',
                    'parent_id' => null,
                    'key' => $key,
                    'label' => $categoryName,
                    'sub_label' => null,
                    'is_active' => true,
                    'sort_order' => $catOrder,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $categoryIds[$categoryName] = $id;
            }
            $catOrder += 10;
        }

        // Upsert items parented to their category, with sub_label preserved.
        foreach ($catalog as [$categoryName, $subLabel, $items]) {
            $categoryId = $categoryIds[$categoryName];
            $order = 10;
            foreach ($items as $label) {
                $key = Str::slug($label, '_');
                // Scope key uniqueness to amenity items; two categories can have same slug.
                $exists = DB::table('taxonomy_terms')
                    ->where('type', 'amenity')
                    ->where('parent_id', $categoryId)
                    ->where('key', $key)
                    ->exists();
                if ($exists) { $order += 10; continue; }

                DB::table('taxonomy_terms')->insert([
                    'type' => 'amenity',
                    'parent_id' => $categoryId,
                    'key' => $key,
                    'label' => $label,
                    'sub_label' => $subLabel,
                    'is_active' => true,
                    'sort_order' => $order,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $order += 10;
            }
        }
    }

    public function down(): void
    {
        DB::table('taxonomy_terms')->whereIn('type', ['amenity', 'amenity_category'])->delete();
    }
};

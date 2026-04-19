<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('taxonomy_terms', function (Blueprint $table) {
            $table->id();
            $table->string('type', 40); // property_type | transaction_type | listing_label | listing_status
            $table->string('key', 100);
            $table->string('label');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['type', 'key']);
            $table->index(['type', 'is_active', 'sort_order']);
        });

        Schema::table('properties', function (Blueprint $table) {
            if (!Schema::hasColumn('properties', 'property_dimensions')) {
                $table->string('property_dimensions', 120)->nullable()->after('acres');
            }
        });

        // Seed initial taxonomy terms based on current hardcoded lists.
        $now = now();
        $rows = [];
        $add = function (string $type, array $items) use (&$rows, $now) {
            foreach ($items as $i => [$key, $label]) {
                $rows[] = [
                    'type' => $type,
                    'key' => $key,
                    'label' => $label,
                    'is_active' => true,
                    'sort_order' => $i * 10,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        };

        $add('property_type', [
            ['single-family-home', 'Single Family Home'],
            ['two-family-home', 'Two Family Home'],
            ['three-family-home', 'Three Family Home'],
            ['four-family-home', 'Four Family Home'],
            ['condos-townhomes-co-ops', 'Condos / Townhomes / Co-Ops'],
            ['townhouse', 'Townhouse'],
            ['condo', 'Condo'],
            ['multi-family', 'Multi-Family'],
            ['land', 'Lot / Land'],
            ['farms-ranches', 'Farms / Ranches'],
            ['mfd-mobile-homes', 'Manufactured / Mobile Home'],
        ]);

        $add('transaction_type', [
            ['for_sale', 'For Sale By Owner'],
            ['for_rent', 'For Rent By Owner'],
        ]);

        $add('listing_label', [
            ['new_listing', 'New Listing'],
            ['open_house', 'Open House'],
            ['price_reduced', 'Price Reduced'],
            ['back_on_market', 'Back On Market'],
        ]);

        $add('listing_status', [
            ['for_sale', 'Active (For Sale)'],
            ['pending', 'Pending (Under Contract)'],
            ['sold', 'Sold'],
            ['inactive', 'Inactive (Off-Market)'],
        ]);

        DB::table('taxonomy_terms')->insert($rows);
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn('property_dimensions');
        });
        Schema::dropIfExists('taxonomy_terms');
    }
};

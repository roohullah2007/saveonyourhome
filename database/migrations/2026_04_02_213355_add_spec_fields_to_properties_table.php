<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('transaction_type', 20)->default('for_sale')->after('status'); // for_sale, for_rent
            $table->string('listing_headline', 80)->nullable()->after('property_title');
            $table->boolean('has_hoa')->default(false)->after('features');
            $table->decimal('hoa_fee', 10, 2)->nullable()->after('has_hoa');
            $table->string('listing_label', 30)->nullable()->after('listing_status'); // new_listing, open_house, price_reduced, back_on_market
            $table->unsignedTinyInteger('garage')->nullable()->after('year_built');
            $table->string('basement', 30)->nullable()->after('garage'); // none, finished, unfinished, partial
            $table->unsignedTinyInteger('stories')->nullable()->after('basement');
            // Rental fields
            $table->decimal('monthly_rent', 10, 2)->nullable()->after('price');
            $table->date('available_from')->nullable()->after('monthly_rent');
            $table->string('lease_term', 30)->nullable()->after('available_from');
            $table->boolean('pets_allowed')->nullable()->after('lease_term');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'transaction_type', 'listing_headline', 'has_hoa', 'hoa_fee',
                'listing_label', 'garage', 'basement', 'stories',
                'monthly_rent', 'available_from', 'lease_term', 'pets_allowed',
            ]);
        });
    }
};

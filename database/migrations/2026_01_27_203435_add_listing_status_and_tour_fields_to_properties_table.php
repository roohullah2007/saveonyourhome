<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            // Listing status: for_sale, for_rent, pending, sold, inactive
            $table->string('listing_status', 20)->default('for_sale')->after('status');

            // Matterport 3D tour URL
            $table->string('matterport_url')->nullable()->after('virtual_tour_url');

            // MLS-specific virtual tour URL (separate from public site)
            $table->string('mls_virtual_tour_url')->nullable()->after('matterport_url');

            // Indexes for status and location fields
            $table->index('listing_status');
            $table->index('status');
            $table->index(['latitude', 'longitude']);
            $table->index('city');
            $table->index('zip_code');
        });

        // Migrate existing status field values to listing_status
        DB::table('properties')->where('status', 'for-sale')->update(['listing_status' => 'for_sale']);
        DB::table('properties')->where('status', 'for-rent')->update(['listing_status' => 'for_rent']);
        DB::table('properties')->where('status', 'pending')->update(['listing_status' => 'pending']);
        DB::table('properties')->where('status', 'sold')->update(['listing_status' => 'sold']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropIndex(['listing_status']);
            $table->dropIndex(['status']);
            $table->dropIndex(['latitude', 'longitude']);
            $table->dropIndex(['city']);
            $table->dropIndex(['zip_code']);

            $table->dropColumn([
                'listing_status',
                'matterport_url',
                'mls_virtual_tour_url',
            ]);
        });
    }
};

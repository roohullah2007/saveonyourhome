<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            // Listing tier: free, photos, mls
            $table->enum('listing_tier', ['free', 'photos', 'mls'])->default('free')->after('approval_status');

            // Photo/Multimedia upgrade fields
            $table->boolean('has_professional_photos')->default(false)->after('listing_tier');
            $table->boolean('has_virtual_tour')->default(false)->after('has_professional_photos');
            $table->boolean('has_video')->default(false)->after('has_virtual_tour');
            $table->string('virtual_tour_url')->nullable()->after('has_video');
            $table->string('video_url')->nullable()->after('virtual_tour_url');

            // MLS upgrade fields
            $table->boolean('is_mls_listed')->default(false)->after('video_url');
            $table->string('mls_number')->nullable()->after('is_mls_listed');
            $table->timestamp('mls_listed_at')->nullable()->after('mls_number');
            $table->timestamp('mls_expires_at')->nullable()->after('mls_listed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'listing_tier',
                'has_professional_photos',
                'has_virtual_tour',
                'has_video',
                'virtual_tour_url',
                'video_url',
                'is_mls_listed',
                'mls_number',
                'mls_listed_at',
                'mls_expires_at',
            ]);
        });
    }
};

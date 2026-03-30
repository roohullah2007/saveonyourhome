<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->unsignedTinyInteger('full_bathrooms')->default(0)->after('bedrooms');
            $table->unsignedTinyInteger('half_bathrooms')->default(0)->after('full_bathrooms');
        });

        // Migrate existing data: convert bathrooms to full_bathrooms
        // Whole numbers become full baths, .5 becomes half bath
        DB::statement('UPDATE properties SET full_bathrooms = FLOOR(bathrooms), half_bathrooms = IF(bathrooms - FLOOR(bathrooms) >= 0.5, 1, 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['full_bathrooms', 'half_bathrooms']);
        });
    }
};

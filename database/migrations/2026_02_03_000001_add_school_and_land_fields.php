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
            // School Information (ALL property types)
            $table->string('school_district')->nullable()->after('subdivision');
            $table->string('grade_school')->nullable()->after('school_district');
            $table->string('middle_school')->nullable()->after('grade_school');
            $table->string('high_school')->nullable()->after('middle_school');

            // Enhanced Lot/Land Fields
            $table->decimal('acres', 10, 4)->nullable()->after('lot_size');
            $table->string('zoning', 100)->nullable()->after('acres');

            // Add index on school_district for search
            $table->index('school_district');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropIndex(['school_district']);
            $table->dropColumn([
                'school_district',
                'grade_school',
                'middle_school',
                'high_school',
                'acres',
                'zoning',
            ]);
        });
    }
};

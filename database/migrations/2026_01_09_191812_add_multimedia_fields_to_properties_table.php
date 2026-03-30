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
            if (!Schema::hasColumn('properties', 'video_tour_url')) {
                $table->string('video_tour_url')->nullable()->after('video_url');
            }
            if (!Schema::hasColumn('properties', 'floor_plan_url')) {
                $table->string('floor_plan_url')->nullable()->after('video_tour_url');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('properties', 'video_tour_url')) {
                $columns[] = 'video_tour_url';
            }
            if (Schema::hasColumn('properties', 'floor_plan_url')) {
                $columns[] = 'floor_plan_url';
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};

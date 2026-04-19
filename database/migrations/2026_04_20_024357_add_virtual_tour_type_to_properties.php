<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            if (!Schema::hasColumn('properties', 'virtual_tour_type')) {
                $table->string('virtual_tour_type', 20)->nullable()->after('virtual_tour_url');
            }
            if (!Schema::hasColumn('properties', 'virtual_tour_embed')) {
                $table->text('virtual_tour_embed')->nullable()->after('virtual_tour_type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['virtual_tour_type', 'virtual_tour_embed']);
        });
    }
};

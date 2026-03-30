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
            // Make optional numeric fields nullable
            $table->unsignedTinyInteger('half_bathrooms')->nullable()->default(null)->change();
            $table->integer('sqft')->nullable()->default(null)->change();
            $table->integer('year_built')->nullable()->default(null)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->unsignedTinyInteger('half_bathrooms')->default(0)->change();
            $table->integer('sqft')->nullable(false)->change();
            $table->integer('year_built')->nullable(false)->change();
        });
    }
};

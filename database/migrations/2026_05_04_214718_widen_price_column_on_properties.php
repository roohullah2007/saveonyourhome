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
        // The original price column was decimal(12,2) — max ~$9.99B,
        // which overflows for buggy/test inputs and very-high-end
        // commercial listings. Widen to decimal(15,2) (~$9.99T cap)
        // and apply the same widening to monthly_rent + hoa_fee +
        // annual_property_tax for consistency.
        Schema::table('properties', function (Blueprint $table) {
            $table->decimal('price', 15, 2)->change();
            $table->decimal('monthly_rent', 12, 2)->nullable()->change();
            $table->decimal('hoa_fee', 12, 2)->nullable()->change();
            $table->decimal('annual_property_tax', 13, 2)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->decimal('price', 12, 2)->change();
            $table->decimal('monthly_rent', 10, 2)->nullable()->change();
            $table->decimal('hoa_fee', 8, 2)->nullable()->change();
            $table->decimal('annual_property_tax', 10, 2)->nullable()->change();
        });
    }
};

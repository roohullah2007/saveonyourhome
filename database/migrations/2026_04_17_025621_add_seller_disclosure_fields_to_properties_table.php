<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->decimal('annual_property_tax', 10, 2)->nullable()->after('hoa_fee');
            $table->boolean('is_motivated_seller')->default(false)->after('is_featured');
            $table->boolean('open_to_realtors')->default(true)->after('is_motivated_seller');
            $table->boolean('requires_pre_approval')->default(false)->after('open_to_realtors');
            $table->string('county')->nullable()->after('zip_code');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'annual_property_tax',
                'is_motivated_seller',
                'open_to_realtors',
                'requires_pre_approval',
                'county',
            ]);
        });
    }
};

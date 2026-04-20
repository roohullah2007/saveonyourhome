<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('taxonomy_terms', function (Blueprint $table) {
            if (!Schema::hasColumn('taxonomy_terms', 'parent_id')) {
                $table->unsignedBigInteger('parent_id')->nullable()->after('type');
                $table->index('parent_id');
            }
            if (!Schema::hasColumn('taxonomy_terms', 'sub_label')) {
                // Used by amenity items so Kitchen Features can keep its sub-sections
                // (Appliances, Cabinetry, Countertops…) without a third taxonomy level.
                $table->string('sub_label', 120)->nullable()->after('label');
            }
        });
    }

    public function down(): void
    {
        Schema::table('taxonomy_terms', function (Blueprint $table) {
            if (Schema::hasColumn('taxonomy_terms', 'parent_id')) {
                $table->dropIndex(['parent_id']);
                $table->dropColumn('parent_id');
            }
            if (Schema::hasColumn('taxonomy_terms', 'sub_label')) {
                $table->dropColumn('sub_label');
            }
        });
    }
};

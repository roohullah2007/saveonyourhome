<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('saved_searches', function (Blueprint $table) {
            if (!Schema::hasColumn('saved_searches', 'alerts_enabled')) {
                $table->boolean('alerts_enabled')->default(false)->after('filters');
            }
            if (!Schema::hasColumn('saved_searches', 'last_alerted_at')) {
                $table->timestamp('last_alerted_at')->nullable()->after('alerts_enabled');
            }
        });

        // Per-property-per-search ledger so a listing is never alerted on twice
        // for the same saved search, even if the approval status toggles.
        Schema::create('saved_search_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('saved_search_id')->constrained('saved_searches')->cascadeOnDelete();
            $table->foreignId('property_id')->constrained('properties')->cascadeOnDelete();
            $table->timestamp('alerted_at')->useCurrent();

            $table->unique(['saved_search_id', 'property_id']);
            $table->index('alerted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_search_alerts');
        Schema::table('saved_searches', function (Blueprint $table) {
            if (Schema::hasColumn('saved_searches', 'last_alerted_at')) {
                $table->dropColumn('last_alerted_at');
            }
            if (Schema::hasColumn('saved_searches', 'alerts_enabled')) {
                $table->dropColumn('alerts_enabled');
            }
        });
    }
};

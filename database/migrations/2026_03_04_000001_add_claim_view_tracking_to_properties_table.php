<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->timestamp('claim_first_viewed_at')->nullable();
            $table->timestamp('claim_last_viewed_at')->nullable();
            $table->unsignedInteger('claim_view_count')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['claim_first_viewed_at', 'claim_last_viewed_at', 'claim_view_count']);
        });
    }
};

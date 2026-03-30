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
            // Track original owner when transferred to admin
            $table->unsignedBigInteger('original_user_id')->nullable()->after('user_id');
            $table->foreign('original_user_id')->references('id')->on('users')->nullOnDelete();

            // Testimonial fields
            $table->text('testimonial')->nullable()->after('description');
            $table->string('testimonial_name')->nullable()->after('testimonial');

            // Showcase flag for marketing-approved listings
            $table->boolean('is_showcase')->default(false)->after('is_featured');

            // Track when listing was sold/transferred
            $table->timestamp('sold_at')->nullable()->after('approved_at');
            $table->timestamp('transferred_at')->nullable()->after('sold_at');

            // Soft deletes - preserve data
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropForeign(['original_user_id']);
            $table->dropColumn([
                'original_user_id',
                'testimonial',
                'testimonial_name',
                'is_showcase',
                'sold_at',
                'transferred_at',
                'deleted_at',
            ]);
        });
    }
};

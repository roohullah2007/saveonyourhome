<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $t) {
            $t->unsignedBigInteger('wp_id')->nullable()->after('id');
            $t->unique('wp_id', 'users_wp_id_unique');
        });

        Schema::table('properties', function (Blueprint $t) {
            $t->unsignedBigInteger('wp_id')->nullable()->after('id');
            $t->unique('wp_id', 'properties_wp_id_unique');
        });

        Schema::table('taxonomy_terms', function (Blueprint $t) {
            $t->unsignedBigInteger('wp_term_id')->nullable()->after('id');
            $t->index('wp_term_id', 'taxonomy_terms_wp_term_id_idx');
        });

        Schema::table('property_images', function (Blueprint $t) {
            $t->unsignedBigInteger('wp_attachment_id')->nullable()->after('id');
            $t->index('wp_attachment_id', 'property_images_wp_attachment_id_idx');
        });

        Schema::table('resources', function (Blueprint $t) {
            $t->unsignedBigInteger('wp_id')->nullable()->after('id');
            $t->unique('wp_id', 'resources_wp_id_unique');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $t) {
            $t->dropUnique('users_wp_id_unique');
            $t->dropColumn('wp_id');
        });
        Schema::table('properties', function (Blueprint $t) {
            $t->dropUnique('properties_wp_id_unique');
            $t->dropColumn('wp_id');
        });
        Schema::table('taxonomy_terms', function (Blueprint $t) {
            $t->dropIndex('taxonomy_terms_wp_term_id_idx');
            $t->dropColumn('wp_term_id');
        });
        Schema::table('property_images', function (Blueprint $t) {
            $t->dropIndex('property_images_wp_attachment_id_idx');
            $t->dropColumn('wp_attachment_id');
        });
        Schema::table('resources', function (Blueprint $t) {
            $t->dropUnique('resources_wp_id_unique');
            $t->dropColumn('wp_id');
        });
    }
};

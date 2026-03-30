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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();

            // Basic Information
            $table->string('property_title');
            $table->string('property_type');
            $table->string('status')->default('for-sale');
            $table->decimal('price', 12, 2);

            // Location
            $table->string('address');
            $table->string('city');
            $table->string('state')->default('Oklahoma');
            $table->string('zip_code');
            $table->string('subdivision')->nullable();

            // Property Details
            $table->integer('bedrooms');
            $table->decimal('bathrooms', 3, 1);
            $table->integer('sqft');
            $table->integer('lot_size')->nullable();
            $table->integer('year_built')->nullable();

            // Description
            $table->text('description');

            // Features (stored as JSON)
            $table->json('features')->nullable();

            // Photos (stored as JSON array of file paths)
            $table->json('photos')->nullable();

            // Contact Information
            $table->string('contact_name');
            $table->string('contact_email');
            $table->string('contact_phone');

            // Additional fields
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->integer('views')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};

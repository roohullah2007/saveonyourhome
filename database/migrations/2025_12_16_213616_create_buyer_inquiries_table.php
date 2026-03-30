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
        Schema::create('buyer_inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('preferred_area');
            $table->string('price_min');
            $table->string('price_max');
            $table->enum('mls_setup', ['yes', 'no'])->default('no');
            $table->enum('preapproved', ['yes', 'no'])->default('no');
            $table->enum('status', ['new', 'contacted', 'converted', 'closed'])->default('new');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buyer_inquiries');
    }
};

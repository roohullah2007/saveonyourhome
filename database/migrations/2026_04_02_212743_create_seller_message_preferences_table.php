<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seller_message_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('delivery_method', 20)->default('email'); // email, sms, both, platform
            $table->boolean('show_phone_publicly')->default(false);
            $table->boolean('show_email_publicly')->default(false);
            $table->string('preferred_contact_hours')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seller_message_preferences');
    }
};

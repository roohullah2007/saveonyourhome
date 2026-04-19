<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seller_availability_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('day_of_week'); // 0=Sunday .. 6=Saturday
            $table->time('start_time');
            $table->time('end_time');
            $table->unsignedSmallInteger('slot_duration_minutes')->default(30);
            $table->boolean('allow_phone')->default(true);
            $table->boolean('allow_in_person')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['user_id', 'day_of_week', 'is_active']);
        });

        Schema::create('property_showings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->foreignId('seller_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('buyer_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('buyer_name');
            $table->string('buyer_email');
            $table->string('buyer_phone', 50)->nullable();
            $table->enum('meeting_type', ['phone', 'in_person']);
            $table->dateTime('scheduled_at');
            $table->unsignedSmallInteger('duration_minutes')->default(30);
            $table->enum('status', ['confirmed', 'cancelled', 'completed', 'no_show'])->default('confirmed');
            $table->text('buyer_notes')->nullable();
            $table->string('cancellation_token', 64)->unique();
            $table->timestamp('cancelled_at')->nullable();
            $table->enum('cancelled_by', ['buyer', 'seller', 'system'])->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();

            $table->index(['seller_user_id', 'scheduled_at']);
            $table->index(['property_id', 'scheduled_at']);
            $table->index('scheduled_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_showings');
        Schema::dropIfExists('seller_availability_rules');
    }
};

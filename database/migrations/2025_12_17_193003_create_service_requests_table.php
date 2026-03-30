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
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_id')->constrained()->onDelete('cascade');

            // Service type: photos, virtual_tour, video, mls
            $table->enum('service_type', ['photos', 'virtual_tour', 'video', 'mls']);

            // Status: pending, approved, in_progress, completed, cancelled
            $table->enum('status', ['pending', 'approved', 'in_progress', 'completed', 'cancelled'])->default('pending');

            // Request details
            $table->text('notes')->nullable();
            $table->text('admin_notes')->nullable();

            // Scheduling for photo/video shoots
            $table->date('preferred_date')->nullable();
            $table->string('preferred_time')->nullable();
            $table->timestamp('scheduled_at')->nullable();

            // Payment tracking
            $table->decimal('price', 10, 2)->nullable();
            $table->boolean('is_paid')->default(false);
            $table->timestamp('paid_at')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_reference')->nullable();

            // Admin processing
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};

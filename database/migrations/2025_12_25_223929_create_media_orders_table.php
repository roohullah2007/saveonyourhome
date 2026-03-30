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
        Schema::create('media_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('property_id')->nullable()->constrained()->onDelete('set null');

            // Property Details
            $table->string('address');
            $table->string('sqft_range');
            $table->string('access_method'); // homeowner, combo, garage
            $table->string('combo_code')->nullable();
            $table->string('alarm_code')->nullable();
            $table->string('occupied_status'); // occupied, vacant
            $table->string('subdivision')->nullable();
            $table->text('notes')->nullable();

            // Photo Package
            $table->string('photo_package'); // photos, photosDrone

            // Additional Media (JSON)
            $table->json('additional_media')->nullable();

            // MLS Options
            $table->string('mls_package')->nullable(); // basic, deluxe
            $table->boolean('broker_assisted')->default(false);
            $table->json('mls_signers')->nullable();

            // Scheduling
            $table->date('preferred_date')->nullable();
            $table->string('preferred_time')->nullable(); // morning, afternoon, flexible
            $table->datetime('scheduled_at')->nullable();

            // Contact Info (for guests)
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();

            // Pricing
            $table->decimal('total_price', 10, 2)->default(0);

            // Status
            $table->enum('status', [
                'pending',
                'confirmed',
                'scheduled',
                'in_progress',
                'completed',
                'cancelled'
            ])->default('pending');

            // Payment
            $table->boolean('is_paid')->default(false);
            $table->datetime('paid_at')->nullable();
            $table->string('payment_method')->nullable(); // venmo, cashapp, paypal, cash, check
            $table->string('payment_reference')->nullable();

            // Admin
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->datetime('processed_at')->nullable();
            $table->text('admin_notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_orders');
    }
};

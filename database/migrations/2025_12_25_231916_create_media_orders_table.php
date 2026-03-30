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
        if (Schema::hasTable('media_orders')) {
            return;
        }

        Schema::create('media_orders', function (Blueprint $table) {
            $table->id();

            // Customer Info
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone')->nullable();

            // Property Info
            $table->foreignId('property_id')->nullable()->constrained()->nullOnDelete();
            $table->string('address');
            $table->string('city');
            $table->string('state')->default('OK');
            $table->string('zip_code');
            $table->string('sqft_range'); // e.g., "2000-2499"
            $table->string('property_type')->default('residential'); // residential, commercial, land
            $table->boolean('vacant')->default(false);
            $table->string('lockbox_code')->nullable();

            // Photo Package (required)
            $table->string('photo_package'); // 'photos' or 'photosDrone'
            $table->decimal('photo_price', 10, 2);

            // Additional Media (JSON array of selected services)
            $table->json('additional_media')->nullable(); // ['zillow3D', 'videoWalkthrough', etc.]
            $table->decimal('additional_media_price', 10, 2)->default(0);

            // MLS Options
            $table->string('mls_package')->nullable(); // 'basic' or 'deluxe'
            $table->decimal('mls_price', 10, 2)->default(0);
            $table->json('mls_signers')->nullable(); // Array of {name, email} for MLS signing

            // Broker Assisted
            $table->boolean('broker_assisted')->default(false);
            $table->string('broker_package')->nullable(); // 'standard' (0.5%/$2000) or 'unrepresented' (1%/$4000)

            // Virtual Twilight
            $table->integer('virtual_twilight_count')->default(0);
            $table->decimal('virtual_twilight_price', 10, 2)->default(0);

            // Scheduling
            $table->date('preferred_date_1')->nullable();
            $table->string('preferred_time_1')->nullable();
            $table->date('preferred_date_2')->nullable();
            $table->string('preferred_time_2')->nullable();
            $table->datetime('scheduled_at')->nullable();
            $table->text('special_instructions')->nullable();

            // Totals
            $table->decimal('total_price', 10, 2);

            // Status & Payment
            $table->enum('status', [
                'pending',
                'confirmed',
                'scheduled',
                'in_progress',
                'completed',
                'cancelled'
            ])->default('pending');

            $table->boolean('is_paid')->default(false);
            $table->string('payment_method')->nullable(); // venmo, cashapp, paypal, cash, check
            $table->datetime('paid_at')->nullable();

            // Admin Notes
            $table->text('admin_notes')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            // Indexes
            $table->index('email');
            $table->index('status');
            $table->index('created_at');
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

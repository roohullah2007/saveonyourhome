<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('import_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('imported_by')->constrained('users');
            $table->string('source')->default('zillow');
            $table->string('original_filename');
            $table->integer('total_records')->default(0);
            $table->integer('imported_count')->default(0);
            $table->integer('failed_count')->default(0);
            $table->integer('claimed_count')->default(0);
            $table->timestamp('expires_at');
            $table->json('errors')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('import_batches');
    }
};

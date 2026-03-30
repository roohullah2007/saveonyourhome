<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('import_source')->nullable()->after('mls_expires_at');
            $table->foreignId('import_batch_id')->nullable()->after('import_source')
                ->constrained('import_batches')->nullOnDelete();
            $table->string('claim_token', 36)->nullable()->unique()->after('import_batch_id');
            $table->timestamp('claim_expires_at')->nullable()->after('claim_token');
            $table->timestamp('claimed_at')->nullable()->after('claim_expires_at');
            $table->string('owner_name')->nullable()->after('claimed_at');
            $table->string('owner_mailing_address')->nullable()->after('owner_name');
            $table->string('owner_phone')->nullable()->after('owner_mailing_address');
            $table->string('owner_email')->nullable()->after('owner_phone');

            $table->index('claim_expires_at');
            $table->index('import_source');
            $table->index('import_batch_id');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropForeign(['import_batch_id']);
            $table->dropIndex(['claim_expires_at']);
            $table->dropIndex(['import_source']);
            $table->dropIndex(['import_batch_id']);
            $table->dropColumn([
                'import_source',
                'import_batch_id',
                'claim_token',
                'claim_expires_at',
                'claimed_at',
                'owner_name',
                'owner_mailing_address',
                'owner_phone',
                'owner_email',
            ]);
        });
    }
};

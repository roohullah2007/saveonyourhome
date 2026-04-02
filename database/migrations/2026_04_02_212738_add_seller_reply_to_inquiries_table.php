<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            $table->text('seller_reply')->nullable()->after('admin_notes');
            $table->timestamp('seller_replied_at')->nullable()->after('seller_reply');
            $table->string('delivery_method', 20)->default('email')->after('seller_replied_at');
            $table->timestamp('email_delivered_at')->nullable()->after('delivery_method');
            $table->timestamp('seller_read_at')->nullable()->after('email_delivered_at');
        });
    }

    public function down(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            $table->dropColumn(['seller_reply', 'seller_replied_at', 'delivery_method', 'email_delivered_at', 'seller_read_at']);
        });
    }
};

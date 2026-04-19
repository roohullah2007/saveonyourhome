<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Extend the approval_status enum with two new states.
        DB::statement("ALTER TABLE properties MODIFY COLUMN approval_status ENUM('draft', 'pending', 'approved', 'rejected', 'changes_requested') NOT NULL DEFAULT 'pending'");

        Schema::table('properties', function (Blueprint $table) {
            if (!Schema::hasColumn('properties', 'admin_feedback')) {
                $table->text('admin_feedback')->nullable()->after('rejection_reason');
            }
            if (!Schema::hasColumn('properties', 'changes_requested_at')) {
                $table->timestamp('changes_requested_at')->nullable()->after('admin_feedback');
            }
            if (!Schema::hasColumn('properties', 'published_at')) {
                $table->timestamp('published_at')->nullable()->after('changes_requested_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['admin_feedback', 'changes_requested_at', 'published_at']);
        });

        DB::statement("UPDATE properties SET approval_status = 'pending' WHERE approval_status IN ('draft', 'changes_requested')");
        DB::statement("ALTER TABLE properties MODIFY COLUMN approval_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'");
    }
};

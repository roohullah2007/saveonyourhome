<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE properties MODIFY COLUMN approval_status ENUM('draft', 'pending', 'approved', 'rejected', 'changes_requested', 'on_hold') NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        DB::statement("UPDATE properties SET approval_status = 'pending' WHERE approval_status = 'on_hold'");
        DB::statement("ALTER TABLE properties MODIFY COLUMN approval_status ENUM('draft', 'pending', 'approved', 'rejected', 'changes_requested') NOT NULL DEFAULT 'pending'");
    }
};

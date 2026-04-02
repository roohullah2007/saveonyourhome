<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE service_requests MODIFY COLUMN service_type ENUM('photos', 'virtual_tour', 'video', 'mls', 'qr_stickers', 'yard_sign')");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE service_requests MODIFY COLUMN service_type ENUM('photos', 'virtual_tour', 'video', 'mls')");
        }
    }
};

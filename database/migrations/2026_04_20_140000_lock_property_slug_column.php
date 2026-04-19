<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            if (!Schema::hasColumn('properties', 'slug')) {
                $table->string('slug', 255)->nullable()->after('id');
                $table->index('slug');
            }
        });

        // Backfill using the same format the accessor used previously: "{id}-{slugified-address}".
        // Once populated, the model locks this value so printed QR codes / yard signs remain valid.
        DB::table('properties')->whereNull('slug')->orderBy('id')->chunkById(200, function ($rows) {
            foreach ($rows as $row) {
                $address = strtolower(trim((string) ($row->address ?? '')));
                $address = preg_replace('/[^a-z0-9\s-]/', '', $address);
                $address = preg_replace('/[\s-]+/', '-', $address);
                $address = trim($address, '-');
                $slug = $row->id . ($address !== '' ? '-' . $address : '');
                DB::table('properties')->where('id', $row->id)->update(['slug' => $slug]);
            }
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            if (Schema::hasColumn('properties', 'slug')) {
                $table->dropIndex(['slug']);
                $table->dropColumn('slug');
            }
        });
    }
};

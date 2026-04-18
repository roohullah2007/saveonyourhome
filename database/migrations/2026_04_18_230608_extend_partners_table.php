<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('partners', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('name');
            $table->string('logo')->nullable()->after('description');
            $table->json('services')->nullable()->after('logo');
            $table->string('contact_name')->nullable()->after('name');
            $table->foreignId('user_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])
                ->default('approved')
                ->after('is_active');
            $table->text('rejection_reason')->nullable()->after('approval_status');
            $table->timestamp('approved_at')->nullable()->after('rejection_reason');
            $table->index('approval_status');
        });

        // Backfill slugs for existing rows
        DB::table('partners')->whereNull('slug')->orderBy('id')->get()->each(function ($row) {
            $base = Str::slug($row->name) ?: 'partner-' . $row->id;
            $slug = $base;
            $i = 2;
            while (DB::table('partners')->where('slug', $slug)->where('id', '!=', $row->id)->exists()) {
                $slug = $base . '-' . $i++;
            }
            DB::table('partners')->where('id', $row->id)->update(['slug' => $slug]);
        });

        Schema::table('partners', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->unique()->change();
        });
    }

    public function down(): void
    {
        Schema::table('partners', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['approval_status']);
            $table->dropUnique(['slug']);
            $table->dropColumn([
                'slug', 'logo', 'services', 'contact_name', 'user_id',
                'approval_status', 'rejection_reason', 'approved_at',
            ]);
        });
    }
};

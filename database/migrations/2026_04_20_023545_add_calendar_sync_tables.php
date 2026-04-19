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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'calendar_feed_token')) {
                $table->string('calendar_feed_token', 64)->nullable()->unique()->after('remember_token');
            }
        });

        // Backfill feed tokens for existing users
        DB::table('users')->whereNull('calendar_feed_token')->orderBy('id')->chunkById(200, function ($rows) {
            foreach ($rows as $row) {
                DB::table('users')->where('id', $row->id)->update([
                    'calendar_feed_token' => Str::random(48),
                ]);
            }
        });

        Schema::create('external_calendars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->string('ics_url', 1000);
            $table->timestamp('last_synced_at')->nullable();
            $table->text('last_sync_error')->nullable();
            $table->unsignedInteger('last_event_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['user_id', 'is_active']);
        });

        Schema::create('external_busy_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('external_calendar_id')->constrained()->cascadeOnDelete();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->string('source_uid', 500)->nullable();
            $table->string('summary', 500)->nullable();
            $table->timestamps();
            $table->index(['external_calendar_id', 'starts_at', 'ends_at'], 'ebe_cal_range_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('external_busy_events');
        Schema::dropIfExists('external_calendars');
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['calendar_feed_token']);
            $table->dropColumn('calendar_feed_token');
        });
    }
};

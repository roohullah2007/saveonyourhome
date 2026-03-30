<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule cleanup of temporary files (ZIP downloads) every hour
Schedule::command('cleanup:temp-files')->hourly();

// Clean up expired unclaimed imported properties daily at 3 AM
Schedule::command('imports:cleanup')->dailyAt('03:00');

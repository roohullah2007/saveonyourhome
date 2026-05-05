<?php

namespace App\Console\Commands;

use App\Models\Property;
use App\Services\GeocodingService;
use Illuminate\Console\Command;

class BackfillPropertyCoordinates extends Command
{
    protected $signature = 'properties:geocode {--limit=0 : Stop after N successful geocodes (0 = all)}';

    protected $description = 'Geocode any property still missing latitude/longitude so map/nearby/walkscore cards work.';

    public function handle(): int
    {
        $query = Property::query()
            ->where(function ($q) {
                $q->whereNull('latitude')->orWhereNull('longitude');
            })
            ->whereNotNull('address')
            ->where('address', '!=', '');

        $total = (clone $query)->count();
        $this->info("Found {$total} properties missing coordinates.");

        if ($total === 0) {
            return self::SUCCESS;
        }

        $limit = (int) $this->option('limit');
        $done = 0;
        $ok = 0;
        $fail = 0;

        $bar = $this->output->createProgressBar($limit > 0 ? min($limit, $total) : $total);
        $bar->start();

        $query->orderBy('id')->chunk(50, function ($props) use (&$done, &$ok, &$fail, $limit, $bar) {
            foreach ($props as $p) {
                if ($limit > 0 && $ok >= $limit) {
                    return false;
                }
                try {
                    $updated = GeocodingService::geocodeProperty($p);
                    $updated ? $ok++ : $fail++;
                } catch (\Throwable $e) {
                    $fail++;
                    $this->error("\n#{$p->id}: " . $e->getMessage());
                }
                $done++;
                $bar->advance();
                // Polite delay so Google/Nominatim don't throttle.
                usleep(150000); // 150ms
            }
        });

        $bar->finish();
        $this->newLine(2);
        $this->info("Geocoded: {$ok}");
        $this->warn("Skipped/failed: {$fail}");

        return self::SUCCESS;
    }
}

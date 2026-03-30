<?php

namespace App\Console\Commands;

use App\Models\Property;
use App\Services\GeocodingService;
use Illuminate\Console\Command;

class GeocodeProperties extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'properties:geocode {--force : Geocode all properties, even those with coordinates}';

    /**
     * The console command description.
     */
    protected $description = 'Geocode properties that are missing latitude/longitude coordinates';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $query = Property::query();

        if (!$this->option('force')) {
            $query->where(function ($q) {
                $q->whereNull('latitude')
                    ->orWhereNull('longitude');
            });
        }

        $properties = $query->get();
        $total = $properties->count();

        if ($total === 0) {
            $this->info('No properties need geocoding.');
            return 0;
        }

        $this->info("Found {$total} properties to geocode...");
        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $success = 0;
        $failed = 0;

        foreach ($properties as $property) {
            // Clear existing coordinates if force flag is set
            if ($this->option('force')) {
                $property->latitude = null;
                $property->longitude = null;
                $property->save();
            }

            $result = GeocodingService::geocodeProperty($property);

            if ($result) {
                $success++;
            } else {
                $failed++;
            }

            $bar->advance();

            // Rate limit to avoid overloading Nominatim API (max 1 request per second)
            usleep(1100000); // 1.1 seconds
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Geocoding complete!");
        $this->info("  - Successfully geocoded: {$success}");
        $this->info("  - Failed: {$failed}");

        return 0;
    }
}

<?php

namespace App\Services;

use App\Models\ImportBatch;
use App\Models\Property;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class CsvImportService
{
    protected const REQUIRED_COLUMNS = ['address', 'city', 'price'];

    protected const VALID_COLUMNS = [
        'owner_name', 'owner_address', 'owner_phone', 'owner_email',
        'address', 'city', 'state', 'zip_code', 'price', 'bedrooms', 'bathrooms',
        'sqft', 'property_type', 'year_built', 'lot_size', 'description',
    ];

    protected const VALID_PROPERTY_TYPES = [
        'single_family', 'condo', 'townhouse', 'multi_family', 'land', 'mobile_home',
    ];

    /**
     * Parse and validate a CSV file.
     */
    public function parseAndValidate(UploadedFile $file): array
    {
        $rows = [];
        $errors = [];

        $handle = fopen($file->getPathname(), 'r');
        if (!$handle) {
            return ['valid' => [], 'errors' => [['row' => 0, 'message' => 'Could not open file']]];
        }

        // Read header row
        $header = fgetcsv($handle);
        if (!$header) {
            fclose($handle);
            return ['valid' => [], 'errors' => [['row' => 0, 'message' => 'Empty CSV file']]];
        }

        // Normalize headers (trim, lowercase, underscores)
        $header = array_map(function ($col) {
            return str_replace([' ', '-'], '_', strtolower(trim($col)));
        }, $header);

        // Check for required columns
        foreach (self::REQUIRED_COLUMNS as $required) {
            if (!in_array($required, $header)) {
                fclose($handle);
                return ['valid' => [], 'errors' => [['row' => 0, 'message' => "Missing required column: {$required}"]]];
            }
        }

        $rowNum = 1;
        while (($data = fgetcsv($handle)) !== false) {
            $rowNum++;

            // Skip empty rows
            if (count(array_filter($data)) === 0) {
                continue;
            }

            // Map to associative array
            $row = [];
            foreach ($header as $i => $col) {
                $row[$col] = isset($data[$i]) ? trim($data[$i]) : '';
            }

            // Validate row
            $rowErrors = $this->validateRow($row, $rowNum);

            if (!empty($rowErrors)) {
                foreach ($rowErrors as $error) {
                    $errors[] = ['row' => $rowNum, 'message' => $error];
                }
            } else {
                $row['_row_num'] = $rowNum;
                $rows[] = $row;
            }
        }

        fclose($handle);

        return ['valid' => $rows, 'errors' => $errors];
    }

    protected function validateRow(array $row, int $rowNum): array
    {
        $errors = [];

        if (empty($row['address'])) {
            $errors[] = "Address is required";
        }
        if (empty($row['city'])) {
            $errors[] = "City is required";
        }
        if (empty($row['price']) || !is_numeric(str_replace([',', '$'], '', $row['price']))) {
            $errors[] = "Valid price is required";
        }
        if (!empty($row['bedrooms']) && !is_numeric($row['bedrooms'])) {
            $errors[] = "Bedrooms must be a number";
        }
        if (!empty($row['bathrooms']) && !is_numeric($row['bathrooms'])) {
            $errors[] = "Bathrooms must be a number";
        }
        if (!empty($row['sqft']) && !is_numeric(str_replace(',', '', $row['sqft']))) {
            $errors[] = "Sqft must be a number";
        }
        if (!empty($row['property_type']) && !in_array(strtolower($row['property_type']), self::VALID_PROPERTY_TYPES)) {
            $errors[] = "Invalid property type: {$row['property_type']}";
        }
        if (!empty($row['year_built']) && (!is_numeric($row['year_built']) || $row['year_built'] < 1800 || $row['year_built'] > date('Y') + 1)) {
            $errors[] = "Invalid year built";
        }

        return $errors;
    }

    /**
     * Import validated rows into the database.
     */
    public function import(array $rows, ImportBatch $batch): ImportBatch
    {
        $imported = 0;
        $failed = 0;
        $errors = $batch->errors ?? [];

        foreach ($rows as $row) {
            try {
                $this->createPropertyFromRow($row, $batch);
                $imported++;
            } catch (\Exception $e) {
                $failed++;
                $errors[] = [
                    'row' => $row['_row_num'] ?? 0,
                    'message' => $e->getMessage(),
                ];
            }
        }

        $batch->update([
            'imported_count' => $imported,
            'failed_count' => $failed,
            'errors' => !empty($errors) ? $errors : null,
        ]);

        return $batch;
    }

    /**
     * Create a single property from a CSV row.
     */
    public function createPropertyFromRow(array $row, ImportBatch $batch): Property
    {
        $price = (float) str_replace([',', '$'], '', $row['price']);
        $propertyType = !empty($row['property_type']) ? strtolower($row['property_type']) : 'single_family';
        $isLand = $propertyType === 'land';

        $address = $row['address'];
        $city = $row['city'];
        $state = !empty($row['state']) ? $row['state'] : 'Oklahoma';
        $zipCode = $row['zip_code'] ?? '';

        // Auto-generate title from address
        $title = $address . ', ' . $city;

        $property = Property::create([
            'property_title' => $title,
            'property_type' => $propertyType,
            'price' => $price,
            'address' => $address,
            'city' => $city,
            'state' => $state,
            'zip_code' => $zipCode,
            'bedrooms' => $isLand ? 0 : (int) ($row['bedrooms'] ?? 0),
            'bathrooms' => $isLand ? 0 : (float) ($row['bathrooms'] ?? 0),
            'full_bathrooms' => $isLand ? 0 : (int) ($row['bathrooms'] ?? 0),
            'sqft' => $isLand ? 0 : (int) str_replace(',', '', $row['sqft'] ?? '0'),
            'year_built' => $isLand ? null : (!empty($row['year_built']) ? (int) $row['year_built'] : null),
            'lot_size' => !empty($row['lot_size']) ? (int) str_replace(',', '', $row['lot_size']) : null,
            'description' => $row['description'] ?? "For sale by owner in {$city}, Oklahoma.",
            'photos' => [],
            'features' => [],
            'contact_name' => $row['owner_name'] ?? 'Property Owner',
            'contact_email' => $row['owner_email'] ?? '',
            'contact_phone' => $row['owner_phone'] ?? '',
            // Status: hidden until claimed
            'listing_status' => 'inactive',
            'status' => 'inactive',
            'is_active' => false,
            'approval_status' => 'approved',
            // Import fields
            'import_source' => $batch->source,
            'import_batch_id' => $batch->id,
            'claim_token' => Str::uuid()->toString(),
            'claim_expires_at' => $batch->expires_at,
            // Owner info
            'owner_name' => $row['owner_name'] ?? null,
            'owner_mailing_address' => $row['owner_address'] ?? null,
            'owner_phone' => $row['owner_phone'] ?? null,
            'owner_email' => $row['owner_email'] ?? null,
        ]);

        // Geocode in background (best effort)
        GeocodingService::geocodeProperty($property);

        return $property;
    }
}

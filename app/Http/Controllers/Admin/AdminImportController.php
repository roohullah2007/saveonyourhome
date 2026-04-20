<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ImportBatchCompleted;
use App\Models\ActivityLog;
use App\Models\ImportBatch;
use App\Models\Property;
use App\Services\ClaimLetterService;
use App\Services\CsvImportService;
use App\Services\EmailService;
use App\Services\GeocodingService;
use App\Services\ZillowApiService;
use chillerlan\QRCode\{QRCode, QROptions};
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminImportController extends Controller
{
    public function index(Request $request)
    {
        $query = ImportBatch::with('importer')
            ->withCount('properties')
            ->withCount(['properties as viewed_count' => function ($q) {
                $q->where('claim_view_count', '>', 0);
            }]);

        if ($request->tab === 'active') {
            $query->active();
        } elseif ($request->tab === 'expired') {
            $query->expired();
        }

        $batches = $query->latest()->paginate(15)->withQueryString();

        $stats = [
            'total_batches' => ImportBatch::count(),
            'active_batches' => ImportBatch::active()->count(),
            'total_imported' => ImportBatch::sum('imported_count'),
            'total_claimed' => ImportBatch::sum('claimed_count'),
            'total_viewed' => Property::whereNotNull('import_source')->where('claim_view_count', '>', 0)->count(),
        ];

        return Inertia::render('Admin/Imports/Index', [
            'batches' => $batches,
            'stats' => $stats,
            'filters' => $request->only(['tab']),
        ]);
    }

    public function create()
    {
        $zillowService = new ZillowApiService();

        return Inertia::render('Admin/Imports/Create', [
            'hasZillowApi' => $zillowService->isConfigured(),
        ]);
    }

    /**
     * Download a CSV template file with example data.
     */
    public function downloadCsvTemplate()
    {
        $headers = ['address', 'city', 'state', 'zip_code', 'price', 'bedrooms', 'bathrooms', 'sqft', 'property_type', 'year_built', 'lot_size', 'owner_name', 'owner_phone', 'owner_email', 'owner_address', 'description'];
        $example = ['123 Main St', 'Austin', 'Texas', '78701', '299000', '3', '2', '1800', 'single_family', '1995', '0.25', 'John Smith', '555-555-1234', 'john@example.com', '456 Oak Ave, Austin, TX 78701', 'Beautiful 3-bed home in a great neighborhood'];

        $csv = implode(',', $headers) . "\n" . implode(',', $example) . "\n";

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="saveonyourhome-import-template.csv"',
        ]);
    }

    /**
     * Search Zillow via API (AJAX endpoint).
     */
    public function searchZillow(Request $request)
    {
        $request->validate([
            'location' => 'required|string|min:2|max:255',
            'listing_type' => 'nullable|string|in:fsbo,all',
            'page' => 'nullable|integer|min:1',
            'min_price' => 'nullable|integer|min:0',
            'max_price' => 'nullable|integer|min:0',
        ]);

        $service = new ZillowApiService();
        $result = $service->searchByLocation(
            $request->location,
            $request->input('page', 1),
            $request->input('listing_type', 'fsbo'),
            $request->input('min_price'),
            $request->input('max_price')
        );

        // Flag listings that are already imported (exist in DB)
        if ($result['success'] && !empty($result['results'])) {
            $zillowIds = collect($result['results'])->pluck('zillow_id')->filter()->values()->all();
            $existingIds = Property::whereIn('zillow_id', $zillowIds)->pluck('zillow_id')->all();

            foreach ($result['results'] as &$listing) {
                $listing['already_imported'] = in_array($listing['zillow_id'] ?? null, $existingIds);
            }
            unset($listing);
        }

        return response()->json($result);
    }

    /**
     * Import selected Zillow API results.
     */
    public function storeFromApi(Request $request)
    {
        $request->validate([
            'listings' => 'required|array|min:1',
            'listings.*.address' => 'required|string',
            'listings.*.city' => 'required|string',
            'listings.*.state' => 'nullable|string',
            'listings.*.zip_code' => 'nullable|string',
            'listings.*.price' => 'required|numeric|min:0',
            'listings.*.bedrooms' => 'nullable|integer|min:0',
            'listings.*.bathrooms' => 'nullable|numeric|min:0',
            'listings.*.sqft' => 'nullable|integer|min:0',
            'listings.*.property_type' => 'nullable|string',
            'listings.*.latitude' => 'nullable|numeric',
            'listings.*.longitude' => 'nullable|numeric',
            'listings.*.lot_size' => 'nullable|numeric',
            'listings.*.image_url' => 'nullable|string|max:2048',
            'listings.*.zillow_id' => 'nullable|string|max:50',
            'listings.*.zillow_url' => 'nullable|string|max:2048',
            'expiration_days' => 'required|integer|min:1|max:365',
            'notes' => 'nullable|string|max:1000',
        ]);

        $listings = $request->listings;

        $batch = ImportBatch::create([
            'imported_by' => auth()->id(),
            'source' => 'zillow',
            'original_filename' => 'zillow-api-search',
            'total_records' => count($listings),
            'expires_at' => now()->addDays($request->expiration_days),
            'notes' => $request->notes,
        ]);

        $imported = 0;
        $failed = 0;
        $errors = [];
        $zillowService = new ZillowApiService();

        foreach ($listings as $i => $listing) {
            try {
                // Skip if this zillow_id already exists in the database
                $zpid = $listing['zillow_id'] ?? null;
                if ($zpid && Property::where('zillow_id', $zpid)->exists()) {
                    $failed++;
                    $errors[] = ['row' => $i + 1, 'message' => "Property (zpid {$zpid}) already imported"];
                    continue;
                }

                $isLand = ($listing['property_type'] ?? 'single_family') === 'land';
                $address = $listing['address'];
                $city = $listing['city'];
                $state = $listing['state'] ?? '';

                // Fetch property images and contact info
                $photos = [];
                $contact = ['name' => '', 'phone' => '', 'email' => ''];

                $detailUrl = $listing['zillow_url'] ?? null;

                // Primary: scrape all images from the Zillow listing page
                if ($detailUrl) {
                    if ($i > 0) {
                        usleep(2000000); // 2s delay between page fetches
                    }
                    $photos = $zillowService->scrapePropertyImages($detailUrl);
                }

                // Try to get contact info via API (if API is accessible)
                if ($zpid) {
                    if (!empty($photos)) {
                        usleep(800000); // 0.8s delay
                    }
                    $details = $zillowService->fetchPropertyDetails($zpid);
                    $contact = $details['contact'];

                    // If scraping got no photos, try API images as fallback
                    if (empty($photos) && !empty($details['images'])) {
                        $photos = $details['images'];
                    }
                }

                // Last fallback: use search thumbnail upgraded to hi-res
                if (empty($photos) && !empty($listing['image_url'])) {
                    $hiRes = ZillowApiService::upgradeImageUrl($listing['image_url']);
                    $photos = [$hiRes ?? $listing['image_url']];
                }

                $ownerName = $contact['name'] ?: 'Property Owner';

                $property = Property::create([
                    'property_title' => $address . ', ' . $city,
                    'property_type' => $listing['property_type'] ?? 'single_family',
                    'price' => $listing['price'],
                    'address' => $address,
                    'city' => $city,
                    'state' => $state,
                    'zip_code' => $listing['zip_code'] ?? '',
                    'bedrooms' => $isLand ? 0 : (int) ($listing['bedrooms'] ?? 0),
                    'bathrooms' => $isLand ? 0 : (float) ($listing['bathrooms'] ?? 0),
                    'full_bathrooms' => $isLand ? 0 : (int) ($listing['bathrooms'] ?? 0),
                    'sqft' => $isLand ? 0 : (int) ($listing['sqft'] ?? 0),
                    'lot_size' => !empty($listing['lot_size']) ? (int) $listing['lot_size'] : null,
                    'description' => "For sale by owner in {$city}, {$state}.",
                    'photos' => $photos,
                    'features' => [],
                    'owner_name' => $ownerName,
                    'owner_phone' => $contact['phone'],
                    'owner_email' => $contact['email'],
                    'contact_name' => $ownerName,
                    'contact_email' => $contact['email'],
                    'contact_phone' => $contact['phone'],
                    'listing_status' => 'inactive',
                    'status' => 'inactive',
                    'is_active' => false,
                    'approval_status' => 'approved',
                    'import_source' => 'zillow',
                    'zillow_id' => $zpid,
                    'import_batch_id' => $batch->id,
                    'claim_token' => Str::uuid()->toString(),
                    'claim_expires_at' => $batch->expires_at,
                    'latitude' => $listing['latitude'] ?? null,
                    'longitude' => $listing['longitude'] ?? null,
                ]);

                // Geocode if no coordinates from API
                if (!$property->latitude || !$property->longitude) {
                    GeocodingService::geocodeProperty($property);
                }

                $imported++;
            } catch (\Exception $e) {
                $failed++;
                $errors[] = ['row' => $i + 1, 'message' => $e->getMessage()];
            }
        }

        $batch->update([
            'imported_count' => $imported,
            'failed_count' => $failed,
            'errors' => !empty($errors) ? $errors : null,
        ]);

        ActivityLog::log('import_batch_created', $batch, null, null,
            "Imported {$imported} properties from Zillow API");

        EmailService::sendToAdmin(new ImportBatchCompleted($batch));

        return redirect()->route('admin.imports.show', $batch)
            ->with('success', "Successfully imported {$imported} properties from Zillow!");
    }

    public function preview(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:10240',
        ]);

        $service = new CsvImportService();
        $result = $service->parseAndValidate($request->file('csv_file'));

        // Store the file temporarily so we can import it later
        $path = $request->file('csv_file')->store('imports', 'local');

        return Inertia::render('Admin/Imports/Preview', [
            'validRows' => $result['valid'],
            'errors' => $result['errors'],
            'filename' => $request->file('csv_file')->getClientOriginalName(),
            'tempPath' => $path,
            'expirationDays' => $request->input('expiration_days', 30),
            'notes' => $request->input('notes', ''),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'temp_path' => 'required|string',
            'expiration_days' => 'required|integer|min:1|max:365',
            'notes' => 'nullable|string|max:1000',
        ]);

        $tempPath = storage_path('app/private/' . $request->temp_path);
        if (!file_exists($tempPath)) {
            return back()->withErrors(['csv_file' => 'Upload session expired. Please re-upload the CSV file.']);
        }

        // Create the batch
        $batch = ImportBatch::create([
            'imported_by' => auth()->id(),
            'source' => 'csv',
            'original_filename' => basename($request->temp_path),
            'total_records' => 0,
            'expires_at' => now()->addDays($request->expiration_days),
            'notes' => $request->notes,
        ]);

        // Parse and import
        $service = new CsvImportService();
        $file = new \Illuminate\Http\UploadedFile($tempPath, basename($tempPath));
        $result = $service->parseAndValidate($file);

        $batch->update(['total_records' => count($result['valid']) + count($result['errors'])]);

        $service->import($result['valid'], $batch);

        // Clean up temp file
        @unlink($tempPath);

        ActivityLog::log('import_batch_created', $batch, null, null,
            "Imported {$batch->imported_count} properties from CSV ({$batch->original_filename})");

        // Send batch completed email to admin
        EmailService::sendToAdmin(new ImportBatchCompleted($batch));

        return redirect()->route('admin.imports.show', $batch)
            ->with('success', "Successfully imported {$batch->imported_count} properties!");
    }

    public function show(ImportBatch $batch)
    {
        $batch->load('importer');

        $properties = $batch->properties()
            ->latest()
            ->paginate(20);

        $viewedCount = $batch->properties()->where('claim_view_count', '>', 0)->count();

        return Inertia::render('Admin/Imports/Show', [
            'batch' => $batch,
            'properties' => $properties,
            'viewedCount' => $viewedCount,
        ]);
    }

    public function generateLetter(Property $property)
    {
        if (!$property->isImported()) {
            abort(404);
        }

        $service = new ClaimLetterService();
        $pdf = $service->generateLetter($property);

        $filename = 'claim-letter-' . $property->id . '.pdf';
        return $pdf->download($filename);
    }

    public function generateBatchLetters(ImportBatch $batch)
    {
        $service = new ClaimLetterService();
        $pdf = $service->generateBatchLetters($batch);

        $filename = 'claim-letters-batch-' . $batch->id . '.pdf';
        return $pdf->download($filename);
    }

    public function extendExpiration(Request $request, ImportBatch $batch)
    {
        $request->validate([
            'days' => 'required|integer|min:1|max:365',
        ]);

        $oldExpiry = $batch->expires_at;
        $batch->update([
            'expires_at' => $batch->expires_at->addDays($request->days),
        ]);

        // Also extend claim_expires_at on unclaimed properties
        $batch->properties()->whereNull('claimed_at')->update([
            'claim_expires_at' => $batch->expires_at,
        ]);

        ActivityLog::log('import_batch_extended', $batch, null, null,
            "Extended batch #{$batch->id} expiration by {$request->days} days");

        return back()->with('success', "Expiration extended by {$request->days} days.");
    }

    public function destroy(ImportBatch $batch)
    {
        // Soft delete all unclaimed properties in this batch
        $batch->properties()->whereNull('claimed_at')->delete();

        $batch->delete();

        ActivityLog::log('import_batch_deleted', null, null, null,
            "Deleted import batch #{$batch->id}");

        return redirect()->route('admin.imports.index')
            ->with('success', 'Import batch deleted successfully.');
    }

    public function destroyProperty(Property $property)
    {
        if (!$property->isImported()) {
            abort(404);
        }

        $batchId = $property->import_batch_id;
        $property->delete();

        ActivityLog::log('imported_property_deleted', null, null, null,
            "Deleted imported property #{$property->id}");

        if ($batchId) {
            return back()->with('success', 'Imported property deleted.');
        }

        return redirect()->route('admin.imports.index')
            ->with('success', 'Imported property deleted.');
    }

    /**
     * Re-fetch images for properties in a batch that have 0-1 photos.
     */
    public function refetchImages(ImportBatch $batch)
    {
        $zillowService = new ZillowApiService();

        // Get properties with 0-1 photos that have a zillow_id
        $properties = $batch->properties()
            ->whereNotNull('zillow_id')
            ->get()
            ->filter(function ($p) {
                $photos = $p->photos ?? [];
                return count($photos) <= 1;
            });

        if ($properties->isEmpty()) {
            return back()->with('info', 'All properties already have multiple images.');
        }

        $updated = 0;
        foreach ($properties as $i => $property) {
            try {
                if ($i > 0) {
                    usleep(2500000); // 2.5s delay between page fetches
                }

                $photos = [];

                // Construct Zillow detail URL from address and zpid
                $addressSlug = str_replace(' ', '-', $property->address);
                $citySlug = str_replace(' ', '-', $property->city);
                $detailUrl = "https://www.zillow.com/homedetails/{$addressSlug}-{$citySlug}-{$property->state}-{$property->zip_code}/{$property->zillow_id}_zpid/";

                // Primary: scrape all images from the Zillow listing page
                $photos = $zillowService->scrapePropertyImages($detailUrl);

                // Fallback: try API endpoint
                if (empty($photos)) {
                    $details = $zillowService->fetchPropertyDetails($property->zillow_id);
                    $photos = $details['images'];
                }

                if (count($photos) > count($property->photos ?? [])) {
                    $property->update(['photos' => $photos]);
                    $updated++;
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning("Re-fetch images failed for property {$property->id}: " . $e->getMessage());
            }
        }

        ActivityLog::log('import_batch_refetch_images', $batch, null, null,
            "Re-fetched images for batch #{$batch->id}: {$updated} properties updated");

        return back()->with('success', "Re-fetched images: {$updated} of {$properties->count()} properties updated with more photos.");
    }

    /**
     * Generate QR code PNG for a property's claim URL.
     */
    public function generateQrCode(Property $property)
    {
        if (!$property->isImported()) {
            abort(404);
        }

        $url = url('/claim/' . $property->claim_token);

        $options = new QROptions([
            'outputType' => QRCode::OUTPUT_IMAGE_PNG,
            'eccLevel' => QRCode::ECC_M,
            'scale' => 10,
            'imageBase64' => false,
        ]);

        $qrcode = new QRCode($options);
        $imageData = $qrcode->render($url);

        return response($imageData, 200, [
            'Content-Type' => 'image/png',
            'Content-Disposition' => 'attachment; filename="qr-claim-' . $property->id . '.png"',
        ]);
    }
}

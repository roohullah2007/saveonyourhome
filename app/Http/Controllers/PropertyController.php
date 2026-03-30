<?php

namespace App\Http\Controllers;

use App\Mail\PropertySubmittedToAdmin;
use App\Mail\PropertySubmittedToOwner;
use App\Mail\PropertyUpdatedNotification;
use App\Models\Property;
use App\Models\QrScan;
use App\Models\Setting;
use App\Models\User;
use App\Services\EmailService;
use App\Services\GeocodingService;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource (for admin).
     */
    public function index()
    {
        $properties = Property::latest()->paginate(20);

        return Inertia::render('Admin/Properties/Index', [
            'properties' => $properties
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ListProperty');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check if this is a land/lot listing (different validation rules apply)
        $isLand = $request->input('propertyType') === 'land';

        $validated = $request->validate([
            'propertyTitle' => 'required|string|max:255',
            'developer' => 'nullable|string|max:255',
            'propertyType' => 'required|string',
            'price' => 'required|numeric|min:0',
            'address' => 'required|string',
            'city' => 'required|string',
            'zipCode' => 'required|string',
            'subdivision' => 'nullable|string',
            // School Information (required for all property types)
            'schoolDistrict' => 'required|string|max:255',
            'gradeSchool' => 'nullable|string|max:255',
            'middleSchool' => 'nullable|string|max:255',
            'highSchool' => 'nullable|string|max:255',
            // For land listings, bedrooms/bathrooms/sqft/yearBuilt are not applicable
            'bedrooms' => $isLand ? 'nullable|integer|min:0' : 'required|integer|min:0',
            'fullBathrooms' => $isLand ? 'nullable|integer|min:0' : 'required|integer|min:0',
            'halfBathrooms' => 'nullable|integer|min:0',
            'sqft' => $isLand ? 'nullable|integer|min:0' : 'required|integer|min:0',
            'lotSize' => 'nullable|integer|min:0',
            'acres' => 'nullable|numeric|min:0',
            'zoning' => 'nullable|string|max:100',
            'yearBuilt' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'description' => 'required|string',
            'features' => 'nullable', // JSON string or array from frontend
            'contactName' => 'required|string',
            'contactEmail' => 'required|email',
            'contactPhone' => 'required|string',
            'photoPaths' => 'nullable|array|max:' . ImageService::MAX_INITIAL_PHOTOS, // Pre-uploaded photo paths
            'photoPaths.*' => 'string', // Each path is a string
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        // Parse features - handle both JSON string and array formats
        $features = [];
        $featuresInput = $validated['features'] ?? $request->input('features');

        if (!empty($featuresInput)) {
            if (is_array($featuresInput)) {
                $features = $featuresInput;
            } elseif (is_string($featuresInput)) {
                $decoded = json_decode($featuresInput, true);
                if (is_array($decoded)) {
                    $features = $decoded;
                }
            }
        }

        // Get pre-uploaded photo paths (photos are uploaded one by one before form submission)
        $photoPaths = $validated['photoPaths'] ?? [];

        // Get authenticated user (required)
        $user = auth()->user();

        // Convert camelCase to snake_case for database
        // For land listings, set bedrooms/bathrooms/sqft to 0 (they don't apply)
        $bedrooms = $isLand ? 0 : ($validated['bedrooms'] ?? 0);
        $fullBathrooms = $isLand ? 0 : ($validated['fullBathrooms'] ?? 0);
        $halfBathrooms = $isLand ? 0 : ($validated['halfBathrooms'] ?? 0);
        $sqft = $isLand ? 0 : ($validated['sqft'] ?? 0);

        $property = Property::create([
            'user_id' => $user->id,
            'property_title' => $validated['propertyTitle'],
            'developer' => $validated['developer'] ?? null,
            'property_type' => $validated['propertyType'],
            'price' => $validated['price'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'state' => 'Oklahoma',
            'zip_code' => $validated['zipCode'],
            'subdivision' => $validated['subdivision'] ?? null,
            // School Information
            'school_district' => $validated['schoolDistrict'],
            'grade_school' => $validated['gradeSchool'] ?? null,
            'middle_school' => $validated['middleSchool'] ?? null,
            'high_school' => $validated['highSchool'] ?? null,
            'bedrooms' => $bedrooms,
            'bathrooms' => $fullBathrooms + ($halfBathrooms * 0.5),
            'full_bathrooms' => $fullBathrooms,
            'half_bathrooms' => $halfBathrooms,
            'sqft' => $sqft,
            'lot_size' => $validated['lotSize'] ?? null,
            'acres' => $validated['acres'] ?? null,
            'zoning' => $validated['zoning'] ?? null,
            'year_built' => $isLand ? null : ($validated['yearBuilt'] ?? null),
            'description' => $validated['description'],
            'features' => $features,
            'photos' => $photoPaths,
            'contact_name' => $validated['contactName'],
            'contact_email' => $validated['contactEmail'],
            'contact_phone' => $validated['contactPhone'],
            'status' => 'for-sale',
            'listing_status' => 'for_sale',
            'is_active' => true,
            'approval_status' => 'approved',
            'approved_at' => now(),
            // Use provided coordinates if available
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
        ]);

        // Only geocode if no coordinates were provided
        if (!$property->latitude || !$property->longitude) {
            GeocodingService::geocodeProperty($property);
        }

        // Send email notifications
        $this->sendPropertySubmissionEmails($property);

        return redirect()->route('dashboard.listings')->with('success', 'Property listed successfully! Your listing is now live.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Property $property)
    {
        // Guard: hide unclaimed imported properties from public
        if ($property->isImported() && !$property->isClaimed()) {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                abort(404);
            }
        }

        // Redirect to SEO-friendly URL with slug if accessed by ID only
        $currentPath = request()->path();
        $expectedPath = 'properties/' . $property->slug;

        if ($currentPath !== $expectedPath) {
            // Preserve query parameters in redirect
            $queryString = $request->getQueryString();
            $redirectUrl = '/' . $expectedPath . ($queryString ? '?' . $queryString : '');
            return redirect()->to($redirectUrl, 301);
        }

        // Track QR code scans
        if ($request->query('src') === 'qr') {
            QrScan::create([
                'property_id' => $property->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'referer' => $request->header('referer'),
                'scanned_at' => now(),
            ]);
        }

        // Increment view count
        $property->incrementViews();

        return Inertia::render('PropertyDetail', [
            'property' => $property,
            'openHouses' => $property->upcomingOpenHouses()->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        return Inertia::render('Admin/Properties/Edit', [
            'property' => $property
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Property $property)
    {
        $validated = $request->validate([
            'property_title' => 'required|string|max:255',
            'property_type' => 'required|string',
            'price' => 'required|numeric|min:0',
            'address' => 'required|string',
            'city' => 'required|string',
            'zip_code' => 'required|string',
            'subdivision' => 'nullable|string',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|numeric|min:0',
            'sqft' => 'required|integer|min:0',
            'lot_size' => 'nullable|integer|min:0',
            'year_built' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'description' => 'required|string',
            'features' => 'nullable|array',
            'contact_name' => 'required|string',
            'contact_email' => 'required|email',
            'contact_phone' => 'required|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $property->update($validated);

        // Send update notification email
        $this->sendPropertyUpdateEmails($property);

        return redirect()->route('admin.properties.index')->with('success', 'Property updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     * Instead of hard delete, transfer sold listings to admin for marketing.
     */
    public function destroy(Property $property)
    {
        // If property was sold, transfer to admin for potential showcase
        if ($property->listing_status === Property::STATUS_SOLD) {
            $adminUser = $this->getPrimaryAdmin();
            if ($adminUser) {
                $property->transferToAdmin($adminUser->id);
                return redirect()->back()->with('success', 'Sold listing archived for records. Contact admin if you need it removed.');
            }
        }

        // For non-sold properties, soft delete (can be restored by admin)
        $property->delete();

        return redirect()->back()->with('success', 'Property deleted successfully!');
    }

    /**
     * Get the primary admin user for property transfers.
     */
    protected function getPrimaryAdmin(): ?User
    {
        return User::where('role', 'admin')->orderBy('id')->first();
    }

    /**
     * Get properties for public listing page.
     */
    public function publicIndex(Request $request)
    {
        $query = Property::where('approval_status', 'approved');

        // Map frontend status values to listing_status
        $statusMap = [
            'for-sale' => 'for_sale',
            'pending' => 'pending',
            'sold' => 'sold',
            'inactive' => 'inactive',
        ];

        $status = $request->status ?? 'for-sale';

        // Handle "all" status - show for_sale, pending, and sold
        if ($status === 'all') {
            $query->where('is_active', true);
            $query->whereIn('listing_status', ['for_sale', 'pending', 'sold']);
        } else {
            $listingStatus = $statusMap[$status] ?? 'for_sale';

            // Inactive is only visible to admins
            if ($listingStatus === 'inactive') {
                if (!auth()->check() || auth()->user()->role !== 'admin') {
                    $listingStatus = 'for_sale';
                }
            }

            // For non-inactive statuses, only show active listings
            if ($listingStatus !== 'inactive') {
                $query->where('is_active', true);
            }

            $query->where('listing_status', $listingStatus);
        }

        // Search by keyword
        if ($request->keyword) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('property_title', 'like', "%{$keyword}%")
                    ->orWhere('address', 'like', "%{$keyword}%")
                    ->orWhere('city', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        // Filter by location
        if ($request->location) {
            $location = $request->location;
            $query->where(function ($q) use ($location) {
                $q->where('city', 'like', "%{$location}%")
                    ->orWhere('zip_code', 'like', "%{$location}%");
            });
        }

        // Filter by property type
        if ($request->propertyType) {
            $query->where('property_type', $request->propertyType);
        }

        // Filter by price range
        if ($request->priceMin) {
            $query->where('price', '>=', $request->priceMin);
        }
        if ($request->priceMax) {
            $query->where('price', '<=', $request->priceMax);
        }

        // Filter by bedrooms
        if ($request->bedrooms) {
            $query->where('bedrooms', '>=', $request->bedrooms);
        }

        // Filter by bathrooms (use full_bathrooms field)
        if ($request->bathrooms) {
            $query->where('full_bathrooms', '>=', $request->bathrooms);
        }

        // Filter by school district
        if ($request->schoolDistrict) {
            $query->where('school_district', 'like', '%' . $request->schoolDistrict . '%');
        }

        // Filter by open house availability
        if ($request->hasOpenHouse) {
            if ($request->hasOpenHouse === 'yes') {
                $query->whereHas('upcomingOpenHouses');
            } elseif ($request->hasOpenHouse === 'this_weekend') {
                $saturday = now()->next('Saturday')->toDateString();
                $sunday = now()->next('Sunday')->toDateString();
                // If today is Saturday or Sunday, use today/tomorrow
                if (now()->isSaturday()) {
                    $saturday = now()->toDateString();
                    $sunday = now()->addDay()->toDateString();
                } elseif (now()->isSunday()) {
                    $saturday = now()->toDateString();
                    $sunday = now()->toDateString();
                }
                $query->whereHas('openHouses', function ($q) use ($saturday, $sunday) {
                    $q->whereBetween('date', [$saturday, $sunday]);
                });
            }
        }

        // Sorting
        $sortBy = $request->sort ?? 'newest';
        switch ($sortBy) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'bedrooms':
                $query->orderBy('bedrooms', 'desc');
                break;
            case 'sqft':
                $query->orderBy('sqft', 'desc');
                break;
            default:
                $query->latest();
        }

        // Clone query for map before pagination
        $mapQuery = clone $query;

        $properties = $query->with(['upcomingOpenHouses' => function ($q) {
            $q->limit(1);
        }])->paginate(12)->withQueryString();

        // Get all properties with coordinates for map (lightweight data)
        // Note: 'slug' is a computed attribute, not a DB column, so we don't select it
        $allPropertiesForMap = $mapQuery
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->select([
                'id', 'property_title', 'price', 'address', 'city', 'state', 'zip_code',
                'bedrooms', 'full_bathrooms', 'half_bathrooms', 'sqft', 'listing_status',
                'latitude', 'longitude', 'photos'
            ])
            ->get();

        // Check if current user is admin for inactive filter visibility
        $isAdmin = auth()->check() && auth()->user()->role === 'admin';

        return Inertia::render('Properties', [
            'properties' => $properties,
            'filters' => $request->only(['keyword', 'location', 'status', 'propertyType', 'priceMin', 'priceMax', 'bedrooms', 'bathrooms', 'schoolDistrict', 'hasOpenHouse', 'sort']),
            'isAdmin' => $isAdmin,
            'allPropertiesForMap' => $allPropertiesForMap,
        ]);
    }

    /**
     * Geocode an address and return coordinates.
     * Used by the frontend map picker component.
     */
    public function geocodeAddress(Request $request)
    {
        $request->validate([
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:50',
            'zip_code' => 'nullable|string|max:20',
        ]);

        $coordinates = GeocodingService::geocode(
            $request->address,
            $request->city,
            $request->state ?? 'Oklahoma',
            $request->zip_code ?? ''
        );

        if ($coordinates) {
            return response()->json([
                'success' => true,
                'latitude' => $coordinates['latitude'],
                'longitude' => $coordinates['longitude'],
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Could not geocode the address.',
        ]);
    }

    /**
     * Reverse geocode coordinates to get address.
     * Used by the frontend map picker component.
     */
    public function reverseGeocodeAddress(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $addressData = GeocodingService::reverseGeocode(
            (float) $request->latitude,
            (float) $request->longitude
        );

        if ($addressData) {
            return response()->json([
                'success' => true,
                'address' => $addressData['address'],
                'city' => $addressData['city'],
                'state' => $addressData['state'],
                'zip_code' => $addressData['zip_code'],
                'formatted_address' => $addressData['formatted_address'],
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Could not reverse geocode the coordinates.',
        ]);
    }

    /**
     * Upload a single photo and return the path.
     * Used for progressive uploads to avoid large request issues.
     */
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|file|max:30720', // 30MB max
        ]);

        $file = $request->file('photo');

        // Validate image type first
        if (!ImageService::isValidImage($file)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid image type. Supported: JPG, PNG, GIF, WebP, HEIC.',
            ], 422);
        }

        try {
            // Increase memory limit for large image processing
            $currentLimit = ini_get('memory_limit');
            if ($this->parseMemoryLimit($currentLimit) < 512 * 1024 * 1024) {
                ini_set('memory_limit', '512M');
            }

            $path = ImageService::processAndStore($file, 'properties');

            if (!$path) {
                \Log::warning('Photo upload returned null path', [
                    'filename' => $file->getClientOriginalName(),
                    'mime' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to process image. The file may be corrupted or in an unsupported format.',
                ], 422);
            }

            return response()->json([
                'success' => true,
                'path' => $path,
            ]);
        } catch (\Exception $e) {
            \Log::error('Photo upload exception: ' . $e->getMessage(), [
                'filename' => $file->getClientOriginalName(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Server error processing image: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Parse memory limit string to bytes
     */
    private function parseMemoryLimit(string $limit): int
    {
        $limit = trim($limit);
        $last = strtolower($limit[strlen($limit) - 1]);
        $value = (int) $limit;

        switch ($last) {
            case 'g':
                $value *= 1024 * 1024 * 1024;
                break;
            case 'm':
                $value *= 1024 * 1024;
                break;
            case 'k':
                $value *= 1024;
                break;
        }

        return $value;
    }

    /**
     * Delete a temporarily uploaded photo (before property is created).
     */
    public function deleteUploadedPhoto(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $deleted = ImageService::delete($request->path);

        return response()->json([
            'success' => $deleted,
        ]);
    }

    /**
     * Send email notifications when a property is submitted.
     */
    protected function sendPropertySubmissionEmails(Property $property): void
    {
        if (!EmailService::isEnabled()) {
            return;
        }

        // Send to user and admin with delay between them
        if ($property->contact_email) {
            EmailService::sendToUserAndAdmin(
                $property->contact_email,
                new PropertySubmittedToOwner($property),
                new PropertySubmittedToAdmin($property)
            );
        } else {
            // No user email, just send to admin
            EmailService::sendToAdmin(new PropertySubmittedToAdmin($property));
        }
    }

    /**
     * Send email notification when a property is updated.
     */
    protected function sendPropertyUpdateEmails(Property $property): void
    {
        if (!EmailService::isEnabled()) {
            return;
        }

        // Send update notification to property owner
        if ($property->contact_email) {
            EmailService::sendToUser($property->contact_email, new PropertyUpdatedNotification($property));
        }
    }
}

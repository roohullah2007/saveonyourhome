<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\PropertyApproved;
use App\Mail\PropertyRejected;
use App\Models\Property;
use App\Models\OpenHouse;
use App\Models\User;
use App\Models\ActivityLog;
use App\Services\EmailService;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with(['user', 'originalOwner']);

        // Search across title, full address (street/city/state/zip), and owner name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('property_title', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%")
                    ->orWhere('zip_code', 'like', "%{$search}%")
                    ->orWhere('contact_name', 'like', "%{$search}%");
            });
        }

        // Filter by listing status
        if ($request->filled('status')) {
            $query->where('listing_status', $request->status);
        }

        // Filter by approval status
        if ($request->filled('approval')) {
            $query->where('approval_status', $request->approval);
        }

        // Filter by property type
        if ($request->filled('type')) {
            $query->where('property_type', $request->type);
        }

        // Filter by transaction type (for sale / for rent / both)
        if ($request->filled('transaction_type')) {
            $query->where('transaction_type', $request->transaction_type);
        }

        // Filter by listing label (new_listing, open_house, motivated_seller, etc.)
        if ($request->filled('listing_label')) {
            $query->where('listing_label', $request->listing_label);
        }

        // Filter by featured
        if ($request->filled('featured')) {
            $query->where('is_featured', $request->featured === 'yes');
        }

        // Filter by showcase
        if ($request->filled('showcase')) {
            $query->where('is_showcase', $request->showcase === 'yes');
        }

        // Filter by transferred (archived from users)
        if ($request->filled('transferred')) {
            if ($request->transferred === 'yes') {
                $query->whereNotNull('transferred_at');
            } else {
                $query->whereNull('transferred_at');
            }
        }

        $properties = $query->latest()
            ->paginate(15)
            ->withQueryString();

        // Get counts for tabs
        $counts = [
            'all' => Property::count(),
            'pending' => Property::pending()->count(),
            'approved' => Property::approved()->count(),
            'rejected' => Property::where('approval_status', 'rejected')->count(),
            'on_hold' => Property::where('approval_status', 'on_hold')->count(),
            'featured' => Property::featured()->count(),
            'showcase' => Property::showcase()->count(),
            'transferred' => Property::transferred()->count(),
            'sold' => Property::sold()->count(),
        ];

        return Inertia::render('Admin/Properties/Index', [
            'properties' => $properties,
            'filters' => $request->only(['search', 'status', 'approval', 'type', 'transaction_type', 'listing_label', 'featured', 'showcase', 'transferred']),
            'counts' => $counts,
        ]);
    }

    public function create()
    {
        $users = User::where('is_active', true)
            ->select('id', 'name', 'email', 'role', 'phone')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Properties/Create', [
            'users' => $users,
            'listingStatuses' => Property::LISTING_STATUSES,
        ]);
    }

    public function store(Request $request)
    {
        $isLand = $request->input('property_type') === 'land';

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'property_title' => 'required|string|max:255',
            'developer' => 'nullable|string|max:255',
            'property_type' => 'required|string',
            'listing_status' => 'nullable|string|in:for_sale,pending,sold,inactive',
            'transaction_type' => 'nullable|string|in:for_sale,for_rent,both',
            'listing_label' => 'nullable|string|max:60',
            'price' => 'required|numeric|min:0',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string',
            'subdivision' => 'nullable|string',
            'county' => 'nullable|string|max:120',
            'school_district' => 'nullable|string|max:255',
            'grade_school' => 'nullable|string|max:255',
            'middle_school' => 'nullable|string|max:255',
            'high_school' => 'nullable|string|max:255',
            'bedrooms' => $isLand ? 'nullable|integer|min:0' : 'required|integer|min:0',
            'full_bathrooms' => 'nullable|integer|min:0',
            'half_bathrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|numeric|min:0',
            'sqft' => $isLand ? 'nullable|integer|min:0' : 'required|integer|min:0',
            'lot_size' => $isLand ? 'required|integer|min:0' : 'nullable|integer|min:0',
            'acres' => 'nullable|numeric|min:0',
            'property_dimensions' => 'nullable|string|max:120',
            'zoning' => 'nullable|string|max:100',
            'year_built' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'garage' => 'nullable|string|max:60',
            'annual_property_tax' => 'nullable|numeric|min:0',
            'has_hoa' => 'boolean',
            'hoa_fee' => 'nullable|numeric|min:0',
            'is_motivated_seller' => 'boolean',
            'is_licensed_agent' => 'boolean',
            'open_to_realtors' => 'boolean',
            'requires_pre_approval' => 'boolean',
            'description' => 'required|string',
            'features' => 'nullable|array',
            'photos' => 'nullable|array',
            'contact_name' => 'required|string',
            'contact_email' => 'required|email',
            'contact_phone' => 'required|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'virtual_tour_type' => 'nullable|string|in:video,matterport,embed,link',
            'virtual_tour_url' => 'nullable|string|max:500',
            'virtual_tour_embed' => 'nullable|string',
            'matterport_url' => 'nullable|string|max:500',
            'video_tour_url' => 'nullable|string|max:500',
            'mls_virtual_tour_url' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        // Land property defaults
        if ($isLand) {
            $validated['bedrooms'] = 0;
            $validated['full_bathrooms'] = 0;
            $validated['half_bathrooms'] = 0;
            $validated['bathrooms'] = 0;
            $validated['sqft'] = 0;
            $validated['year_built'] = null;
        } else {
            $validated['full_bathrooms'] = $validated['full_bathrooms'] ?? 0;
            $validated['half_bathrooms'] = $validated['half_bathrooms'] ?? 0;
            if (isset($validated['full_bathrooms'])) {
                $validated['bathrooms'] = ($validated['full_bathrooms']) + (($validated['half_bathrooms']) * 0.5);
            }
        }

        // URL fields
        $urlFields = ['virtual_tour_url', 'matterport_url', 'video_tour_url', 'mls_virtual_tour_url'];
        foreach ($urlFields as $field) {
            if (array_key_exists($field, $validated)) {
                $validated[$field] = !empty($validated[$field]) ? $validated[$field] : null;
            }
        }

        // Sync status field
        $statusMap = [
            'for_sale' => 'for-sale',
            'pending' => 'pending',
            'sold' => 'sold',
            'inactive' => 'inactive',
        ];
        $validated['status'] = $statusMap[$validated['listing_status'] ?? 'for_sale'] ?? 'for-sale';
        $validated['listing_status'] = $validated['listing_status'] ?? 'for_sale';

        // Auto-approve admin-created properties
        $validated['approval_status'] = 'approved';
        $validated['approved_at'] = now();
        $validated['approved_by'] = auth()->id();

        $property = Property::create($validated);

        ActivityLog::log('property_created', $property, null, $validated, "Admin created property: {$property->property_title}");

        return redirect()->route('admin.properties.show', $property->id)
            ->with('success', 'Property created successfully.');
    }

    public function show(Property $property)
    {
        $property->load(['user', 'images', 'inquiries.user']);

        return Inertia::render('Admin/Properties/Show', [
            'property' => $property,
            'listingStatuses' => Property::LISTING_STATUSES,
        ]);
    }

    public function edit(Property $property)
    {
        $property->load(['user', 'images', 'openHouses']);

        $users = User::where('is_active', true)
            ->select('id', 'name', 'email', 'role', 'phone')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Properties/Edit', [
            'property' => $property,
            'users' => $users,
            'listingStatuses' => Property::LISTING_STATUSES,
        ]);
    }

    public function update(Request $request, Property $property)
    {
        // Convert empty strings to null for optional URL fields
        $input = $request->all();
        $urlFields = ['virtual_tour_url', 'matterport_url', 'video_tour_url', 'mls_virtual_tour_url'];
        foreach ($urlFields as $field) {
            if (isset($input[$field]) && $input[$field] === '') {
                $input[$field] = null;
            }
        }
        $request->merge($input);

        // Check if this is a land/lot listing (different validation rules apply)
        $isLand = $request->input('property_type') === 'land';

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'property_title' => 'required|string|max:255',
            'developer' => 'nullable|string|max:255',
            'property_type' => 'required|string',
            'status' => 'nullable|string',
            'listing_status' => 'nullable|string|in:for_sale,pending,sold,inactive',
            'transaction_type' => 'nullable|string|in:for_sale,for_rent,both',
            'listing_label' => 'nullable|string|max:60',
            'price' => 'required|numeric|min:0',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string',
            'subdivision' => 'nullable|string',
            'county' => 'nullable|string|max:120',
            // School Information
            'school_district' => 'nullable|string|max:255',
            'grade_school' => 'nullable|string|max:255',
            'middle_school' => 'nullable|string|max:255',
            'high_school' => 'nullable|string|max:255',
            // For land listings, bedrooms/bathrooms/sqft are not applicable
            'bedrooms' => $isLand ? 'nullable|integer|min:0' : 'required|integer|min:0',
            'full_bathrooms' => 'nullable|integer|min:0',
            'half_bathrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|numeric|min:0',
            'sqft' => $isLand ? 'nullable|integer|min:0' : 'required|integer|min:0',
            'lot_size' => $isLand ? 'required|integer|min:0' : 'nullable|integer|min:0',
            'acres' => 'nullable|numeric|min:0',
            'property_dimensions' => 'nullable|string|max:120',
            'zoning' => 'nullable|string|max:100',
            'year_built' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'garage' => 'nullable|string|max:60',
            'annual_property_tax' => 'nullable|numeric|min:0',
            'has_hoa' => 'boolean',
            'hoa_fee' => 'nullable|numeric|min:0',
            'is_motivated_seller' => 'boolean',
            'is_licensed_agent' => 'boolean',
            'open_to_realtors' => 'boolean',
            'requires_pre_approval' => 'boolean',
            'description' => 'required|string',
            'features' => 'nullable|array',
            'photos' => 'nullable|array',
            'contact_name' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'virtual_tour_type' => 'nullable|string|in:video,matterport,embed,link',
            'virtual_tour_url' => 'nullable|string|max:500',
            'virtual_tour_embed' => 'nullable|string',
            'matterport_url' => 'nullable|string|max:500',
            'video_tour_url' => 'nullable|string|max:500',
            'mls_virtual_tour_url' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        // For land listings, set bedrooms/bathrooms/sqft to 0 (they don't apply)
        if ($isLand) {
            $validated['bedrooms'] = 0;
            $validated['full_bathrooms'] = 0;
            $validated['half_bathrooms'] = 0;
            $validated['bathrooms'] = 0;
            $validated['sqft'] = 0;
            $validated['year_built'] = null;
        } else {
            // Set defaults for fields that don't allow null in database
            $defaultsIfNull = [
                'full_bathrooms' => 0,
                'half_bathrooms' => 0,
            ];

            foreach ($defaultsIfNull as $field => $default) {
                if (array_key_exists($field, $validated) && $validated[$field] === null) {
                    $validated[$field] = $default;
                }
            }

            // Calculate bathrooms if full/half provided
            if (isset($validated['full_bathrooms'])) {
                $validated['bathrooms'] = ($validated['full_bathrooms'] ?? 0) + (($validated['half_bathrooms'] ?? 0) * 0.5);
            }
        }

        // Ensure URL fields are included (convert empty to null for database)
        $urlFields = ['virtual_tour_url', 'matterport_url', 'video_tour_url', 'mls_virtual_tour_url'];
        foreach ($urlFields as $field) {
            if (array_key_exists($field, $validated)) {
                $validated[$field] = !empty($validated[$field]) ? $validated[$field] : null;
            }
        }

        // Sync the old status field based on listing_status if provided
        if (isset($validated['listing_status'])) {
            $statusMap = [
                'for_sale' => 'for-sale',
                'pending' => 'pending',
                'sold' => 'sold',
                'inactive' => 'inactive',
            ];
            $validated['status'] = $statusMap[$validated['listing_status']] ?? $validated['status'];
        }

        // Preserve existing contact fields if not provided (DB columns are NOT NULL)
        $contactDefaults = ['contact_name', 'contact_email', 'contact_phone'];
        foreach ($contactDefaults as $field) {
            if (!isset($validated[$field]) || $validated[$field] === null) {
                $validated[$field] = $property->$field ?? '';
            }
        }

        $oldValues = $property->toArray();
        $property->update($validated);

        ActivityLog::log('property_updated', $property, $oldValues, $validated, "Updated property: {$property->property_title}");

        return redirect()->route('admin.properties.show', $property->id)
            ->with('success', 'Property updated successfully.');
    }

    public function destroy(Property $property)
    {
        $propertyTitle = $property->property_title;

        ActivityLog::log('property_deleted', $property, $property->toArray(), null, "Deleted property: {$propertyTitle}");

        $property->delete();

        return redirect()->route('admin.properties.index')
            ->with('success', 'Property deleted successfully.');
    }

    public function approve(Property $property)
    {
        $property->update([
            'approval_status' => 'approved',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
            'rejection_reason' => null,
        ]);

        ActivityLog::log('property_approved', $property, null, null, "Approved property: {$property->property_title}");

        // Send approval email to the property owner. Prefer contact_email, fall
        // back to the seller's account email so a missing contact field doesn't
        // silently drop the notification. Also CC admin for visibility.
        $sellerEmail = $property->contact_email ?: optional($property->user)->email;
        if ($sellerEmail) {
            EmailService::sendToUser($sellerEmail, new PropertyApproved($property));
            sleep(2);
            EmailService::sendToAdmin(new PropertyApproved($property));
        } else {
            \Log::warning('Property approved but no seller email reachable', ['property_id' => $property->id]);
            EmailService::sendToAdmin(new PropertyApproved($property));
        }

        // Fire saved-search alerts. Runs synchronously but is deliberately
        // wrapped in try/catch — a matching or mail failure must not block
        // the approval flow.
        try {
            app(\App\Services\SavedSearchAlertDispatcher::class)->dispatchForProperty($property);
        } catch (\Throwable $e) {
            \Log::warning('Saved-search alert dispatch failed', [
                'property_id' => $property->id,
                'error' => $e->getMessage(),
            ]);
        }

        return back()->with('success', 'Property approved successfully.');
    }

    public function reject(Request $request, Property $property)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $property->update([
            'approval_status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'approved_at' => null,
            'approved_by' => null,
        ]);

        ActivityLog::log('property_rejected', $property, null, ['reason' => $request->rejection_reason], "Rejected property: {$property->property_title}");

        // Send rejection email to the property owner with the same fallback +
        // admin copy as the approval flow.
        $sellerEmail = $property->contact_email ?: optional($property->user)->email;
        if ($sellerEmail) {
            EmailService::sendToUser($sellerEmail, new PropertyRejected($property, $request->rejection_reason));
            sleep(2);
            EmailService::sendToAdmin(new PropertyRejected($property, $request->rejection_reason));
        } else {
            \Log::warning('Property rejected but no seller email reachable', ['property_id' => $property->id]);
            EmailService::sendToAdmin(new PropertyRejected($property, $request->rejection_reason));
        }

        return back()->with('success', 'Property rejected.');
    }

    /**
     * Place the property on hold (temporarily hidden from public listings).
     * Admin can release it later with `release`. Used for moderation pauses
     * that don't warrant a full rejection.
     */
    public function hold(Property $property)
    {
        $property->update([
            'approval_status' => 'on_hold',
            'is_active' => false,
        ]);

        ActivityLog::log('property_on_hold', $property, null, null, "Placed property on hold: {$property->property_title}");

        return back()->with('success', 'Property placed on hold.');
    }

    /**
     * Release a property from hold and put it back into the approved pool.
     */
    public function release(Property $property)
    {
        $property->update([
            'approval_status' => 'approved',
            'is_active' => true,
            'approved_at' => $property->approved_at ?? now(),
            'approved_by' => $property->approved_by ?? auth()->id(),
        ]);

        ActivityLog::log('property_released', $property, null, null, "Released property from hold: {$property->property_title}");

        return back()->with('success', 'Property released from hold.');
    }

    public function requestChanges(Request $request, Property $property)
    {
        $validated = $request->validate([
            'admin_feedback' => 'required|string|max:2000',
        ]);

        $property->update([
            'approval_status' => 'changes_requested',
            'admin_feedback' => $validated['admin_feedback'],
            'changes_requested_at' => now(),
            'is_active' => false,
            'approved_at' => null,
            'approved_by' => null,
            'rejection_reason' => null,
        ]);

        ActivityLog::log('property_changes_requested', $property, null, ['feedback' => $validated['admin_feedback']], "Requested changes on property: {$property->property_title}");

        $sellerEmail = $property->contact_email ?: optional($property->user)->email;
        if ($sellerEmail) {
            try {
                EmailService::sendToUser(
                    $sellerEmail,
                    new \App\Mail\PropertyChangesRequested($property, $validated['admin_feedback'])
                );
                sleep(2);
                EmailService::sendToAdmin(new \App\Mail\PropertyChangesRequested($property, $validated['admin_feedback']));
            } catch (\Throwable $e) {
                \Log::error('Request-changes email failed', ['property_id' => $property->id, 'error' => $e->getMessage()]);
            }
        } else {
            \Log::warning('Changes requested but no seller email reachable', ['property_id' => $property->id]);
            EmailService::sendToAdmin(new \App\Mail\PropertyChangesRequested($property, $validated['admin_feedback']));
        }

        return back()->with('success', 'Changes requested. The seller has been notified.');
    }

    public function toggleFeatured(Property $property)
    {
        $property->update(['is_featured' => !$property->is_featured]);

        $status = $property->is_featured ? 'featured' : 'unfeatured';

        ActivityLog::log("property_{$status}", $property, null, null, "Property {$property->property_title} marked as {$status}");

        return back()->with('success', "Property {$status} successfully.");
    }

    public function toggleActive(Property $property)
    {
        $property->update(['is_active' => !$property->is_active]);

        $status = $property->is_active ? 'activated' : 'deactivated';

        ActivityLog::log("property_{$status}", $property, null, null, "Property {$property->property_title} {$status}");

        return back()->with('success', "Property {$status} successfully.");
    }

    /**
     * Toggle showcase status (for marketing display)
     */
    public function toggleShowcase(Property $property)
    {
        $property->update(['is_showcase' => !$property->is_showcase]);

        $status = $property->is_showcase ? 'added to showcase' : 'removed from showcase';

        ActivityLog::log("property_showcase_" . ($property->is_showcase ? 'added' : 'removed'), $property, null, null, "Property {$property->property_title} {$status}");

        return back()->with('success', "Property {$status} successfully.");
    }

    /**
     * Update testimonial for a property
     */
    public function updateTestimonial(Request $request, Property $property)
    {
        $validated = $request->validate([
            'testimonial' => 'nullable|string|max:2000',
            'testimonial_name' => 'nullable|string|max:255',
        ]);

        $property->update($validated);

        ActivityLog::log('property_testimonial_updated', $property, null, $validated, "Updated testimonial for property: {$property->property_title}");

        return back()->with('success', 'Testimonial updated successfully.');
    }

    /**
     * Convert transferred listing to sold showcase
     */
    public function convertToShowcase(Request $request, Property $property)
    {
        $validated = $request->validate([
            'testimonial' => 'nullable|string|max:2000',
            'testimonial_name' => 'nullable|string|max:255',
        ]);

        $property->update([
            'listing_status' => Property::STATUS_SOLD,
            'is_showcase' => true,
            'is_active' => true,
            'testimonial' => $validated['testimonial'] ?? null,
            'testimonial_name' => $validated['testimonial_name'] ?? null,
            'sold_at' => $property->sold_at ?? now(),
        ]);

        ActivityLog::log('property_converted_to_showcase', $property, null, $validated, "Converted to showcase: {$property->property_title}");

        return back()->with('success', 'Property converted to sold showcase listing.');
    }

    /**
     * Permanently delete a property (admin only, bypasses soft delete)
     */
    public function forceDelete(Property $property)
    {
        $propertyTitle = $property->property_title;

        ActivityLog::log('property_force_deleted', $property, $property->toArray(), null, "Permanently deleted property: {$propertyTitle}");

        $property->forceDelete();

        return redirect()->route('admin.properties.index')
            ->with('success', 'Property permanently deleted.');
    }

    /**
     * Restore a soft-deleted property
     */
    public function restore($id)
    {
        $property = Property::withTrashed()->findOrFail($id);
        $property->restore();

        ActivityLog::log('property_restored', $property, null, null, "Restored property: {$property->property_title}");

        return back()->with('success', 'Property restored successfully.');
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:properties,id',
            'action' => 'required|in:approve,reject,delete,feature,unfeature,activate,deactivate',
        ]);

        $properties = Property::whereIn('id', $request->ids)->get();

        foreach ($properties as $property) {
            switch ($request->action) {
                case 'approve':
                    $property->update([
                        'approval_status' => 'approved',
                        'approved_at' => now(),
                        'approved_by' => auth()->id(),
                    ]);
                    break;
                case 'reject':
                    $property->update(['approval_status' => 'rejected']);
                    break;
                case 'delete':
                    $property->delete();
                    break;
                case 'feature':
                    $property->update(['is_featured' => true]);
                    break;
                case 'unfeature':
                    $property->update(['is_featured' => false]);
                    break;
                case 'activate':
                    $property->update(['is_active' => true]);
                    break;
                case 'deactivate':
                    $property->update(['is_active' => false]);
                    break;
            }
        }

        ActivityLog::log("bulk_{$request->action}", null, null, ['count' => count($request->ids)], "Bulk action: {$request->action} on " . count($request->ids) . " properties");

        return back()->with('success', 'Bulk action completed successfully.');
    }

    /**
     * Download all photos for a property as a ZIP file
     */
    public function downloadPhotos(Property $property)
    {
        $photos = $property->photos ?? [];

        if (empty($photos)) {
            return back()->with('error', 'No photos available for download.');
        }

        // Create ZIP file
        $zipPath = ImageService::createPhotosZip($photos, $property->property_title);

        if (!$zipPath || !file_exists($zipPath)) {
            return back()->with('error', 'Failed to create ZIP file.');
        }

        // Log the action
        ActivityLog::log('photos_downloaded', $property, null, ['photo_count' => count($photos)], "Downloaded photos for property: {$property->property_title}");

        // Return the file as a download and delete after sending
        $filename = basename($zipPath);
        return response()->download($zipPath, $filename)->deleteFileAfterSend(true);
    }

    /**
     * Add photos to a property (admin upload)
     */
    public function addPhotos(Request $request, Property $property)
    {
        $request->validate([
            'photos' => 'required|array|min:1',
            'photos.*' => 'file|max:30720', // 30MB max per image
        ]);

        $currentPhotos = $property->photos ?? [];
        $remainingSlots = ImageService::MAX_TOTAL_PHOTOS - count($currentPhotos);

        if ($remainingSlots <= 0) {
            return back()->with('error', 'Property has reached the maximum number of photos (' . ImageService::MAX_TOTAL_PHOTOS . ').');
        }

        // Process new photos (limited by remaining slots)
        $newPhotoPaths = ImageService::processMultiple(
            $request->file('photos'),
            'properties',
            $remainingSlots
        );

        if (empty($newPhotoPaths)) {
            return back()->with('error', 'Failed to process uploaded photos.');
        }

        // Merge with existing photos
        $updatedPhotos = array_merge($currentPhotos, $newPhotoPaths);
        $property->update(['photos' => $updatedPhotos]);

        $uploadedCount = count($newPhotoPaths);
        ActivityLog::log('photos_added', $property, null, ['added_count' => $uploadedCount], "Added {$uploadedCount} photos to property: {$property->property_title}");

        return back()->with('success', "{$uploadedCount} photo(s) added successfully.");
    }

    /**
     * Remove a photo from a property
     */
    public function removePhoto(Request $request, Property $property)
    {
        $request->validate([
            'photo_index' => 'required|integer|min:0',
        ]);

        $photos = $property->photos ?? [];
        $photoIndex = $request->photo_index;

        if (!isset($photos[$photoIndex])) {
            return back()->with('error', 'Photo not found.');
        }

        // Delete the actual file
        $photoPath = $photos[$photoIndex];
        ImageService::delete($photoPath);

        // Remove from array
        array_splice($photos, $photoIndex, 1);
        $property->update(['photos' => $photos]);

        ActivityLog::log('photo_removed', $property, null, ['removed_path' => $photoPath], "Removed photo from property: {$property->property_title}");

        return back()->with('success', 'Photo removed successfully.');
    }

    /**
     * Store an open house for a property
     */
    public function storeOpenHouse(Request $request, Property $property)
    {
        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'description' => 'nullable|string|max:500',
        ]);

        $openHouse = $property->openHouses()->create($validated);

        ActivityLog::log('open_house_created', $property, null, $validated, "Added open house on {$validated['date']} for property: {$property->property_title}");

        return back()->with('success', 'Open house added successfully!');
    }

    /**
     * Update an open house
     */
    public function updateOpenHouse(Request $request, Property $property, OpenHouse $openHouse)
    {
        if ($openHouse->property_id !== $property->id) {
            abort(404);
        }

        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'description' => 'nullable|string|max:500',
        ]);

        $oldValues = $openHouse->toArray();
        $openHouse->update($validated);

        ActivityLog::log('open_house_updated', $property, $oldValues, $validated, "Updated open house for property: {$property->property_title}");

        return back()->with('success', 'Open house updated successfully!');
    }

    /**
     * Delete an open house
     */
    public function destroyOpenHouse(Property $property, OpenHouse $openHouse)
    {
        if ($openHouse->property_id !== $property->id) {
            abort(404);
        }

        ActivityLog::log('open_house_deleted', $property, $openHouse->toArray(), null, "Deleted open house for property: {$property->property_title}");

        $openHouse->delete();

        return back()->with('success', 'Open house removed successfully!');
    }
}

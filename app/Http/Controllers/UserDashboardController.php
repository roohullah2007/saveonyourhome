<?php

namespace App\Http\Controllers;

use App\Mail\PropertyUpdatedNotification;
use App\Mail\ServiceRequestReceived;
use App\Mail\ServiceRequestToAdmin;
use App\Models\Property;
use App\Models\OpenHouse;
use App\Models\Inquiry;
use App\Models\Favorite;
use App\Models\ServiceRequest;
use App\Models\Setting;
use App\Services\EmailService;
use App\Services\GeocodingService;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    /**
     * Display the dashboard overview
     */
    public function index()
    {
        $user = Auth::user();

        // Get user's properties
        $properties = $user->properties()->latest()->take(5)->get();

        // Get stats
        $propertyIds = $user->properties()->pluck('id');
        $stats = [
            'total_listings' => $user->properties()->count(),
            'active_listings' => $user->properties()->where('is_active', true)->where('approval_status', 'approved')->count(),
            'pending_listings' => $user->properties()->where('approval_status', 'pending')->count(),
            'total_views' => $user->properties()->sum('views'),
            'total_inquiries' => Inquiry::whereIn('property_id', $propertyIds)->count(),
            'unread_inquiries' => Inquiry::whereIn('property_id', $propertyIds)->where('status', 'new')->count(),
            'saved_properties' => $user->favorites()->count(),
            'total_qr_scans' => \App\Models\QrScan::whereIn('property_id', $propertyIds)->count(),
        ];

        // Get recent inquiries (messages) for user's properties
        $recentInquiries = Inquiry::whereIn('property_id', $user->properties()->pluck('id'))
            ->with('property')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'properties' => $properties,
            'stats' => $stats,
            'recentInquiries' => $recentInquiries,
        ]);
    }

    /**
     * Display user's listings
     */
    public function listings(Request $request)
    {
        $user = Auth::user();

        $query = $user->properties()->with(['images', 'qrSticker']);

        // Search
        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('property_title', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->status && $request->status !== 'all') {
            if ($request->status === 'active') {
                $query->where('is_active', true)->where('approval_status', 'approved');
            } elseif ($request->status === 'pending') {
                $query->where('approval_status', 'pending');
            } elseif ($request->status === 'on_hold') {
                $query->where('approval_status', 'on_hold');
            } elseif ($request->status === 'sold') {
                $query->where('listing_status', 'sold');
            } elseif ($request->status === 'inactive') {
                $query->where('listing_status', 'inactive');
            }
        }

        $listings = $query->withCount(['inquiries', 'qrScans'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Get counts for tabs
        $counts = [
            'all' => $user->properties()->count(),
            'active' => $user->properties()->where('is_active', true)->where('approval_status', 'approved')->count(),
            'pending' => $user->properties()->where('approval_status', 'pending')->count(),
            'on_hold' => $user->properties()->where('approval_status', 'on_hold')->count(),
            'sold' => $user->properties()->where('listing_status', 'sold')->count(),
        ];

        // Has the seller already configured their availability rules?
        // Used to hide the "Manage availability" CTA once it's set up.
        $hasAvailability = \App\Models\SellerAvailabilityRule::where('user_id', $user->id)->exists();

        return Inertia::render('Dashboard/Listings', [
            'listings' => $listings,
            'filters' => $request->only(['search', 'status']),
            'counts' => $counts,
            'hasAvailability' => $hasAvailability,
        ]);
    }

    /**
     * Show edit form for a listing
     */
    public function editListing(Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        return Inertia::render('Dashboard/EditListing', [
            'property' => $property->load(['images', 'openHouses']),
        ]);
    }

    /**
     * Update a listing
     */
    public function updateListing(Request $request, Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        // Log incoming request for debugging
        \Log::info('UpdateListing request for property ' . $property->id, [
            'listing_status' => $request->input('listing_status'),
            'features' => $request->input('features'),
            'virtual_tour_url' => $request->input('virtual_tour_url'),
            'all_data' => $request->all(),
        ]);

        // Convert empty strings to null for optional URL fields
        $input = $request->all();
        $urlFields = ['virtual_tour_url', 'matterport_url', 'video_tour_url'];
        foreach ($urlFields as $field) {
            if (isset($input[$field]) && $input[$field] === '') {
                $input[$field] = null;
            }
        }

        // Convert empty lot_size to null (DB column is nullable integer)
        if (isset($input['lot_size']) && $input['lot_size'] === '') {
            $input['lot_size'] = null;
        }

        $request->merge($input);

        $isDraft = $request->boolean('is_draft');
        $isLand = $request->input('property_type') === 'land';

        $baseRules = $isDraft
            ? [
                'property_title' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'property_type' => 'nullable|string',
                'status' => 'nullable|string',
                'listing_status' => 'nullable|string|in:for_sale,pending,sold,inactive',
                'price' => 'nullable|numeric|min:0',
                'city' => 'nullable|string|max:100',
                'state' => 'nullable|string|max:50',
                'zip_code' => 'nullable|string|max:20',
                'bedrooms' => 'nullable|integer|min:0',
                'full_bathrooms' => 'nullable|integer|min:0',
                'sqft' => 'nullable|integer|min:0',
                'description' => 'nullable|string',
            ]
            : [
                'property_title' => 'required|string|max:255',
                'property_type' => 'required|string',
                'status' => 'required|string',
                'listing_status' => 'required|string|in:for_sale,pending,sold,inactive',
                'price' => 'required|numeric|min:0',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:100',
                'state' => 'required|string|max:50',
                'zip_code' => 'required|string|max:20',
                'bedrooms' => $isLand ? 'nullable|integer|min:0' : 'required|integer|min:0',
                'full_bathrooms' => $isLand ? 'nullable|integer|min:0' : 'required|integer|min:0',
                'sqft' => 'nullable|integer|min:0',
                'description' => 'nullable|string',
            ];

        $validated = $request->validate(array_merge($baseRules, [
            'listing_headline' => 'nullable|string|max:80',
            'developer' => 'nullable|string|max:255',
            'transaction_type' => 'nullable|string|in:for_sale,for_rent',
            'listing_label' => 'nullable|string|max:50',
            'county' => 'nullable|string|max:120',
            'subdivision' => 'nullable|string|max:255',
            'school_district' => 'nullable|string|max:255',
            'grade_school' => 'nullable|string|max:255',
            'middle_school' => 'nullable|string|max:255',
            'high_school' => 'nullable|string|max:255',
            'half_bathrooms' => 'nullable|integer|min:0',
            'lot_size' => $isLand && !$isDraft ? 'required|integer|min:0' : 'nullable|integer|min:0',
            'acres' => 'nullable|numeric|min:0',
            'property_dimensions' => 'nullable|string|max:120',
            'zoning' => 'nullable|string|max:100',
            'year_built' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'garage' => 'nullable|integer|min:0|max:5',
            'features' => 'nullable|array',
            'contact_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string|max:20',
            'virtual_tour_url' => 'nullable|url|max:500',
            'virtual_tour_type' => 'nullable|in:video,embed',
            'virtual_tour_embed' => 'nullable|string|max:20000',
            'floor_plans' => 'nullable|array|max:20',
            'floor_plans.*.title' => 'nullable|string|max:120',
            'floor_plans.*.bedrooms' => 'nullable|integer|min:0|max:50',
            'floor_plans.*.bathrooms' => 'nullable|numeric|min:0|max:50',
            'floor_plans.*.size' => 'nullable|string|max:60',
            'floor_plans.*.image' => 'nullable|string|max:500',
            'floor_plans.*.description' => 'nullable|string|max:2000',
            'matterport_url' => 'nullable|url|max:500',
            'video_tour_url' => 'nullable|url|max:500',
            'annual_property_tax' => 'nullable|numeric|min:0',
            'has_hoa' => 'nullable|boolean',
            'hoa_fee' => 'nullable|numeric|min:0',
            'is_motivated_seller' => 'nullable|boolean',
            'is_licensed_agent' => 'nullable|boolean',
            'open_to_realtors' => 'nullable|boolean',
            'requires_pre_approval' => 'nullable|boolean',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:320',
            'og_image' => 'nullable|string|max:2048',
        ]));

        // Sync the old status field based on listing_status
        $statusMap = [
            'for_sale' => 'for-sale',
            'pending' => 'pending',
            'sold' => 'sold',
            'inactive' => 'inactive',
        ];
        $validated['status'] = $statusMap[$validated['listing_status']] ?? $validated['status'];

        // Handle nullable integer fields - convert null/empty to appropriate defaults
        // These fields are optional in the form but the DB columns may not allow NULL

        // For land listings, set bedrooms/bathrooms/sqft to 0 (they don't apply)
        if ($isLand) {
            $validated['bedrooms'] = 0;
            $validated['full_bathrooms'] = 0;
            $validated['half_bathrooms'] = 0;
            $validated['sqft'] = 0;
            $validated['year_built'] = null;
        } else {
            // half_bathrooms: default to 0 if empty
            if (!isset($validated['half_bathrooms']) || $validated['half_bathrooms'] === null || $validated['half_bathrooms'] === '') {
                $validated['half_bathrooms'] = 0;
            }
            // sqft: default to 0 if empty (DB column is NOT NULL)
            if (!isset($validated['sqft']) || $validated['sqft'] === null || $validated['sqft'] === '') {
                $validated['sqft'] = 0;
            }
        }
        // year_built: can be null in DB, so leave it as null if empty

        // Ensure features is always an array
        if (!isset($validated['features']) || !is_array($validated['features'])) {
            $validated['features'] = [];
        }

        // Log validated data before update
        \Log::info('UpdateListing validated data for property ' . $property->id, [
            'listing_status' => $validated['listing_status'] ?? null,
            'features' => $validated['features'] ?? null,
            'virtual_tour_url' => $validated['virtual_tour_url'] ?? null,
            'half_bathrooms' => $validated['half_bathrooms'] ?? null,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
        ]);

        // Preserve existing contact fields if not provided (DB columns are NOT NULL)
        $contactDefaults = ['contact_name', 'contact_email', 'contact_phone'];
        foreach ($contactDefaults as $field) {
            if (!isset($validated[$field]) || $validated[$field] === null) {
                $validated[$field] = $property->$field ?? '';
            }
        }

        // Apply listing state transitions based on draft / publish intent.
        $previousStatus = $property->approval_status;
        $publishingFromDraft = !$isDraft && in_array($previousStatus, ['draft', 'changes_requested', 'rejected'], true);

        if ($isDraft) {
            $validated['approval_status'] = 'draft';
            $validated['is_active'] = false;
        } elseif ($publishingFromDraft) {
            $validated['approval_status'] = 'pending';
            $validated['is_active'] = true;
            $validated['published_at'] = now();
            $validated['admin_feedback'] = null;
            $validated['rejection_reason'] = null;
        }

        if (array_key_exists('floor_plans', $validated)) {
            $validated['floor_plans'] = collect($validated['floor_plans'] ?? [])
                ->map(fn ($fp) => [
                    'title' => $fp['title'] ?? '',
                    'bedrooms' => isset($fp['bedrooms']) ? (int) $fp['bedrooms'] : null,
                    'bathrooms' => isset($fp['bathrooms']) ? (float) $fp['bathrooms'] : null,
                    'size' => $fp['size'] ?? '',
                    'image' => $fp['image'] ?? '',
                    'description' => $fp['description'] ?? '',
                ])
                ->filter(fn ($fp) => $fp['title'] !== '' || $fp['image'] !== '' || $fp['description'] !== '')
                ->values()
                ->all();
        }

        $property->update($validated);

        \Log::info('Property ' . $property->id . ' updated successfully');

        if (empty($validated['latitude']) && empty($validated['longitude'])) {
            GeocodingService::geocodeProperty($property);
        }

        if ($publishingFromDraft) {
            try {
                EmailService::sendToAdmin(new \App\Mail\PropertySubmittedToAdmin($property));
                $sellerEmail = $property->contact_email ?: optional($property->user)->email;
                if ($sellerEmail) {
                    EmailService::sendToUser($sellerEmail, new \App\Mail\PropertySubmittedToOwner($property));
                }
            } catch (\Throwable $e) {
                \Log::error('Publish-from-draft email failed', ['property_id' => $property->id, 'error' => $e->getMessage()]);
            }

            return redirect()->route('dashboard.listings')
                ->with('success', 'Your listing has been submitted for review. We\'ll email you when it\'s approved.');
        }

        if ($isDraft) {
            return redirect()->route('dashboard.listings')->with('success', 'Draft saved.');
        }

        $sellerEmail = $property->contact_email ?: optional($property->user)->email;
        if ($sellerEmail) {
            EmailService::sendToUser($sellerEmail, new PropertyUpdatedNotification($property));
            sleep(2);
            EmailService::sendToAdmin(new PropertyUpdatedNotification($property));
        }

        return redirect()->route('dashboard.listings')->with('success', 'Property updated successfully!');
    }

    /**
     * Pause this listing (place on hold). Hides it from public results until
     * the owner resumes it. Owner-initiated; an admin can also hold/release
     * via the admin panel.
     */
    public function holdListing(Property $property)
    {
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        $property->update([
            'approval_status' => 'on_hold',
            'is_active' => false,
        ]);

        return back()->with('success', 'Listing placed on hold.');
    }

    /**
     * Resume an on-hold listing. Goes back to `pending` so admin can re-confirm
     * before it returns to public results — matches the moderation flow used
     * for new listings.
     */
    public function releaseListing(Property $property)
    {
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        if ($property->approval_status !== 'on_hold') {
            return back()->with('error', 'This listing is not on hold.');
        }

        $property->update([
            'approval_status' => 'pending',
            'is_active' => true,
        ]);

        return back()->with('success', 'Listing resumed and sent for review.');
    }

    /**
     * Delete a listing.
     *
     * This is a HARD delete: the row is force-deleted (so DB cascades
     * fire and inquiries / favorites / qr_scans / open_houses /
     * service_requests / showings are removed) and every photo file
     * the listing owned is wiped from the storage disk first. Sellers
     * expect "delete" to mean gone — not soft-archived.
     */
    public function destroyListing(Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        \DB::transaction(function () use ($property) {
            // Files first — if forceDelete fails for any reason we don't
            // want to have already wiped DB rows but kept orphaned files.
            $property->deletePhysicalFiles();

            // Anything that relies on a soft-related row staying around
            // (e.g. PropertyImage rows that don't have a FK cascade).
            $property->images()->delete();

            // Hard delete the row. FKs declared with cascadeOnDelete on
            // related tables (favorites, inquiries, qr_scans, open_houses,
            // service_requests, property_showings, etc.) clean themselves
            // up automatically.
            $property->forceDelete();
        });

        return redirect()->route('dashboard.listings')->with('success', 'Property deleted. Photos and related records were removed.');
    }

    /**
     * Display user's messages (inquiries on their properties)
     */
    public function messages(Request $request)
    {
        $user = Auth::user();
        $propertyIds = $user->properties()->pluck('id');
        $hasProperties = $propertyIds->isNotEmpty();
        $tab = $request->tab ?? 'received';

        // Helper: user's own inquiries (sent by them)
        $userInquiryScope = function($q) use ($user) {
            $q->where('user_id', $user->id)->orWhere('email', $user->email);
        };

        // Load property with its owner so the frontend can show the seller's
        // name/email/phone when the viewer is the buyer (Sent tab).
        $propertyWith = ['property.user:id,name,email'];

        if ($tab === 'sent') {
            // All inquiries sent by this user
            $query = Inquiry::where($userInquiryScope)->with($propertyWith);
        } else {
            // "Received" tab:
            // - Seller: inquiries received on their properties
            // - Buyer: their inquiries that have a seller reply (responses received)
            // - Both: combine if user is both seller and buyer
            $query = Inquiry::where(function($q) use ($propertyIds, $hasProperties, $userInquiryScope) {
                if ($hasProperties) {
                    $q->whereIn('property_id', $propertyIds);
                }
                // Also show buyer's inquiries that have seller replies
                $q->orWhere(function($q2) use ($userInquiryScope) {
                    $q2->where($userInquiryScope)->whereNotNull('seller_reply');
                });
            })->with($propertyWith);
        }

        // Search
        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->status && $request->status !== 'all') {
            if ($request->status === 'unread') {
                $query->where('status', 'new');
            } elseif ($request->status === 'read') {
                $query->whereIn('status', ['read', 'responded']);
            }
        }

        // Sort by latest activity and include last_seen_at for current user
        $userId = $user->id;
        $messages = $query->with('replies')
            ->addSelect([
                'latest_activity' => \App\Models\MessageReply::selectRaw('MAX(created_at)')
                    ->whereColumn('inquiry_id', 'inquiries.id'),
                'last_seen_at' => \DB::table('inquiry_views')->selectRaw('last_seen_at')
                    ->whereColumn('inquiry_id', 'inquiries.id')
                    ->where('user_id', $userId)
                    ->limit(1),
            ])
            ->orderByRaw('COALESCE(latest_activity, inquiries.created_at) DESC')
            ->paginate(20)->withQueryString();

        // Received counts
        $receivedAll = Inquiry::where(function($q) use ($propertyIds, $hasProperties, $userInquiryScope) {
            if ($hasProperties) $q->whereIn('property_id', $propertyIds);
            $q->orWhere(function($q2) use ($userInquiryScope) {
                $q2->where($userInquiryScope)->whereNotNull('seller_reply');
            });
        })->count();

        // Count threads with activity newer than user's last_seen_at
        $totalUnread = Inquiry::where(function($q) use ($propertyIds, $hasProperties, $userInquiryScope) {
            if ($hasProperties) $q->whereIn('property_id', $propertyIds);
            $q->orWhere(function($q2) use ($userInquiryScope) {
                $q2->where($userInquiryScope)->whereNotNull('seller_reply');
            });
        })->where(function($q) use ($userId) {
            // Either never seen, or has replies newer than last seen
            $q->whereNotExists(function($sub) use ($userId) {
                $sub->select(\DB::raw(1))
                    ->from('inquiry_views')
                    ->whereColumn('inquiry_views.inquiry_id', 'inquiries.id')
                    ->where('inquiry_views.user_id', $userId);
            })->orWhereExists(function($sub) use ($userId) {
                $sub->select(\DB::raw(1))
                    ->from('message_replies')
                    ->whereColumn('message_replies.inquiry_id', 'inquiries.id')
                    ->where('message_replies.user_id', '!=', $userId)
                    ->whereRaw('message_replies.created_at > (SELECT last_seen_at FROM inquiry_views WHERE inquiry_views.inquiry_id = inquiries.id AND inquiry_views.user_id = ? LIMIT 1)', [$userId]);
            });
        })->count();

        $receivedCounts = [
            'all' => $receivedAll,
            'unread' => $totalUnread,
            'read' => max(0, $receivedAll - $totalUnread),
        ];

        $sentCount = Inquiry::where($userInquiryScope)->count();

        // Unread notification count for nav badge
        $unreadCount = $totalUnread;

        return Inertia::render('Dashboard/Messages', [
            'messages' => $messages,
            'filters' => $request->only(['search', 'status', 'tab']),
            'counts' => $receivedCounts,
            'sentCount' => $sentCount,
            'activeTab' => $tab,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Mark a message thread as seen by current user
     */
    public function markMessageSeen(Inquiry $inquiry)
    {
        \DB::table('inquiry_views')->updateOrInsert(
            ['inquiry_id' => $inquiry->id, 'user_id' => Auth::id()],
            ['last_seen_at' => now()]
        );

        // Also mark as read if seller is viewing a new inquiry
        if ($inquiry->property->user_id === Auth::id() && $inquiry->status === 'new') {
            $inquiry->markAsRead();
        }

        return back();
    }

    /**
     * Mark a message as read
     */
    public function markMessageRead(Inquiry $inquiry)
    {
        // Check ownership of the property or inquiry sender
        $isOwner = $inquiry->property->user_id === Auth::id();
        $isSender = $inquiry->user_id === Auth::id() || $inquiry->email === Auth::user()->email;
        if (!$isOwner && !$isSender) {
            abort(403);
        }

        $inquiry->markAsRead();

        return back();
    }

    /**
     * Mark a message as responded
     */
    public function markMessageResponded(Inquiry $inquiry)
    {
        // Check ownership of the property
        if ($inquiry->property->user_id !== Auth::id()) {
            abort(403);
        }

        $inquiry->markAsResponded();

        return back();
    }

    /**
     * Delete a message
     */
    public function destroyMessage(Inquiry $inquiry)
    {
        // Check ownership of the property
        if ($inquiry->property->user_id !== Auth::id()) {
            abort(403);
        }

        $inquiry->delete();

        return back()->with('success', 'Message deleted successfully!');
    }

    /**
     * Reply to a buyer inquiry
     */
    public function replyToMessage(Request $request, Inquiry $inquiry)
    {
        $user = Auth::user();
        $isPropertyOwner = $inquiry->property->user_id === $user->id;
        $isInquirySender = $inquiry->user_id === $user->id || $inquiry->email === $user->email;

        // Only the property owner or the inquiry sender can reply
        if (!$isPropertyOwner && !$isInquirySender) {
            abort(403);
        }

        $validated = $request->validate([
            'reply' => 'required|string|max:2000',
        ]);

        // Auto-migrate old seller_reply if not yet in message_replies
        if ($inquiry->seller_reply && $inquiry->replies()->count() === 0) {
            $sellerId = $inquiry->property->user_id;
            \App\Models\MessageReply::create([
                'inquiry_id' => $inquiry->id,
                'user_id' => $sellerId,
                'message' => $inquiry->seller_reply,
                'created_at' => $inquiry->seller_replied_at ?? $inquiry->updated_at,
                'updated_at' => $inquiry->seller_replied_at ?? $inquiry->updated_at,
            ]);
        }

        // Store new reply in message_replies table
        \App\Models\MessageReply::create([
            'inquiry_id' => $inquiry->id,
            'user_id' => $user->id,
            'message' => $validated['reply'],
        ]);

        // Also update the inquiry status
        $inquiry->update([
            'seller_reply' => $validated['reply'],
            'seller_replied_at' => now(),
            'status' => 'responded',
            'responded_at' => now(),
        ]);

        // Send email notification to the other party. Fall back through
        // every place an email could live so a missing contact_email or
        // missing inquiry email never silently drops the notification.
        if (EmailService::isEnabled()) {
            $property = $inquiry->property;

            if ($isPropertyOwner) {
                // Seller replying → email the buyer.
                $buyerEmail = $inquiry->email ?: optional($inquiry->user)->email;
                if ($buyerEmail) {
                    $sellerName = $property->contact_name ?? $user->name;
                    try {
                        $ok = EmailService::sendToUser(
                            $buyerEmail,
                            new \App\Mail\SellerReplyNotification($inquiry, $property, $validated['reply'], $sellerName)
                        );
                        \Log::info('Seller→buyer reply email', [
                            'inquiry_id' => $inquiry->id,
                            'to' => $buyerEmail,
                            'sent' => $ok,
                        ]);
                    } catch (\Throwable $e) {
                        \Log::error('Seller→buyer reply email failed', ['inquiry_id' => $inquiry->id, 'error' => $e->getMessage()]);
                    }
                } else {
                    \Log::warning('Seller reply: no buyer email reachable', [
                        'inquiry_id' => $inquiry->id,
                        'property_id' => $property->id,
                    ]);
                }
            } elseif ($isInquirySender) {
                // Buyer replying → email the seller. Walk through
                // contact_email → owner account email → admin as last
                // resort so the lead never silently dies.
                $sellerEmail = $property->contact_email ?: optional($property->user)->email;
                if ($sellerEmail) {
                    $buyerName = $inquiry->name ?? $user->name;
                    $buyerEmail = $user->email ?? $inquiry->email;
                    try {
                        $ok = EmailService::sendToUser(
                            $sellerEmail,
                            new \App\Mail\BuyerReplyNotification($inquiry, $property, $validated['reply'], $buyerName, $buyerEmail)
                        );
                        \Log::info('Buyer→seller reply email', [
                            'inquiry_id' => $inquiry->id,
                            'to' => $sellerEmail,
                            'sent' => $ok,
                        ]);
                    } catch (\Throwable $e) {
                        \Log::error('Buyer→seller reply email failed', ['inquiry_id' => $inquiry->id, 'error' => $e->getMessage()]);
                    }
                } else {
                    \Log::warning('Buyer reply: no seller email reachable', [
                        'inquiry_id' => $inquiry->id,
                        'property_id' => $property->id,
                    ]);
                }
            }
        } else {
            \Log::warning('Reply email skipped: email_notifications disabled', ['inquiry_id' => $inquiry->id]);
        }

        return back()->with('success', 'Reply sent successfully!');
    }

    /**
     * Show message preferences
     */
    public function messagePreferences()
    {
        $user = Auth::user();
        $preferences = $user->messagePreference ?? new \App\Models\SellerMessagePreference([
            'delivery_method' => 'email',
            'show_phone_publicly' => false,
            'show_email_publicly' => false,
        ]);

        return Inertia::render('Dashboard/MessagePreferences', [
            'preferences' => $preferences,
        ]);
    }

    /**
     * Update message preferences
     */
    public function updateMessagePreferences(Request $request)
    {
        $validated = $request->validate([
            'delivery_method' => 'required|in:email,sms,both,platform',
            'show_phone_publicly' => 'boolean',
            'show_email_publicly' => 'boolean',
            'preferred_contact_hours' => 'nullable|string|max:255',
        ]);

        Auth::user()->messagePreference()->updateOrCreate(
            ['user_id' => Auth::id()],
            $validated
        );

        return back()->with('success', 'Message preferences updated!');
    }

    /**
     * Display user's favorite properties
     */
    public function favorites(Request $request)
    {
        $user = Auth::user();

        $query = $user->favorites()->with('images');

        // Search
        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('property_title', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $favorites = $query->latest('favorites.created_at')->paginate(12)->withQueryString();

        return Inertia::render('Dashboard/Favorites', [
            'favorites' => $favorites,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Add property to favorites.
     *
     * Returns JSON instead of back() — these endpoints are called from
     * axios on the property cards, and a 302 → full-HTML chain confuses
     * the SPA (axios follows the redirect, gets HTML, and the next click
     * misbehaves because session state isn't refreshed cleanly).
     */
    public function addFavorite(Property $property)
    {
        $user = Auth::user();

        if (!$user->favorites()->where('property_id', $property->id)->exists()) {
            $user->favorites()->attach($property->id);
        }

        return response()->json([
            'favorited' => true,
            'property_id' => $property->id,
        ]);
    }

    /**
     * Remove property from favorites.
     */
    public function removeFavorite(Property $property)
    {
        $user = Auth::user();
        $user->favorites()->detach($property->id);

        return response()->json([
            'favorited' => false,
            'property_id' => $property->id,
        ]);
    }

    /**
     * Display user's service requests (upgrades)
     */
    public function serviceRequests(Request $request)
    {
        $user = Auth::user();

        $query = $user->serviceRequests()->with('property');

        // Filter by status
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by service type
        if ($request->type) {
            $query->where('service_type', $request->type);
        }

        $serviceRequests = $query->latest()->paginate(10)->withQueryString();

        // Get counts
        $counts = [
            'all' => $user->serviceRequests()->count(),
            'pending' => $user->serviceRequests()->where('status', 'pending')->count(),
            'in_progress' => $user->serviceRequests()->whereIn('status', ['approved', 'in_progress'])->count(),
            'completed' => $user->serviceRequests()->where('status', 'completed')->count(),
        ];

        return Inertia::render('Dashboard/ServiceRequests', [
            'serviceRequests' => $serviceRequests,
            'filters' => $request->only(['status', 'type']),
            'counts' => $counts,
        ]);
    }

    /**
     * Show upgrade options for a property
     */
    public function showUpgradeOptions(Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        // Get existing service requests for this property
        $existingRequests = $property->serviceRequests()
            ->whereIn('status', ['pending', 'approved', 'in_progress'])
            ->get();

        return Inertia::render('Dashboard/UpgradeProperty', [
            'property' => $property,
            'existingRequests' => $existingRequests,
        ]);
    }

    /**
     * Submit an upgrade request
     */
    public function submitUpgradeRequest(Request $request, Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        $validated = $request->validate([
            'service_type' => 'required|in:photos,virtual_tour,video,mls',
            'notes' => 'nullable|string|max:1000',
            'preferred_date' => 'nullable|date|after:today',
            'preferred_time' => 'nullable|string',
        ]);

        // Check if there's already a pending request for this service type
        $existingRequest = $property->serviceRequests()
            ->where('service_type', $validated['service_type'])
            ->whereIn('status', ['pending', 'approved', 'in_progress'])
            ->first();

        if ($existingRequest) {
            return back()->withErrors(['service_type' => 'You already have a pending request for this service.']);
        }

        // Create the service request
        $serviceRequest = ServiceRequest::create([
            'user_id' => Auth::id(),
            'property_id' => $property->id,
            'service_type' => $validated['service_type'],
            'notes' => $validated['notes'] ?? null,
            'preferred_date' => $validated['preferred_date'] ?? null,
            'preferred_time' => $validated['preferred_time'] ?? null,
            'status' => 'pending',
        ]);

        // Load relationships for emails
        $serviceRequest->load(['user', 'property']);

        // Send emails with delay to user and admin
        $user = Auth::user();
        if ($user && $user->email) {
            EmailService::sendToUserAndAdmin(
                $user->email,
                new ServiceRequestReceived($serviceRequest),
                new ServiceRequestToAdmin($serviceRequest)
            );
        }

        return redirect()->route('dashboard.listings')
            ->with('success', 'Your upgrade request has been submitted! We will contact you shortly.');
    }

    /**
     * Cancel an upgrade request
     */
    public function cancelUpgradeRequest(ServiceRequest $serviceRequest)
    {
        // Check ownership
        if ($serviceRequest->user_id !== Auth::id()) {
            abort(403);
        }

        // Can only cancel pending or approved requests
        if (!in_array($serviceRequest->status, ['pending', 'approved'])) {
            return back()->withErrors(['error' => 'This request cannot be cancelled.']);
        }

        $serviceRequest->update(['status' => 'cancelled']);

        return back()->with('success', 'Service request cancelled successfully.');
    }

    /**
     * Submit an order for free materials (QR stickers or yard sign)
     */
    public function submitOrder(Request $request, Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        $validated = $request->validate([
            'service_type' => 'required|in:qr_stickers,yard_sign',
            'shipping_name' => 'required|string|max:255',
            'shipping_address' => 'required|string|max:255',
            'shipping_city' => 'required|string|max:100',
            'shipping_state' => 'required|string|max:50',
            'shipping_zip' => 'required|string|max:20',
            'shipping_phone' => 'required|string|max:20',
            'quantity' => 'nullable|integer|min:1|max:10',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Check if there's already a pending request for this service type on this property
        $existingRequest = $property->serviceRequests()
            ->where('service_type', $validated['service_type'])
            ->whereIn('status', ['pending', 'approved', 'in_progress'])
            ->first();

        if ($existingRequest) {
            return back()->withErrors(['service_type' => 'You already have a pending order for this item.']);
        }

        // Build shipping info for notes
        $shippingInfo = "Ship to:\n" .
            $validated['shipping_name'] . "\n" .
            $validated['shipping_address'] . "\n" .
            $validated['shipping_city'] . ", " . $validated['shipping_state'] . " " . $validated['shipping_zip'] . "\n" .
            "Phone: " . $validated['shipping_phone'];

        if ($validated['service_type'] === 'qr_stickers') {
            $shippingInfo .= "\nQuantity: " . ($validated['quantity'] ?? 2) . " stickers";
        }

        // For yard signs, embed the listing URL + a public QR code image URL so
        // admin can forward straight to the print partner without manual lookup.
        if ($validated['service_type'] === 'yard_sign') {
            $listingUrl = url('/properties/' . ($property->slug ?: $property->id));
            $qrImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=' . urlencode($listingUrl);
            $shippingInfo .= "\n\n— Print details —" .
                "\nProperty address: " . trim($property->address . ', ' . $property->city . ', ' . $property->state . ' ' . $property->zip_code, ', ') .
                "\nListing URL: " . $listingUrl .
                "\nQR code (500×500 PNG): " . $qrImageUrl;
        }

        if (!empty($validated['notes'])) {
            $shippingInfo .= "\n\nSeller notes: " . $validated['notes'];
        }

        // Create the service request
        $serviceRequest = ServiceRequest::create([
            'user_id' => Auth::id(),
            'property_id' => $property->id,
            'service_type' => $validated['service_type'],
            'notes' => $shippingInfo,
            'status' => 'pending',
        ]);

        // Load relationships for emails
        $serviceRequest->load(['user', 'property']);

        // Send emails with delay to user and admin
        $user = Auth::user();
        if ($user && $user->email) {
            EmailService::sendToUserAndAdmin(
                $user->email,
                new ServiceRequestReceived($serviceRequest),
                new ServiceRequestToAdmin($serviceRequest)
            );
        }

        $itemName = $validated['service_type'] === 'qr_stickers' ? 'QR stickers' : 'yard sign';
        return back()->with('success', "Your free {$itemName} order has been submitted!");
    }

    /**
     * Add photos to a listing (supports both file uploads and pre-uploaded paths)
     */
    public function addPhotos(Request $request, Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        $currentPhotos = $property->photos ?? [];
        $remainingSlots = ImageService::MAX_TOTAL_PHOTOS - count($currentPhotos);

        if ($remainingSlots <= 0) {
            return back()->with('error', 'Your listing has reached the maximum number of photos (' . ImageService::MAX_TOTAL_PHOTOS . ').');
        }

        $newPhotoPaths = [];

        // Check if pre-uploaded paths are provided (progressive upload method)
        if ($request->has('photo_paths') && is_array($request->photo_paths)) {
            $request->validate([
                'photo_paths' => 'required|array|min:1',
                'photo_paths.*' => 'string',
            ]);

            // Use pre-uploaded paths directly (limited by remaining slots)
            $newPhotoPaths = array_slice($request->photo_paths, 0, $remainingSlots);
        }
        // Otherwise, handle direct file uploads (legacy method)
        elseif ($request->hasFile('photos')) {
            $request->validate([
                'photos' => 'required|array|min:1',
                'photos.*' => 'file|max:30720', // 30MB max per image
            ]);

            // Process new photos (limited by remaining slots)
            $newPhotoPaths = ImageService::processMultiple(
                $request->file('photos'),
                'properties',
                $remainingSlots
            );
        }

        if (empty($newPhotoPaths)) {
            return back()->with('error', 'Failed to process uploaded photos. Please try again.');
        }

        // Merge with existing photos
        $updatedPhotos = array_merge($currentPhotos, $newPhotoPaths);
        $property->update(['photos' => $updatedPhotos]);

        $uploadedCount = count($newPhotoPaths);
        return back()->with('success', "{$uploadedCount} photo(s) added successfully!");
    }

    /**
     * Remove a photo from a listing
     */
    public function removePhoto(Request $request, Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

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

        return back()->with('success', 'Photo removed successfully.');
    }

    /**
     * Reorder photos (set main photo)
     */
    public function reorderPhotos(Request $request, Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        $request->validate([
            'photo_order' => 'required|array',
            'photo_order.*' => 'integer|min:0',
        ]);

        $currentPhotos = $property->photos ?? [];
        $newOrder = $request->photo_order;

        // Validate that all indices are valid
        foreach ($newOrder as $index) {
            if (!isset($currentPhotos[$index])) {
                return back()->with('error', 'Invalid photo order.');
            }
        }

        // Reorder the photos
        $reorderedPhotos = [];
        foreach ($newOrder as $index) {
            $reorderedPhotos[] = $currentPhotos[$index];
        }

        $property->update(['photos' => $reorderedPhotos]);

        return back()->with('success', 'Photos reordered successfully.');
    }

    /**
     * Store an open house for a listing
     */
    public function storeOpenHouse(Request $request, Property $property)
    {
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'description' => 'nullable|string|max:500',
        ]);

        $property->openHouses()->create($validated);

        return back()->with('success', 'Open house added successfully!');
    }

    /**
     * Update an open house
     */
    public function updateOpenHouse(Request $request, Property $property, OpenHouse $openHouse)
    {
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        if ($openHouse->property_id !== $property->id) {
            abort(404);
        }

        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'description' => 'nullable|string|max:500',
        ]);

        $openHouse->update($validated);

        return back()->with('success', 'Open house updated successfully!');
    }

    /**
     * Delete an open house
     */
    public function destroyOpenHouse(Property $property, OpenHouse $openHouse)
    {
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        if ($openHouse->property_id !== $property->id) {
            abort(404);
        }

        $openHouse->delete();

        return back()->with('success', 'Open house removed successfully!');
    }
}

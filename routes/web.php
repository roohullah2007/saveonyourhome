<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminPropertyController;
use App\Http\Controllers\Admin\AdminInquiryController;
use App\Http\Controllers\Admin\AdminContactController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminActivityController;
use App\Http\Controllers\Admin\AdminMediaOrderController;
use App\Http\Controllers\Admin\AdminResourceController;
use App\Http\Controllers\Admin\AdminPartnerController;
use App\Http\Controllers\Admin\AdminTaxonomyController;
use App\Http\Controllers\ClaimController;
use App\Http\Controllers\BuyerInquiryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\QrCodeController;
use App\Http\Controllers\CalendarFeedController;
use App\Http\Controllers\CalendarImportController;
use App\Http\Controllers\MediaOrderController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\PropertyShowingController;
use App\Http\Controllers\SellerAvailabilityController;
use App\Http\Controllers\SellerShowingsController;
use App\Http\Controllers\SitemapController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Sitemap
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

// Public ICS feed (token-protected) — sellers subscribe from their own calendars
Route::get('/calendar-feeds/{token}.ics', [CalendarFeedController::class, 'show'])
    ->where('token', '[A-Za-z0-9]+')
    ->name('calendar.feed');

// QR Code Short URL Redirect (public, no auth required)
Route::get('/p/{code}', [QrCodeController::class, 'handleScan'])->name('qr.scan');

/*
|--------------------------------------------------------------------------
| 301 Redirects — legacy (WordPress/Houzez) URLs → new Laravel routes
|--------------------------------------------------------------------------
| Preserves link equity and search rankings from the prior site. Laravel
| matches routes with or without a trailing slash, so a single entry here
| covers both /about-us and /about-us/.
*/
$legacyRedirects = [
    '/about-us'                                => '/about',
    '/frequently-ask-questions'                => '/faqs',
    '/terms-conditions'                        => '/terms-of-use',
    '/seller-guide'                            => '/fsbo-guide',
    '/blog-and-resources'                      => '/blog',
    '/posts'                                   => '/blog',
    '/insight'                                 => '/blog',
    '/advertiser-sponsor-honor-pledge'         => '/honor-pledge',
    '/whats-my-home-worth'                     => '/home-worth',
    '/valuation'                               => '/home-worth',
    '/test-valuation-report'                   => '/home-worth',
    '/get-information-on-360-virtual-tour'     => '/virtual-tours',
    '/e-book'                                  => '/ebook',
    '/create-listing'                          => '/list-property',
    '/create-account'                          => '/register',
    '/signup-buyer'                            => '/register',
    '/signup-step-1'                           => '/register',
    '/signup-step-2'                           => '/register',
    '/how-to-register'                         => '/register',
    '/login-test'                              => '/login',
    '/partners-new'                            => '/partners',
    '/search-homes'                            => '/properties',
    '/properties-2'                            => '/properties',
    '/property-search'                         => '/properties',
    '/search-results'                          => '/properties',
    '/compare'                                 => '/properties',
    '/dashboard-favorites'                     => '/dashboard/favorites',
    '/dashboard-staff'                         => '/dashboard',
    '/booking-dashboard'                       => '/dashboard',
    '/bookings'                                => '/dashboard',
    '/saved-searches'                          => '/dashboard',
    '/membership-info'                         => '/',
    '/thank-you'                               => '/',
];
foreach ($legacyRedirects as $from => $to) {
    Route::permanentRedirect($from, $to);
}

// Legacy property detail URLs: /property/{slug}/ → /properties
Route::permanentRedirect('/property/{slug}', '/properties')
    ->where('slug', '[A-Za-z0-9\-]+');

// Public routes
Route::get('/', function () {
    // Get featured properties first, then fill with latest approved properties
    $featuredProperties = \App\Models\Property::where('is_active', true)
        ->where('approval_status', 'approved')
        ->orderByDesc('is_featured') // Featured properties first
        ->latest()
        ->take(8)
        ->get();

    return Inertia::render('Home', [
        'featuredProperties' => $featuredProperties
    ]);
})->name('home');

Route::get('/properties', [PropertyController::class, 'publicIndex'])->name('properties');
Route::get('/properties/{property}', [PropertyController::class, 'show'])->name('properties.show');

// Listing detail widgets — "What's Nearby?" (Yelp) and Walkscore. Public; cached server-side.
Route::get('/api/properties/{property}/nearby', [\App\Http\Controllers\PropertyNearbyController::class, 'nearby'])->name('properties.nearby');
Route::get('/api/properties/{property}/walkscore', [\App\Http\Controllers\PropertyNearbyController::class, 'walkscore'])->name('properties.walkscore');

// CSRF token refresh endpoint (for long-lived pages)
Route::get('/csrf-token', function () {
    return response()->json(['token' => csrf_token()]);
})->name('csrf.token');

// Photo upload endpoints (require auth)
Route::middleware(['auth'])->group(function () {
    Route::post('/upload-photo', [PropertyController::class, 'uploadPhoto'])->name('upload.photo');
    Route::post('/delete-uploaded-photo', [PropertyController::class, 'deleteUploadedPhoto'])->name('delete.uploaded.photo');
    Route::post('/api/geocode', [PropertyController::class, 'geocodeAddress'])->name('api.geocode');
    Route::post('/api/reverse-geocode', [PropertyController::class, 'reverseGeocodeAddress'])->name('api.reverse-geocode');
    Route::post('/api/rentcast-lookup', [PropertyController::class, 'rentcastLookup'])->name('api.rentcast-lookup');

    // Saved Searches
    Route::post('/api/saved-searches', function (\Illuminate\Http\Request $request) {
        $request->validate(['name' => 'required|string|max:255', 'filters' => 'required|array']);
        $saved = auth()->user()->savedSearches()->create([
            'name' => $request->name,
            'filters' => $request->filters,
        ]);
        return response()->json(['success' => true, 'savedSearch' => $saved]);
    })->name('saved-searches.store');

    Route::get('/api/saved-searches', function () {
        return response()->json(auth()->user()->savedSearches()->latest()->get());
    })->name('saved-searches.index');

    Route::delete('/api/saved-searches/{savedSearch}', function (\App\Models\SavedSearch $savedSearch) {
        if ($savedSearch->user_id !== auth()->id()) abort(403);
        $savedSearch->delete();
        return response()->json(['success' => true]);
    })->name('saved-searches.destroy');
});

Route::get('/buyers', function () {
    return Inertia::render('Buyers');
})->name('buyers');

Route::get('/buyer-faqs', function () {
    return Inertia::render('BuyerFAQs');
})->name('buyer-faqs');

Route::get('/get-pre-approved', function () {
    return Inertia::render('GetPreApproved');
})->name('get-pre-approved');

Route::get('/buyers-guide', function () {
    return Inertia::render('BuyersGuide');
})->name('buyers-guide');

Route::get('/sell-your-home', function () {
    return Inertia::render('Sellers');
})->name('sellers');

Route::get('/fsbo-guide', function () {
    return Inertia::render('FSBOGuide');
})->name('fsbo-guide');

Route::get('/home-worth', function () {
    return Inertia::render('HomeWorth');
})->name('home-worth');

Route::get('/seller-faqs', function () {
    return Inertia::render('SellerFAQs');
})->name('seller-faqs');

Route::get('/virtual-tours', function () {
    return Inertia::render('VirtualTours');
})->name('virtual-tours');

Route::get('/claim-your-free-fsbo-sign', function () {
    return Inertia::render('ClaimFreeSign');
})->name('claim-free-sign');

Route::get('/request-free-fsbo-guide', function () {
    return Inertia::render('RequestFSBOGuide');
})->name('request-fsbo-guide');

Route::get('/join-the-fsbo-weekly-call', function () {
    return Inertia::render('JoinWeeklyCall');
})->name('join-weekly-call');

Route::get('/partners', function () {
    $partners = \App\Models\Partner::public()
        ->orderBy('category')->orderBy('sort_order')->orderBy('name')->get();
    $partnersByCategory = $partners->groupBy('category')->toArray();
    return Inertia::render('Partners', [
        'partnersByCategory' => $partnersByCategory,
        'categories' => \App\Models\Partner::categories(),
    ]);
})->name('partners');

Route::get('/become-a-partner', [PartnerController::class, 'becomeForm'])->name('partners.become');
Route::post('/become-a-partner', [PartnerController::class, 'becomeStore'])->name('partners.become.store');
Route::post('/partner-inquiry', [PartnerController::class, 'inquire'])->name('partners.inquire');
Route::get('/partners/{slug}', [PartnerController::class, 'show'])->name('partners.show');

Route::get('/seller-resources', function () {
    $resources = \App\Models\Resource::published()->category('seller')->latest('published_at')->get();
    return Inertia::render('SellerResources', ['resources' => $resources]);
})->name('seller-resources');

Route::get('/buyer-resources', function () {
    $resources = \App\Models\Resource::published()->category('buyer')->latest('published_at')->get();
    return Inertia::render('BuyerResources', ['resources' => $resources]);
})->name('buyer-resources');

Route::get('/honor-pledge', function () {
    return Inertia::render('HonorPledge');
})->name('honor-pledge');

Route::get('/blog', function () {
    $resources = \App\Models\Resource::published()->latest('published_at')->get();
    return Inertia::render('Blog', ['resources' => $resources]);
})->name('blog');

Route::get('/ebook', function () {
    return Inertia::render('EBook');
})->name('ebook');

// Free eBooks library (public index; download requires auth)
Route::get('/ebooks', [\App\Http\Controllers\EbookController::class, 'index'])->name('ebooks.index');
Route::post('/ebooks/{ebook:slug}/download', [\App\Http\Controllers\EbookController::class, 'download'])
    ->middleware(['auth'])
    ->name('ebooks.download');

Route::get('/resources/{slug}', function ($slug) {
    $resource = \App\Models\Resource::where('slug', $slug)->published()->firstOrFail();
    return Inertia::render('ResourceDetail', ['resource' => $resource]);
})->name('resource.show');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/faqs', function () {
    return Inertia::render('FAQs');
})->name('faqs');

Route::get('/privacy-policy', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy-policy');

Route::get('/terms-of-use', function () {
    return Inertia::render('TermsOfUse');
})->name('terms-of-use');

// Packages & Media Ordering
Route::get('/our-packages', [MediaOrderController::class, 'index'])->name('packages');
Route::get('/packages', [MediaOrderController::class, 'index']); // Alias
Route::post('/media-order', [MediaOrderController::class, 'store'])->name('media-order.store');

// Claim routes (imported property claiming)
Route::get('/claim/{token}', [ClaimController::class, 'show'])->name('claim.show');
Route::post('/claim/{token}', [ClaimController::class, 'claim'])->name('claim.process')->middleware(['auth']);
Route::post('/claim/{token}/register', [ClaimController::class, 'register'])->name('claim.register');

// Property listing routes - require authentication
Route::middleware(['auth'])->group(function () {
    Route::get('/list-property', function () {
        return Inertia::render('ListProperty');
    })->name('list-property');

    Route::post('/properties', [PropertyController::class, 'store'])->name('properties.store');
});

// Showings (public booking + cancel)
Route::get('/api/properties/{property}/availability', [PropertyShowingController::class, 'availability'])->name('showings.availability');
Route::post('/showings', [PropertyShowingController::class, 'store'])->name('showings.store');
Route::get('/showings/cancel/{token}', [PropertyShowingController::class, 'showCancel'])->name('showings.cancel');
Route::post('/showings/cancel/{token}', [PropertyShowingController::class, 'cancel'])->name('showings.cancel.process');

// Buyer inquiry submission route (public)
Route::post('/buyer-inquiry', [BuyerInquiryController::class, 'store'])->name('buyer-inquiry.store');

// Public token-signed link to turn off alerts for a saved search (from alert emails).
Route::get('/saved-searches/{savedSearch}/unsubscribe', [\App\Http\Controllers\SavedSearchController::class, 'unsubscribe'])->name('saved-searches.unsubscribe');

// Contact form submission route (public)
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Property inquiry submission route (public)
Route::post('/inquiry', [InquiryController::class, 'store'])->name('inquiry.store');

// User Dashboard
Route::middleware(['auth'])->prefix('dashboard')->name('dashboard')->group(function () {
    // Dashboard Overview
    Route::get('/', [UserDashboardController::class, 'index']);

    // Listings Management
    Route::get('/listings', [UserDashboardController::class, 'listings'])->name('.listings');
    Route::get('/listings/create', function () {
        return Inertia::render('ListProperty');
    })->name('.listings.create');
    Route::get('/listings/{property}/edit', [UserDashboardController::class, 'editListing'])->name('.listings.edit');
    Route::post('/listings/generate-description-draft', [\App\Http\Controllers\PropertyDescriptionController::class, 'generateDraft'])->name('.listings.generate-description-draft');
    Route::post('/listings/{property}/generate-description', [\App\Http\Controllers\PropertyDescriptionController::class, 'generate'])->name('.listings.generate-description');
    Route::put('/listings/{property}', [UserDashboardController::class, 'updateListing'])->name('.listings.update');
    Route::delete('/listings/{property}', [UserDashboardController::class, 'destroyListing'])->name('.listings.destroy');
    Route::post('/listings/{property}/photos', [UserDashboardController::class, 'addPhotos'])->name('.listings.photos.add');
    Route::post('/listings/{property}/photos/remove', [UserDashboardController::class, 'removePhoto'])->name('.listings.photos.remove');
    Route::post('/listings/{property}/photos/reorder', [UserDashboardController::class, 'reorderPhotos'])->name('.listings.photos.reorder');

    // Open Houses
    Route::post('/listings/{property}/open-houses', [UserDashboardController::class, 'storeOpenHouse'])->name('.listings.open-houses.store');
    Route::put('/listings/{property}/open-houses/{openHouse}', [UserDashboardController::class, 'updateOpenHouse'])->name('.listings.open-houses.update');
    Route::delete('/listings/{property}/open-houses/{openHouse}', [UserDashboardController::class, 'destroyOpenHouse'])->name('.listings.open-houses.destroy');

    // Messages (Inquiries)
    Route::get('/messages', [UserDashboardController::class, 'messages'])->name('.messages');
    Route::post('/messages/{inquiry}/read', [UserDashboardController::class, 'markMessageRead'])->name('.messages.read');
    Route::post('/messages/{inquiry}/responded', [UserDashboardController::class, 'markMessageResponded'])->name('.messages.responded');
    Route::delete('/messages/{inquiry}', [UserDashboardController::class, 'destroyMessage'])->name('.messages.destroy');
    Route::post('/messages/{inquiry}/reply', [UserDashboardController::class, 'replyToMessage'])->name('.messages.reply');
    Route::post('/messages/{inquiry}/seen', [UserDashboardController::class, 'markMessageSeen'])->name('.messages.seen');

    // Message Preferences
    Route::get('/message-preferences', [UserDashboardController::class, 'messagePreferences'])->name('.message-preferences');
    Route::post('/message-preferences', [UserDashboardController::class, 'updateMessagePreferences'])->name('.message-preferences.update');

    // Favorites
    Route::get('/favorites', [UserDashboardController::class, 'favorites'])->name('.favorites');
    Route::post('/favorites/{property}', [UserDashboardController::class, 'addFavorite'])->name('.favorites.add');
    Route::delete('/favorites/{property}', [UserDashboardController::class, 'removeFavorite'])->name('.favorites.remove');

    // Saved Searches
    Route::get('/saved-searches', [\App\Http\Controllers\SavedSearchController::class, 'index'])->name('.saved-searches');
    Route::post('/saved-searches', [\App\Http\Controllers\SavedSearchController::class, 'store'])->name('.saved-searches.store');
    Route::put('/saved-searches/{savedSearch}', [\App\Http\Controllers\SavedSearchController::class, 'update'])->name('.saved-searches.update');
    Route::delete('/saved-searches/{savedSearch}', [\App\Http\Controllers\SavedSearchController::class, 'destroy'])->name('.saved-searches.destroy');

    // Service Requests (Upgrades)
    Route::get('/service-requests', [UserDashboardController::class, 'serviceRequests'])->name('.service-requests');
    Route::get('/listings/{property}/upgrade', [UserDashboardController::class, 'showUpgradeOptions'])->name('.listings.upgrade');
    Route::post('/listings/{property}/upgrade', [UserDashboardController::class, 'submitUpgradeRequest'])->name('.listings.upgrade.submit');
    Route::post('/service-requests/{serviceRequest}/cancel', [UserDashboardController::class, 'cancelUpgradeRequest'])->name('.service-requests.cancel');

    // QR Code Generation (Authenticated - for property owners)
    Route::get('/listings/{property}/qrcode', [QrCodeController::class, 'generate'])->name('.listings.qrcode');
    Route::get('/listings/{property}/qrcode/preview', [QrCodeController::class, 'preview'])->name('.listings.qrcode.preview');
    Route::get('/listings/{property}/qrcode/info', [QrCodeController::class, 'getStickerInfo'])->name('.listings.qrcode.info');

    // Order Free Materials (Stickers, Yard Signs)
    Route::post('/listings/{property}/order', [UserDashboardController::class, 'submitOrder'])->name('.listings.order');

    // Media Orders
    Route::get('/media-orders', [MediaOrderController::class, 'userOrders'])->name('.media-orders');
    Route::get('/media-orders/{mediaOrder}', [MediaOrderController::class, 'show'])->name('.media-orders.show');
    Route::post('/media-orders/{mediaOrder}/cancel', [MediaOrderController::class, 'cancel'])->name('.media-orders.cancel');

    // Availability (seller's weekly schedule)
    Route::get('/availability', [SellerAvailabilityController::class, 'index'])->name('.availability');
    Route::post('/availability', [SellerAvailabilityController::class, 'store'])->name('.availability.store');
    Route::put('/availability/{rule}', [SellerAvailabilityController::class, 'update'])->name('.availability.update');
    Route::delete('/availability/{rule}', [SellerAvailabilityController::class, 'destroy'])->name('.availability.destroy');

    // Calendar sync (import + export)
    Route::post('/calendars', [CalendarImportController::class, 'store'])->name('.calendars.store');
    Route::delete('/calendars/{calendar}', [CalendarImportController::class, 'destroy'])->name('.calendars.destroy');
    Route::post('/calendars/{calendar}/sync', [CalendarImportController::class, 'sync'])->name('.calendars.sync');
    Route::post('/calendar-feed/regenerate', [CalendarImportController::class, 'regenerateFeed'])->name('.calendar-feed.regenerate');

    // Showings (booked meetings)
    Route::get('/showings', [SellerShowingsController::class, 'index'])->name('.showings');
    Route::post('/showings/{showing}/cancel', [SellerShowingsController::class, 'cancel'])->name('.showings.cancel');
    Route::post('/showings/{showing}/complete', [SellerShowingsController::class, 'complete'])->name('.showings.complete');
});

// User Profile routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes - Protected by admin middleware
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    // Dashboard
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Users Management
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('users.toggle-status');

    // Properties Management
    Route::get('/properties', [AdminPropertyController::class, 'index'])->name('properties.index');
    Route::get('/properties/create', [AdminPropertyController::class, 'create'])->name('properties.create');
    Route::post('/properties', [AdminPropertyController::class, 'store'])->name('properties.store');
    Route::get('/properties/{property}', [AdminPropertyController::class, 'show'])->name('properties.show');
    Route::get('/properties/{property}/edit', [AdminPropertyController::class, 'edit'])->name('properties.edit');
    Route::put('/properties/{property}', [AdminPropertyController::class, 'update'])->name('properties.update');
    Route::delete('/properties/{property}', [AdminPropertyController::class, 'destroy'])->name('properties.destroy');
    Route::post('/properties/{property}/approve', [AdminPropertyController::class, 'approve'])->name('properties.approve');
    Route::post('/properties/{property}/reject', [AdminPropertyController::class, 'reject'])->name('properties.reject');
    Route::post('/properties/{property}/request-changes', [AdminPropertyController::class, 'requestChanges'])->name('properties.request-changes');
    Route::post('/properties/{property}/toggle-featured', [AdminPropertyController::class, 'toggleFeatured'])->name('properties.toggle-featured');
    Route::post('/properties/{property}/toggle-active', [AdminPropertyController::class, 'toggleActive'])->name('properties.toggle-active');
    Route::post('/properties/bulk-action', [AdminPropertyController::class, 'bulkAction'])->name('properties.bulk-action');
    Route::get('/properties/{property}/download-qr', [QrCodeController::class, 'generate'])->name('properties.download-qr');
    Route::get('/properties/{property}/download-photos', [AdminPropertyController::class, 'downloadPhotos'])->name('properties.download-photos');
    Route::post('/properties/{property}/add-photos', [AdminPropertyController::class, 'addPhotos'])->name('properties.add-photos');
    Route::post('/properties/{property}/remove-photo', [AdminPropertyController::class, 'removePhoto'])->name('properties.remove-photo');
    Route::post('/properties/{property}/toggle-showcase', [AdminPropertyController::class, 'toggleShowcase'])->name('properties.toggle-showcase');
    Route::post('/properties/{property}/testimonial', [AdminPropertyController::class, 'updateTestimonial'])->name('properties.update-testimonial');
    Route::post('/properties/{property}/convert-showcase', [AdminPropertyController::class, 'convertToShowcase'])->name('properties.convert-showcase');
    Route::delete('/properties/{property}/force', [AdminPropertyController::class, 'forceDelete'])->name('properties.force-delete');
    Route::post('/properties/{property}/restore', [AdminPropertyController::class, 'restore'])->name('properties.restore');

    // Open Houses
    Route::post('/properties/{property}/open-houses', [AdminPropertyController::class, 'storeOpenHouse'])->name('properties.open-houses.store');
    Route::put('/properties/{property}/open-houses/{openHouse}', [AdminPropertyController::class, 'updateOpenHouse'])->name('properties.open-houses.update');
    Route::delete('/properties/{property}/open-houses/{openHouse}', [AdminPropertyController::class, 'destroyOpenHouse'])->name('properties.open-houses.destroy');

    // Inquiries Management
    Route::get('/inquiries', [AdminInquiryController::class, 'index'])->name('inquiries.index');
    Route::get('/inquiries/{inquiry}', [AdminInquiryController::class, 'show'])->name('inquiries.show');
    Route::put('/inquiries/{inquiry}', [AdminInquiryController::class, 'update'])->name('inquiries.update');
    Route::delete('/inquiries/{inquiry}', [AdminInquiryController::class, 'destroy'])->name('inquiries.destroy');
    Route::post('/inquiries/{inquiry}/mark-read', [AdminInquiryController::class, 'markAsRead'])->name('inquiries.mark-read');
    Route::post('/inquiries/{inquiry}/mark-responded', [AdminInquiryController::class, 'markAsResponded'])->name('inquiries.mark-responded');
    Route::post('/inquiries/{inquiry}/archive', [AdminInquiryController::class, 'archive'])->name('inquiries.archive');
    Route::post('/inquiries/bulk-action', [AdminInquiryController::class, 'bulkAction'])->name('inquiries.bulk-action');

    // Contact Messages Management
    Route::get('/messages', [AdminContactController::class, 'index'])->name('messages.index');
    Route::get('/messages/{message}', [AdminContactController::class, 'show'])->name('messages.show');
    Route::put('/messages/{message}', [AdminContactController::class, 'update'])->name('messages.update');
    Route::delete('/messages/{message}', [AdminContactController::class, 'destroy'])->name('messages.destroy');
    Route::post('/messages/{message}/mark-read', [AdminContactController::class, 'markAsRead'])->name('messages.mark-read');
    Route::post('/messages/{message}/mark-responded', [AdminContactController::class, 'markAsResponded'])->name('messages.mark-responded');
    Route::post('/messages/{message}/archive', [AdminContactController::class, 'archive'])->name('messages.archive');
    Route::post('/messages/bulk-action', [AdminContactController::class, 'bulkAction'])->name('messages.bulk-action');

    // Activity Logs
    Route::get('/activity', [AdminActivityController::class, 'index'])->name('activity.index');
    Route::get('/activity/{activity}', [AdminActivityController::class, 'show'])->name('activity.show');
    Route::post('/activity/clear', [AdminActivityController::class, 'clear'])->name('activity.clear');

    // Settings
    Route::get('/settings', [AdminSettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [AdminSettingsController::class, 'update'])->name('settings.update');
    Route::post('/settings/store', [AdminSettingsController::class, 'store'])->name('settings.store');
    Route::delete('/settings/{setting}', [AdminSettingsController::class, 'destroy'])->name('settings.destroy');
    Route::post('/settings/initialize', [AdminSettingsController::class, 'initializeDefaults'])->name('settings.initialize');

    // Resources Management
    Route::get('/resources', [AdminResourceController::class, 'index'])->name('resources.index');
    Route::post('/resources/ai-generate', [AdminResourceController::class, 'aiGenerate'])->name('resources.ai-generate');
    Route::post('/resources', [AdminResourceController::class, 'store'])->name('resources.store');
    Route::put('/resources/{resource}', [AdminResourceController::class, 'update'])->name('resources.update');
    Route::delete('/resources/{resource}', [AdminResourceController::class, 'destroy'])->name('resources.destroy');

    // eBooks library
    Route::get('/ebooks', [\App\Http\Controllers\Admin\AdminEbookController::class, 'index'])->name('ebooks.index');
    Route::post('/ebooks', [\App\Http\Controllers\Admin\AdminEbookController::class, 'store'])->name('ebooks.store');
    Route::post('/ebooks/{ebook}', [\App\Http\Controllers\Admin\AdminEbookController::class, 'update'])->name('ebooks.update');
    Route::delete('/ebooks/{ebook}', [\App\Http\Controllers\Admin\AdminEbookController::class, 'destroy'])->name('ebooks.destroy');

    // Analytics dashboard
    Route::get('/analytics', [\App\Http\Controllers\Admin\AdminAnalyticsController::class, 'index'])->name('analytics.index');

    // Taxonomies (property types, transaction types, statuses, special notices)
    Route::get('/taxonomies', [AdminTaxonomyController::class, 'index'])->name('taxonomies.index');
    Route::post('/taxonomies', [AdminTaxonomyController::class, 'store'])->name('taxonomies.store');
    Route::put('/taxonomies/{term}', [AdminTaxonomyController::class, 'update'])->name('taxonomies.update');
    Route::delete('/taxonomies/{term}', [AdminTaxonomyController::class, 'destroy'])->name('taxonomies.destroy');
    Route::post('/taxonomies/reorder', [AdminTaxonomyController::class, 'reorder'])->name('taxonomies.reorder');

    // Amenities (dedicated page — shares store / update / destroy / reorder with taxonomies)
    Route::get('/amenities', [AdminTaxonomyController::class, 'amenities'])->name('amenities.index');

    // Partners Management
    Route::get('/partners', [AdminPartnerController::class, 'index'])->name('partners.index');
    Route::post('/partners', [AdminPartnerController::class, 'store'])->name('partners.store');
    Route::match(['put', 'post'], '/partners/{partner}', [AdminPartnerController::class, 'update'])->name('partners.update');
    Route::post('/partners/{partner}/approve', [AdminPartnerController::class, 'approve'])->name('partners.approve');
    Route::post('/partners/{partner}/reject', [AdminPartnerController::class, 'reject'])->name('partners.reject');
    Route::delete('/partners/{partner}', [AdminPartnerController::class, 'destroy'])->name('partners.destroy');

    // Media Orders Management
    Route::get('/media-orders', [AdminMediaOrderController::class, 'index'])->name('media-orders.index');
    Route::get('/media-orders/{mediaOrder}', [AdminMediaOrderController::class, 'show'])->name('media-orders.show');
    Route::post('/media-orders/{mediaOrder}/status', [AdminMediaOrderController::class, 'updateStatus'])->name('media-orders.status');
    Route::post('/media-orders/{mediaOrder}/paid', [AdminMediaOrderController::class, 'markPaid'])->name('media-orders.paid');
    Route::post('/media-orders/{mediaOrder}/notes', [AdminMediaOrderController::class, 'addNotes'])->name('media-orders.notes');
    Route::post('/media-orders/{mediaOrder}/schedule', [AdminMediaOrderController::class, 'schedule'])->name('media-orders.schedule');
    Route::delete('/media-orders/{mediaOrder}', [AdminMediaOrderController::class, 'destroy'])->name('media-orders.destroy');
});

// Short URL: /74 redirects to /properties/74-123-main-street
Route::get('/{propertyId}', function ($propertyId, \Illuminate\Http\Request $request) {
    $property = \App\Models\Property::findOrFail($propertyId);
    $queryString = $request->getQueryString();
    $url = '/properties/' . $property->slug . ($queryString ? '?' . $queryString : '');
    return redirect()->to($url, 301);
})->where('propertyId', '[0-9]+')->name('property.shorturl');

require __DIR__.'/auth.php';

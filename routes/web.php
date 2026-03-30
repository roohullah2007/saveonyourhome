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
use App\Http\Controllers\Admin\AdminCompanyLogoController;
use App\Http\Controllers\Admin\AdminImportController;
use App\Http\Controllers\Admin\AdminServiceRequestController;
use App\Http\Controllers\ClaimController;
use App\Http\Controllers\BuyerInquiryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\QrCodeController;
use App\Http\Controllers\MediaOrderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// QR Code Short URL Redirect (public, no auth required)
Route::get('/p/{code}', [QrCodeController::class, 'handleScan'])->name('qr.scan');

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

// CSRF token refresh endpoint (for long-lived pages)
Route::get('/csrf-token', function () {
    return response()->json(['token' => csrf_token()]);
})->name('csrf.token');

// Photo upload endpoints (require auth)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/upload-photo', [PropertyController::class, 'uploadPhoto'])->name('upload.photo');
    Route::post('/delete-uploaded-photo', [PropertyController::class, 'deleteUploadedPhoto'])->name('delete.uploaded.photo');
    Route::post('/api/geocode', [PropertyController::class, 'geocodeAddress'])->name('api.geocode');
    Route::post('/api/reverse-geocode', [PropertyController::class, 'reverseGeocodeAddress'])->name('api.reverse-geocode');
});

Route::get('/buyers', function () {
    return Inertia::render('Buyers');
})->name('buyers');

Route::get('/sellers', function () {
    return Inertia::render('Sellers');
})->name('sellers');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/faqs', function () {
    return Inertia::render('FAQs');
})->name('faqs');

Route::get('/mortgages', function () {
    return Inertia::render('Mortgages');
})->name('mortgages');

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
Route::post('/claim/{token}', [ClaimController::class, 'claim'])->name('claim.process')->middleware(['auth', 'verified']);
Route::post('/claim/{token}/register', [ClaimController::class, 'register'])->name('claim.register');

// Property listing routes - require authentication
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/list-property', function () {
        return Inertia::render('ListProperty');
    })->name('list-property');

    Route::post('/properties', [PropertyController::class, 'store'])->name('properties.store');
});

// Buyer inquiry submission route (public)
Route::post('/buyer-inquiry', [BuyerInquiryController::class, 'store'])->name('buyer-inquiry.store');

// Contact form submission route (public)
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Property inquiry submission route (public)
Route::post('/inquiry', [InquiryController::class, 'store'])->name('inquiry.store');

// User Dashboard
Route::middleware(['auth', 'verified'])->prefix('dashboard')->name('dashboard')->group(function () {
    // Dashboard Overview
    Route::get('/', [UserDashboardController::class, 'index']);

    // Listings Management
    Route::get('/listings', [UserDashboardController::class, 'listings'])->name('.listings');
    Route::get('/listings/create', function () {
        return Inertia::render('ListProperty');
    })->name('.listings.create');
    Route::get('/listings/{property}/edit', [UserDashboardController::class, 'editListing'])->name('.listings.edit');
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

    // Favorites
    Route::get('/favorites', [UserDashboardController::class, 'favorites'])->name('.favorites');
    Route::post('/favorites/{property}', [UserDashboardController::class, 'addFavorite'])->name('.favorites.add');
    Route::delete('/favorites/{property}', [UserDashboardController::class, 'removeFavorite'])->name('.favorites.remove');

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

    // Buyer Inquiries Management
    Route::get('/buyer-inquiries', [BuyerInquiryController::class, 'index'])->name('buyer-inquiries.index');
    Route::get('/buyer-inquiries/{inquiry}', [BuyerInquiryController::class, 'show'])->name('buyer-inquiries.show');
    Route::put('/buyer-inquiries/{inquiry}', [BuyerInquiryController::class, 'update'])->name('buyer-inquiries.update');
    Route::delete('/buyer-inquiries/{inquiry}', [BuyerInquiryController::class, 'destroy'])->name('buyer-inquiries.destroy');

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

    // Company Logos Management
    Route::get('/company-logos', [AdminCompanyLogoController::class, 'index'])->name('company-logos.index');
    Route::post('/company-logos', [AdminCompanyLogoController::class, 'store'])->name('company-logos.store');
    Route::put('/company-logos/{companyLogo}', [AdminCompanyLogoController::class, 'update'])->name('company-logos.update');
    Route::delete('/company-logos/{companyLogo}', [AdminCompanyLogoController::class, 'destroy'])->name('company-logos.destroy');
    Route::post('/company-logos/reorder', [AdminCompanyLogoController::class, 'reorder'])->name('company-logos.reorder');

    // Imports Management
    Route::get('/imports', [AdminImportController::class, 'index'])->name('imports.index');
    Route::get('/imports/create', [AdminImportController::class, 'create'])->name('imports.create');
    Route::post('/imports/preview', [AdminImportController::class, 'preview'])->name('imports.preview');
    Route::get('/imports/search-zillow', [AdminImportController::class, 'searchZillow'])->name('imports.search-zillow');
    Route::post('/imports/store-api', [AdminImportController::class, 'storeFromApi'])->name('imports.store-api');
    Route::get('/imports/csv-template', [AdminImportController::class, 'downloadCsvTemplate'])->name('imports.csv-template');
    Route::post('/imports', [AdminImportController::class, 'store'])->name('imports.store');
    Route::get('/imports/{batch}', [AdminImportController::class, 'show'])->name('imports.show');
    Route::post('/imports/{batch}/extend', [AdminImportController::class, 'extendExpiration'])->name('imports.extend');
    Route::delete('/imports/{batch}', [AdminImportController::class, 'destroy'])->name('imports.destroy');
    Route::delete('/imports/property/{property}', [AdminImportController::class, 'destroyProperty'])->name('imports.destroy-property');
    Route::get('/imports/{batch}/letters', [AdminImportController::class, 'generateBatchLetters'])->name('imports.batch-letters');
    Route::get('/imports/property/{property}/letter', [AdminImportController::class, 'generateLetter'])->name('imports.letter');
    Route::get('/imports/property/{property}/qr-code', [AdminImportController::class, 'generateQrCode'])->name('imports.qr-code');
    Route::post('/imports/{batch}/refetch-images', [AdminImportController::class, 'refetchImages'])->name('imports.refetch-images');

    // Service Requests Management
    Route::get('/service-requests', [AdminServiceRequestController::class, 'index'])->name('service-requests.index');
    Route::put('/service-requests/{serviceRequest}/status', [AdminServiceRequestController::class, 'updateStatus'])->name('service-requests.update-status');
    Route::put('/service-requests/{serviceRequest}/note', [AdminServiceRequestController::class, 'addNote'])->name('service-requests.add-note');

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

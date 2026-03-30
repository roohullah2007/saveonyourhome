<?php

namespace App\Http\Controllers;

use App\Models\MediaOrder;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class MediaOrderController extends Controller
{
    /**
     * Display the packages page
     */
    public function index()
    {
        $userListings = [];

        if (Auth::check()) {
            // Get user's approved listings for the dropdown
            $userListings = Auth::user()->properties()
                ->select('id', 'property_title', 'address', 'city', 'state', 'zip_code', 'sqft', 'property_type')
                ->where('approval_status', 'approved')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('Packages', [
            'userListings' => $userListings,
        ]);
    }

    /**
     * Store a new media order
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            // Property Details
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:2',
            'zipCode' => 'required|string|max:10',
            'sqft' => 'required|string',
            'propertyType' => 'required|in:residential,commercial,land',
            'vacant' => 'boolean',
            'lockboxCode' => 'nullable|string|max:50',
            'specialInstructions' => 'nullable|string|max:2000',

            // Photo Package
            'photoPackage' => 'required|in:photos,photosDrone',
            'photoPrice' => 'required|numeric|min:0',

            // Additional Media (JSON string)
            'additionalMedia' => 'nullable|string',
            'additionalMediaPrice' => 'nullable|numeric|min:0',

            // Virtual Twilight
            'virtualTwilightCount' => 'nullable|integer|min:0',
            'virtualTwilightPrice' => 'nullable|numeric|min:0',

            // MLS Options
            'mlsPackage' => 'nullable|in:basic,deluxe',
            'mlsPrice' => 'nullable|numeric|min:0',
            'brokerAssisted' => 'boolean',
            'brokerPackage' => 'nullable|in:standard,unrepresented',
            'mlsSigners' => 'nullable|string',

            // Scheduling
            'preferredDate1' => 'nullable|date|after_or_equal:today',
            'preferredTime1' => 'nullable|in:morning,afternoon,flexible',
            'preferredDate2' => 'nullable|date|after_or_equal:today',
            'preferredTime2' => 'nullable|in:morning,afternoon,flexible',

            // Contact/Account (for guests)
            'firstName' => 'nullable|required_without:user|string|max:100',
            'lastName' => 'nullable|required_without:user|string|max:100',
            'email' => 'nullable|required_without:user|email|max:255',
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|required_without:user|string|min:8',
            'confirmPassword' => 'nullable|same:password',

            // Total
            'totalPrice' => 'required|numeric|min:0',
        ]);

        // Determine user - existing or create new
        $user = Auth::user();

        if (!$user && $request->email) {
            // Check if user already exists with this email
            $existingUser = User::where('email', $request->email)->first();

            if ($existingUser) {
                // User exists but not logged in - associate order with existing user
                $user = $existingUser;
            } else {
                // Create new user account
                $user = User::create([
                    'name' => trim($request->firstName . ' ' . $request->lastName),
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'password' => Hash::make($request->password),
                    'role' => 'seller',
                    'is_active' => true,
                ]);

                // Log them in
                Auth::login($user);
            }
        }

        // Parse JSON fields
        $additionalMedia = json_decode($request->additionalMedia, true) ?? [];
        $mlsSigners = json_decode($request->mlsSigners, true) ?? [];

        // Create the media order
        $mediaOrder = MediaOrder::create([
            // Customer
            'user_id' => $user?->id,
            'first_name' => $validated['firstName'] ?? $user?->name ?? '',
            'last_name' => $validated['lastName'] ?? '',
            'email' => $validated['email'] ?? $user?->email,
            'phone' => $validated['phone'] ?? $user?->phone,

            // Property
            'address' => $validated['address'],
            'city' => $validated['city'],
            'state' => $validated['state'],
            'zip_code' => $validated['zipCode'],
            'sqft_range' => $validated['sqft'],
            'property_type' => $validated['propertyType'],
            'vacant' => $request->boolean('vacant'),
            'lockbox_code' => $validated['lockboxCode'] ?? null,

            // Photo Package
            'photo_package' => $validated['photoPackage'],
            'photo_price' => $validated['photoPrice'],

            // Additional Media
            'additional_media' => $additionalMedia,
            'additional_media_price' => $validated['additionalMediaPrice'] ?? 0,

            // Virtual Twilight
            'virtual_twilight_count' => $validated['virtualTwilightCount'] ?? 0,
            'virtual_twilight_price' => $validated['virtualTwilightPrice'] ?? 0,

            // MLS Options
            'mls_package' => $validated['mlsPackage'] ?? null,
            'mls_price' => $validated['mlsPrice'] ?? 0,
            'broker_assisted' => $request->boolean('brokerAssisted'),
            'broker_package' => $validated['brokerPackage'] ?? null,
            'mls_signers' => $mlsSigners,

            // Scheduling
            'preferred_date_1' => $validated['preferredDate1'] ?? null,
            'preferred_time_1' => $validated['preferredTime1'] ?? null,
            'preferred_date_2' => $validated['preferredDate2'] ?? null,
            'preferred_time_2' => $validated['preferredTime2'] ?? null,
            'special_instructions' => $validated['specialInstructions'] ?? null,

            // Totals
            'total_price' => $validated['totalPrice'],
            'status' => 'pending',
        ]);

        // TODO: Send confirmation email to customer
        // TODO: Send notification to admin

        // Redirect to success page or dashboard
        if ($user) {
            return redirect()->route('dashboard.media-orders')
                ->with('success', 'Your media order has been submitted successfully! We will contact you within 24 hours to confirm your appointment.');
        }

        return redirect()->route('home')
            ->with('success', 'Your media order has been submitted successfully! Check your email for confirmation and next steps.');
    }

    /**
     * Display the user's media orders
     */
    public function userOrders()
    {
        $orders = MediaOrder::where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Dashboard/MediaOrders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show a specific order
     */
    public function show(MediaOrder $mediaOrder)
    {
        // Ensure user can only view their own orders
        if ($mediaOrder->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Dashboard/MediaOrderDetail', [
            'order' => $mediaOrder->load(['user', 'property']),
        ]);
    }

    /**
     * Cancel an order
     */
    public function cancel(MediaOrder $mediaOrder)
    {
        // Ensure user can only cancel their own pending orders
        if ($mediaOrder->user_id !== Auth::id()) {
            abort(403);
        }

        if (!in_array($mediaOrder->status, ['pending', 'confirmed'])) {
            return back()->with('error', 'This order cannot be cancelled.');
        }

        $mediaOrder->update([
            'status' => 'cancelled',
        ]);

        return back()->with('success', 'Your order has been cancelled.');
    }
}

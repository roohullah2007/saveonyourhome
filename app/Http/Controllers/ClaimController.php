<?php

namespace App\Http\Controllers;

use App\Mail\EmailVerificationCode;
use App\Mail\PropertyClaimedToAdmin;
use App\Mail\PropertyClaimedToOwner;
use App\Models\ActivityLog;
use App\Models\Property;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class ClaimController extends Controller
{
    /**
     * Resolve a property by claim token or numeric property ID.
     */
    protected function resolveProperty(string $token): ?Property
    {
        if (ctype_digit($token)) {
            return Property::where('id', $token)
                ->whereNotNull('claim_token')
                ->first();
        }

        return Property::where('claim_token', $token)->first();
    }

    /**
     * Show the claim landing page.
     */
    public function show(string $token)
    {
        $property = $this->resolveProperty($token);

        if (!$property) {
            abort(404);
        }

        // Track claim page view
        $property->increment('claim_view_count');
        $property->update([
            'claim_first_viewed_at' => $property->claim_first_viewed_at ?? now(),
            'claim_last_viewed_at' => now(),
        ]);

        // Already claimed
        if ($property->isClaimed()) {
            return Inertia::render('Claim/AlreadyClaimed', [
                'property' => $this->formatProperty($property),
            ]);
        }

        // Expired
        if ($property->isClaimExpired()) {
            return Inertia::render('Claim/Expired', [
                'property' => $this->formatProperty($property),
            ]);
        }

        return Inertia::render('Claim/Show', [
            'property' => $this->formatProperty($property),
            'token' => $token,
            'isAuthenticated' => Auth::check(),
            'user' => Auth::user() ? [
                'name' => Auth::user()->name,
                'email' => Auth::user()->email,
            ] : null,
        ]);
    }

    /**
     * Claim property (authenticated user).
     */
    public function claim(Request $request, string $token)
    {
        $property = $this->resolveProperty($token);

        if (!$property) {
            abort(404);
        }

        if ($property->isClaimed()) {
            return back()->withErrors(['token' => 'This property has already been claimed.']);
        }

        if ($property->isClaimExpired()) {
            return back()->withErrors(['token' => 'This claim link has expired.']);
        }

        $user = Auth::user();
        $property->claim($user);

        ActivityLog::log('property_claimed', $property, null, null,
            "Property #{$property->id} claimed by {$user->name} ({$user->email})");

        // Send notification emails
        $this->sendClaimEmails($property, $user);

        return redirect()->route('dashboard')
            ->with('success', 'Congratulations! Your property listing is now live on SaveOnYourHome. We\'ll send you FREE QR code stickers!');
    }

    /**
     * Register a new user and claim property.
     */
    public function register(Request $request, string $token)
    {
        $property = $this->resolveProperty($token);

        if (!$property) {
            abort(404);
        }

        if ($property->isClaimed()) {
            return back()->withErrors(['token' => 'This property has already been claimed.']);
        }

        if ($property->isClaimExpired()) {
            return back()->withErrors(['token' => 'This claim link has expired.']);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => 'nullable|string|max:20',
            'sms_consent' => 'nullable|boolean',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'seller',
        ]);

        // Save SMS consent
        if ($request->boolean('sms_consent')) {
            $user->update([
                'sms_consent' => true,
                'sms_consent_at' => now(),
            ]);
        }

        event(new Registered($user));

        // Generate and send verification code
        $code = $user->generateVerificationCode();
        try {
            Mail::to($user->email)->send(new EmailVerificationCode($user, $code));
        } catch (\Exception $e) {
            \Log::error('Failed to send verification code: ' . $e->getMessage());
        }

        Auth::login($user);

        // Claim the property
        $property->claim($user);

        // Update owner phone if provided
        if ($request->phone) {
            $property->update(['contact_phone' => $request->phone]);
        }

        ActivityLog::log('property_claimed_with_registration', $property, null, null,
            "Property #{$property->id} claimed by new user {$user->name} ({$user->email})");

        // Send notification emails
        $this->sendClaimEmails($property, $user);

        return redirect()->route('verification.code')
            ->with('success', 'Account created and property claimed! Please verify your email.');
    }

    protected function sendClaimEmails(Property $property, User $user): void
    {
        if (!EmailService::isEnabled()) {
            return;
        }

        // Send to owner
        if ($user->email) {
            EmailService::sendToUser($user->email, new PropertyClaimedToOwner($property, $user));
        }

        // Delay then send to admin
        sleep(2);
        EmailService::sendToAdmin(new PropertyClaimedToAdmin($property, $user));
    }

    protected function formatProperty(Property $property): array
    {
        return [
            'id' => $property->id,
            'property_title' => $property->property_title,
            'property_type' => $property->property_type,
            'address' => $property->address,
            'city' => $property->city,
            'state' => $property->state,
            'zip_code' => $property->zip_code,
            'price' => $property->price,
            'bedrooms' => $property->bedrooms,
            'bathrooms' => $property->bathrooms,
            'full_bathrooms' => $property->full_bathrooms,
            'half_bathrooms' => $property->half_bathrooms,
            'sqft' => $property->sqft,
            'lot_size' => $property->lot_size,
            'acres' => $property->acres,
            'year_built' => $property->year_built,
            'description' => $property->description,
            'features' => $property->features ?? [],
            'photos' => $property->photos ?? [],
            'subdivision' => $property->subdivision,
            'zoning' => $property->zoning,
            'school_district' => $property->school_district,
            'grade_school' => $property->grade_school,
            'middle_school' => $property->middle_school,
            'high_school' => $property->high_school,
            'latitude' => $property->latitude,
            'longitude' => $property->longitude,
            'owner_name' => $property->owner_name,
            'owner_email' => $property->owner_email,
            'owner_phone' => $property->owner_phone,
        ];
    }
}

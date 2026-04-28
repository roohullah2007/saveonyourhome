<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Property;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Upload or replace the user's profile photo.
     */
    public function updatePhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
        ]);

        $user = $request->user();

        if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        $path = $request->file('photo')->store('avatars/' . $user->id, 'public');

        $user->profile_photo = $path;
        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Remove the user's uploaded profile photo.
     */
    public function destroyPhoto(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        $user->profile_photo = null;
        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     * Transfers all properties to admin before deletion for potential marketing use.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Transfer all user properties to admin before deletion
        $this->transferUserPropertiesToAdmin($user);

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Transfer all user properties to admin account.
     * Preserves sold listings for marketing, soft-deletes others.
     */
    protected function transferUserPropertiesToAdmin(User $user): void
    {
        $adminUser = User::where('role', 'admin')->orderBy('id')->first();

        if (!$adminUser) {
            return;
        }

        // Get all user's properties
        $properties = Property::where('user_id', $user->id)->get();

        foreach ($properties as $property) {
            // Transfer to admin (marking as inactive)
            $property->transferToAdmin($adminUser->id);

            // If it was sold, mark sold_at if not already set
            if ($property->listing_status === Property::STATUS_SOLD && !$property->sold_at) {
                $property->update(['sold_at' => now()]);
            }
        }
    }
}

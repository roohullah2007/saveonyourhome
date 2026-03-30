<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeEmail;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * Redirect to Google OAuth.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback.
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // Check if user already exists
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // Update Google ID if not set
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                    ]);
                }

                Auth::login($user, true);

                return redirect()->intended(route('dashboard'));
            }

            // New user - store Google data in session and redirect to complete signup
            session([
                'google_user' => [
                    'id' => $googleUser->getId(),
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'avatar' => $googleUser->getAvatar(),
                ]
            ]);

            return redirect()->route('auth.google.complete');

        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Unable to login with Google. Please try again.');
        }
    }

    /**
     * Show the complete signup form for new Google users.
     */
    public function showComplete(): Response|RedirectResponse
    {
        $googleUser = session('google_user');

        if (!$googleUser) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/GoogleComplete', [
            'googleUser' => $googleUser,
        ]);
    }

    /**
     * Complete the Google signup with user type selection.
     */
    public function complete(Request $request): RedirectResponse
    {
        $googleUser = session('google_user');

        if (!$googleUser) {
            return redirect()->route('login');
        }

        $request->validate([
            'user_type' => 'required|in:buyer,seller',
        ]);

        // Create new user
        $user = User::create([
            'name' => $googleUser['name'],
            'email' => $googleUser['email'],
            'google_id' => $googleUser['id'],
            'avatar' => $googleUser['avatar'],
            'password' => bcrypt(str()->random(24)), // Random password for Google users
            'role' => $request->user_type,
            'email_verified_at' => now(), // Google emails are verified
        ]);

        // Clear session
        session()->forget('google_user');

        // Send welcome email (don't let email failure break login)
        try {
            $emailNotificationsEnabled = Setting::get('email_notifications', '1') === '1';
            if ($emailNotificationsEnabled) {
                Mail::to($user->email)->send(new WelcomeEmail($user));
            }
        } catch (\Exception $e) {
            // Log error but don't break login flow
            \Log::error('Failed to send welcome email: ' . $e->getMessage());
        }

        Auth::login($user, true);

        return redirect()->intended(route('dashboard'));
    }
}

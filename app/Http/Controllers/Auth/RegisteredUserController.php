<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationCode;
use App\Mail\NewUserRegisteredToAdmin;
use App\Mail\WelcomeEmail;
use App\Models\Setting;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone' => 'nullable|string|max:50',
            'sms_consent' => 'nullable|boolean',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'user_type' => 'required|in:buyer,seller',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $request->user_type,
            'sms_consent' => $request->boolean('sms_consent'),
            'sms_consent_at' => $request->boolean('sms_consent') ? now() : null,
        ]);

        event(new Registered($user));

        // Generate and send verification code
        $code = $user->generateVerificationCode();

        try {
            Mail::to($user->email)->send(new EmailVerificationCode($user, $code));
        } catch (\Exception $e) {
            \Log::error('Failed to send verification code email: ' . $e->getMessage());
        }

        // Send notification to admin about new user registration (with delay)
        sleep(2);
        EmailService::sendToAdmin(new NewUserRegisteredToAdmin($user));

        Auth::login($user);

        // Email verification is optional — drop the user straight onto the
        // dashboard so they can start using the site immediately. A code has
        // already been emailed; they can verify any time from the banner or
        // /email/verify-code if they choose to.
        return redirect()
            ->route('dashboard')
            ->with('success', 'Welcome to SaveOnYourHome! We also emailed you a verification code if you want to verify your email.');
    }

    /**
     * Show the verification code entry page.
     */
    public function showVerifyCode(): Response|RedirectResponse
    {
        $user = Auth::user();

        // If already verified, go to dashboard
        if ($user->email_verified_at) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/VerifyCode', [
            'email' => $user->email,
        ]);
    }

    /**
     * Verify the code entered by the user.
     */
    public function verifyCode(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = Auth::user();

        if ($user->email_verified_at) {
            return redirect()->route('dashboard');
        }

        if (!$user->isVerificationCodeValid($request->code)) {
            return back()->withErrors([
                'code' => 'Invalid or expired verification code. Please try again or request a new code.',
            ]);
        }

        // Mark email as verified
        $user->markEmailAsVerified();

        // Send welcome email after verification
        try {
            $emailNotificationsEnabled = Setting::get('email_notifications', '1') === '1';
            if ($emailNotificationsEnabled) {
                Mail::to($user->email)->send(new WelcomeEmail($user));
            }
        } catch (\Exception $e) {
            \Log::error('Failed to send welcome email: ' . $e->getMessage());
        }

        return redirect()->route('dashboard')->with('success', 'Email verified successfully! Welcome to SaveOnYourHome.');
    }

    /**
     * Resend the verification code.
     */
    public function resendCode(): RedirectResponse
    {
        $user = Auth::user();

        if ($user->email_verified_at) {
            return redirect()->route('dashboard');
        }

        // Generate new code
        $code = $user->generateVerificationCode();

        try {
            Mail::to($user->email)->send(new EmailVerificationCode($user, $code));
        } catch (\Exception $e) {
            \Log::error('Failed to send verification code email: ' . $e->getMessage());
            return back()->withErrors(['code' => 'Failed to send verification code. Please try again.']);
        }

        return back()->with('success', 'A new verification code has been sent to your email.');
    }
}

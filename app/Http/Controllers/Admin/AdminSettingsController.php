<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\ActivityLog;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AdminSettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->groupBy('group');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        // Field-specific validation. Right now we only enforce admin_email
        // is a valid address — silently saving an invalid value here would
        // break every system notification.
        foreach ($validated['settings'] as $settingData) {
            if ($settingData['key'] === 'admin_email' && !empty($settingData['value'])) {
                if (!filter_var($settingData['value'], FILTER_VALIDATE_EMAIL)) {
                    return back()->withErrors([
                        'admin_email' => 'Admin Email must be a valid email address.',
                    ]);
                }
            }
        }

        foreach ($validated['settings'] as $settingData) {
            $setting = Setting::where('key', $settingData['key'])->first();

            if ($setting) {
                $oldValue = $setting->value;
                $setting->update(['value' => $settingData['value']]);

                if ($oldValue !== $settingData['value']) {
                    ActivityLog::log('setting_updated', $setting, ['value' => $oldValue], ['value' => $settingData['value']], "Updated setting: {$setting->key}");
                }
            }
        }

        Setting::clearCache();

        return back()->with('success', 'Settings updated successfully.');
    }

    /**
     * Send a one-shot test email to the configured admin_email so the admin
     * can confirm SMTP is working and the right inbox receives notifications.
     */
    public function sendTestEmail(Request $request)
    {
        $to = EmailService::getAdminEmail();

        if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
            return back()->with('error', 'Admin email is not set or is invalid. Update it and save before sending a test.');
        }

        try {
            Mail::raw(
                "This is a test email from SaveOnYourHome admin settings.\n\n"
                . "If you can read this, system notifications (signups, listings, inquiries, "
                . "service requests, etc.) will be delivered to this inbox.\n\n"
                . "Sent at: " . now()->toDayDateTimeString(),
                function ($message) use ($to) {
                    $message->to($to)->subject('SaveOnYourHome — Admin email test');
                }
            );

            ActivityLog::log('admin_test_email_sent', null, null, ['to' => $to], "Sent admin test email to {$to}");

            return back()->with('success', "Test email sent to {$to}. Check your inbox (and spam folder).");
        } catch (\Throwable $e) {
            Log::error('Admin test email failed: ' . $e->getMessage());
            return back()->with('error', 'Could not send test email: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|unique:settings,key',
            'value' => 'nullable',
            'type' => 'required|in:string,boolean,integer,json',
            'group' => 'required|string',
            'label' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $setting = Setting::create($validated);

        ActivityLog::log('setting_created', $setting, null, $validated, "Created setting: {$setting->key}");

        return back()->with('success', 'Setting created successfully.');
    }

    public function destroy(Setting $setting)
    {
        $settingKey = $setting->key;

        ActivityLog::log('setting_deleted', $setting, $setting->toArray(), null, "Deleted setting: {$settingKey}");

        $setting->delete();
        Setting::clearCache();

        return back()->with('success', 'Setting deleted successfully.');
    }

    /**
     * Initialize default settings
     */
    public function initializeDefaults()
    {
        $defaults = [
            // General Settings
            ['key' => 'site_name', 'value' => 'SAVE ON YOUR HOME', 'type' => 'string', 'group' => 'general', 'label' => 'Site Name'],
            ['key' => 'site_tagline', 'value' => 'For Sale By Owner Real Estate', 'type' => 'string', 'group' => 'general', 'label' => 'Site Tagline'],
            ['key' => 'contact_email', 'value' => 'info@saveonyourhome.com', 'type' => 'string', 'group' => 'general', 'label' => 'Contact Email'],
            ['key' => 'contact_phone', 'value' => '201.696.0291', 'type' => 'string', 'group' => 'general', 'label' => 'Contact Phone'],
            ['key' => 'address', 'value' => '', 'type' => 'string', 'group' => 'general', 'label' => 'Address'],

            // Property Settings
            ['key' => 'require_approval', 'value' => '1', 'type' => 'boolean', 'group' => 'property', 'label' => 'Require Admin Approval'],
            ['key' => 'max_photos', 'value' => '20', 'type' => 'integer', 'group' => 'property', 'label' => 'Max Photos Per Property'],
            ['key' => 'featured_limit', 'value' => '10', 'type' => 'integer', 'group' => 'property', 'label' => 'Featured Properties Limit'],

            // Email Settings
            ['key' => 'email_notifications', 'value' => '1', 'type' => 'boolean', 'group' => 'email', 'label' => 'Enable Email Notifications', 'description' => 'Master switch — when off, no system emails are sent.'],
            ['key' => 'admin_email', 'value' => 'hello@saveonyourhome.com', 'type' => 'string', 'group' => 'email', 'label' => 'Admin Email', 'description' => 'All system notifications (signups, new listings, inquiries, service requests, etc.) are sent to this address. Use the “Send test email” button to verify delivery.'],

            // SEO Settings
            ['key' => 'meta_title', 'value' => 'SaveOnYourHome — For Sale By Owner Real Estate', 'type' => 'string', 'group' => 'seo', 'label' => 'Meta Title'],
            ['key' => 'meta_description', 'value' => 'List and find homes for sale by owner on SaveOnYourHome. No commission fees — direct buyer-seller connection.', 'type' => 'string', 'group' => 'seo', 'label' => 'Meta Description'],

            // Mortgage Calculator defaults — used as starting values for
            // the calculator on every property detail page.
            ['key' => 'mortgage_default_down_payment_pct', 'value' => '20', 'type' => 'string', 'group' => 'mortgage', 'label' => 'Default Down Payment (%)', 'description' => 'Pre-fills the Down Payment percentage on every listing.'],
            ['key' => 'mortgage_default_interest_rate', 'value' => '7.0', 'type' => 'string', 'group' => 'mortgage', 'label' => 'Default Interest Rate (%)', 'description' => 'Pre-fills the Interest Rate (annual APR) on every listing.'],
            ['key' => 'mortgage_default_loan_term_years', 'value' => '30', 'type' => 'integer', 'group' => 'mortgage', 'label' => 'Default Loan Term (Years)', 'description' => 'Pre-fills the Loan Term on every listing.'],
            ['key' => 'mortgage_default_property_tax_rate_pct', 'value' => '1.2', 'type' => 'string', 'group' => 'mortgage', 'label' => 'Default Property Tax Rate (% of price)', 'description' => 'Used to estimate Annual Property Tax when the listing has none on file.'],
            ['key' => 'mortgage_default_annual_home_insurance', 'value' => '1000', 'type' => 'integer', 'group' => 'mortgage', 'label' => 'Default Annual Home Insurance ($)', 'description' => 'Pre-fills Annual Home Insurance on every listing.'],
            ['key' => 'mortgage_default_pmi_pct', 'value' => '0', 'type' => 'string', 'group' => 'mortgage', 'label' => 'Default PMI Rate (%)', 'description' => 'Pre-fills Private Mortgage Insurance percentage on every listing.'],
        ];

        foreach ($defaults as $default) {
            Setting::firstOrCreate(
                ['key' => $default['key']],
                $default
            );
        }

        return back()->with('success', 'Default settings initialized.');
    }
}

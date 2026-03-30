<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
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
            ['key' => 'contact_phone', 'value' => '(555) 123-4567', 'type' => 'string', 'group' => 'general', 'label' => 'Contact Phone'],
            ['key' => 'address', 'value' => 'Oklahoma City, OK', 'type' => 'string', 'group' => 'general', 'label' => 'Address'],

            // Property Settings
            ['key' => 'require_approval', 'value' => '1', 'type' => 'boolean', 'group' => 'property', 'label' => 'Require Admin Approval'],
            ['key' => 'max_photos', 'value' => '20', 'type' => 'integer', 'group' => 'property', 'label' => 'Max Photos Per Property'],
            ['key' => 'featured_limit', 'value' => '10', 'type' => 'integer', 'group' => 'property', 'label' => 'Featured Properties Limit'],

            // Email Settings
            ['key' => 'email_notifications', 'value' => '1', 'type' => 'boolean', 'group' => 'email', 'label' => 'Enable Email Notifications'],
            ['key' => 'admin_email', 'value' => 'hello@saveonyourhome.com', 'type' => 'string', 'group' => 'email', 'label' => 'Admin Email'],

            // SEO Settings
            ['key' => 'meta_title', 'value' => 'SAVE ON YOUR HOME - For Sale By Owner Real Estate in Oklahoma', 'type' => 'string', 'group' => 'seo', 'label' => 'Meta Title'],
            ['key' => 'meta_description', 'value' => 'List and find properties for sale by owner in Oklahoma. No commission fees, direct buyer-seller connection.', 'type' => 'string', 'group' => 'seo', 'label' => 'Meta Description'],
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

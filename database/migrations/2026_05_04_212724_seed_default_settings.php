<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Idempotently seed every default Setting key the app expects.
 *
 * Why a migration: on production "Initialize Defaults" must be clicked
 * once in the admin UI, and that step has been missed before — leaving
 * Settings tabs empty and breaking features that read these keys
 * (admin email recipient, mortgage calc defaults, etc.). Putting the
 * seed in a migration means every deploy that runs `artisan migrate`
 * will backfill any missing defaults without touching admin-set values.
 */
return new class extends Migration
{
    public function up(): void
    {
        $defaults = [
            // General
            ['key' => 'site_name', 'value' => 'SAVE ON YOUR HOME', 'type' => 'string', 'group' => 'general', 'label' => 'Site Name', 'description' => null],
            ['key' => 'site_tagline', 'value' => 'For Sale By Owner Real Estate', 'type' => 'string', 'group' => 'general', 'label' => 'Site Tagline', 'description' => null],
            ['key' => 'contact_email', 'value' => 'info@saveonyourhome.com', 'type' => 'string', 'group' => 'general', 'label' => 'Contact Email', 'description' => null],
            ['key' => 'contact_phone', 'value' => '201.696.0291', 'type' => 'string', 'group' => 'general', 'label' => 'Contact Phone', 'description' => null],
            ['key' => 'address', 'value' => '', 'type' => 'string', 'group' => 'general', 'label' => 'Address', 'description' => null],

            // Property
            ['key' => 'require_approval', 'value' => '1', 'type' => 'boolean', 'group' => 'property', 'label' => 'Require Admin Approval', 'description' => 'When on, new listings stay pending until an admin approves them.'],
            ['key' => 'max_photos', 'value' => '20', 'type' => 'integer', 'group' => 'property', 'label' => 'Max Photos Per Property', 'description' => null],
            ['key' => 'featured_limit', 'value' => '10', 'type' => 'integer', 'group' => 'property', 'label' => 'Featured Properties Limit', 'description' => null],

            // Email
            ['key' => 'email_notifications', 'value' => '1', 'type' => 'boolean', 'group' => 'email', 'label' => 'Enable Email Notifications', 'description' => 'Master switch — when off, no system emails are sent.'],
            ['key' => 'admin_email', 'value' => 'hello@saveonyourhome.com', 'type' => 'string', 'group' => 'email', 'label' => 'Admin Email', 'description' => 'All system notifications (signups, new listings, inquiries, service requests, etc.) are sent to this address. Use the "Send test email" button to verify delivery.'],

            // SEO
            ['key' => 'meta_title', 'value' => 'SaveOnYourHome — For Sale By Owner Real Estate', 'type' => 'string', 'group' => 'seo', 'label' => 'Meta Title', 'description' => null],
            ['key' => 'meta_description', 'value' => 'List and find homes for sale by owner on SaveOnYourHome. No commission fees — direct buyer-seller connection.', 'type' => 'string', 'group' => 'seo', 'label' => 'Meta Description', 'description' => null],

            // Mortgage Calculator defaults
            ['key' => 'mortgage_default_down_payment_pct', 'value' => '20', 'type' => 'string', 'group' => 'mortgage', 'label' => 'Default Down Payment (%)', 'description' => 'Pre-fills the Down Payment percentage on every listing.'],
            ['key' => 'mortgage_default_interest_rate', 'value' => '7.0', 'type' => 'string', 'group' => 'mortgage', 'label' => 'Default Interest Rate (%)', 'description' => 'Pre-fills the Interest Rate (annual APR) on every listing.'],
            ['key' => 'mortgage_default_loan_term_years', 'value' => '30', 'type' => 'integer', 'group' => 'mortgage', 'label' => 'Default Loan Term (Years)', 'description' => 'Pre-fills the Loan Term on every listing.'],
            ['key' => 'mortgage_default_property_tax_rate_pct', 'value' => '1.2', 'type' => 'string', 'group' => 'mortgage', 'label' => 'Default Property Tax Rate (% of price)', 'description' => 'Used to estimate Annual Property Tax when the listing has none on file.'],
            ['key' => 'mortgage_default_annual_home_insurance', 'value' => '1000', 'type' => 'integer', 'group' => 'mortgage', 'label' => 'Default Annual Home Insurance ($)', 'description' => 'Pre-fills Annual Home Insurance on every listing.'],
            ['key' => 'mortgage_default_pmi_pct', 'value' => '0', 'type' => 'string', 'group' => 'mortgage', 'label' => 'Default PMI Rate (%)', 'description' => 'Pre-fills Private Mortgage Insurance percentage on every listing.'],
        ];

        $now = now();
        foreach ($defaults as $row) {
            $existing = DB::table('settings')->where('key', $row['key'])->first();
            if ($existing) {
                // Backfill metadata (label/description/group/type) without
                // overwriting the admin's chosen value.
                DB::table('settings')->where('key', $row['key'])->update([
                    'group' => $row['group'],
                    'type' => $row['type'],
                    'label' => $row['label'],
                    'description' => $row['description'],
                    'updated_at' => $now,
                ]);
            } else {
                DB::table('settings')->insert(array_merge($row, [
                    'created_at' => $now,
                    'updated_at' => $now,
                ]));
            }
        }

        // Bust the per-key cache so the new rows are picked up on the next read.
        if (class_exists(Setting::class) && method_exists(Setting::class, 'clearCache')) {
            Setting::clearCache();
        }
    }

    public function down(): void
    {
        // Intentionally a no-op: rolling back this migration shouldn't
        // wipe an admin's customized settings.
    }
};

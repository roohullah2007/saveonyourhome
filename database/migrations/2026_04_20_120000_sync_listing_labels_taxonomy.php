<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $desired = [
            ['new_listing',       'New Listing',       10],
            ['open_house',        'Open House',        20],
            ['motivated_seller',  'Motivated Seller',  30],
            ['price_reduction',   'Price Reduction',   40],
            ['new_construction',  'New Construction',  50],
            ['auction',           'Auction',           60],
            ['must_sell_by_date', 'Must Sell By Date', 70],
        ];

        // Rename the legacy `price_reduced` key to `price_reduction` so existing
        // listings keep their badge without an orphaned value.
        DB::table('properties')
            ->where('listing_label', 'price_reduced')
            ->update(['listing_label' => 'price_reduction']);

        DB::table('taxonomy_terms')
            ->where('type', 'listing_label')
            ->where('key', 'price_reduced')
            ->delete();

        foreach ($desired as [$key, $label, $sort]) {
            $existing = DB::table('taxonomy_terms')
                ->where('type', 'listing_label')
                ->where('key', $key)
                ->first();

            if ($existing) {
                DB::table('taxonomy_terms')
                    ->where('id', $existing->id)
                    ->update([
                        'label' => $label,
                        'is_active' => true,
                        'sort_order' => $sort,
                        'updated_at' => $now,
                    ]);
            } else {
                DB::table('taxonomy_terms')->insert([
                    'type' => 'listing_label',
                    'key' => $key,
                    'label' => $label,
                    'is_active' => true,
                    'sort_order' => $sort,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        // Retire any labels not in the desired set (e.g. back_on_market).
        $keep = array_column($desired, 0);
        DB::table('taxonomy_terms')
            ->where('type', 'listing_label')
            ->whereNotIn('key', $keep)
            ->update(['is_active' => false, 'updated_at' => $now]);

        \App\Models\TaxonomyTerm::clearCache();
    }

    public function down(): void
    {
        DB::table('taxonomy_terms')
            ->where('type', 'listing_label')
            ->whereIn('key', ['motivated_seller', 'new_construction', 'auction', 'must_sell_by_date'])
            ->delete();

        \App\Models\TaxonomyTerm::clearCache();
    }
};

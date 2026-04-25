<?php

namespace App\Services\Houzez;

use Illuminate\Database\Connection;
use Illuminate\Support\Facades\DB;

/**
 * Thin wrapper around the read-only `wp_legacy` connection. We use literal
 * `wp_*` table names everywhere (the connection's `prefix` is empty) so the
 * SQL we read here matches the dump byte-for-byte.
 */
class HouzezDb
{
    public const CONNECTION = 'wp_legacy';

    public static function conn(): Connection
    {
        return DB::connection(self::CONNECTION);
    }

    public static function table(string $unprefixed): \Illuminate\Database\Query\Builder
    {
        return self::conn()->table('wp_' . $unprefixed);
    }

    /**
     * True if the legacy DB is reachable and has the expected `wp_posts` table.
     */
    public static function isAvailable(): bool
    {
        try {
            self::conn()->getPdo();
            return self::conn()->getSchemaBuilder()->hasTable('wp_posts');
        } catch (\Throwable $e) {
            return false;
        }
    }

    /**
     * Counts of rows we care about — used by the admin import page to confirm
     * the dump loaded correctly before kicking off a long-running import.
     */
    public static function summary(): array
    {
        // Attachments use post_status='inherit' (WordPress default), so we
        // can't filter on post_status here — count by type unconditionally
        // and rely on the importers themselves to skip trashed rows.
        $byType = self::table('posts')
            ->select('post_type', DB::raw('COUNT(*) as n'))
            ->whereNotIn('post_status', ['trash', 'auto-draft'])
            ->groupBy('post_type')
            ->pluck('n', 'post_type')
            ->toArray();

        return [
            'users' => (int) self::table('users')->count(),
            'properties' => (int) ($byType['property'] ?? 0),
            'posts' => (int) ($byType['post'] ?? 0),
            'attachments' => (int) ($byType['attachment'] ?? 0),
            'agents' => (int) ($byType['houzez_agent'] ?? 0),
            'taxonomies' => (int) self::table('term_taxonomy')
                ->whereIn('taxonomy', [
                    'property_status', 'property_type', 'property_city', 'property_state',
                    'property_country', 'property_area', 'property_feature', 'property_label',
                    'category', 'post_tag',
                ])
                ->count(),
        ];
    }
}

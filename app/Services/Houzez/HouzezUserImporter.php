<?php

namespace App\Services\Houzez;

use App\Models\User;
use Illuminate\Support\Str;

/**
 * Imports rows from `wp_users` + `wp_usermeta` into the Laravel `users` table.
 *
 * - `wp_capabilities` is a serialized array — we read the first key to decide
 *   the Laravel role (administrator → admin, houzez_seller → seller,
 *   houzez_agent → agent, anything else → buyer).
 * - WP password hashes are wp_phpass / `$wp$2y$10$...` style. Laravel can't
 *   verify them, so we store a random password and force users to reset on
 *   first login. `wp_id` keeps the migration idempotent.
 * - Houzez agent contact fields (`fave_author_phone`, `fave_author_mobile`,
 *   address, city, state, zip) are pulled into the matching User columns.
 */
class HouzezUserImporter
{
    private const ROLE_MAP = [
        'administrator' => 'admin',
        'editor' => 'admin',
        'houzez_admin' => 'admin',
        'houzez_agent' => 'agent',
        'houzez_agency' => 'agent',
        'houzez_seller' => 'seller',
        'author' => 'seller',
        'subscriber' => 'buyer',
        'contributor' => 'buyer',
    ];

    /** @return array{imported:int, updated:int, skipped:int, user_map:array<int,int>} */
    public function run(): array
    {
        $imported = 0;
        $updated = 0;
        $skipped = 0;
        $userMap = [];

        $wpUsers = HouzezDb::table('users')->orderBy('ID')->get();

        foreach ($wpUsers as $wp) {
            $email = trim((string) $wp->user_email);
            if ($email === '') { $skipped++; continue; }

            $meta = $this->loadMeta((int) $wp->ID);
            $role = $this->resolveRole($meta['wp_capabilities'] ?? null);
            $name = $this->resolveName($wp, $meta);

            // Lookup by wp_id first (idempotent re-runs), fall back to email.
            $user = User::where('wp_id', $wp->ID)->first()
                ?? User::where('email', $email)->first()
                ?? new User();

            $isNew = !$user->exists;

            // Only assign fields that have a value — `users.state` is
            // NOT NULL with a "Oklahoma" default and we want the DB default
            // to kick in for legacy users who never filled in their address.
            $payload = array_filter([
                'name' => $name,
                'email' => $email,
                'role' => $role,
                'is_active' => true,
                'phone' => $this->firstNonEmpty($meta, ['fave_author_mobile', 'fave_author_phone', 'fave_agent_mobile']),
                'address' => $this->firstNonEmpty($meta, ['fave_author_address', 'fave_author_address_2', 'fave_agent_address']),
                'city' => $meta['fave_author_city'] ?? null,
                'state' => $meta['fave_author_state'] ?? null,
                'zip_code' => $meta['fave_author_zip_code'] ?? null,
            ], fn ($v) => $v !== null && $v !== '');
            $user->fill($payload);
            $user->wp_id = $user->wp_id ?: (int) $wp->ID;

            // Only set a placeholder password on creation — never overwrite an
            // existing Laravel password, since they may have already reset it.
            if ($isNew) {
                $user->password = bcrypt(Str::random(32));
                if (!empty($wp->user_registered)) {
                    $user->created_at = $wp->user_registered;
                }
            }

            $user->save();
            $userMap[(int) $wp->ID] = $user->id;
            $isNew ? $imported++ : $updated++;
        }

        return compact('imported', 'updated', 'skipped', 'userMap') + ['user_map' => $userMap];
    }

    private function loadMeta(int $userId): array
    {
        $rows = HouzezDb::table('usermeta')
            ->where('user_id', $userId)
            ->get(['meta_key', 'meta_value']);

        $out = [];
        foreach ($rows as $r) {
            $out[$r->meta_key] = $r->meta_value;
        }
        return $out;
    }

    private function resolveRole(?string $capsSerialized): string
    {
        $caps = PhpSerialized::decode($capsSerialized);
        if (!is_array($caps)) return 'buyer';

        // First truthy key wins; check in priority order.
        foreach (self::ROLE_MAP as $wpRole => $laravelRole) {
            if (!empty($caps[$wpRole])) return $laravelRole;
        }
        return 'buyer';
    }

    private function resolveName(object $wp, array $meta): string
    {
        $first = trim((string) ($meta['first_name'] ?? ''));
        $last = trim((string) ($meta['last_name'] ?? ''));
        $full = trim($first . ' ' . $last);
        if ($full !== '') return $full;
        $display = trim((string) ($wp->display_name ?? ''));
        if ($display !== '') return $display;
        return trim((string) ($wp->user_login ?? 'User'));
    }

    private function firstNonEmpty(array $meta, array $keys): ?string
    {
        foreach ($keys as $k) {
            if (!empty($meta[$k]) && trim((string) $meta[$k]) !== '') {
                return trim((string) $meta[$k]);
            }
        }
        return null;
    }
}

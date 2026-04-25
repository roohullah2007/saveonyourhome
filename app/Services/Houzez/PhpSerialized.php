<?php

namespace App\Services\Houzez;

/**
 * Tiny helper around PHP's serialize/unserialize. Houzez stores
 * `wp_capabilities`, `floor_plans`, `additional_features`, attachment metadata,
 * etc. as serialized PHP arrays — `unserialize` triggers PHP warnings on
 * malformed input, which we want to silence and treat as "no data".
 */
class PhpSerialized
{
    public static function isSerialized(?string $value): bool
    {
        if (!is_string($value) || $value === '') return false;
        return (bool) preg_match('/^[adObis]:|^N;/', $value);
    }

    public static function decode(?string $value): mixed
    {
        if (!self::isSerialized($value)) return null;
        try {
            $out = @unserialize($value, ['allowed_classes' => false]);
            return $out === false && $value !== 'b:0;' ? null : $out;
        } catch (\Throwable $e) {
            return null;
        }
    }

    /** Decode if serialized; otherwise return the raw value untouched. */
    public static function decodeOrRaw(?string $value): mixed
    {
        return self::isSerialized($value) ? self::decode($value) : $value;
    }
}

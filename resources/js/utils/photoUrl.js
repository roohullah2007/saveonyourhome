/**
 * Turn a stored photo path into something <img src=…> can actually load.
 *
 * The DB stores property photos as either:
 *   • absolute http(s) URLs (legacy / CDN-hosted)
 *   • leading-slash paths (already public, e.g. /storage/…)
 *   • bare storage keys (e.g. "properties/abc.webp") which need the
 *     /storage/ prefix so Laravel's symlinked public disk serves them
 *
 * Without this normalization, a bare key resolves *relative to the
 * current page URL* — every property page tries to load
 * /properties/{slug}/properties/abc.webp and 404s.
 */
export function resolvePhotoUrl(p, fallback = '/images/property-placeholder.svg') {
    if (!p) return fallback;
    if (typeof p !== 'string') return fallback;
    if (/^https?:\/\//i.test(p)) return p;
    if (p.startsWith('/')) return p;
    return `/storage/${p}`;
}

export default resolvePhotoUrl;

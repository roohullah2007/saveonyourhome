import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { Search, Trash2, ArrowRight, Clock, Bell, BellOff } from 'lucide-react';

function summarizeFilters(filters = {}) {
    const bits = [];
    if (filters.keyword) bits.push(`"${filters.keyword}"`);
    if (filters.city) bits.push(filters.city);
    if (filters.propertyType) bits.push(filters.propertyType);
    if (filters.minPrice || filters.maxPrice) {
        const a = filters.minPrice ? `$${Number(filters.minPrice).toLocaleString()}` : '';
        const b = filters.maxPrice ? `$${Number(filters.maxPrice).toLocaleString()}` : '';
        bits.push([a, b].filter(Boolean).join(' – '));
    }
    if (filters.beds) bits.push(`${filters.beds}+ beds`);
    if (filters.baths) bits.push(`${filters.baths}+ baths`);
    if (filters.status && filters.status !== 'for-sale') bits.push(filters.status.replace('-', ' '));
    if (Array.isArray(filters.amenities) && filters.amenities.length) bits.push(`${filters.amenities.length} amenities`);
    return bits.length ? bits.join(' · ') : 'All listings';
}

function buildUrl(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
        if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) return;
        if (Array.isArray(v)) {
            v.forEach((item) => params.append(`${k}[]`, item));
        } else {
            params.set(k, String(v));
        }
    });
    const qs = params.toString();
    return '/properties' + (qs ? `?${qs}` : '');
}

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SavedSearches({ savedSearches = [] }) {
    const remove = (search) => {
        if (!confirm(`Remove "${search.name}"?`)) return;
        router.delete(route('dashboard.saved-searches.destroy', search.id), { preserveScroll: true });
    };

    const toggleAlerts = (search) => {
        router.put(route('dashboard.saved-searches.update', search.id), {
            alerts_enabled: !search.alerts_enabled,
        }, { preserveScroll: true });
    };

    return (
        <UserDashboardLayout title="Saved Searches">
            <Head title="Saved Searches" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Saved Searches</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Searches you've saved while browsing properties. Rerun them anytime to see new matches.
                    </p>
                </div>
                <Link
                    href="/properties"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1A1816] text-white px-4 py-2 text-sm font-semibold hover:opacity-90"
                >
                    <Search className="w-4 h-4" />
                    Browse & save a new search
                </Link>
            </div>

            {savedSearches.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
                    <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <h2 className="text-lg font-semibold text-gray-900">No saved searches yet</h2>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                        Head to the Properties page, apply some filters, then hit <strong>Save this search</strong> to keep them for later.
                    </p>
                    <Link href="/properties" className="inline-flex items-center gap-2 rounded-lg bg-[#3355FF] text-white px-4 py-2 text-sm font-semibold hover:opacity-90">
                        Go to Properties
                    </Link>
                </div>
            ) : (
                <ul className="space-y-3">
                    {savedSearches.map((s) => (
                        <li key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                <div className="w-11 h-11 bg-[#3355FF]/10 rounded-xl flex items-center justify-center text-[#3355FF] shrink-0">
                                    <Search className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 truncate">{s.name}</div>
                                    <div className="text-sm text-gray-500 truncate">{summarizeFilters(s.filters)}</div>
                                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> saved {formatDate(s.created_at)}</span>
                                        {s.alerts_enabled && s.last_alerted_at && (
                                            <span className="text-green-600">· last alert sent {formatDate(s.last_alerted_at)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => toggleAlerts(s)}
                                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                                        s.alerts_enabled
                                            ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                    title={s.alerts_enabled ? 'Turn off email alerts' : 'Turn on email alerts for new matches'}
                                >
                                    {s.alerts_enabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                                    {s.alerts_enabled ? 'Alerts on' : 'Alerts off'}
                                </button>
                                <Link
                                    href={buildUrl(s.filters)}
                                    className="inline-flex items-center gap-1 rounded-lg bg-[#1A1816] text-white px-4 py-2 text-sm font-semibold hover:opacity-90"
                                >
                                    Run <ArrowRight className="w-4 h-4" />
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => remove(s)}
                                    className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                                    aria-label="Remove"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </UserDashboardLayout>
    );
}

SavedSearches.layout = (page) => page;

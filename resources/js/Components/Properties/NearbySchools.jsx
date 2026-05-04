import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GraduationCap, MapPin, Star, Loader2 } from 'lucide-react';

function Stars({ value }) {
    if (value == null) return null;
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    return (
        <span className="inline-flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => {
                const filled = i < full || (i === full && half);
                return (
                    <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${filled ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-gray-300'}`}
                        strokeWidth={1.5}
                    />
                );
            })}
        </span>
    );
}

function formatDistance(meters) {
    if (meters == null) return null;
    const miles = meters / 1609.344;
    if (miles < 0.1) return `${meters} m`;
    if (miles < 10) return `${miles.toFixed(1)} mi`;
    return `${Math.round(miles)} mi`;
}

export default function NearbySchools({ propertyId }) {
    const [items, setItems] = useState(null);
    const [source, setSource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!propertyId) return;
        let cancelled = false;
        setLoading(true);
        axios.get(`/api/properties/${propertyId}/schools`)
            .then((res) => {
                if (cancelled) return;
                setItems(Array.isArray(res.data?.items) ? res.data.items : []);
                setSource(res.data?.source || null);
            })
            .catch(() => { if (!cancelled) setError(true); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [propertyId]);

    if (error) return null;
    if (!loading && (!items || items.length === 0)) return null;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-5 h-5 text-[#0F172A]" strokeWidth={2} />
                    <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Schools Nearby</h2>
                </div>
                <span className="text-xs text-[#6B7280]">
                    Within 10 km · {source === 'google' ? 'Google' : source === 'osm' ? 'OpenStreetMap' : ''}
                </span>
            </div>

            {loading && (
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading nearby schools…
                </div>
            )}

            {!loading && items && items.length > 0 && (
                <ul className="divide-y divide-gray-100">
                    {items.map((s) => {
                        const dist = formatDistance(s.meters);
                        return (
                            <li key={s.id || s.name} className="py-3 flex flex-wrap items-start gap-x-4 gap-y-1">
                                <div className="flex-1 min-w-0">
                                    {s.maps_url ? (
                                        <a
                                            href={s.maps_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-[#0F172A] hover:underline"
                                        >
                                            {s.name}
                                        </a>
                                    ) : (
                                        <span className="font-semibold text-[#0F172A]">{s.name}</span>
                                    )}
                                    {s.address && (
                                        <p className="text-sm text-[#6B7280] flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-3.5 h-3.5" /> {s.address}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                                    {s.rating != null && (
                                        <span className="flex items-center gap-1.5">
                                            <Stars value={s.rating} />
                                            <span>{s.rating.toFixed(1)}</span>
                                        </span>
                                    )}
                                    {dist && <span className="whitespace-nowrap">{dist}</span>}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GraduationCap, BriefcaseMedical, Utensils, ShoppingBasket, ShoppingBag, Trees, Star, Loader2 } from 'lucide-react';

const ICON_MAP = {
  'graduation-cap': GraduationCap,
  'briefcase-medical': BriefcaseMedical,
  'utensils': Utensils,
  'shopping-basket': ShoppingBasket,
  'shopping-bag': ShoppingBag,
  'tree': Trees,
};

function ratingLabel(r) {
  if (r == null) return null;
  if (r >= 4.5) return 'EXCEPTIONAL';
  if (r >= 4.0) return 'GREAT';
  if (r >= 3.5) return 'GOOD';
  return null;
}

function Stars({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const cells = Array.from({ length: 5 }, (_, i) => {
    const filled = i < full || (i === full && half);
    return (
      <Star key={i} className={`w-3.5 h-3.5 ${filled ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-gray-300'}`} strokeWidth={1.5} />
    );
  });
  return <div className="inline-flex items-center gap-0.5">{cells}</div>;
}

export default function NearbySection({ propertyId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;
    setLoading(true);
    axios.get(`/api/properties/${propertyId}/nearby`)
      .then((res) => { if (!cancelled) setData(res.data?.categories || null); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [propertyId]);

  if (error) return null;

  // Only render groups that actually have results, preserving server order.
  const groups = data
    ? Object.entries(data).filter(([, v]) => v && Array.isArray(v.items) && v.items.length > 0)
    : [];

  if (!loading && groups.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">What's Nearby?</h2>
        <span className="text-xs text-[#6B7280]">
          Powered by <span className="font-semibold text-[#D32323]">Yelp</span>
        </span>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading nearby businesses…
        </div>
      )}

      <div className="space-y-8">
        {groups.map(([key, group]) => {
          const Icon = ICON_MAP[group.icon] || GraduationCap;
          return (
            <div key={key}>
              <div className="flex items-center gap-2.5 mb-4">
                <Icon className="w-5 h-5 text-[#0F172A]" strokeWidth={2} />
                <h3 className="text-base font-bold text-[#0F172A]">{group.label}</h3>
              </div>
              <ul className="space-y-3">
                {group.items.map((b) => {
                  const label = ratingLabel(b.rating);
                  return (
                    <li key={b.id || b.name} className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <div className="flex-1 min-w-0">
                        {b.url ? (
                          <a href={b.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0F172A] hover:underline">{b.name}</a>
                        ) : (
                          <span className="font-semibold text-[#0F172A]">{b.name}</span>
                        )}
                        {b.miles != null && (
                          <span className="text-[#6B7280] text-sm ml-2">({b.miles.toFixed(2)} mi)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {b.rating ? <Stars value={b.rating} /> : null}
                        {label && (
                          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-[#10B981] text-white rounded-sm">
                            {label}
                          </span>
                        )}
                        <span className="text-[#6B7280] whitespace-nowrap">{b.review_count || 0} reviews</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

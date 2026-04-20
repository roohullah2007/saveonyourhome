import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

function ScoreBadge({ score, kind }) {
  // Walkscore bucket colors — rough match to the official palette.
  const palette = (s) => {
    if (s == null) return { bg: '#E5E7EB', fg: '#374151' };
    if (s >= 90) return { bg: '#16A34A', fg: '#FFFFFF' };
    if (s >= 70) return { bg: '#65A30D', fg: '#FFFFFF' };
    if (s >= 50) return { bg: '#CCE3F6', fg: '#075985' };
    if (s >= 25) return { bg: '#FED7AA', fg: '#9A3412' };
    return { bg: '#FECACA', fg: '#991B1B' };
  };
  const { bg, fg } = palette(score);
  const label = kind === 'bike' ? 'Bike Score' : kind === 'transit' ? 'Transit' : 'Walk Score';
  return (
    <div className="relative w-[92px] h-[88px] flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: bg, color: fg, borderRadius: '14px' }}>
      <div className="text-center leading-tight">
        <div className="text-[10px] font-semibold uppercase tracking-wide">{label}</div>
        <div className="text-[30px] font-bold">{score ?? '–'}</div>
      </div>
    </div>
  );
}

export default function WalkscoreSection({ propertyId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;
    setLoading(true);
    axios.get(`/api/properties/${propertyId}/walkscore`)
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [propertyId]);

  if (error && !loading) return null;
  if (!loading && (!data || (data.walk?.score == null && data.bike?.score == null))) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6 md:p-8">
      <h2 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2">Walkscore</h2>
      {data?.address && (
        <p className="text-base text-[#0F172A] mb-6">{data.address}</p>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading Walkscore…
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {data.walk?.score != null && (
            <div className="flex items-center gap-5">
              <ScoreBadge score={data.walk.score} kind="walk" />
              <div>
                <div className="text-lg font-semibold text-[#0F172A]">{data.walk.description || 'Walk Score'}</div>
                <p className="text-sm text-[#6B7280]">Some errands can be accomplished on foot</p>
              </div>
            </div>
          )}
          {data.bike?.score != null && (
            <div className="flex items-center gap-5">
              <ScoreBadge score={data.bike.score} kind="bike" />
              <div>
                <div className="text-lg font-semibold text-[#0F172A]">{data.bike.description || 'Bike Score'}</div>
                <p className="text-sm text-[#6B7280]">Some bike infrastructure</p>
              </div>
            </div>
          )}
          {data.transit?.score != null && (
            <div className="flex items-center gap-5">
              <ScoreBadge score={data.transit.score} kind="transit" />
              <div>
                <div className="text-lg font-semibold text-[#0F172A]">{data.transit.description || 'Transit Score'}</div>
                {data.transit.summary && <p className="text-sm text-[#6B7280]">{data.transit.summary}</p>}
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-[#9CA3AF] mt-6">
        Scores powered by <a href="https://www.walkscore.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Walk Score</a>.
      </p>
    </div>
  );
}

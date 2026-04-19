import React, { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import {
  Plus, Trash2, Copy, X, Phone, MapPin, Clock, Calendar, Check, Info,
  RefreshCw, Link2, Download, Upload, AlertCircle, ExternalLink, Loader2,
} from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];
const DURATION_LABELS = { 15: '15 min', 30: '30 min', 45: '45 min', 60: '1 hr', 90: '1.5 hr', 120: '2 hr' };

const trimTime = (t) => (t || '').substring(0, 5);

// Reusable control styles — kept consistent across the page
const SELECT_CLS = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3355FF]/20 focus:border-[#3355FF] transition-colors appearance-none pr-9 bg-no-repeat bg-[right_10px_center]';
const SELECT_STYLE = { backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` };
const TIME_CLS = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3355FF]/20 focus:border-[#3355FF] transition-colors w-[130px]';
const INPUT_CLS = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3355FF]/20 focus:border-[#3355FF] transition-colors';

// iOS-style toggle — explicit inline sizing avoids flex-stretch issues.
const Toggle = ({ checked, onChange, label }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-label={label}
      aria-pressed={checked}
      className="relative inline-block shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#3355FF]/30"
      style={{
        width: '44px',
        height: '24px',
        minWidth: '44px',
        backgroundColor: checked ? '#3355FF' : '#d1d5db',
      }}
    >
      <span
        className="absolute bg-white rounded-full shadow-sm"
        style={{
          width: '20px',
          height: '20px',
          top: '2px',
          left: '2px',
          transform: checked ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform 0.18s ease',
        }}
      />
    </button>
  );
};

const Checkbox = ({ checked, onChange, children }) => (
  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
    <span
      className={`relative inline-flex h-4 w-4 items-center justify-center rounded border transition-colors ${checked ? 'bg-[#3355FF] border-[#3355FF]' : 'bg-white border-gray-300'}`}
    >
      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
    </span>
    <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    {children}
  </label>
);

export default function Availability({ rules = [], externalCalendars = [], feedUrl, webcalUrl }) {
  // Group server rules by day-of-week
  const grouped = useMemo(() => {
    const g = Array.from({ length: 7 }, () => []);
    rules.forEach((r) => {
      g[r.day_of_week].push({
        id: r.id,
        day_of_week: r.day_of_week,
        start_time: trimTime(r.start_time),
        end_time: trimTime(r.end_time),
        slot_duration_minutes: r.slot_duration_minutes,
        allow_phone: !!r.allow_phone,
        allow_in_person: !!r.allow_in_person,
        is_active: !!r.is_active,
      });
    });
    g.forEach((arr) => arr.sort((a, b) => a.start_time.localeCompare(b.start_time)));
    return g;
  }, [rules]);

  const firstRule = rules[0];
  const [defaults, setDefaults] = useState({
    slot_duration_minutes: firstRule?.slot_duration_minutes ?? 30,
    allow_phone: firstRule ? !!firstRule.allow_phone : true,
    allow_in_person: firstRule ? !!firstRule.allow_in_person : true,
  });

  const [copyFromDow, setCopyFromDow] = useState(null);
  const [copyTargets, setCopyTargets] = useState([]);
  const [showAddCalendar, setShowAddCalendar] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const reload = { preserveScroll: true, preserveState: true, only: ['rules', 'externalCalendars', 'feedUrl', 'webcalUrl'] };

  const addRange = (dow) => {
    router.post(route('dashboard.availability.store'), {
      day_of_week: dow,
      start_time: '09:00',
      end_time: '17:00',
      slot_duration_minutes: defaults.slot_duration_minutes,
      allow_phone: defaults.allow_phone,
      allow_in_person: defaults.allow_in_person,
      is_active: true,
    }, reload);
  };

  const deleteRange = (rule) => {
    router.delete(route('dashboard.availability.destroy', rule.id), reload);
  };

  const updateRange = (rule, patch) => {
    router.put(route('dashboard.availability.update', rule.id), {
      day_of_week: rule.day_of_week,
      start_time: rule.start_time,
      end_time: rule.end_time,
      slot_duration_minutes: rule.slot_duration_minutes,
      allow_phone: !!rule.allow_phone,
      allow_in_person: !!rule.allow_in_person,
      is_active: !!rule.is_active,
      ...patch,
    }, reload);
  };

  const toggleDay = (dow) => {
    const rangesOn = grouped[dow];
    if (rangesOn.length === 0) { addRange(dow); return; }
    const newActive = !rangesOn.some((r) => r.is_active);
    rangesOn.forEach((r) => updateRange(r, { is_active: newActive }));
  };

  const copyRangesTo = () => {
    if (copyFromDow === null || copyTargets.length === 0) return;
    const source = grouped[copyFromDow];
    if (source.length === 0) return;
    copyTargets.forEach((dow) => {
      grouped[dow].forEach((r) => router.delete(route('dashboard.availability.destroy', r.id), reload));
      source.forEach((s) => router.post(route('dashboard.availability.store'), {
        day_of_week: dow,
        start_time: s.start_time,
        end_time: s.end_time,
        slot_duration_minutes: s.slot_duration_minutes,
        allow_phone: s.allow_phone,
        allow_in_person: s.allow_in_person,
        is_active: s.is_active,
      }, reload));
    });
    setCopyFromDow(null);
    setCopyTargets([]);
  };

  const applyDefaultsToAll = () => {
    if (!confirm('Apply the current meeting defaults (duration + phone/in-person) to every existing time block?')) return;
    rules.forEach((r) => updateRange({
      day_of_week: r.day_of_week,
      start_time: trimTime(r.start_time),
      end_time: trimTime(r.end_time),
      slot_duration_minutes: r.slot_duration_minutes,
      allow_phone: r.allow_phone,
      allow_in_person: r.allow_in_person,
      is_active: r.is_active,
    }, {
      slot_duration_minutes: defaults.slot_duration_minutes,
      allow_phone: defaults.allow_phone,
      allow_in_person: defaults.allow_in_person,
    }));
  };

  const copyFeed = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopiedMsg('Copied!');
      setTimeout(() => setCopiedMsg(''), 2000);
    } catch (e) {
      setCopiedMsg('Copy failed');
    }
  };

  const regenerateFeed = () => {
    if (!confirm('Generate a new calendar URL? Any calendars subscribed to the old link will stop updating.')) return;
    router.post(route('dashboard.calendar-feed.regenerate'), {}, reload);
  };

  const syncCalendar = (cal) => router.post(route('dashboard.calendars.sync', cal.id), {}, reload);
  const removeCalendar = (cal) => {
    if (!confirm(`Remove "${cal.label}"? Bookings on its busy times will become available again.`)) return;
    router.delete(route('dashboard.calendars.destroy', cal.id), reload);
  };

  const addCalForm = useForm({ label: '', ics_url: '' });
  const submitAddCalendar = (e) => {
    e.preventDefault();
    addCalForm.post(route('dashboard.calendars.store'), {
      ...reload,
      onSuccess: () => { addCalForm.reset(); setShowAddCalendar(false); },
    });
  };

  const totalRanges = rules.length;
  const activeDays = grouped.filter((arr) => arr.some((r) => r.is_active)).length;
  const totalHours = grouped.reduce((acc, arr) =>
    acc + arr.filter((r) => r.is_active).reduce((s, r) => {
      const [sh, sm] = r.start_time.split(':').map(Number);
      const [eh, em] = r.end_time.split(':').map(Number);
      return s + ((eh * 60 + em) - (sh * 60 + sm)) / 60;
    }, 0),
  0);

  return (
    <>
      <Head title="Availability" />
      <div className="pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          <p className="text-gray-500 text-sm mt-1">
            Set the hours buyers can book phone calls or in-person showings with you over the next 30 days.
          </p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Calendar, value: activeDays, label: 'Active days / week' },
            { icon: Clock, value: totalHours.toFixed(1), label: 'Bookable hours / week' },
            { icon: Plus, value: totalRanges, label: 'Time blocks' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl bg-white border border-gray-200 p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF1FF]">
                <s.icon className="w-5 h-5" style={{ color: '#3355FF' }} />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Meeting defaults */}
        <div className="rounded-xl bg-white border border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-gray-500" />
            <h2 className="font-bold text-gray-900">Meeting defaults</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            These apply to new time blocks. They don't retro-fit existing blocks unless you click "Apply to all".
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-end gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Slot length</label>
              <select
                value={defaults.slot_duration_minutes}
                onChange={(e) => setDefaults({ ...defaults, slot_duration_minutes: parseInt(e.target.value) })}
                className={SELECT_CLS + ' min-w-[140px]'}
                style={SELECT_STYLE}
              >
                {DURATION_OPTIONS.map((d) => <option key={d} value={d}>{DURATION_LABELS[d]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Meeting types</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDefaults({ ...defaults, allow_phone: !defaults.allow_phone })}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${defaults.allow_phone ? 'border-[#3355FF] bg-[#EEF1FF] text-[#1a1816]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  <Phone className={`w-4 h-4 ${defaults.allow_phone ? 'text-emerald-600' : 'text-gray-400'}`} /> Phone
                </button>
                <button
                  type="button"
                  onClick={() => setDefaults({ ...defaults, allow_in_person: !defaults.allow_in_person })}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${defaults.allow_in_person ? 'border-[#3355FF] bg-[#EEF1FF] text-[#1a1816]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  <MapPin className={`w-4 h-4 ${defaults.allow_in_person ? 'text-[#3355FF]' : 'text-gray-400'}`} /> In-person
                </button>
              </div>
            </div>
            {rules.length > 0 && (
              <button
                onClick={applyDefaultsToAll}
                className="sm:ml-auto inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Check className="w-4 h-4" /> Apply to all existing blocks
              </button>
            )}
          </div>
        </div>

        {/* Weekly hours */}
        <div className="rounded-xl bg-white border border-gray-200 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Weekly hours</h2>
            <p className="text-sm text-gray-500 mt-0.5">Toggle a day on or off. Use the copy icon to replicate a day's schedule onto others.</p>
          </div>

          <div className="divide-y divide-gray-100">
            {DAYS.map((day, dow) => {
              const ranges = grouped[dow];
              const hasRanges = ranges.length > 0;
              const isActive = ranges.some((r) => r.is_active);
              return (
                <div key={dow} className="px-5 py-4">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Day + toggle */}
                    <div className="flex items-center gap-3 lg:w-44 shrink-0 lg:pt-1.5">
                      <Toggle
                        checked={isActive && hasRanges}
                        onChange={() => toggleDay(dow)}
                        label={`Toggle ${day}`}
                      />
                      <span className={`font-semibold ${isActive && hasRanges ? 'text-gray-900' : 'text-gray-400'}`}>
                        {day}
                      </span>
                    </div>

                    {/* Ranges */}
                    <div className="flex-1 min-w-0">
                      {!hasRanges ? (
                        <div className="text-sm text-gray-400 italic lg:pt-2">Unavailable</div>
                      ) : (
                        <div className="space-y-2">
                          {ranges.map((r) => (
                            <div key={r.id} className="flex flex-wrap items-center gap-2">
                              <input
                                type="time"
                                value={r.start_time}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  if (v && v !== r.start_time) updateRange(r, { start_time: v });
                                }}
                                className={TIME_CLS}
                              />
                              <span className="text-gray-400">—</span>
                              <input
                                type="time"
                                value={r.end_time}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  if (v && v !== r.end_time && v > r.start_time) updateRange(r, { end_time: v });
                                }}
                                className={TIME_CLS}
                              />
                              <span className="inline-flex items-center gap-2 ml-2 text-xs text-gray-500">
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-gray-700">{DURATION_LABELS[r.slot_duration_minutes] || `${r.slot_duration_minutes}m`}</span>
                                {r.allow_phone && <span className="inline-flex items-center gap-1 text-emerald-700"><Phone className="w-3 h-3" />Phone</span>}
                                {r.allow_in_person && <span className="inline-flex items-center gap-1 text-[#3355FF]"><MapPin className="w-3 h-3" />In-person</span>}
                              </span>
                              <button
                                onClick={() => deleteRange(r)}
                                className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                                aria-label="Remove range"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => addRange(dow)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        title="Add time block"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      {hasRanges && (
                        <button
                          onClick={() => { setCopyFromDow(dow); setCopyTargets([]); }}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                          title="Copy times to other days"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar sync */}
        <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Sync with your calendar</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Share your booked showings with Google/Outlook/Apple Calendar, and import your busy times so buyers can't double-book you.
            </p>
          </div>

          {/* Export — feed URL */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 shrink-0">
                <Download className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900">Export to your calendar</div>
                <p className="text-sm text-gray-500">Subscribe to this URL from Google/Outlook/Apple — new bookings appear automatically.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={feedUrl}
                onFocus={(e) => e.target.select()}
                className={INPUT_CLS + ' font-mono text-xs'}
              />
              <div className="flex gap-2">
                <button
                  onClick={copyFeed}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#3355FF] text-white px-4 py-2 text-sm font-semibold hover:opacity-90"
                >
                  <Link2 className="w-4 h-4" /> {copiedMsg || 'Copy'}
                </button>
                <a
                  href={webcalUrl}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <ExternalLink className="w-4 h-4" /> Add to calendar
                </a>
                <button
                  type="button"
                  onClick={regenerateFeed}
                  title="Regenerate URL"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white w-9 h-9 text-gray-600 hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowHelp((v) => !v)}
              className="mt-3 text-xs font-semibold text-[#3355FF] hover:underline"
            >
              {showHelp ? 'Hide' : 'Show'} setup instructions
            </button>
            {showHelp && (
              <div className="mt-3 rounded-lg bg-gray-50 border border-gray-200 p-4 text-xs text-gray-700 space-y-3">
                <div>
                  <strong className="text-gray-900">Google Calendar:</strong> In the left sidebar, click <em>Other calendars → +</em> → <em>From URL</em>. Paste the URL above. New bookings appear within a few hours.
                </div>
                <div>
                  <strong className="text-gray-900">Apple Calendar (macOS/iOS):</strong> Click <em>File → New Calendar Subscription</em>, paste the URL. Choose refresh frequency.
                </div>
                <div>
                  <strong className="text-gray-900">Outlook:</strong> Go to <em>Calendar → Add calendar → Subscribe from web</em>, paste the URL.
                </div>
              </div>
            )}
          </div>

          {/* Import — external calendars */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 shrink-0">
                  <Upload className="w-4 h-4 text-[#3355FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">Import your busy times</div>
                  <p className="text-sm text-gray-500">Paste an iCal URL (webcal://… or https://…ics). We'll block those times so buyers can't book over them.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddCalendar(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a1816] text-white px-4 py-2 text-sm font-semibold hover:opacity-90 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add calendar
              </button>
            </div>

            {externalCalendars.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-center text-sm text-gray-500">
                No calendars imported yet.
              </div>
            ) : (
              <div className="space-y-2">
                {externalCalendars.map((cal) => {
                  const hasError = !!cal.last_sync_error;
                  return (
                    <div key={cal.id} className="rounded-lg border border-gray-200 p-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${hasError ? 'bg-red-50' : 'bg-gray-100'}`}>
                          <Calendar className={`w-4 h-4 ${hasError ? 'text-red-600' : 'text-gray-600'}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 text-sm truncate">{cal.label}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {cal.last_synced_at ? (
                              <>{cal.last_event_count} busy events · Last synced {new Date(cal.last_synced_at).toLocaleString()}</>
                            ) : 'Never synced'}
                          </div>
                          {hasError && (
                            <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-red-700">
                              <AlertCircle className="w-3 h-3" /> {cal.last_sync_error}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => syncCalendar(cal)}
                          title="Refresh now"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeCalendar(cal)}
                          title="Remove"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Copy modal */}
        {copyFromDow !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setCopyFromDow(null)}>
            <div className="bg-white rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="text-lg font-bold">Copy {DAYS[copyFromDow]}'s times</h3>
                <button onClick={() => setCopyFromDow(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 mb-4">
                  Select the days you want to copy <strong>{DAYS[copyFromDow]}</strong>'s schedule to. This will <strong>replace</strong> any existing blocks on those days.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DAYS.map((d, i) => {
                    if (i === copyFromDow) return null;
                    const checked = copyTargets.includes(i);
                    return (
                      <label key={i} className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${checked ? 'border-[#3355FF] bg-[#EEF1FF]' : 'border-gray-200 hover:border-gray-300'}`}>
                        <Checkbox checked={checked} onChange={(v) => setCopyTargets(v ? [...copyTargets, i] : copyTargets.filter((x) => x !== i))}>
                          <span className="text-sm font-medium">{d}</span>
                        </Checkbox>
                      </label>
                    );
                  })}
                </div>
                <div className="flex justify-end gap-2 mt-5">
                  <button onClick={() => setCopyFromDow(null)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button
                    onClick={copyRangesTo}
                    disabled={copyTargets.length === 0}
                    className="px-4 py-2 bg-[#3355FF] text-white rounded-lg disabled:opacity-50 inline-flex items-center gap-2 font-semibold"
                  >
                    <Copy className="w-4 h-4" /> Copy to {copyTargets.length} day{copyTargets.length === 1 ? '' : 's'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add-calendar modal */}
        {showAddCalendar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowAddCalendar(false)}>
            <form onSubmit={submitAddCalendar} className="bg-white rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="text-lg font-bold">Import a calendar</h3>
                <button type="button" onClick={() => setShowAddCalendar(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Label</label>
                  <input
                    required
                    type="text"
                    placeholder="Personal Google Calendar"
                    className={INPUT_CLS}
                    value={addCalForm.data.label}
                    onChange={(e) => addCalForm.setData('label', e.target.value)}
                  />
                  {addCalForm.errors.label && <p className="text-xs text-red-600 mt-1">{addCalForm.errors.label}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Calendar URL</label>
                  <input
                    required
                    type="url"
                    placeholder="https://calendar.google.com/.../basic.ics"
                    className={INPUT_CLS + ' font-mono text-xs'}
                    value={addCalForm.data.ics_url}
                    onChange={(e) => addCalForm.setData('ics_url', e.target.value)}
                  />
                  {addCalForm.errors.ics_url && <p className="text-xs text-red-600 mt-1">{addCalForm.errors.ics_url}</p>}
                  <p className="text-xs text-gray-500 mt-1">Google: Settings → your calendar → "Secret address in iCal format". Works with webcal:// and https:// ICS URLs.</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowAddCalendar(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button
                  type="submit"
                  disabled={addCalForm.processing}
                  className="px-4 py-2 bg-[#3355FF] text-white rounded-lg inline-flex items-center gap-2 disabled:opacity-50 font-semibold"
                >
                  {addCalForm.processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {addCalForm.processing ? 'Adding & syncing…' : 'Add & sync'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

Availability.layout = (page) => <UserDashboardLayout>{page}</UserDashboardLayout>;

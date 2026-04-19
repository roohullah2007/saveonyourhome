import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { Plus, X, Edit2, Trash2, Phone, MapPin, Check } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];
const DURATION_LABELS = { 15: '15 min', 30: '30 min', 45: '45 min', 60: '1 hr', 90: '1.5 hr', 120: '2 hr' };

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hh = ((h % 12) || 12);
  return `${hh}:${String(m).padStart(2, '0')} ${period}`;
}

export default function Availability({ rules = [] }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const form = useForm({
    day_of_week: 1,
    start_time: '09:00',
    end_time: '17:00',
    slot_duration_minutes: 30,
    allow_phone: true,
    allow_in_person: true,
    is_active: true,
  });

  const openCreate = (day = 1) => {
    setEditing(null);
    form.setData({
      day_of_week: day,
      start_time: '09:00',
      end_time: '17:00',
      slot_duration_minutes: 30,
      allow_phone: true,
      allow_in_person: true,
      is_active: true,
    });
    setShowModal(true);
  };

  const openEdit = (rule) => {
    setEditing(rule);
    form.setData({
      day_of_week: rule.day_of_week,
      start_time: rule.start_time.substring(0, 5),
      end_time: rule.end_time.substring(0, 5),
      slot_duration_minutes: rule.slot_duration_minutes,
      allow_phone: !!rule.allow_phone,
      allow_in_person: !!rule.allow_in_person,
      is_active: !!rule.is_active,
    });
    setShowModal(true);
  };

  const submit = (e) => {
    e.preventDefault();
    const onOk = () => { setShowModal(false); };
    if (editing) form.put(route('dashboard.availability.update', editing.id), { preserveScroll: true, onSuccess: onOk });
    else form.post(route('dashboard.availability.store'), { preserveScroll: true, onSuccess: onOk });
  };

  const deleteRule = (rule) => {
    if (!confirm(`Remove this ${DAYS[rule.day_of_week]} slot?`)) return;
    router.delete(route('dashboard.availability.destroy', rule.id), { preserveScroll: true });
  };

  const rulesByDay = DAYS.map((label, dow) => ({
    dow,
    label,
    rules: rules.filter((r) => r.day_of_week === dow),
  }));

  return (
    <>
      <Head title="Availability" />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My availability</h1>
            <p className="text-gray-500 text-sm mt-1">Publish when buyers can book phone calls or in-person viewings with you over the next 30 days.</p>
          </div>
          <button
            onClick={() => openCreate()}
            className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add time block
          </button>
        </div>

        {rules.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center mb-6">
            <p className="text-gray-600 mb-3">You haven't added any availability yet.</p>
            <p className="text-sm text-gray-500 mb-5">Pick the days and times you're open for meetings. Buyers will see these slots on your listings.</p>
            <button
              onClick={() => openCreate()}
              className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-5 py-2.5 rounded-lg hover:opacity-90"
            >
              <Plus className="w-4 h-4" /> Set your first time block
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rulesByDay.map((d) => (
            <div key={d.dow} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="font-semibold text-gray-900">{d.label}</span>
                <button onClick={() => openCreate(d.dow)} className="text-xs font-semibold text-[#3355FF] hover:underline inline-flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="p-4 space-y-3 min-h-[100px]">
                {d.rules.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No slots</p>
                ) : d.rules.map((r) => (
                  <div key={r.id} className={`rounded-lg border p-3 ${r.is_active ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900 text-sm">
                        {formatTime(r.start_time)} – {formatTime(r.end_time)}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(r)} className="w-7 h-7 inline-flex items-center justify-center rounded hover:bg-gray-100 text-gray-600">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteRule(r)} className="w-7 h-7 inline-flex items-center justify-center rounded hover:bg-red-50 text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 font-semibold">{DURATION_LABELS[r.slot_duration_minutes] || `${r.slot_duration_minutes}m`} slots</span>
                      {r.allow_phone && <span className="inline-flex items-center gap-1 text-emerald-700"><Phone className="w-3 h-3" />Phone</span>}
                      {r.allow_in_person && <span className="inline-flex items-center gap-1 text-blue-700"><MapPin className="w-3 h-3" />In-person</span>}
                      {!r.is_active && <span className="text-gray-400">• paused</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{editing ? 'Edit time block' : 'Add time block'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Day of week</label>
                <select required value={form.data.day_of_week} onChange={(e) => form.setData('day_of_week', parseInt(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                  {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Starts</label>
                  <input type="time" required value={form.data.start_time} onChange={(e) => form.setData('start_time', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Ends</label>
                  <input type="time" required value={form.data.end_time} onChange={(e) => form.setData('end_time', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
                  {form.errors.end_time && <p className="text-xs text-red-600 mt-1">{form.errors.end_time}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Slot length</label>
                <select required value={form.data.slot_duration_minutes} onChange={(e) => form.setData('slot_duration_minutes', parseInt(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                  {DURATION_OPTIONS.map((d) => <option key={d} value={d}>{DURATION_LABELS[d]}</option>)}
                </select>
                <p className="text-xs text-gray-500 mt-1">Buyers book one slot at a time.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Meeting types offered</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 cursor-pointer">
                    <input type="checkbox" checked={form.data.allow_phone} onChange={(e) => form.setData('allow_phone', e.target.checked)} className="rounded" />
                    <Phone className="w-4 h-4 text-emerald-600" /> Phone call
                  </label>
                  <label className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 cursor-pointer">
                    <input type="checkbox" checked={form.data.allow_in_person} onChange={(e) => form.setData('allow_in_person', e.target.checked)} className="rounded" />
                    <MapPin className="w-4 h-4 text-blue-600" /> In-person showing
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
                Active (visible to buyers)
              </label>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={form.processing} className="px-4 py-2 bg-[#3355FF] text-white rounded-lg hover:opacity-90 inline-flex items-center gap-2">
                  <Check className="w-4 h-4" /> {form.processing ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

Availability.layout = (page) => <UserDashboardLayout>{page}</UserDashboardLayout>;

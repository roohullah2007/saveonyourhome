import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Calendar, Clock, Phone, MapPin, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export default function ScheduleShowingModal({ property, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState([]);
  const [sellerName, setSellerName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState('pick'); // 'pick' | 'form' | 'done'

  const form = useForm({
    property_id: property?.id,
    scheduled_at: '',
    duration_minutes: 30,
    meeting_type: 'in_person',
    buyer_name: '',
    buyer_email: '',
    buyer_phone: '',
    buyer_notes: '',
  });

  useEffect(() => {
    if (!open || !property?.id) return;
    setLoading(true);
    fetch(`/api/properties/${property.id}/availability`, { headers: { Accept: 'application/json' } })
      .then((r) => r.json())
      .then((data) => {
        setDays(data.days || []);
        setSellerName(data.seller_name || '');
        if (data.days?.length) setSelectedDate(data.days[0].date);
      })
      .finally(() => setLoading(false));
  }, [open, property?.id]);

  useEffect(() => {
    if (!open) {
      setStep('pick');
      setSelectedSlot(null);
      form.reset();
    }
  }, [open]);

  const currentDaySlots = useMemo(() => {
    const d = days.find((x) => x.date === selectedDate);
    return d ? d.slots : [];
  }, [days, selectedDate]);

  const availableTypes = useMemo(() => {
    if (!selectedSlot) return [];
    return selectedSlot.meeting_types;
  }, [selectedSlot]);

  const pickSlot = (slot) => {
    setSelectedSlot(slot);
    const defaultType = slot.meeting_types.includes('in_person') ? 'in_person' : slot.meeting_types[0];
    form.setData({
      ...form.data,
      scheduled_at: slot.start,
      duration_minutes: slot.duration,
      meeting_type: defaultType,
    });
    setStep('form');
  };

  const submit = (e) => {
    e.preventDefault();
    form.post(route('showings.store'), {
      preserveScroll: true,
      onSuccess: () => setStep('done'),
    });
  };

  if (!open) return null;

  const dayLabel = (iso) => {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">Schedule a meeting</h2>
            {sellerName && <p className="text-sm text-gray-500 truncate">with {sellerName}</p>}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Step: pick */}
          {step === 'pick' && (
            <div className="p-5 space-y-5">
              {loading ? (
                <div className="py-12 text-center text-gray-500 inline-flex items-center justify-center gap-2 w-full">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading available times…
                </div>
              ) : days.length === 0 ? (
                <div className="py-10 text-center">
                  <Calendar className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-700 font-semibold mb-1">No open time slots</p>
                  <p className="text-sm text-gray-500">This seller hasn't published availability yet. Try messaging them instead.</p>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-[#3355FF]" />
                      <h3 className="font-semibold text-gray-900">Pick a date</h3>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                      {days.map((d) => (
                        <button
                          key={d.date}
                          onClick={() => { setSelectedDate(d.date); setSelectedSlot(null); }}
                          className={`shrink-0 flex flex-col items-center rounded-xl border px-4 py-3 min-w-[88px] transition-colors ${selectedDate === d.date ? 'border-[#3355FF] bg-[#EEF1FF] text-[#1a1816]' : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'}`}
                        >
                          <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-500">{new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className="text-xl font-extrabold mt-1">{new Date(d.date + 'T00:00:00').getDate()}</span>
                          <span className="text-[10px] text-gray-500">{new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-[#3355FF]" />
                      <h3 className="font-semibold text-gray-900">Pick a time</h3>
                      {selectedDate && <span className="text-xs text-gray-500">· {dayLabel(selectedDate)}</span>}
                    </div>
                    {currentDaySlots.length === 0 ? (
                      <p className="text-sm text-gray-500">No slots for this day.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {currentDaySlots.map((slot) => (
                          <button
                            key={slot.start}
                            onClick={() => pickSlot(slot)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#3355FF] hover:text-[#3355FF] hover:bg-[#EEF1FF] transition-colors"
                          >
                            {slot.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step: form */}
          {step === 'form' && selectedSlot && (
            <form onSubmit={submit} className="p-5 space-y-4">
              <button type="button" onClick={() => setStep('pick')} className="text-sm text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
                ← Change time
              </button>
              <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 text-sm">
                <div className="font-semibold text-gray-900">{dayLabel(selectedDate)} at {selectedSlot.label}</div>
                <div className="text-gray-500">{selectedSlot.duration} minute meeting with {sellerName}</div>
              </div>

              {availableTypes.length > 1 ? (
                <div>
                  <label className="block text-sm font-semibold mb-2">Meeting type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTypes.includes('in_person') && (
                      <button
                        type="button"
                        onClick={() => form.setData('meeting_type', 'in_person')}
                        className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-semibold ${form.data.meeting_type === 'in_person' ? 'border-[#3355FF] bg-[#EEF1FF] text-[#1a1816]' : 'border-gray-200 text-gray-700'}`}
                      >
                        <MapPin className="w-4 h-4" /> In-person
                      </button>
                    )}
                    {availableTypes.includes('phone') && (
                      <button
                        type="button"
                        onClick={() => form.setData('meeting_type', 'phone')}
                        className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-semibold ${form.data.meeting_type === 'phone' ? 'border-[#3355FF] bg-[#EEF1FF] text-[#1a1816]' : 'border-gray-200 text-gray-700'}`}
                      >
                        <Phone className="w-4 h-4" /> Phone call
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Meeting type:</span> {form.data.meeting_type === 'phone' ? 'Phone call' : 'In-person showing'}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-1.5">Your name</label>
                <input required type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2.5" value={form.data.buyer_name} onChange={(e) => form.setData('buyer_name', e.target.value)} />
                {form.errors.buyer_name && <p className="text-xs text-red-600 mt-1">{form.errors.buyer_name}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Email</label>
                  <input required type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2.5" value={form.data.buyer_email} onChange={(e) => form.setData('buyer_email', e.target.value)} />
                  {form.errors.buyer_email && <p className="text-xs text-red-600 mt-1">{form.errors.buyer_email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Phone {form.data.meeting_type === 'phone' && <span className="text-red-600">*</span>}</label>
                  <input type="tel" required={form.data.meeting_type === 'phone'} className="w-full rounded-lg border border-gray-300 px-3 py-2.5" value={form.data.buyer_phone} onChange={(e) => form.setData('buyer_phone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Notes (optional)</label>
                <textarea rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 resize-vertical" placeholder="Anything the seller should know?" value={form.data.buyer_notes} onChange={(e) => form.setData('buyer_notes', e.target.value)} />
              </div>

              {form.errors.scheduled_at && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{form.errors.scheduled_at}</div>
              )}

              <button type="submit" disabled={form.processing} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#3355FF] py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50">
                {form.processing ? 'Booking…' : 'Confirm booking'} <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-gray-500 text-center">You'll get an email confirmation with a calendar invite.</p>
            </form>
          )}

          {/* Step: done */}
          {step === 'done' && (
            <div className="p-8 text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">You're booked!</h3>
              <p className="text-gray-600 mb-6">A calendar invite is on its way to your inbox. The seller has been notified.</p>
              <button onClick={onClose} className="inline-flex items-center gap-2 rounded-full bg-[#3355FF] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

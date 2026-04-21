import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { Calendar, Phone, MapPin, Mail, User, ExternalLink, XCircle, CheckCircle2, Clock } from 'lucide-react';

function formatWhen(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function statusBadge(status) {
  const map = {
    confirmed: { label: 'Confirmed', cls: 'bg-green-50 text-green-700 border-green-200' },
    completed: { label: 'Completed', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-700 border-red-200' },
    no_show: { label: 'No-show', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  };
  const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-700 border-gray-200' };
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

function ShowingCard({ showing, onCancel, onComplete, showActions = true }) {
  const type = showing.meeting_type === 'phone' ? 'Phone call' : 'In-person showing';
  const TypeIcon = showing.meeting_type === 'phone' ? Phone : MapPin;
  const isBuyerView = showing.viewer_role === 'buyer';
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <TypeIcon className="w-4 h-4 text-[#3355FF]" />
            <span className="text-sm font-semibold text-gray-700">{type}</span>
            {statusBadge(showing.status)}
            <span className="text-xs text-gray-500">• {showing.duration_minutes} min</span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isBuyerView ? 'bg-[#EEF1FF] text-[#3355FF]' : 'bg-amber-50 text-amber-700'}`}>
              {isBuyerView ? 'You booked' : 'Booked with you'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-1">
            <Calendar className="w-4 h-4" />
            {formatWhen(showing.scheduled_at)}
          </div>
          {showing.property && (
            <Link href={`/properties/${showing.property.slug || showing.property.id}`} className="text-sm font-semibold text-[#3355FF] hover:underline inline-flex items-center gap-1">
              {showing.property.property_title}
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
          {showing.property?.address && (
            <div className="text-xs text-gray-500 mt-0.5">{showing.property.address}, {showing.property.city}</div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {isBuyerView ? (
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-semibold">With {showing.seller_name || 'the seller'}</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-semibold">{showing.buyer_name}</span>
            </div>
            <a href={`mailto:${showing.buyer_email}`} className="flex items-center gap-2 text-gray-700 hover:text-[#3355FF] break-all">
              <Mail className="w-4 h-4 text-gray-400" />
              {showing.buyer_email}
            </a>
            {showing.buyer_phone && (
              <a href={`tel:${showing.buyer_phone}`} className="flex items-center gap-2 text-gray-700 hover:text-[#3355FF]">
                <Phone className="w-4 h-4 text-gray-400" />
                {showing.buyer_phone}
              </a>
            )}
          </>
        )}
      </div>

      {showing.buyer_notes && !isBuyerView && (
        <div className="mt-3 rounded-lg bg-gray-50 border border-gray-100 p-3 text-sm text-gray-700">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Buyer notes</div>
          {showing.buyer_notes}
        </div>
      )}

      {showActions && showing.status === 'confirmed' && new Date(showing.scheduled_at) > new Date() && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => onCancel(showing)}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
          >
            <XCircle className="w-3.5 h-3.5" /> Cancel
          </button>
          {!isBuyerView && (
            <button
              onClick={() => onComplete(showing)}
              className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark completed
            </button>
          )}
        </div>
      )}

      {showActions && !isBuyerView && showing.status === 'confirmed' && new Date(showing.scheduled_at) <= new Date() && (
        <div className="mt-4">
          <button
            onClick={() => onComplete(showing)}
            className="inline-flex items-center gap-1 rounded-lg bg-[#3355FF] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark completed
          </button>
        </div>
      )}
    </div>
  );
}

export default function Showings({ upcoming = [], past = [] }) {
  const [tab, setTab] = useState('upcoming');

  const cancel = (s) => {
    const reason = prompt('Optional reason for cancelling (the buyer will see this):') ?? '';
    router.post(route('dashboard.showings.cancel', s.id), { reason }, { preserveScroll: true });
  };
  const complete = (s) => {
    if (!confirm('Mark this showing as completed?')) return;
    router.post(route('dashboard.showings.complete', s.id), {}, { preserveScroll: true });
  };

  const list = tab === 'upcoming' ? upcoming : past;

  return (
    <>
      <Head title="Showings" />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Showings</h1>
            <p className="text-gray-500 text-sm mt-1">Phone calls and in-person viewings — the ones buyers booked on your listings, and the ones you booked on other listings.</p>
          </div>
          <Link href={route('dashboard.availability')} className="inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            <Clock className="w-4 h-4" /> My availability
          </Link>
        </div>

        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab('upcoming')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${tab === 'upcoming' ? 'bg-[#1a1816] text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setTab('past')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${tab === 'past' ? 'bg-[#1a1816] text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
          >
            Past & cancelled ({past.length})
          </button>
        </div>

        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-gray-600">{tab === 'upcoming' ? 'No upcoming showings. Buyers will land here after booking your listings, and any meeting you book with another seller will show here too.' : 'Nothing here yet.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((s) => (
              <ShowingCard key={s.id} showing={s} onCancel={cancel} onComplete={complete} showActions={tab === 'upcoming'} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

Showings.layout = (page) => <UserDashboardLayout>{page}</UserDashboardLayout>;

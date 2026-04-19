import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle2, XCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function formatWhen(iso) {
  return new Date(iso).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function CancelShowing({ showing, token }) {
  const { flash } = usePage().props;
  const [done, setDone] = useState(showing.status === 'cancelled');

  const { data, setData, post, processing, errors } = useForm({ reason: '' });

  const submit = (e) => {
    e.preventDefault();
    post(route('showings.cancel.process', token), { onSuccess: () => setDone(true) });
  };

  return (
    <>
      <SEOHead title="Cancel your viewing" noindex />

      <section className="bg-gray-50 min-h-[70vh] py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 720 }}>
          <div className="rounded-2xl bg-white border border-gray-200 p-8 md:p-10">
            {done ? (
              <div className="text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-[#1a1816] mb-2">Viewing cancelled</h1>
                <p className="text-gray-600 mb-6">{showing.seller_name ? `${showing.seller_name} has been notified.` : 'The seller has been notified.'}</p>
                {showing.property_slug && (
                  <Link href={`/properties/${showing.property_slug}`} className="inline-flex items-center gap-2 rounded-full bg-[#3355FF] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                    Back to listing <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ) : !showing.is_cancellable ? (
              <div className="text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 mb-4">
                  <AlertTriangle className="w-7 h-7 text-yellow-600" />
                </div>
                <h1 className="text-2xl font-bold text-[#1a1816] mb-2">This viewing can't be cancelled</h1>
                <p className="text-gray-600">It may already be cancelled, completed, or started. Please contact the seller directly if you have questions.</p>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-[#1a1816] mb-2">Cancel this viewing?</h1>
                <p className="text-gray-600 mb-6">Let us know a reason if you like — we'll pass it along to the seller.</p>

                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-[#3355FF]" />
                    <strong>{formatWhen(showing.scheduled_at)}</strong>
                  </div>
                  {showing.property_title && (
                    <div className="text-sm text-gray-500 mt-1">{showing.property_title}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-1 capitalize">{showing.meeting_type.replace('_', ' ')}</div>
                </div>

                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Reason (optional)</label>
                    <textarea
                      rows={4}
                      value={data.reason}
                      onChange={(e) => setData('reason', e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm resize-vertical"
                      placeholder="Schedule conflict, no longer interested, etc."
                    />
                    {errors.reason && <p className="text-xs text-red-600 mt-1">{errors.reason}</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-bold hover:opacity-90 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> {processing ? 'Cancelling…' : 'Cancel viewing'}
                    </button>
                    {showing.property_slug && (
                      <Link href={`/properties/${showing.property_slug}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                        Keep my viewing
                      </Link>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

CancelShowing.layout = (page) => <MainLayout>{page}</MainLayout>;
export default CancelShowing;

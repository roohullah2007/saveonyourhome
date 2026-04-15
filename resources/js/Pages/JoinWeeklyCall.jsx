import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function JoinWeeklyCall() {
  const { flash } = usePage().props;
  const [submitted, setSubmitted] = useState(false);
  const { data, setData, post, processing, errors, reset, transform } = useForm({
    full_name: '', email: '', city_state: '', selling_status: '', topics: '', meeting_times: '', guest_speakers: 'Yes', valuable: '',
  });

  transform((d) => ({
    name: d.full_name, email: d.email, phone: '', subject: 'FSBO Weekly Call Sign Up',
    message: `City & State: ${d.city_state}\nSelling Status: ${d.selling_status}\nTopics of Interest: ${d.topics}\nPreferred Meeting Times: ${d.meeting_times}\nGuest Speakers: ${d.guest_speakers}\n\nWhat would make this group most valuable:\n${d.valuable}`,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('contact.store'), { onSuccess: () => { reset(); setSubmitted(true); setTimeout(() => setSubmitted(false), 5000); } });
  };

  const inputClass = "w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500";
  const inputStyle = { height: '52px', fontSize: '15px', color: 'rgb(26,24,22)' };
  const labelStyle = { display: 'block', fontSize: '15px', fontWeight: 600, color: 'rgb(26,24,22)', marginBottom: '8px' };
  const selectClass = "w-full rounded-xl border border-gray-300 bg-white px-4 outline-none transition-colors focus:border-gray-500 appearance-none";
  const selectStyle = { ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' };

  return (
    <>
      <SEOHead title="Join the FSBO Weekly Call" description="Connect with other homeowners, ask questions, and get real-time advice on selling your home by owner." />
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px] dark-selection">
        <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Weekly Call" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>WEEKLY CALL</span>
              </div>
              <h1 className="text-[26px] leading-[34px] sm:text-[36px] sm:leading-[44px] lg:text-[46px] lg:leading-[56px] font-extrabold text-white">Join the FSBO Weekly Call</h1>
              <p className="mt-5" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>Connect with other homeowners, ask questions, and get real-time advice on selling your home by owner.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mx-auto" style={{ maxWidth: '680px' }}>
            <div className="rounded-2xl border border-gray-200/60 p-8 sm:p-10" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px' }}>
              {(submitted || flash?.success) && (
                <div className="mb-6 rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'rgb(240,253,244)', border: '1px solid rgb(187,247,208)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(22,163,74)" strokeWidth="2"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'rgb(22,101,52)' }}>You're signed up! We'll send you the details shortly.</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div><label style={labelStyle}>Full Name *</label><input type="text" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} required className={inputClass} style={inputStyle} /></div>
                <div><label style={labelStyle}>Email Address *</label><input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required className={inputClass} style={inputStyle} /></div>
                <div><label style={labelStyle}>City & State</label><input type="text" value={data.city_state} onChange={(e) => setData('city_state', e.target.value)} className={inputClass} style={inputStyle} /></div>
                <div><label style={labelStyle}>Have you sold or are you currently selling by owner?</label><select value={data.selling_status} onChange={(e) => setData('selling_status', e.target.value)} className={selectClass} style={selectStyle}><option value="">Select</option><option value="Yes, currently selling">Yes, currently selling</option><option value="Sold previously">Sold previously</option><option value="Planning to sell">Planning to sell</option><option value="No">No</option></select></div>
                <div><label style={labelStyle}>Topics of interest</label><select value={data.topics} onChange={(e) => setData('topics', e.target.value)} className={selectClass} style={selectStyle}><option value="">Select</option><option value="Pricing Strategy">Pricing Strategy</option><option value="Marketing Tips">Marketing Tips</option><option value="Legal Guidance">Legal Guidance</option><option value="Negotiation">Negotiation</option><option value="Open Houses">Open Houses</option><option value="All Topics">All Topics</option></select></div>
                <div><label style={labelStyle}>Preferred meeting times</label><select value={data.meeting_times} onChange={(e) => setData('meeting_times', e.target.value)} className={selectClass} style={selectStyle}><option value="">Select</option><option value="Morning (9-11 AM)">Morning (9-11 AM)</option><option value="Afternoon (12-3 PM)">Afternoon (12-3 PM)</option><option value="Evening (5-7 PM)">Evening (5-7 PM)</option><option value="Weekend">Weekend</option><option value="Flexible">Flexible</option></select></div>
                <div>
                  <label style={labelStyle}>Guest speakers</label>
                  <div className="flex gap-3">
                    {['Yes', 'No'].map((opt) => (
                      <button key={opt} type="button" onClick={() => setData('guest_speakers', opt)} className="flex-1 rounded-xl border transition-all duration-200" style={{ height: '48px', fontSize: '15px', fontWeight: 600, backgroundColor: data.guest_speakers === opt ? '#3355FF' : 'white', color: data.guest_speakers === opt ? 'white' : 'rgb(26,24,22)', borderColor: data.guest_speakers === opt ? '#3355FF' : 'rgb(209,213,219)' }}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div><label style={labelStyle}>What would make this group most valuable?</label><textarea value={data.valuable} onChange={(e) => setData('valuable', e.target.value)} rows={4} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-gray-500 resize-vertical" style={{ fontSize: '15px', color: 'rgb(26,24,22)' }} /></div>
                <button type="submit" disabled={processing} className="inline-flex items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: '#3355FF', height: '48px', paddingLeft: '32px', paddingRight: '32px', fontSize: '15px', fontWeight: 600 }}>{processing ? 'Submitting...' : 'Sign Me Up!'}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
JoinWeeklyCall.layout = (page) => <MainLayout>{page}</MainLayout>;
export default JoinWeeklyCall;

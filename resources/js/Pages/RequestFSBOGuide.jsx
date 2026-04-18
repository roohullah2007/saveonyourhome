import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import {
  BookOpen, DollarSign, Camera, FileSignature, MessageSquare,
  ShieldCheck, Handshake, Key, Download,
} from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import HeroBadge from '@/Components/HeroBadge';
import MainLayout from '@/Layouts/MainLayout';

function RequestFSBOGuide() {
  const { flash } = usePage().props;
  const [submitted, setSubmitted] = useState(false);
  const { data, setData, post, processing, errors, reset, transform } = useForm({
    full_name: '', phone: '', email: '', zip_code: '', planning_to: '', heard_about: '', message: '',
  });

  transform((d) => ({
    name: d.full_name, email: d.email, phone: d.phone, subject: 'FSBO Guide Request',
    message: `Zip Code: ${d.zip_code}\nPlanning To: ${d.planning_to}\nHeard About Us: ${d.heard_about}\n\n${d.message}`,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('contact.store'), { onSuccess: () => { reset(); setSubmitted(true); setTimeout(() => setSubmitted(false), 5000); } });
  };

  const inputClass = "w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500";
  const inputStyle = { height: '57px', fontSize: '17px', color: 'rgb(26,24,22)' };
  const labelStyle = { display: 'block', fontSize: '17px', fontWeight: 600, color: 'rgb(26,24,22)', marginBottom: '8px' };
  const selectClass = "w-full rounded-xl border border-gray-300 bg-white px-4 outline-none transition-colors focus:border-gray-500 appearance-none";
  const selectStyle = { ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' };

  return (
    <>
      <SEOHead title="Request Free FSBO Guide" description="Get our free step-by-step FSBO guide to sell your home confidently without a realtor." />
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px] dark-selection">
        <img src="https://images.pexels.com/photos/7641824/pexels-photo-7641824.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="FSBO Guide" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <HeroBadge>FREE GUIDE</HeroBadge>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white">Request Free FSBO Guide</h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>Get our step-by-step guide packed with expert tips to help you sell your home confidently without a realtor.</p>
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
                  <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgb(22,101,52)' }}>Your guide request has been submitted! Check your email soon.</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div><label style={labelStyle}>Full Name *</label><input type="text" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} required className={inputClass} style={inputStyle} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label style={labelStyle}>Phone Number</label><input type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={inputClass} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Email Address *</label><input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required className={inputClass} style={inputStyle} /></div>
                </div>
                <div><label style={labelStyle}>Zip Code</label><input type="text" value={data.zip_code} onChange={(e) => setData('zip_code', e.target.value)} className={inputClass} style={{ ...inputStyle, maxWidth: '50%' }} /></div>
                <div>
                  <label style={labelStyle}>I am planning to:</label>
                  <div className="flex gap-3">
                    {['Buy', 'Sell'].map((opt) => (
                      <button key={opt} type="button" onClick={() => setData('planning_to', opt)} className="flex-1 rounded-xl border transition-all duration-200" style={{ height: '52px', fontSize: '17px', fontWeight: 600, backgroundColor: data.planning_to === opt ? '#3355FF' : 'white', color: data.planning_to === opt ? 'white' : 'rgb(26,24,22)', borderColor: data.planning_to === opt ? '#3355FF' : 'rgb(209,213,219)' }}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div><label style={labelStyle}>How did you hear about us?</label><select value={data.heard_about} onChange={(e) => setData('heard_about', e.target.value)} className={selectClass} style={selectStyle}><option value="">Select</option><option value="Google">Google</option><option value="Social Media">Social Media</option><option value="Friend/Family">Friend/Family</option><option value="Real Estate Agent">Real Estate Agent</option><option value="Other">Other</option></select></div>
                <div><label style={labelStyle}>Message</label><textarea value={data.message} onChange={(e) => setData('message', e.target.value)} rows={4} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-gray-500 resize-vertical" style={{ fontSize: '17px', color: 'rgb(26,24,22)' }} /></div>
                <button type="submit" disabled={processing} className="inline-flex items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}>{processing ? 'Submitting...' : 'Send Me the E-Book!'}</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside the Guide */}
      <section className="bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-16 md:py-24" style={{ maxWidth: '1400px' }}>
          <div className="text-center mb-12">
            <span className="inline-block text-[12px] font-bold uppercase tracking-[2px] text-[#3355FF] mb-3">
              What's Inside
            </span>
            <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] tracking-tight" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
              Everything you need to sell your home by owner
            </h2>
            <p className="mx-auto mt-4 text-[#6B7280]" style={{ fontSize: '17px', lineHeight: '28px', maxWidth: '680px' }}>
              A step-by-step playbook written for FSBO sellers — pricing strategy, marketing, contracts, and closing, all in one printable e-book.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {[
              {
                icon: DollarSign,
                chapter: 'Chapter 1',
                title: 'Pricing Your Home Right',
                desc: 'Run accurate comps, avoid over- and under-pricing traps, and choose a list price that attracts offers fast.',
              },
              {
                icon: Camera,
                chapter: 'Chapter 2',
                title: 'Listing That Stands Out',
                desc: 'Photo checklists, headline formulas, and the exact description structure buyers respond to.',
              },
              {
                icon: MessageSquare,
                chapter: 'Chapter 3',
                title: 'Marketing Without an Agent',
                desc: 'Syndication, social posts, yard signs, QR codes, and open-house scripts that actually convert.',
              },
              {
                icon: Handshake,
                chapter: 'Chapter 4',
                title: 'Handling Offers & Negotiation',
                desc: 'Counter-offer templates, contingency explanations, and how to evaluate a buyer\'s financing.',
              },
              {
                icon: FileSignature,
                chapter: 'Chapter 5',
                title: 'Contracts & Paperwork',
                desc: 'Purchase agreement walkthrough, required disclosures, and when you need a real-estate attorney.',
              },
              {
                icon: Key,
                chapter: 'Chapter 6',
                title: 'Closing Day',
                desc: 'Title, escrow, inspection, and walk-through checklists so nothing slips between offer and keys.',
              },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] text-[#3355FF] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#6B7280]">{c.chapter}</span>
                  </div>
                  <h3 className="text-[17px] font-bold text-[#0F172A] mb-2 tracking-tight">{c.title}</h3>
                  <p className="text-[14.5px] text-[#4B5563] leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: BookOpen, label: '50+ pages of actionable advice' },
              { icon: Download, label: 'Instant PDF delivered to your inbox' },
              { icon: ShieldCheck, label: 'Free — no credit card, no spam' },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[#FAFAF8] border border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#3355FF]" />
                  </div>
                  <span className="text-[14px] font-medium text-[#0F172A]">{p.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
RequestFSBOGuide.layout = (page) => <MainLayout>{page}</MainLayout>;
export default RequestFSBOGuide;

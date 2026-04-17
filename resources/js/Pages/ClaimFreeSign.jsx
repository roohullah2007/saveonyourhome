import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function ClaimFreeSign() {
  const { flash } = usePage().props;
  const [submitted, setSubmitted] = useState(false);
  const { data, setData, post, processing, errors, reset, transform } = useForm({
    full_name: '', phone: '', email: '', shipping_address: '', has_listing: '', heard_about: '', message: '',
  });

  transform((d) => ({
    name: d.full_name, email: d.email, phone: d.phone, subject: 'Free FSBO Sign Request',
    message: `Shipping Address: ${d.shipping_address}\nListing on SaveOnYourHome: ${d.has_listing}\nHeard About Us: ${d.heard_about}\n\n${d.message}`,
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
      <SEOHead title="Claim Your Free FSBO Sign" description="Get a free professional For Sale By Owner yard sign shipped to you." />
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px] dark-selection">
        <img src="https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Free FSBO Sign" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>FREE FSBO SIGN</span>
              </div>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white">Claim Your Free FSBO Sign!</h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>Stand out and attract buyers with a professional "For Sale By Owner" yard sign — we'll ship it to you free!</p>
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
                  <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgb(22,101,52)' }}>Your request has been submitted! We'll ship your sign soon.</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div><label style={labelStyle}>Full Name *</label><input type="text" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} required className={inputClass} style={inputStyle} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label style={labelStyle}>Phone Number</label><input type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={inputClass} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Email Address *</label><input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required className={inputClass} style={inputStyle} /></div>
                </div>
                <div><label style={labelStyle}>Shipping Address *</label><input type="text" value={data.shipping_address} onChange={(e) => setData('shipping_address', e.target.value)} required className={inputClass} style={inputStyle} /></div>
                <div><label style={labelStyle}>Do you have a listing on SaveOnYourHome.com?</label><select value={data.has_listing} onChange={(e) => setData('has_listing', e.target.value)} className={selectClass} style={selectStyle}><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option><option value="Planning to list">Planning to list</option></select></div>
                <div><label style={labelStyle}>How did you hear about us?</label><select value={data.heard_about} onChange={(e) => setData('heard_about', e.target.value)} className={selectClass} style={selectStyle}><option value="">Select</option><option value="Google">Google</option><option value="Social Media">Social Media</option><option value="Friend/Family">Friend/Family</option><option value="Real Estate Agent">Real Estate Agent</option><option value="Yard Sign">Yard Sign</option><option value="Other">Other</option></select></div>
                <div><label style={labelStyle}>Message</label><textarea value={data.message} onChange={(e) => setData('message', e.target.value)} rows={4} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-gray-500 resize-vertical" style={{ fontSize: '17px', color: 'rgb(26,24,22)' }} /></div>
                <button type="submit" disabled={processing} className="inline-flex items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}>{processing ? 'Submitting...' : 'Request My Free Sign!'}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
ClaimFreeSign.layout = (page) => <MainLayout>{page}</MainLayout>;
export default ClaimFreeSign;

import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import HeroBadge from '@/Components/HeroBadge';
import MainLayout from '@/Layouts/MainLayout';

function EBook() {
  const { flash } = usePage().props;
  const { data, setData, post, processing, errors, reset, transform } = useForm({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    zip_code: '',
    planning_to: '',
    heard_about: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  transform((data) => ({
    name: `${data.first_name} ${data.last_name}`.trim(),
    email: data.email,
    phone: data.phone,
    subject: 'E-Book Request',
    message: `E-Book Request\n\nZip Code: ${data.zip_code}\nPlanning to: ${data.planning_to}\nHow did you hear about us: ${data.heard_about}\n\n${data.message}`,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('contact.store'), {
      onSuccess: () => {
        reset();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      },
    });
  };

  return (
    <>
      <SEOHead
        title="Free E-Book"
        description="Request a FREE copy of The For Sale By Owner e-book. Your complete guide to selling your home without an agent and saving thousands in commissions."
        keywords="FSBO ebook, for sale by owner guide, free real estate ebook, sell home without agent, SaveOnYourHome ebook"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img src="/images/e-book.avif" alt="Free E-Book" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <HeroBadge>FREE E-BOOK</HeroBadge>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Request a FREE copy of The For Sale By Owner{' '}
                <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>e-book</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                Your complete guide to selling your home without an agent. Learn proven strategies, avoid common pitfalls, and save thousands in commissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              <div className="mb-6">
                <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>REQUEST YOUR COPY</span>
              </div>
              <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] mb-6" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
                Get Your Free E-Book
              </h2>

              {(submitted || flash?.success) && (
                <div className="mb-6 rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'rgb(240,253,244)', border: '1px solid rgb(187,247,208)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(22,163,74)" strokeWidth="2"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgb(22,101,52)' }}>Request sent successfully! We'll send your free e-book shortly.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>First Name *</label>
                    <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} placeholder="First name" required className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }} />
                    {errors.name && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Last Name *</label>
                    <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} placeholder="Last name" required className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Phone Number</label>
                    <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="(555) 123-4567" className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Email Address *</label>
                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="your@email.com" required className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }} />
                    {errors.email && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Zip Code</label>
                  <input type="text" value={data.zip_code} onChange={e => setData('zip_code', e.target.value)} placeholder="Enter your zip code" className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>I am planning to:</label>
                  <select value={data.planning_to} onChange={e => setData('planning_to', e.target.value)} className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '52px', fontSize: '17px', color: data.planning_to ? 'rgb(26,24,22)' : 'rgb(156,163,175)' }}>
                    <option value="">Select an option</option>
                    <option value="Buy a Home">Buy a Home</option>
                    <option value="Sell a Home">Sell a Home</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>How did you hear about us?</label>
                  <select value={data.heard_about} onChange={e => setData('heard_about', e.target.value)} className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '52px', fontSize: '17px', color: data.heard_about ? 'rgb(26,24,22)' : 'rgb(156,163,175)' }}>
                    <option value="">Select an option</option>
                    <option value="Google">Google</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Friend/Family">Friend/Family</option>
                    <option value="Real Estate Agent">Real Estate Agent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Message</label>
                  <textarea value={data.message} onChange={e => setData('message', e.target.value)} placeholder="Any additional information or questions?" rows={5} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-gray-500 resize-none" style={{ fontSize: '17px', color: 'rgb(26,24,22)' }} />
                  {errors.message && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.message}</p>}
                </div>
                <button type="submit" disabled={processing} className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50 w-full sm:w-auto" style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}>
                  {processing ? 'Sending...' : 'Send'} <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

EBook.layout = (page) => <MainLayout>{page}</MainLayout>;

export default EBook;

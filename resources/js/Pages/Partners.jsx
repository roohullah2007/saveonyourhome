import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Phone, Mail, Globe, MapPin, ArrowRight } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function Partners({ partnersByCategory = {}, categories = [] }) {
  const { flash } = usePage().props;
  const [submitted, setSubmitted] = useState(false);

  const { data, setData, post, processing, errors, reset, transform } = useForm({
    full_name: '',
    email: '',
    phone: '',
    industry: '',
    message: '',
  });

  transform((d) => ({
    name: d.full_name,
    email: d.email,
    phone: d.phone,
    subject: 'Partner Application',
    message: `Industry: ${d.industry}\n\n${d.message}`,
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

  const formatWebsite = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };
  const displayWebsite = (url) => {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  };

  const inputClass = "w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500";
  const inputStyle = { height: '57px', fontSize: '17px', color: 'rgb(26,24,22)' };
  const labelStyle = { display: 'block', fontSize: '15px', fontWeight: 600, color: 'rgb(26,24,22)', marginBottom: '8px' };

  return (
    <>
      <SEOHead
        title="Partners"
        description="Trusted vendor partners for your FSBO real estate journey. Find accountants, attorneys, contractors, mortgage, photography, and more."
        keywords="FSBO partners, trusted vendors, real estate vendors, home selling services"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px] dark-selection">
        <img
          src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Partners"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[640px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>PARTNERS</span>
              </div>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white">
                Trusted Vendor <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Partners</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '560px' }}>
                Your trusted resource for For Sale By Owner real estate solutions. We work with vendors who have pledged to uphold our Honor Pledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Note */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-10 md:py-12" style={{ maxWidth: '1400px' }}>
          <div className="rounded-2xl border border-gray-200/60 p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px' }}>
            <p style={{ fontSize: '17px', lineHeight: '28px', color: 'rgb(75,75,75)', textAlign: 'center' }}>
              Please note that as we are just getting started, we don't have vendors for every category yet. If you have a suggestion or would like to recommend a vendor,{' '}
              <Link href="/contact" className="underline font-semibold" style={{ color: '#3355FF' }}>please click here</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Directory */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] pb-12 md:pb-20" style={{ maxWidth: '1400px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category) => {
              const partners = partnersByCategory[category] || [];
              return (
                <div
                  key={category}
                  className="rounded-2xl border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-md"
                  style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)' }}
                >
                  <h3
                    className="mb-4 pb-3 border-b border-gray-200"
                    style={{ fontSize: '18px', fontWeight: 700, color: 'rgb(26,24,22)' }}
                  >
                    {category}
                  </h3>
                  {partners.length === 0 ? (
                    <p style={{ fontSize: '14px', color: 'rgb(156,163,175)', fontStyle: 'italic' }}>Coming soon</p>
                  ) : (
                    <div className="space-y-4">
                      {partners.map((p) => (
                        <div key={p.id} className="space-y-1.5">
                          <div style={{ fontSize: '17px', fontWeight: 700, color: 'rgb(26,24,22)' }}>{p.name}</div>
                          {p.description && (
                            <p style={{ fontSize: '14px', lineHeight: '22px', color: 'rgb(100,100,100)' }}>{p.description}</p>
                          )}
                          {p.phone && (
                            <a href={`tel:${p.phone}`} className="flex items-center gap-2 hover:opacity-80" style={{ fontSize: '14px', color: 'rgb(75,75,75)' }}>
                              <Phone className="w-4 h-4" /> {p.phone}
                            </a>
                          )}
                          {p.email && (
                            <a href={`mailto:${p.email}`} className="flex items-center gap-2 hover:opacity-80 break-all" style={{ fontSize: '14px', color: 'rgb(75,75,75)' }}>
                              <Mail className="w-4 h-4 flex-shrink-0" /> {p.email}
                            </a>
                          )}
                          {p.website && (
                            <a href={formatWebsite(p.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80" style={{ fontSize: '14px', color: '#3355FF' }}>
                              <Globe className="w-4 h-4" /> {displayWebsite(p.website)}
                            </a>
                          )}
                          {p.address && (
                            <div className="flex items-start gap-2" style={{ fontSize: '14px', color: 'rgb(100,100,100)' }}>
                              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" /> {p.address}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner With Us Section */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="text-center mb-10 mx-auto" style={{ maxWidth: '720px' }}>
            <div className="mb-4">
              <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>BECOME A PARTNER</span>
            </div>
            <h2
              className="mb-5 text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]"
              style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}
            >
              Partner With SaveOnYourHome.com!
            </h2>
            <p style={{ fontSize: '17px', lineHeight: '28px', color: 'rgb(100,100,100)' }}>
              Submit your details, and our dedicated team will promptly connect with you to explore tailored advertising opportunities that resonate with your business aspirations.
            </p>
            <p className="mt-4" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgb(100,100,100)' }}>
              Join us now and start turning our visitors into your clients — your next successful campaign begins here!
            </p>
          </div>

          <div className="mx-auto" style={{ maxWidth: '680px' }}>
            <div className="rounded-2xl border border-gray-200/60 p-8 sm:p-10" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px' }}>
              {(submitted || flash?.success) && (
                <div className="mb-6 rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'rgb(240,253,244)', border: '1px solid rgb(187,247,208)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(22,163,74)" strokeWidth="2"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgb(22,101,52)' }}>Thank you! We'll be in touch about partnership opportunities.</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label style={labelStyle}>Industry</label>
                  <select
                    value={data.industry}
                    onChange={(e) => setData('industry', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 outline-none focus:border-gray-500 appearance-none"
                    style={{
                      ...inputStyle,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                    }}
                  >
                    <option value="">Please select from the options below</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input type="text" required value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} className={inputClass} style={inputStyle} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" required value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Your Message</label>
                  <textarea
                    rows={4}
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-gray-500 resize-vertical"
                    style={{ fontSize: '17px', color: 'rgb(26,24,22)' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}
                >
                  {processing ? 'Submitting...' : 'Submit'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Partners.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Partners;

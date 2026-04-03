import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function Contact() {
  const { flash } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    sms_consent: false,
    subject: '',
    message: ''
  });

  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);

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

  const contactInfo = [
    { title: 'EMAIL US', info: 'hello@saveonyourhome.com', link: 'mailto:hello@saveonyourhome.com', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>) },
    { title: 'CALL US', info: '888-441-OKBO (6526)', link: 'tel:8884416526', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>) },
    { title: 'MAIL US', info: '1611 S Utica Avenue #515, Tulsa, OK 74104', link: 'https://maps.google.com/?q=1611+S+Utica+Avenue+%23515,+Tulsa,+OK+74104', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>) },
    { title: 'HOURS', info: 'Mon-Fri: 9AM - 6PM CST', link: null, icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>) },
  ];

  const faqs = [
    { q: 'How do I list my property?', a: 'Click on "List Property" and follow the simple steps to create your listing. It takes under 5 minutes! Your listing is completely free and includes up to 25 photos, a detailed description, and direct buyer contact.' },
    { q: 'Is there a fee to list?', a: 'No! Our basic listing is completely FREE forever. We don\'t charge commissions or fees. Optional premium packages are available for additional exposure.' },
    { q: 'How long does my listing stay active?', a: 'Your listing stays active until you sell your property or choose to remove it. No time limits. You can edit your listing anytime.' },
  ];

  return (
    <>
      <Head title="Contact Us - SaveOnYourHome" />

      {/* Hero */}
      <section className="relative w-full overflow-hidden" style={{ height: '500px' }}>
        <img src="/images/home-img.webp" alt="Contact us" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>GET IN TOUCH</span>
              </div>
              <h1 className="text-[26px] leading-[34px] sm:text-[36px] sm:leading-[44px] lg:text-[46px] lg:leading-[56px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                We'd Love to <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hear From You</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                Have questions about listing, buying, or our services? Our team is always ready to help you succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-20" style={{ maxWidth: '1400px' }}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-16">
            {contactInfo.map((c, i) => (
              <a key={i} href={c.link || '#'} target={c.link?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 p-6 flex flex-col items-center text-center group relative" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                <div className="mb-4 flex items-center justify-center rounded-2xl" style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245,245,244)' }}>{c.icon}</div>
                <h3 className="mb-2" style={{ fontWeight: 700, fontSize: '12px', color: 'rgb(26,24,22)', letterSpacing: '0.5px' }}>{c.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: '20px', color: 'rgb(100,100,100)' }}>{c.info}</p>
              </a>
            ))}
          </div>

          {/* Contact Form + Map */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              <div className="mb-6">
                <span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>SEND A MESSAGE</span>
              </div>
              <h2 className="text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] mb-6" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
                How Can We Help?
              </h2>

              {(submitted || flash?.success) && (
                <div className="mb-6 rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'rgb(240,253,244)', border: '1px solid rgb(187,247,208)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(22,163,74)" strokeWidth="2"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'rgb(22,101,52)' }}>Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Full Name *</label>
                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Your name" required className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' }} />
                    {errors.name && <p style={{ fontSize: '12px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Email *</label>
                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="your@email.com" required className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' }} />
                    {errors.email && <p style={{ fontSize: '12px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Phone</label>
                    <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="(555) 123-4567" className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Subject</label>
                    <select value={data.subject} onChange={e => setData('subject', e.target.value)} className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '48px', fontSize: '15px', color: data.subject ? 'rgb(26,24,22)' : 'rgb(156,163,175)' }}>
                      <option value="">Select topic</option>
                      <option value="listing">Listing a Property</option>
                      <option value="buying">Buying a Property</option>
                      <option value="packages">Media Packages</option>
                      <option value="mls">MLS Listing</option>
                      <option value="support">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Message *</label>
                  <textarea value={data.message} onChange={e => setData('message', e.target.value)} placeholder="How can we help you?" required rows={5} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-gray-500 resize-none" style={{ fontSize: '15px', color: 'rgb(26,24,22)' }} />
                  {errors.message && <p style={{ fontSize: '12px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.message}</p>}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={data.sms_consent} onChange={e => setData('sms_consent', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-gray-800 focus:ring-0" />
                  <span style={{ fontSize: '13px', color: 'rgb(107,114,128)' }}>I agree to receive SMS updates from SaveOnYourHome.com</span>
                </label>
                <button type="submit" disabled={processing} className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50 w-full sm:w-auto" style={{ backgroundColor: 'rgb(26,24,22)', height: '48px', paddingLeft: '32px', paddingRight: '32px', fontSize: '15px', fontWeight: 600 }}>
                  {processing ? 'Sending...' : 'Send Message'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Map + Info */}
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden" style={{ height: '360px', boxShadow: 'rgba(0,0,0,0.08) 0px 8px 32px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3224.8!2d-95.9747!3d36.1397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87b6ec1e0e0e0e0e%3A0x0!2s1611+S+Utica+Ave+%23515%2C+Tulsa%2C+OK+74104!5e0!3m2!1sen!2sus!4v1703561234567"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl border border-gray-200/60 p-6" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'rgb(26,24,22)', marginBottom: '12px' }}>SaveOnYourHome.com</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(100,100,100)" strokeWidth="1.5"><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    <span style={{ fontSize: '14px', color: 'rgb(100,100,100)' }}>1611 S Utica Avenue #515, Tulsa, OK 74104</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(100,100,100)" strokeWidth="1.5"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    <a href="tel:8884416526" style={{ fontSize: '14px', color: 'rgb(100,100,100)' }}>888-441-OKBO (6526)</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(100,100,100)" strokeWidth="1.5"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                    <a href="mailto:hello@saveonyourhome.com" style={{ fontSize: '14px', color: 'rgb(100,100,100)' }}>hello@saveonyourhome.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>QUICK ANSWERS</span></div>
          <h2 className="mb-14 text-center text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 overflow-hidden" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'rgb(26,24,22)' }}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-5"><p style={{ fontSize: '14px', lineHeight: '24px', color: 'rgb(100,100,100)' }}>{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

Contact.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Contact;

import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, ChevronDown, Phone, Mail } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function Sellers() {
  const { flash } = usePage().props;
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const { data, setData, post, processing, errors, reset, transform } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
  });

  transform((data) => ({
    name: `${data.first_name} ${data.last_name}`.trim(),
    email: data.email,
    phone: data.phone,
    subject: 'Sell Your Home Inquiry',
    message: data.message,
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

  const whyFsbo = [
    { title: 'Sell Your Way, Your Terms', desc: 'Take full control of your home sale. Show your property when it suits you, set your own price, and connect directly with buyers on your schedule.' },
    { title: 'Maximize Your Savings', desc: 'Traditional real estate agents charge hefty commissions. By selling through FSBO, you keep more of your money. Invest in what matters most \u2014 your next home.' },
    { title: 'Direct Buyer Interaction', desc: 'Connect directly with potential buyers. Answer their questions, showcase your property, and negotiate offers without any barriers. Your home, your conversations.' },
    { title: 'Transparency and Trust', desc: 'Our platform is built on transparency. No hidden fees, no surprises. We believe in trust and honesty, ensuring a straightforward selling experience you can rely on.' },
    { title: 'Empower Your Journey', desc: 'Selling your home is a significant milestone. Empower your journey by choosing SaveOnYourHome. Experience the freedom of selling on your terms and the satisfaction of a successful, commission-free sale.' },
  ];

  const howItWorks = [
    { num: '01', title: 'List Your Property', desc: 'Capture attention with photos, videos, and virtual tours. Utilize intuitive pricing tools and expert guidance to attract ideal buyers efficiently and effectively.' },
    { num: '02', title: 'Connect with Buyers', desc: 'Engage directly, answer questions, schedule viewings. Coordinate showings, highlight unique features, and negotiate offers for the best deal.' },
    { num: '03', title: 'Close the Deal', desc: 'Our team ensures accurate, efficient paperwork. Close smoothly, transfer ownership hassle-free. Congratulate yourself on a successful sale, enjoying savings from avoiding hefty agent commissions.' },
  ];

  const faqs = [
    { q: 'How long does the sales process take?', a: 'The timeline varies depending on market conditions, pricing, and property location. On average, FSBO homes sell within 30 to 90 days. Pricing your home competitively and presenting it well can help speed up the process significantly.' },
    { q: 'How do you rate my property?', a: 'We use a combination of market data, comparable sales in your area, and our AI-powered valuation tools to help you determine a competitive and fair price for your property. You can also consult with a professional appraiser for an in-depth assessment.' },
    { q: 'Is listing on your platform free?', a: 'Yes! Listing your home on SaveOnYourHome.com is completely free. There are no commissions or hidden fees. We offer optional premium services for additional exposure, but the basic listing is free forever.' },
    { q: 'What does \'find your own buyer\' mean exactly?', a: 'Finding your own buyer means you take control of the selling process. You market your property, connect directly with interested buyers, negotiate offers, and close the deal without paying a traditional real estate agent commission. Our platform provides the tools and support to make this process straightforward.' },
  ];

  return (
    <>
      <SEOHead
        title="Sellers"
        description="Sell your home with confidence and ease on SaveOnYourHome.com. Commission-free FSBO listing, direct buyer connections, and expert guidance for a successful sale."
        keywords="sell home by owner, FSBO, sell house no commission, list property for sale, FSBO tips"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img src="https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Sell your home" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>FOR SELLERS</span>
              </div>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[60px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Sell Your Home with <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Confidence and Ease!</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                Take control of your home sale with SaveOnYourHome.com. Benefit from commission-free savings and embark on your path to a successful sale right here.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/list-property" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}>List My Home <ArrowRight className="w-5 h-5" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose FSBO */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>WHY CHOOSE FSBO?</span></div>
          <h2 className="mb-14 text-center text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>Sell on Your Terms</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {whyFsbo.map((item, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 relative flex flex-col items-center p-7 text-center group" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                <div className="mb-4 flex items-center justify-center rounded-2xl" style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245,245,244)' }}>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: 'rgb(26,24,22)' }}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mb-2" style={{ fontWeight: 700, fontSize: '15px', color: 'rgb(26,24,22)', letterSpacing: '0.3px' }}>{item.title}</h3>
                <p style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>HOW IT WORKS</span></div>
          <h2 className="mb-14 text-center text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>Your Step-by-Step Guide to Success</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {howItWorks.map((s, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 p-9 group relative" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                <div className="mb-4 flex items-center justify-center rounded-xl" style={{ width: '48px', height: '48px', backgroundColor: '#3355FF' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{s.num}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'rgb(26,24,22)', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: '#3355FF' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-16 md:py-24 text-center" style={{ maxWidth: '1400px' }}>
          <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] text-white mb-5" style={{ fontWeight: 700 }}>
            Ready to list your property?
          </h2>
          <p className="mx-auto mb-8" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgba(255,255,255,0.65)', maxWidth: '600px' }}>
            Start now, craft a captivating listing, and attract buyers effortlessly on our platform. With user-friendly tools and expert guidance, your selling journey is bound to be seamless and successful!
          </p>
          <Link href="/list-property" className="inline-flex items-center justify-center gap-2 rounded-full transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(255,255,255)', color: 'rgb(26,24,22)', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}>List My Property <ArrowRight className="w-5 h-5" /></Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side */}
            <div>
              <div className="mb-4"><span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>FAQS</span></div>
              <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] mb-5" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>Frequently Asked Questions</h2>
              <p className="mb-8" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgb(100,100,100)', maxWidth: '480px' }}>
                Can't find an answer to your question? Contact us, we will be happy to answer your questions.
              </p>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}>Ask Questions <ArrowRight className="w-5 h-5" /></Link>
            </div>
            {/* Right side - accordion */}
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-gray-200/60 overflow-hidden" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                    <span style={{ fontSize: '17px', fontWeight: 600, color: 'rgb(26,24,22)' }}>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && <div className="px-5 pb-5"><p style={{ fontSize: '15px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>{faq.a}</p></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>CONTACT US</span></div>
          <h2 className="mb-5 text-center text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>Do you have questions or need support?</h2>
          <p className="text-center mb-14" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgb(100,100,100)', maxWidth: '600px', margin: '0 auto 56px' }}>
            Contact us now, we will be happy to answer your questions.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200/60 p-7 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <div className="flex items-center justify-center rounded-2xl flex-shrink-0" style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245,245,244)' }}>
                  <Phone className="w-5 h-5" style={{ color: 'rgb(26,24,22)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'rgb(26,24,22)', letterSpacing: '0.5px', marginBottom: '4px' }}>PHONE</h3>
                  <a href="tel:2016960291" style={{ fontSize: '15px', color: 'rgb(100,100,100)' }}>201.696.0291</a>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200/60 p-7 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <div className="flex items-center justify-center rounded-2xl flex-shrink-0" style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245,245,244)' }}>
                  <Mail className="w-5 h-5" style={{ color: 'rgb(26,24,22)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'rgb(26,24,22)', letterSpacing: '0.5px', marginBottom: '4px' }}>EMAIL</h3>
                  <a href="mailto:info@saveonyourhome.com" style={{ fontSize: '15px', color: 'rgb(100,100,100)' }}>info@saveonyourhome.com</a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              {(submitted || flash?.success) && (
                <div className="mb-6 rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'rgb(240,253,244)', border: '1px solid rgb(187,247,208)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(22,163,74)" strokeWidth="2"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgb(22,101,52)' }}>Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>First Name *</label>
                    <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} placeholder="First name" required className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }} />
                    {errors.first_name && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.first_name}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Last Name *</label>
                    <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} placeholder="Last name" required className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }} />
                    {errors.last_name && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.last_name}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Email Address *</label>
                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="your@email.com" required className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }} />
                    {errors.email && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.email}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Phone Number</label>
                    <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="(555) 123-4567" className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }} />
                    {errors.phone && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Message *</label>
                  <textarea value={data.message} onChange={e => setData('message', e.target.value)} placeholder="How can we help you?" required rows={5} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-gray-500 resize-none" style={{ fontSize: '17px', color: 'rgb(26,24,22)' }} />
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

Sellers.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Sellers;

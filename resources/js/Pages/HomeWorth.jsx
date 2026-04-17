import React, { useState } from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function HomeWorth() {
  const { flash } = usePage().props;
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const { data, setData, post, processing, errors, reset, transform } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    property_address: '',
    message: '',
  });

  transform((data) => ({
    name: `${data.first_name} ${data.last_name}`.trim(),
    email: data.email,
    phone: data.phone,
    subject: 'Home Valuation Request',
    message: data.property_address
      ? `Property Address: ${data.property_address}\n\n${data.message}`
      : data.message,
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

  const faqs = [
    {
      q: 'How long does the sales process take?',
      a: 'The timeline varies depending on your local market conditions, pricing strategy, and property condition. On average, well-priced homes sell within 30 to 90 days. Our team works diligently to ensure the process moves as efficiently as possible.',
    },
    {
      q: 'How do you rate my property?',
      a: 'We use a combination of comparable sales data, current market trends, property condition, location factors, and our proprietary AI-powered analysis to provide an accurate and fair valuation of your property.',
    },
    {
      q: 'Can I also use the fixed-price broker service in combination with real estate financing advice?',
      a: 'Absolutely! Our services are designed to complement each other. You can combine our fixed-price brokerage model with personalized financing advice to get a complete solution tailored to your needs.',
    },
    {
      q: 'What fees apply to the fixed-price brokerage model?',
      a: 'Our fixed-price brokerage model offers transparent, upfront pricing with no hidden fees or surprise commissions. Contact us for a detailed breakdown of our competitive pricing structure.',
    },
  ];

  return (
    <>
      <SEOHead
        title="What Is My Home Worth?"
        description="Find out your home's market value with our free AI-powered valuation tool. Get an instant estimate or request a personalized home valuation from a local realtor."
        keywords="home valuation, home worth, property value, free home estimate, AI valuation, real estate"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img src="https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Home valuation" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>HOME VALUATION</span>
              </div>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                What Is My <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Home Worth?</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                Curious about your home's market value? Utilize the tools below to determine the value!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Valuation Section */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <div>
              <div className="mb-4">
                <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>AI-POWERED TOOL</span>
              </div>
              <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] mb-6" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
                Instant Home Valuation Powered By AI
              </h2>
              <p className="text-[17px] leading-[1.75] mb-6" style={{ color: 'rgb(100,100,100)' }}>
                Use our tool to evaluate your property free of charge and without obligation. Start by inserting your address in the form on the right.
              </p>
            </div>

            {/* Right - Valuation Card */}
            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              <h3 className="text-[24px] sm:text-[28px] mb-6" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
                What's your home worth?
              </h3>
              <div className="space-y-4">
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Property Address</label>
                  <input
                    type="text"
                    placeholder="Enter your property address"
                    className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500"
                    style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }}
                  />
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90 w-full" style={{ backgroundColor: '#3355FF', height: '46px', fontSize: '14px', fontWeight: 600 }}>
                  Check <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
              <p className="mt-4 text-center" style={{ fontSize: '14px', color: 'rgb(156,163,175)' }}>
                Powered by Homebot
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Contact Section (light surface) */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] mb-5" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
              Request a Personalized Home Valuation from a Local Realtor for No Cost or Obligation.
            </h2>
            <p style={{ fontSize: '17px', lineHeight: '28px', color: 'rgb(100,100,100)' }}>
              An experienced local realtor will provide you with a free and personalized estimate of your home's value.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-2xl border border-gray-200 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
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
                  <input
                    type="text"
                    value={data.first_name}
                    onChange={e => setData('first_name', e.target.value)}
                    placeholder="First name"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 outline-none transition-colors focus:border-gray-500"
                    style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }}
                  />
                  {errors.first_name && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.first_name}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Last Name *</label>
                  <input
                    type="text"
                    value={data.last_name}
                    onChange={e => setData('last_name', e.target.value)}
                    placeholder="Last name"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 outline-none transition-colors focus:border-gray-500"
                    style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }}
                  />
                  {errors.last_name && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.last_name}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Email Address *</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 outline-none transition-colors focus:border-gray-500"
                    style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }}
                  />
                  {errors.email && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.email}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Phone Number</label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={e => setData('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 outline-none transition-colors focus:border-gray-500"
                    style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Property Address *</label>
                <input
                  type="text"
                  value={data.property_address}
                  onChange={e => setData('property_address', e.target.value)}
                  placeholder="Enter your property address"
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 outline-none transition-colors focus:border-gray-500"
                  style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)' }}
                />
                {errors.property_address && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.property_address}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>More Details</label>
                <textarea
                  value={data.message}
                  onChange={e => setData('message', e.target.value)}
                  placeholder="Tell us more about your property..."
                  rows={5}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-colors focus:border-gray-500 resize-none"
                  style={{ fontSize: '17px', color: 'rgb(26,24,22)' }}
                />
              </div>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50 w-full sm:w-auto"
                style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}
              >
                {processing ? 'Sending...' : 'Contact Agent'} <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4">
            <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Left Side */}
            <div>
              <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] mb-6" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
                Frequently Asked Questions
              </h2>
              <p className="text-[17px] text-gray-500 mb-10 leading-[1.75]">
                Can't find an answer to your question? Contact us, we will be happy to answer your questions.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}
              >
                Ask Questions
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right Side - Accordion */}
            <div>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`rounded-2xl mb-3 overflow-hidden transition-all duration-300 border ${
                    openFaq === i ? 'bg-white border-[#1A1816]/15 shadow-md shadow-[#1A1816]/5' : 'bg-white border-gray-200/60 hover:border-gray-300/80'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left transition-colors group"
                  >
                    <span className="text-[18px] font-semibold text-[#111] pr-4 transition-colors tracking-[-0.01em]">
                      {faq.q}
                    </span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openFaq === i ? 'bg-[#1A1816] rotate-180' : 'bg-[#F5F4F1] group-hover:bg-[#EEEDEA]'
                    }`}>
                      <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${
                        openFaq === i ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-[17px] text-gray-500 leading-[1.75]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

HomeWorth.layout = (page) => <MainLayout>{page}</MainLayout>;

export default HomeWorth;

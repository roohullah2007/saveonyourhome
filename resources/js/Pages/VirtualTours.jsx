import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function VirtualTours() {
  const { flash } = usePage().props;
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
    subject: '360 Virtual Tour Inquiry',
    message: data.message,
  }));

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

  const features = [
    {
      title: 'Comprehensive Views',
      description: 'See every corner of the property with 360-degree views, ensuring you don\'t miss a single detail.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(26,24,22)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Interactive Experience',
      description: 'Take control of your virtual tour by navigating through rooms and spaces at your own pace.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(26,24,22)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
        </svg>
      ),
    },
    {
      title: 'Realistic Feel',
      description: 'High-quality imaging and advanced technology create a lifelike experience, allowing you to envision your life in your potential new home.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(26,24,22)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Prepare Your Virtual Tour',
      description: 'List your property or edit the property if you have listed it already that you are willing to sell on SaveOnYourHome.',
    },
    {
      number: '02',
      title: 'Input the Embed Code',
      description: 'Embed your virtual tour code provided by your virtual tour provider when you create your listing. Simply copy and paste it where prompted and save your property. It\'s that easy!',
    },
  ];

  return (
    <>
      <SEOHead
        title="360 Virtual Tours"
        description="Learn more about 360 Virtual Tours on SaveOnYourHome. Enhance your home-buying experience with comprehensive, interactive, and realistic virtual property tours."
        keywords="360 virtual tours, virtual property tours, FSBO virtual tours, real estate virtual tours, home tours online"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img src="https://images.pexels.com/photos/3935333/pexels-photo-3935333.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="360 Virtual Tours" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>VIRTUAL TOURS</span>
              </div>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Learn More About <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>360 Virtual Tours</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                We believe in bringing the future of real estate right to your fingertips! Our commitment to enhancing your home-buying experience is unwavering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center">
            <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>WHY VIRTUAL TOURS</span>
          </div>
          <h2 className="mb-14 text-center text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
            Key Features of 360 Virtual Tours:
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 p-8 flex flex-col group relative"
                style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}
              >
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                <div className="mb-5 flex items-center justify-center rounded-2xl" style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245,245,244)' }}>
                  {feature.icon}
                </div>
                <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(26,24,22)' }}>{feature.title}</h3>
                <p style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Add Section */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center">
            <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>HOW IT WORKS</span>
          </div>
          <h2 className="mb-14 text-center text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
            Adding Virtual Tours To Your Listings
          </h2>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl p-8 flex gap-6 group relative"
                style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}
              >
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                <div className="flex-shrink-0 flex items-center justify-center rounded-2xl" style={{ width: '56px', height: '56px', backgroundColor: 'rgb(255,255,255)' }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(26,24,22)' }}>{step.number}</span>
                </div>
                <div>
                  <h3 className="mb-2" style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(26,24,22)' }}>{step.title}</h3>
                  <p style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="text-center mb-12">
            <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] mb-5" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
              Would you like to know more about 360 Virtual Tours?
            </h2>
            <p style={{ fontSize: '19px', lineHeight: '30px', color: 'rgb(100,100,100)', maxWidth: '600px', margin: '0 auto' }}>
              We're committed to making your home-selling journey seamless, transparent, and enjoyable. Embrace the future of real estate with 360 Virtual Tours.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-gray-200 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
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
                      className="w-full rounded-xl border px-4 outline-none transition-colors focus:border-gray-400"
                      style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)', backgroundColor: 'rgb(255,255,255)', borderColor: 'rgb(209,213,219)' }}
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
                      className="w-full rounded-xl border px-4 outline-none transition-colors focus:border-gray-400"
                      style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)', backgroundColor: 'rgb(255,255,255)', borderColor: 'rgb(209,213,219)' }}
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
                      className="w-full rounded-xl border px-4 outline-none transition-colors focus:border-gray-400"
                      style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)', backgroundColor: 'rgb(255,255,255)', borderColor: 'rgb(209,213,219)' }}
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
                      className="w-full rounded-xl border px-4 outline-none transition-colors focus:border-gray-400"
                      style={{ height: '52px', fontSize: '17px', color: 'rgb(26,24,22)', backgroundColor: 'rgb(255,255,255)', borderColor: 'rgb(209,213,219)' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Message *</label>
                  <textarea
                    value={data.message}
                    onChange={e => setData('message', e.target.value)}
                    placeholder="Tell us what you'd like to know about 360 Virtual Tours..."
                    required
                    rows={5}
                    className="w-full rounded-xl border px-4 py-3 outline-none transition-colors focus:border-gray-400 resize-none"
                    style={{ fontSize: '17px', color: 'rgb(26,24,22)', backgroundColor: 'rgb(255,255,255)', borderColor: 'rgb(209,213,219)' }}
                  />
                  {errors.message && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50 w-full sm:w-auto"
                  style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}
                >
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

VirtualTours.layout = (page) => <MainLayout>{page}</MainLayout>;

export default VirtualTours;

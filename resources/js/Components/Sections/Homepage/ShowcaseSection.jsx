import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

const ShowcaseSection = () => {
  const resources = [
    {
      title: 'CLAIM YOUR FREE FSBO SIGN!',
      description: 'Stand out and attract buyers with a professional "For Sale By Owner" yard sign — we\'ll ship it to you free!',
      link: '/claim-your-free-fsbo-sign',
      linkText: 'Learn More',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v.01M12 14v.01M16 14v.01M8 18v.01M12 18v.01M16 18v.01" />
        </svg>
      ),
    },
    {
      title: 'REQUEST FREE FSBO GUIDE',
      description: 'Get our step-by-step guide packed with expert tips to help you sell your home confidently without a realtor.',
      link: '/request-free-fsbo-guide',
      linkText: 'Learn More',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      title: 'JOIN THE FSBO WEEKLY CALL',
      description: 'Connect with other homeowners, ask questions, and get real-time advice on selling your home by owner.',
      link: '/join-the-fsbo-weekly-call',
      linkText: 'Learn More',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
    },
  ];

  const highlights = [
    { value: '$27K+', label: 'Avg. Savings' },
    { value: '0%', label: 'Commission' },
    { value: '5 min', label: 'Setup Time' },
  ];

  return (
    <section style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
        {/* Section Header */}
        <div className="mb-4 text-center">
          <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100, 100, 100)' }}>
            RESOURCES & SUPPORT
          </span>
        </div>
        <h2
          className="mb-5 text-center text-[29px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]"
          style={{ fontWeight: 700, color: 'rgb(26, 24, 22)' }}
        >
          We Are Always Ready to Assist You
        </h2>
        <p className="text-center mb-14" style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100, 100, 100)', maxWidth: '560px', margin: '0 auto 56px' }}>
          Selling by owner doesn't mean you're on your own. Get your questions answered so you can move forward with confidence.
        </p>

        {/* Three Resource Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-16">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 relative flex flex-col items-center p-8 text-center group"
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                boxShadow: 'rgba(0, 0, 0, 0.06) 0px 4px 24px, rgba(255, 255, 255, 0.8) 0px 1px 0px inset',
              }}
            >
              {/* Subtle top accent on hover */}
              <div
                className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ height: '2px', background: 'rgb(26, 24, 22)' }}
              />
              <div
                className="mb-5 flex items-center justify-center rounded-2xl"
                style={{ width: '62px', height: '62px', backgroundColor: 'rgb(245, 245, 244)' }}
              >
                {resource.icon}
              </div>
              <h3 className="mb-3" style={{ fontWeight: 700, fontSize: '16px', color: 'rgb(26, 24, 22)', letterSpacing: '0.5px' }}>
                {resource.title}
              </h3>
              <p className="flex-1" style={{ fontSize: '16px', lineHeight: '24px', color: 'rgb(100, 100, 100)' }}>
                {resource.description}
              </p>
              <Link
                href={resource.link}
                className="mt-5 inline-flex items-center gap-1.5 transition-all duration-300 hover:gap-2.5"
                style={{ fontSize: '14px', fontWeight: 600, color: 'rgb(26, 24, 22)' }}
              >
                {resource.linkText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* About / Contact CTA - Enhanced */}
        <div
          className="rounded-2xl border border-gray-200/60 overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(16px)',
            boxShadow: 'rgba(0, 0, 0, 0.06) 0px 4px 24px, rgba(255, 255, 255, 0.8) 0px 1px 0px inset',
          }}
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left - Image with overlay elements */}
            <div className="relative overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80"
                alt="Beautiful modern home"
                className="w-full h-[300px] sm:h-[360px] lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.target.src = '/images/home-img.webp'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

              {/* Floating stat badges */}
              <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                {highlights.map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-xl px-3 py-3 text-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{item.value}</div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.5px' }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Corner trust badge */}
              <div
                className="absolute top-5 left-5 rounded-full px-4 py-2 flex items-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.6)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '1px' }}>TRUSTED BY HOMEOWNERS</span>
              </div>
            </div>

            {/* Right - Content */}
            <div className="p-8 sm:p-10 md:p-14 flex flex-col justify-center">
              <div className="mb-4">
                <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100, 100, 100)' }}>
                  ABOUT
                </span>
              </div>
              <h2
                className="text-[29px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] mb-4"
                style={{ fontWeight: 700, color: 'rgb(26, 24, 22)' }}
              >
                SaveOnYourHome.com
              </h2>
              <p style={{ fontSize: '17px', lineHeight: '29px', color: 'rgb(100, 100, 100)', marginBottom: '16px' }}>
                We are Empowering Sellers and Connecting Buyers, and transforming the home buying process. Our platform provides every tool you need to sell your home confidently — <strong style={{ color: 'rgb(55, 55, 55)' }}>without paying a single dollar in commissions</strong>.
              </p>

              {/* Mini feature list */}
              <div className="space-y-2.5 mb-8">
                {['Free professional yard sign with QR code', 'Complete FSBO guide & weekly coaching calls', 'Secure messaging — your info stays private'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(26, 24, 22)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span style={{ fontSize: '16px', color: 'rgb(75, 75, 75)' }}>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full transition-colors hover:bg-gray-100"
                  style={{ border: '1px solid rgb(209, 213, 219)', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600, color: 'rgb(26, 24, 22)' }}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;

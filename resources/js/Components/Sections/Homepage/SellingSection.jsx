import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

const SellingSection = () => {
  const steps = [
    {
      title: 'CREATE YOUR LISTING',
      description: 'Easily craft a tailored listing complete with photos, videos, and detailed property information in under 5 minutes.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'SHARE & MARKET',
      description: 'Order a custom yard sign, share on social media, and get maximum exposure — all from your dashboard.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
      ),
    },
    {
      title: 'CONNECT WITH BUYERS',
      description: 'Interested buyers reach out at YOUR convenience without disclosing your personal contact information.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
    {
      title: 'SAVE THOUSANDS',
      description: 'No commissions. No fees. A typical seller saves $27,000 based on a $450,000 sale price and 6% commission.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'CLOSE THE DEAL',
      description: 'Empower yourself with comprehensive tools and resources, sell on your own terms, and keep your equity.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
  ];

  return (
    <section style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-20" style={{ maxWidth: '1400px' }}>
        {/* Section Header */}
        <div className="mb-4 text-center">
          <span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100, 100, 100)' }}>
            HOW IT WORKS
          </span>
        </div>
        <h2
          className="mb-14 text-center text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]"
          style={{ fontWeight: 700, color: 'rgb(26, 24, 22)' }}
        >
          Simple Process to Get it Sold
        </h2>

        {/* 5 Step Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200/60 transition-all hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 relative flex flex-col items-center p-6 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                boxShadow: 'rgba(0, 0, 0, 0.06) 0px 4px 24px, rgba(255, 255, 255, 0.8) 0px 1px 0px inset',
              }}
            >
              <div
                className="mb-4 flex items-center justify-center rounded-2xl"
                style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245, 245, 244)' }}
              >
                {step.icon}
              </div>
              <h3 className="mb-2" style={{ fontWeight: 700, fontSize: '13px', color: 'rgb(26, 24, 22)', letterSpacing: '0.5px' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '20px', color: 'rgb(100, 100, 100)' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/list-property"
            className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'rgb(26, 24, 22)', height: '48px', paddingLeft: '32px', paddingRight: '32px', fontSize: '14px', fontWeight: 600 }}
          >
            List My Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SellingSection;

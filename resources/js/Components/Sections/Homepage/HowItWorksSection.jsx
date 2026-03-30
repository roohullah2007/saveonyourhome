import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const HowItWorksSection = () => {
  const [sectionRef, isVisible] = useScrollReveal();
  const steps = [
    {
      number: '01',
      title: 'Create Your FREE Listing',
      description: 'Easily craft a tailored, all-inclusive listing complete with photos, videos, and detailed property information in under 5 minutes.'
    },
    {
      number: '02',
      title: 'Reach Buyers Directly',
      description: 'Interested buyers can conveniently reach out to you at YOUR convenience without the need to disclose your personal contact information.'
    },
    {
      number: '03',
      title: 'Share & Promote',
      description: 'Share your listing on social media, order a custom yard sign with just a few clicks, and maximize your property\'s exposure.'
    },
    {
      number: '04',
      title: 'Save Thousands & Close',
      description: 'Accept offers, negotiate on your own terms, and close the deal. A typical seller saves $27,000 in commissions!'
    }
  ];

  return (
    <section className="bg-[#F5F4F1] py-16 md:py-24">
      <div
        ref={sectionRef}
        className={`max-w-[1280px] mx-auto px-4 sm:px-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14 md:mb-16">
          <div className="inline-flex items-center bg-[#0891B2]/[0.08] rounded-full px-4 py-1.5 mb-5 sm:mb-6">
            <span className="text-[#0891B2] text-[13px] font-inter font-semibold tracking-wide uppercase">
              Simple Process
            </span>
          </div>

          <h2 className="text-[26px] sm:text-[34px] md:text-[44px] font-inter font-bold text-[#111] mb-4 tracking-[-0.03em] leading-[1.15]">
            How a FREE SAVEONYOURHOME Listing Works
          </h2>
          <p className="text-[14px] sm:text-[15px] md:text-[16px] text-gray-500 font-inter max-w-2xl mx-auto leading-[1.7]">
            Sell your home by owner in four simple steps.
            <br className="hidden sm:block" />
            No agents, no commissions, just results.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-7 h-full card-hover group border border-gray-100/80 relative overflow-hidden"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Step Number Background */}
              <div className="absolute -right-3 -top-4 text-[80px] sm:text-[100px] font-inter font-black text-[#0891B2]/[0.04] leading-none select-none">
                {step.number}
              </div>

              {/* Step Number */}
              <div className="inline-flex items-center justify-center w-10 h-10 bg-[#0891B2] rounded-xl mb-4 shadow-md shadow-[#0891B2]/20 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-[13px] font-inter font-bold">{step.number}</span>
              </div>

              {/* Title */}
              <h3 className="text-[16px] sm:text-[17px] md:text-[18px] font-inter font-semibold text-[#111] mb-2.5 sm:mb-3 tracking-[-0.01em]">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[13px] sm:text-[14px] text-gray-500 leading-[1.7] font-inter">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

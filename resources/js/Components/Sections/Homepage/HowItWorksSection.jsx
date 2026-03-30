import React from 'react';

const HowItWorksSection = () => {
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
    <section className="bg-[#EEEDEA] py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
            <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Simple Process
            </span>
          </div>

          <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            How a FREE SAVEONYOURHOME Listing Works
          </h2>
          <p className="text-[14px] md:text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Sell your home by owner in four simple steps.
          </p>
          <p className="text-[14px] md:text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            No agents, no commissions, just results.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300">
                {/* Step Number */}
                <div className="text-[#0891B2] text-sm font-semibold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  STEP {step.number}
                </div>

                {/* Title */}
                <h3 className="text-[18px] md:text-xl font-medium text-[#111] mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#666] leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
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

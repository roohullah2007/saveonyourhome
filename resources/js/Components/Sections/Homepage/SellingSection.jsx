import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles, DollarSign, Clock, Shield } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const SellingSection = () => {
  const [sectionRef, isVisible] = useScrollReveal();

  const features = [
    {
      icon: Sparkles,
      title: 'Supercharge Your Home\'s Sale!',
      description: 'Your listing receives maximum exposure on SaveOnYourHome.com, sparking interest which leads to the best offers.',
    },
    {
      icon: DollarSign,
      title: 'Save Thousands in Commission!',
      description: 'No commissions or fees. A typical seller saves $27,000 based on a $450,000 sales price and a 6% commission.',
    },
    {
      icon: Clock,
      title: 'Optimize Your Time, Minimize Your Effort!',
      description: 'Craft your listing with photos, videos, and details in under 5 minutes. Buyers reach out at your convenience.',
    },
  ];

  return (
    <section style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
      <div
        ref={sectionRef}
        className={`mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ maxWidth: '1400px' }}
      >
        {/* Section Header */}
        <div className="text-left mb-10" style={{ maxWidth: '720px' }}>
          <div className="mb-4">
            <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100, 100, 100)' }}>
              WHY SAVEONYOURHOME
            </span>
          </div>
          <h2
            className="mb-4 text-[29px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]"
            style={{ fontWeight: 700, color: 'rgb(26, 24, 22)' }}
          >
            Sell for Top Price. Pay Zero Commission.
          </h2>
        </div>

        {/* Two Column Layout: Images Left, Cards Right */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* Left Column - Images */}
          <div className="hidden lg:flex gap-4" style={{ height: '460px' }}>
            <div className="flex-1 overflow-hidden rounded-lg">
              <img
                src="https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Beautiful home for sale"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex-1 overflow-hidden rounded-lg">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Happy couple in new home"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 overflow-hidden rounded-lg">
                <img
                  src="https://images.pexels.com/photos/7641824/pexels-photo-7641824.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Keys to your new home"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mobile images */}
          <div className="flex lg:hidden gap-3">
            <div className="flex-1 overflow-hidden rounded-lg" style={{ height: '220px' }}>
              <img src="https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Home for sale" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex-[7] overflow-hidden rounded-lg">
                <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Happy couple" className="w-full h-full object-cover" style={{ height: '140px' }} />
              </div>
              <div className="flex-[3] overflow-hidden rounded-lg">
                <img src="https://images.pexels.com/photos/7641824/pexels-photo-7641824.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Keys" className="w-full h-full object-cover" style={{ height: '70px' }} />
              </div>
            </div>
          </div>

          {/* Right Column - Cards + Button */}
          <div className="space-y-5">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden border border-gray-200 p-5 sm:p-6 flex gap-4 shadow-sm relative group/card"
                  style={{ background: 'rgb(255, 255, 255)' }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                    style={{ height: '2px', background: 'rgb(26, 24, 22)' }}
                  />
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgb(245, 245, 244)' }}
                  >
                    <IconComponent className="w-6 h-6 text-[#1A1816]" />
                  </div>
                  <div>
                    <h3
                      className="mb-1.5 text-[18px] sm:text-[19px]"
                      style={{ fontWeight: 700, color: 'rgb(26, 24, 22)', lineHeight: '26px' }}
                    >
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: '16px', lineHeight: '24px', color: 'rgb(100, 100, 100)' }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/list-property"
                className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}
              >
                List My Home
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellingSection;

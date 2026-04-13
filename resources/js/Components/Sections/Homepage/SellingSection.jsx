import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles, DollarSign, Clock, Shield } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const SellingSection = () => {
  const [sectionRef, isVisible] = useScrollReveal();

  const features = [
    {
      icon: Sparkles,
      title: 'Supercharge Your Home\'s Sale with SaveOnYourHome.com!',
      description: 'List your property on SaveOnYourHome.com and watch the magic happen. Your listing receives maximum exposure, sparking interest which leads to the best offers.',
    },
    {
      icon: DollarSign,
      title: 'Save Thousands in Commission!',
      description: 'SaveOnYourHome.com does not charge sellers ANY commissions or fees. A typical seller will save $27,000! (based on a $450,000 sales price and a 6% real estate commission).',
    },
    {
      icon: Clock,
      title: 'Optimize Your Time, Minimize Your Effort!',
      description: 'Easily craft a tailored, all-inclusive listing complete with photos, videos, and detailed property information in under 5 minutes. Ordering a custom yard sign is just a few clicks away, and sharing your listing on social media is a breeze. Interested buyers can conveniently reach out to you at YOUR convenience without the need to disclose your personal contact information.',
    },
    {
      icon: Shield,
      title: 'Sell Your Home On Your Own Terms!',
      description: 'Empower yourself with our comprehensive tools and resources, allowing you to focus your time and energy on what truly matters to you.',
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
        <div className="text-center mb-10">
          <div className="mb-4">
            <span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100, 100, 100)' }}>
              WHY SAVEONYOURHOME
            </span>
          </div>
          <h2
            className="mb-4 text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]"
            style={{ fontWeight: 700, color: 'rgb(26, 24, 22)' }}
          >
            Sell Your Property for the Highest Possible Price and Avoid Paying Any Commissions
          </h2>
        </div>

        {/* Two Column Layout: Images Left, Content Right */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-14 items-center">

          {/* Left Column - Pill & Circle Images */}
          <div className="hidden lg:flex gap-4 justify-center" style={{ height: '500px' }}>
            {/* First image - tall pill */}
            <div className="overflow-hidden" style={{ borderRadius: '9999px', width: '130px', flexShrink: 0 }}>
              <img
                src="/images/sell-image.webp"
                alt="Beautiful home for sale"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Second column - pill (70%) + circle (30%) */}
            <div className="flex flex-col gap-4" style={{ width: '130px', flexShrink: 0 }}>
              <div className="overflow-hidden" style={{ borderRadius: '9999px', flex: '7 1 0%' }}>
                <img
                  src="/images/sell-img-2.webp"
                  alt="Happy family saving on commissions"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="overflow-hidden mx-auto"
                style={{ borderRadius: '50%', flex: '3 1 0%', aspectRatio: '1', width: '120px' }}
              >
                <img
                  src="/images/keys.webp"
                  alt="Keys to your new home"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mobile images */}
          <div className="flex lg:hidden gap-3 justify-center items-end">
            <div className="overflow-hidden" style={{ borderRadius: '9999px', width: '100px', height: '220px' }}>
              <img src="/images/sell-image.webp" alt="Home for sale" className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden" style={{ borderRadius: '9999px', width: '100px', height: '180px' }}>
              <img src="/images/sell-img-2.webp" alt="Happy family" className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden" style={{ borderRadius: '50%', width: '80px', height: '80px' }}>
              <img src="/images/keys.webp" alt="Keys" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right Column - Boxed Content */}
          <div className="space-y-5">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 p-5 sm:p-6 flex gap-4 shadow-sm"
                  style={{ background: 'rgb(255, 255, 255)' }}
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgb(245, 245, 244)' }}
                  >
                    <IconComponent className="w-5 h-5 text-[#1A1816]" />
                  </div>
                  <div>
                    <h3
                      className="mb-1.5 text-[16px] sm:text-[17px]"
                      style={{ fontWeight: 700, color: 'rgb(26, 24, 22)', lineHeight: '24px' }}
                    >
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: '14px', lineHeight: '22px', color: 'rgb(100, 100, 100)' }}>
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
                className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'rgb(26, 24, 22)', height: '48px', paddingLeft: '32px', paddingRight: '32px', fontSize: '15px', fontWeight: 600 }}
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

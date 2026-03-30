import React from 'react';
import { Link } from '@inertiajs/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const SellingSection = () => {
  const [sectionRef, isVisible] = useScrollReveal();
  const benefits = [
    'SaveOnYourHome.com does not charge sellers ANY commissions or fees.',
    'Easily craft a tailored listing complete with photos, videos, and property information in under 5 minutes.',
    'Interested buyers can conveniently reach out to you at YOUR convenience without disclosing your personal contact information.',
    'Ordering a custom yard sign is just a few clicks away, and sharing your listing on social media is a breeze.',
    'Empower yourself with comprehensive tools and resources. We\'re committed to providing free services to FSBO homeowners.'
  ];

  return (
    <section className="relative bg-white py-20 md:py-28 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#F5F4F1]/50 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#0891B2]/[0.03] rounded-full blur-3xl"></div>

      <div
        ref={sectionRef}
        className={`max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              <img
                src="/images/home-img-2.webp"
                alt="Beautiful home for sale by owner"
                className="w-full h-[320px] sm:h-[400px] lg:h-[480px] object-cover rounded-2xl sm:rounded-3xl shadow-xl"
              />

              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-4 md:-right-6 bg-white rounded-2xl shadow-2xl shadow-black/[0.08] p-5 border border-gray-100/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-md shadow-green-500/20">
                    <span className="text-white text-lg font-inter font-bold">$</span>
                  </div>
                  <div>
                    <p className="text-[24px] font-inter font-bold text-[#111] tracking-[-0.02em]">$27,000</p>
                    <p className="text-[12px] font-inter text-gray-400 font-medium">Avg. Savings Per Sale</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            {/* Badge */}
            <div className="inline-flex items-center bg-[#0891B2]/[0.08] rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#0891B2] text-[13px] font-inter font-semibold tracking-wide uppercase">
                Why Choose Us
              </span>
            </div>

            <h2 className="text-[26px] sm:text-[32px] md:text-[40px] font-inter font-bold leading-[1.15] text-[#111] mb-5 tracking-[-0.03em]">
              Sell Your Property,{' '}
              <span className="gradient-text">Keep Your Equity</span>
            </h2>

            <p className="text-[14px] sm:text-[15px] font-inter text-gray-500 mb-7 sm:mb-8 leading-[1.75]">
              Eliminating commission is the easiest way to maximize sales proceeds for sellers without increasing cost for buyers. List your property on SaveOnYourHome.com and take full control — your listing receives maximum exposure, connecting you directly with serious buyers.
            </p>

            {/* Benefits List */}
            <div className="space-y-3.5 mb-9">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-[14px] font-inter font-medium text-gray-600 leading-[1.6]">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/list-property"
              className="inline-flex items-center gap-2.5 bg-[#0891B2] text-white rounded-full px-7 py-3.5 font-inter font-semibold text-[14px] transition-all duration-300 hover:bg-[#0E7490] hover:shadow-lg hover:shadow-[#0891B2]/20 hover:-translate-y-[1px]"
            >
              <span>List Your Property</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellingSection;

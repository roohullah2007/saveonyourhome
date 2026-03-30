import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Home, DollarSign, Shield } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const CTABannerSection = () => {
  const [sectionRef, isVisible] = useScrollReveal();

  return (
    <section className="bg-white py-20 md:py-28">
      <div
        ref={sectionRef}
        className={`max-w-[1280px] mx-auto px-4 sm:px-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0C4A5E] via-[#0E6377] to-[#0891B2]">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.04] rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/[0.03] rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#06B6D4]/10 rounded-full blur-3xl" />

          <div className="relative z-10 px-6 sm:px-10 md:px-16 py-14 md:py-20">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/10">
                  <span className="text-white/90 text-[13px] font-inter font-semibold tracking-wide uppercase">
                    Start Today
                  </span>
                </div>

                <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-inter font-bold text-white leading-[1.15] tracking-[-0.03em] mb-5">
                  Ready to Save Thousands on Your Home Sale?
                </h2>

                <p className="text-[15px] md:text-[16px] font-inter text-white/70 leading-[1.75] mb-8 max-w-lg">
                  Join thousands of homeowners who have taken control of their sale and kept more money in their pockets. It takes less than 5 minutes to get started.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/list-property"
                    className="inline-flex items-center justify-center gap-2.5 bg-white text-[#0891B2] rounded-full px-8 py-4 font-inter font-semibold text-[14px] transition-all duration-300 hover:bg-white/90 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-[1px]"
                  >
                    <span>List Your Property Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/properties"
                    className="inline-flex items-center justify-center gap-2.5 text-white rounded-full px-8 py-4 font-inter font-semibold text-[14px] transition-all duration-300 hover:bg-white/10 border border-white/20"
                  >
                    <span>Browse Properties</span>
                  </Link>
                </div>
              </div>

              {/* Right - Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/[0.08] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/[0.12] transition-all duration-300">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    <DollarSign className="w-5 h-5 text-emerald-300" />
                  </div>
                  <h4 className="text-white text-[16px] font-inter font-semibold mb-1.5">$0 Commission</h4>
                  <p className="text-white/50 text-[13px] font-inter leading-[1.6]">No fees, no hidden charges. Ever.</p>
                </div>

                <div className="bg-white/[0.08] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/[0.12] transition-all duration-300">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    <Home className="w-5 h-5 text-cyan-300" />
                  </div>
                  <h4 className="text-white text-[16px] font-inter font-semibold mb-1.5">5 Min Setup</h4>
                  <p className="text-white/50 text-[13px] font-inter leading-[1.6]">List your property in minutes, not days.</p>
                </div>

                <div className="bg-white/[0.08] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/[0.12] transition-all duration-300">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-5 h-5 text-amber-300" />
                  </div>
                  <h4 className="text-white text-[16px] font-inter font-semibold mb-1.5">Full Control</h4>
                  <p className="text-white/50 text-[13px] font-inter leading-[1.6]">You set the price and manage showings.</p>
                </div>

                <div className="bg-white/[0.08] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/[0.12] transition-all duration-300">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-[16px] font-inter font-bold">$27K</span>
                  </div>
                  <h4 className="text-white text-[16px] font-inter font-semibold mb-1.5">Avg. Savings</h4>
                  <p className="text-white/50 text-[13px] font-inter leading-[1.6]">Keep your hard-earned equity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABannerSection;

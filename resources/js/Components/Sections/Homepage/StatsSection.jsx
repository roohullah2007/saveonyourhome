import React from 'react';
import { Link } from '@inertiajs/react';
import { Users, TrendingUp, Clock, DollarSign } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: '96.5%',
      label: 'Agent Referrals',
      description: 'of MLS sales came from buyer agents'
    },
    {
      icon: TrendingUp,
      number: '32%',
      label: 'Faster Sales',
      description: 'when listed on MLS'
    },
    {
      icon: DollarSign,
      number: '$5,500+',
      label: 'Average Savings',
      description: 'vs traditional 6% commission'
    },
    {
      icon: Clock,
      number: '24hrs',
      label: 'Quick Listing',
      description: 'live on MLS within a day'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Your Package',
      description: 'Select the flat-fee MLS package that fits your needs and budget.'
    },
    {
      number: '02',
      title: 'Submit Your Listing',
      description: 'Provide property details, photos, and pricing information.'
    },
    {
      number: '03',
      title: 'Go Live on MLS',
      description: 'Your listing appears on the MLS and syndicates to Zillow, Realtor.com, and more.'
    },
    {
      number: '04',
      title: 'Receive Offers',
      description: 'Buyer agents contact you directly. You handle negotiations and closing.'
    }
  ];

  return (
    <section className="bg-[#EEEDEA] py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-[32px] md:text-[40px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Get Maximum Exposure by Listing on the MLS
          </h2>
          <p className="text-[14px] md:text-[16px] text-[#666] font-medium max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Reach More Buyers by Working with Agents.
          </p>
          <p className="text-[14px] md:text-[16px] text-[#666] font-medium max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            A local flat-fee MLS listing increases the likelihood of selling your property faster.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0891B2]/10 rounded-xl mb-4">
                  <IconComponent className="w-6 h-6 text-[#0891B2]" />
                </div>
                <h4
                  className="text-[32px] md:text-[40px] text-[#111] font-semibold mb-1"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {stat.number}
                </h4>
                <p
                  className="text-[14px] text-[#111] font-medium"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-[12px] text-[#666]"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* MLS Info & How It Works */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Why MLS */}
          <div className="bg-white rounded-2xl p-8">
            <h3
              className="text-[24px] font-medium text-[#111] mb-6"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Why List on the MLS?
            </h3>
            <p
              className="text-[14px] md:text-[16px] text-[#666] mb-6 leading-relaxed"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Listing on the MLS significantly increases your chances of selling your house faster.
              96.5% of our sellers who have listed and sold on the MLS were referred by a buyer's agent
              who found the listing on the MLS.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#0891B2] rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-[14px] text-[#666]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  <strong className="text-[#111]">Maximum Exposure:</strong> Your listing syndicates to Zillow, Realtor.com, Trulia, Redfin, and hundreds more sites.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#0891B2] rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-[14px] text-[#666]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  <strong className="text-[#111]">Buyer Agent Access:</strong> Agents actively searching for properties for their clients will find your home.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#0891B2] rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-[14px] text-[#666]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  <strong className="text-[#111]">Save Thousands:</strong> Pay a flat fee instead of the traditional 3% listing agent commission.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#0891B2] rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-[14px] text-[#666]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  <strong className="text-[#111]">Full Control:</strong> You set the price, schedule showings, and negotiate directly with buyers.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#0891B2] rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-[14px] text-[#666]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  <strong className="text-[#111]">Professional Credibility:</strong> Buyers and agents take MLS listings more seriously than FSBO-only listings.
                </p>
              </li>
            </ul>

            <Link
              href="/sellers"
              className="inline-flex items-center gap-[0.4rem] bg-[#0891B2] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#0E7490]"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              <span>View MLS Packages</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_stats" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                  <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_stats)">
                  <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                </g>
              </svg>
            </Link>
          </div>

          {/* Right - How It Works */}
          <div>
            <h3
              className="text-[24px] font-medium text-[#111] mb-6"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              How a Flat-Fee MLS Listing Works
            </h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#0891B2] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">{step.number}</span>
                    </div>
                    <div>
                      <h4
                        className="text-[16px] font-medium text-[#111] mb-1"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {step.title}
                      </h4>
                      <p
                        className="text-[14px] text-[#666]"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#0891B2]/5 rounded-xl border border-[#0891B2]/20">
              <p className="text-[14px] text-[#666] text-center" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                <strong className="text-[#111]">Powered by FFMLSOK</strong> - Oklahoma's trusted flat-fee MLS listing service
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

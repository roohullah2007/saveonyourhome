import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Users, TrendingUp, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const MLSSection = () => {
  const [sectionRef, isVisible] = useScrollReveal();
  const { companyLogos = [] } = usePage().props;
  const companyNames = companyLogos.length > 0
    ? companyLogos.filter(l => l.name !== 'MLS').map(l => l.name).join(', ')
    : 'Zillow, Realtor.com, Trulia, Redfin, and more';

  const stats = [
    {
      icon: Users,
      value: '96.5%',
      label: 'Agent Referrals',
      description: 'of MLS sales came from buyer agents'
    },
    {
      icon: TrendingUp,
      value: '32%',
      label: 'Faster Sales',
      description: 'when listed on MLS'
    },
    {
      icon: DollarSign,
      value: '$5,500+',
      label: 'Average Savings',
      description: 'vs traditional 6% commission'
    },
    {
      icon: Clock,
      value: '48hrs',
      label: 'Quick Listing',
      description: 'live on MLS within two days'
    }
  ];

  const benefits = [
    {
      title: 'Maximum Exposure',
      description: `Your listing syndicates to ${companyNames}, and hundreds more sites.`
    },
    {
      title: 'Buyer Agent Access',
      description: 'Agents actively searching for properties for their clients will find your home.'
    },
    {
      title: 'Save Thousands',
      description: 'Pay a flat fee instead of the traditional 3% listing agent commission.'
    },
    {
      title: 'Full Control',
      description: 'You set the price, schedule showings, and negotiate directly with buyers.'
    },
    {
      title: 'Professional Credibility',
      description: 'Buyers and agents take MLS listings more seriously than FSBO-only listings.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose the MLS option that works best for you.',
      description: 'Payment will be due after your property is listed on the MLS.'
    },
    {
      number: '02',
      title: 'Complete the simple required MLS forms.',
      description: "You'll receive the forms via DocuSign emails."
    },
    {
      number: '03',
      title: 'Enjoy the POWER OF THE MLS as it starts to work for you.',
      description: 'Once your property is listed on the MLS, agents will contact you directly to schedule showings!'
    },
    {
      number: '04',
      title: 'Start working directly with buyer agents.',
      description: 'Agents will submit offers directly to you. Remember, all buyer agent commissions are negotiable!'
    },
    {
      number: '05',
      title: 'Accept & Close',
      description: 'Accept your best offer, then close! If you find your own buyer, pay nothing in broker commissions!'
    }
  ];

  return (
    <section style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
      <div
        ref={sectionRef}
        className={`mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ maxWidth: '1400px' }}
      >
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="mb-4">
            <span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100, 100, 100)' }}>
              MLS LISTING
            </span>
          </div>
          <h2
            className="mb-4 text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]"
            style={{ fontWeight: 700, color: 'rgb(26, 24, 22)' }}
          >
            Get Maximum Exposure on the MLS
          </h2>
          <p style={{ fontSize: '15px', color: 'rgb(100, 100, 100)', maxWidth: '600px', margin: '0 auto', lineHeight: '24px' }}>
            Reach more buyers by working with agents. A local flat-fee MLS listing increases the likelihood of selling your property faster.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-14">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center card-hover border border-gray-100/80 group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#1A1816]/10 to-[#1A1816]/5 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-5 h-5 text-[#1A1816]" />
                </div>
                <h4 className="text-[22px] sm:text-[28px] md:text-[36px] text-[#111] font-bold mb-1 tracking-[-0.03em]">
                  {stat.value}
                </h4>
                <p className="text-[13px] text-[#111] font-semibold mb-0.5">
                  {stat.label}
                </p>
                <p className="text-[12px] text-gray-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Why List on MLS */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100/80 shadow-sm">
            <h3 className="text-[22px] font-bold text-[#111] mb-5 tracking-[-0.02em]">
              Why List on the MLS?
            </h3>
            <p className="text-[15px] text-gray-500 mb-6 leading-[1.7]">
              Listing on the MLS significantly increases your chances of selling your house faster. 96.5% of our sellers who have listed and sold on the MLS were referred by a buyer's agent who found the listing on the MLS.
            </p>
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1A1816] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-[14px] text-gray-500">
                    <strong className="text-[#111] font-semibold">{benefit.title}:</strong> {benefit.description}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              href="/our-packages"
              className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: 'rgb(26, 24, 22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}
            >
              View MLS Packages
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Column - How It Works */}
          <div>
            <h3 className="text-[22px] font-bold text-[#111] mb-6 tracking-[-0.02em]">
              How a Flat-Fee MLS Listing Works
            </h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 card-hover border border-gray-100/80 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#1A1816] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-[#1A1816]/20 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-[12px] font-bold">{step.number}</span>
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#111] mb-1 tracking-[-0.01em]">
                        {step.title}
                      </h4>
                      <p className="text-[13px] text-gray-500 leading-[1.6]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Highlight Text */}
            <div className="mt-5 bg-gradient-to-r from-[#1A1816]/10 to-[#1A1816]/5 rounded-2xl p-5 border border-[#1A1816]/15">
              <p className="text-[14px] md:text-[15px] text-[#1A1816] font-semibold text-center tracking-[-0.01em]">
                If you find your own buyer, pay nothing in broker commissions!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MLSSection;

import React from 'react';
import { Link } from '@inertiajs/react';
import { Signpost, BookOpen, MessageCircle } from 'lucide-react';

const ShowcaseSection = () => {
  const resources = [
    {
      icon: Signpost,
      emoji: '',
      title: 'The Ultimate FSBO Seller Guide',
      description: 'We provide the most comprehensive suite of FREE services to FSBO sellers, including robust listings, pricing guidance, marketing tools, and more. Our guide walks you through every step.',
      link: '/sellers',
      linkText: 'View the Guide'
    },
    {
      icon: BookOpen,
      emoji: '',
      title: 'How to Sell Your Home By Owner',
      description: 'Eliminate commissions and maximize your sales proceeds. List your property, connect directly with buyers, and take full control of your home sale with our free tools.',
      link: '/list-property',
      linkText: 'List Your Home'
    },
    {
      icon: MessageCircle,
      emoji: '',
      title: 'Search For Your Dream Home',
      description: 'Browse properties 24/7, get detailed information, schedule appointments, and connect directly with sellers. No agent commissions mean you can afford more home for your money.',
      link: '/properties',
      linkText: 'Search Now'
    }
  ];

  return (
    <section className="bg-[#EEEDEA] py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Three Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0891B2]/10 rounded-xl mb-5">
                  <IconComponent className="w-7 h-7 text-[#0891B2]" />
                </div>
                <h3
                  className="text-[20px] md:text-[22px] font-semibold text-[#111] mb-3"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {resource.title}
                </h3>
                <p
                  className="text-[14px] text-[#666] mb-6 leading-relaxed"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {resource.description}
                </p>
                <Link
                  href={resource.link}
                  className="inline-flex items-center gap-2 text-[#0891B2] font-medium text-sm group-hover:gap-3 transition-all duration-300"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {resource.linkText}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 10H15M15 10L10 5M15 10L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>

        {/* We Are Always Ready Section */}
        <div className="bg-white rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left - Image */}
            <div className="relative">
              <img
                src="/images/home-img.webp"
                alt="SaveOnYourHome support team"
                className="w-full h-[300px] lg:h-full object-cover"
              />
            </div>

            {/* Right - Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-4">
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  About
                </span>
              </div>
              <h2
                className="text-[28px] md:text-[36px] font-semibold text-[#111] mb-4 leading-tight"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                SaveOnYourHome.com
              </h2>
              <p
                className="text-[14px] md:text-[16px] text-[#666] mb-8 leading-relaxed"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                We're on a mission to transform the home buying and selling experience, making it more accessible, transparent, and cost-effective for everyone involved. See what we're all about!
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-[0.4rem] bg-[#0891B2] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#0E7490] w-fit"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <span>Learn More</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 10H15M15 10L10 5M15 10L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;

import React from 'react';
import { Link } from '@inertiajs/react';
import { Signpost, BookOpen, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const ShowcaseSection = () => {
  const [sectionRef, isVisible] = useScrollReveal();
  const [aboutRef, aboutVisible] = useScrollReveal();

  const resources = [
    {
      icon: Signpost,
      title: 'The Ultimate FSBO Seller Guide',
      description: 'We provide the most comprehensive suite of FREE services to FSBO sellers, including robust listings, pricing guidance, marketing tools, and more. Our guide walks you through every step.',
      link: '/sellers',
      linkText: 'View the Guide',
      accent: 'from-[#0891B2]/10 to-[#06B6D4]/5',
      iconColor: 'text-[#0891B2]'
    },
    {
      icon: BookOpen,
      title: 'How to Sell Your Home By Owner',
      description: 'Eliminate commissions and maximize your sales proceeds. List your property, connect directly with buyers, and take full control of your home sale with our free tools.',
      link: '/list-property',
      linkText: 'List Your Home',
      accent: 'from-emerald-500/10 to-emerald-400/5',
      iconColor: 'text-emerald-500'
    },
    {
      icon: MessageCircle,
      title: 'Search For Your Dream Home',
      description: 'Browse properties 24/7, get detailed information, schedule appointments, and connect directly with sellers. No agent commissions mean you can afford more home for your money.',
      link: '/properties',
      linkText: 'Search Now',
      accent: 'from-violet-500/10 to-violet-400/5',
      iconColor: 'text-violet-500'
    }
  ];

  return (
    <section className="bg-[#F5F4F1] py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Three Resource Cards */}
        <div
          ref={sectionRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 md:p-9 card-hover group border border-gray-100/80 relative overflow-hidden"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Subtle top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0891B2] to-[#06B6D4] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${resource.accent} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-6 h-6 ${resource.iconColor}`} />
                </div>
                <h3 className="text-[18px] sm:text-[20px] md:text-[22px] font-inter font-semibold text-[#111] mb-3 tracking-[-0.02em]">
                  {resource.title}
                </h3>
                <p className="text-[14px] text-gray-500 mb-7 leading-[1.7] font-inter">
                  {resource.description}
                </p>
                <Link
                  href={resource.link}
                  className="inline-flex items-center gap-2 text-[#0891B2] font-inter font-semibold text-[14px] group-hover:gap-3 transition-all duration-300"
                >
                  {resource.linkText}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* About Section */}
        <div
          ref={aboutRef}
          className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100/50 transition-all duration-700 delay-200 ${
            aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left - Image */}
            <div className="relative overflow-hidden group/img">
              <img
                src="/images/home-img.webp"
                alt="SaveOnYourHome support team"
                className="w-full h-[280px] sm:h-[340px] lg:h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

              {/* Floating badge on image */}
              <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-white/50">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#0891B2]" />
                  <div>
                    <p className="text-[13px] font-inter font-bold text-[#111]">Trusted by Homeowners</p>
                    <p className="text-[11px] font-inter text-gray-400">Across Oklahoma & Beyond</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="p-7 sm:p-10 md:p-14 flex flex-col justify-center">
              <div className="inline-flex items-center bg-[#0891B2]/[0.08] rounded-full px-4 py-1.5 mb-5 w-fit">
                <span className="text-[#0891B2] text-[13px] font-inter font-semibold tracking-wide uppercase">
                  About
                </span>
              </div>
              <h2 className="text-[26px] sm:text-[32px] md:text-[38px] font-inter font-bold text-[#111] mb-5 leading-[1.15] tracking-[-0.03em]">
                SaveOnYourHome.com
              </h2>
              <p className="text-[14px] sm:text-[15px] text-gray-500 mb-8 leading-[1.75] font-inter">
                We're on a mission to transform the home buying and selling experience, making it more accessible, transparent, and cost-effective for everyone involved. See what we're all about!
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 bg-[#0891B2] text-white rounded-full px-7 py-3.5 font-inter font-semibold text-[14px] transition-all duration-300 hover:bg-[#0E7490] hover:shadow-lg hover:shadow-[#0891B2]/20 hover:-translate-y-[1px] w-fit"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;

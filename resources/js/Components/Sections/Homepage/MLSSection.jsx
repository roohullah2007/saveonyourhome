import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const CTACardsSection = () => {
  const [sectionRef, isVisible] = useScrollReveal();

  const cards = [
    {
      label: 'SELLER GUIDE',
      title: 'The Ultimate FSBO Seller Guide',
      description: 'Get an in depth look at all of the steps involved in selling your home.',
      linkText: 'View the Guide',
      href: '/sell-your-home',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      label: 'LIST YOUR HOME',
      title: 'How to Sell Your Home By Owner',
      description: 'Expose your property to buyers. Get offers to your inbox and start saving the commissions with SaveOnYourHome.',
      linkText: 'List Your Home',
      href: '/list-property',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      label: 'SEARCH',
      title: 'Search For Your Dream Home',
      description: 'Browse through SaveOnYourHome to find your dream home!',
      linkText: 'Search Now',
      href: '/properties',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      label: 'ABOUT',
      title: 'About SaveOnYourHome.com',
      description: 'We are Empowering Sellers and Connecting Buyers, and transforming the home buying process. See what we are all about!',
      linkText: 'Learn More',
      href: '/about',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      ),
    },
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
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 relative flex flex-col p-7 group"
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                boxShadow: 'rgba(0, 0, 0, 0.06) 0px 4px 24px, rgba(255, 255, 255, 0.8) 0px 1px 0px inset',
              }}
            >
              {/* Top accent on hover */}
              <div
                className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ height: '2px', background: 'rgb(26, 24, 22)' }}
              />
              <div
                className="mb-5 flex items-center justify-center rounded-2xl"
                style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245, 245, 244)' }}
              >
                {card.icon}
              </div>
              <span style={{ fontWeight: 600, fontSize: '11px', letterSpacing: '2px', color: 'rgb(100, 100, 100)', marginBottom: '8px', display: 'block' }}>
                {card.label}
              </span>
              <h3 className="mb-3" style={{ fontWeight: 700, fontSize: '18px', color: 'rgb(26, 24, 22)', lineHeight: '26px' }}>
                {card.title}
              </h3>
              <p className="flex-1" style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100, 100, 100)' }}>
                {card.description}
              </p>
              <Link
                href={card.href}
                className="mt-5 inline-flex items-center gap-1.5 transition-all duration-300 hover:gap-2.5"
                style={{ fontSize: '13px', fontWeight: 600, color: 'rgb(26, 24, 22)' }}
              >
                {card.linkText}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTACardsSection;

import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function BuyersGuide() {
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    { number: '1', title: 'Determine Your Budget and Needs', content: [
      { sub: 'Financing Pre-Approval', text: 'Get pre-approved for a mortgage to understand your buying power and show sellers you are a serious buyer. This helps you set a realistic budget before you start your search.' },
      { sub: 'Identify Your Needs', text: 'Make a list of must-have features, preferred location, school districts, and commute times. Knowing your priorities helps narrow down properties that truly fit your lifestyle.' },
    ]},
    { number: '2', title: 'Begin Your Home Search', content: [
      { sub: 'Online Listings', text: 'Browse SaveOnYourHome.com listings to discover homes for sale in your desired area. Filter by price, location, and features to find properties that match your criteria.' },
      { sub: 'Real Estate Agent Assistance', text: 'Work with a realtor if desired for additional guidance and access to local market expertise. An agent can help you navigate competitive markets and negotiate on your behalf.' },
      { sub: 'Schedule Viewings', text: 'Contact sellers directly through SaveOnYourHome.com to schedule home tours. Take detailed notes and pictures during each visit to compare properties later.' },
    ]},
    { number: '3', title: 'Home Inspections and Due Diligence', content: [
      { sub: 'Home Inspection', text: 'Hire a qualified inspector to thoroughly evaluate the property for structural issues, plumbing, electrical, and other potential problems before committing to a purchase.' },
      { sub: 'Research Neighborhood', text: 'Investigate the neighborhood for safety, nearby schools, amenities, and future development plans. Visit at different times of day to get a complete picture of the area.' },
      { sub: 'Review Legal Documents', text: 'Work with an attorney to review contracts, disclosures, and any legal documents associated with the property. This protects your interests throughout the transaction.' },
    ]},
    { number: '4', title: 'Explore Transformation Potential', content: [
      { sub: 'Consult Architects and Builders', text: 'If you are considering renovations, discuss your vision with architects and builders. Get cost estimates and design ideas to understand the full potential of the property before making an offer.' },
    ]},
    { number: '5', title: 'Make an Offer', content: [
      { sub: 'Low Offer Pros and Cons', text: 'A lower offer leaves room to negotiate upward, but you risk losing the home to another buyer. This strategy works best in a buyer\'s market with less competition.' },
      { sub: 'Higher Offer Pros and Cons', text: 'A higher offer can help you secure the home faster and stand out in a competitive market, but it may be more costly. Consider your budget and how much the property is worth to you.' },
    ]},
    { number: '6', title: 'Secure Financing', content: [
      { sub: 'Finalize Mortgage', text: 'Complete your full loan application with your lender. Provide all required documentation promptly to avoid delays in the approval process.' },
      { sub: 'Home Appraisal', text: 'Your lender will order a home appraisal to assess the property\'s market value. This ensures the loan amount aligns with the home\'s worth and protects both you and the lender.' },
    ]},
    { number: '7', title: 'Finalize the Sale', content: [
      { sub: 'Home Insurance', text: 'Obtain homeowners insurance before closing. Your lender will require proof of coverage, and having it in place protects your investment from day one.' },
      { sub: 'Final Walk-Through', text: 'Conduct a final walk-through of the property to ensure it is in the expected condition and that any agreed-upon repairs have been completed.' },
      { sub: 'Closing', text: 'Consult with your attorney to guide you through the closing process. Review all documents carefully, sign the paperwork, and receive the keys to your new home.' },
    ]},
    { number: '8', title: 'Move In and Enjoy Your New Home', content: [
      { sub: 'Movers', text: 'Arrange for professional movers or plan your relocation to make the transition to your new home as smooth and stress-free as possible.' },
      { sub: 'Utilities', text: 'Transfer or set up utilities including electricity, gas, water, internet, and cable before move-in day so everything is ready when you arrive.' },
      { sub: 'Leave a Review', text: 'After settling in, share your experience on SaveOnYourHome.com to help future buyers navigate their own home-buying journey.' },
    ]},
  ];

  const faqs = [
    { q: 'How long does the home buying process take?', a: 'The home buying process typically takes 30 to 60 days from the time your offer is accepted to closing, though the overall search period varies. Factors like financing, inspections, and negotiations can affect the timeline. Starting with mortgage pre-approval and having your documents ready can help speed things up.' },
    { q: 'Do I need a real estate agent to buy a home?', a: 'No, you do not need a real estate agent to buy a home. Many buyers successfully purchase properties on their own, especially with platforms like SaveOnYourHome.com that connect you directly with sellers. However, an agent can be helpful if you want additional guidance navigating the process or negotiating offers.' },
    { q: 'What is the typical down payment for a home?', a: 'The typical down payment ranges from 3% to 20% of the home\'s purchase price, depending on the loan type and your financial situation. FHA loans may require as little as 3.5%, while conventional loans often require 5% to 20%. A larger down payment can lower your monthly mortgage payments and help you avoid private mortgage insurance.' },
  ];

  const ctaCards = [
    { title: 'SELL YOUR HOME FSBO', desc: 'List your property on SaveOnYourHome.com and start receiving offers directly. No commissions, no hassle.', link: '/list-property', linkText: 'List Your Home', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>) },
    { title: 'SEARCH FOR YOUR DREAM HOME', desc: 'Browse through SaveOnYourHome.com to find your perfect home!', link: '/properties', linkText: 'Search Now', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>) },
    { title: 'ABOUT SAVEONYOURHOME.COM', desc: 'We are Empowering Sellers and Connecting Buyers. See what we are all about!', link: '/about', linkText: 'Learn More', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>) },
  ];

  return (
    <>
      <SEOHead
        title="Buyers Guide - Steps to Buy A Home"
        description="Step-by-step guide to buying your dream home. Learn how to budget, search, inspect, make offers, and close on your new home with SaveOnYourHome.com."
        keywords="home buying guide, how to buy a home, home buying steps, first time home buyer, buy house without realtor"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img src="https://images.pexels.com/photos/7578939/pexels-photo-7578939.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Home buyers guide" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[640px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>BUYERS GUIDE</span>
              </div>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Steps to Buy A <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Home</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '560px' }}>
                Are you planning to buy a home, either with or without a real estate agent? SaveOnYourHome.com is here to guide you through the entire home-buying process.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/properties" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(26,24,22)', height: '50px', paddingLeft: '31px', paddingRight: '31px', fontSize: '15px', fontWeight: 600 }}>Search Homes <ArrowRight className="w-5 h-5" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section — Timeline Layout */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>STEP-BY-STEP</span></div>
          <h2 className="mb-5 text-center text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>How to Buy Your Dream Home</h2>
          <p className="text-center mb-14" style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)', maxWidth: '640px', margin: '0 auto 56px' }}>
            Follow these 8 steps to navigate the home-buying process with confidence. SaveOnYourHome.com provides the tools and guidance you need at every stage.
          </p>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: 'rgb(220,220,220)', transform: 'translateX(-0.5px)' }} />

            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={step.number} className={`relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 ${i > 0 ? 'mt-8 md:mt-10' : ''}`}>
                  {/* Center dot on timeline */}
                  <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 z-10 items-center justify-center rounded-full" style={{ width: '44px', height: '48px', backgroundColor: 'rgb(26,24,22)', boxShadow: 'rgba(26,24,22,0.2) 0px 4px 12px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{step.number}</span>
                  </div>

                  {/* Content card */}
                  <div className={`${isLeft ? 'md:col-start-1 md:pr-8' : 'md:col-start-2 md:pl-8'} ${!isLeft ? 'md:col-start-2' : ''}`} style={{ order: isLeft ? 1 : 2 }}>
                    <div className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 p-6 group relative" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                      <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                      <div className="flex items-start gap-4">
                        <div className="md:hidden flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: '44px', height: '48px', backgroundColor: 'rgb(26,24,22)' }}>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{step.number}</span>
                        </div>
                        <div className="flex-1">
                          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'rgb(26,24,22)', marginBottom: '12px' }}>Step {step.number}: {step.title}</h3>
                          <div className="space-y-3">
                            {step.content.map((item, j) => (
                              <p key={j} style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(75,75,75)' }}>
                                <strong style={{ color: 'rgb(26,24,22)' }}>{item.sub}:</strong> {item.text}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empty spacer for opposite side */}
                  <div className={`hidden md:block ${isLeft ? 'md:col-start-2' : 'md:col-start-1'}`} style={{ order: isLeft ? 2 : 1 }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Cards */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {ctaCards.map((card, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 relative flex flex-col items-center p-8 text-center group" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                <div className="mb-5 flex items-center justify-center rounded-2xl" style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245,245,244)' }}>{card.icon}</div>
                <h3 className="mb-3" style={{ fontWeight: 700, fontSize: '15px', color: 'rgb(26,24,22)', letterSpacing: '0.5px' }}>{card.title}</h3>
                <p className="flex-1" style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>{card.desc}</p>
                <Link href={card.link} className="mt-5 inline-flex items-center gap-1.5 transition-all duration-300 hover:gap-2.5" style={{ fontSize: '14px', fontWeight: 600, color: 'rgb(26,24,22)' }}>{card.linkText} <ArrowRight className="w-5 h-5" /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
            {/* Left side */}
            <div className="lg:col-span-2">
              <div className="mb-4"><span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>BUYER FAQS</span></div>
              <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)', marginBottom: '16px' }}>Frequently Asked Questions</h2>
              <p style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)', marginBottom: '24px' }}>
                Have more questions about buying a home? We are here to help you every step of the way.
              </p>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(26,24,22)', height: '50px', paddingLeft: '31px', paddingRight: '31px', fontSize: '15px', fontWeight: 600 }}>Ask Questions <ArrowRight className="w-5 h-5" /></Link>
            </div>

            {/* Right side — accordion */}
            <div className="lg:col-span-3 space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-gray-200/60 overflow-hidden" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                    <span style={{ fontSize: '17px', fontWeight: 600, color: 'rgb(26,24,22)' }}>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && <div className="px-5 pb-5"><p style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>{faq.a}</p></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing Message */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="rounded-2xl border border-gray-200/60 p-8 md:p-12 text-center" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
            <h2 className="text-[24px] leading-[33px] sm:text-[28px] sm:leading-[37px] lg:text-[33px] lg:leading-[42px] mb-4" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
              Your Dream Home Awaits
            </h2>
            <p style={{ fontSize: '18px', lineHeight: '28px', color: 'rgb(100,100,100)', maxWidth: '640px', margin: '0 auto' }}>
              With SaveOnYourHome.com by your side, you are well-equipped to find and purchase your dream home. Best of luck with your home buying journey!
            </p>
            <div className="mt-8">
              <Link href="/properties" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(26,24,22)', height: '50px', paddingLeft: '31px', paddingRight: '31px', fontSize: '15px', fontWeight: 600 }}>Search Homes <ArrowRight className="w-5 h-5" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

BuyersGuide.layout = (page) => <MainLayout>{page}</MainLayout>;

export default BuyersGuide;

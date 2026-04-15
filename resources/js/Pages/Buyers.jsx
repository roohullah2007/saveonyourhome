import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function Buyers() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: 'What is the advantage of using SaveOnYourHome.com for buyers?',
      answer: 'Buyers can engage with our site 24/7, making it convenient to get detailed information about homes, schedule appointments, and search for properties. You deal directly with homeowners — no agents, no middlemen, and no inflated prices from commissions.'
    },
    {
      question: 'How can I receive alerts for properties that match my criteria as a buyer?',
      answer: 'Create a free account and save your search criteria. You\'ll receive instant email alerts when new listings match your preferences — location, price range, bedrooms, and more. You can also save individual properties to your favorites.'
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Determine Your Budget and Needs',
      content: [
        { subtitle: 'Financing Pre-Approval', text: 'Get pre-approved for a mortgage to understand your budget and improve your negotiating power. Explore mortgage options with our trusted partners.' },
        { subtitle: 'Identify Your Needs', text: 'List your must-have features and preferred location for your new home. Consider factors like school districts, commute times, and neighborhood amenities.' },
      ],
    },
    {
      number: '2',
      title: 'Begin Your Home Search',
      content: [
        { subtitle: 'Online Listings', text: 'Browse our listings and other online platforms to find homes that match your criteria.' },
        { subtitle: 'Real Estate Agent Assistance', text: 'If you choose to work with a realtor, explore our trusted real estate agent partners.' },
        { subtitle: 'Schedule Viewings', text: 'Contact sellers or realtors to schedule home viewings. Take notes and pictures during your visits to help with your decision.' },
      ],
    },
    {
      number: '3',
      title: 'Home Inspections and Due Diligence',
      content: [
        { subtitle: 'Home Inspection', text: 'Consider hiring a home inspector to evaluate the property thoroughly.' },
        { subtitle: 'Research Neighborhood', text: 'Investigate the neighborhood\'s safety, schools, and amenities.' },
        { subtitle: 'Review Legal Documents', text: 'Work with an attorney to review contracts and disclosures.' },
      ],
    },
    {
      number: '4',
      title: 'Explore Transformation Potential',
      content: [
        { subtitle: 'Consult Architects and Builders', text: 'Reach out to architects and builders to discuss potential renovations or modifications to transform the home into your dream home. They can provide cost estimates and design ideas to help you make an informed decision.' },
      ],
    },
    {
      number: '5',
      title: 'Make an Offer — Balancing Act',
      content: [
        { subtitle: 'Low Offer', text: 'Making a low offer may give you room to negotiate and potentially get a good deal. However, it can risk losing the house to another buyer or upsetting the seller.' },
        { subtitle: 'Higher Offer', text: 'Offering a higher price may increase your chances of quickly securing the home, especially if homes are scarce in your market. Carefully consider your budget.' },
      ],
    },
    {
      number: '6',
      title: 'Secure Financing',
      content: [
        { subtitle: 'Finalize Mortgage', text: 'Work closely with your chosen mortgage provider to complete your loan application.' },
        { subtitle: 'Home Appraisal', text: 'An appraiser will assess the property\'s value to ensure it aligns with the loan amount.' },
      ],
    },
    {
      number: '7',
      title: 'Finalize the Sale',
      content: [
        { subtitle: 'Home Insurance', text: 'Obtain Home Owners Insurance for your new property.' },
        { subtitle: 'Final Walk-Through', text: 'Conduct a final walk-through to ensure the home is in the expected condition.' },
        { subtitle: 'Closing', text: 'Consult with your attorney to navigate the closing process, which can vary by state.' },
      ],
    },
    {
      number: '8',
      title: 'Move In and Enjoy Your New Home',
      content: [
        { subtitle: 'Movers', text: 'Arrange for hassle-free relocation with our moving partners.' },
        { subtitle: 'Utilities', text: 'Transfer or set up utilities in your name.' },
        { subtitle: 'Leave a Review', text: 'After moving in, provide reviews and recommendations about providers you used to help future users.' },
      ],
    },
  ];

  return (
    <>
      <SEOHead
        title="Buyers Guide"
        description="Find your dream home on SaveOnYourHome. Browse FSBO listings, connect directly with sellers, and save on real estate fees. Complete buyer's guide and resources."
        keywords="buy home FSBO, for sale by owner homes, home buyer guide, find homes for sale, no agent home buying"
      />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img src="https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Find your dream home" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10, 15, 30, 0.75) 0%, rgba(10, 15, 30, 0.45) 50%, rgba(10, 15, 30, 0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249, 250, 251, 0.4) 50%, rgb(249, 250, 251) 100%)' }} />

        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156, 163, 175, 0.25)', background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0, 0, 0, 0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52, 211, 153, 0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255, 255, 255, 0.9)' }}>BUYERS GUIDE</span>
              </div>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[60px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Find Your <span style={{ background: 'linear-gradient(135deg, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dream Home</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.75)', maxWidth: '480px' }}>
                Whether you're searching for your first home or investment properties, SaveOnYourHome.com guides you through the entire process.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/properties" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(26, 24, 22)', height: '50px', paddingLeft: '31px', paddingRight: '31px', fontSize: '15px', fontWeight: 600 }}>
                  Search Properties <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/list-property" className="inline-flex items-center justify-center gap-2 rounded-full transition-colors" style={{ height: '50px', paddingLeft: '31px', paddingRight: '31px', fontSize: '15px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.25)', color: 'white', background: 'rgba(255,255,255,0.08)' }}>
                  List Your Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer FAQs */}
      <section style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center">
            <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100, 100, 100)' }}>BUYER FAQS</span>
          </div>
          <h2 className="mb-5 text-center text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]" style={{ fontWeight: 700, color: 'rgb(26, 24, 22)' }}>
            Find Instant Answers
          </h2>
          <p className="text-center mb-14" style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100, 100, 100)', maxWidth: '560px', margin: '0 auto 56px' }}>
            From buying steps to negotiation, our FAQs have you covered. Questions? Ask anytime. Happy hunting!
          </p>

          <div className="max-w-3xl mx-auto space-y-3 mb-16">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-2xl border border-gray-200/60 overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0, 0, 0, 0.06) 0px 4px 24px, rgba(255, 255, 255, 0.8) 0px 1px 0px inset' }}>
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-5 text-left">
                  <span style={{ fontSize: '17px', fontWeight: 600, color: 'rgb(26, 24, 22)' }}>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5">
                    <p style={{ fontSize: '15px', lineHeight: '26px', color: 'rgb(100, 100, 100)' }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { title: 'SELL YOUR HOME FSBO', desc: 'Expose your property to buyers. Get offers to your inbox and start saving the commissions with SaveOnYourHome.', link: '/list-property', linkText: 'List Your Home', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>) },
              { title: 'SEARCH FOR YOUR DREAM HOME', desc: 'Browse through SaveOnYourHome to find your dream home!', link: '/properties', linkText: 'Search Now', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>) },
              { title: 'ABOUT SAVEONYOURHOME.COM', desc: 'We are Empowering Sellers and Connecting Buyers, and transforming the home buying process. See what we are all about!', link: '/about', linkText: 'Learn More', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>) },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 relative flex flex-col items-center p-9 text-center group" style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0, 0, 0, 0.06) 0px 4px 24px, rgba(255, 255, 255, 0.8) 0px 1px 0px inset' }}>
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26, 24, 22)' }} />
                <div className="mb-5 flex items-center justify-center rounded-2xl" style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245, 245, 244)' }}>{card.icon}</div>
                <h3 className="mb-3" style={{ fontWeight: 700, fontSize: '15px', color: 'rgb(26, 24, 22)', letterSpacing: '0.5px' }}>{card.title}</h3>
                <p className="flex-1" style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100, 100, 100)' }}>{card.desc}</p>
                <Link href={card.link} className="mt-5 inline-flex items-center gap-1.5 transition-all duration-300 hover:gap-2.5" style={{ fontSize: '14px', fontWeight: 600, color: 'rgb(26, 24, 22)' }}>
                  {card.linkText} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Approval Section */}
      <section style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="rounded-2xl border border-gray-200/60 overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0, 0, 0, 0.06) 0px 4px 24px, rgba(255, 255, 255, 0.8) 0px 1px 0px inset' }}>
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative overflow-hidden group">
                <img src="/images/buyer-1.webp" alt="Get pre-approved" className="w-full h-[300px] sm:h-[360px] lg:h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => e.target.src = '/images/home-img.webp'} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                  {[{ value: 'Fast', label: 'Pre-Approval' }, { value: 'Free', label: 'No Cost' }, { value: '24hr', label: 'Response' }].map((item, i) => (
                    <div key={i} className="flex-1 rounded-xl px-3 py-3 text-center" style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{item.value}</div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.5px' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 sm:p-10 md:p-14 flex flex-col justify-center">
                <div className="mb-4">
                  <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100, 100, 100)' }}>PRE-APPROVAL</span>
                </div>
                <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] mb-4" style={{ fontWeight: 700, color: 'rgb(26, 24, 22)' }}>
                  Get Pre-Approved For Your Loan!
                </h2>
                <p style={{ fontSize: '17px', lineHeight: '28px', color: 'rgb(100, 100, 100)', marginBottom: '16px' }}>
                  The team at SaveOnYourHome.com recommends that you strengthen your offer by obtaining a pre-approval letter from a licensed mortgage banker. We are happy to connect you with a lender who will provide you with <strong style={{ color: 'rgb(55, 55, 55)' }}>priority service and a free pre-approval</strong>.
                </p>
                <div className="space-y-2.5 mb-8">
                  {['Wide range of mortgage products for every need', 'Get pre-approved for your next mortgage quickly', 'Whether first home or investment — we have you covered'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(26, 24, 22)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span style={{ fontSize: '15px', color: 'rgb(75, 75, 75)' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90 w-fit" style={{ backgroundColor: 'rgb(26, 24, 22)', height: '50px', paddingLeft: '31px', paddingRight: '31px', fontSize: '15px', fontWeight: 600 }}>
                  Request Pre-Approval <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buyers Guide - 8 Steps */}
      <section style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] pt-20 pb-10" style={{ maxWidth: '1400px' }}>
          {/* Section Header */}
          <div className="mb-4 text-center">
            <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100, 100, 100)' }}>BUYERS GUIDE</span>
          </div>
          <h2 className="mb-5 text-center text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]" style={{ fontWeight: 700, color: 'rgb(26, 24, 22)' }}>
            Steps to Buy A Home
          </h2>
          <p className="text-center mb-14" style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100, 100, 100)', maxWidth: '640px', margin: '0 auto 56px' }}>
            Are you planning to buy a home? SaveOnYourHome.com is here to guide you through the entire home-buying process, providing step-by-step instructions and connecting you with trusted service providers.
          </p>

          {/* Alternating image + steps rows */}
          {[
            {
              image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
              alt: 'Couple planning home budget together',
              badge: 'PLAN YOUR BUDGET',
              stepNums: ['1', '2'],
              imageLeft: true,
            },
            {
              image: 'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=800',
              alt: 'Home inspection with inspector and buyer',
              badge: 'DUE DILIGENCE',
              stepNums: ['3', '4'],
              imageLeft: false,
            },
            {
              image: 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=800',
              alt: 'Couple signing offer documents with agent',
              badge: 'MAKE YOUR OFFER',
              stepNums: ['5', '6'],
              imageLeft: true,
            },
            {
              image: 'https://images.pexels.com/photos/8292887/pexels-photo-8292887.jpeg?auto=compress&cs=tinysrgb&w=800',
              alt: 'Happy family receiving keys to new home',
              badge: 'CLOSE & MOVE IN',
              stepNums: ['7', '8'],
              imageLeft: false,
            },
          ].map((row, rowIdx) => (
            <div key={rowIdx} className={`grid lg:grid-cols-2 gap-8 items-stretch ${rowIdx > 0 ? 'mt-8' : ''}`}>
              {/* Image Side */}
              <div className={`relative rounded-2xl overflow-hidden group ${row.imageLeft ? 'order-1' : 'order-1 lg:order-2'}`} className="h-[260px] md:h-[320px] lg:h-auto" style={{ minHeight: '0', boxShadow: 'rgba(0, 0, 0, 0.08) 0px 8px 32px' }}>
                <img src={row.image} alt={row.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: row.imageLeft ? 'linear-gradient(135deg, rgba(10,15,30,0.5) 0%, rgba(10,15,30,0.15) 100%)' : 'linear-gradient(225deg, rgba(10,15,30,0.5) 0%, rgba(10,15,30,0.15) 100%)' }} />
                {/* Badge */}
                <div className="absolute top-5 left-5 rounded-full px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.6)' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '1px' }}>{row.badge}</span>
                </div>
                {/* Step indicators */}
                <div className="absolute bottom-5 left-5 flex gap-2">
                  {row.stepNums.map(n => (
                    <div key={n} className="flex items-center justify-center rounded-lg" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{n}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps Side */}
              <div className={`space-y-4 flex flex-col justify-center ${row.imageLeft ? 'order-2' : 'order-2 lg:order-1'}`}>
                {steps.filter(s => row.stepNums.includes(s.number)).map((step) => (
                  <div key={step.number} className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-lg p-7 group relative" style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0, 0, 0, 0.06) 0px 4px 24px, rgba(255, 255, 255, 0.8) 0px 1px 0px inset' }}>
                    <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26, 24, 22)' }} />
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ width: '48px', height: '48px', backgroundColor: 'rgb(26, 24, 22)' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{step.number}</span>
                      </div>
                      <div className="flex-1">
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'rgb(26, 24, 22)', marginBottom: '12px' }}>Step {step.number}: {step.title}</h3>
                        <div className="space-y-3">
                          {step.content.map((item, i) => (
                            <p key={i} style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(75, 75, 75)' }}>
                              <strong style={{ color: 'rgb(26, 24, 22)' }}>{item.subtitle}:</strong> {item.text}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Honor Pledge */}
          <div className="mt-10 rounded-2xl border border-gray-200/60 p-7" style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0, 0, 0, 0.06) 0px 4px 24px, rgba(255, 255, 255, 0.8) 0px 1px 0px inset' }}>
            <div className="flex items-center gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgb(26, 24, 22)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100, 100, 100)' }}>
                As part of our dedication to transparency, all service providers must adhere to our <strong style={{ color: 'rgb(55, 55, 55)' }}>Advertiser & Sponsor Honor Pledge</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Buyers.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Buyers;

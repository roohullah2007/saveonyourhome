import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function FSBOGuide() {
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    { number: '1', title: 'Set Yourself Up For Success', content: [
      { sub: 'Declutter and Clean', text: 'Create an inviting atmosphere by decluttering your home and removing personal items. Consider professional cleaning services to make every room shine.' },
      { sub: 'Home Inspection', text: 'Consider getting a home inspection to identify potential issues before listing. Addressing problems early avoids surprises during negotiations.' },
    ]},
    { number: '2', title: 'Setting the Sales Price', content: [
      { sub: 'AI Valuation Tool', text: 'Begin by checking the AI valuation tool available on SaveOnYourHome.com for an initial estimate of your home\'s value.' },
      { sub: 'Professional Appraisal', text: 'An appraiser will provide a written report with the value of your home, using at least 3 comparable sales from your local area.' },
      { sub: 'Online Resources', text: 'Explore online platforms that offer insights into comparable sales in your area to validate your pricing strategy.' },
    ]},
    { number: '3', title: 'Preparing Your House', content: [
      { sub: 'Repairs and Improvements', text: 'Address inspection issues with contractors. Fix any visible damage, paint, and make your home show-ready to attract more buyers.' },
      { sub: 'Oil Tank Inspection', text: 'If your home has underground oil tanks, have them inspected by an oil tank service company to avoid future liability.' },
    ]},
    { number: '4', title: 'Take Photos & Videos', content: [
      { sub: 'Photography Tips', text: 'Natural light is best. Open curtains and blinds, take pictures from angles that give the widest view of rooms. Take multiple shots to select the best images. High-quality visuals make a lasting first impression.' },
    ]},
    { number: '5', title: 'Legal', content: [
      { sub: 'Engage an Attorney', text: 'For guidance on legal matters related to contracts, negotiations and required disclosures. An attorney ensures your interests are protected throughout the sale.' },
    ]},
    { number: '6', title: 'Listing Your Home', content: [
      { sub: 'Create a Compelling Listing', text: 'Provide detailed information, include high-quality photos, videos and virtual tours, and highlight unique features. Listings can be completed in less than 5 minutes on SaveOnYourHome.com.' },
    ]},
    { number: '7', title: 'Marketing Your Property', content: [
      { sub: 'Yard Sign', text: 'Order your yard sign with a custom QR code after listing. Place it in your front yard for maximum visibility to drive traffic to your listing.' },
      { sub: 'Open Houses & Flyers', text: 'Consider hosting open houses and creating flyers to post around town to increase exposure.' },
      { sub: 'Social Media', text: 'Promote your listing on Facebook, Twitter, Instagram, WhatsApp, and TikTok to reach a wider audience.' },
    ]},
    { number: '8', title: 'Be Responsive to Potential Buyers', content: [
      { sub: 'Arrange Showings', text: 'SaveOnYourHome.com makes it easy to coordinate with buyers to answer questions or schedule showings without giving out your personal phone number or email. Use our built-in messaging to stay responsive.' },
    ]},
    { number: '9', title: 'Negotiate and Accept Offers', content: [
      { sub: 'Review Offers Carefully', text: 'Seek legal advice from your attorney to review offers and assist with negotiations. Compare all terms, not just the price.' },
    ]},
    { number: '10', title: 'Accept an Offer & Close', content: [
      { sub: 'The Closing', text: 'The closing process begins upon accepting an offer and differs by state. Consult with your attorney to ensure a smooth closing process and that all paperwork is in order.' },
    ]},
    { number: '11', title: 'Final Steps', content: [
      { sub: 'Movers', text: 'Arrange for hassle-free relocation with our moving partners to make your transition seamless.' },
      { sub: 'Leave a Review', text: 'After closing, provide reviews and recommendations about providers you used to help future users on their home sale journey.' },
    ]},
  ];

  const faqs = [
    { q: 'How long does the sales process take?', a: 'The timeline varies depending on your local market, pricing, and property condition. On average, homes can sell within 30 to 90 days. Pricing your home competitively and marketing it effectively through SaveOnYourHome.com can help speed up the process.' },
    { q: 'How Should I Set a Sales Price?', a: 'Start with our AI valuation tool for an initial estimate, then consider getting a professional appraisal for a more accurate assessment. Research comparable sales in your area using online resources. Setting the right price from the start attracts serious buyers and can lead to a faster sale.' },
    { q: 'Can I accept offers from real estate agents even when selling by owner?', a: 'Absolutely. Selling by owner does not prevent you from working with buyers who are represented by agents. You maintain full control over the negotiation process and any commission arrangements. Consult your attorney for guidance on handling agent-represented offers.' },
  ];

  const ctaCards = [
    { title: 'HOW TO SELL YOUR HOME BY OWNER', desc: 'List your property on SaveOnYourHome.com and start receiving offers directly. No commissions, no hassle.', link: '/list-property', linkText: 'List Your Home', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>) },
    { title: 'SEARCH FOR YOUR DREAM HOME', desc: 'Browse through SaveOnYourHome to find your dream home!', link: '/properties', linkText: 'Search Now', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>) },
    { title: 'ABOUT SAVEONYOURHOME.COM', desc: 'We are Empowering Sellers and Connecting Buyers. See what we are all about!', link: '/about', linkText: 'Learn More', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>) },
  ];

  return (
    <>
      <SEOHead
        title="FSBO Guide - How to Sell Your Home By Owner"
        description="Step-by-step guide to selling your home by owner. Learn how to price, prepare, list, market, and close the sale of your home without paying agent commissions."
        keywords="FSBO guide, sell home by owner, how to sell house without realtor, FSBO steps, for sale by owner tips"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img src="https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="FSBO sellers guide" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[640px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>FSBO GUIDE</span>
              </div>
              <h1 className="text-[26px] leading-[34px] sm:text-[36px] sm:leading-[44px] lg:text-[46px] lg:leading-[56px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Are you planning to sell your home without a <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real Estate Agent's</span> assistance?
              </h1>
              <p className="mt-5" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgba(255,255,255,0.75)', maxWidth: '560px' }}>
                SaveOnYourHome.com is here to guide you through the entire process, providing step-by-step instructions and connecting you with trusted service providers.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/list-property" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}>List My Home <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section — Timeline Layout */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>STEP-BY-STEP</span></div>
          <h2 className="mb-5 text-center text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>How to Sell Your Home By Owner</h2>
          <p className="text-center mb-14" style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100,100,100)', maxWidth: '640px', margin: '0 auto 56px' }}>
            Follow these 11 steps to navigate your home sale with confidence. SaveOnYourHome.com provides the tools and guidance you need at every stage.
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
                  <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 z-10 items-center justify-center rounded-full" style={{ width: '44px', height: '44px', backgroundColor: 'rgb(26,24,22)', boxShadow: 'rgba(26,24,22,0.2) 0px 4px 12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{step.number}</span>
                  </div>

                  {/* Content card */}
                  <div className={`${isLeft ? 'md:col-start-1 md:pr-8' : 'md:col-start-2 md:pl-8'} ${!isLeft ? 'md:col-start-2' : ''}`} style={{ order: isLeft ? 1 : 2 }}>
                    <div className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 p-6 group relative" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                      <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                      <div className="flex items-start gap-4">
                        <div className="md:hidden flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: '44px', height: '44px', backgroundColor: 'rgb(26,24,22)' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{step.number}</span>
                        </div>
                        <div className="flex-1">
                          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'rgb(26,24,22)', marginBottom: '12px' }}>Step {step.number}: {step.title}</h3>
                          <div className="space-y-3">
                            {step.content.map((item, j) => (
                              <p key={j} style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(75,75,75)' }}>
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
                <h3 className="mb-3" style={{ fontWeight: 700, fontSize: '14px', color: 'rgb(26,24,22)', letterSpacing: '0.5px' }}>{card.title}</h3>
                <p className="flex-1" style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100,100,100)' }}>{card.desc}</p>
                <Link href={card.link} className="mt-5 inline-flex items-center gap-1.5 transition-all duration-300 hover:gap-2.5" style={{ fontSize: '13px', fontWeight: 600, color: 'rgb(26,24,22)' }}>{card.linkText} <ArrowRight className="w-3.5 h-3.5" /></Link>
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
              <div className="mb-4"><span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>FSBO FAQS</span></div>
              <h2 className="text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)', marginBottom: '16px' }}>Frequently Asked Questions</h2>
              <p style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100,100,100)', marginBottom: '24px' }}>
                Have more questions about selling your home by owner? We are here to help.
              </p>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}>Ask Questions <ArrowRight className="w-4 h-4" /></Link>
            </div>

            {/* Right side — accordion */}
            <div className="lg:col-span-3 space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-gray-200/60 overflow-hidden" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'rgb(26,24,22)' }}>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && <div className="px-5 pb-5"><p style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100,100,100)' }}>{faq.a}</p></div>}
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
            <h2 className="text-[22px] leading-[30px] sm:text-[26px] sm:leading-[34px] lg:text-[30px] lg:leading-[38px] mb-4" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
              You Are Well-Equipped to Succeed
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '26px', color: 'rgb(100,100,100)', maxWidth: '640px', margin: '0 auto' }}>
              With SaveOnYourHome.com by your side, you are well-equipped to sell your home successfully by owner. Best of luck with your home sale journey!
            </p>
            <div className="mt-8">
              <Link href="/list-property" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}>Get Started <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

FSBOGuide.layout = (page) => <MainLayout>{page}</MainLayout>;

export default FSBOGuide;

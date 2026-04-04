import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function Sellers() {
  const [openFaq, setOpenFaq] = useState(null);

  const whyFsbo = [
    { title: 'Sell Your Way, Your Terms', desc: 'Take full control of your home sale. Show your property when it suits you, set your own price, and connect directly with buyers on your schedule.' },
    { title: 'Maximize Your Savings', desc: 'Traditional real estate agents charge hefty commissions. By selling through FSBO, you keep more of your money. Invest in what matters most — your next home.' },
    { title: 'Direct Buyer Interaction', desc: 'Connect directly with potential buyers. Answer their questions, showcase your property, and negotiate offers without any barriers. Your home, your conversations.' },
    { title: 'Transparency and Trust', desc: 'Our platform is built on transparency. No hidden fees, no surprises. We believe in trust and honesty, ensuring a straightforward selling experience you can rely on.' },
    { title: 'Empower Your Journey', desc: 'Selling your home is a significant milestone. Empower your journey by choosing SaveOnYourHome. Experience the freedom of selling on your terms and the satisfaction of a commission-free sale.' },
  ];

  const howItWorks = [
    { num: '01', title: 'List Your Property', desc: 'Capture attention with photos, videos, and virtual tours. Utilize intuitive pricing tools and expert guidance to attract ideal buyers efficiently and effectively.' },
    { num: '02', title: 'Connect with Buyers', desc: 'Engage directly, answer questions, schedule viewings. Coordinate showings, highlight unique features, and negotiate offers for the best deal.' },
    { num: '03', title: 'Close the Deal', desc: 'Our team ensures accurate, efficient paperwork. Close smoothly, transfer ownership hassle-free. Congratulate yourself on a successful sale, enjoying savings from avoiding hefty agent commissions.' },
  ];

  const sellerSteps = [
    { number: '1', title: 'Set Yourself Up For Success', content: [
      { sub: 'Declutter and Clean', text: 'Create an inviting atmosphere by decluttering your home and removing personal items. Consider professional cleaning services.' },
      { sub: 'Home Inspection', text: 'Consider getting a home inspection to identify potential issues before listing.' },
    ]},
    { number: '2', title: 'Setting the Sales Price', content: [
      { sub: 'AI Valuation Tool', text: 'Begin by checking the AI valuation tool available on SaveOnYourHome.com for an initial estimate of your home\'s value.' },
      { sub: 'Professional Appraisal', text: 'An appraiser will provide a written report with the value of your home, using at least 3 comparable sales from your local area.' },
      { sub: 'Online Resources', text: 'Explore online platforms that offer insights into comparable sales in your area.' },
    ]},
    { number: '3', title: 'Preparing Your House', content: [
      { sub: 'Repairs and Improvements', text: 'Address inspection issues with contractors. Fix any visible damage, paint, and make your home show-ready.' },
      { sub: 'Oil Tank Inspection', text: 'If your home has underground oil tanks, have them inspected by an oil tank service company.' },
    ]},
    { number: '4', title: 'Take Photos & Videos', content: [
      { sub: 'Photography Tips', text: 'Natural light is best. Open curtains and blinds, take pictures from angles that give the widest view of rooms. Take multiple shots to select the best images.' },
    ]},
    { number: '5', title: 'Legal', content: [
      { sub: 'Engage an Attorney', text: 'For guidance on legal matters related to contracts, negotiations and required disclosures.' },
    ]},
    { number: '6', title: 'Listing Your Home', content: [
      { sub: 'Create a Compelling Listing', text: 'Provide detailed information, include high-quality photos, videos and virtual tours, and highlight unique features. Listings can be completed in less than 5 minutes.' },
    ]},
    { number: '7', title: 'Marketing Your Property', content: [
      { sub: 'Yard Sign', text: 'Order your yard sign with a custom QR code after listing. Place it in your front yard for maximum visibility.' },
      { sub: 'Open Houses & Flyers', text: 'Consider hosting open houses and creating flyers to post around town.' },
      { sub: 'Social Media', text: 'Promote your listing on Facebook, Twitter, Instagram, WhatsApp, and TikTok.' },
    ]},
    { number: '8', title: 'Be Responsive to Potential Buyers', content: [
      { sub: 'Arrange Showings', text: 'SaveOnYourHome.com makes it easy to coordinate with buyers to answer questions or schedule showings without giving out your personal phone number or email.' },
    ]},
    { number: '9', title: 'Negotiate and Accept Offers', content: [
      { sub: 'Review Offers Carefully', text: 'Seek legal advice from your attorney to review offers and assist with negotiations.' },
    ]},
    { number: '10', title: 'Accept an Offer & Close', content: [
      { sub: 'The Closing', text: 'The closing process begins upon accepting an offer and differs by state. Consult with your attorney to ensure a smooth closing process.' },
    ]},
    { number: '11', title: 'Final Steps', content: [
      { sub: 'Movers', text: 'Arrange for hassle-free relocation with our moving partners.' },
      { sub: 'Leave a Review', text: 'After closing, provide reviews and recommendations about providers you used to help future users.' },
    ]},
  ];

  const faqs = [
    { q: 'What is the best pricing strategy for my property?', a: 'Use our AI pricing tool, consult with a local appraiser, and research comparable sales in your area. Setting the right price from the start attracts more serious buyers.' },
    { q: 'How can I create a compelling property listing?', a: 'Include high-quality photos, detailed descriptions, highlight unique features, and add virtual tours. Our platform guides you through creating a listing in under 5 minutes.' },
    { q: 'What documents do I need to sell my property?', a: 'You\'ll need a property deed, disclosure forms, purchase agreement, and any inspection reports. We recommend consulting a real estate attorney for your specific state requirements.' },
    { q: 'Should I hire a real estate agent or sell FSBO?', a: 'FSBO saves you thousands in commission fees. With SaveOnYourHome.com\'s tools, marketing support, and guidance, you can successfully sell on your own while keeping more of your equity.' },
    { q: 'How can I maximize safety when selling my home?', a: 'Use our secure messaging system to communicate with buyers without sharing personal info. Schedule showings during daylight hours and consider having someone else present during visits.' },
    { q: 'Is listing on your platform free?', a: 'Yes! Listing your home on SaveOnYourHome.com is completely free. No commissions, no hidden fees. We offer optional premium services like MLS listing and professional photography.' },
  ];

  const stepImages = [
    { nums: ['1', '2'], image: 'https://images.pexels.com/photos/7641824/pexels-photo-7641824.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Couple preparing home for sale', badge: 'PREPARE & PRICE', left: true },
    { nums: ['3', '4'], image: 'https://images.pexels.com/photos/8292806/pexels-photo-8292806.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Home staging and photography', badge: 'STAGE & CAPTURE', left: false },
    { nums: ['5', '6'], image: 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Reviewing legal documents', badge: 'LEGAL & LISTING', left: true },
    { nums: ['7', '8'], image: 'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Marketing and buyer showings', badge: 'MARKET & SHOW', left: false },
    { nums: ['9', '10', '11'], image: 'https://images.pexels.com/photos/8292887/pexels-photo-8292887.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Happy family with new home keys', badge: 'NEGOTIATE & CLOSE', left: true },
  ];

  return (
    <>
      <SEOHead
        title="Sellers Guide"
        description="Everything you need to sell your home by owner. Free FSBO listing, pricing tools, marketing tips, and step-by-step guidance to sell without paying commission."
        keywords="sell home by owner, FSBO guide, how to sell home without realtor, FSBO tips, sell house no commission"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Sell your home" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>SELLERS GUIDE</span>
              </div>
              <h1 className="text-[26px] leading-[34px] sm:text-[36px] sm:leading-[44px] lg:text-[46px] lg:leading-[56px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Sell Your Home with <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Confidence</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                Take control of your home sale with SaveOnYourHome.com. Benefit from commission-free savings and embark on your path to a successful sale.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/list-property" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}>List My Home <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose FSBO */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>WHY CHOOSE FSBO?</span></div>
          <h2 className="mb-14 text-center text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>Sell on Your Terms</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {whyFsbo.map((item, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 relative flex flex-col items-center p-6 text-center group" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                <div className="mb-4 flex items-center justify-center rounded-2xl" style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245,245,244)' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'rgb(26,24,22)' }}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mb-2" style={{ fontWeight: 700, fontSize: '14px', color: 'rgb(26,24,22)', letterSpacing: '0.3px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', lineHeight: '20px', color: 'rgb(100,100,100)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>HOW IT WORKS</span></div>
          <h2 className="mb-14 text-center text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>Your Step-by-Step Guide to Success</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {howItWorks.map((s, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 p-8 group relative" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                <div className="mb-4 flex items-center justify-center rounded-xl" style={{ width: '44px', height: '44px', backgroundColor: 'rgb(26,24,22)' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{s.num}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'rgb(26,24,22)', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: '22px', color: 'rgb(100,100,100)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/list-property" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}>List My Property <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* Seller Guide — 11 Steps with alternating images */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>SELLER GUIDE</span></div>
          <h2 className="mb-5 text-center text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>How to Sell Your Home By Owner</h2>
          <p className="text-center mb-14" style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100,100,100)', maxWidth: '640px', margin: '0 auto 56px' }}>
            SaveOnYourHome.com is here to guide you through the entire process, providing step-by-step instructions and connecting you with trusted service providers.
          </p>

          {stepImages.map((row, rowIdx) => (
            <div key={rowIdx} className={`grid lg:grid-cols-2 gap-8 items-stretch ${rowIdx > 0 ? 'mt-8' : ''}`}>
              {/* Image */}
              <div className={`relative rounded-2xl overflow-hidden group ${row.left ? 'order-1' : 'order-1 lg:order-2'}`} className="h-[260px] md:h-[320px] lg:h-auto" style={{ minHeight: '0', boxShadow: 'rgba(0,0,0,0.08) 0px 8px 32px' }}>
                <img src={row.image} alt={row.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: row.left ? 'linear-gradient(135deg, rgba(10,15,30,0.5) 0%, rgba(10,15,30,0.15) 100%)' : 'linear-gradient(225deg, rgba(10,15,30,0.5) 0%, rgba(10,15,30,0.15) 100%)' }} />
                <div className="absolute top-5 left-5 rounded-full px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.6)' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '1px' }}>{row.badge}</span>
                </div>
                <div className="absolute bottom-5 left-5 flex gap-2">
                  {row.nums.map(n => (
                    <div key={n} className="flex items-center justify-center rounded-lg" style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{n}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Steps */}
              <div className={`space-y-4 flex flex-col justify-center ${row.left ? 'order-2' : 'order-2 lg:order-1'}`}>
                {sellerSteps.filter(s => row.nums.includes(s.number)).map((step) => (
                  <div key={step.number} className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-lg p-6 group relative" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                    <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ width: '44px', height: '44px', backgroundColor: 'rgb(26,24,22)' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{step.number}</span>
                      </div>
                      <div className="flex-1">
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'rgb(26,24,22)', marginBottom: '12px' }}>Step {step.number}: {step.title}</h3>
                        <div className="space-y-3">
                          {step.content.map((item, i) => (
                            <p key={i} style={{ fontSize: '14px', lineHeight: '22px', color: 'rgb(75,75,75)' }}>
                              <strong style={{ color: 'rgb(26,24,22)' }}>{item.sub}:</strong> {item.text}
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
        </div>
      </section>

      {/* Seller FAQs */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>SELLER FAQS</span></div>
          <h2 className="mb-5 text-center text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>Frequently Asked Questions</h2>
          <p className="text-center mb-14" style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100,100,100)', maxWidth: '560px', margin: '0 auto 56px' }}>
            Can't find an answer? Contact us, we will be happy to answer your questions.
          </p>
          <div className="max-w-3xl mx-auto space-y-3 mb-10">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 overflow-hidden" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'rgb(26,24,22)' }}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-5"><p style={{ fontSize: '14px', lineHeight: '24px', color: 'rgb(100,100,100)' }}>{faq.a}</p></div>}
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}>Ask Questions <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* Contact & CTA Cards */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          {/* Contact banner */}
          <div className="rounded-2xl border border-gray-200/60 p-8 flex flex-col sm:flex-row items-center gap-6 mb-10" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
            <div className="flex items-center justify-center rounded-2xl flex-shrink-0" style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245,245,244)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'rgb(26,24,22)', marginBottom: '4px' }}>Our customer service team is always ready to assist you.</h3>
              <p style={{ fontSize: '14px', lineHeight: '22px', color: 'rgb(100,100,100)' }}>Selling by owner doesn't mean you're on your own. Get your questions answered so you can move forward with confidence.</p>
            </div>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90 flex-shrink-0" style={{ backgroundColor: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}>Contact Us</Link>
          </div>

          {/* 3 CTA cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { title: 'SELL YOUR HOME FSBO', desc: 'Expose your property to buyers. Get offers to your inbox and start saving the commissions.', link: '/list-property', linkText: 'List Your Home', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>) },
              { title: 'SEARCH FOR YOUR DREAM HOME', desc: 'Browse through SaveOnYourHome to find your dream home!', link: '/properties', linkText: 'Search Now', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>) },
              { title: 'ABOUT SAVEONYOURHOME.COM', desc: 'We are Empowering Sellers and Connecting Buyers. See what we are all about!', link: '/about', linkText: 'Learn More', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>) },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 relative flex flex-col items-center p-8 text-center group" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                <div className="mb-5 flex items-center justify-center rounded-2xl" style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245,245,244)' }}>{card.icon}</div>
                <h3 className="mb-3" style={{ fontWeight: 700, fontSize: '14px', color: 'rgb(26,24,22)', letterSpacing: '0.5px' }}>{card.title}</h3>
                <p className="flex-1" style={{ fontSize: '14px', lineHeight: '22px', color: 'rgb(100,100,100)' }}>{card.desc}</p>
                <Link href={card.link} className="mt-5 inline-flex items-center gap-1.5 transition-all duration-300 hover:gap-2.5" style={{ fontSize: '13px', fontWeight: 600, color: 'rgb(26,24,22)' }}>{card.linkText} <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

Sellers.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Sellers;

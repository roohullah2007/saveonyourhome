import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronDown, Phone, Mail, Calendar, CheckCircle2, Headphones } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import HeroBadge from '@/Components/HeroBadge';
import MainLayout from '@/Layouts/MainLayout';

function SellerFAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'What is the best pricing strategy for my property?',
      a: 'Research comparable properties in your area that have recently sold to determine a competitive price. Pricing your home correctly from the start attracts more buyers and can lead to faster offers. Overpricing often results in longer time on market and ultimately a lower sale price.',
    },
    {
      q: 'How can I create a compelling property listing on SaveOnYourHome.com?',
      a: 'Include at least 10-15 high-quality photos showcasing every room, exterior views, and standout features of your home. Write a detailed description highlighting upgrades, neighborhood amenities, and what makes your property unique. A well-crafted listing generates more interest and leads to more showings.',
    },
    {
      q: 'What documents do I need to sell my property?',
      a: "You'll typically need a property deed, seller's disclosure form, purchase agreement, title report, and any relevant inspection reports. Requirements vary by state, so we recommend consulting a real estate attorney to ensure you have everything in order. Having your documents prepared ahead of time helps the closing process go smoothly.",
    },
    {
      q: 'What must I disclose to potential buyers about my property?',
      a: 'Sellers are legally required to disclose known material defects that could affect the property\'s value or safety, such as structural issues, water damage, or pest problems. Disclosure requirements vary by state, so familiarize yourself with your local laws. Being upfront builds trust with buyers and protects you from potential legal issues after the sale.',
    },
    {
      q: 'How should I prepare my home for sale?',
      a: 'Start by decluttering, deep cleaning, and making minor repairs to present your home in its best light. Consider fresh paint in neutral tones and improving curb appeal with landscaping and a clean entryway. A well-prepared home photographs better and makes a stronger first impression during showings.',
    },
    {
      q: 'How can I negotiate effectively with buyers?',
      a: 'Know your bottom line before negotiations begin and be prepared to justify your asking price with comparable sales data. Stay professional, respond promptly to offers, and be open to reasonable counteroffers. Consider non-price terms like closing dates and contingencies as additional negotiation tools.',
    },
    {
      q: 'Can I list multiple properties on SaveOnYourHome.com?',
      a: 'Yes, you can list multiple properties on SaveOnYourHome.com at no extra cost. Simply create a separate listing for each property through your dashboard. Each listing gets its own page with full exposure to potential buyers.',
    },
    {
      q: 'Can I update my listing on SaveOnYourHome.com after it\'s been posted?',
      a: 'Absolutely! You have full control over your listing and can update photos, descriptions, pricing, and other details at any time through your dashboard. Keeping your listing current with accurate information helps maintain buyer interest. We recommend updating promptly whenever there are changes to your property or pricing.',
    },
    {
      q: 'What are the benefits of using SaveOnYourHome.com as a seller?',
      a: 'SaveOnYourHome.com lets you list your property for free, keeping thousands of dollars in commissions in your pocket. You maintain full control over the selling process including pricing, showings, and negotiations. Our platform provides the tools and exposure you need to sell successfully without the traditional agent fees.',
    },
    {
      q: 'What if I list my home with SaveOnYourHome.com and change my mind?',
      a: 'You can remove your listing at any time with no penalties or fees. Simply log into your dashboard and deactivate or delete your listing. There are no contracts or obligations tying you to the platform.',
    },
    {
      q: 'Should I hire a real estate agent or sell my property \'FSBO\'?',
      a: 'Selling FSBO can save you thousands in commission fees, which typically range from 5-6% of the sale price. With platforms like SaveOnYourHome.com providing listing tools, marketing exposure, and direct buyer communication, many sellers successfully handle the process themselves. If you feel comfortable managing showings and negotiations, FSBO is a smart financial choice.',
    },
    {
      q: 'How can I maximize safety when selling my home?',
      a: 'Always verify the identity of potential buyers before allowing them into your home, and try to have another person present during showings. Remove or secure valuables, personal documents, and prescription medications before any visits. Trust your instincts and schedule showings during daylight hours when possible.',
    },
  ];

  return (
    <>
      <SEOHead
        title="Seller FAQs"
        description="Find clear answers to your selling queries. From first-timers to experienced sellers, get valuable insights for a successful FSBO sale on SaveOnYourHome."
        keywords="seller FAQ, FSBO seller questions, selling home by owner, home selling tips, SaveOnYourHome seller help"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        }}
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img src="https://images.pexels.com/photos/7578939/pexels-photo-7578939.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Seller FAQs" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-start pt-16 md:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <HeroBadge>SELLER SUPPORT</HeroBadge>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Seller <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FAQs</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                Find clear answers to your selling queries in our FAQs. From first-timers to experienced sellers, get valuable insights for a successful sale. Reach out for personalized support anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 overflow-hidden" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span style={{ fontSize: '17px', fontWeight: 600, color: 'rgb(26,24,22)' }}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5">
                    <p style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Talk to a Seller Specialist */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-16 md:py-24" style={{ maxWidth: '1400px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">
            {/* Left — pitch */}
            <div className="lg:col-span-3">
              <span className="inline-block text-[12px] font-bold uppercase tracking-[2px] text-[#3355FF] mb-3">
                Personal Support
              </span>
              <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] tracking-tight mb-5" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
                Talk to a seller specialist — free
              </h2>
              <p className="mb-8 text-[#4B5563]" style={{ fontSize: '17px', lineHeight: '28px', maxWidth: '560px' }}>
                Selling by owner doesn't mean selling alone. Our specialists walk you through pricing,
                paperwork, and negotiations so you can list with confidence and keep more of your money.
              </p>

              <ul className="space-y-3 mb-9">
                {[
                  'No commissions, no commitment, no hidden fees',
                  'Local pricing strategy and comparable-sales review',
                  'Help with offers, contracts, and closing paperwork',
                  'Same-day response, 7 days a week',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </span>
                    <span className="text-[15.5px] text-[#0F172A]">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}
                >
                  Message a Specialist <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/list-property"
                  className="inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 hover:bg-gray-50"
                  style={{ backgroundColor: 'white', color: '#0F172A', border: '1px solid #E5E7EB', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}
                >
                  Start My Listing
                </Link>
              </div>
            </div>

            {/* Right — support card */}
            <div className="lg:col-span-2">
              <div className="relative rounded-3xl bg-white border border-gray-200 p-8 shadow-[0_4px_24px_rgba(15,23,42,0.06),0_1px_0px_rgba(255,255,255,0.8)_inset] overflow-hidden">
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF4FF] text-[#3355FF] flex items-center justify-center">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[12px] uppercase tracking-[1.5px] text-[#6B7280] font-semibold">Seller Support</p>
                      <p className="text-[16px] font-semibold text-[#0F172A]">We're here to help</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <a
                      href="tel:2016960291"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFAF8] hover:bg-[#F4F3F0] transition-colors border border-gray-200"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#3355FF] flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] uppercase tracking-wider text-[#6B7280] font-semibold">Call</p>
                        <p className="text-[15px] font-semibold truncate text-[#0F172A]">201.696.0291</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                    </a>

                    <a
                      href="mailto:info@saveonyourhome.com"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFAF8] hover:bg-[#F4F3F0] transition-colors border border-gray-200"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#3355FF] flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] uppercase tracking-wider text-[#6B7280] font-semibold">Email</p>
                        <p className="text-[15px] font-semibold truncate text-[#0F172A]">info@saveonyourhome.com</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                    </a>

                    <Link
                      href="/join-weekly-call"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFAF8] hover:bg-[#F4F3F0] transition-colors border border-gray-200"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#3355FF] flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] uppercase tracking-wider text-[#6B7280] font-semibold">Schedule</p>
                        <p className="text-[15px] font-semibold truncate text-[#0F172A]">Join our weekly seller call</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                    </Link>
                  </div>

                  <p className="mt-5 text-[13px] text-[#6B7280] text-center">
                    Average response time under 2 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Cards */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(26,24,22)' }}>How to Sell Your Home By Owner</h3>
              <p className="mb-6" style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>
                Expose your property to buyers. Get offers to your inbox and start saving the commissions with SaveOnYourHome.
              </p>
              <Link href="/list-property" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgb(26,24,22)' }}>
                List Your Home <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(26,24,22)' }}>Search For Your Dream Home</h3>
              <p className="mb-6" style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>
                Browse through SaveOnYourHome to find your dream home!
              </p>
              <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgb(26,24,22)' }}>
                Search Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(26,24,22)' }}>About SaveOnYourHome.com</h3>
              <p className="mb-6" style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>
                We are Empowering Sellers and Connecting Buyers, and transforming the home buying process. See what we are all about!
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgb(26,24,22)' }}>
                Learn More <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

SellerFAQs.layout = (page) => <MainLayout>{page}</MainLayout>;

export default SellerFAQs;

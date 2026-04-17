import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function BuyerFAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'What is the advantage of using SaveOnYourHome.com for buyers?',
      a: 'SaveOnYourHome.com connects you directly with homeowners selling their properties, which means you can often negotiate better deals without the added cost of agent commissions being built into the price. You get access to a wide range of FSBO listings with detailed photos, descriptions, and the ability to message sellers directly. This transparent, direct communication helps you make informed decisions and move quickly when you find the right home.',
    },
    {
      q: 'How can I receive alerts for properties that match my criteria as a buyer?',
      a: 'Create a free account on SaveOnYourHome.com and set up your search preferences including location, price range, property type, and desired features. Once your criteria are saved, you will receive email notifications whenever new listings that match your preferences are posted. This ensures you never miss out on a property that fits your needs and gives you a head start on contacting sellers before other buyers.',
    },
    {
      q: 'Do I need a real estate agent to buy a home through SaveOnYourHome.com?',
      a: 'No. You can purchase any home listed on SaveOnYourHome.com directly from the seller without involving a buyer\'s agent — that is one of the main ways buyers save money. That said, if you prefer professional representation, you are welcome to bring your own agent or attorney; many sellers on the platform indicate whether they are open to working with realtors right on the listing.',
    },
    {
      q: 'How do I schedule a tour of a property?',
      a: 'Open the property detail page and use the Request Info form (or call the seller directly with the phone number shown on the listing) to ask about a showing. Sellers typically respond within a day. Some sellers require a mortgage pre-approval letter before a tour — that requirement is clearly displayed on the listing.',
    },
    {
      q: 'How do I make an offer on a FSBO property?',
      a: 'Reach out to the seller through the listing\'s contact form or phone number to express interest, then send a written offer. You can use a standard purchase agreement (your attorney, title company, or local real estate forms service can provide one). Once both parties sign, the offer is binding and you move forward to inspections, financing, and closing.',
    },
    {
      q: 'Should I get pre-approved for a mortgage before I start looking?',
      a: 'Yes — a pre-approval letter shows sellers you are a serious buyer and tells you exactly what price range you can afford. Many FSBO sellers will not schedule a showing without one. SaveOnYourHome.com partners with trusted lenders who can pre-approve you in about 15 minutes; visit our Mortgages page to get started at no cost and with no credit-score impact.',
    },
    {
      q: 'Are the listings on SaveOnYourHome.com verified?',
      a: 'Every listing is reviewed for completeness and accuracy before it goes live. Sellers must provide their contact information, a valid address, and accurate property details. While we cannot guarantee the condition of every property sight-unseen, we do remove listings that violate our terms or are reported as misleading. We always recommend an independent home inspection before closing.',
    },
    {
      q: 'How is the price set on a FSBO listing?',
      a: 'The seller sets the price based on their research — typically using comparable sales in the area, recent appraisals, or online valuation tools. Because there is no listing-agent commission baked in, FSBO prices are often more competitive than traditional listings. You are free to negotiate; making a reasonable offer with comps to support it is the best approach.',
    },
    {
      q: 'What costs should I expect when buying a home?',
      a: 'In addition to the purchase price, plan for a down payment (commonly 3%–20%), closing costs (roughly 2%–5% of the purchase price covering title, escrow, lender fees, and prepaid taxes/insurance), a home inspection (~$300–$600), and an appraisal if your lender requires one. Use the Mortgage Calculator on each listing to estimate your monthly payment including taxes, insurance, and HOA fees.',
    },
    {
      q: 'What if I find an issue during the home inspection?',
      a: 'Most purchase agreements include an inspection contingency that lets you renegotiate the price, request repairs, or walk away from the deal within a set window. Use the inspection report to ask the seller for credits or repairs. If you cannot reach an agreement, your earnest money deposit is typically refunded as long as you cancel within the contingency period.',
    },
    {
      q: 'Can I save my favorite listings to revisit later?',
      a: 'Yes. Click the heart icon on any listing card or detail page to save it to your favorites. Sign in (or create a free account) to sync your favorites across devices and to receive notifications if a saved listing has a price change, opens for an open house, or goes under contract.',
    },
    {
      q: 'How long does the home-buying process usually take?',
      a: 'From offer-accepted to closing, expect 30–45 days for a financed purchase and 7–14 days for an all-cash deal. Timelines depend on lender turnaround, inspections, appraisal, and title work. Working with a responsive lender and title company — and submitting documents promptly — keeps things on schedule.',
    },
  ];

  return (
    <>
      <SEOHead
        title="Buyer FAQs"
        description="Find instant answers at SaveOnYourHome. From buying steps to negotiation, our FAQs have you covered. Questions? Ask anytime. Happy hunting!"
        keywords="buyer FAQ, home buying questions, FSBO buyer tips, buying home by owner, SaveOnYourHome buyer help"
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
        <img src="https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Buyer FAQs" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>BUYER SUPPORT</span>
              </div>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Buyer <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FAQs</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                Find instant answers at SaveOnYourHome. From buying steps to negotiation, our FAQs have you covered. Questions? Ask anytime. Happy hunting!
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

      {/* Contact CTA */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div
            className="rounded-3xl text-center py-14 sm:py-20 px-8"
            style={{ backgroundColor: 'rgb(240,240,240)' }}
          >
            <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[42px] lg:leading-[52px] mb-5 mx-auto" style={{ fontWeight: 700, color: 'rgb(26,24,22)', maxWidth: '700px' }}>
              Our award winning customer service team is always ready to assist you.
            </h2>
            <p className="mx-auto mb-8" style={{ fontSize: '18px', lineHeight: '28px', color: 'rgb(100,100,100)', maxWidth: '600px' }}>
              Selling by owner doesn't mean you're on your own. Get your questions answered so you can move forward with certainty.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Cards */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(26,24,22)' }}>Sell Your Home FSBO</h3>
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

BuyerFAQs.layout = (page) => <MainLayout>{page}</MainLayout>;

export default BuyerFAQs;

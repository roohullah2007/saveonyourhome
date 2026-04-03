import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      label: 'Getting Started',
      faqs: [
        { q: 'What is SaveOnYourHome?', a: 'SaveOnYourHome was created to simplify the sale of private residential properties. Our team is made up of experienced professionals who share a passion for technology and real estate. We empower FSBO sellers with comprehensive free tools while enhancing the buyer experience — making home buying and selling more accessible, transparent, and cost-effective for everyone.' },
        { q: 'How do I get started listing my property?', a: "Simply click on 'List Your Property' button, create a free account, and follow our step-by-step listing process. You'll add property details, upload photos, set your price, and your listing will be live within minutes." },
        { q: 'Do I need to be a licensed realtor?', a: "No, you don't need any license or real estate experience. SaveOnYourHome is specifically designed for homeowners who want to sell their property themselves. We provide all the guidance and tools you need." },
        { q: 'What areas does SaveOnYourHome serve?', a: 'We serve all of Oklahoma, including major cities like Oklahoma City, Tulsa, Norman, Broken Arrow, Edmond, and all surrounding areas.' },
      ],
    },
    {
      label: 'Pricing & Fees',
      faqs: [
        { q: 'How much does it cost to list my property?', a: "Our basic listing is completely FREE forever. We don't charge commissions or fees. Optional premium packages are available for additional marketing exposure." },
        { q: 'Are there any hidden fees?', a: 'Absolutely not. We believe in complete transparency. Our free listing is truly free with no hidden charges. Premium features are clearly priced upfront.' },
        { q: 'How much money can I save by selling FSBO?', a: 'Traditional commissions range from 5-6% of your home\'s sale price. On a $300,000 home, that\'s $15,000-$18,000. By selling with SaveOnYourHome, owners increase their profits while buyers can simultaneously reduce their costs.' },
        { q: 'Do I need to offer a buyer\'s agent commission?', a: 'While not required, offering a buyer\'s agent commission (typically 2.5-3%) can increase your property\'s exposure since many buyers work with agents. You decide what commission, if any, to offer.' },
      ],
    },
    {
      label: 'Listings & Marketing',
      faqs: [
        { q: 'What is an MLS flat-fee listing?', a: 'An MLS flat-fee listing allows you to list your property on the Multiple Listing Service for a one-time flat fee instead of paying a percentage-based commission. This gives you access to thousands of potential buyers.' },
        { q: 'Will my listing appear on Zillow, Trulia, and Realtor.com?', a: 'Yes! With our MLS integration package, your listing automatically syndicates to major real estate websites including Zillow, Trulia, Realtor.com, and many others.' },
        { q: 'How long does my listing stay active?', a: 'Your listing stays active until you sell your property or choose to remove it. No time limits on free listings. Premium MLS listings typically run for 6 months and can be renewed.' },
        { q: 'Can I edit my listing after it\'s published?', a: 'Yes! You have complete control and can update details, change photos, adjust pricing, or modify any information at any time through your dashboard.' },
        { q: 'What photos should I include?', a: 'Include at least 10-15 high-quality photos showing exterior views, all main rooms, kitchen, bathrooms, special features, and outdoor spaces. We also offer professional photography services.' },
      ],
    },
    {
      label: 'Selling Process',
      faqs: [
        { q: 'How do buyers contact me?', a: "Buyers can contact you directly through the contact form on your listing. You'll receive inquiries via email or through our messaging system. No agents will intercept your communication." },
        { q: 'Can I schedule and conduct showings myself?', a: "Yes! You have complete control over showings. Schedule them at times that work for you. Many sellers find this gives them the opportunity to highlight their home's best features directly." },
        { q: 'What happens when I receive an offer?', a: 'You can review it and choose to accept, reject, or counter. We recommend consulting a real estate attorney to review offers and assist with negotiations.' },
        { q: 'How long does it take to sell a FSBO property?', a: 'Properties listed on the MLS and priced competitively typically sell within 30-90 days. Proper pricing, good photos, and being responsive to inquiries are key.' },
        { q: 'What paperwork do I need?', a: "You'll need a purchase agreement, seller's disclosure form, title documents, and closing documents. We recommend consulting a real estate attorney for your state requirements." },
      ],
    },
  ];

  const currentFaqs = categories[activeCategory].faqs;

  return (
    <>
      <Head title="FAQs - SaveOnYourHome" />

      {/* Hero */}
      <section className="relative w-full overflow-hidden" style={{ height: '500px' }}>
        <img src="/images/home-img-2.webp" alt="FAQs" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>HELP CENTER</span>
              </div>
              <h1 className="text-[26px] leading-[34px] sm:text-[36px] sm:leading-[44px] lg:text-[46px] lg:leading-[56px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Frequently Asked <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Questions</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                Find answers to common questions about listing, buying, pricing, and more. Can't find what you need? Contact us anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-20" style={{ maxWidth: '1400px' }}>
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => { setActiveCategory(i); setOpenIndex(null); }}
                className="rounded-full px-5 py-2 text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: activeCategory === i ? 'rgb(26,24,22)' : 'transparent',
                  color: activeCategory === i ? 'white' : 'rgb(26,24,22)',
                  border: activeCategory === i ? '1px solid rgb(26,24,22)' : '1px solid rgb(209,213,219)',
                  letterSpacing: '0.3px',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto space-y-3">
            {currentFaqs.map((faq, i) => (
              <div key={`${activeCategory}-${i}`} className="rounded-2xl border border-gray-200/60 overflow-hidden" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'rgb(26,24,22)' }}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5">
                    <p style={{ fontSize: '14px', lineHeight: '24px', color: 'rgb(100,100,100)' }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative overflow-hidden" style={{ backgroundColor: 'rgb(26,24,22)' }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent)', filter: 'blur(60px)' }} />
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-20 relative z-10" style={{ maxWidth: '1400px' }}>
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-4"><span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)' }}>STILL HAVE QUESTIONS?</span></div>
            <h2 className="text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px] mb-5" style={{ fontWeight: 700, color: 'white' }}>
              We're Here to Help
            </h2>
            <p style={{ fontSize: '15px', lineHeight: '26px', color: 'rgba(255,255,255,0.65)', marginBottom: '32px' }}>
              Can't find the answer you're looking for? Our team is always ready to assist you.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full transition-opacity hover:opacity-90" style={{ backgroundColor: 'white', color: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}>
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/list-property" className="inline-flex items-center justify-center gap-2 rounded-full transition-colors" style={{ height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.25)', color: 'white', background: 'rgba(255,255,255,0.08)' }}>
                List Your Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

FAQs.layout = (page) => <MainLayout>{page}</MainLayout>;

export default FAQs;

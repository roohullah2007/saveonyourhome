import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import HeroBadge from '@/Components/HeroBadge';
import MainLayout from '@/Layouts/MainLayout';

function FSBOGuide() {
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    { number: '01', title: 'Prepare your home', items: [
      { sub: 'Declutter and deep-clean', text: 'Remove personal items, tidy every room, and consider a professional clean to let your home shine.' },
      { sub: 'Pre-listing inspection', text: 'Spot potential issues early so you can fix them before they become negotiation points.' },
    ]},
    { number: '02', title: 'Set the right price', items: [
      { sub: 'Start with the AI valuation', text: 'Use SaveOnYourHome\'s AI tool for an instant estimate anchored in recent local sales.' },
      { sub: 'Get a professional appraisal', text: 'A licensed appraiser provides a written value report based on at least 3 comparables.' },
      { sub: 'Check online comps', text: 'Validate your number with public listing data from your neighborhood.' },
    ]},
    { number: '03', title: 'Make it show-ready', items: [
      { sub: 'Quick repairs & improvements', text: 'Fix visible damage, touch up paint, and stage rooms to feel bright and spacious.' },
      { sub: 'Oil tank & hazard check', text: 'Underground oil tanks should be inspected or decommissioned to avoid liability later.' },
    ]},
    { number: '04', title: 'Capture pro-quality visuals', items: [
      { sub: 'Bright, wide, and multiple angles', text: 'Open blinds, use natural light, and shoot several options so you can pick the best. Great photos drive clicks.' },
      { sub: 'Video + virtual tour', text: 'Order our 3D tour add-on to help out-of-town buyers self-qualify before visiting.' },
    ]},
    { number: '05', title: 'Line up legal support', items: [
      { sub: 'Engage a real-estate attorney', text: 'They\'ll review contracts, required disclosures, and offer terms, keeping you protected.' },
    ]},
    { number: '06', title: 'List your home', items: [
      { sub: 'Under 5 minutes on SaveOnYourHome', text: 'Add your details, photos, and the virtual tour. Your listing goes live after a quick review.' },
    ]},
    { number: '07', title: 'Market everywhere', items: [
      { sub: 'Custom yard sign + QR code', text: 'Order a free yard sign from your dashboard — every scan lands buyers on your listing.' },
      { sub: 'Open houses & printable flyers', text: 'Host weekend opens and hand out flyers with a QR link for easy follow-up.' },
      { sub: 'Social sharing', text: 'Post to Facebook, Instagram, TikTok, WhatsApp. Buyers talk to buyers.' },
    ]},
    { number: '08', title: 'Be responsive', items: [
      { sub: 'Built-in private messaging', text: 'Schedule showings and answer questions without exposing your phone or email.' },
    ]},
    { number: '09', title: 'Negotiate offers', items: [
      { sub: 'Look past the headline price', text: 'Evaluate financing, contingencies, and timelines. Your attorney can help compare.' },
    ]},
    { number: '10', title: 'Close the sale', items: [
      { sub: 'Work your attorney and title company', text: 'They coordinate paperwork, disclosures, and funds to finalize the transfer.' },
    ]},
    { number: '11', title: 'Move on — and pay it forward', items: [
      { sub: 'Book a mover', text: 'Use our partner directory for vetted movers with SaveOnYourHome pricing.' },
      { sub: 'Leave a review', text: 'Share your experience and the partners you used to help the next FSBO seller.' },
    ]},
  ];

  const faqs = [
    { q: 'How long does a FSBO sale typically take?', a: 'Most FSBO homes that are priced correctly and marketed well sell within 30 to 90 days. Homes in hot markets with great photos often move faster. Under-priced or poorly-marketed listings can linger, so lean on the tools in this guide.' },
    { q: 'How should I set my sales price?', a: 'Start with the AI valuation in your SaveOnYourHome dashboard, validate against recent comps, then optionally pay for a licensed appraisal. Setting the right price from day one is the single biggest factor in how quickly you sell.' },
    { q: 'Do I need a real-estate attorney?', a: 'In some states an attorney is required; everywhere else we strongly recommend one. They\'ll review contracts, disclosures, and help negotiate — usually for a flat fee well under a typical agent commission.' },
    { q: 'Can I accept offers from buyers with an agent?', a: 'Yes. You can work with agent-represented buyers and negotiate any commission arrangement. Many FSBO sellers offer 2–2.5% to the buyer\'s agent to remain competitive, but it\'s entirely optional.' },
    { q: 'What disclosures am I legally required to make?', a: 'Disclosure requirements are state-specific (lead paint, known defects, flood history, etc.). Your attorney or title company will provide the correct forms. When in doubt, disclose.' },
    { q: 'How do I safely hold open houses?', a: 'Require visitors to sign in, keep valuables locked away, ask guests to leave shoes or pictures at the door, and consider having a friend with you. SaveOnYourHome\'s messaging lets you pre-qualify serious buyers before they even show up.' },
    { q: 'What happens if a buyer\'s financing falls through?', a: 'If the contract is contingent on financing, the buyer typically gets their earnest money back and the home returns to active. This is why we recommend requiring pre-approval letters and working closely with your attorney on offer terms.' },
    { q: 'How do I handle inspection negotiations?', a: 'After a home inspection the buyer may request repairs or credits. You can accept, counter, or reject. Focus on safety/structural items — cosmetic asks are usually negotiable. Keep communication professional and documented.' },
    { q: 'Is SaveOnYourHome really free to list?', a: 'Yes. Listing your home is free. Optional paid add-ons include professional photography, virtual tours, video, and MLS syndication — you pick only what you want.' },
    { q: 'What about commissions and closing costs?', a: 'By going FSBO you eliminate the listing agent\'s commission (typically 2.5–3% of the sale price). You\'ll still pay standard closing costs (title, transfer tax, attorney fee) — we can connect you with partners who make this affordable.' },
  ];

  return (
    <>
      <SEOHead
        title="FSBO Guide — Sell Your Home By Owner"
        description="The complete step-by-step FSBO guide: price, prepare, list, market, and close the sale of your home without paying agent commissions."
        keywords="FSBO guide, sell home by owner, how to sell house without realtor, FSBO steps, for sale by owner tips"
      />

      {/* Hero — concise heading */}
      <section className="relative w-full overflow-hidden h-[380px] md:h-[420px]">
        <img src="https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="FSBO sellers guide" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.78) 0%, rgba(10,15,30,0.55) 50%, rgba(10,15,30,0.7) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '160px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative h-full">
          <div className="mx-auto flex h-full items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px' }}>
            <div className="max-w-[700px]">
              <HeroBadge className="mb-5">FSBO Guide</HeroBadge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1]">
                Sell your home,<br />
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  skip the agent.
                </span>
              </h1>
              <p className="mt-4 text-lg text-white/80 max-w-xl leading-relaxed">
                A clear, 11-step playbook for pricing, preparing, listing, marketing, and closing your FSBO sale.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/list-property" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3355FF] text-white px-6 py-3 text-sm font-semibold hover:opacity-90">
                  List my home <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#steps" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10">
                  Jump to the steps
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps — clean vertical numbered layout (NO timeline) */}
      <section id="steps" className="bg-gray-50 py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1180px' }}>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">Step by Step</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816]">How to sell your home by owner</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Work through each of the 11 steps below. Everything you need is built into SaveOnYourHome or covered by a trusted partner.
            </p>
          </div>

          <ol className="space-y-4">
            {steps.map((step) => (
              <li key={step.number} className="group rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
                <div className="flex gap-5 md:gap-7 p-6 md:p-8">
                  <div className="flex-shrink-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3355FF] text-white">
                      <span className="text-lg font-extrabold tracking-tight">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-[#1a1816] mb-3">{step.title}</h3>
                    <div className="space-y-2.5">
                      {step.items.map((item, j) => (
                        <p key={j} className="text-[15px] md:text-[16px] leading-7 text-gray-700">
                          <strong className="text-[#1a1816]">{item.sub}.</strong> {item.text}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-2xl bg-[#1a1816] text-white p-8 md:p-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to list?</h3>
            <p className="text-white/75 mb-6 max-w-xl mx-auto">
              Free to list. Get offers directly from buyers. Keep the commission in your pocket.
            </p>
            <Link href="/list-property" className="inline-flex items-center gap-2 rounded-full bg-[#3355FF] px-6 py-3 text-sm font-semibold hover:opacity-90">
              Start your listing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1180px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">FSBO FAQs</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816] mb-4">Frequently asked questions</h2>
              <p className="text-gray-600 mb-6">
                Straightforward answers to the most common FSBO questions. Can't find what you're looking for?
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#3355FF] text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90">
                Ask a question <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-3 space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                    <span className="text-[16px] font-semibold text-[#1a1816] pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-[15px] leading-7 text-gray-700">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

FSBOGuide.layout = (page) => <MainLayout>{page}</MainLayout>;
export default FSBOGuide;

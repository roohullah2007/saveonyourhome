import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  ArrowRight, ChevronDown, CheckCircle2, Calculator, Search,
  FileSignature, Key, Sparkles,
} from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import HeroBadge from '@/Components/HeroBadge';
import MainLayout from '@/Layouts/MainLayout';

function BuyersGuide() {
  const [openFaq, setOpenFaq] = useState(0);

  const steps = [
    {
      n: '01',
      icon: Calculator,
      title: 'Get pre-approved & know your budget',
      text: 'Before you browse a single listing, pull your credit and get pre-approved with a licensed mortgage lender. A pre-approval letter tells you exactly what you can afford and signals to sellers you\'re serious.',
      bullets: [
        'Soft credit pull — no score impact',
        'Lock in your buying power in 24–48 hrs',
        'Sellers strongly prefer pre-approved offers',
      ],
      image: 'https://images.pexels.com/photos/7821486/pexels-photo-7821486.jpeg?auto=compress&cs=tinysrgb&w=1200',
      cta: { href: '/get-pre-approved', label: 'Get pre-approved' },
    },
    {
      n: '02',
      icon: Search,
      title: 'Search and tour homes that fit',
      text: 'Filter SaveOnYourHome by price, location, beds, and amenities. Save favorites, message sellers directly, and schedule tours — all without exposing your phone or email.',
      bullets: [
        'Direct messaging with sellers — no agent gatekeeping',
        'Saved searches with new-listing alerts',
        '360° virtual tours to pre-qualify from home',
      ],
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      cta: { href: '/properties', label: 'Search homes' },
    },
    {
      n: '03',
      icon: FileSignature,
      title: 'Offer, inspect & finance',
      text: 'When you find the right home, draft a competitive offer with an attorney, inspect the property thoroughly, and finalize your mortgage. Most deals close financing in 3–4 weeks.',
      bullets: [
        'Factor comps and contingencies into your offer',
        'Always inspect — even new construction',
        'Lender orders the appraisal after you\'re under contract',
      ],
      image: 'https://images.pexels.com/photos/7641839/pexels-photo-7641839.jpeg?auto=compress&cs=tinysrgb&w=1200',
      cta: null,
    },
    {
      n: '04',
      icon: Key,
      title: 'Close and move in',
      text: 'Do a final walk-through, secure homeowners insurance, and sign at closing. Set up utilities ahead of move-in day and keep your closing packet — you\'ll need it for taxes and future refinancing.',
      bullets: [
        'Final walk-through 24 hrs before closing',
        'Insurance + utilities set up in advance',
        'Closing typically takes 1–2 hours',
      ],
      image: 'https://images.pexels.com/photos/7937966/pexels-photo-7937966.jpeg?auto=compress&cs=tinysrgb&w=1200',
      cta: null,
    },
  ];

  const stats = [
    { stat: '30–60', label: 'Days offer to close' },
    { stat: '3.5%', label: 'Min FHA down' },
    { stat: '2–5%', label: 'Typical closing costs' },
    { stat: '620+', label: 'Conventional credit' },
  ];

  const quickTips = [
    'Get pre-approved before you start searching — not after',
    'Never skip the inspection, even on new construction',
    'Read every disclosure carefully, twice',
    'Budget closing costs at 3% on top of the purchase price',
  ];

  const faqs = [
    { q: 'How long does the home-buying process take?', a: 'From accepted offer to closing is typically 30–60 days. The search phase before your offer is the variable part — starting with pre-approval and a clear wish list speeds everything up.' },
    { q: 'Do I need a real estate agent to buy?', a: 'No. Many buyers purchase successfully on their own, especially on SaveOnYourHome where sellers list directly. A good attorney to review contracts is far more important than an agent.' },
    { q: 'What\'s a typical down payment?', a: '3.5% for FHA loans, 5–20% for conventional loans. A larger down payment lowers monthly payments and avoids private mortgage insurance (PMI), but don\'t deplete your emergency fund to do it.' },
    { q: 'What closing costs should I expect?', a: '2%–5% of the purchase price covering lender fees, title insurance, escrow, appraisal, and prepaid taxes/insurance. Your lender will send a detailed Loan Estimate within 3 business days of applying.' },
    { q: 'How much does my credit score matter?', a: 'A lot. Conventional loans usually want 620+, FHA goes as low as 580. Even a 20-point swing can mean thousands in interest over the life of the loan. Fix errors and pay down balances before applying.' },
  ];

  return (
    <>
      <SEOHead
        title="Home Buyers Guide"
        description="A concise, four-step guide to buying a home. Pre-approval, search, offers, and closing — everything a confident FSBO buyer needs."
        keywords="home buying guide, how to buy a home, first time home buyer, buy house steps, home buying process"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[460px] md:h-[520px] lg:h-[560px]">
        <img
          src="https://images.pexels.com/photos/7578939/pexels-photo-7578939.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Home buyers guide"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.78) 0%, rgba(10,15,30,0.5) 50%, rgba(10,15,30,0.7) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '180px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-start pt-16 md:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[720px]">
              <HeroBadge>BUYERS GUIDE</HeroBadge>
              <h1 className="text-[32px] leading-[40px] sm:text-[44px] sm:leading-[52px] lg:text-[56px] lg:leading-[64px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Buy your next home{' '}
                <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  with confidence.
                </span>
              </h1>
              <p className="mt-5 text-lg text-white/80 max-w-xl leading-relaxed">
                Four clear steps from budget to keys. No fluff, no agent markup — just what you actually need to know.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link href="/properties" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3355FF] px-6 py-3.5 text-sm font-bold text-white hover:opacity-90">
                  Search homes <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/get-pre-approved" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
                  Get pre-approved
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-white/80 text-sm">
                <div className="inline-flex items-center gap-2">
                  <Key className="w-4 h-4" style={{ color: '#3355FF' }} />
                  <span><strong className="text-white">30–60 days</strong> to keys</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span><strong className="text-white">$0</strong> to browse</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-10" style={{ maxWidth: 1400 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-extrabold text-[#1a1816]">{s.stat}</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps — alternating rich rows */}
      <section className="bg-gray-50 py-14 md:py-24">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1400 }}>
          <div className="text-center mb-14 md:mb-20">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">The 4-step journey</span>
            <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1816] leading-tight">
              From pre-approval to keys
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
              Every step below is something you actually need to do — and something SaveOnYourHome or a trusted partner can help you through.
            </p>
          </div>

          <div className="space-y-16 md:space-y-24">
            {steps.map((s, i) => {
              const imageLeft = i % 2 === 0;
              return (
                <div key={s.n} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                  {/* Image */}
                  <div className={`relative ${imageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative rounded-3xl overflow-hidden shadow-xl">
                      <img src={s.image} alt={s.title} className="w-full h-[340px] md:h-[420px] object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1816]/30 via-transparent to-transparent" />
                    </div>
                    {/* Floating number badge */}
                    <div className={`absolute ${imageLeft ? '-right-4 md:-right-6' : '-left-4 md:-left-6'} -top-4 md:-top-6 rounded-2xl bg-white p-4 md:p-5 shadow-2xl border border-gray-200`}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl" style={{ backgroundColor: '#3355FF' }}>
                          <s.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-[10px] md:text-xs uppercase tracking-wider text-gray-500 leading-none">Step</div>
                          <div className="text-xl md:text-2xl font-extrabold text-[#1a1816] leading-none mt-0.5">{s.n}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div className={imageLeft ? 'lg:order-2' : 'lg:order-1'}>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#1a1816] leading-tight mb-4">
                      {s.title}
                    </h3>
                    <p className="text-[16px] md:text-[17px] leading-8 text-gray-700 mb-6">
                      {s.text}
                    </p>
                    <ul className="space-y-3 mb-6">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#3355FF' }} />
                          <span className="text-[15px] leading-7 text-gray-700">{b}</span>
                        </li>
                      ))}
                    </ul>
                    {s.cta && (
                      <Link href={s.cta.href} className="inline-flex items-center gap-2 rounded-full bg-[#3355FF] text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90">
                        {s.cta.label} <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick tips — dark compact block */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1400 }}>
          <div className="rounded-3xl bg-gradient-to-br from-[#1a1816] to-[#2d2a26] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #3355FF 0%, transparent 70%)' }} />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[2px] text-white/60">Quick tips</span>
                <h3 className="mt-3 text-2xl md:text-3xl font-bold text-white leading-tight">
                  Four things first-time buyers wish they'd known
                </h3>
              </div>
              <ul className="space-y-3">
                {quickTips.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-white/90">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                    <span className="text-[15px] leading-6">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1400 }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">Buyer FAQs</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816] mb-4">Questions, answered</h2>
              <p className="text-gray-600 mb-6">
                The five questions buyers ask most often — with concrete numbers, not fluff.
              </p>
              <Link href="/buyer-faqs" className="inline-flex items-center gap-2 rounded-full bg-[#3355FF] text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90">
                See all buyer FAQs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="lg:col-span-3 space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                    <span className="text-[16px] font-semibold text-[#1a1816] pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && <div className="px-5 pb-5 text-[15px] leading-7 text-gray-700">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1a1816]">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-14 md:py-20 text-center" style={{ maxWidth: 1400 }}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Ready to find your home?
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
            Search FSBO listings, message sellers directly, and save every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/properties" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3355FF] px-7 py-3.5 text-sm font-bold text-white hover:opacity-90">
              Browse homes <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/get-pre-approved" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
              Get pre-approved
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

BuyersGuide.layout = (page) => <MainLayout>{page}</MainLayout>;
export default BuyersGuide;

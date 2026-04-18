import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  ArrowRight, ChevronDown, CheckCircle2, Shield, DollarSign, Camera,
  QrCode, MessageSquare, Smartphone, Users, Star, TrendingUp, Sparkles,
} from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import HeroBadge from '@/Components/HeroBadge';
import MainLayout from '@/Layouts/MainLayout';

function Sellers() {
  const { auth } = usePage().props;
  const user = auth?.user;
  const [openFaq, setOpenFaq] = useState(0);

  const primaryCta = user ? { href: '/list-property', label: 'List my home now' } : { href: '/register', label: 'Create free account & list' };

  const valueProps = [
    { icon: DollarSign, title: 'Keep the commission', text: 'Skip the 5–6% agent fee. On a $400K sale, that\'s $20,000+ back in your pocket.' },
    { icon: Shield, title: 'Full transparency', text: 'No hidden fees, no upsell gimmicks. You own the sale and all the decisions.' },
    { icon: Smartphone, title: 'Modern tools included', text: 'AI valuation, QR yard signs, private messaging, virtual tours — all built in.' },
    { icon: Users, title: 'Buyers come to you', text: 'Serious FSBO-friendly buyers browse our platform daily.' },
  ];

  const steps = [
    { n: '01', title: 'Create your free account', text: 'Sign up in under a minute. No credit card. No obligations.', cta: user ? null : { href: '/register', label: 'Sign up free' } },
    { n: '02', title: 'List your home in 5 minutes', text: 'Add photos, details, and price. Our smart wizard walks you through every field.', cta: { href: '/list-property', label: 'Start a listing' } },
    { n: '03', title: 'Market and manage offers', text: 'Use your free yard sign with QR code, invite buyers, host open houses, and handle messages from a single dashboard.', cta: null },
    { n: '04', title: 'Close and save thousands', text: 'Accept the best offer, work with your attorney or title company, and pocket the commission you would have paid an agent.', cta: null },
  ];

  const features = [
    { icon: TrendingUp, title: 'AI valuation tool', text: 'Price confidently with our instant valuation based on recent local sales.' },
    { icon: Camera, title: 'Photo & video galleries', text: 'Upload unlimited photos, add virtual tours or video walkthroughs — all included.' },
    { icon: QrCode, title: 'Free QR yard sign', text: 'Order a free yard sign with a custom QR code that drives traffic to your listing.' },
    { icon: MessageSquare, title: 'Private buyer messaging', text: 'Communicate safely with buyers. Your phone and email stay private until you share them.' },
    { icon: Sparkles, title: 'Premium add-ons', text: 'Optional pro photography, MLS syndication, and 3D tours if you want the extras.' },
    { icon: Star, title: 'Trusted partners', text: 'Attorneys, inspectors, mortgage bankers — vetted by us, available when you need them.' },
  ];

  const compareRows = [
    { feature: 'Listing cost', agent: '$0 upfront (3% commission at close)', fsbo: 'Free, forever' },
    { feature: 'Typical commission paid', agent: '5%–6% of sale price', fsbo: '0%–2.5% (your choice)' },
    { feature: 'Control over showings', agent: 'Agent schedules', fsbo: 'You schedule' },
    { feature: 'Photos & marketing', agent: 'Agent package', fsbo: 'Included + optional premium' },
    { feature: 'Who negotiates', agent: 'Your agent', fsbo: 'You, with optional attorney support' },
    { feature: 'Net proceeds on $400K', agent: '≈ $376,000', fsbo: '≈ $396,000+' },
  ];

  const testimonials = [
    { name: 'Jessica & Mark', city: 'Tulsa, OK', text: 'We listed on SaveOnYourHome on a Monday and accepted an offer the following Sunday. We saved $18,400 in commissions.', savings: '$18,400 saved' },
    { name: 'David L.', city: 'Raleigh, NC', text: 'The process was shockingly easy. The QR yard sign alone drove 40+ scans in the first weekend.', savings: '$22,750 saved' },
    { name: 'Priya & Sanjay', city: 'Brandon, FL', text: 'We handled showings on our terms. Our attorney reviewed the contract for $500 — that\'s it.', savings: '$14,900 saved' },
  ];

  const faqs = [
    { q: 'Is listing on SaveOnYourHome really free?', a: 'Yes — 100% free. You can list your home, upload photos, and manage inquiries without paying anything. We offer optional paid upgrades like professional photography and MLS syndication, but you choose what to add.' },
    { q: 'What does "sell by owner" actually mean?', a: 'You control every step: pricing, marketing, negotiating, and closing — without a listing agent taking a commission. We provide the tools, partners, and platform to make it straightforward.' },
    { q: 'Do I still need an attorney or title company?', a: 'Yes — for the legal and closing work. A flat-fee real estate attorney typically runs $400–$800 and is a fraction of an agent\'s commission. We can connect you with vetted local pros.' },
    { q: 'How long does a FSBO sale take?', a: 'Well-priced, well-photographed FSBO homes typically sell in 30–90 days. Our platform gives you every tool to compete with agent-listed homes.' },
    { q: 'Will my listing show up on Zillow/Realtor.com?', a: 'The basic listing is featured on SaveOnYourHome. If you want syndication to Zillow, Realtor.com and the MLS, we offer an affordable paid add-on.' },
    { q: 'Can I work with buyer\'s agents who bring offers?', a: 'Absolutely. You can negotiate a buyer\'s agent commission (commonly 2–2.5%) or decline. You stay in full control.' },
  ];

  return (
    <>
      <SEOHead
        title="Sell Your Home — Free FSBO Listing"
        description="Sell your home by owner and keep the commission. Free listings, pro tools, private messaging, QR yard sign, and vetted local partners. List in 5 minutes on SaveOnYourHome."
        keywords="sell my home, FSBO, for sale by owner, sell home without agent, no commission real estate, list home free"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1816] to-[#2d2a26]">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 75% 10%, rgba(51,85,255,0.4) 0%, transparent 55%)' }} />
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-14 md:py-24 relative" style={{ maxWidth: 1400 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <HeroBadge className="mb-5">Sell Your Home</HeroBadge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05]">
                Keep your <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">equity.</span><br />
                Skip the <span className="line-through decoration-[#3355FF] decoration-4">agent</span>.
              </h1>
              <p className="mt-5 text-lg text-white/80 max-w-xl leading-relaxed">
                List your home free on SaveOnYourHome, market it like a pro, and pocket the commission a traditional agent would have taken. The average seller keeps $18,000+ at closing.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href={primaryCta.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3355FF] px-6 py-3.5 text-sm font-bold text-white hover:opacity-90">
                  {primaryCta.label} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
                  See how it works
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-white/70">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <div className="text-sm">Trusted by thousands of FSBO sellers</div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -top-6 -right-6 rounded-2xl bg-[#3355FF] text-white px-5 py-3 shadow-xl z-10">
                  <div className="text-xs uppercase tracking-wider opacity-80">Commission saved</div>
                  <div className="text-2xl font-extrabold">$18,400</div>
                </div>
                <img
                  src="https://images.pexels.com/photos/7641893/pexels-photo-7641893.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="For sale by owner"
                  className="rounded-2xl w-full h-[440px] object-cover"
                />
                <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white text-[#1a1816] px-5 py-3 shadow-xl">
                  <div className="text-xs uppercase tracking-wider text-gray-500">Listing fee</div>
                  <div className="text-2xl font-extrabold">$0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value props strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-10" style={{ maxWidth: 1400 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((v) => (
              <div key={v.title} className="flex items-start gap-3">
                <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <v.icon className="w-5 h-5" style={{ color: '#3355FF' }} />
                </div>
                <div>
                  <div className="font-bold text-[#1a1816] mb-1">{v.title}</div>
                  <div className="text-sm text-gray-600 leading-6">{v.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50 py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">How it works</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816]">From listing to closing — you're in control</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Four clear steps, every tool included, and vetted partners ready when you need help.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl bg-white border border-gray-200 p-7">
                <div className="text-[#3355FF] text-3xl font-extrabold mb-3">{s.n}</div>
                <h3 className="text-xl font-bold text-[#1a1816] mb-2">{s.title}</h3>
                <p className="text-gray-600 text-[15px] leading-7 mb-4">{s.text}</p>
                {s.cta && (
                  <Link href={s.cta.href} className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#3355FF' }}>
                    {s.cta.label} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">Everything you need</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816]">Built for FSBO sellers, top to bottom</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-200 p-7 hover:border-gray-300 hover:shadow-md transition-all">
                <f.icon className="w-7 h-7 mb-4" style={{ color: '#3355FF' }} />
                <h3 className="text-lg font-bold text-[#1a1816] mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-6">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">Traditional agent vs. FSBO</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816]">See exactly where the money goes</h2>
          </div>
          <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 bg-[#1a1816] text-white text-sm font-bold">
              <div className="p-4">Feature</div>
              <div className="p-4 text-center">Traditional agent</div>
              <div className="p-4 text-center bg-[#3355FF]">SaveOnYourHome (FSBO)</div>
            </div>
            {compareRows.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="p-4 font-semibold text-[#1a1816]">{row.feature}</div>
                <div className="p-4 text-center text-gray-700">{row.agent}</div>
                <div className="p-4 text-center font-semibold" style={{ color: '#3355FF' }}>{row.fsbo}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href={primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[#3355FF] px-6 py-3.5 text-sm font-bold text-white hover:opacity-90">
              {primaryCta.label} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">Real sellers, real savings</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816]">Thousands saved. Zero regrets.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-gray-200 p-7 hover:shadow-md transition-all">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 text-[15px] leading-7 mb-5">"{t.text}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="font-bold text-[#1a1816] text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.city}</div>
                  </div>
                  <div className="rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-bold">{t.savings}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">Seller FAQs</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816] mb-4">Common questions</h2>
              <p className="text-gray-600 mb-6">
                Need something specific? Check out our full FAQ or contact us directly.
              </p>
              <Link href="/seller-faqs" className="inline-flex items-center gap-2 rounded-full bg-[#3355FF] text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90">
                View all seller FAQs <ArrowRight className="w-4 h-4" />
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
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-14 md:py-20 text-center" style={{ maxWidth: 1180 }}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Ready to sell and save?</h2>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
            {user
              ? 'List your home in minutes and start receiving offers directly from buyers.'
              : 'Create your free account, list your home in under five minutes, and start receiving offers.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={primaryCta.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3355FF] px-8 py-4 text-sm font-bold text-white hover:opacity-90">
              {primaryCta.label} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/fsbo-guide" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10">
              Read the FSBO guide
            </Link>
          </div>
          <div className="mt-8 inline-flex items-center gap-2 text-white/60 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card • No hidden fees • No commissions
          </div>
        </div>
      </section>
    </>
  );
}

Sellers.layout = (page) => <MainLayout>{page}</MainLayout>;
export default Sellers;

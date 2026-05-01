import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  ArrowRight, ChevronDown, CheckCircle2, XCircle, Eye, Clock, Users,
  TrendingUp, Globe2, Zap, Box, Video, Camera, Smartphone, Sparkles,
} from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import HeroBadge from '@/Components/HeroBadge';
import MainLayout from '@/Layouts/MainLayout';

function VirtualTours() {
  const [openFaq, setOpenFaq] = useState(0);

  const stats = [
    { stat: '87%', label: 'More online engagement' },
    { stat: '2×', label: 'Qualified buyer inquiries' },
    { stat: '31%', label: 'Faster time-to-offer' },
    { stat: '24 / 7', label: 'Always-open house' },
  ];

  const benefits = [
    { icon: Eye, title: 'Full 360° walk-through', text: 'Buyers step through every room at their own pace — living room, kitchen, basement — nothing hidden, nothing missed.' },
    { icon: Users, title: 'Pre-qualified visitors', text: 'By the time someone books a showing, they\'ve already "seen" the home. Fewer tire-kickers, more serious buyers.' },
    { icon: Clock, title: 'Open 24/7', text: 'Remote buyers, night-shift workers, out-of-state relocations — all get equal access, any time zone, no scheduling.' },
    { icon: TrendingUp, title: 'Higher listing views', text: 'Listings with virtual tours consistently out-perform photo-only listings in click-through and saved-listing rates.' },
    { icon: Globe2, title: 'Attract relocating buyers', text: 'Out-of-town and international buyers can tour confidently without flying in — expanding your buyer pool.' },
    { icon: Zap, title: 'Faster offers', text: 'Serious buyers arrive to showings ready to talk terms instead of asking "how many bedrooms again?"' },
  ];

  const withoutTour = [
    'Buyers rely on static photos and imagination',
    'Out-of-town buyers cannot assess fit remotely',
    'More low-intent showings and tire-kickers',
    'Harder to stand out in search results',
  ];
  const withTour = [
    'Buyers experience the space like they\'re there',
    'Remote buyers can self-qualify from anywhere',
    'Showings are serious, ready-to-offer visits',
    'Listings rank higher and get more saves',
  ];

  const steps = [
    { n: '01', title: 'Shoot the tour', text: 'DIY with a 360 camera or phone app, or order a professional shoot from our media partners — we handle the scheduling.' },
    { n: '02', title: 'Get your embed code', text: 'Your chosen provider (Matterport, Zillow 3D, Asteroom, iStaging, etc.) generates a single embed URL or iframe.' },
    { n: '03', title: 'Add it to your listing', text: 'Open your listing on SaveOnYourHome, paste the embed URL into the Virtual Tour field, and save. The tour appears instantly.' },
    { n: '04', title: 'Share & market', text: 'Promote your listing with the tour URL in emails, social posts, and your QR yard sign. Buyers can tour anytime.' },
  ];

  const providers = [
    { name: 'Matterport', desc: 'Industry standard. Dollhouse view, measurements, high fidelity.' },
    { name: 'Zillow 3D', desc: 'Free via the Zillow app. Great for DIY sellers syndicating to Zillow.' },
    { name: 'Asteroom', desc: 'Budget-friendly app using your phone + a tripod.' },
    { name: 'iStaging', desc: 'Flexible platform with custom branding options.' },
    { name: 'Giraffe360', desc: 'Premium results with included photography service.' },
    { name: 'EyeSpy360', desc: 'Simple DIY captures for quick turn-around listings.' },
  ];

  const faqs = [
    { q: 'Do I have to pay for a virtual tour?', a: 'No. You can DIY a virtual tour for free using apps like Zillow 3D, Asteroom, or Kuula. SaveOnYourHome lets you embed any provider — paid or free. Prefer professionals? Contact us and we\'ll connect you with a vetted photographer.' },
    { q: 'What equipment do I need for a DIY tour?', a: 'An iPhone or Android phone is enough for apps like Zillow 3D or Asteroom. For higher quality, a $200–$400 360 camera (Ricoh Theta, Insta360) and a tripod work great.' },
    { q: 'How long does a shoot take?', a: 'A typical 3-bedroom home takes 1–2 hours to capture with a professional crew and around 24 hours to process. DIY apps can publish immediately.' },
    { q: 'Can I embed a YouTube video tour instead?', a: 'Yes — SaveOnYourHome supports standard video URLs (YouTube, Vimeo) in the Video Tour field separately from the 360 Virtual Tour embed.' },
    { q: 'Will my virtual tour work on mobile?', a: 'All major providers render responsively on mobile and tablet. Buyers can even experience many tours in VR headsets for full immersion.' },
    { q: 'Can I update the tour after going live?', a: 'Yes. Just paste a new embed URL into your listing edit screen and save. The old tour is instantly replaced.' },
    { q: 'Do virtual tours really help sell homes faster?', a: 'Industry data from Zillow and Matterport shows listings with 3D tours get meaningfully more views and inquiries. Our own sellers regularly cite the virtual tour as the feature that converted out-of-area buyers.' },
  ];

  return (
    <>
      <SEOHead
        title="360 Virtual Tours"
        description="Add an immersive 360° virtual tour to your FSBO listing on SaveOnYourHome. DIY or pro — Matterport, Zillow 3D and more. Reach remote buyers, pre-qualify visitors, and sell faster."
        keywords="360 virtual tours, Matterport, Zillow 3D tour, virtual home tour, real estate 3D tour, FSBO virtual tour"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img src="https://images.pexels.com/photos/3935333/pexels-photo-3935333.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="360 Virtual Tours" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.78) 0%, rgba(10,15,30,0.5) 50%, rgba(10,15,30,0.7) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '180px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-start pt-16 md:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[700px]">
              <HeroBadge>VIRTUAL TOURS</HeroBadge>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Sell faster with an <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>immersive 360° tour.</span>
              </h1>
              <p className="mt-5 text-lg text-white/80 max-w-xl leading-relaxed">
                Let buyers walk through your home from anywhere, day or night. Embed any provider — Matterport, Zillow 3D, or a free DIY app — in under a minute.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link href="/list-property" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3355FF] px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                  Add a tour to my listing <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-10" style={{ maxWidth: 1180 }}>
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

      {/* What is a 360 Tour */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">What it is</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816] leading-tight">
                A walkable, interactive 3D model of your home
              </h2>
              <p className="mt-5 text-gray-600 text-[16px] leading-7">
                Unlike a static photo gallery, a 360° virtual tour stitches together dozens of wide-angle captures into a continuous, navigable space. Buyers click through rooms, look up at ceilings, peek into closets, and get a real sense of scale — exactly how they would on an in-person showing.
              </p>
              <p className="mt-4 text-gray-600 text-[16px] leading-7">
                SaveOnYourHome embeds any standard 3D tour — paid or free — directly on your listing page, right next to the photos. One link, zero friction, maximum impact.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Box, label: 'Dollhouse + floor plan views' },
                  { icon: Video, label: 'Smooth walk-through navigation' },
                  { icon: Camera, label: 'High-res panoramic stills' },
                  { icon: Smartphone, label: 'Works on mobile + VR' },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2">
                    <f.icon className="w-5 h-5" style={{ color: '#3355FF' }} />
                    <span className="text-sm text-gray-700">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                <img
                  src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Interactive 360 virtual tour preview"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white/95 backdrop-blur-sm shadow-xl px-5 py-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: '#3355FF' }}>
                      <Box className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-bold text-[#1a1816]">Interactive 360° view</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-2xl bg-[#3355FF] text-white px-4 py-3 shadow-xl hidden sm:block">
                <div className="text-xs uppercase tracking-wider opacity-80">Loads in</div>
                <div className="text-xl font-extrabold">&lt; 2 sec</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">Why it works</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816]">Six reasons buyers love virtual tours</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-gray-200 p-7 hover:border-gray-300 hover:shadow-md transition-all">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 mb-4">
                  <b.icon className="w-5 h-5" style={{ color: '#3355FF' }} />
                </div>
                <h3 className="text-lg font-bold text-[#1a1816] mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-6">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* With vs Without comparison */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">The difference it makes</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816]">With vs. without a virtual tour</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <div className="inline-flex items-center gap-2 mb-5 rounded-full bg-gray-100 px-3 py-1">
                <XCircle className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Photos only</span>
              </div>
              <ul className="space-y-3">
                {withoutTour.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-gray-600">
                    <XCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 p-8" style={{ borderColor: '#3355FF', background: 'linear-gradient(180deg, rgba(51,85,255,0.04) 0%, white 100%)' }}>
              <div className="inline-flex items-center gap-2 mb-5 rounded-full px-3 py-1" style={{ backgroundColor: '#3355FF' }}>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">With 360° tour</span>
              </div>
              <ul className="space-y-3">
                {withTour.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-[#1a1816] font-medium">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#3355FF' }} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">How it works</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816]">Four steps to add a virtual tour</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={s.n} className="relative rounded-2xl border border-gray-200 bg-white p-7 hover:border-gray-300 hover:shadow-md transition-all">
                <div className="text-[#3355FF] text-3xl font-extrabold mb-3">{s.n}</div>
                <h3 className="text-lg font-bold text-[#1a1816] mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-6">{s.text}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-5 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">Fully compatible</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816]">Works with every major provider</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Use whichever 3D tour service you already know and love — or pick a new one. If they provide an embed URL, we support it.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {providers.map((p) => (
              <div key={p.name} className="rounded-2xl border border-gray-200 bg-white p-6 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 shrink-0">
                  <Box className="w-5 h-5" style={{ color: '#3355FF' }} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[#1a1816]">{p.name}</div>
                  <div className="text-sm text-gray-600 mt-1 leading-6">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIY vs Pro pricing cards */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">Two ways to get one</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816]">DIY or leave it to us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-gray-200 p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 mb-4">
                <Sparkles className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">DIY — Free</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1a1816] mb-3">Shoot it yourself</h3>
              <p className="text-gray-600 mb-5 leading-7">
                Download a free app like <strong>Zillow 3D Home</strong> or <strong>Asteroom</strong>. All you need is your phone and about an hour. Great for straightforward homes and budget-conscious sellers.
              </p>
              <ul className="space-y-2 mb-6">
                {['$0 out of pocket', 'Ready in ~1 hour', 'Re-shoot anytime for free', 'Works from your phone'].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t}
                  </li>
                ))}
              </ul>
              <Link href="/list-property" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#3355FF' }}>
                Start your listing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="rounded-2xl border-2 p-8 relative" style={{ borderColor: '#3355FF' }}>
              <div className="absolute top-4 right-4 rounded-full bg-[#3355FF] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Popular</div>
              <div className="inline-flex items-center gap-2 rounded-full mb-4 px-3 py-1" style={{ backgroundColor: '#3355FF' }}>
                <Camera className="w-4 h-4 text-white" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">Professional shoot</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1a1816] mb-3">Let our partners handle it</h3>
              <p className="text-gray-600 mb-5 leading-7">
                Our vetted photographers bring pro 360 cameras and deliver a polished, Matterport-quality tour you can embed the same week. Reach out and we'll set you up with a local pro.
              </p>
              <ul className="space-y-2 mb-6">
                {['Pro 360 camera + tripod', 'Editing & stitching included', 'Delivered within 48 hours', 'Personalized pricing'].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#3355FF' }} /> {t}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: '#3355FF' }}>
                Contact us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">Virtual tour FAQs</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816] mb-4">Questions, answered</h2>
              <p className="text-gray-600 mb-6">
                Everything FSBO sellers typically ask before adding a 360° tour.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#3355FF] text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90">
                Ask a specific question <ArrowRight className="w-4 h-4" />
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
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Add a virtual tour. Sell faster.
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
            List free on SaveOnYourHome and add an immersive 360° tour in minutes. Buyers walk through; you skip the commission.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/list-property" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3355FF] px-7 py-3.5 text-sm font-bold text-white hover:opacity-90">
              List my home free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

VirtualTours.layout = (page) => <MainLayout>{page}</MainLayout>;
export default VirtualTours;

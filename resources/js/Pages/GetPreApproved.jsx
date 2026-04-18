import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, FileCheck, TrendingDown, ChevronDown } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import HeroBadge from '@/Components/HeroBadge';
import MainLayout from '@/Layouts/MainLayout';

function GetPreApproved() {
  const { flash } = usePage().props;
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const { data, setData, post, processing, errors, reset, transform } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    purchase_price: '',
    timeframe: '',
    zip: '',
  });

  transform((d) => ({
    name: `${d.first_name} ${d.last_name}`.trim(),
    email: d.email,
    phone: d.phone,
    subject: 'Pre-Approval Request',
    message: [
      `Estimated Purchase Price: ${d.purchase_price || '—'}`,
      `ZIP: ${d.zip || '—'}`,
      `Timeframe: ${d.timeframe || '—'}`,
    ].join('\n'),
  }));

  const submit = (e) => {
    e.preventDefault();
    post(route('contact.store'), {
      onSuccess: () => {
        reset();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 6000);
      },
    });
  };

  const benefits = [
    { icon: TrendingDown, title: 'No credit score hit', text: 'Our partner lenders use a soft credit pull — no impact on your score.' },
    { icon: ShieldCheck, title: 'Licensed pros only', text: 'Every lender is a vetted, licensed mortgage banker — no surprises.' },
    { icon: Clock, title: 'Fast turnaround', text: 'Most applicants receive a pre-approval letter in 24 to 48 hours.' },
    { icon: FileCheck, title: 'Stronger offers', text: 'Sellers take pre-approved buyers more seriously in competitive markets.' },
  ];

  const howItWorks = [
    { n: '01', title: 'Submit the form', text: 'Share a few basics — the whole form takes under a minute.' },
    { n: '02', title: 'Get matched', text: 'We introduce you to a trusted mortgage partner who fits your scenario.' },
    { n: '03', title: 'Receive your letter', text: 'Get your pre-approval letter and shop with confidence.' },
  ];

  const faqs = [
    { q: 'Does getting pre-approved hurt my credit score?', a: 'No. Our partner lenders use a soft credit pull during pre-approval, which has no effect on your credit score. A hard inquiry only happens later if you formally apply for a loan with a specific lender.' },
    { q: 'How long is a pre-approval letter valid?', a: 'Most pre-approval letters are valid for 60 to 90 days. If you haven\'t found a home in that window, the lender can easily refresh it.' },
    { q: 'Is pre-approval the same as pre-qualification?', a: 'No. Pre-qualification is a quick informal estimate. Pre-approval is a documented commitment after the lender verifies your credit and financials. Sellers strongly prefer pre-approval.' },
    { q: 'What documents will I need later?', a: 'Typically the lender will request recent pay stubs, W-2s or tax returns, bank statements, and ID. Your banker walks you through exactly what to send.' },
    { q: 'What if I have less-than-perfect credit?', a: 'Many lenders offer FHA, VA, USDA, and other programs designed for buyers with lower credit scores or limited down payments. Submit the form and a banker will explain your options.' },
    { q: 'Does this cost anything?', a: 'No. Getting pre-approved through SaveOnYourHome is completely free. You\'re under no obligation to use the lender who pre-approves you.' },
  ];

  const inputCls = 'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 transition-colors';

  return (
    <>
      <SEOHead
        title="Get Pre-Approved"
        description="Get pre-approved for your mortgage in minutes. Free, no credit-score impact, matched with licensed mortgage bankers. Make stronger offers on your next home."
        keywords="mortgage pre-approval, home loan, pre-approval letter, mortgage lender, home financing"
      />

      {/* Hero — form in right column */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1816] to-[#2d2a26]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(51,85,255,0.4) 0%, transparent 50%)' }} />
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-14 md:py-20 relative" style={{ maxWidth: 1400 }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">
            {/* Left: pitch */}
            <div className="lg:col-span-3">
              <HeroBadge className="mb-5">Mortgage Pre-Approval</HeroBadge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05]">
                Get pre-approved.<br />
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Shop with confidence.</span>
              </h1>
              <p className="mt-5 text-lg text-white/80 max-w-xl leading-relaxed">
                A pre-approval letter turns you into a serious buyer. We'll match you with a licensed mortgage partner — free, no hit to your credit, under a minute to start.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 max-w-lg">
                {benefits.slice(0, 4).map((b) => (
                  <div key={b.title} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/15 shrink-0">
                      <b.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{b.title}</div>
                      <div className="text-white/60 text-xs">{b.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: simplified form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-6 md:p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-[#1a1816] mb-1">Start your pre-approval</h2>
                <p className="text-sm text-gray-500 mb-6">Free. Takes under a minute.</p>

                {(submitted || flash?.success) && (
                  <div className="mb-5 rounded-xl p-3 bg-green-50 border border-green-200 text-sm text-green-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Request sent. A licensed banker will reach out shortly.
                  </div>
                )}

                <form onSubmit={submit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="First name" className={inputCls} value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                    <input required placeholder="Last name" className={inputCls} value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                  </div>
                  <input required type="email" placeholder="Email" className={inputCls} value={data.email} onChange={(e) => setData('email', e.target.value)} />
                  {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                  <input required type="tel" placeholder="Phone" className={inputCls} value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Est. home price ($)" className={inputCls} value={data.purchase_price} onChange={(e) => setData('purchase_price', e.target.value)} />
                    <input placeholder="ZIP code" className={inputCls} value={data.zip} onChange={(e) => setData('zip', e.target.value)} />
                  </div>
                  <select className={inputCls} value={data.timeframe} onChange={(e) => setData('timeframe', e.target.value)}>
                    <option value="">When are you looking to buy?</option>
                    <option>Right now</option>
                    <option>In 1–3 months</option>
                    <option>In 3–6 months</option>
                    <option>6+ months out</option>
                  </select>
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#3355FF] text-white py-3.5 text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {processing ? 'Submitting…' : 'Get my pre-approval'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                    By submitting, you agree to be contacted by a licensed mortgage partner. We never share your info publicly.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">How it works</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816]">Three simple steps to your letter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((s) => (
              <div key={s.n} className="rounded-2xl border border-gray-200 p-8">
                <div className="text-[#3355FF] text-3xl font-extrabold mb-3">{s.n}</div>
                <h3 className="text-lg font-bold text-[#1a1816] mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-6">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: '24–48 hrs', label: 'Typical turnaround' },
              { stat: '$0', label: 'Cost to you' },
              { stat: 'Soft pull', label: 'No credit-score impact' },
              { stat: 'Licensed', label: 'Mortgage bankers only' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-extrabold text-[#1a1816]">{s.stat}</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1180 }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-500">Pre-Approval FAQs</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1816] mb-4">Questions, answered</h2>
              <p className="text-gray-600 mb-6">
                Everything buyers typically ask before getting pre-approved.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#3355FF] text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90">
                Still have questions? <ArrowRight className="w-4 h-4" />
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
    </>
  );
}

GetPreApproved.layout = (page) => <MainLayout>{page}</MainLayout>;
export default GetPreApproved;

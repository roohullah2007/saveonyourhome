import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import HeroBadge from '@/Components/HeroBadge';
import MainLayout from '@/Layouts/MainLayout';

function Mortgages() {
  const [openFaq, setOpenFaq] = useState(null);

  const howItWorks = [
    { num: '01', title: 'Find Your Rate', desc: 'Instantly find the most competitive deal from over 25 lenders. Compare rates, terms, and costs side by side.' },
    { num: '02', title: 'Get Pre-Approved', desc: 'Complete a simple online application to receive a fast pre-approval. Show sellers you\'re a serious, qualified buyer.' },
    { num: '03', title: 'Close With Ease', desc: 'Enjoy a streamlined closing process with digital tools and expert support every step of the way.' },
  ];

  const mortgageTypes = [
    { title: 'CONVENTIONAL LOANS', desc: 'Traditional mortgages not backed by the government. Typically require 3-20% down payment and good credit scores.', features: ['Competitive interest rates', 'Flexible terms (15-30 years)', 'PMI removed at 20% equity'], icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>) },
    { title: 'FHA LOANS', desc: 'Government-backed loans ideal for first-time buyers. Lower down payment and credit requirements.', features: ['3.5% minimum down payment', 'Credit scores as low as 580', 'Lower closing costs'], icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>) },
    { title: 'VA LOANS', desc: 'Exclusive benefits for veterans and active military. Often the best mortgage option available.', features: ['No down payment required', 'No PMI requirement', 'Competitive rates'], icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>) },
    { title: 'USDA LOANS', desc: 'Zero down payment loans for rural property buyers. Income limits apply.', features: ['No down payment', 'Low mortgage insurance', 'Below-market rates'], icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>) },
  ];

  const tips = [
    { title: 'IMPROVE YOUR CREDIT', desc: 'Pay down debts, avoid new credit inquiries, and dispute errors on your credit report before applying.' },
    { title: 'SAVE FOR DOWN PAYMENT', desc: 'Aim for 20% to avoid PMI, but many programs allow as little as 3% down. Don\'t forget closing costs (2-5%).' },
    { title: 'CALCULATE YOUR BUDGET', desc: 'Monthly housing payment (including taxes and insurance) shouldn\'t exceed 28% of your gross monthly income.' },
    { title: 'GATHER DOCUMENTS', desc: 'Prepare pay stubs, W-2s, tax returns, bank statements, and ID. Self-employed need 2 years of tax returns.' },
    { title: 'LOCK YOUR RATE', desc: 'Once you find your rate, lock it in. Rate locks typically last 30-60 days and protect from market fluctuations.' },
    { title: 'ASK ABOUT ASSISTANCE', desc: 'Many states offer down payment assistance programs. Ask your lender about first-time buyer programs and grants available in your area.' },
  ];

  const faqs = [
    { q: 'What credit score do I need for a mortgage?', a: 'For conventional loans, most lenders require a minimum score of 620. FHA loans may accept scores as low as 580 with 3.5% down. Higher scores get better interest rates.' },
    { q: 'How much down payment do I need?', a: 'It depends on the loan type. Conventional: 3-20%, FHA: 3.5%, VA and USDA: 0% down. Putting 20% down avoids private mortgage insurance (PMI).' },
    { q: 'What\'s the difference between pre-qualification and pre-approval?', a: 'Pre-qualification is an estimate based on self-reported info. Pre-approval involves a credit check and document verification, making it more attractive to sellers.' },
    { q: 'How long does it take to get a mortgage?', a: 'From application to closing typically takes 30-45 days. Pre-approval can be completed in 1-3 days. Having all documents ready speeds up the process.' },
    { q: 'Should I get a fixed or adjustable rate?', a: 'Fixed rates stay the same for the loan term, providing stability. ARMs start lower but can adjust. Fixed is usually better if you plan to stay long-term.' },
  ];

  return (
    <>
      <SEOHead
        title="Mortgages"
        description="Compare mortgage rates from top lenders. Find the best home loan rates, calculate monthly payments, and get pre-approved. SaveOnYourHome mortgage center."
        keywords="mortgage rates, home loan, compare mortgages, mortgage calculator, home financing, best mortgage rates"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[420px] md:h-[500px] lg:h-[600px]">
        <img src="https://images.pexels.com/photos/7578939/pexels-photo-7578939.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Mortgage & financing" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <HeroBadge>MORTGAGE &amp; FINANCING</HeroBadge>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Find the Best <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mortgage Rate</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                Compare rates from over 25 lenders, get pre-approved fast, and close with confidence. Your home financing journey starts here.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}>Get Pre-Approved <ArrowRight className="w-5 h-5" /></Link>
                <Link href="/properties" className="inline-flex items-center justify-center gap-2 rounded-full transition-colors" style={{ height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.25)', color: 'white', background: 'rgba(255,255,255,0.08)' }}>Browse Properties</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>HOW IT WORKS</span></div>
          <h2 className="mb-14 text-center text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>Simple Steps to Your Mortgage</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {howItWorks.map((s, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 p-8 group relative" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                <div className="mb-4 flex items-center justify-center rounded-xl" style={{ width: '44px', height: '48px', backgroundColor: '#3355FF' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{s.num}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'rgb(26,24,22)', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100,100,100)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mortgage Types */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>LOAN OPTIONS</span></div>
          <h2 className="mb-5 text-center text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>Find the Right Loan for You</h2>
          <p className="text-center mb-14" style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)', maxWidth: '560px', margin: '0 auto 56px' }}>
            Different loans for different needs. Compare your options and find the best fit for your situation.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mortgageTypes.map((m, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 p-6 group relative" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                <div className="mb-4 flex items-center justify-center rounded-2xl" style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245,245,244)' }}>{m.icon}</div>
                <h3 className="mb-2" style={{ fontWeight: 700, fontSize: '14px', color: 'rgb(26,24,22)', letterSpacing: '0.5px' }}>{m.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: '22px', color: 'rgb(100,100,100)', marginBottom: '16px' }}>{m.desc}</p>
                <div className="space-y-2">
                  {m.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(26,24,22)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span style={{ fontSize: '13px', color: 'rgb(75,75,75)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>MORTGAGE TIPS</span></div>
          <h2 className="mb-14 text-center text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>Prepare for Your Mortgage</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tips.map((t, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-lg p-6 flex items-start gap-4" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: '44px', height: '48px', backgroundColor: '#3355FF' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'rgb(26,24,22)', letterSpacing: '0.3px', marginBottom: '6px' }}>{t.title}</h3>
                  <p style={{ fontSize: '14px', lineHeight: '22px', color: 'rgb(100,100,100)' }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Approval CTA */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-4"><span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>GET STARTED TODAY</span></div>
            <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] mb-5" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
              Ready to Get Pre-Approved?
            </h2>
            <p style={{ fontSize: '17px', lineHeight: '28px', color: 'rgb(100,100,100)', marginBottom: '32px' }}>
              Strengthen your offer with a pre-approval letter. We'll connect you with a trusted lender who provides priority service and free pre-approval.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90" style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}>
                Request Pre-Approval <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/buyers" className="inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 hover:bg-gray-50" style={{ height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600, border: '1px solid rgb(229,231,235)', color: 'rgb(26,24,22)', backgroundColor: 'white' }}>
                Buyers Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>MORTGAGE FAQS</span></div>
          <h2 className="mb-14 text-center text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 overflow-hidden" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span style={{ fontSize: '17px', fontWeight: 600, color: 'rgb(26,24,22)' }}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-5"><p style={{ fontSize: '15px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

Mortgages.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Mortgages;

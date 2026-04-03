import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function About() {
  const [openFaq, setOpenFaq] = useState(null);

  const missions = [
    { title: 'EMPOWERING FSBO SELLERS', desc: 'We provide the most comprehensive suite of FREE services to FSBO sellers, including robust listings, guidance on pricing, enhanced communication, marketing tools, and more.', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>) },
    { title: 'ENHANCING THE BUYER EXPERIENCE', desc: 'Buyers can engage with our site 24/7, making it convenient to get detailed information about homes, schedule appointments, and search for properties that match their needs.', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>) },
    { title: 'REVOLUTIONIZING REAL ESTATE', desc: 'Unlike other platforms, we don\'t charge commissions or fees. We\'re committed to providing free and comprehensive services to FSBO homeowners who list their homes on our site.', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>) },
    { title: 'SUPPORTING LOCAL VENDORS', desc: 'We introduce buyers and sellers to local vendors, creating a seamless experience for everyone involved in the real estate transaction.', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>) },
    { title: 'GIVING BACK', desc: 'SaveOnYourHome.com is not just about real estate; we\'re socially conscious and dedicated to giving back to the communities that we serve.', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>) },
  ];

  const faqs = [
    { q: 'Is SaveOnYourHome.com free?', a: 'Yes! Listing your home on SaveOnYourHome.com is completely free. No commissions, no hidden fees. We offer optional premium services like MLS listing and professional photography.' },
    { q: 'How long does the sales process take?', a: 'The timeline varies based on your market, pricing, and property condition. On average, FSBO homes sell within 2-4 months. Our tools and guidance help you sell faster.' },
    { q: 'What is the best pricing strategy for my property?', a: 'Use our AI pricing tool, consult with a local appraiser, and research comparable sales in your area. Setting the right price from the start attracts more serious buyers.' },
    { q: 'How can I create a compelling property listing?', a: 'Include high-quality photos, detailed descriptions, highlight unique features, and add virtual tours. Our platform guides you through creating a listing in under 5 minutes.' },
    { q: 'What documents do I need to sell my property?', a: 'You\'ll need a property deed, disclosure forms, purchase agreement, and any inspection reports. We recommend consulting a real estate attorney for your specific state requirements.' },
    { q: 'What must I disclose to potential buyers about my property?', a: 'Disclosure requirements vary by state but typically include known defects, lead paint (for pre-1978 homes), flood zone status, and any material facts that could affect the property\'s value.' },
  ];

  return (
    <>
      <Head title="About - SaveOnYourHome" />

      {/* Hero */}
      <section className="relative w-full overflow-hidden" style={{ height: '500px' }}>
        <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="About SaveOnYourHome" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>ABOUT US</span>
              </div>
              <h1 className="text-[26px] leading-[34px] sm:text-[36px] sm:leading-[44px] lg:text-[46px] lg:leading-[56px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Why Does <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SaveOnYourHome</span> Exist?
              </h1>
              <p className="mt-5" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgba(255,255,255,0.75)', maxWidth: '500px' }}>
                Eliminating commission is the easiest way to maximize sales proceeds for sellers without increasing cost for buyers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section — Image + Text */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-20" style={{ maxWidth: '1400px' }}>
          <div className="rounded-2xl border border-gray-200/60 overflow-hidden" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative overflow-hidden group">
                <img src="/images/home-img.webp" alt="Our team" className="w-full h-[300px] sm:h-[360px] lg:h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                  {[{ val: '$27K+', lbl: 'Avg. Savings' }, { val: '0%', lbl: 'Commission' }, { val: 'FREE', lbl: 'Listing' }].map((s, i) => (
                    <div key={i} className="flex-1 rounded-xl px-3 py-3 text-center" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{s.val}</div>
                      <div style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.5px' }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 sm:p-10 md:p-14 flex flex-col justify-center">
                <div className="mb-4"><span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>OUR STORY</span></div>
                <h2 className="text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px] mb-4" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
                  Built by People Who Care
                </h2>
                <p style={{ fontSize: '15px', lineHeight: '26px', color: 'rgb(100,100,100)', marginBottom: '16px' }}>
                  SaveOnYourHome was created to simplify the sale of private residential properties. Our team is made up of experienced professionals who share a passion for <strong style={{ color: 'rgb(55,55,55)' }}>technology and real estate</strong>.
                </p>
                <p style={{ fontSize: '15px', lineHeight: '26px', color: 'rgb(100,100,100)', marginBottom: '16px' }}>
                  We work hard to empower owners to easily and safely sell their properties themselves to save on commission. This means that owners can increase their profits while buyers can simultaneously reduce their costs and afford more property.
                </p>
                <p style={{ fontSize: '15px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>
                  Join us in revolutionizing the way homes are bought and sold. Whether you are selling by owner or a buyer seeking a seamless experience, SaveOnYourHome.com is here to help make it happen!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission — 5 Cards */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>OUR MISSION</span></div>
          <h2 className="mb-5 text-center text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
            Transforming Real Estate for Everyone
          </h2>
          <p className="text-center mb-14" style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100,100,100)', maxWidth: '600px', margin: '0 auto 56px' }}>
            We're on a mission to make real estate more accessible, transparent, and cost-effective for everyone involved.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {missions.map((m, i) => (
              <div key={i} className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 relative flex flex-col items-center p-6 text-center group" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ height: '2px', background: 'rgb(26,24,22)' }} />
                <div className="mb-4 flex items-center justify-center rounded-2xl" style={{ width: '56px', height: '56px', backgroundColor: 'rgb(245,245,244)' }}>{m.icon}</div>
                <h3 className="mb-2" style={{ fontWeight: 700, fontSize: '12px', color: 'rgb(26,24,22)', letterSpacing: '0.5px' }}>{m.title}</h3>
                <p style={{ fontSize: '13px', lineHeight: '20px', color: 'rgb(100,100,100)' }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>FREQUENTLY ASKED QUESTIONS</span></div>
          <h2 className="mb-14 text-center text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
            Frequently Asked Questions
          </h2>
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
            <Link href="/faqs" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}>
              Read All FAQs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Cards */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-20" style={{ maxWidth: '1400px' }}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { title: 'LIST YOUR HOME', desc: 'Expose your property to buyers. Get offers to your inbox and start saving commissions with SaveOnYourHome.', link: '/list-property', linkText: 'List Your Home', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>) },
              { title: 'SEARCH PROPERTIES', desc: 'Browse through SaveOnYourHome to find your dream home!', link: '/properties', linkText: 'Search Now', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>) },
              { title: 'CONTACT US', desc: 'Have questions? Our team is always ready to assist you on your real estate journey.', link: '/contact', linkText: 'Get in Touch', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>) },
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

About.layout = (page) => <MainLayout>{page}</MainLayout>;

export default About;

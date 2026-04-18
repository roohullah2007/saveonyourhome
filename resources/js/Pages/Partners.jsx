import React from 'react';
import { Link } from '@inertiajs/react';
import { Phone, Mail, Globe, MapPin, ArrowRight } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import HeroBadge from '@/Components/HeroBadge';
import MainLayout from '@/Layouts/MainLayout';

function Partners({ partnersByCategory = {}, categories = [] }) {
  const formatWebsite = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };
  const displayWebsite = (url) => {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  };

  const logoSrc = (p) => {
    if (!p.logo) return null;
    return p.logo.startsWith('http') ? p.logo : `/storage/${p.logo}`;
  };

  return (
    <>
      <SEOHead
        title="Partners"
        description="Trusted vendor partners for your FSBO real estate journey. Find accountants, attorneys, contractors, mortgage, photography, and more."
        keywords="FSBO partners, trusted vendors, real estate vendors, home selling services"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px] dark-selection">
        <img
          src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Partners"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[640px]">
              <HeroBadge>PARTNERS</HeroBadge>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white">
                Trusted Vendor <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Partners</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '560px' }}>
                Your trusted resource for For Sale By Owner real estate solutions. We work with vendors who have pledged to uphold our Honor Pledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Note */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-10 md:py-12" style={{ maxWidth: '1400px' }}>
          <div className="rounded-2xl border border-gray-200/60 p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px' }}>
            <p style={{ fontSize: '17px', lineHeight: '28px', color: 'rgb(75,75,75)', textAlign: 'center' }}>
              Please note that as we are just getting started, we don't have vendors for every category yet. If you have a suggestion or would like to recommend a vendor,{' '}
              <Link href="/contact" className="underline font-semibold" style={{ color: '#3355FF' }}>please click here</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Directory — individual cards, each links to a detail page */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] pb-12 md:pb-20" style={{ maxWidth: '1400px' }}>
          {categories.map((category) => {
            const partners = partnersByCategory[category] || [];
            if (partners.length === 0) return null;
            return (
              <div key={category} className="mb-12">
                <h2 className="mb-6" style={{ fontSize: '22px', fontWeight: 700, color: 'rgb(26,24,22)' }}>
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {partners.map((p) => {
                    const logo = logoSrc(p);
                    return (
                      <Link
                        key={p.id}
                        href={`/partners/${p.slug || p.id}`}
                        className="group rounded-2xl border border-gray-200/70 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                            {logo ? (
                              <img src={logo} alt={p.name} className="h-full w-full object-contain" />
                            ) : (
                              <span style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(100,100,100)' }}>
                                {(p.name || '?').charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate" style={{ fontSize: '17px', fontWeight: 700, color: 'rgb(26,24,22)' }}>{p.name}</div>
                            <div className="truncate" style={{ fontSize: '12px', color: 'rgb(100,100,100)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{p.category}</div>
                          </div>
                        </div>
                        {p.description && (
                          <p className="line-clamp-3 mb-4" style={{ fontSize: '14px', lineHeight: '22px', color: 'rgb(100,100,100)' }}>
                            {p.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'rgb(100,100,100)' }}>
                          {p.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {p.phone}</span>}
                          {p.email && <span className="inline-flex items-center gap-1 truncate max-w-[180px]"><Mail className="w-3.5 h-3.5" /> {p.email}</span>}
                          {p.website && <span className="inline-flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Website</span>}
                          {p.address && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {p.address}</span>}
                        </div>
                        <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all" style={{ color: '#3355FF' }}>
                          View profile <ArrowRight className="w-4 h-4" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {Object.keys(partnersByCategory).length === 0 && (
            <div className="rounded-2xl border border-gray-200/60 bg-white p-8 text-center">
              <p style={{ fontSize: '17px', color: 'rgb(100,100,100)' }}>
                No partners listed yet. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Become A Partner CTA */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="rounded-3xl p-10 md:p-14 text-center" style={{ background: 'linear-gradient(135deg, #1A1816 0%, #2d2a26 100%)' }}>
            <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgba(255,255,255,0.6)' }}>BECOME A PARTNER</span>
            <h2
              className="mt-3 mb-5 text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] text-white"
              style={{ fontWeight: 700 }}
            >
              Grow your business with SaveOnYourHome
            </h2>
            <p className="mx-auto" style={{ maxWidth: 640, fontSize: '17px', lineHeight: '28px', color: 'rgba(255,255,255,0.75)' }}>
              Get in front of motivated FSBO sellers and buyers. Add your business, services, logo, and contact details — we review every application within 2 business days.
            </p>
            <Link
              href="/become-a-partner"
              className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#3355FF', color: 'white' }}
            >
              Apply to become a partner <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

Partners.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Partners;

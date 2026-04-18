import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
  Phone, Mail, Globe, MapPin, ArrowRight, CheckCircle2, User,
  Shield, Clock, Award, Sparkles,
} from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import HeroBadge from '@/Components/HeroBadge';
import MainLayout from '@/Layouts/MainLayout';

function PartnerDetail({ partner, related = [] }) {
  const { flash } = usePage().props;
  const [sent, setSent] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    partner_id: partner.id,
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post('/partner-inquiry', {
      onSuccess: () => {
        reset('name', 'email', 'phone', 'message');
        setSent(true);
        setTimeout(() => setSent(false), 5000);
      },
    });
  };

  const logo = partner.logo
    ? (partner.logo.startsWith('http') ? partner.logo : `/storage/${partner.logo}`)
    : null;

  const website = partner.website
    ? (partner.website.startsWith('http') ? partner.website : `https://${partner.website}`)
    : null;

  const services = Array.isArray(partner.services) ? partner.services : [];
  const canInquire = Boolean(partner.email);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: partner.name,
    description: partner.description,
    image: logo ? (logo.startsWith('http') ? logo : `${origin}${logo}`) : undefined,
    telephone: partner.phone || undefined,
    email: partner.email || undefined,
    url: website || undefined,
    address: partner.address ? { '@type': 'PostalAddress', streetAddress: partner.address } : undefined,
  };

  const inputCls = 'w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-500';

  const trustBadges = [
    { icon: Shield, label: 'Honor Pledge Partner' },
    { icon: Award, label: `${partner.category}` },
    { icon: Sparkles, label: 'Vetted by SaveOnYourHome' },
  ];

  return (
    <>
      <SEOHead
        title={partner.name}
        description={partner.description || `${partner.name} — ${partner.category} on SaveOnYourHome.`}
        image={logo || undefined}
        type="article"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1816] to-[#2d2a26]">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] pt-10 pb-14" style={{ maxWidth: 1400 }}>
          <nav className="flex items-center text-sm text-white/60 gap-2 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/partners" className="hover:text-white">Partners</Link>
            <span>/</span>
            <span className="text-white">{partner.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
              {logo ? (
                <img src={logo} alt={partner.name} className="h-full w-full object-contain p-2" />
              ) : (
                <span style={{ fontSize: '48px', fontWeight: 800, color: '#1a1816' }}>
                  {(partner.name || '?').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <HeroBadge className="mb-4">{partner.category}</HeroBadge>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">{partner.name}</h1>
              {partner.contact_name && (
                <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
                  <User className="w-4 h-4" /> Contact: {partner.contact_name}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {partner.phone && (
                  <a href={`tel:${partner.phone}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors">
                    <Phone className="w-4 h-4" /> {partner.phone}
                  </a>
                )}
                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white text-[#1a1816] px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity">
                    <Globe className="w-4 h-4" /> Visit website
                  </a>
                )}
                {partner.email && (
                  <a href={`mailto:${partner.email}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors">
                    <Mail className="w-4 h-4" /> Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-6" style={{ maxWidth: 1400 }}>
          <div className="flex flex-wrap items-center justify-center gap-8 gap-y-3">
            {trustBadges.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <t.icon className="w-4 h-4" style={{ color: '#3355FF' }} />
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About + Form */}
      <section className="bg-gray-50 py-14">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1400 }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: description + services + contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl bg-white border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-[#1a1816] mb-5">About {partner.name}</h2>
                {partner.description ? (
                  <div className="text-[16px] leading-[28px] text-gray-700 whitespace-pre-line">
                    {partner.description}
                  </div>
                ) : (
                  <p className="text-[15px] text-gray-500 italic">
                    No description provided by this partner yet. Reach out directly using the details below.
                  </p>
                )}
              </div>

              {services.length > 0 && (
                <div className="rounded-2xl bg-white border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-[#1a1816] mb-5">Services offered</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#3355FF' }} />
                        <span className="text-sm text-gray-700 font-medium">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl bg-white border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-[#1a1816] mb-5">Contact details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {partner.phone && (
                    <a href={`tel:${partner.phone}`} className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                        <Phone className="w-4 h-4" style={{ color: '#3355FF' }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs uppercase tracking-wider text-gray-500">Phone</div>
                        <div className="text-sm font-semibold text-[#1a1816] truncate">{partner.phone}</div>
                      </div>
                    </a>
                  )}
                  {partner.email && (
                    <a href={`mailto:${partner.email}`} className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                        <Mail className="w-4 h-4" style={{ color: '#3355FF' }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs uppercase tracking-wider text-gray-500">Email</div>
                        <div className="text-sm font-semibold text-[#1a1816] truncate">{partner.email}</div>
                      </div>
                    </a>
                  )}
                  {website && (
                    <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                        <Globe className="w-4 h-4" style={{ color: '#3355FF' }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs uppercase tracking-wider text-gray-500">Website</div>
                        <div className="text-sm font-semibold text-[#1a1816] truncate">{website.replace(/^https?:\/\//, '')}</div>
                      </div>
                    </a>
                  )}
                  {partner.address && (
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                        <MapPin className="w-4 h-4" style={{ color: '#3355FF' }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs uppercase tracking-wider text-gray-500">Address</div>
                        <div className="text-sm font-semibold text-[#1a1816]">{partner.address}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#3355FF' }} />
                  <div>
                    <div className="font-bold text-[#1a1816] mb-1">Honor Pledge Commitment</div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      This partner has pledged to uphold SaveOnYourHome's consumer-first principles: transparent pricing, honest communication, and no high-pressure tactics.
                    </p>
                    <Link href="/honor-pledge" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: '#3355FF' }}>
                      Learn about the pledge <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: contact form (only if partner has email) */}
            <div className="lg:col-span-1">
              {canInquire ? (
                <div className="rounded-2xl bg-white border border-gray-200 p-6 lg:sticky lg:top-6">
                  <h3 className="text-xl font-bold text-[#1a1816] mb-1">Contact {partner.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">Your message will be emailed directly to the partner.</p>

                  {(sent || flash?.success) && (
                    <div className="mb-4 rounded-xl p-3 bg-green-50 border border-green-200 text-sm text-green-800">
                      Message sent successfully.
                    </div>
                  )}

                  <form onSubmit={submit} className="space-y-3">
                    <input type="text" required placeholder="Your name" className={inputCls} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                    <input type="email" required placeholder="Email" className={inputCls} value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                    <input type="tel" placeholder="Phone (optional)" className={inputCls} value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                    <textarea required rows={5} placeholder={`Tell ${partner.name} how they can help…`} className={inputCls + ' resize-vertical'} value={data.message} onChange={(e) => setData('message', e.target.value)} />
                    {errors.message && <p className="text-xs text-red-600">{errors.message}</p>}
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: '#3355FF' }}
                    >
                      {processing ? 'Sending…' : 'Send message'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[11px] text-gray-500 text-center mt-2">
                      By sending, you agree to be contacted by this partner.
                    </p>
                  </form>
                </div>
              ) : (
                <div className="rounded-2xl bg-white border border-gray-200 p-6 lg:sticky lg:top-6">
                  <h3 className="text-lg font-bold text-[#1a1816] mb-2">Contact this partner</h3>
                  <p className="text-sm text-gray-600">
                    This partner hasn't published an email address. Please use the phone number or website above to get in touch.
                  </p>
                  {partner.phone && (
                    <a href={`tel:${partner.phone}`} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white" style={{ backgroundColor: '#3355FF' }}>
                      <Phone className="w-4 h-4" /> Call {partner.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Related Partners */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-[#1a1816] mb-6">More in {partner.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.map((p) => (
                  <Link key={p.id} href={`/partners/${p.slug}`} className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="font-bold text-[#1a1816] mb-1">{p.name}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">{p.category}</div>
                    {p.description && <p className="mt-3 text-sm text-gray-600 line-clamp-3">{p.description}</p>}
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: '#3355FF' }}>
                      View profile <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

PartnerDetail.layout = (page) => <MainLayout>{page}</MainLayout>;
export default PartnerDetail;

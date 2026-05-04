import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
  MapPin, BedDouble, Bath, Maximize2, Calendar, Home, Heart, Share2,
  Phone, Mail, CheckCircle2, ChevronLeft, ChevronRight,
  Printer, Video, X, Images, Car, User, MapPinned, Check,
  CalendarClock,
} from 'lucide-react';
import axios from 'axios';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';
import ScheduleShowingModal from '@/Components/ScheduleShowingModal';
import AuthModal from '@/Components/AuthModal';
import NearbySection from '@/Components/Properties/NearbySection';
import NearbySchools from '@/Components/Properties/NearbySchools';
import { resolvePhotoUrl } from '@/utils/photoUrl';
import WalkscoreSection from '@/Components/Properties/WalkscoreSection';
import { AMENITY_GROUPS, groupItems } from '@/constants/amenities';

const propertyTypeLabels = {
  'single-family-home': 'Single Family Home',
  'single_family': 'Single Family Home',
  'condos-townhomes-co-ops': 'Town House',
  'condo': 'Condo',
  'townhouse': 'Town House',
  'multi-family': 'Multi-Family',
  'multi_family': 'Multi-Family',
  'land': 'Lot/Land',
  'farms-ranches': 'Farms / Ranches',
  'mfd-mobile-homes': 'Manufactured / Mobile Home',
  'mobile_home': 'Mobile Home',
  'commercial': 'Commercial',
};

const formatCurrency = (value, digits = 0) => {
  const n = Number(value || 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
};

const formatPriceShort = (value) => {
  const n = Number(value || 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
};

/* ---------- Mortgage donut chart ---------- */
function MortgageDonut({ principalInterest, propertyTax, insurance, hoa, pmi = 0 }) {
  const parts = [
    { label: 'P&I', value: principalInterest, color: '#F75D7E' },
    { label: 'Tax', value: propertyTax, color: '#4A90E2' },
    { label: 'Insurance', value: insurance, color: '#F4C24B' },
    { label: 'HOA', value: hoa, color: '#BFD733' },
  ];
  if (pmi > 0) parts.push({ label: 'PMI', value: pmi, color: '#9B7EDE' });

  const total = parts.reduce((s, p) => s + (Number(p.value) || 0), 0) || 1;
  const radius = 90;
  const stroke = 22;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-[240px]">
      <g transform="translate(110,110) rotate(-90)">
        {parts.map((p, i) => {
          const share = (Number(p.value) || 0) / total;
          const len = share * circumference;
          const dash = `${Math.max(len - 2, 0)} ${circumference}`;
          const el = (
            <circle
              key={i}
              r={radius}
              cx={0}
              cy={0}
              fill="transparent"
              stroke={p.color}
              strokeWidth={stroke}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </g>
    </svg>
  );
}

/* ---------- Contact / Request Info form used in sidebar + bottom ---------- */
function InquiryForm({ property, variant = 'compact', auth = {} }) {
  const authedUser = auth?.user || null;
  const { data, setData, post, processing, reset } = useForm({
    name: authedUser?.name || '',
    email: authedUser?.email || '',
    phone: authedUser?.phone || '',
    iAm: '',
    message: `Hello, I am interested in [${property.property_title}]`,
    agree: false,
    property_id: property.id,
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.agree) return;
    post(route('inquiry.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setSent(true);
        reset();
        setData('name', authedUser?.name || '');
        setData('email', authedUser?.email || '');
        setData('phone', authedUser?.phone || '');
        setData('message', `Hello, I am interested in [${property.property_title}]`);
        setData('property_id', property.id);
        setTimeout(() => setSent(false), 4000);
      },
    });
  };

  const inputCls =
    'w-full px-4 py-3 border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {sent && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
          Message sent successfully!
        </div>
      )}

      {authedUser && (
        <div className="flex items-center gap-3 p-3 bg-[#F5F7FF] border border-[#E0E7FF] rounded-md">
          <div className="w-9 h-9 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center text-sm font-semibold">
            {(authedUser.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 text-sm">
            <div className="font-semibold text-[#0F172A] truncate">Sending as {authedUser.name}</div>
            <div className="text-[#4B5563] truncate">{authedUser.email}</div>
          </div>
        </div>
      )}

      {variant === 'full' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!authedUser && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#111] mb-2">Name</label>
                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                  placeholder="Enter your name" className={inputCls} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111] mb-2">Email</label>
                <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)}
                  placeholder="Enter your email" className={inputCls} required />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-[#111] mb-2">Phone</label>
            <input type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)}
              placeholder="Enter your Phone" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111] mb-2">I'm a</label>
            <select value={data.iAm} onChange={(e) => setData('iAm', e.target.value)} className={inputCls}>
              <option value="">Select</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="realtor">Realtor</option>
              <option value="investor">Investor</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#111] mb-2">Message</label>
            <textarea value={data.message} onChange={(e) => setData('message', e.target.value)}
              rows={5} className={inputCls + ' resize-none'} />
          </div>
        </div>
      ) : (
        <>
          {!authedUser && (
            <>
              <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                placeholder="Name" className={inputCls} required />
              <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)}
                placeholder="Email" className={inputCls} required />
            </>
          )}
          <input type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)}
            placeholder="Phone" className={inputCls} />
          <textarea value={data.message} onChange={(e) => setData('message', e.target.value)}
            rows={4} className={inputCls + ' resize-none'} />
          <select value={data.iAm} onChange={(e) => setData('iAm', e.target.value)} className={inputCls}>
            <option value="">Select</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="realtor">Realtor</option>
            <option value="investor">Investor</option>
            <option value="other">Other</option>
          </select>
        </>
      )}

      <label className="flex items-start gap-2 text-sm text-[#333]">
        <input type="checkbox" checked={data.agree} onChange={(e) => setData('agree', e.target.checked)}
          className="mt-[3px] w-4 h-4 border-gray-300 rounded" />
        <span>
          By submitting this form I agree to{' '}
          <Link href="/terms-of-use" className="text-[#2563EB] hover:underline">Terms of Use</Link>
        </span>
      </label>

      {variant === 'full' ? (
        <div>
          <button type="submit" disabled={processing || !data.agree}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-md transition-colors">
            {processing ? 'Sending…' : 'Request Information'}
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button type="submit" disabled={processing || !data.agree}
            className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-semibold px-4 py-3 rounded-md transition-colors">
            {processing ? 'Sending…' : 'Send Message'}
          </button>
          {property.contact_phone ? (
            <a href={`tel:${property.contact_phone}`}
              className="flex-1 text-center border border-[#2563EB] text-[#2563EB] font-semibold px-4 py-3 rounded-md hover:bg-[#2563EB]/5 transition-colors">
              Call
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Seller has not provided a phone number"
              aria-disabled="true"
              className="flex-1 text-center border border-gray-200 text-gray-400 font-semibold px-4 py-3 rounded-md cursor-not-allowed bg-gray-50"
            >
              Call
            </button>
          )}
        </div>
      )}
    </form>
  );
}

/* ---------- Main page ---------- */
function PropertyDetail({ property, openHouses = [], similarListings = [], taxonomies = {}, auth = {}, isFavorited = false, mortgageDefaults = {} }) {
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [mainIndex, setMainIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(!!isFavorited);
  const [favoritePending, setFavoritePending] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('register');
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef(null);
  const isOwner = !!(auth?.user && property?.user_id && auth.user.id === property.user_id);

  useEffect(() => {
    const handle = (e) => { if (shareRef.current && !shareRef.current.contains(e.target)) setShowShareDropdown(false); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const photos = property.photos && property.photos.length > 0
    ? property.photos.map((p) => resolvePhotoUrl(p))
    : ['/images/property-placeholder.svg'];

  const openGallery = (idx) => { setGalleryIndex(idx); setShowGalleryModal(true); };
  const galleryPrev = () => setGalleryIndex((p) => (p > 0 ? p - 1 : photos.length - 1));
  const galleryNext = () => setGalleryIndex((p) => (p < photos.length - 1 ? p + 1 : 0));

  useEffect(() => {
    document.body.style.overflow = showGalleryModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showGalleryModal]);

  useEffect(() => {
    if (!showGalleryModal) return;
    const h = (e) => {
      if (e.key === 'Escape') setShowGalleryModal(false);
      if (e.key === 'ArrowLeft') galleryPrev();
      if (e.key === 'ArrowRight') galleryNext();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [showGalleryModal, photos.length]);

  const openAuth = (tab = 'register') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const handleFavorite = async () => {
    if (!auth?.user) {
      openAuth('register');
      return;
    }
    if (favoritePending) return;
    const nextState = !isFavorite;
    setFavoritePending(true);
    // Optimistic update so the heart responds instantly.
    setIsFavorite(nextState);
    try {
      if (nextState) {
        await axios.post(route('dashboard.favorites.add', property.id));
      } else {
        await axios.delete(route('dashboard.favorites.remove', property.id));
      }
    } catch (err) {
      // Roll back if the server rejected the change.
      setIsFavorite(!nextState);
      if (err?.response?.status === 401 || err?.response?.status === 419) {
        openAuth('login');
      }
    } finally {
      setFavoritePending(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => { setCopied(false); setShowShareDropdown(false); }, 2000);
  };

  const handlePrint = () => window.print();

  /* ---------- Mortgage Calculator state (strings for free-form typing) ---------- */
  // Site-wide defaults configured in Admin → Settings → Mortgage; the
  // `mortgageDefaults` shared prop is always present (with fallbacks) so
  // a missing piece is OK.
  const md = mortgageDefaults || {};
  const purchasePriceNum = Math.round(Number(property.price) || 0);
  const propertyTaxRatePct = Number(md.property_tax_rate_pct) || 0;
  const fallbackAnnualTax = Math.round(purchasePriceNum * (propertyTaxRatePct / 100));
  const [mortgage, setMortgage] = useState({
    purchasePrice: String(purchasePriceNum),
    downPaymentPct: String(md.down_payment_pct ?? '20'),
    interestRate: String(md.interest_rate ?? '7.0'),
    loanYears: String(md.loan_term_years ?? '30'),
    annualTax: property.annual_property_tax != null
      ? String(Number(property.annual_property_tax))
      : String(fallbackAnnualTax || 4080),
    annualInsurance: String(md.annual_home_insurance ?? '1000'),
    hoaMonthly: property.hoa_fee != null ? String(Number(property.hoa_fee)) : '0',
    pmi: String(md.pmi_pct ?? '0'),
  });

  const calc = useMemo(() => {
    const num = (v) => {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : 0;
    };
    const purchasePrice = num(mortgage.purchasePrice);
    const downPct = num(mortgage.downPaymentPct);
    const rate = num(mortgage.interestRate);
    const years = num(mortgage.loanYears);
    const annualTax = num(mortgage.annualTax);
    const annualInsurance = num(mortgage.annualInsurance);
    const hoaMonthly = num(mortgage.hoaMonthly);
    const pmiPct = num(mortgage.pmi);

    const principal = purchasePrice * (1 - downPct / 100);
    const r = (rate / 100) / 12;
    const n = years * 12;
    const monthlyPI = r > 0 && n > 0
      ? (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : (n > 0 ? principal / n : 0);
    const monthlyTax = annualTax / 12;
    const monthlyInsurance = annualInsurance / 12;
    const monthlyPmi = (principal * (pmiPct / 100)) / 12;
    const total = monthlyPI + monthlyTax + monthlyInsurance + hoaMonthly + monthlyPmi;
    return {
      downPayment: purchasePrice * (downPct / 100),
      loanAmount: principal,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyPmi,
      hoaMonthly,
      annualInsurance,
      total,
    };
  }, [mortgage]);

  const setM = (key, value) => setMortgage((m) => ({ ...m, [key]: value }));

  /* ---------- Features grouped ---------- */
  const groupedFeatures = useMemo(() => {
    if (!property.features || property.features.length === 0) return [];
    const selected = new Set(property.features);
    const groups = (Array.isArray(taxonomies?.amenity_groups) && taxonomies.amenity_groups.length ? taxonomies.amenity_groups : AMENITY_GROUPS)
      .map((g) => {
        if (g.subgroups) {
          const subs = g.subgroups
            .map((sg) => ({ label: sg.label, items: sg.items.filter((i) => selected.has(i)) }))
            .filter((sg) => sg.items.length > 0);
          if (subs.length === 0) return null;
          return { category: g.category, subgroups: subs };
        }
        const items = g.items.filter((i) => selected.has(i));
        if (items.length === 0) return null;
        return { category: g.category, items };
      })
      .filter(Boolean);
    const categorized = new Set(groups.flatMap((g) => (g.items || g.subgroups.flatMap((sg) => sg.items))));
    const uncategorized = property.features.filter((f) => !categorized.has(f));
    if (uncategorized.length) groups.push({ category: 'Other', items: uncategorized });
    return groups;
  }, [property.features]);

  /* ---------- Address / date ---------- */
  const updatedDate = useMemo(() => {
    if (!property.updated_at) return '';
    const d = new Date(property.updated_at);
    const date = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    let hour = d.getHours();
    const minute = String(d.getMinutes()).padStart(2, '0');
    const ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12 || 12;
    return `Updated on ${date} at ${hour}:${minute} ${ampm}`;
  }, [property.updated_at]);

  const fullAddress = `${property.address || ''}, ${property.city || ''}, ${property.state || ''} ${property.zip_code || ''}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const breadcrumbType = propertyTypeLabels[property.property_type] || property.property_type;

  const propertyId = `SYH-${String(property.id).padStart(5, '0')}`;
  const listingStatusLabel = (() => {
    const ls = property.listing_status || property.status;
    if (ls === 'sold') return 'Sold';
    if (ls === 'pending') return 'Pending';
    if (ls === 'inactive') return 'Inactive';
    if (ls === 'for_rent' || property.transaction_type === 'for_rent') return 'For Rent';
    return 'For Sale By Owner';
  })();

  const listingImage = property.photos?.[0] ? resolvePhotoUrl(property.photos[0]) : undefined;
  const listingDescription = `${property.property_title} - ${property.bedrooms || 0} bed, ${property.full_bathrooms || property.bathrooms || 0} bath${property.sqft ? `, ${Number(property.sqft).toLocaleString()} sqft` : ''} home for sale by owner in ${property.city}, ${property.state}. Listed at ${formatPriceShort(property.price)}.`;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const listingUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : undefined;
  const listingJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Product', 'RealEstateListing'],
        name: property.property_title,
        description: listingDescription,
        image: listingImage ? [`${origin}${listingImage}`] : undefined,
        url: listingUrl,
        address: {
          '@type': 'PostalAddress',
          streetAddress: property.street_address || property.address || undefined,
          addressLocality: property.city,
          addressRegion: property.state,
          postalCode: property.zip_code || property.zip || undefined,
          addressCountry: 'US',
        },
        numberOfRooms: property.bedrooms || undefined,
        numberOfBathroomsTotal: property.full_bathrooms || property.bathrooms || undefined,
        floorSize: property.sqft ? { '@type': 'QuantitativeValue', value: property.sqft, unitCode: 'FTK' } : undefined,
        offers: {
          '@type': 'Offer',
          price: property.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: listingUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Properties', item: `${origin}/properties` },
          { '@type': 'ListItem', position: 3, name: property.property_title, item: listingUrl },
        ],
      },
    ],
  };

  return (
    <>
      <SEOHead
        title={property.property_title}
        description={listingDescription}
        image={listingImage}
        type="article"
        jsonLd={listingJsonLd}
      />

      <div className="bg-[#F8F8F7]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[40px] pt-6 pb-6">
          {/* Breadcrumbs + icons row */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <nav className="flex flex-wrap items-center text-sm text-[#6B7280] gap-2">
              <Link href="/" className="text-[#2563EB] hover:underline">Home</Link>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              <Link href={`/properties?type=${encodeURIComponent(property.property_type)}`} className="text-[#2563EB] hover:underline">
                {breadcrumbType}
              </Link>
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              <span className="text-[#6B7280] line-clamp-1">{property.property_title}</span>
            </nav>

            <div className="flex items-center gap-2">
              <button onClick={handleFavorite}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow"
                title="Favorite">
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
              </button>

              <div className="relative" ref={shareRef}>
                <button onClick={() => setShowShareDropdown(s => !s)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow"
                  title="Share">
                  <Share2 className="w-4 h-4 text-gray-700" />
                </button>
                {showShareDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-40">
                    <button onClick={copyLink} className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 text-left">
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4 text-gray-500" />}
                      {copied ? 'Copied!' : 'Copy link'}
                    </button>
                    <a target="_blank" rel="noopener noreferrer"
                       href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                       className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 text-left">Facebook</a>
                    <a target="_blank" rel="noopener noreferrer"
                       href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                       className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 text-left">Twitter / X</a>
                    <a target="_blank" rel="noopener noreferrer"
                       href={`https://wa.me/?text=${encodeURIComponent(`${property.property_title} - ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                       className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 text-left">WhatsApp</a>
                  </div>
                )}
              </div>

              <button onClick={handlePrint}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow"
                title="Print">
                <Printer className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Owner: showing availability banner */}
          {isOwner && (
            <div className="mt-5">
              <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 bg-white rounded-xl border border-blue-200 flex items-center justify-center flex-shrink-0">
                    <CalendarClock className="w-5 h-5 text-[#3355FF]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-semibold text-[#0F172A]">
                      Set your showing availability
                    </h3>
                    <p className="text-[13.5px] text-[#4B5563] mt-1">
                      Tell buyers when they can tour this home. Buyers can only request a showing during the windows you choose.
                    </p>
                    <Link
                      href={route('dashboard.availability')}
                      className="mt-3 inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
                      style={{ height: '38px', paddingLeft: '18px', paddingRight: '18px', fontSize: '13px', fontWeight: 600, backgroundColor: '#3355FF' }}
                    >
                      <Calendar className="w-4 h-4" />
                      Manage availability
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Title + price */}
          <div className="mt-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-[28px] sm:text-[34px] lg:text-[44px] font-bold text-[#0F172A] leading-[1.1] tracking-tight">
                {property.property_title}
              </h1>
              <div className="flex flex-wrap gap-2 mt-3">
                {property.is_featured && (
                  <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 bg-[#8BC540] text-white rounded-md shadow-sm">
                    Featured
                  </span>
                )}
                <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 bg-[#4B5563] text-white rounded-md shadow-sm">
                  {listingStatusLabel}
                </span>
                {(() => {
                  const map = {
                    new_listing: 'New Listing',
                    open_house: 'Open House',
                    motivated_seller: 'Motivated Seller',
                    price_reduction: 'Price Reduction',
                    new_construction: 'New Construction',
                    auction: 'Auction',
                    must_sell_by_date: 'Must Sell By Date',
                  };
                  const text = (property.listing_label && map[property.listing_label])
                    || (property.is_motivated_seller ? 'Motivated Seller' : null);
                  if (!text) return null;
                  return (
                    <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-md shadow-sm">
                      {text}
                    </span>
                  );
                })()}
              </div>
              <p className="mt-4 flex items-center gap-2 text-[#6B7280]">
                <MapPin className="w-4 h-4 text-[#9CA3AF]" />
                <span>{property.address}{property.city ? `, ${property.city}, ${property.state || ''} ${property.zip_code || ''}` : ''}</span>
              </p>
            </div>
            <div className="lg:text-right">
              <span className="block text-[11px] uppercase tracking-wider text-[#9CA3AF] mb-1">Listed price</span>
              <div className="text-[32px] sm:text-[40px] lg:text-[52px] font-bold text-[#0F172A] leading-none tracking-tight">
                {formatPriceShort(property.price)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main body ===== */}
      <section className="bg-[#F8F8F7] pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[40px]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ----- Left main column ----- */}
            <div className="lg:col-span-2 space-y-6">

              {/* Main image + thumbnail strip */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] overflow-hidden">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => openGallery(mainIndex)}
                    className="block w-full cursor-zoom-in"
                  >
                    <img
                      src={photos[mainIndex]}
                      alt={`${property.property_title} - ${mainIndex + 1}`}
                      className="w-full h-[380px] sm:h-[500px] lg:h-[620px] object-cover"
                      onError={(e) => e.target.src = '/images/property-placeholder.svg'}
                    />
                  </button>

                  {photos.length > 1 && (
                    <>
                      <button onClick={() => setMainIndex((i) => (i === 0 ? photos.length - 1 : i - 1))}
                        className="absolute top-1/2 -translate-y-1/2 left-4 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-[#0F172A] shadow-lg backdrop-blur-sm flex items-center justify-center transition-all hover:scale-105"
                        aria-label="Previous">
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button onClick={() => setMainIndex((i) => (i === photos.length - 1 ? 0 : i + 1))}
                        className="absolute top-1/2 -translate-y-1/2 right-4 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-[#0F172A] shadow-lg backdrop-blur-sm flex items-center justify-center transition-all hover:scale-105"
                        aria-label="Next">
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  <button onClick={() => openGallery(mainIndex)}
                    className="absolute top-4 right-4 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-black/60 hover:bg-[#1D4ED8]/80 text-white text-sm font-medium backdrop-blur-sm shadow-lg transition-colors"
                    aria-label="Open gallery">
                    <Images className="w-4 h-4" />
                    {photos.length} Photos
                  </button>

                  {(property.video_tour_url || property.video_url) && (
                    <a href={property.video_tour_url || property.video_url} target="_blank" rel="noopener noreferrer"
                       className="absolute bottom-4 left-4 bg-black/75 hover:bg-[#1D4ED8] text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5" /> Video
                    </a>
                  )}
                </div>

                {/* Thumbnail strip */}
                {photos.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {photos.slice(0, 8).map((photo, idx) => (
                      <button key={idx} onClick={() => setMainIndex(idx)}
                        className={`flex-shrink-0 w-[112px] h-[84px] rounded-md overflow-hidden border-2 transition-all ${
                          idx === mainIndex ? 'border-[#4461FF]' : 'border-transparent opacity-85 hover:opacity-100'
                        }`}>
                        <img src={photo} alt={`thumb-${idx}`} className="w-full h-full object-cover"
                             onError={(e) => e.target.src = '/images/property-placeholder.svg'} />
                      </button>
                    ))}
                    {photos.length > 8 && (
                      <button onClick={() => openGallery(0)}
                        className="flex-shrink-0 w-[112px] h-[84px] rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700 hover:bg-gray-200">
                        +{photos.length - 8}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Virtual Tour */}
              {(() => {
                const tourType = property.virtual_tour_type || (property.virtual_tour_embed ? 'embed' : 'video');
                const videoUrl = property.virtual_tour_url || property.video_tour_url || property.video_url;
                const embedCode = property.virtual_tour_embed;

                const toEmbedUrl = (url) => {
                  if (!url) return null;
                  let m = url.match(/youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/) || url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
                  if (m) return `https://www.youtube.com/embed/${m[1]}`;
                  m = url.match(/vimeo\.com\/(\d+)/);
                  if (m) return `https://player.vimeo.com/video/${m[1]}`;
                  return url;
                };

                if (tourType === 'embed' && embedCode) {
                  return (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6 md:p-8">
                      <h2 className="text-xl font-bold text-[#0F172A] tracking-tight mb-4">Virtual Tour</h2>
                      <div
                        className="relative rounded-xl overflow-hidden aspect-video bg-black [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:border-0"
                        dangerouslySetInnerHTML={{ __html: embedCode }}
                      />
                    </div>
                  );
                }

                if (tourType === 'video' && videoUrl) {
                  const src = toEmbedUrl(videoUrl);
                  return (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6 md:p-8">
                      <h2 className="text-xl font-bold text-[#0F172A] tracking-tight mb-4">Virtual Tour</h2>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                        <iframe
                          src={src}
                          title="Virtual Tour"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full border-0"
                        />
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Overview */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Overview</h2>
                  <span className="hidden sm:inline-flex items-center text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] bg-[#F8F8F7] px-3 py-1.5 rounded-full">
                    {propertyId}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  <OverviewStat icon={Home} value={propertyTypeLabels[property.property_type] || property.property_type} label="Property Type" />
                  {property.property_type !== 'land' && (
                    <>
                      <OverviewStat icon={BedDouble} value={property.bedrooms} label="Bedrooms" />
                      <OverviewStat icon={Bath} value={property.full_bathrooms || property.bathrooms || 0} label="Full Bathrooms" />
                      {property.garage != null && (
                        <OverviewStat icon={Car} value={`${property.garage} Car`} label="Garage" />
                      )}
                      {property.sqft ? (
                        <OverviewStat icon={Maximize2} value={Number(property.sqft).toLocaleString()} label="Home SQ.Footage" />
                      ) : null}
                      {property.year_built && (
                        <OverviewStat icon={Calendar} value={property.year_built} label="Year Built" />
                      )}
                    </>
                  )}
                  {property.property_type === 'land' && (
                    <>
                      {property.acres && (
                        <OverviewStat icon={Maximize2} value={Number(property.acres).toLocaleString()} label="Acres" />
                      )}
                      {property.lot_size && (
                        <OverviewStat icon={Home} value={`${Number(property.lot_size).toLocaleString()} sq ft`} label="Lot Size" />
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6 md:p-8">
                  <h2 className="text-xl font-bold text-[#0F172A] tracking-tight mb-4">Description</h2>
                  {/\<[a-z][\s\S]*\>/i.test(property.description) ? (
                    <div
                      className="prose prose-sm sm:prose-base max-w-none text-[#4B5563] leading-[1.75]"
                      dangerouslySetInnerHTML={{ __html: property.description }}
                    />
                  ) : (
                    <p className="text-[#4B5563] leading-[1.75] whitespace-pre-line">
                      {property.description}
                    </p>
                  )}
                </div>
              )}

              {/* Address */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Address</h2>
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#4461FF] hover:bg-[#3548C8] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
                    <MapPinned className="w-4 h-4" /> Open on Google Maps
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-[#111] font-medium">Address</span>
                    <span className="text-[#111]">{property.address}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-[#111] font-medium">Zip/Postal Code</span>
                    <span className="text-[#111]">{property.zip_code}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-[#111] font-medium">City</span>
                    <span className="text-[#111]">{property.city}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-[#111] font-medium">County</span>
                    <span className="text-[#111]">{property.county || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-[#111] font-medium">State/county</span>
                    <span className="text-[#111]">{property.state}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between mb-5 gap-2">
                  <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Details</h2>
                  {updatedDate && (
                    <span className="inline-flex items-center gap-2 text-sm text-[#6B7280]">
                      <Calendar className="w-4 h-4" /> {updatedDate}
                    </span>
                  )}
                </div>

                <div className="bg-gradient-to-br from-[#EEF4FF] to-[#E6EEFB] rounded-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 ring-1 ring-[#DBE5F8]">
                  <DetailRow k="Property ID:" v={propertyId} />
                  <DetailRow k="Year Built:" v={property.year_built || '—'} />
                  <DetailRow k="Price:" v={formatPriceShort(property.price)} />
                  <DetailRow k="Property Type:" v={propertyTypeLabels[property.property_type] || property.property_type} />
                  {property.sqft ? <DetailRow k="Square Footage of Home:" v={Number(property.sqft).toLocaleString()} /> : null}
                  <DetailRow k="Property Status:" v={listingStatusLabel} />
                  {property.property_type !== 'land' && (
                    <>
                      <DetailRow k="Bedrooms:" v={property.bedrooms} />
                      {property.half_bathrooms != null && <DetailRow k="Half Bathroom (Toilet and Sink):" v={property.half_bathrooms} />}
                      <DetailRow k="Full Bathrooms (with Bath or Shower):" v={property.full_bathrooms || property.bathrooms || 0} />
                    </>
                  )}
                  {property.annual_property_tax != null && <DetailRow k="Annual Property Tax ($):" v={Number(property.annual_property_tax).toLocaleString()} />}
                  {property.garage != null && <DetailRow k="Garage:" v={`${property.garage} Car`} />}
                  {property.hoa_fee != null && property.has_hoa && <DetailRow k="HOA Fee ($):" v={Number(property.hoa_fee).toLocaleString()} />}
                </div>
              </div>

              {/* Features */}
              {groupedFeatures.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6 md:p-8">
                  <h2 className="text-xl font-bold text-[#0F172A] tracking-tight mb-6">Features</h2>
                  <div className="space-y-7">
                    {groupedFeatures.map((g) => {
                      const renderItems = (items) => (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2.5 gap-x-6">
                          {items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                                <Check className="w-3 h-3 text-[#10B981]" strokeWidth={3} />
                              </span>
                              <span className="text-[14.5px] text-[#0F172A]">{item}</span>
                            </div>
                          ))}
                        </div>
                      );
                      return (
                        <div key={g.category}>
                          <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B7280] mb-4">{g.category}</h3>
                          {g.subgroups ? (
                            <div className="space-y-5">
                              {g.subgroups.map((sg) => (
                                <div key={sg.label}>
                                  <div className="text-[13px] font-semibold text-[#0F172A] mb-2.5">{sg.label}</div>
                                  {renderItems(sg.items)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            renderItems(g.items)
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Floor Plans — drop entries where every field is empty (Houzez
                  imports often seed empty placeholder rows). */}
              {(() => {
                const visibleFloorPlans = (Array.isArray(property.floor_plans) ? property.floor_plans : [])
                  .filter((fp) => {
                    if (typeof fp === 'string') return fp.trim() !== '';
                    if (!fp || typeof fp !== 'object') return false;
                    return !!(fp.image || fp.image_url || fp.title || fp.description);
                  });
                return visibleFloorPlans.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6 md:p-8">
                  <h2 className="text-xl font-bold text-[#0F172A] tracking-tight mb-5">Floor Plans</h2>
                  <div className="space-y-6">
                    {visibleFloorPlans.map((fp, i) => {
                      // Legacy string entries (older listings) — render as image only.
                      if (typeof fp === 'string') {
                        return (
                          <a key={i} href={resolvePhotoUrl(fp)} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-[16/9]">
                            <img src={resolvePhotoUrl(fp)} alt={`Floor plan ${i + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/images/property-placeholder.svg'; }} />
                          </a>
                        );
                      }
                      const metaBits = [];
                      const fpBeds = fp.bedrooms ?? fp.rooms;
                      if (fpBeds != null && fpBeds !== '') metaBits.push(`${fpBeds} BR`);
                      if (fp.bathrooms != null && fp.bathrooms !== '') metaBits.push(`${fp.bathrooms} Bath`);
                      if (fp.size) metaBits.push(fp.size);
                      // Local listings store the image under `image`; Houzez
                      // imports use `image_url`. Read whichever is present so
                      // both render the same on the details page.
                      const fpImage = fp.image || fp.image_url;
                      return (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-5 items-start">
                          <div className="md:col-span-2">
                            {fpImage ? (
                              <a href={resolvePhotoUrl(fpImage)} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-[4/3]">
                                <img src={resolvePhotoUrl(fpImage)} alt={fp.title || `Floor plan ${i + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/images/property-placeholder.svg'; }} />
                              </a>
                            ) : (
                              <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 aspect-[4/3] flex items-center justify-center text-sm text-gray-400">No image</div>
                            )}
                          </div>
                          <div className="md:col-span-3">
                            {fp.title && <h3 className="text-base font-semibold text-[#0F172A] mb-1">{fp.title}</h3>}
                            {metaBits.length > 0 && (
                              <p className="text-sm text-[#6B7280] mb-3">{metaBits.join(' · ')}</p>
                            )}
                            {fp.description && (
                              <p className="text-[14.5px] text-[#0F172A] whitespace-pre-line leading-relaxed">{fp.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                );
              })()}

              {/* Schools nearby (Google Places, 10 km) */}
              {property.latitude && property.longitude && (
                <NearbySchools propertyId={property.id} />
              )}

              {/* What's Nearby? (Yelp) */}
              {property.latitude && property.longitude && (
                <NearbySection propertyId={property.id} />
              )}

              {/* Walkscore */}
              {property.latitude && property.longitude && (
                <WalkscoreSection propertyId={property.id} />
              )}

              {/* Mortgage Calculator */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6 md:p-8">
                <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Mortgage Calculator</h2>
                <p className="text-[#6B7280] mt-2 mb-6">
                  Get current rate information and strengthen your offer with a pre-approval letter with our trusted{' '}
                  <Link href="/partners" className="text-[#2563EB] hover:underline">partners</Link>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="flex flex-col items-center relative">
                    <div className="relative flex items-center justify-center">
                      <MortgageDonut
                        principalInterest={calc.monthlyPI}
                        propertyTax={calc.monthlyTax}
                        insurance={calc.monthlyInsurance}
                        hoa={calc.hoaMonthly}
                        pmi={calc.monthlyPmi}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-3xl font-bold text-[#111]">{formatCurrency(calc.total, 2)}</p>
                        <p className="text-sm text-[#6B7280] mt-1">Monthly</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-[15px]">
                    <LegendRow color="#FFFFFF" border="#E5E7EB" label="Down Payment" value={formatCurrency(calc.downPayment, 2)} />
                    <LegendRow color="#FFFFFF" border="#E5E7EB" label="Loan Amount" value={formatCurrency(calc.loanAmount, 2)} />
                    <LegendRow color="#F75D7E" label="Monthly Principal & Interest" value={formatCurrency(calc.monthlyPI, 2)} />
                    <LegendRow color="#4A90E2" label="Monthly Property Tax" value={formatCurrency(calc.monthlyTax, 2)} />
                    <LegendRow color="#F4C24B" label="Annual Home Insurance" value={formatCurrency(calc.monthlyInsurance, 2)} />
                    <LegendRow color="#BFD733" label="Monthly HOA Fees" value={formatCurrency(calc.hoaMonthly, 2)} />
                    <LegendRow color="#BFD733" label="Monthly Mortgage Payment" value={formatCurrency(calc.total, 2)} />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
                  <CalcInput label="Purchase Price" prefix="$" value={mortgage.purchasePrice}
                    onChange={(v) => setM('purchasePrice', v)} />
                  <CalcInput label="Down Payment" prefix="%" value={mortgage.downPaymentPct}
                    onChange={(v) => setM('downPaymentPct', v)} />
                  <CalcInput label="Interest Rate" prefix="%" value={mortgage.interestRate}
                    onChange={(v) => setM('interestRate', v)} step="0.01" />
                  <CalcInput label="Loan Terms (Years)" prefix={<Calendar className="w-4 h-4 text-gray-400" />} value={mortgage.loanYears}
                    onChange={(v) => setM('loanYears', v)} />
                  <CalcInput label="Annual Property Tax" prefix="$" value={mortgage.annualTax}
                    onChange={(v) => setM('annualTax', v)} />
                  <CalcInput label="Annual Home Insurance" prefix="$" value={mortgage.annualInsurance}
                    onChange={(v) => setM('annualInsurance', v)} />
                  <CalcInput label="Monthly HOA Fees" prefix="$" value={mortgage.hoaMonthly}
                    onChange={(v) => setM('hoaMonthly', v)} />
                  <div className="md:col-span-2">
                    <CalcInput label="Private Mortgage Insurance (PMI)" prefix="%" value={mortgage.pmi}
                      onChange={(v) => setM('pmi', v)} step="0.01" />
                    <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                      Mortgage Insurance is typically required if your down payment is less than 20 percent of the property value.
                      Mortgage insurance also is typically required on FHA and USDA loans. Definition by Consumer Financial Protection Bureau.
                    </p>
                  </div>
                </div>
              </div>

              {/* Similar Listings */}
              {similarListings.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] tracking-tight mb-5">Similar Listings</h2>
                  <div className="space-y-4">
                    {similarListings.map((sp) => (
                      <SimilarListingRow key={sp.id} property={sp} onAuthRequired={() => setAuthModalOpen(true)} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ----- Right sidebar ----- */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="sticky top-24 space-y-6">

                {/* Schedule a meeting */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: '#3355FF' }}>
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#111]">Schedule a meeting</h3>
                      <p className="text-xs text-gray-500">Phone call or in-person showing</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-6">
                    Book a time that works for both of you. Get an instant confirmation and a calendar invite.
                  </p>
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold text-white hover:opacity-90"
                    style={{ backgroundColor: '#3355FF' }}
                  >
                    <Calendar className="w-4 h-4" /> See available times
                  </button>
                  {auth?.user && (
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('contact-seller');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold border-2 border-[#3355FF] text-[#3355FF] hover:bg-[#3355FF]/5 transition-colors"
                    >
                      <Mail className="w-4 h-4" /> Send message to seller
                    </button>
                  )}
                </div>

                {/* Create account — only shown to logged-out visitors */}
                {!auth?.user && (
                  <div className="dark-selection bg-gradient-to-br from-[#1A1816] to-[#3355FF] rounded-2xl p-6 text-white shadow-[0_1px_3px_rgba(15,23,42,0.08),0_8px_24px_rgba(15,23,42,0.12)]">
                    <h3 className="text-lg font-bold mb-2">Create a free account</h3>
                    <p className="text-sm text-white/80 leading-6 mb-4">
                      Save this listing, message the seller directly, and track your favorite homes — all free, no agent fees.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openAuth('register')}
                        className="inline-flex items-center justify-center rounded-full bg-white text-[#0F172A] text-sm font-bold px-5 py-2 hover:bg-white/90 transition-colors"
                      >
                        Create account
                      </button>
                      <button
                        type="button"
                        onClick={() => openAuth('login')}
                        className="inline-flex items-center justify-center rounded-full border border-white/30 text-white text-sm font-semibold px-5 py-2 hover:bg-white/10 transition-colors"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                )}

                {/* Share This Property */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6">
                  <h3 className="text-lg font-semibold text-[#111] mb-5">Share This Property</h3>
                  <div className="flex items-center gap-4">
                    <a target="_blank" rel="noopener noreferrer"
                       href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                       className="w-10 h-10 rounded-full border-2 border-[#1877F2] flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a target="_blank" rel="noopener noreferrer"
                       href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(property.property_title)}`}
                       className="w-10 h-10 rounded-full border-2 border-[#1DA1F2] flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/></svg>
                    </a>
                    <a target="_blank" rel="noopener noreferrer"
                       href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                       className="w-10 h-10 rounded-full border-2 border-[#0A66C2] flex items-center justify-center text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a target="_blank" rel="noopener noreferrer"
                       href={`https://wa.me/?text=${encodeURIComponent(`${property.property_title} - ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                       className="w-10 h-10 rounded-full border-2 border-[#25D366] flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                  </div>
                </div>

                {/* Seller preferences */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] p-6 space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[14px] text-[#4B5563] leading-snug">Seller is open to contact from Realtors</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${property.open_to_realtors ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'}`}>
                      {property.open_to_realtors ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[14px] text-[#4B5563] leading-snug">
                      Seller requires a Pre-Approval from a Licenses Mortgage Company Prior to Viewing the Home
                    </p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${property.requires_pre_approval ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'}`}>
                      {property.requires_pre_approval ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {/* Request Info tabbed card */}
                <div id="contact-seller" className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] overflow-hidden">
                  <div className="flex border-b border-gray-100 bg-[#FAFAF8]">
                    <button className="px-5 py-3 text-[#0F172A] text-sm font-semibold bg-white border-b-2 border-[#2563EB] -mb-px">
                      Request Info
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center ring-1 ring-gray-200">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-[15px] text-[#0F172A] font-semibold">
                          {property.contact_name}
                        </p>
                        {property.user_id && (
                          <Link href={`/properties?user=${property.user_id}`} className="text-sm text-[#2563EB] hover:underline">
                            View Listings
                          </Link>
                        )}
                      </div>
                    </div>
                    <InquiryForm property={property} variant="compact" auth={auth} />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg p-4 z-40">
        <div className="flex gap-3">
          {property.contact_phone ? (
            <a href={`tel:${property.contact_phone}`}
               className="flex-1 flex items-center justify-center gap-2 bg-[#2563EB] text-white py-3 px-4 rounded-md font-semibold">
              <Phone className="w-5 h-5" /> Call
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Seller has not provided a phone number"
              aria-disabled="true"
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-400 py-3 px-4 rounded-md font-semibold cursor-not-allowed"
            >
              <Phone className="w-5 h-5" /> Call
            </button>
          )}
          <a href={`mailto:${property.contact_email || ''}?subject=${encodeURIComponent('Interested in: ' + property.property_title)}`}
             className="flex-1 flex items-center justify-center gap-2 border-2 border-[#2563EB] text-[#2563EB] py-3 px-4 rounded-md font-semibold">
            <Mail className="w-5 h-5" /> Message
          </a>
        </div>
      </div>

      {/* Schedule a meeting modal */}
      <ScheduleShowingModal
        property={property}
        open={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />

      {/* Sign-in / create-account modal (triggered from heart or the sidebar CTA) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        intent="favorites"
        initialTab={authModalTab}
      />

      {/* Gallery modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 text-white">
            <div>
              <p className="text-sm text-white/70">{fullAddress}</p>
              <p className="text-sm text-white/50">{galleryIndex + 1} of {photos.length}</p>
            </div>
            <button onClick={() => setShowGalleryModal(false)} className="p-2 hover:bg-white/10 rounded-full">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center relative px-4 min-h-0">
            <button onClick={galleryPrev} className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <img src={photos[galleryIndex]} alt={`Gallery ${galleryIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => e.target.src = '/images/property-placeholder.svg'} />
            <button onClick={galleryNext} className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="px-4 sm:px-6 py-4 overflow-x-auto">
            <div className="flex gap-2 justify-center">
              {photos.map((photo, idx) => (
                <button key={idx} onClick={() => setGalleryIndex(idx)}
                  className={`flex-shrink-0 w-20 h-[60px] rounded-md overflow-hidden border-2 transition-all ${
                    idx === galleryIndex ? 'border-blue-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                  }`}>
                  <img src={photo} alt={`thumb-${idx}`} className="w-full h-full object-cover"
                    onError={(e) => e.target.src = '/images/property-placeholder.svg'} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Small components ---------- */

function OverviewStat({ icon: Icon, value, label }) {
  return (
    <div className="flex items-start gap-3 p-3 md:p-4 rounded-xl bg-[#FAFAF8] border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#0F172A]" />
      </div>
      <div className="min-w-0">
        <p className="text-[15px] font-bold text-[#0F172A] leading-tight truncate">{value}</p>
        <p className="text-xs text-[#6B7280] mt-1">{label}</p>
      </div>
    </div>
  );
}

function DetailRow({ k, v }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[15px] text-[#111]">{k}</span>
      <span className="text-[15px] text-[#111] font-normal text-right">{v}</span>
    </div>
  );
}

function LegendRow({ color, border, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <span
          className="inline-block w-3.5 h-3.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: color, border: border ? `2px solid ${border}` : `2px solid ${color}` }}
        />
        <span className="text-[#4B5563] text-[14.5px]">{label}</span>
      </div>
      <span className="text-[#0F172A] font-semibold text-[14.5px]">{value}</span>
    </div>
  );
}

function CalcInput({ label, prefix, value, onChange }) {
  const prefixIsText = typeof prefix === 'string';
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm flex items-center">
          {prefix}
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={value ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            if (v === '' || /^[0-9]*\.?[0-9]*$/.test(v)) {
              onChange(v);
            }
          }}
          className={`w-full ${prefixIsText ? 'pl-8' : 'pl-10'} pr-3 py-2.5 border border-gray-200 rounded-xl bg-white text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-colors`}
        />
      </div>
    </div>
  );
}

function SimilarListingRow({ property, onAuthRequired }) {
  const { auth, favoritePropertyIds = [] } = usePage().props;
  const computeIsFavorite = () => {
    if (!auth?.user) return !!property.is_favorited;
    const pid = Number(property.id);
    if (Array.isArray(favoritePropertyIds) && favoritePropertyIds.some((id) => Number(id) === pid)) return true;
    return !!property.is_favorited;
  };
  const [isFavorite, setIsFavorite] = useState(computeIsFavorite);
  const [favPending, setFavPending] = useState(false);

  useEffect(() => {
    setIsFavorite(computeIsFavorite());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user?.id, JSON.stringify(favoritePropertyIds), property.id]);

  const mainPhoto = property.photos && property.photos.length > 0
    ? resolvePhotoUrl(property.photos[0])
    : '/images/property-placeholder.svg';

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!auth?.user) {
      if (onAuthRequired) onAuthRequired();
      return;
    }
    if (favPending) return;
    const next = !isFavorite;
    setFavPending(true);
    setIsFavorite(next);
    try {
      if (next) {
        await axios.post(route('dashboard.favorites.add', property.id));
      } else {
        await axios.delete(route('dashboard.favorites.remove', property.id));
      }
    } catch (err) {
      setIsFavorite(!next);
      if ((err?.response?.status === 401 || err?.response?.status === 419) && onAuthRequired) {
        onAuthRequired();
      }
    } finally {
      setFavPending(false);
    }
  };

  return (
    <Link
      href={`/properties/${property.slug || property.id}`}
      className="group flex flex-col md:flex-row bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow md:h-[260px]"
    >
      <div className="relative md:w-[340px] h-[220px] md:h-full flex-shrink-0">
        <img
          src={mainPhoto}
          alt={property.property_title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = '/images/property-placeholder.svg'; }}
        />
        <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 bg-[#8BC540] text-white rounded-sm">
          Featured
        </span>
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-[#E11D48] text-[#E11D48]' : 'text-gray-700'}`}
          />
        </button>
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-[#5A5A5A] text-white rounded-sm">
              For Sale By Owner
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-[#5A5A5A] text-white rounded-sm">
              New Listing
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold text-[#111] group-hover:text-[#2563EB] transition-colors line-clamp-1">
              {property.property_title}
            </h3>
            <p className="text-xl font-bold text-[#111] whitespace-nowrap">{formatPriceShort(property.price)}</p>
          </div>
          <p className="text-sm text-[#6B7280] mt-1 line-clamp-1">{property.address}</p>
          <div className="flex flex-wrap gap-5 mt-4 text-[14px] text-[#111]">
            <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-[#6B7280]" /> {property.bedrooms}</span>
            <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-[#6B7280]" /> {property.full_bathrooms || property.bathrooms || 0}</span>
            <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-[#6B7280]" /> {property.sqft ? Number(property.sqft).toLocaleString() : '—'}</span>
          </div>
          <p className="text-[11px] font-semibold tracking-wider uppercase text-[#6B7280] mt-3">
            {propertyTypeLabels[property.property_type] || property.property_type}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-[#6B7280] min-w-0">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{property.contact_name}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-[#4461FF] group-hover:bg-[#3548C8] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors flex-shrink-0">
            Details
          </span>
        </div>
      </div>
    </Link>
  );
}

PropertyDetail.layout = (page) => <MainLayout>{page}</MainLayout>;

export default PropertyDetail;

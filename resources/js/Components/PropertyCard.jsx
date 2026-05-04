import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { resolvePhotoUrl } from '@/utils/photoUrl';
import {
  Maximize2, Heart, Info, Video, Box, Calendar, X,
  MapPin, BedDouble, Bath, ArrowRight,
} from 'lucide-react';

const NEW_LISTING_WINDOW_DAYS = 14;

const PropertyCard = ({ property, onAuthRequired }) => {
  const { auth, favoritePropertyIds = [] } = usePage().props;
  const [isFavorite, setIsFavorite] = useState(() => {
    // Prefer server-provided favorites for the logged-in user; fall back to
    // the listing's own flag (some queries eager-load is_favorited).
    if (!auth?.user) return false;
    if (Array.isArray(favoritePropertyIds) && favoritePropertyIds.includes(property.id)) return true;
    return !!property.is_favorited;
  });
  const [favoritePending, setFavoritePending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Get the first photo or use placeholder. Storage paths must go
  // through resolvePhotoUrl so bare keys like "properties/abc.webp"
  // become "/storage/properties/abc.webp" instead of resolving relative
  // to the current page URL.
  const propertyImage = property.photos && property.photos.length > 0
    ? resolvePhotoUrl(property.photos[0])
    : '/images/property-placeholder.svg';

  const hasVideo = property.video_tour_url || property.video_url || property.has_video;
  const hasVirtualTour = property.virtual_tour_url || property.matterport_url || property.has_virtual_tour;

  // Determine if listing is "new" — recently created or explicitly flagged
  const isNewListing = (() => {
    if (property.listing_label === 'new_listing') return true;
    if (!property.created_at) return false;
    const created = new Date(property.created_at);
    if (isNaN(created.getTime())) return false;
    const days = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return days <= NEW_LISTING_WINDOW_DAYS;
  })();

  // Human-readable Special Notice badge text for any of the 7 seller-chosen labels.
  const specialNoticeText = (() => {
    const map = {
      new_listing: 'New Listing',
      open_house: 'Open House',
      motivated_seller: 'Motivated Seller',
      price_reduction: 'Price Reduction',
      new_construction: 'New Construction',
      auction: 'Auction',
      must_sell_by_date: 'Must Sell By Date',
    };
    if (property.listing_label && map[property.listing_label]) return map[property.listing_label];
    if (isNewListing) return 'New Listing';
    if (property.is_motivated_seller) return 'Motivated Seller';
    return null;
  })();

  const listingStatusLabel = (() => {
    const ls = property.listing_status || property.status;
    if (ls === 'sold') return 'Sold';
    if (ls === 'pending') return 'Pending';
    if (ls === 'inactive') return 'Inactive';
    if (ls === 'for_rent' || property.transaction_type === 'for_rent') return 'For Rent';
    return 'For Sale By Owner';
  })();

  const detailUrl = `/properties/${property.slug || property.id}`;

  const handleMaximize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(true);
  };

  const handleClosePreview = () => setShowPreview(false);

  // Lock body scroll while modal open
  useEffect(() => {
    if (!showPreview) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setShowPreview(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [showPreview]);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!auth?.user) {
      if (onAuthRequired) onAuthRequired();
      return;
    }
    if (favoritePending) return;
    const next = !isFavorite;
    setFavoritePending(true);
    setIsFavorite(next); // optimistic
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
      setFavoritePending(false);
    }
  };

  const handleInfo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.visit(detailUrl);
  };

  const formatPrice = (v) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(Number(v || 0));

  return (
    <>
      <Link href={detailUrl} className="block h-full">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl hover:border-gray-300 transition-all duration-300 group w-full sm:w-[300px] h-full flex flex-col">
          {/* Property Image */}
          <div className="relative h-[180px] overflow-hidden flex-shrink-0">
            <img
              src={propertyImage}
              alt={property.property_title || property.address}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              onError={(e) => e.target.src = '/images/property-placeholder.svg'}
            />

            {/* Top-Left Badges: Featured / For Sale By Owner / New Listing or Motivated Seller */}
            <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
              {property.is_featured && (
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-[#8BC540] text-white rounded-sm shadow-sm">
                  Featured
                </span>
              )}
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-[#4B5563] text-white rounded-sm shadow-sm">
                {listingStatusLabel}
              </span>
              {specialNoticeText && (
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-[#4B5563] text-white rounded-sm shadow-sm">
                  {specialNoticeText}
                </span>
              )}
            </div>

            {/* Top-Right media indicators */}
            <div className="absolute top-3 right-3 flex gap-1.5">
              {hasVideo && (
                <div className="bg-black/70 text-white p-1.5 rounded-full" title="Video Tour Available">
                  <Video className="w-3.5 h-3.5" />
                </div>
              )}
              {hasVirtualTour && (
                <div className="bg-purple-600/90 text-white p-1.5 rounded-full" title="Virtual Tour Available">
                  <Box className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Open House Badge */}
            {property.upcoming_open_houses?.length > 0 && (
              <div className="absolute bottom-4 left-4 bg-green-600 text-white px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Open House {new Date(property.upcoming_open_houses[0].date.substring(0, 10) + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={handleMaximize}
                className="bg-white/90 hover:bg-white p-2 rounded-lg transition-all duration-300 hover:scale-105"
                title="Quick preview"
              >
                <Maximize2 className="w-4 h-4 text-gray-800" />
              </button>
              <button
                onClick={handleFavorite}
                className="bg-white/90 hover:bg-white p-2 rounded-lg transition-all duration-300 hover:scale-105"
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-[#413936]'}`} />
              </button>
              <button
                onClick={handleInfo}
                className="bg-white/90 hover:bg-white p-2 rounded-lg transition-all duration-300 hover:scale-105"
                title="View details"
              >
                <Info className="w-4 h-4 text-gray-800" />
              </button>
            </div>
          </div>

          {/* Property Details */}
          <div className="px-3 pt-2.5 pb-3 flex flex-col flex-1">
            <div className="pb-2 mb-2 border-b border-gray-200">
              <span className="font-bold text-base text-[#293056]">
                {formatPrice(property.price)}
              </span>
            </div>

            {property.property_title && (
              <div className="pb-2 mb-2 border-b border-gray-200">
                <p className="text-sm font-semibold text-[#293056] line-clamp-1">
                  {property.property_title}
                </p>
              </div>
            )}

            <div className="pb-2 mb-2 border-b border-gray-200">
              <p className="text-sm text-[#293056] line-clamp-2">
                {property.address}, {property.city}, {property.state || ''} {property.zip_code}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#293056]">
                {property.property_type === 'land' ? (
                  <>Lot/Land {property.acres ? `| ${Number(property.acres).toLocaleString()} Acres` : property.lot_size ? `| ${Number(property.lot_size).toLocaleString()} sq ft` : ''}</>
                ) : (
                  <>{property.bedrooms}BD | {(property.full_bathrooms || 0) + (property.half_bathrooms ? property.half_bathrooms * 0.5 : 0)}BA | {property.sqft ? `${Number(property.sqft).toLocaleString()} sq ft` : 'Area N/A'}</>
                )}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Quick-view modal (portaled so the wrapping <Link> never captures clicks) */}
      {showPreview && typeof document !== 'undefined' && createPortal(
        <QuickPreviewModal
          property={property}
          onClose={handleClosePreview}
          isNewListing={isNewListing}
          specialNoticeText={specialNoticeText}
          listingStatusLabel={listingStatusLabel}
          detailUrl={detailUrl}
          formatPrice={formatPrice}
        />,
        document.body
      )}
    </>
  );
};

/* ---------- Quick Preview Modal ---------- */
function QuickPreviewModal({ property, onClose, isNewListing, specialNoticeText, listingStatusLabel, detailUrl, formatPrice }) {
  const photos = property.photos && property.photos.length > 0
    ? property.photos.map((p) => resolvePhotoUrl(p))
    : ['/images/property-placeholder.svg'];
  const [activeIdx, setActiveIdx] = useState(0);

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[1040px] max-h-[92vh] overflow-hidden flex flex-col"
        onClick={stop}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all"
          aria-label="Close preview"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0 overflow-y-auto">
          {/* Left: image */}
          <div className="relative bg-gray-100">
            <img
              src={photos[activeIdx]}
              alt={property.property_title || 'Property'}
              className="w-full h-[280px] md:h-full object-cover"
              onError={(e) => e.target.src = '/images/property-placeholder.svg'}
            />

            {/* Badges overlay */}
            <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-1.5">
              {property.is_featured && (
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-[#8BC540] text-white rounded-sm shadow-sm">
                  Featured
                </span>
              )}
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-[#4B5563] text-white rounded-sm shadow-sm">
                {listingStatusLabel}
              </span>
              {specialNoticeText && (
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 bg-[#4B5563] text-white rounded-sm shadow-sm">
                  {specialNoticeText}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {photos.length > 1 && (
              <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto pb-1">
                {photos.slice(0, 6).map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 ${i === activeIdx ? 'border-white' : 'border-transparent opacity-80 hover:opacity-100'}`}
                  >
                    <img src={p} alt="" className="w-full h-full object-cover"
                      onError={(e) => e.target.src = '/images/property-placeholder.svg'} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: details */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[22px] font-bold text-[#0F172A] leading-tight pr-4">
                  {property.property_title}
                </h3>
                <span className="text-[22px] font-bold text-[#0F172A] whitespace-nowrap">
                  {formatPrice(property.price)}
                </span>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-sm text-[#6B7280]">
                <MapPin className="w-4 h-4 text-[#9CA3AF]" />
                {property.address}, {property.city}, {property.state || ''} {property.zip_code}
              </p>

              {property.property_type !== 'land' ? (
                <div className="mt-5 flex flex-wrap gap-5 text-sm text-[#0F172A]">
                  <span className="inline-flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-[#6B7280]" /> {property.bedrooms} Beds</span>
                  <span className="inline-flex items-center gap-1.5"><Bath className="w-4 h-4 text-[#6B7280]" /> {property.full_bathrooms || property.bathrooms || 0} Baths</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-[#6B7280]" />
                    {property.sqft ? `${Number(property.sqft).toLocaleString()} sq ft` : 'Area N/A'}
                  </span>
                </div>
              ) : (
                <div className="mt-5 text-sm text-[#0F172A]">
                  {property.acres ? `${Number(property.acres).toLocaleString()} Acres` :
                   property.lot_size ? `${Number(property.lot_size).toLocaleString()} sq ft` : 'Lot/Land'}
                </div>
              )}

              {property.description && (
                <p className="mt-5 text-sm text-[#4B5563] leading-relaxed line-clamp-6 whitespace-pre-line">
                  {property.description}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={detailUrl}
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
                style={{ height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600, backgroundColor: '#3355FF' }}
              >
                Full View
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 hover:opacity-90"
                style={{ height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600, backgroundColor: 'white', color: '#0F172A', border: '1px solid #E5E7EB' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;

import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Maximize2, Heart, Info, Video, Box, Calendar } from 'lucide-react';

const PropertyCard = ({ property, onAuthRequired }) => {
  const { auth } = usePage().props;
  const [isFavorite, setIsFavorite] = useState(() => {
    if (typeof window !== 'undefined' && auth?.user) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      return favorites.includes(property.id);
    }
    return false;
  });

  // Get the first photo or use placeholder
  const propertyImage = property.photos && property.photos.length > 0
    ? property.photos[0]
    : '/images/property-placeholder.svg';

  const getStatusLabel = () => {
    const ls = property.listing_status || property.status;
    switch (ls) {
      case 'sold':
        return 'SOLD';
      case 'pending':
        return 'PENDING';
      case 'inactive':
        return 'INACTIVE';
      default:
        return 'FOR SALE';
    }
  };
  const statusLabel = getStatusLabel();

  const getStatusColor = () => {
    const ls = property.listing_status || property.status;
    switch (ls) {
      case 'sold':
        return 'bg-gray-700';
      case 'pending':
        return 'bg-yellow-600';
      case 'inactive':
        return 'bg-gray-500';
      default:
        return 'bg-[#0891B2]';
    }
  };

  const hasVideo = property.video_tour_url || property.video_url || property.has_video;
  const hasVirtualTour = property.virtual_tour_url || property.matterport_url || property.has_virtual_tour;

  // Handle maximize - open in new tab
  const handleMaximize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`/properties/${property.slug || property.id}`, '_blank');
  };

  // Handle favorite toggle - requires auth
  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!auth?.user) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const newFavorites = favorites.filter(id => id !== property.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(property.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  // Handle info - navigate to property detail
  const handleInfo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.visit(`/properties/${property.slug || property.id}`);
  };

  return (
    <Link href={`/properties/${property.slug || property.id}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group w-[300px] flex flex-col">
        {/* Property Image */}
        <div className="relative h-[180px] overflow-hidden flex-shrink-0">
          <img
            src={propertyImage}
            alt={property.property_title || property.address}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={(e) => e.target.src = '/images/property-placeholder.svg'}
          />
          {/* Status Badge */}
          <div className={`absolute top-4 right-4 ${getStatusColor()} text-white px-3 py-1.5 text-xs font-semibold rounded-full`} style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            {statusLabel}
          </div>

          {/* Left Badges */}
          <div className="absolute top-4 left-4 flex gap-1.5">
            {/* MLS Badge */}
            {property.is_mls_listed && (
              <div className="bg-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-full" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                MLS
              </div>
            )}
            {/* Video Reel Icon */}
            {hasVideo && (
              <div className="bg-black/70 text-white p-1.5 rounded-full" title="Video Tour Available">
                <Video className="w-3.5 h-3.5" />
              </div>
            )}
            {/* 3D Tour Icon */}
            {hasVirtualTour && (
              <div className="bg-purple-600/90 text-white p-1.5 rounded-full" title="Virtual Tour Available">
                <Box className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* Open House Badge */}
          {property.upcoming_open_houses?.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-green-600 text-white px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              <Calendar className="w-3 h-3" />
              Open House {new Date(property.upcoming_open_houses[0].date.substring(0, 10) + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={handleMaximize}
              className="bg-white/90 hover:bg-white p-2 rounded-lg transition-all duration-300 hover:scale-105"
              title="Open in new tab"
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
        <div className="px-3 pt-2.5 pb-3 flex flex-col">
          {/* Price */}
          <div className="pb-2 mb-2 border-b border-gray-200">
            <span className="font-bold text-base text-[#293056]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              ${Number(property.price).toLocaleString()}
            </span>
          </div>

          {/* Property Title / Headliner */}
          {property.property_title && (
            <div className="pb-2 mb-2 border-b border-gray-200">
              <p className="text-sm font-semibold text-[#293056] line-clamp-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                {property.property_title}
              </p>
            </div>
          )}

          {/* Address */}
          <div className="pb-2 mb-2 border-b border-gray-200">
            <p className="text-sm text-[#293056] line-clamp-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              {property.address}, {property.city}, {property.state || 'Oklahoma'} {property.zip_code}
            </p>
          </div>

          {/* Property Stats */}
          <div>
            <p className="text-sm text-[#293056]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              {property.property_type === 'land' ? (
                // For land/lot listings, show acres (preferred) or lot size
                <>Lot/Land {property.acres ? `| ${Number(property.acres).toLocaleString()} Acres` : property.lot_size ? `| ${Number(property.lot_size).toLocaleString()} sq ft` : ''}</>
              ) : (
                // For all other property types, show beds/baths/sqft
                <>{property.bedrooms}BD | {(property.full_bathrooms || 0) + (property.half_bathrooms ? property.half_bathrooms * 0.5 : 0)}BA | {property.sqft ? `${Number(property.sqft).toLocaleString()} sq ft` : 'Area N/A'}</>
              )}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;

import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import PropertyCard from '@/Components/PropertyCard';
import AuthModal from '@/Components/AuthModal';

const PropertiesSection = ({ properties = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Only show real properties - no sample data
  const displayProperties = properties;

  const propertiesPerSlide = 4;
  const totalSlides = Math.ceil(displayProperties.length / propertiesPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentProperties = () => {
    const start = currentSlide * propertiesPerSlide;
    return displayProperties.slice(start, start + propertiesPerSlide);
  };

  return (
    <section className="bg-[#EEEDEA] py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-[40px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            View Listings For Sale
          </h2>
          <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Find the perfect home for you. Search all available properties and find the one that suits your needs.
          </p>
        </div>

        {/* Carousel Container */}
        {displayProperties.length > 0 ? (
          <div className="relative">
            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-7 bg-[#413936] hover:bg-[#312926] p-3.5 rounded-full shadow-lg z-10 transition-all duration-300"
                  aria-label="Previous properties"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-7 bg-[#413936] hover:bg-[#312926] p-3.5 rounded-full shadow-lg z-10 transition-all duration-300"
                  aria-label="Next properties"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}

            {/* Property Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
              {getCurrentProperties().map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onAuthRequired={() => setShowAuthModal(true)}
                />
              ))}
            </div>

            {/* Carousel Dots */}
            {totalSlides > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index ? 'w-8 bg-[#413936]' : 'w-2 bg-[#D0CCC7] hover:bg-[#B0ACA7]'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* No Properties Message */
          <div className="bg-white rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <div className="bg-[#EEEDEA] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-10 h-10 text-[#413936]" />
            </div>
            <h3 className="text-2xl font-semibold text-[#111] mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              No Properties Listed Yet
            </h3>
            <p className="text-[#666] mb-6" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Be the first to list your property for sale by owner. It's free and takes less than 5 minutes to get started!
            </p>
            <Link
              href="/list-property"
              className="inline-flex items-center justify-center gap-2 bg-[#0891B2] text-white rounded-full px-8 py-3 font-medium transition-all duration-300 hover:bg-[#0E7490]"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              List Your Property Free
            </Link>
          </div>
        )}

        {/* View All Button - only show when there are properties */}
        {displayProperties.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 bg-[#0891B2] text-white rounded-full px-8 py-3 font-medium transition-all duration-300 hover:bg-[#0E7490]"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              View All Properties For Sale
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_home_props" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                  <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_home_props)">
                  <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                </g>
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </section>
  );
};

export default PropertiesSection;

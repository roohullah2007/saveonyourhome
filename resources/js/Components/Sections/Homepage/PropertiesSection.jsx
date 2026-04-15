import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import PropertyCard from '@/Components/PropertyCard';
import AuthModal from '@/Components/AuthModal';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const PropertiesSection = ({ properties = [] }) => {
  const [sectionRef, isVisible] = useScrollReveal();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const displayProperties = properties;

  const propertiesPerSlide = 4;
  const totalSlides = Math.ceil(displayProperties.length / propertiesPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide >= totalSlides - 1;

  const getCurrentProperties = () => {
    const start = currentSlide * propertiesPerSlide;
    return displayProperties.slice(start, start + propertiesPerSlide);
  };

  return (
    <section style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
      <div
        ref={sectionRef}
        className={`mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ maxWidth: '1400px' }}
      >
        {/* Section Header */}
        <div className="text-left mb-10 sm:mb-14">
          <div className="mb-4">
            <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100, 100, 100)' }}>
              FEATURED LISTINGS
            </span>
          </div>
          <h2
            className="mb-4 text-[29px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]"
            style={{ fontWeight: 700, color: 'rgb(26, 24, 22)' }}
          >
            View Listings For Sale
          </h2>
          <p style={{ fontSize: '17px', color: 'rgb(100, 100, 100)', maxWidth: '560px', lineHeight: '26px' }}>
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
                  disabled={isFirstSlide}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-7 flex items-center justify-center rounded-full z-10 transition-all duration-300 group border ${
                    isFirstSlide
                      ? 'border-gray-200 opacity-40 cursor-not-allowed'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                  }`}
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                  }}
                  aria-label="Previous properties"
                >
                  <ChevronLeft className={`w-6 h-6 transition-colors ${isFirstSlide ? 'text-gray-400' : 'text-gray-600 group-hover:text-gray-900'}`} />
                </button>

                <button
                  onClick={nextSlide}
                  disabled={isLastSlide}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-7 flex items-center justify-center rounded-full z-10 transition-all duration-300 group border ${
                    isLastSlide
                      ? 'border-gray-200 opacity-40 cursor-not-allowed'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                  }`}
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                  }}
                  aria-label="Next properties"
                >
                  <ChevronRight className={`w-6 h-6 transition-colors ${isLastSlide ? 'text-gray-400' : 'text-gray-600 group-hover:text-gray-900'}`} />
                </button>
              </>
            )}

            {/* Property Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
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
                    className="rounded-full transition-all duration-500"
                    style={{
                      width: currentSlide === index ? '24px' : '8px',
                      height: '8px',
                      backgroundColor: currentSlide === index ? 'rgb(26, 24, 22)' : 'rgb(209, 213, 219)',
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* No Properties - Enhanced Empty State */
          <div
            className="rounded-2xl border border-gray-200/60 text-center w-full"
            style={{
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(16px)',
              boxShadow: 'rgba(0, 0, 0, 0.06) 0px 4px 24px, rgba(255, 255, 255, 0.8) 0px 1px 0px inset',
              padding: '56px 40px',
            }}
          >
            <div
              className="flex items-center justify-center rounded-2xl mx-auto mb-6"
              style={{ width: '70px', height: '70px', backgroundColor: 'rgb(245, 245, 244)' }}
            >
              <svg width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="#1A1816" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'rgb(26, 24, 22)', marginBottom: '8px' }}>
              No Properties Listed Yet
            </h3>
            <p style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100, 100, 100)', marginBottom: '28px', maxWidth: '380px', margin: '0 auto 28px' }}>
              Be the first to list your property for sale by owner. It's free and takes less than 5 minutes to get started!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/list-property"
                className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: 'rgb(26, 24, 22)', height: '51px', paddingLeft: '31px', paddingRight: '31px', fontSize: '16px', fontWeight: 600 }}
              >
                List Your Property Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-full transition-colors hover:bg-gray-100"
                style={{ border: '1px solid rgb(209, 213, 219)', height: '51px', paddingLeft: '31px', paddingRight: '31px', fontSize: '16px', fontWeight: 600, color: 'rgb(26, 24, 22)' }}
              >
                Browse Properties
              </Link>
            </div>
          </div>
        )}

        {/* View All Button */}
        {displayProperties.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: 'rgb(26, 24, 22)', height: '51px', paddingLeft: '31px', paddingRight: '31px', fontSize: '16px', fontWeight: 600 }}
            >
              View All Properties
              <ArrowRight className="w-4 h-4" />
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

import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Home, ArrowRight } from 'lucide-react';
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
    <section className="bg-[#F5F4F1] py-20 md:py-24">
      <div
        ref={sectionRef}
        className={`max-w-[1280px] mx-auto px-4 sm:px-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center bg-[#0891B2]/[0.08] rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#0891B2] text-[13px] font-inter font-semibold tracking-wide uppercase">
              Featured Listings
            </span>
          </div>
          <h2 className="text-[26px] sm:text-[34px] md:text-[44px] font-inter font-bold text-[#111] mb-4 tracking-[-0.03em] leading-[1.15]">
            View Listings For Sale
          </h2>
          <p className="text-[15px] md:text-[16px] text-gray-500 font-inter max-w-2xl mx-auto leading-[1.7]">
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
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-7 bg-white hover:bg-[#0891B2] p-3.5 rounded-full shadow-lg z-10 transition-all duration-300 group border border-gray-100"
                  aria-label="Previous properties"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-7 bg-white hover:bg-[#0891B2] p-3.5 rounded-full shadow-lg z-10 transition-all duration-300 group border border-gray-100"
                  aria-label="Next properties"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
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
                    className={`h-2 rounded-full transition-all duration-500 ${
                      currentSlide === index ? 'w-8 bg-[#0891B2]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* No Properties Message */
          <div className="bg-white rounded-3xl p-14 text-center max-w-2xl mx-auto border border-gray-100/80 shadow-sm">
            <div className="bg-gradient-to-br from-[#0891B2]/10 to-[#06B6D4]/5 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Home className="w-9 h-9 text-[#0891B2]" />
            </div>
            <h3 className="text-2xl font-inter font-bold text-[#111] mb-3 tracking-[-0.02em]">
              No Properties Listed Yet
            </h3>
            <p className="text-gray-500 mb-8 font-inter leading-[1.7]">
              Be the first to list your property for sale by owner. It's free and takes less than 5 minutes to get started!
            </p>
            <Link
              href="/list-property"
              className="inline-flex items-center justify-center gap-2.5 bg-[#0891B2] text-white rounded-full px-8 py-3.5 font-inter font-semibold text-[14px] transition-all duration-300 hover:bg-[#0E7490] hover:shadow-lg hover:shadow-[#0891B2]/20 hover:-translate-y-[1px]"
            >
              List Your Property Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* View All Button */}
        {displayProperties.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2.5 bg-[#0891B2] text-white rounded-full px-8 py-3.5 font-inter font-semibold text-[14px] transition-all duration-300 hover:bg-[#0E7490] hover:shadow-lg hover:shadow-[#0891B2]/20 hover:-translate-y-[1px]"
            >
              View All Properties For Sale
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

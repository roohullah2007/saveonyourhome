import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { Search, Play, Pause } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      headlineTop: 'Save Thousands',
      headlineBottom: 'in Commission!',
      description: 'SaveOnYourHome.com does not charge sellers ANY commissions or fees. Owners increase their profits while buyers reduce their costs and afford more property. A typical seller saves $27,000!',
      image: '/images/home-img.webp',
      ctaPrimary: { text: 'List My Home', href: '/list-property' },
      ctaSecondary: { text: 'View Listings For Sale', href: '/properties', icon: Search }
    },
    {
      id: 2,
      headlineTop: 'Empowering Sellers,',
      headlineBottom: 'Connecting Buyers!',
      description: 'We provide the most comprehensive suite of FREE services — robust listings, pricing guidance, enhanced communication, and marketing tools. Buyers enjoy 24/7 access to detailed property information.',
      image: '/images/home-img-2.webp',
      ctaPrimary: { text: 'List My Home', href: '/list-property' },
      ctaSecondary: { text: 'View Listings For Sale', href: '/properties', icon: Search }
    },
    {
      id: 3,
      headlineTop: 'Revolutionizing',
      headlineBottom: 'Real Estate!',
      description: 'Join us in transforming the home buying and selling experience. Unlike other platforms, we don\'t charge commissions or fees. We\'re committed to making real estate accessible, transparent, and cost-effective for everyone.',
      image: 'https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=1920',
      ctaPrimary: { text: 'List My Home', href: '/list-property' },
      ctaSecondary: { text: 'View Listings For Sale', href: '/properties', icon: Search }
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-rotate slides
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center pt-0 md:pt-[77px] pb-20 overflow-hidden">

        {/* Background Images - Crossfade */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.headline}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/35"></div>
          </div>
        ))}

        {/* Content */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full">
          <div className="max-w-3xl mx-auto text-center">

            {/* Slides Content - Crossfade */}
            <div className="relative min-h-[280px] flex items-center justify-center">
              {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                  >
                    {/* Main Heading */}
                    <div className="mb-5">
                      <h1
                        className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] drop-shadow-2xl"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {slide.headlineTop}
                      </h1>
                      <p
                        className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] drop-shadow-2xl"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {slide.headlineBottom}
                      </p>
                    </div>

                    {/* Description */}
                    <p
                      className="text-white text-[14px] sm:text-[16px] font-medium mb-8 leading-relaxed max-w-2xl mx-auto drop-shadow-lg"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link
                        href={slide.ctaPrimary.href}
                        className="inline-flex items-center justify-center gap-2 bg-[#0891B2] text-white rounded-full px-6 py-3.5 font-semibold text-[15px] leading-[120%] transition-all duration-300 hover:bg-[#0E7490] hover:shadow-lg hover:shadow-[#0891B2]/25"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        <span>{slide.ctaPrimary.text}</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <mask id={`mask_${slide.id}`} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                            <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                          </mask>
                          <g mask={`url(#mask_${slide.id})`}>
                            <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                          </g>
                        </svg>
                      </Link>
                      <Link
                        href={slide.ctaSecondary.href}
                        className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full px-6 py-3.5 font-semibold text-[15px] leading-[120%] transition-all duration-300 hover:bg-white/20"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {slide.ctaSecondary.icon && <slide.ctaSecondary.icon className="w-5 h-5" />}
                        <span>{slide.ctaSecondary.text}</span>
                      </Link>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`group relative transition-all duration-300 ${
                index === currentSlide ? 'w-12' : 'w-3'
              } h-3 rounded-full overflow-hidden`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {/* Background */}
              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white/40 group-hover:bg-white/60'
              }`}>
                {/* Progress bar for active slide */}
                {index === currentSlide && !isPaused && (
                  <div
                    className="absolute inset-0 bg-[#0891B2] rounded-full origin-left"
                    style={{
                      animation: 'progress 5s linear forwards'
                    }}
                  />
                )}
              </div>
            </button>
          ))}

          {/* Pause/Play indicator */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="ml-2 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
          >
            {isPaused ? (
              <Play className="w-3 h-3 text-white fill-white" />
            ) : (
              <Pause className="w-3 h-3 text-white" />
            )}
          </button>
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-8 right-8 z-20 hidden md:block">
          <div className="flex items-center gap-2 text-white/70 text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            <span className="text-white text-lg font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span>/</span>
            <span>{String(slides.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* CSS for progress animation */}
      <style>{`
        @keyframes progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { Search, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      headlineTop: 'Save Thousands',
      headlineGradient: 'in Commission',
      headlineBottom: 'Selling Your Home',
      description: 'SaveOnYourHome.com does not charge sellers ANY commissions or fees. Owners increase their profits while buyers reduce their costs and afford more property.',
      image: '/images/home-img.webp',
    },
    {
      id: 2,
      headlineTop: 'Empowering Sellers,',
      headlineGradient: 'Connecting',
      headlineBottom: 'Buyers Directly',
      description: 'We provide the most comprehensive suite of FREE services — robust listings, pricing guidance, enhanced communication, and marketing tools for FSBO sellers.',
      image: '/images/home-img-2.webp',
    },
    {
      id: 3,
      headlineTop: 'Revolutionizing',
      headlineGradient: 'Real Estate',
      headlineBottom: 'For Everyone',
      description: 'Unlike other platforms, we don\'t charge commissions or fees. We\'re committed to making real estate accessible, transparent, and cost-effective for everyone.',
      image: 'https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=1920',
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section data-hero className="relative w-full overflow-hidden">
      {/* Background Images - Crossfade */}
      {slides.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.image}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 15, 30, 0.78) 0%, rgba(10, 15, 30, 0.45) 50%, rgba(10, 15, 30, 0.65) 100%)'
        }}
      />

      {/* Bottom fade to page background */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          height: '200px',
          background: 'linear-gradient(transparent 0%, rgba(245, 244, 241, 0.4) 50%, rgb(245, 244, 241) 100%)'
        }}
      />

      {/* Decorative blur circles */}
      <div
        className="absolute top-20 right-20 h-64 w-64 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent)',
          filter: 'blur(40px)'
        }}
      />
      <div
        className="absolute bottom-40 left-10 h-48 w-48 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent)',
          filter: 'blur(30px)'
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col" style={{ minHeight: '780px' }}>
        <div
          className="mx-auto flex flex-1 items-center px-4 sm:px-6"
          style={{ maxWidth: '1296px', width: '100%' }}
        >
          <div className="flex w-full flex-col items-center justify-between gap-12 lg:flex-row">

            {/* Left Column - Text Content */}
            <div className="w-full lg:max-w-[600px]">

              {/* Glass badge */}
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5"
                style={{
                  border: '1px solid rgba(156, 163, 175, 0.25)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                }}
              >
                <div
                  className="h-2 w-2 rounded-full bg-emerald-400"
                  style={{ boxShadow: '0 0 8px rgba(52, 211, 153, 0.6)' }}
                />
                <span
                  className="font-inter"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  NO COMMISSIONS. NO FEES.
                </span>
              </div>

              {/* Slides Content - Crossfade */}
              <div className="relative min-h-[280px] sm:min-h-[300px]">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                  >
                    {/* Heading */}
                    <h1
                      className="text-[30px] leading-[38px] sm:text-[42px] sm:leading-[50px] lg:text-[54px] lg:leading-[64px] font-inter font-extrabold text-white"
                      style={{ letterSpacing: '-0.5px' }}
                    >
                      {slide.headlineTop}
                      <br />
                      <span
                        style={{
                          background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {slide.headlineGradient}
                      </span>
                      <br />
                      {slide.headlineBottom}
                    </h1>

                    {/* Description */}
                    <p
                      className="mt-6 font-inter"
                      style={{
                        fontSize: '17px',
                        lineHeight: '28px',
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.75)',
                        maxWidth: '480px',
                      }}
                    >
                      {slide.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Search Box - Glass Card */}
              <div
                className="mt-8 rounded-2xl"
                style={{
                  border: '1px solid rgba(156, 163, 175, 0.25)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  padding: '6px',
                }}
              >
                {/* Tabs */}
                <div className="flex items-center gap-1 px-2 pb-2 pt-1">
                  <Link
                    href="/list-property"
                    className="relative rounded-lg px-4 py-1.5 text-sm font-inter font-medium transition-all"
                    style={{ color: '#fff', backgroundColor: 'rgba(255,255,255,0.15)' }}
                  >
                    Sell
                  </Link>
                  <Link
                    href="/properties"
                    className="relative rounded-lg px-4 py-1.5 text-sm font-inter font-medium transition-all"
                    style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'transparent' }}
                  >
                    Buy
                  </Link>
                  <Link
                    href="/our-packages"
                    className="relative rounded-lg px-4 py-1.5 text-sm font-inter font-medium transition-all"
                    style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'transparent' }}
                  >
                    MLS
                  </Link>
                  <Link
                    href="/sellers"
                    className="relative rounded-lg px-4 py-1.5 text-sm font-inter font-medium transition-all"
                    style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'transparent' }}
                  >
                    FSBO
                  </Link>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <form
                    className="flex items-center rounded-xl bg-white shadow-lg"
                    style={{ height: '52px' }}
                    onSubmit={(e) => { e.preventDefault(); window.location.href = '/properties'; }}
                  >
                    <input
                      type="text"
                      placeholder="Search properties by city, state, or ZIP..."
                      className="h-full flex-1 rounded-l-xl border-0 bg-transparent pl-5 pr-2 font-inter focus:ring-0"
                      style={{ fontSize: '15px', fontWeight: 400, color: '#1A1816' }}
                    />
                    <Link
                      href="/properties"
                      className="flex w-[100px] sm:w-[130px] shrink-0 items-center justify-center gap-2 rounded-r-xl bg-[#1A1816] text-white transition-colors hover:bg-[#2a2826]"
                      style={{ height: '52px', fontSize: '14px', fontWeight: 600 }}
                    >
                      Search
                      <Search className="h-4 w-4" />
                    </Link>
                  </form>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 flex gap-8">
                <div>
                  <div className="font-inter" style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>$27K+</div>
                  <div className="font-inter" style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>Avg. Savings</div>
                </div>
                <div>
                  <div className="font-inter" style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>0%</div>
                  <div className="font-inter" style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>Commission</div>
                </div>
                <div>
                  <div className="font-inter" style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>FREE</div>
                  <div className="font-inter" style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>Listing</div>
                </div>
                <div className="hidden sm:block">
                  <div className="font-inter" style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>5 min</div>
                  <div className="font-inter" style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>Setup Time</div>
                </div>
              </div>
            </div>

            {/* Right Column - CTA Card (Desktop only) */}
            <div className="hidden lg:block" style={{ width: '400px' }}>
              <div
                className="rounded-2xl overflow-hidden p-6"
                style={{
                  border: '1px solid rgba(156, 163, 175, 0.25)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                }}
              >
                {/* Image */}
                <div className="overflow-hidden rounded-xl" style={{ height: '220px' }}>
                  <img
                    src="/images/home-img-2.webp"
                    alt="Sell your home"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Card Content */}
                <div className="mt-5 px-1">
                  <div className="flex items-center justify-between">
                    <span className="font-inter" style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>
                      List For Free
                    </span>
                    <div
                      className="rounded-full px-3 py-1"
                      style={{
                        border: '1px solid rgba(156, 163, 175, 0.25)',
                        background: 'rgba(255, 255, 255, 0.06)',
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      <span className="font-inter" style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                        No Fees
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '20px' }}>
                    Create your listing in under 5 minutes. Upload photos, add details, and connect directly with buyers.
                  </p>

                  <p className="mt-1.5 font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                    Photos, videos, yard signs & more
                  </p>

                  {/* CTA Buttons */}
                  <div className="mt-5 flex flex-col gap-2.5">
                    <Link
                      href="/list-property"
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#0891B2] text-white font-inter transition-all duration-300 hover:bg-[#0E7490]"
                      style={{ height: '46px', fontSize: '14px', fontWeight: 600 }}
                    >
                      List My Home
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/properties"
                      className="flex items-center justify-center gap-2 rounded-xl text-white font-inter transition-all duration-300 hover:bg-white/10"
                      style={{
                        height: '46px',
                        fontSize: '14px',
                        fontWeight: 600,
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <Search className="w-4 h-4" />
                      Browse Properties
                    </Link>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { Search } from 'lucide-react';

const HeroSection = ({ featuredProperties = [] }) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Property cards for the right carousel
  const propertyCards = featuredProperties.length > 0
    ? featuredProperties.slice(0, 5)
    : [];

  const nextCard = useCallback(() => {
    if (propertyCards.length > 0) {
      setCardIndex((prev) => (prev + 1) % propertyCards.length);
    }
  }, [propertyCards.length]);

  useEffect(() => {
    if (propertyCards.length === 0) return;
    const interval = setInterval(() => {
      nextCard();
    }, 4000);
    return () => clearInterval(interval);
  }, [nextCard, propertyCards.length]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/properties${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`;
  };

  return (
    <section className="relative w-full overflow-hidden h-[580px] md:h-[700px] lg:h-[860px]">
      {/* Single Background Image */}
      <img
        src="/images/home-img.webp"
        alt="SaveOnYourHome real estate"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 15, 30, 0.75) 0%, rgba(10, 15, 30, 0.45) 50%, rgba(10, 15, 30, 0.65) 100%)'
        }}
      />

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          height: '200px',
          background: 'linear-gradient(transparent 0%, rgba(249, 250, 251, 0.4) 50%, rgb(249, 250, 251) 100%)'
        }}
      />

      {/* Decorative blur circles */}
      <div
        className="absolute top-20 right-20 h-64 w-64 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15), transparent)',
          filter: 'blur(40px)'
        }}
      />
      <div
        className="absolute bottom-40 left-10 h-48 w-48 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent)',
          filter: 'blur(30px)'
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col h-full">
        <div
          className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]"
          style={{ maxWidth: '1400px', width: '100%' }}
        >
          <div className="flex w-full flex-col items-center justify-between gap-12 lg:flex-row">

            {/* Left Column */}
            <div className="w-full lg:max-w-[580px]">

              {/* Glass badge */}
              <div
                className="rounded-2xl mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5"
                style={{
                  border: '1px solid rgba(156, 163, 175, 0.25)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 8px 32px',
                  borderRadius: '9999px',
                }}
              >
                <div
                  className="h-2 w-2 rounded-full bg-emerald-400"
                  style={{ boxShadow: 'rgba(52, 211, 153, 0.6) 0px 0px 8px' }}
                />
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '1.5px',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}>
                  NO COMMISSIONS. NO FEES.
                </span>
              </div>

              {/* Heading */}
              <h1
                className="text-[26px] leading-[34px] sm:text-[36px] sm:leading-[44px] lg:text-[46px] lg:leading-[56px] font-extrabold text-white"
                style={{ letterSpacing: '-0.5px' }}
              >
                Save Thousands
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0.7) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  in Commission
                </span>
                <br />
                Selling Your Home
              </h1>

              <p
                className="mt-6"
                style={{
                  fontSize: '17px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.75)',
                  maxWidth: '480px',
                }}
              >
                SaveOnYourHome.com does not charge sellers <strong style={{ color: 'rgba(255, 255, 255, 0.95)' }}>ANY commissions or fees</strong>. Owners increase their profits while buyers reduce their costs and afford more property.
              </p>

              {/* Search Box - Glass Card */}
              <div
                className="rounded-2xl mt-8"
                style={{
                  border: '1px solid rgba(156, 163, 175, 0.25)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 8px 32px',
                  padding: '6px',
                }}
              >
                {/* Tabs */}
                <div className="flex items-center gap-1 px-2 pb-2 pt-1">
                  <Link
                    href="/properties"
                    className="relative rounded-lg px-4 py-1.5 text-sm font-medium transition-all"
                    style={{ color: 'rgb(255, 255, 255)', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    Buy
                  </Link>
                  <Link
                    href="/list-property"
                    className="relative rounded-lg px-4 py-1.5 text-sm font-medium transition-all"
                    style={{ color: 'rgba(255, 255, 255, 0.6)', backgroundColor: 'transparent' }}
                  >
                    Sell
                  </Link>
                  <Link
                    href="/our-packages"
                    className="relative rounded-lg px-4 py-1.5 text-sm font-medium transition-all"
                    style={{ color: 'rgba(255, 255, 255, 0.6)', backgroundColor: 'transparent' }}
                  >
                    MLS
                  </Link>
                  <Link
                    href="/sellers"
                    className="relative rounded-lg px-4 py-1.5 text-sm font-medium transition-all"
                    style={{ color: 'rgba(255, 255, 255, 0.6)', backgroundColor: 'transparent' }}
                  >
                    FSBO
                  </Link>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <form
                    className="flex items-center rounded-xl bg-white shadow-lg"
                    style={{ height: '52px' }}
                    onSubmit={handleSearch}
                  >
                    <input
                      type="text"
                      placeholder="Address, City or Neighborhood..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-full flex-1 rounded-l-xl border-0 bg-transparent pl-5 pr-2 focus:ring-0"
                      style={{ fontSize: '15px', fontWeight: 400, color: 'rgb(26, 24, 22)' }}
                    />
                    <button
                      type="submit"
                      className="flex w-[100px] sm:w-[130px] shrink-0 items-center justify-center gap-2 rounded-r-xl bg-[#1A1816] text-white transition-colors hover:bg-[#2a2826]"
                      style={{ height: '52px', fontSize: '14px', fontWeight: 600 }}
                    >
                      Search
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 sm:mt-8 flex gap-5 sm:gap-8">
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'rgb(255, 255, 255)' }}>$27K+</div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.5px' }}>Avg. Savings</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'rgb(255, 255, 255)' }}>0%</div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.5px' }}>Commission</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'rgb(255, 255, 255)' }}>FREE</div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.5px' }}>Listing</div>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Property Carousel (Desktop only) */}
            <div className="hidden lg:block" style={{ width: '380px' }}>
              {propertyCards.length > 0 ? (
                <div className="relative overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${cardIndex * 100}%)` }}
                  >
                    {propertyCards.map((property) => (
                      <div key={property.id} className="w-full shrink-0">
                        <Link href={`/properties/${property.slug || property.id}`}>
                          <div
                            className="rounded-2xl overflow-hidden p-4"
                            style={{
                              border: '1px solid rgba(156, 163, 175, 0.25)',
                              background: 'rgba(255, 255, 255, 0.06)',
                              backdropFilter: 'blur(20px)',
                              boxShadow: 'rgba(0, 0, 0, 0.12) 0px 8px 32px',
                            }}
                          >
                            <div className="overflow-hidden rounded-xl" style={{ height: '220px' }}>
                              <img
                                src={property.photos?.[0] || '/images/property-placeholder.svg'}
                                alt={`${property.address}, ${property.city}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="mt-4 px-1">
                              <div className="flex items-center justify-between">
                                <span style={{ fontSize: '22px', fontWeight: 800, color: 'rgb(255, 255, 255)' }}>
                                  {formatPrice(property.price)}
                                </span>
                                <div
                                  className="rounded-2xl rounded-full px-3 py-1"
                                  style={{
                                    border: '1px solid rgba(156, 163, 175, 0.25)',
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 8px 32px',
                                    borderRadius: '9999px',
                                  }}
                                >
                                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
                                    Featured
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center gap-3" style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)' }}>
                                {property.bedrooms > 0 && (
                                  <>
                                    <span><strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{property.bedrooms}</strong> bd</span>
                                    <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
                                  </>
                                )}
                                {property.bathrooms > 0 && (
                                  <>
                                    <span><strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{property.bathrooms}</strong> ba</span>
                                    <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
                                  </>
                                )}
                                {property.sqft > 0 && (
                                  <span><strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{property.sqft.toLocaleString()}</strong> sqft</span>
                                )}
                              </div>
                              <p className="mt-1.5 truncate" style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
                                {property.address}, {property.city}, {property.state}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Carousel dots */}
                  <div className="mt-4 flex justify-center gap-2">
                    {propertyCards.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCardIndex(idx)}
                        className="rounded-full transition-all"
                        style={{
                          width: idx === cardIndex ? '24px' : '8px',
                          height: '8px',
                          backgroundColor: idx === cardIndex ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0.35)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Fallback CTA card when no featured properties */
                <div
                  className="rounded-2xl overflow-hidden p-4"
                  style={{
                    border: '1px solid rgba(156, 163, 175, 0.25)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 8px 32px',
                  }}
                >
                  <div className="overflow-hidden rounded-xl" style={{ height: '220px' }}>
                    <img
                      src="/images/home-img-2.webp"
                      alt="Sell your home"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-4 px-1">
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '22px', fontWeight: 800, color: 'rgb(255, 255, 255)' }}>
                        List For Free
                      </span>
                      <div
                        className="rounded-full px-3 py-1"
                        style={{
                          border: '1px solid rgba(156, 163, 175, 0.25)',
                          background: 'rgba(255, 255, 255, 0.06)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: '9999px',
                        }}
                      >
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>No Fees</span>
                      </div>
                    </div>
                    <p className="mt-2" style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '20px' }}>
                      Create your listing in under 5 minutes. Upload photos, add details, and connect directly with buyers.
                    </p>
                    <p className="mt-1.5" style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
                      Photos, videos, yard signs & more
                    </p>
                    <div className="mt-5 flex flex-col gap-2.5">
                      <Link
                        href="/list-property"
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#1A1816] text-white transition-all duration-300 hover:bg-[#2a2826]"
                        style={{ height: '46px', fontSize: '14px', fontWeight: 600 }}
                      >
                        List My Home Free
                      </Link>
                      <Link
                        href="/properties"
                        className="flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:bg-white/10"
                        style={{
                          height: '46px',
                          fontSize: '14px',
                          fontWeight: 600,
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        Browse Properties
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

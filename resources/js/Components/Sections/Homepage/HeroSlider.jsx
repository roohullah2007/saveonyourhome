import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera, Compass, Video, Box, Clapperboard, Sun } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import CompanyLogosGrid from '@/Components/Sections/CompanyLogosGrid';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const services = [
    { icon: Camera, label: 'Professional Photos + Drone', color: '#0891B2' },
    { icon: Compass, label: 'Floor Plans', color: '#3B82F6' },
    { icon: Video, label: 'Walkthrough Video Tour', color: '#10B981' },
    { icon: Box, label: 'Matterport 3D', color: '#8B5CF6' },
    { icon: Clapperboard, label: 'Reels/TikTok Video', color: '#F59E0B' },
    { icon: Sun, label: 'Virtual Twilight', color: '#EC4899' }
  ];

  const slides = [
    {
      id: 1,
      type: 'standard',
      image: '/images/home-img.webp',
      title: 'Save Thousands in Commission!',
      subtitle: 'No Commissions, No Fees',
      description: 'SaveOnYourHome.com does not charge sellers ANY commissions or fees. Easily craft a tailored listing in under 5 minutes and start saving.'
    },
    {
      id: 2,
      type: 'services',
      image: 'https://images.pexels.com/photos/8134820/pexels-photo-8134820.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Showcase Your Property',
      subtitle: 'with professional photos, 3D tours, floor plans, and more.',
      description: 'Give your property the best first impression to lead to faster, higher-priced sales.'
    },
    {
      id: 3,
      type: 'mls',
      image: '/images/home-img-2.webp',
      title: 'Get Maximum Exposure',
      subtitle: 'by Listing on the MLS',
      description: 'A local flat-fee MLS listing increases the likelihood of selling your property faster.'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full py-20 bg-[#EEEDEA]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Slider Container */}
        <div className="relative h-[750px]">
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Rounded Image Card */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

                {/* Content */}
                {slide.type === 'standard' ? (
                  /* Standard Slide Content - Bottom Aligned */
                  <div className="absolute bottom-0 left-0 right-0 px-12 md:px-16 pb-12">
                    <div className="flex items-end justify-between">
                      {/* Left Side - Title and Buttons */}
                      <div className="max-w-3xl">
                        {/* Title */}
                        <h1
                          className="text-[#EEEDEA] text-[36px] font-medium leading-tight mb-4"
                          style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
                        >
                          {slide.title}
                          <br />
                          {slide.subtitle}
                        </h1>

                        {/* Description */}
                        <p
                          className="text-[#EEEDEA]/90 text-[16px] font-medium mb-8 max-w-2xl leading-relaxed"
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          {slide.description}
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <Link
                            href="/list-property"
                            className="inline-flex items-center gap-[0.4rem] bg-white text-[#111] rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#F5F1ED]"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            <span>List Your Property</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <mask id={`mask_free_listing_${index}`} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                                <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                              </mask>
                              <g mask={`url(#mask_free_listing_${index})`}>
                                <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="currentColor"/>
                              </g>
                            </svg>
                          </Link>
                          <Link
                            href="/our-packages"
                            className="inline-flex items-center gap-[0.4rem] bg-transparent border border-white text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-white/10"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            <span>View Our Services</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <mask id={`mask_browse_${index}`} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                                <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                              </mask>
                              <g mask={`url(#mask_browse_${index})`}>
                                <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="currentColor"/>
                              </g>
                            </svg>
                          </Link>
                        </div>
                      </div>

                      {/* Right Side - Navigation Arrows */}
                      <div className="hidden md:flex gap-4 mb-2">
                        <button
                          onClick={prevSlide}
                          className="bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg transition-all duration-300"
                          aria-label="Previous slide"
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>

                        <button
                          onClick={nextSlide}
                          className="bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg transition-all duration-300"
                          aria-label="Next slide"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-800" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : slide.type === 'services' ? (
                  /* Services Slide Content - Split Layout */
                  <div className="absolute inset-0">
                    <div className="w-full h-full px-12 md:px-16 py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                      {/* Left Side - Title, Description and Buttons */}
                      <div className="flex-1 max-w-xl flex flex-col justify-center">
                        {/* Title */}
                        <h2
                          className="text-[#EEEDEA] text-[36px] font-medium leading-tight mb-4"
                          style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
                        >
                          {slide.title}
                          <br />
                          {slide.subtitle}
                        </h2>

                        {/* Description */}
                        <p
                          className="text-[#EEEDEA]/90 text-[16px] font-medium mb-8 leading-relaxed"
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          {slide.description}
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <Link
                            href="/list-property"
                            className="inline-flex items-center gap-[0.4rem] bg-white text-[#111] rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#F5F1ED]"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            <span>List Your Property</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <mask id="mask_services" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                                <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                              </mask>
                              <g mask="url(#mask_services)">
                                <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="currentColor"/>
                              </g>
                            </svg>
                          </Link>
                          <Link
                            href="/our-packages"
                            className="inline-flex items-center gap-[0.4rem] bg-transparent border border-white text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-white/10"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            <span>View Our Services</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <mask id="mask_browse_services" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                                <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                              </mask>
                              <g mask="url(#mask_browse_services)">
                                <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="currentColor"/>
                              </g>
                            </svg>
                          </Link>
                        </div>
                      </div>

                      {/* Right Side - Service Cards Grid */}
                      <div className="flex-1 max-w-lg flex flex-col justify-center">
                        <div className="grid grid-cols-2 gap-3">
                          {services.map((service, idx) => {
                            const IconComponent = service.icon;
                            return (
                              <div
                                key={idx}
                                className="bg-[#1A1A1A]/90 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 hover:bg-[#2A2A2A]/90 transition-all duration-300 cursor-pointer group"
                              >
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: `${service.color}20` }}
                                >
                                  <IconComponent
                                    className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                                    style={{ color: service.color }}
                                  />
                                </div>
                                <span
                                  className="text-white text-[13px] font-medium leading-tight"
                                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                                >
                                  {service.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Navigation Arrows - Fixed Position Bottom Right */}
                    <div className="absolute bottom-12 right-12 md:right-16 hidden md:flex gap-4">
                      <button
                        onClick={prevSlide}
                        className="bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg transition-all duration-300"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>

                      <button
                        onClick={nextSlide}
                        className="bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg transition-all duration-300"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* MLS Slide Content - Split Layout with Logos */
                  <div className="absolute inset-0">
                    <div className="w-full h-full px-12 md:px-16 py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                      {/* Left Side - Title, Description and Buttons */}
                      <div className="flex-1 max-w-xl flex flex-col justify-center">
                        {/* Title */}
                        <h2
                          className="text-[#EEEDEA] text-[36px] font-medium leading-tight mb-4"
                          style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
                        >
                          {slide.title}
                          <br />
                          {slide.subtitle}
                        </h2>

                        {/* Subheading */}
                        <p
                          className="text-[#EEEDEA] text-[20px] font-medium mb-4"
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          Reach More Buyers by Working with Agents
                        </p>

                        {/* Description */}
                        <p
                          className="text-[#EEEDEA]/90 text-[16px] font-medium mb-8 leading-relaxed"
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          {slide.description}
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <Link
                            href="/list-property"
                            className="inline-flex items-center gap-[0.4rem] bg-white text-[#111] rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#F5F1ED]"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            <span>List Your Property</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <mask id="mask_mls" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                                <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                              </mask>
                              <g mask="url(#mask_mls)">
                                <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="currentColor"/>
                              </g>
                            </svg>
                          </Link>
                          <Link
                            href="/properties"
                            className="inline-flex items-center gap-[0.4rem] bg-transparent border border-white text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-white/10"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            <span>Browse Properties</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <mask id="mask_browse_mls" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                                <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                              </mask>
                              <g mask="url(#mask_browse_mls)">
                                <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="currentColor"/>
                              </g>
                            </svg>
                          </Link>
                        </div>
                      </div>

                      {/* Right Side - MLS Logos Grid with White Background */}
                      <div className="flex-1 max-w-md flex flex-col justify-center">
                        <div className="bg-white rounded-2xl p-8 shadow-xl">
                          <p
                            className="text-[#666] text-[14px] font-medium mb-6 text-center"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            Your listing will appear on
                          </p>
                          <CompanyLogosGrid variant="text" />
                          <p
                            className="text-[#999] text-[12px] font-medium mt-6 text-center"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            + 100s of other real estate websites
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Arrows - Fixed Position Bottom Right */}
                    <div className="absolute bottom-12 right-12 md:right-16 hidden md:flex gap-4">
                      <button
                        onClick={prevSlide}
                        className="bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg transition-all duration-300"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>

                      <button
                        onClick={nextSlide}
                        className="bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg transition-all duration-300"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;

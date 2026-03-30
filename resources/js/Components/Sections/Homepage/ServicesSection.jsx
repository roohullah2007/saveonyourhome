import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { X, Camera, FileText, Video, Box, Sun, Film, Home } from 'lucide-react';

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      title: 'Photos + Drone',
      link: '/our-packages',
      icon: Camera,
      color: '#0891B2',
      modalTitle: 'Professional Photography + Drone',
      modalImage: 'https://images.pexels.com/photos/3935333/pexels-photo-3935333.jpeg?auto=compress&cs=tinysrgb&w=800',
      modalDescription: 'Full coverage photography with full use rights for your real estate listings. Our photos include interiors, exteriors, details, and neighborhood amenities—optimized for MLS and listing sites like Zillow and Trulia. Aerial video adds a cinematic, professional look that vastly boosts listing views.',
      features: [
        'HDR interior and exterior photography',
        'Neighborhood amenities included',
        'FAA-certified drone pilots',
        'Cinematic aerial photos and video',
        'Optimized for MLS, Zillow, and Trulia',
        'Full use rights included'
      ],
      cta: 'View Packages',
      ctaLink: '/our-packages'
    },
    {
      title: 'Basic Floorplan',
      link: '/our-packages',
      icon: FileText,
      color: '#10B981',
      modalTitle: 'Basic Floor Plans',
      modalImage: 'https://images.pexels.com/photos/6444968/pexels-photo-6444968.jpeg?auto=compress&cs=tinysrgb&w=800',
      modalDescription: 'Help buyers visualize the layout and flow of your property with detailed, professionally created floor plans. Essential for serious buyers making informed decisions about space and room configuration.',
      features: [
        '2D floor plan layout',
        'Accurate room dimensions',
        'Room labels included',
        'Square footage calculations',
        'Print-ready PDF formats',
        'Fast turnaround'
      ],
      exampleText: 'Professional 2D layout with accurate dimensions, room labels, and square footage calculations.',
      cta: 'View Packages',
      ctaLink: '/our-packages'
    },
    {
      title: 'HD Video Walkthrough',
      link: '/our-packages',
      icon: Video,
      color: '#EF4444',
      modalTitle: 'HD Video Walkthrough',
      modalImage: 'https://images.pexels.com/photos/5524223/pexels-photo-5524223.jpeg?auto=compress&cs=tinysrgb&w=800',
      showPhoneVideo: true,
      phoneVideo: '/videos/matterport-video.mp4',
      modalDescription: 'HD video tours can be an incredible benefit to your listings. Videos are set to music of your choice and showcase your home\'s greatest features, allowing potential buyers to view from afar without meeting in person.',
      features: [
        'Professional HD videography',
        'Music of your choice',
        'Showcases home\'s best features',
        'Perfect for out-of-town buyers',
        'Drone footage integration available',
        'YouTube and MLS ready'
      ],
      cta: 'View Packages',
      ctaLink: '/our-packages'
    },
    {
      title: 'Matterport 3D Tour',
      link: '/our-packages',
      icon: Box,
      color: '#8B5CF6',
      modalTitle: 'Matterport 3D Tour',
      modalImage: 'https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg?auto=compress&cs=tinysrgb&w=800',
      modalDescription: 'Fully immersive virtual tours are becoming increasingly popular. Matterport 3D tours feature a unique "Dollhouse View" that lets buyers explore every room at their own pace from anywhere in the world.',
      features: [
        'Dollhouse view of entire property',
        'Self-guided virtual walkthrough',
        'Measurement tools for buyers',
        'Embeddable on any website',
        'VR headset compatible',
        '24/7 open house experience'
      ],
      cta: 'View Packages',
      ctaLink: '/our-packages'
    },
    {
      title: 'Virtual Twilight',
      link: '/our-packages',
      icon: Sun,
      color: '#F59E0B',
      modalTitle: 'Virtual Twilight Photography',
      beforeAfterImages: {
        before: 'https://images.pexels.com/photos/1876045/pexels-photo-1876045.jpeg?auto=compress&cs=tinysrgb&w=800',
        after: 'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=800',
        beforeLabel: 'Before',
        afterLabel: 'After'
      },
      modalDescription: 'Transform your daytime exterior photos into stunning twilight shots. Virtual twilight creates dramatic, magazine-worthy images that make your listing stand out—no evening shoot required.',
      features: [
        'Dramatic dusk/twilight sky effects',
        'Interior lights digitally illuminated',
        'Warm, inviting ambiance',
        'No evening shoot required',
        'Perfect for luxury listings',
        'Quick digital turnaround'
      ],
      cta: 'View Packages',
      ctaLink: '/our-packages'
    },
    {
      title: 'Reels / TikTok Video',
      link: '/our-packages',
      icon: Film,
      color: '#EC4899',
      modalTitle: 'Reels / TikTok Video',
      modalImage: 'https://images.pexels.com/photos/3935333/pexels-photo-3935333.jpeg?auto=compress&cs=tinysrgb&w=800',
      showSocialLogos: true,
      modalDescription: 'Reach more buyers with short-form vertical video content optimized for Instagram Reels, TikTok, and YouTube Shorts. Eye-catching content designed to attract maximum attention and boost your listing views.',
      features: [
        'Vertical video format (9:16)',
        'Trending music and effects',
        'Fast-paced engaging edits',
        'Optimized for social algorithms',
        'Multiple platform ready',
        'Caption-friendly design'
      ],
      cta: 'View Packages',
      ctaLink: '/our-packages'
    },
    {
      title: 'Zillow 3D + Floor Plan',
      link: '/our-packages',
      icon: Home,
      color: '#3B82F6',
      modalTitle: 'Zillow 3D Home Tour + Floor Plan',
      modalImage: 'https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg?auto=compress&cs=tinysrgb&w=800',
      modalDescription: 'Adding Zillow 3D tours improves your search ranking on Zillow. Get featured with their native 3D Home Tour and interactive floor plan, giving your property more visibility and engagement on the platform.',
      features: [
        'Zillow-native 3D tour format',
        'Interactive floor plan included',
        'Improved Zillow search ranking',
        'Mobile-friendly experience',
        'Easy buyer navigation',
        'Integrated with Zillow listing'
      ],
      cta: 'View Packages',
      ctaLink: '/our-packages'
    },
  ];

  return (
    <section id="services" className="bg-white py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Top Section - Badge, Heading, Description and Buttons */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
          {/* Left Side - Heading */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Our Multimedia Services
              </span>
            </div>
            {/* Main Heading */}
            <h2
              className="text-[40px] text-[#111] font-medium leading-tight uppercase"
              style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
            >
              Showcase Your Property
            </h2>
            {/* Sub Heading */}
            <p
              className="text-[20px] text-[#666] font-medium mt-2"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              with professional photos, 3D tours, floor plans, and more.
            </p>
          </div>

          {/* Right Side - Description and Buttons */}
          <div className="lg:pt-12">
            {/* Description */}
            <p
              className="text-[16px] text-[#666] font-medium mb-8 leading-relaxed"
              style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
            >
              Give your property the best first impression to lead to a faster, higher-priced sale. Listings with professional photos sell up to 32% faster and command around 4% higher prices.
            </p>

            {/* Button */}
            <Link
              href="/our-packages"
              className="inline-flex items-center gap-[0.4rem] bg-[#0891B2] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#0E7490]"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              <span>View Packages</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_56_2205" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                  <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_56_2205)">
                  <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                </g>
              </svg>
            </Link>
          </div>
        </div>

        {/* Services Grid - Full Width Below */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => setSelectedService(service)}
              className="group flex items-center justify-between bg-[#EEEDEA] rounded-full px-8 py-6 transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <span
                className="text-[#111] text-lg font-medium"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                {service.title}
              </span>
              <div className="bg-[#E5E1DC] rounded-full p-3 group-hover:bg-[#D5D1CC] transition-colors flex-shrink-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transform group-hover:translate-x-1 transition-transform"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedService(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

          {/* Modal */}
          <div
            className="relative bg-white rounded-2xl w-full max-w-[1232px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-[#111]" />
            </button>

            {/* Modal Content - Two Column Layout (or single column if no image) */}
            <div className={`flex flex-col ${(selectedService.modalImage || selectedService.beforeAfterImages) ? 'lg:grid lg:grid-cols-2' : ''}`} style={{ maxHeight: '90vh' }}>
              {/* Left - Image or Before/After (only if image exists) */}
              {(selectedService.modalImage || selectedService.beforeAfterImages) && (
                <div className="relative shrink-0 bg-[#f5f5f5] lg:rounded-l-2xl overflow-hidden h-[300px] lg:h-auto lg:min-h-[500px]" style={{ maxHeight: '90vh' }}>
                  {selectedService.beforeAfterImages ? (
                    <div className="w-full h-full grid grid-rows-2">
                      {/* Before Image */}
                      <div className="relative bg-[#1a1a1a] overflow-hidden">
                        <img
                          src={selectedService.beforeAfterImages.before}
                          alt="Before"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center 30%' }}
                        />
                        <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                          {selectedService.beforeAfterImages.beforeLabel || 'Before'}
                        </div>
                      </div>
                      {/* After Image */}
                      <div className="relative bg-[#1a1a1a] overflow-hidden">
                        <img
                          src={selectedService.beforeAfterImages.after}
                          alt="After"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center 30%' }}
                        />
                        <div
                          className="absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                          style={{ backgroundColor: selectedService.color }}
                        >
                          {selectedService.beforeAfterImages.afterLabel || 'After'}
                        </div>
                      </div>
                    </div>
                  ) : selectedService.showPhoneVideo ? (
                    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
                      <div className="flex items-center justify-center">
                        {/* Phone Mockup with Video */}
                        <div className="relative">
                          {/* Phone Frame */}
                          <div className="relative w-[200px] h-[400px] bg-black rounded-[36px] p-2 shadow-2xl border-4 border-gray-800">
                            {/* Screen */}
                            <div className="w-full h-full rounded-[28px] overflow-hidden relative bg-black">
                              {/* Video inside phone */}
                              <video
                                src={selectedService.phoneVideo}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                              />
                              {/* Video Tour UI overlay */}
                              <div className="absolute bottom-4 left-3 right-3">
                                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                                  <p className="text-white text-[10px] font-medium">HD Video Tour</p>
                                  <p className="text-white/70 text-[8px]">Professional walkthrough</p>
                                </div>
                              </div>
                              {/* Play icon */}
                              <div className="absolute top-12 right-2">
                                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </div>
                              </div>
                              {/* Notch */}
                              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={selectedService.modalImage}
                        alt={selectedService.modalTitle}
                        className="w-full h-full object-cover"
                      />
                      {/* Phone Mockup with Property Image */}
                      {selectedService.showSocialLogos && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
                          <div className="flex items-center gap-8">
                            {/* Phone Mockup */}
                            <div className="relative">
                              {/* Phone Frame */}
                              <div className="relative w-[200px] h-[400px] bg-black rounded-[36px] p-2 shadow-2xl border-4 border-gray-800">
                                {/* Screen */}
                                <div className="w-full h-full rounded-[28px] overflow-hidden relative bg-black">
                                  {/* Property Image inside phone */}
                                  <img
                                    src="https://images.pexels.com/photos/5524223/pexels-photo-5524223.jpeg?auto=compress&cs=tinysrgb&w=800"
                                    alt="Property Reel"
                                    className="w-full h-full object-cover"
                                  />
                                  {/* TikTok-style UI overlay */}
                                  <div className="absolute bottom-4 left-3 right-12">
                                    <p className="text-white text-xs font-semibold drop-shadow-lg">@saveonyourhome</p>
                                    <p className="text-white text-[10px] mt-1 drop-shadow-lg">Beautiful 4BR home with stunning views! 🏠✨ #forsale #realestate #dreamhome</p>
                                  </div>
                                  {/* Side icons */}
                                  <div className="absolute right-2 bottom-16 flex flex-col items-center gap-4">
                                    <div className="flex flex-col items-center">
                                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                      </div>
                                      <span className="text-white text-[8px] mt-0.5">24.5K</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M21 6h-2V4.33C19 3.6 18.4 3 17.67 3H6.33C5.6 3 5 3.6 5 4.33V6H3c-.55 0-1 .45-1 1v2c0 1.86 1.28 3.41 3 3.86V21h14v-8.14c1.72-.45 3-2 3-3.86V7c0-.55-.45-1-1-1z"/>
                                        </svg>
                                      </div>
                                      <span className="text-white text-[8px] mt-0.5">1,234</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                                        </svg>
                                      </div>
                                      <span className="text-white text-[8px] mt-0.5">Share</span>
                                    </div>
                                  </div>
                                  {/* Notch */}
                                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full"></div>
                                </div>
                              </div>
                            </div>

                            {/* Social Media Logos */}
                            <div className="flex flex-col gap-4">
                              {/* TikTok Logo */}
                              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                                <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none">
                                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" fill="#fff"/>
                                </svg>
                              </div>
                              {/* Instagram Reels Logo */}
                              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
                                <svg viewBox="0 0 24 24" className="w-9 h-9" fill="white">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/>
                                  <circle cx="18.406" cy="5.594" r="1.44"/>
                                </svg>
                              </div>
                              {/* YouTube Shorts Logo */}
                              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                                <svg viewBox="0 0 24 24" className="w-9 h-9" fill="white">
                                  <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Right - Content */}
              <div className="p-6 lg:p-10 flex flex-col overflow-y-auto">
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedService.color}15` }}
                  >
                    <selectedService.icon
                      className="w-6 h-6"
                      style={{ color: selectedService.color }}
                    />
                  </div>
                  <h3
                    className="text-[22px] md:text-[24px] font-semibold text-[#111]"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {selectedService.modalTitle}
                  </h3>
                </div>

                {/* Description */}
                <p
                  className="text-[14px] text-[#666] mb-5 leading-relaxed"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {selectedService.modalDescription}
                </p>

                {/* Features */}
                <div className="mb-5">
                  <h4
                    className="text-[14px] font-semibold text-[#111] mb-3"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    What's Included:
                  </h4>
                  <ul className="space-y-2">
                    {selectedService.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: `${selectedService.color}15` }}
                        >
                          <svg className="w-2.5 h-2.5" style={{ color: selectedService.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span
                          className="text-[13px] text-[#666]"
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Before/After Text Example */}
                {selectedService.exampleBeforeText && selectedService.exampleAfterText && (
                  <div className="mb-5">
                    <h4
                      className="text-[14px] font-semibold text-[#111] mb-3"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Example:
                    </h4>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <div
                          className="rounded-lg p-3 h-full"
                          style={{ backgroundColor: '#f5f5f5' }}
                        >
                          <span
                            className="block text-[10px] font-semibold text-[#999] uppercase mb-1"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            Before
                          </span>
                          <p
                            className="text-[12px] text-[#666]"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            {selectedService.exampleBeforeText}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div
                          className="rounded-lg p-3 h-full"
                          style={{ backgroundColor: `${selectedService.color}15` }}
                        >
                          <span
                            className="block text-[10px] font-semibold uppercase mb-1"
                            style={{ color: selectedService.color, fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            After
                          </span>
                          <p
                            className="text-[12px] text-[#666]"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            {selectedService.exampleAfterText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Single Text Example */}
                {selectedService.exampleText && (
                  <div className="mb-5">
                    <h4
                      className="text-[14px] font-semibold text-[#111] mb-3"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Example:
                    </h4>
                    <div
                      className="rounded-lg p-3"
                      style={{ backgroundColor: `${selectedService.color}15` }}
                    >
                      <p
                        className="text-[12px] text-[#666]"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {selectedService.exampleText}
                      </p>
                    </div>
                  </div>
                )}

                {/* Example Link (for tours/videos) */}
                {selectedService.exampleLink && (
                  <div className="mb-5">
                    <h4
                      className="text-[14px] font-semibold text-[#111] mb-3"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Example:
                    </h4>
                    <a
                      href={selectedService.exampleLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 hover:opacity-80"
                      style={{
                        borderColor: selectedService.color,
                        color: selectedService.color,
                        fontFamily: 'Instrument Sans, sans-serif'
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{selectedService.exampleLinkLabel || 'View Example'}</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}

                {/* CTA Button */}
                <Link
                  href={selectedService.ctaLink}
                  className="inline-flex items-center gap-2 text-white rounded-full px-6 py-3 font-medium transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: selectedService.color, fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <span>{selectedService.cta}</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;

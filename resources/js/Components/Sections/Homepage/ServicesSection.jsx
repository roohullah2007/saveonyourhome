import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { X, Camera, FileText, Video, Box, Sun, Film, Home, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const ServicesSection = () => {
  const [sectionRef, isVisible] = useScrollReveal();
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
    <section id="services" className="bg-white py-20 md:py-24">
      <div
        ref={sectionRef}
        className={`max-w-[1280px] mx-auto px-4 sm:px-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Top Section - Badge, Heading, Description and Buttons */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start mb-10 sm:mb-14">
          {/* Left Side - Heading */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center bg-[#0891B2]/[0.08] rounded-full px-4 py-1.5 mb-5 sm:mb-6">
              <span className="text-[#0891B2] text-[13px] font-inter font-semibold tracking-wide uppercase">
                Our Multimedia Services
              </span>
            </div>
            {/* Main Heading */}
            <h2 className="text-[26px] sm:text-[34px] md:text-[42px] text-[#111] font-inter font-bold leading-[1.15] tracking-[-0.03em]">
              Showcase Your Property
            </h2>
            {/* Sub Heading */}
            <p className="text-[15px] sm:text-[17px] text-gray-500 font-inter font-normal mt-3 leading-[1.6]">
              with professional photos, 3D tours, floor plans, and more.
            </p>
          </div>

          {/* Right Side - Description and Buttons */}
          <div className="lg:pt-12">
            {/* Description */}
            <p className="text-[15px] text-gray-500 font-inter mb-8 leading-[1.75]">
              Give your property the best first impression to lead to a faster, higher-priced sale. Listings with professional photos sell up to 32% faster and command around 4% higher prices.
            </p>

            {/* Button */}
            <Link
              href="/our-packages"
              className="inline-flex items-center gap-2.5 bg-[#0891B2] text-white rounded-full px-7 py-3.5 font-inter font-semibold text-[14px] transition-all duration-300 hover:bg-[#0E7490] hover:shadow-lg hover:shadow-[#0891B2]/20 hover:-translate-y-[1px]"
            >
              <span>View Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Services Grid - Full Width Below */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => setSelectedService(service)}
              className="group flex items-center justify-between bg-[#F5F4F1] rounded-2xl px-7 py-5.5 transition-all duration-300 hover:bg-[#EEEDEA] hover:shadow-md cursor-pointer border border-transparent hover:border-gray-200/50"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${service.color}12` }}
                >
                  <service.icon className="w-5 h-5" style={{ color: service.color }} />
                </div>
                <span className="text-[#111] text-[16px] font-inter font-semibold tracking-[-0.01em]">
                  {service.title}
                </span>
              </div>
              <div className="bg-white rounded-full p-2.5 group-hover:bg-[#0891B2] transition-all duration-300 flex-shrink-0 shadow-sm">
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

          {/* Modal */}
          <div
            className="relative bg-white rounded-3xl w-full max-w-[1232px] overflow-hidden animate-scaleIn shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-[#111]" />
            </button>

            {/* Modal Content */}
            <div className={`flex flex-col ${(selectedService.modalImage || selectedService.beforeAfterImages) ? 'lg:grid lg:grid-cols-2' : ''}`} style={{ maxHeight: '90vh' }}>
              {/* Left - Image */}
              {(selectedService.modalImage || selectedService.beforeAfterImages) && (
                <div className="relative shrink-0 bg-[#f5f5f5] lg:rounded-l-3xl overflow-hidden h-[300px] lg:h-auto lg:min-h-[500px]" style={{ maxHeight: '90vh' }}>
                  {selectedService.beforeAfterImages ? (
                    <div className="w-full h-full grid grid-rows-2">
                      <div className="relative bg-[#1a1a1a] overflow-hidden">
                        <img src={selectedService.beforeAfterImages.before} alt="Before" className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-inter font-semibold px-3 py-1.5 rounded-full">
                          {selectedService.beforeAfterImages.beforeLabel || 'Before'}
                        </div>
                      </div>
                      <div className="relative bg-[#1a1a1a] overflow-hidden">
                        <img src={selectedService.beforeAfterImages.after} alt="After" className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
                        <div className="absolute top-4 left-4 text-white text-xs font-inter font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: selectedService.color }}>
                          {selectedService.beforeAfterImages.afterLabel || 'After'}
                        </div>
                      </div>
                    </div>
                  ) : selectedService.showPhoneVideo ? (
                    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
                      <div className="relative w-[200px] h-[400px] bg-black rounded-[36px] p-2 shadow-2xl border-4 border-gray-800">
                        <div className="w-full h-full rounded-[28px] overflow-hidden relative bg-black">
                          <video src={selectedService.phoneVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                          <div className="absolute bottom-4 left-3 right-3">
                            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                              <p className="text-white text-[10px] font-inter font-medium">HD Video Tour</p>
                              <p className="text-white/70 text-[8px] font-inter">Professional walkthrough</p>
                            </div>
                          </div>
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img src={selectedService.modalImage} alt={selectedService.modalTitle} className="w-full h-full object-cover" />
                      {selectedService.showSocialLogos && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
                          <div className="flex items-center gap-8">
                            <div className="relative w-[200px] h-[400px] bg-black rounded-[36px] p-2 shadow-2xl border-4 border-gray-800">
                              <div className="w-full h-full rounded-[28px] overflow-hidden relative bg-black">
                                <img src="https://images.pexels.com/photos/5524223/pexels-photo-5524223.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Property Reel" className="w-full h-full object-cover" />
                                <div className="absolute bottom-4 left-3 right-12">
                                  <p className="text-white text-xs font-inter font-semibold drop-shadow-lg">@saveonyourhome</p>
                                  <p className="text-white text-[10px] mt-1 font-inter drop-shadow-lg">Beautiful 4BR home with stunning views! #forsale #realestate</p>
                                </div>
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full"></div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-4">
                              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
                                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" fill="#fff"/>
                                </svg>
                              </div>
                              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
                                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z"/>
                                  <circle cx="18.406" cy="5.594" r="1.44"/>
                                </svg>
                              </div>
                              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white">
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
              <div className="p-7 lg:p-10 flex flex-col overflow-y-auto">
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedService.color}12` }}
                  >
                    <selectedService.icon className="w-6 h-6" style={{ color: selectedService.color }} />
                  </div>
                  <h3 className="text-[22px] md:text-[24px] font-inter font-bold text-[#111] tracking-[-0.02em]">
                    {selectedService.modalTitle}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[14px] text-gray-500 mb-6 leading-[1.7] font-inter">
                  {selectedService.modalDescription}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-[14px] font-inter font-semibold text-[#111] mb-3">
                    What's Included:
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedService.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: `${selectedService.color}12` }}
                        >
                          <svg className="w-3 h-3" style={{ color: selectedService.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-[13px] text-gray-600 font-inter">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Single Text Example */}
                {selectedService.exampleText && (
                  <div className="mb-6">
                    <h4 className="text-[14px] font-inter font-semibold text-[#111] mb-3">Example:</h4>
                    <div className="rounded-xl p-4" style={{ backgroundColor: `${selectedService.color}08` }}>
                      <p className="text-[13px] text-gray-600 font-inter">{selectedService.exampleText}</p>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <Link
                  href={selectedService.ctaLink}
                  className="inline-flex items-center gap-2.5 text-white rounded-full px-7 py-3.5 font-inter font-semibold text-[14px] transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-[1px] w-fit"
                  style={{ backgroundColor: selectedService.color }}
                >
                  <span>{selectedService.cta}</span>
                  <ArrowRight className="w-4 h-4" />
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

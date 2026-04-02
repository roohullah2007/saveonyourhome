import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { DollarSign, Users, ChevronRight, ChevronDown, Zap, BarChart3, Camera, FileText, Megaphone, Handshake, CheckCircle, Video, Box, Sun, Globe, Eye, TrendingUp } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import CompanyLogosGrid from '@/Components/Sections/CompanyLogosGrid';

function Sellers() {
  const howItWorks = [
    {
      step: '01',
      icon: FileText,
      title: 'List Your Property',
      description: 'Capture attention with photos, videos, and virtual tours. Utilize intuitive pricing tools and expert guidance to attract ideal buyers efficiently and effectively.'
    },
    {
      step: '02',
      icon: Users,
      title: 'Connect with Buyers',
      description: 'Engage directly with interested buyers, answer questions, and schedule viewings. Coordinate showings, highlight unique features, and negotiate offers for the best deal.'
    },
    {
      step: '03',
      icon: Handshake,
      title: 'Close the Deal',
      description: 'Our resources ensure accurate, efficient paperwork. Close smoothly, transfer ownership hassle-free. Enjoy savings from avoiding hefty agent commissions. Your stress-free, profitable sale awaits!'
    }
  ];

  const freeListingFeatures = [
    'Property listing on SaveOnYourHome.com',
    'Up to 25 photos',
    'Detailed property description',
    'Direct buyer contact form',
    'Mobile-friendly listing page',
    'Basic analytics dashboard',
    'Share your listing on social media',
    'QR stickers for your yard sign',
    'Email support',
    'Listing stays active until sold'
  ];

  const multimediaServices = [
    {
      icon: Camera,
      title: 'Professional Photography',
      description: 'HDR photos that showcase your home in the best light'
    },
    {
      icon: Video,
      title: 'Video Walkthrough',
      description: 'Cinematic video tours that bring your property to life'
    },
    {
      icon: Box,
      title: 'Matterport 3D Tours',
      description: 'Interactive 3D tours let buyers explore every room'
    },
    {
      icon: Sun,
      title: 'Virtual Twilight',
      description: 'Transform daytime photos into stunning twilight shots'
    },
    {
      icon: Camera,
      title: 'Drone Aerial Photos',
      description: 'Showcase your property and neighborhood from above'
    },
    {
      icon: FileText,
      title: 'Floor Plans',
      description: 'Professional floor plans help buyers visualize the space'
    }
  ];

  const mlsBenefits = [
    {
      icon: Globe,
      title: 'Maximum Exposure',
      description: 'Your listing appears on Zillow, Realtor.com, Redfin, and hundreds of other sites'
    },
    {
      icon: Users,
      title: 'Agent Network',
      description: 'Reach buyers working with real estate agents across the country'
    },
    {
      icon: Eye,
      title: 'More Visibility',
      description: 'MLS listings get 10x more views than FSBO-only listings'
    },
    {
      icon: TrendingUp,
      title: 'Higher Sale Price',
      description: 'MLS exposure typically results in better offers and faster sales'
    }
  ];

  const comparisonData = [
    {
      feature: 'Listing Commission',
      saveOnYourHome: '$0',
      flatFee: '$300 - $500',
      traditional: '5-6% ($15,000+)'
    },
    {
      feature: 'Control Over Process',
      saveOnYourHome: 'Full control',
      flatFee: 'Limited support',
      traditional: 'Agent-driven'
    },
    {
      feature: 'Direct Buyer Contact',
      saveOnYourHome: 'Yes - all inquiries to you',
      flatFee: 'Varies by service',
      traditional: 'Through agent only'
    }
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const faqs = [
    {
      question: "How long does the sales process take?",
      answer: "The timeline varies depending on your local market, pricing, and property condition. Sellers who use our MLS listing service and professional media packages typically sell faster. Many of our sellers receive offers within weeks of listing."
    },
    {
      question: "How do you rate my property?",
      answer: "We provide access to AI valuation tools and connect you with local agents who can offer pricing guidance based on their expertise. You can also request a professional appraisal for an accurate written report."
    },
    {
      question: "Is listing on your platform free?",
      answer: "Yes! Creating a listing on SaveOnYourHome.com is 100% free. You can upload photos, add property details, post open houses, and receive buyer inquiries at no cost. Optional paid upgrades like MLS listing and professional photography are available."
    },
    {
      question: 'What does "find your own buyer" mean exactly?',
      answer: "Finding your own buyer means selling directly to someone without using a real estate agent as an intermediary. When you find your own buyer, you avoid paying listing agent commissions entirely, saving you thousands of dollars."
    },
    {
      question: "Can I edit my listing after it's published?",
      answer: "Yes! You can edit your listing anytime - update photos, change the price, or modify the description as needed. Your listing stays active until your property sells."
    },
    {
      question: "What happens when I receive an offer?",
      answer: "Buyers will contact you directly through our platform. You can review offers, negotiate terms, and accept the one that works best for you. We recommend consulting with an attorney for contract review."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const testimonials = [
    {
      id: 1,
      quote: "We saved over $18,000 in commission fees by listing on SaveOnYourHome.com. The entire process was so simple — we had our listing up in minutes and started getting inquiries right away. The tools and resources gave us full control over the sale.",
      name: "Sarah Mitchell",
      role: "Homeowner"
    },
    {
      id: 2,
      quote: "I was skeptical about selling without a realtor, but SaveOnYourHome made it incredibly simple. I created my listing in under 5 minutes, ordered a yard sign, and shared it on social media. Buyers reached out directly and I sold on my own terms!",
      name: "Michael Torres",
      role: "Homeowner"
    },
    {
      id: 3,
      quote: "SaveOnYourHome.com empowered us to sell our home on our own terms. The free listing, comprehensive tools, and the ability to upgrade to MLS when we were ready made all the difference. We saved thousands and felt confident throughout.",
      name: "Jennifer Adams",
      role: "Homeowner"
    }
  ];

  return (
    <>
      <Head title="Sellers - SAVEONYOURHOME" />

      {/* Hero Section */}
      <div className="relative pt-0 md:pt-[77px]">
        <div className="relative min-h-[60vh] flex items-center py-16 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/home-img.webp"
              alt="Beautiful home exterior"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full">
            <div className="max-w-3xl">
              {/* Main Heading */}
              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-5 drop-shadow-2xl"
               
              >
                Sell Your Home with<br />Confidence and Ease!
              </h1>

              {/* Subheading */}
              <p
                className="text-white text-[14px] md:text-[16px] font-medium mb-8 leading-relaxed max-w-2xl drop-shadow-lg"
               
              >
                Take control of your home sale with SaveOnYourHome.com. Benefit from commission-free savings and embark on your path to a successful sale right here.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-[0.4rem] mb-12">
                <Link
                  href="/list-property"
                  className="button inline-flex items-center gap-[0.4rem] bg-[#1A1816] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#111111]"
                 
                >
                  <span>List My Home</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_56_2205" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                      <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_56_2205)">
                      <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                    </g>
                  </svg>
                </Link>
                <Link
                  href="#services"
                  className="button inline-flex items-center gap-[0.4rem] bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-white/20"
                 
                >
                  <span>Why Choose FSBO?</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - After Hero */}
      <div className="bg-[#EEEDEA] border-b border-gray-300">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Zap className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left whitespace-nowrap">
                <div className="text-[#111] font-semibold text-base">Free Listing</div>
                <div className="text-[#666] text-sm">List for $0</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Camera className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left whitespace-nowrap">
                <div className="text-[#111] font-semibold text-base">Photos & Media</div>
                <div className="text-[#666] text-sm">Pro Quality</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left whitespace-nowrap">
                <div className="text-[#111] font-semibold text-base">MLS Access</div>
                <div className="text-[#666] text-sm">Max Exposure</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left whitespace-nowrap">
                <div className="text-[#111] font-semibold text-base">Direct Contact</div>
                <div className="text-[#666] text-sm">Talk to Buyers</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <DollarSign className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left whitespace-nowrap">
                <div className="text-[#111] font-semibold text-base">Keep Your Equity</div>
                <div className="text-[#666] text-sm">No Commissions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Sell With Us Section */}
      <section className="bg-[#EEEDEA] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                <span className="text-[#666] text-sm font-medium">
                  Why Choose FSBO?
                </span>
              </div>

              {/* Main Heading */}
              <h2
                className="text-[24px] md:text-[28px] text-[#111] font-medium leading-tight mb-6"
                style={{ fontWeight: 500 }}
              >
                Sell Your Way, Your Terms. Imagine being able to take full control of your home sale. SaveOnYourHome.com provides the tools and resources to sell your home confidently, without paying hefty broker commissions.
              </h2>

              {/* Subheading */}
              <p
                className="text-[14px] text-[#666] font-medium mb-8 leading-relaxed"
                style={{ fontWeight: 500 }}
              >
                Maximize your savings, connect directly with buyers, and experience a transparent, trust-based selling process. Empower your journey by choosing SaveOnYourHome.
              </p>

              {/* Button */}
              <Link
                href="/list-property"
                className="inline-flex items-center gap-[0.4rem] bg-[#1A1816] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#111111]"
               
              >
                <span>List Your Property</span>
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

            {/* Right Side - Image Grid */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Modern home exterior"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Luxury property"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/2816323/pexels-photo-2816323.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Beautiful home interior"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/3958958/pexels-photo-3958958.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Dream home"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Listing Section */}
      <section id="services" className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center bg-[#1A1816] rounded-lg px-4 py-2 mb-6">
                <span className="text-white text-sm font-medium">
                  FREE
                </span>
              </div>

              {/* Main Heading */}
              <h2
                className="text-[32px] md:text-[40px] text-[#111] font-medium leading-tight mb-6"
               
              >
                List Your Property for Free
              </h2>

              {/* Subheading */}
              <p
                className="text-[16px] text-[#666] font-medium mb-8 leading-relaxed"
               
              >
                Get your property in front of thousands of buyers without spending a dime.
                Our free listing includes everything you need to sell your home with confidence and ease.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {freeListingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#1A1816] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#666]">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                href="/list-property"
                className="inline-flex items-center gap-[0.4rem] bg-[#1A1816] text-white rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-[#111111]"
               
              >
                <span>Start Your Free Listing</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right Side - Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="/images/home-img-2.webp"
                  alt="House with FSBO sign and QR code"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              {/* Price Tag */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="text-[#1A1816] text-4xl font-bold">$0</div>
                <div className="text-[#666] text-sm">Forever Free</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photos & Multimedia Section */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium">
                Professional Media
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4">
              Make Your Listing Stand Out
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto">
              Professional photos sell homes faster and for more money. Our photographers
              will showcase your property in the best possible light.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {multimediaServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-[#EEEDEA] rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="bg-[#E5E1DC] p-3 rounded-xl w-fit mb-4">
                    <IconComponent className="w-6 h-6 text-[#3D3D3D]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#111] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#666] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link
              href="/our-packages"
              className="inline-flex items-center gap-2 bg-[#413936] text-white rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-[#312926]"
             
            >
              View Packages
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* MLS Access Section */}
      <section className="bg-[#EEEDEA] py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Syndication Card */}
            <div className="order-2 lg:order-1">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-6">
                  <div className="bg-[#F5F3F0] rounded-2xl p-4 mb-4 inline-block">
                    <img src="/images/saveonyourhome-logo.png" alt="SaveOnYourHome" className="h-12 w-auto" />
                  </div>
                  <h4 className="text-lg font-semibold text-[#111]">
                    Your MLS Listing
                  </h4>
                  <p className="text-sm text-[#666]">
                    Syndicates to 100+ sites automatically
                  </p>
                </div>

                <CompanyLogosGrid variant="cards" />

                <div className="mt-6 pt-6 border-t border-[#E5E1DC] text-center">
                  <p className="text-sm text-[#666]">
                    <span className="font-semibold text-[#1A1816]">+100 more</span> real estate websites
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 lg:order-2">
              {/* Badge */}
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                <span className="text-[#666] text-sm font-medium">
                  MLS Exposure
                </span>
              </div>

              {/* Main Heading */}
              <h2
                className="text-[32px] md:text-[40px] text-[#111] font-medium leading-tight mb-6"
               
              >
                Get Your Property on the MLS
              </h2>

              {/* Subheading */}
              <p
                className="text-[16px] text-[#666] font-medium mb-8 leading-relaxed"
               
              >
                The MLS (Multiple Listing Service) is where real estate agents find properties for their buyers.
                With MLS syndication, your listing appears on Zillow, Realtor.com, Redfin, and hundreds of other sites.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {mlsBenefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-white p-2 rounded-lg flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-[#1A1816]" />
                      </div>
                      <div>
                        <h4 className="text-[#111] font-medium mb-1">
                          {benefit.title}
                        </h4>
                        <p className="text-sm text-[#666]">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <Link
                href="/our-packages"
                className="inline-flex items-center gap-[0.4rem] bg-[#1A1816] text-white rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-[#111111]"
               
              >
                <span>Learn About MLS Options</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section - Save Thousands */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium">
                Save Thousands
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4">
              Compare Your Options
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto">
              See how much you can save compared to traditional real estate agents
            </p>
          </div>

          {/* Comparison Table */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              {/* Header */}
              <div className="grid grid-cols-4 gap-4 p-6 bg-[#413936]">
                <div className="text-white font-medium">
                  Feature
                </div>
                <div className="text-white font-medium text-center">
                  SaveOnYourHome
                </div>
                <div className="text-white font-medium text-center">
                  Flat Fee MLS
                </div>
                <div className="text-white font-medium text-center">
                  Traditional Agent
                </div>
              </div>

              {/* Rows */}
              {comparisonData.map((row, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-4 gap-4 p-6 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F8F7F5]'}`}
                >
                  <div className="text-[#111] font-medium">
                    {row.feature}
                  </div>
                  <div className="text-[#1A1816] font-medium text-center">
                    {row.saveOnYourHome}
                  </div>
                  <div className="text-[#666] text-center">
                    {row.flatFee}
                  </div>
                  <div className="text-[#666] text-center">
                    {row.traditional}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Steps to Getting SOLD Section */}
      <section className="bg-[#EEEDEA] py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium">
                Simple Process
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4">
              Your Step-by-Step Guide to Success
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto">
              Follow these simple steps to sell your home successfully
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300">
                    <div className="bg-[#E5E1DC] p-3 rounded-xl w-fit mb-4">
                      <IconComponent className="w-6 h-6 text-[#3D3D3D]" />
                    </div>
                    <div className="text-[#1A1816] text-sm font-medium mb-2">
                      STEP {item.step}
                    </div>
                    <h3 className="text-xl font-medium text-[#111] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#666] font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                <span className="text-[#666] text-sm font-medium">
                  Testimonials
                </span>
              </div>

              {/* Heading */}
              <h2
                className="text-[32px] md:text-[48px] font-medium text-[#111] leading-tight"
               
              >
                What Homeowners are Saying
              </h2>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#EEEDEA] rounded-2xl p-8 border border-gray-300 flex flex-col justify-between"
                style={{ minHeight: '400px' }}
              >
                <div>
                  {/* Quote */}
                  <p
                    className="text-[#111] text-[18px] font-medium leading-relaxed"
                   
                  >
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-8">
                  <h4
                    className="text-[#111] text-[18px] font-medium mb-1"
                   
                  >
                    {testimonial.name}
                  </h4>
                  <p
                    className="text-[#111] text-[14px] font-medium opacity-70"
                   
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Badge */}
          <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
            <span className="text-[#666] text-sm font-medium">
              FAQs
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Title and CTA */}
            <div>
              <h2
                className="text-[40px] md:text-[48px] font-semibold leading-[120%] text-[#111] mb-6"
               
              >
                Frequently Asked<br />Questions
              </h2>
              <p
                className="text-[14px] font-medium text-[#666] mb-10 leading-relaxed"
               
              >
                Can't find an answer to your question? Contact us, we will be happy to answer your questions.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-[0.4rem] bg-[#1A1816] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#111111]"
               
              >
                <span>Ask Questions</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_faq_btn" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: 'alpha' }}>
                    <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_faq_btn)">
                    <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                  </g>
                </svg>
              </Link>
            </div>

            {/* Right Side - FAQ Accordion */}
            <div>
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl mb-4 overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left transition-colors group"
                  >
                    <span
                      className="text-[18px] font-medium text-[#111] pr-4 transition-colors"
                     
                    >
                      {faq.question}
                    </span>
                    <div className="flex-shrink-0 transition-all duration-300">
                      <ChevronDown
                        className={`w-6 h-6 text-[#111] transition-transform duration-300 ${
                          openFaqIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {openFaqIndex === index && (
                    <div className="px-6 pb-6 pt-0">
                      <p
                        className="text-[14px] font-medium text-[#666] leading-relaxed"
                       
                      >
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#EEEDEA] py-20 border-t border-[#D0CCC7]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4">
            Ready to List Your Property?
          </h2>
          <p className="text-[16px] text-[#666] font-medium mb-8 max-w-2xl mx-auto">
            Start now, craft a captivating listing, and attract buyers effortlessly on our platform. Your selling journey is bound to be seamless and successful!
          </p>
          <Link
            href="/list-property"
            className="inline-flex items-center gap-2 bg-[#1A1816] text-white rounded-full px-8 py-4 font-medium text-lg transition-all duration-300 hover:bg-[#111111] hover:shadow-lg"
           
          >
            List My Property
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_56_2208" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_56_2208)">
                <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
              </g>
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}

// Specify MainLayout for this page to include Header and Footer
Sellers.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Sellers;

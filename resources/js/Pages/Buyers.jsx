import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, Home, DollarSign, Shield, Clock, CheckCircle, Users, ChevronRight, FileCheck, Building, Calculator, ClipboardCheck, Key, BadgeCheck, Percent, Handshake, FileText } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function Buyers() {
  const howItWorks = [
    {
      step: '01',
      title: 'Browse Properties',
      description: 'Search our comprehensive database of FSBO properties across Oklahoma. Create an account to save your favorites, set up alerts, and get notified instantly when new listings match your criteria.'
    },
    {
      step: '02',
      title: 'Contact Owners',
      description: 'Engage directly with property owners to schedule viewings, ask questions, and get honest answers. No agents, no middlemen — just real conversations with the people who know the home best.'
    },
    {
      step: '03',
      title: 'Make an Offer',
      description: 'Negotiate directly with owners on your terms and make your best offer. If you\'re financing the property, get Pre-approved first to show sellers you\'re serious and ready to close.'
    },
    {
      step: '04',
      title: 'Close the Deal',
      description: 'Work with a closing attorney or title company to finalize your purchase. Enjoy savings from avoiding agent commissions, and step into your new home with confidence. Your seamless, cost-effective purchase awaits!'
    }
  ];

  const faqs = [
    {
      question: 'Is SaveOnYourHome.com free for buyers?',
      answer: 'Yes! Browsing listings, contacting sellers, scheduling viewings, and searching for properties on SaveOnYourHome.com is completely free for buyers. We don\'t charge commissions or fees to buyers — ever.'
    },
    {
      question: 'Do I need a real estate agent to buy?',
      answer: 'No! You can buy directly from owners and save on agent commissions. Our platform makes it easy to connect with sellers, schedule viewings, and negotiate directly. However, we recommend hiring a real estate attorney to review contracts and protect your interests.'
    },
    {
      question: 'How do I schedule a viewing?',
      answer: 'Contact the property owner directly through the listing page. To arrange a viewing, message or call the seller directly using the contact information provided. A real estate agent will never contact you — you deal only with the homeowner.'
    },
    {
      question: 'Can I get financing for these properties?',
      answer: 'Absolutely! Most FSBO properties are eligible for traditional mortgages, FHA, VA, and other financing options. We recommend getting pre-approved before you start shopping so sellers know you\'re a serious, qualified buyer.'
    },
    {
      question: 'What should I know about buying directly from an owner?',
      answer: 'Buying from an owner means no agent commissions inflating the price, direct communication with someone who knows the property best, and often more room for negotiation. We recommend always getting a home inspection and consulting a real estate attorney for contract review.'
    },
    {
      question: 'How does SaveOnYourHome.com enhance my buying experience?',
      answer: 'Buyers can engage with our site 24/7, making it convenient to get detailed information about homes, schedule appointments, and search for properties that match your needs. We also introduce you to local vendors for inspections, financing, and more — creating a seamless experience.'
    }
  ];

  const buyerTips = [
    {
      icon: FileCheck,
      title: 'Get Pre-Approved First',
      description: 'Before you start house hunting, get pre-approved for financing. It takes just 15 minutes online, shows sellers you\'re a serious and qualified buyer, and helps you understand exactly what you can afford.'
    },
    {
      icon: Calculator,
      title: 'Know Your True Budget',
      description: 'Factor in property taxes, insurance, HOA fees, and maintenance costs beyond the purchase price. Your monthly housing payment should be no more than 28% of your gross income to maintain financial comfort.'
    },
    {
      icon: ClipboardCheck,
      title: 'Always Get an Inspection',
      description: 'Never skip the home inspection, even for new construction. A professional inspection can reveal hidden issues that could cost thousands to repair and gives you negotiating power with the seller.'
    },
    {
      icon: Building,
      title: 'Research the Neighborhood',
      description: 'Visit at different times of day, check school ratings, crime statistics, and future development plans. Talk to neighbors if possible. SaveOnYourHome.com connects you with local vendors who can help with every step.'
    },
    {
      icon: DollarSign,
      title: 'Don\'t Max Out Your Budget',
      description: 'Leave room for unexpected expenses and life changes. By buying directly from FSBO sellers on SaveOnYourHome.com, you\'re already saving on commission costs — put that savings toward a more comfortable financial cushion.'
    },
    {
      icon: Key,
      title: 'Understand the Contract',
      description: 'Read every line of the purchase agreement carefully. We recommend hiring a real estate attorney to review all documents before signing. Knowledge is your best protection in any real estate transaction.'
    }
  ];

  const preApprovalSteps = [
    {
      step: '01',
      title: 'Check Your Credit Score',
      description: 'Review your credit report and score. Most lenders require a minimum score of 620 for conventional loans, though FHA loans may accept lower scores.'
    },
    {
      step: '02',
      title: 'Gather Your Documents',
      description: 'Collect pay stubs, W-2s, tax returns, bank statements, and identification.'
    },
    {
      step: '03',
      title: 'Compare Lenders',
      description: 'Shop around and compare rates from at least 3 lenders. Consider banks, credit unions, and mortgage brokers for the best terms.'
    },
    {
      step: '04',
      title: 'Get Your Pre-Approval Letter',
      description: 'Once approved, you\'ll receive a letter stating your maximum loan amount. This letter is typically valid for 60-90 days.'
    }
  ];

  return (
    <>
      <Head title="Buyers - SAVEONYOURHOME" />

      {/* Hero Section */}
      <div className="relative pt-0 md:pt-[77px]">
        <div className="relative min-h-[60vh] flex items-center py-16 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/home-img-2.webp"
              alt="Beautiful home interior"
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
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Find Your Dream Home with<br />Confidence and Save!
              </h1>

              {/* Subheading */}
              <p
                className="text-white text-[14px] md:text-[16px] font-medium mb-8 leading-relaxed max-w-2xl drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Discover properties listed directly by owners on SaveOnYourHome.com. With no agent commissions inflating prices, you can afford more home for your money. Start your journey to homeownership here.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-[0.4rem] mb-12">
                <Link
                  href="/properties"
                  className="button inline-flex items-center gap-[0.4rem] bg-[#0891B2] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#0E7490]"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <Search className="w-5 h-5" />
                  <span>Browse Properties</span>
                </Link>
                <Link
                  href="#how-it-works"
                  className="button inline-flex items-center gap-[0.4rem] bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-white/20"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <span>How It Works</span>
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
                <DollarSign className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Save Thousands</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>No Agent Commissions</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Shield className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Verified Listings</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Trusted & Accurate</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Direct Contact</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Talk to Owners</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Search className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>24/7 Access</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Browse Anytime</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Clock className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Seamless Experience</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Easy & Transparent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-[#EEEDEA] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Content */}
            <div>
              {/* Main Heading */}
              <h2
                className="text-[24px] md:text-[28px] text-[#111] font-medium leading-tight mb-6"
                style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
              >
                Your Dream Home, Your Way. Eliminating commission is the easiest way to reduce costs for buyers without sacrificing quality. SaveOnYourHome.com connects you directly with FSBO sellers, giving you more control, more transparency, and more home for your money.
              </h2>

              {/* Subheading */}
              <p
                className="text-[14px] text-[#666] font-medium mb-8 leading-relaxed"
                style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
              >
                Engage with our site 24/7 to get detailed information about homes, schedule appointments, and search for properties that match your needs. Join us in revolutionizing the way homes are bought and sold.
              </p>

              {/* Button */}
              <Link
                href="/properties"
                className="inline-flex items-center gap-[0.4rem] bg-[#0891B2] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#0E7490]"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <span>View Properties</span>
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

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              How It Works
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Your journey to homeownership made simple, transparent, and cost-effective
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-[#EEEDEA] rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300">
                  <div className="text-[#0891B2] text-5xl font-medium mb-4 opacity-20" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-medium text-[#111] mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#666] font-medium leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Approval Section - Annie Mac Mortgage Integration */}
      <section className="bg-[#EEEDEA] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Get Ready to Buy
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Get Pre-Approved with Annie Mac Mortgage
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Pre-approval is the first step to becoming a competitive buyer.<br />
              It shows sellers you're serious and ready to close.
            </p>
          </div>

          {/* Pre-Approval Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {preApprovalSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300">
                  <div className="text-[#0891B2] text-5xl font-medium mb-4 opacity-20" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-medium text-[#111] mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#666] font-medium leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pre-Approval CTA Box */}
          <div className="bg-gradient-to-br from-[#0891B2] to-[#7A1628] rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-medium mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Ready to Get Pre-Approved?
                </h3>
                <p className="text-white/80 mb-6 leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Take the first step toward homeownership. Our simple online application takes just 15 minutes and won't impact your credit score.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-white/90" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Know your exact budget before you shop</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-white/90" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Show sellers you're a serious buyer</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-white/90" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Lock in your rate before it changes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-white/90" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Close faster when you find your home</span>
                  </li>
                </ul>
                <a
                  href="https://simplenexus.annie-mac.com/homehub/signup/THASSELL@ANNIE-MAC.COM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#0891B2] rounded-full px-8 py-4 font-semibold hover:bg-gray-100 transition-all duration-300"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Get Pre-Approved Now
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-5">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-lg" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Simple Online Application</p>
                    <p className="text-white/70 text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Complete from your phone or computer - no paperwork</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-5">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-lg" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>No Credit Score Impact</p>
                    <p className="text-white/70 text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Soft pull for pre-qualification, no hard inquiry</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-5">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-lg" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Personal Support</p>
                    <p className="text-white/70 text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Real loan officers ready to answer your questions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Tips Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Buyer Tips
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Smart Home Buying Tips
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Practical advice to help you navigate the home buying process with confidence and save more
            </p>
          </div>

          {/* Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyerTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <div key={index} className="bg-[#EEEDEA] rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="bg-[#E5E1DC] p-3 rounded-xl w-fit mb-4">
                    <IconComponent className="w-6 h-6 text-[#3D3D3D]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#111] mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {tip.title}
                  </h3>
                  <p className="text-sm text-[#666] font-medium leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {tip.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#EEEDEA] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Header */}
            <div>
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  FAQs
                </span>
              </div>
              <h2 className="text-[32px] md:text-[40px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Frequently Asked<br />Questions
              </h2>
              <p className="text-[16px] text-[#666] font-medium leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Have questions? We've got answers. Learn how SaveOnYourHome.com makes buying a home more accessible, transparent, and cost-effective.
              </p>
            </div>

            {/* Right Side - FAQs */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-lg font-medium text-[#111] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {faq.question}
                  </h3>
                  <p className="text-sm text-[#666] leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

// Specify MainLayout for this page to include Header and Footer
Buyers.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Buyers;

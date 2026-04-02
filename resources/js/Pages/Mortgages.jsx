import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Calculator, DollarSign, Shield, Clock, CheckCircle, ChevronRight, FileText, Home, Percent, BadgeCheck, Building2, CreditCard, PiggyBank, FileCheck, TrendingUp, HelpCircle, Info, User, Search, FileSignature, Handshake } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function Mortgages() {
  const howItWorks = [
    {
      step: '01',
      icon: Search,
      title: 'Find Your Rate',
      description: 'Instantly find the most competitive deal from over 25 lenders. Compare rates, terms, and costs side by side.'
    },
    {
      step: '02',
      icon: FileSignature,
      title: 'Get Pre-Approved',
      description: 'Complete a simple online application to receive a fast pre-approval. Show sellers you\'re a serious, qualified buyer.'
    },
    {
      step: '03',
      icon: Handshake,
      title: 'Close With Ease',
      description: 'Enjoy a streamlined closing process with digital tools and expert support every step of the way.'
    }
  ];

  const mortgageTypes = [
    {
      icon: Home,
      title: 'Conventional Loans',
      description: 'Traditional mortgages are not backed by the government. Typically require 3-20% down payment and good credit scores.',
      features: ['Competitive interest rates', 'Flexible terms (15-30 years)', 'PMI removed at 20% equity']
    },
    {
      icon: Shield,
      title: 'FHA Loans',
      description: 'Government-backed loans are ideal for first-time buyers. Lower down payment and credit requirements.',
      features: ['3.5% minimum down payment', 'Credit scores as low as 580', 'Lower closing costs']
    },
    {
      icon: BadgeCheck,
      title: 'VA Loans',
      description: 'Exclusive benefits for veterans and active military. Often, the best mortgage option available.',
      features: ['No down payment required', 'No PMI requirement', 'Competitive rates']
    },
    {
      icon: Building2,
      title: 'USDA Loans',
      description: 'Zero down payment loans for rural property buyers. Income limits apply.',
      features: ['No down payment', 'Low mortgage insurance', 'Below-market rates']
    }
  ];

  const mortgageTips = [
    {
      icon: CreditCard,
      title: 'Improve Your Credit Score',
      description: 'Pay down debts, avoid new credit inquiries, and dispute any errors on your credit report before applying for a mortgage.'
    },
    {
      icon: PiggyBank,
      title: 'Save for Down Payment',
      description: 'Aim for 20% down to avoid PMI, but many programs allow as little as 3% down. Don\'t forget to factor in closing costs (2-5%).'
    },
    {
      icon: Calculator,
      title: 'Calculate Your Budget',
      description: 'Your monthly housing payment (including taxes and insurance) shouldn\'t exceed 28% of your gross monthly income.'
    },
    {
      icon: FileCheck,
      title: 'Gather Documentation',
      description: 'Prepare pay stubs, W-2s, tax returns, bank statements, and ID. Self-employed buyers need 2 years of tax returns.'
    },
    {
      icon: TrendingUp,
      title: 'Lock Your Rate',
      description: 'Once you find your rate, lock it in. Rate locks typically last 30-60 days and protect you from market fluctuations.'
    },
    {
      icon: HelpCircle,
      title: 'Ask About Assistance',
      description: 'Oklahoma offers down payment assistance programs. Ask your lender about first-time buyer programs and grants.'
    }
  ];

  const faqs = [
    {
      question: 'What credit score do I need for a mortgage?',
      answer: 'For conventional loans, most lenders require a minimum score of 620. FHA loans may accept scores as low as 580 with 3.5% down, or 500-579 with 10% down. Higher scores get better interest rates.'
    },
    {
      question: 'How much down payment do I need?',
      answer: 'It depends on the loan type. Conventional loans require 3-20% down; FHA loans require 3.5%; VA and USDA loans offer 0% down options. Putting 20% down avoids private mortgage insurance (PMI).'
    },
    {
      question: 'What\'s the difference between pre-qualification and pre-approval?',
      answer: 'Pre-qualification is an estimate based on self-reported information. Pre-approval involves a credit check and document verification, making it a more substantial commitment from the lender and more attractive to sellers.'
    },
    {
      question: 'How long does it take to get a mortgage?',
      answer: 'From application to closing typically takes 30-45 days. However, pre-approval can be completed in 1-3 days. Having all documents ready speeds up the process.'
    },
    {
      question: 'Should I get a fixed or adjustable rate?',
      answer: 'Fixed rates stay the same for the loan term, providing payment stability. Adjustable-rate mortgages (ARMs) start at a lower rate but can adjust after the initial period. Fixed is usually better if you plan to stay long-term.'
    }
  ];

  return (
    <>
      <Head title="Mortgages - SAVEONYOURHOME" />

      {/* Hero Section */}
      <div className="relative pt-0 md:pt-[77px]">
        <div className="relative min-h-[60vh] flex items-center py-16 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/7937892/pexels-photo-7937892.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Mortgage Financing - Oklahoma"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-white text-sm font-medium">
                  Powered by Annie Mac Mortgage
                </span>
              </div>

              {/* Main Heading */}
              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-5 drop-shadow-2xl"
               
              >
                Get a mortgage from<br />Annie Mac Mortgage
              </h1>

              {/* Subheading */}
              <p
                className="text-white text-[14px] md:text-[16px] font-medium mb-8 leading-relaxed max-w-2xl drop-shadow-lg"
               
              >
                SaveOnYourHome has partnered with Annie Mac Mortgage as its preferred lender. Get pre-approved in minutes, compare rates from 25+ lenders, and close with confidence—one seamless experience from home search to keys in hand.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-[0.4rem] mb-12">
                <a
                  href="https://simplenexus.annie-mac.com/homehub/signup/THASSELL@ANNIE-MAC.COM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button inline-flex items-center gap-[0.4rem] bg-[#1A1816] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#111111]"
                 
                >
                  <BadgeCheck className="w-5 h-5" />
                  <span>Get Pre-Approved</span>
                </a>
                <a
                  href="https://simplenexus.annie-mac.com/homehub/signup/THASSELL@ANNIE-MAC.COM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button inline-flex items-center gap-[0.4rem] bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-white/20"
                 
                >
                  <Calculator className="w-5 h-5" />
                  <span>Compare Rates</span>
                </a>
                <Link
                  href="#why-us"
                  className="button inline-flex items-center gap-[0.4rem] bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-white/20"
                 
                >
                  <Info className="w-5 h-5" />
                  <span>Why Annie Mac?</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - After Hero */}
      <div className="bg-[#EEEDEA] border-b border-gray-300">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 text-center">
              <div className="bg-[#1A1816]/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Percent className="w-8 h-8 text-[#1A1816]" />
              </div>
              <h3 className="text-[#111] font-semibold text-xl mb-2">25+ Lender Network</h3>
              <p className="text-[#666] text-sm leading-relaxed">Instantly find the most competitive deal from over 25 lenders in our network.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 text-center">
              <div className="bg-[#1A1816]/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-[#1A1816]" />
              </div>
              <h3 className="text-[#111] font-semibold text-xl mb-2">Get Pre-Approval</h3>
              <p className="text-[#666] text-sm leading-relaxed">Complete a simple online application to receive fast pre-approval, giving you confidence and leverage in your home search.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 text-center">
              <div className="bg-[#1A1816]/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Handshake className="w-8 h-8 text-[#1A1816]" />
              </div>
              <h3 className="text-[#111] font-semibold text-xl mb-2">Close with Ease</h3>
              <p className="text-[#666] text-sm leading-relaxed">Enjoy a streamlined closing process with digital tools and expert support, making finalizing your mortgage quick and hassle-free.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Annie Mac Mortgage Section */}
      <section id="why-us" className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center bg-[#1A1816]/10 rounded-lg px-4 py-2 mb-6">
                <span className="text-[#1A1816] text-sm font-semibold">
                  Annie Mac Mortgage
                </span>
              </div>

              {/* Main Heading */}
              <h2
                className="text-[28px] md:text-[36px] text-[#111] font-medium leading-tight mb-6"
                style={{ fontWeight: 500 }}
              >
                Why use Annie Mac Mortgage?
              </h2>

              {/* Description */}
              <p
                className="text-[16px] text-[#666] font-medium mb-8 leading-relaxed"
                style={{ fontWeight: 500 }}
              >
                When you find your dream home on SaveOnYourHome, getting financing shouldn't slow you down. Annie Mac Mortgage is our preferred mortgage partner, providing you with a seamless home-buying experience from start to finish.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#1A1816] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#111]">Affordability</h4>
                    <p className="text-sm text-[#666]">Services and tools that make buying a home affordable for you.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#1A1816] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#111]">Low Price</h4>
                    <p className="text-sm text-[#666]">Competitive pricing from our marketplace of top lenders.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#1A1816] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#111]">Marketplace</h4>
                    <p className="text-sm text-[#666]">Thousands of home financing options that can fit your needs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#1A1816] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#111]">Oklahoma Focused</h4>
                    <p className="text-sm text-[#666]">Local expertise with knowledge of Oklahoma-specific programs and assistance.</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <a
                href="https://simplenexus.annie-mac.com/homehub/signup/THASSELL@ANNIE-MAC.COM"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1A1816] text-white rounded-full px-6 py-4 font-medium hover:bg-[#111111] transition-all duration-300"
               
              >
                Start Your Application
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            {/* Right Side - Card */}
            <div className="bg-gradient-to-br from-[#1A1816] to-[#7A1628] rounded-3xl p-8 md:p-10 text-white">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                  <Home className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-medium mb-3">
                  Ready to Get Pre-Approved?
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  It only takes 15 minutes
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Simple Online Application</p>
                    <p className="text-white/70 text-sm">Complete from your phone or computer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Secure & Confidential</p>
                    <p className="text-white/70 text-sm">Bank-level encryption protects your data</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Personal Support</p>
                    <p className="text-white/70 text-sm">Real humans available to help you</p>
                  </div>
                </div>
              </div>

              <a
                href="https://simplenexus.annie-mac.com/homehub/signup/THASSELL@ANNIE-MAC.COM"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-[#1A1816] text-center py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300"
               
              >
                Get Pre-Approved Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mortgage Rates Today Section */}
      <section id="rates" className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium">
                Compare Rates
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4">
              Mortgage Rates Today
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-3xl mx-auto mb-8">
              We search thousands of loan options so you don't have to! Find the most competitive rates including: 15, 20 and 30-year fixed rates, 10/6, 7/6 and 5/6 ARMs, FHA, Jumbo, low down payment options and more.
            </p>
            <a
              href="https://simplenexus.annie-mac.com/homehub/signup/THASSELL@ANNIE-MAC.COM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1A1816] text-white rounded-full px-6 py-3 font-medium hover:bg-[#111111] transition-all duration-300"
             
            >
              <TrendingUp className="w-5 h-5" />
              View Today's Live Rates
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium">
                Simple Process
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4">
              How It Works
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto">
              Get from application to closing in three simple steps
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {howItWorks.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-[#EEEDEA] rounded-2xl p-8 h-full hover:shadow-lg transition-all duration-300 text-center">
                    <div className="bg-[#1A1816] p-4 rounded-full w-16 h-16 mx-auto mb-5 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-[#1A1816] text-sm font-semibold mb-2">
                      STEP {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-[#111] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#666] font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ChevronRight className="w-8 h-8 text-[#D0CCC7]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <a
              href="https://simplenexus.annie-mac.com/homehub/signup/THASSELL@ANNIE-MAC.COM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1A1816] text-white rounded-full px-8 py-4 font-medium hover:bg-[#111111] transition-all duration-300"
             
            >
              Get Pre-Approved with Annie Mac
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Mortgage Types Section */}
      <section id="mortgage-types" className="bg-[#EEEDEA] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium">
                Loan Options
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4">
              Types of Mortgages
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto">
              Choose the right loan type for your situation. Each has unique benefits and requirements.
            </p>
          </div>

          {/* Mortgage Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mortgageTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-[#E5E1DC] p-3 rounded-xl">
                      <IconComponent className="w-6 h-6 text-[#3D3D3D]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-[#111] mb-2">
                        {type.title}
                      </h3>
                      <p className="text-sm text-[#666] leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-[60px]">
                    {type.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#1A1816] flex-shrink-0" />
                        <span className="text-sm text-[#666]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Oklahoma Programs Box */}
          <div className="bg-white rounded-2xl p-8 md:p-10 mt-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-medium text-[#111] mb-4">
                  Oklahoma Assistance Programs
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#1A1816] flex-shrink-0 mt-0.5" />
                    <span className="text-[#666]">OHFA (Oklahoma Housing Finance Agency) first-time buyer programs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#1A1816] flex-shrink-0 mt-0.5" />
                    <span className="text-[#666]">Down payment assistance up to 3.5% of the loan amount</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#1A1816] flex-shrink-0 mt-0.5" />
                    <span className="text-[#666]">Homebuyer education classes that unlock special rates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#1A1816] flex-shrink-0 mt-0.5" />
                    <span className="text-[#666]">Teacher, police, and firefighter home purchase programs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#1A1816] flex-shrink-0 mt-0.5" />
                    <span className="text-[#666]">Rural development loans with no down payment required</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-[#1A1816] to-[#7A1628] rounded-xl p-6 text-white">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                    <BadgeCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">
                    Get Pre-Approved with Annie Mac
                  </h4>
                  <p className="text-sm text-white/80 mb-4">
                    Our preferred mortgage team understands Oklahoma programs and FSBO transactions. Let us help you get the best rate.
                  </p>
                  <a
                    href="https://simplenexus.annie-mac.com/homehub/signup/THASSELL@ANNIE-MAC.COM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-[#1A1816] rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-gray-100"
                   
                  >
                    Start Application
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mortgage Tips Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium">
                Expert Advice
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4">
              Mortgage Tips
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto">
              Innovative strategies to get the best mortgage terms and save money over the life of your loan
            </p>
          </div>

          {/* Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mortgageTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <div key={index} className="bg-[#EEEDEA] rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="bg-[#E5E1DC] p-3 rounded-xl w-fit mb-4">
                    <IconComponent className="w-6 h-6 text-[#3D3D3D]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#111] mb-3">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-[#666] font-medium leading-relaxed">
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
                <span className="text-[#666] text-sm font-medium">
                  FAQs
                </span>
              </div>
              <h2 className="text-[32px] md:text-[40px] font-medium text-[#111] mb-4">
                Mortgage Questions<br />Answered
              </h2>
              <p className="text-[16px] text-[#666] font-medium leading-relaxed">
                Common questions about home financing, answered simply. Still have questions? Contact us for personalized guidance.
              </p>
            </div>

            {/* Right Side - FAQs */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-lg font-medium text-[#111] mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-[#666] leading-relaxed">
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
Mortgages.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Mortgages;

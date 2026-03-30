import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { HelpCircle, ChevronDown, Home, DollarSign, Users, FileText } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="bg-[#DCD8D5] rounded-2xl mb-4 overflow-hidden transition-all duration-300">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left transition-colors group"
      >
        <span
          style={{ fontFamily: '"Instrument Sans", sans-serif' }}
          className="text-[18px] font-medium text-[#111] pr-4 transition-colors"
        >
          {question}
        </span>
        <div className="flex-shrink-0 transition-all duration-300">
          <ChevronDown
            className={`w-6 h-6 text-[#111] transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-0 animate-fadeIn">
          <p
            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
            className="text-[14px] font-medium text-[#666] leading-relaxed"
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: Home,
      faqs: [
        {
          question: "What is SaveOnYourHome?",
          answer: "SaveOnYourHome was created to simplify the sale of private residential properties. Our team is made up of experienced professionals who share a passion for technology and real estate. We empower FSBO sellers with comprehensive free tools while enhancing the buyer experience — making home buying and selling more accessible, transparent, and cost-effective for everyone."
        },
        {
          question: "How do I get started listing my property?",
          answer: "Simply click on 'List Your Property' button, create a free account, and follow our step-by-step listing process. You'll add property details, upload photos, set your price, and your listing will be live within minutes."
        },
        {
          question: "Do I need to be a licensed realtor to use SaveOnYourHome?",
          answer: "No, you don't need any license or real estate experience. SaveOnYourHome is specifically designed for homeowners who want to sell their property themselves. We provide all the guidance and tools you need."
        },
        {
          question: "What areas does SaveOnYourHome serve?",
          answer: "We serve all of Oklahoma, including major cities like Oklahoma City, Tulsa, Norman, Broken Arrow, Edmond, and all surrounding areas. We also connect buyers and sellers with local vendors in their community, creating a seamless experience for everyone involved."
        }
      ]
    },
    {
      title: 'Pricing & Fees',
      icon: DollarSign,
      faqs: [
        {
          question: "How much does it cost to list my property?",
          answer: "Unlike other platforms, we don't charge commissions or fees. Our basic listing is completely FREE forever. We're committed to providing free and comprehensive services to FSBO homeowners who list their homes on our site. Optional premium packages are available for additional marketing exposure."
        },
        {
          question: "Are there any hidden fees?",
          answer: "Absolutely not. We believe in complete transparency. Our free listing is truly free with no hidden charges. Premium features are clearly priced upfront, and you only pay for what you choose to use."
        },
        {
          question: "How much money can I save by selling FSBO?",
          answer: "Eliminating commission is the easiest way to maximize sales proceeds for sellers without increasing cost for buyers. Traditional commissions range from 5-6% of your home's sale price. On a $300,000 home, that's $15,000-$18,000. By selling with SaveOnYourHome, owners increase their profits while buyers can simultaneously reduce their costs and afford more property."
        },
        {
          question: "Do I need to offer a buyer's agent commission?",
          answer: "While not required, offering a buyer's agent commission (typically 2.5-3%) can significantly increase your property's exposure since many buyers work with agents. You decide what commission, if any, to offer."
        }
      ]
    },
    {
      title: 'Listings & Marketing',
      icon: FileText,
      faqs: [
        {
          question: "What is an MLS flat-fee listing?",
          answer: "An MLS flat-fee listing is a service that allows you to list your property on the Multiple Listing Service (MLS) for a one-time flat fee instead of paying a percentage-based commission to a traditional real estate agent. This gives you access to thousands of potential buyers through the MLS while saving significantly on commission costs."
        },
        {
          question: "Will my listing appear on Zillow, Trulia, and Realtor.com?",
          answer: "Yes! With our MLS integration package, your listing will automatically syndicate to major real estate websites including Zillow, Trulia, Realtor.com, and many others, giving your property maximum exposure."
        },
        {
          question: "How long does my listing stay active?",
          answer: "Your listing stays active until you sell your property or choose to remove it. There are no time limits on our free listings. Premium MLS listings typically run for 6 months and can be renewed."
        },
        {
          question: "Can I edit my listing after it's published?",
          answer: "Yes! You have complete control over your listing and can update details, change photos, adjust pricing, or modify any information at any time through your account dashboard."
        },
        {
          question: "What photos should I include in my listing?",
          answer: "Include at least 10-15 high-quality photos showing exterior views, all main rooms, kitchen, bathrooms, special features, and outdoor spaces. Good lighting and clean, decluttered spaces make the best impression. We also offer professional photography services."
        }
      ]
    },
    {
      title: 'Selling Process',
      icon: Users,
      faqs: [
        {
          question: "How do buyers contact me about my property?",
          answer: "Buyers can engage with our site 24/7 and contact you directly through the contact form on your listing. You'll receive inquiries via phone, email, or through our messaging system. No agents will intercept your communication — you deal directly with interested buyers on your schedule."
        },
        {
          question: "Can I schedule and conduct showings myself?",
          answer: "Yes! You have complete control over showings. You can schedule them at times that work for you and show the property yourself. Many sellers find this gives them the opportunity to highlight their home's best features directly to potential buyers."
        },
        {
          question: "What happens when I receive an offer?",
          answer: "When you receive an offer, you can review it and choose to accept, reject, or counter. You can find many of the forms on the Oklahoma Real Estate Commission's website. You may also contact M&T Realty Group, which offers à la carte real estate services."
        },
        {
          question: "How long does it typically take to sell a FSBO property?",
          answer: "Sale times vary based on pricing, location, condition, and market conditions. Properties listed on the MLS and priced competitively typically sell within 30-90 days. Proper pricing, good photos, and being responsive to inquiries are key to a quick sale."
        },
        {
          question: "What paperwork do I need to sell my home?",
          answer: "You'll need a purchase agreement, seller's disclosure form, title documents, and closing documents. You can find many of the forms on the Oklahoma Real Estate Commission's website. You may also contact M&T Realty Group, which offers à la carte real estate services."
        }
      ]
    }
  ];

  return (
    <>
      <Head title="Frequently Asked Questions - SAVEONYOURHOME" />

      {/* Hero Section */}
      <div className="relative pt-0 md:pt-[77px]">
        <div className="relative min-h-[60vh] flex items-center py-16 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/home-img-2.webp"
              alt="FAQ"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-lg px-4 py-2 mb-6">
                <HelpCircle className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Help Center
                </span>
              </div>

              {/* Main Heading */}
              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-5 drop-shadow-2xl"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Frequently Asked Questions
              </h1>

              {/* Subheading */}
              <p
                className="text-white text-[14px] md:text-[16px] font-medium mb-8 leading-relaxed max-w-2xl drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Find answers to common questions about buying and selling homes through SaveOnYourHome.com. We're here to make real estate more accessible, transparent, and cost-effective. Can't find what you're looking for? Contact our support team.
              </p>

              {/* CTA Button */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#0891B2] text-white rounded-full px-6 py-4 font-medium transition-all duration-300 hover:bg-[#0E7490] hover:shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <span>Contact Support</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_faq_hero" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: 'alpha' }}>
                    <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"></rect>
                  </mask>
                  <g mask="url(#mask0_faq_hero)">
                    <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"></path>
                  </g>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Categories Section */}
      {faqCategories.map((category, categoryIndex) => {
        const IconComponent = category.icon;
        return (
          <section
            key={categoryIndex}
            className={categoryIndex % 2 === 0 ? "bg-white py-16 md:py-20" : "bg-[#EEEDEA] py-16 md:py-20"}
          >
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
              {/* Category Header */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                  <IconComponent className="w-4 h-4 text-[#666]" />
                  <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {category.title}
                  </span>
                </div>
                <h2
                  className="text-[32px] md:text-[48px] font-medium text-[#111] leading-tight"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {category.title}
                </h2>
              </div>

              {/* FAQ Items */}
              <div className="max-w-4xl">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = `${categoryIndex}-${faqIndex}`;
                  return (
                    <FAQItem
                      key={globalIndex}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openIndex === globalIndex}
                      onClick={() => toggleFAQ(globalIndex)}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* Still Have Questions CTA */}
      <section className="bg-[#0891B2] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <h2
            className="text-white text-[32px] md:text-[48px] font-medium mb-4"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Still Have Questions?
          </h2>
          <p
            className="text-white/90 text-[16px] font-medium mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Whether you're a seller looking for a better way or a buyer seeking a seamless experience, our team is here to help. Get in touch and we'll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0891B2] rounded-full px-8 py-4 font-medium transition-all duration-300 hover:bg-white/90"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Contact Us
            </Link>
            <Link
              href="/list-property"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white rounded-full px-8 py-4 font-medium transition-all duration-300 hover:bg-white/10"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// Specify MainLayout for this page to include Header and Footer
FAQs.layout = (page) => <MainLayout>{page}</MainLayout>;

export default FAQs;

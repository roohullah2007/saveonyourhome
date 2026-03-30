import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

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
        <div className={`flex-shrink-0 transition-all duration-300`}>
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

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Free Listing",
      question: "Is SaveOnYourHome.com free?",
      answer: "Yes! Unlike other platforms, we don't charge commissions or fees. Listing your property is completely free — no hidden charges, no strings attached. We're committed to providing free and comprehensive services to FSBO homeowners. Optional premium upgrades like MLS listing and professional photography are available."
    },
    {
      category: "Free Listing",
      question: "How long does the sales process take?",
      answer: "The timeline varies depending on your local market, pricing, and property condition. However, sellers who use our MLS listing service and professional media packages typically sell faster. Many of our sellers receive offers within weeks of listing."
    },
    {
      category: "Free Listing",
      question: "Is listing on your platform free?",
      answer: "Absolutely! Creating a listing on SaveOnYourHome.com is 100% free. You can upload photos, add property details, post open houses, and receive buyer inquiries at no cost. Optional paid upgrades like MLS listing and professional photography are available if you want even more exposure."
    },
    {
      category: "Selling",
      question: "How much can I save by selling without an agent?",
      answer: "Eliminating commission is the easiest way to maximize sales proceeds for sellers without increasing cost for buyers. A typical seller saves $27,000 based on a $450,000 sales price. Owners increase their profits while buyers can simultaneously reduce their costs and afford more property."
    },
    {
      category: "Selling",
      question: "Do I need a real estate agent to sell my home?",
      answer: "No! SaveOnYourHome.com provides the most comprehensive suite of FREE services to FSBO sellers — from listing creation and buyer communication to yard signs and professional photography. We empower you to handle the entire process on your own terms while buyers enjoy a seamless, transparent experience."
    },
    {
      category: "MLS",
      question: "Why should I list on the MLS?",
      answer: "Listing on the MLS dramatically increases your chances of getting your house sold faster. Your property gets syndicated to Zillow, Realtor.com, Redfin, Trulia, and hundreds of other sites, reaching thousands of potential buyers and their agents."
    },
    {
      category: "MLS",
      question: "Can I cancel my MLS listing at any time?",
      answer: "Yes. You can cancel your listing at any time if you are not under contract with an agent representing a buyer."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#EEEDEA] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Badge */}
        <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
          <span style={{ fontFamily: '"Instrument Sans", sans-serif' }} className="text-[#666] text-sm font-medium">
            FAQs
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Title and CTA */}
          <div>
            <h2
              className="text-[48px] font-semibold leading-[120%] text-[#111] mb-6"
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
            >
              Frequently Asked<br />Questions
            </h2>
            <p
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
              className="text-[14px] font-medium text-[#666] mb-10 leading-relaxed"
            >
              Can't find an answer to your question? Contact us, we'll be happy to help. We've provided answers to the most common questions about buying and selling homes, our free listing platform, and how SaveOnYourHome.com is revolutionizing real estate.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-[0.4rem] bg-[#0891B2] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#0E7490]"
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
            >
              <span>Ask Questions</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_faq_btn" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: 'alpha' }}>
                  <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"></rect>
                </mask>
                <g mask="url(#mask0_faq_btn)">
                  <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"></path>
                </g>
              </svg>
            </Link>
          </div>

          {/* Right Side - FAQ Accordion */}
          <div>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

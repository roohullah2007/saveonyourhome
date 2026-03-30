import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`rounded-2xl mb-3 overflow-hidden transition-all duration-300 border ${
      isOpen ? 'bg-white border-[#0891B2]/15 shadow-md shadow-[#0891B2]/5' : 'bg-white border-gray-200/60 hover:border-gray-300/80'
    }`}>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left transition-colors group"
      >
        <span className="text-[16px] font-inter font-semibold text-[#111] pr-4 transition-colors tracking-[-0.01em]">
          {question}
        </span>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-[#0891B2] rotate-180' : 'bg-[#F5F4F1] group-hover:bg-[#EEEDEA]'
        }`}>
          <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${
            isOpen ? 'text-white' : 'text-gray-500'
          }`} />
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 pt-0">
          <p className="text-[14px] font-inter text-gray-500 leading-[1.75]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [sectionRef, isVisible] = useScrollReveal();

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
    <section className="bg-[#F5F4F1] py-20 md:py-28">
      <div
        ref={sectionRef}
        className={`max-w-[1280px] mx-auto px-4 sm:px-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Badge */}
        <div className="inline-flex items-center bg-[#0891B2]/[0.08] rounded-full px-4 py-1.5 mb-8">
          <span className="text-[#0891B2] text-[13px] font-inter font-semibold tracking-wide uppercase">
            FAQs
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left Side - Title and CTA */}
          <div>
            <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-inter font-bold leading-[1.15] text-[#111] mb-6 tracking-[-0.03em]">
              Frequently Asked<br />Questions
            </h2>
            <p className="text-[15px] font-inter text-gray-500 mb-10 leading-[1.75]">
              Can't find an answer to your question? Contact us, we'll be happy to help. We've provided answers to the most common questions about buying and selling homes, our free listing platform, and how SaveOnYourHome.com is revolutionizing real estate.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 bg-[#0891B2] text-white rounded-full px-7 py-3.5 font-inter font-semibold text-[14px] transition-all duration-300 hover:bg-[#0E7490] hover:shadow-lg hover:shadow-[#0891B2]/20 hover:-translate-y-[1px]"
            >
              <span>Ask Questions</span>
              <ArrowRight className="w-4 h-4" />
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

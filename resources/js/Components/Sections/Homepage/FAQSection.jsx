import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`rounded-2xl mb-3 overflow-hidden transition-all duration-300 border ${
      isOpen ? 'bg-white border-[#1A1816]/15 shadow-md shadow-[#1A1816]/5' : 'bg-white border-gray-200/60 hover:border-gray-300/80'
    }`}>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left transition-colors group"
      >
        <span className="text-[16px] font-semibold text-[#111] pr-4 transition-colors tracking-[-0.01em]">
          {question}
        </span>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-[#1A1816] rotate-180' : 'bg-[#F5F4F1] group-hover:bg-[#EEEDEA]'
        }`}>
          <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${
            isOpen ? 'text-white' : 'text-gray-500'
          }`} />
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 pt-0">
          <p className="text-[15px] text-gray-500 leading-[1.75]">
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
      question: "Is SaveOnYourHome.com free?",
      answer: "Yes! Unlike other platforms, we don't charge commissions or fees. Listing your property is completely free — no hidden charges, no strings attached. We're committed to providing free and comprehensive services to FSBO homeowners."
    },
    {
      question: "How long does the sales process take?",
      answer: "The timeline varies depending on your local market, pricing, and property condition. Many of our sellers receive offers within weeks of listing. Our platform gives you maximum exposure to help sell your home faster."
    },
    {
      question: "Is listing on your platform free?",
      answer: "Absolutely! Creating a listing on SaveOnYourHome.com is 100% free. You can upload photos, add property details, post open houses, and receive buyer inquiries at no cost. There are no hidden fees or commissions."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
      <div
        ref={sectionRef}
        className={`mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ maxWidth: '1400px' }}
      >
        <div className="mb-4">
          <span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100, 100, 100)' }}>
            FREQUENTLY ASKED QUESTIONS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left Side - Title and CTA */}
          <div>
            <h2
              className="text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px] mb-6"
              style={{ fontWeight: 700, color: 'rgb(26, 24, 22)' }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-[15px] text-gray-500 mb-10 leading-[1.75]">
              Can't find an answer to your question? Contact us, we will be happy to answer your questions.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: 'rgb(26, 24, 22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}
            >
              Ask Questions
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

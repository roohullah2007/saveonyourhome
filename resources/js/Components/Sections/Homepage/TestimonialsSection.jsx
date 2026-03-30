import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      company: "SaveOnYourHome Seller",
      companyIcon: "okc",
      quote: "We saved over $18,000 in commission fees by listing on SaveOnYourHome.com. The platform empowered us to sell on our own terms — we had our listing up in minutes, connected directly with buyers, and the comprehensive tools gave us full control from start to finish.",
      name: "Sarah Mitchell",
      role: "Homeowner",
      avatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      id: 2,
      company: "Tulsa Property Seller",
      companyIcon: "tulsa",
      quote: "I was skeptical about selling without a realtor, but SaveOnYourHome made it incredibly simple. The free listing, marketing tools, and direct buyer communication changed everything. No commissions, no middlemen — just a transparent process that saved me thousands!",
      name: "Michael Torres",
      role: "Homeowner",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      id: 3,
      company: "Norman Home Buyer",
      companyIcon: "norman",
      quote: "As a buyer, I found my dream home through SaveOnYourHome.com. The 24/7 access to detailed listings, direct contact with the homeowner, and zero agent pressure made the experience seamless. We saved on costs and got more home for our money!",
      name: "Jennifer Adams",
      role: "Home Buyer",
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200"
    }
  ];

  const maxSlide = testimonials.length - 1;

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Testimonials
              </span>
            </div>

            {/* Heading */}
            <h2
              className="text-[40px] md:text-[48px] font-medium text-[#111] leading-tight"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              What Homeowners are Saying
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-3">
            <button
              onClick={prevSlide}
              className="bg-white hover:bg-gray-100 p-3 rounded-full shadow transition-all duration-300"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="bg-white hover:bg-gray-100 p-3 rounded-full shadow transition-all duration-300"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="overflow-hidden">
          <div 
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * (518 + 24)}px)` }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#EEEDEA] rounded-2xl p-8 border border-gray-300 flex-shrink-0"
                style={{ width: '518px', height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  {/* Quote */}
                  <p
                    className="text-[#111] text-[20px] font-medium leading-relaxed"
                    style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
                  >
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-8">
                  <h4
                    className="text-[#111] text-[20px] font-medium mb-1"
                    style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
                  >
                    {testimonial.name}
                  </h4>
                  <p
                    className="text-[#111] text-[16px] font-medium opacity-70"
                    style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
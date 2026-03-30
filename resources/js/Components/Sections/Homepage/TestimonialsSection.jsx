import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(518);

  const testimonials = [
    {
      id: 1,
      quote: "We saved over $18,000 in commission fees by listing on SaveOnYourHome.com. The platform empowered us to sell on our own terms — we had our listing up in minutes, connected directly with buyers, and the comprehensive tools gave us full control from start to finish.",
      name: "Sarah Mitchell",
      role: "Homeowner",
      avatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      id: 2,
      quote: "I was skeptical about selling without a realtor, but SaveOnYourHome made it incredibly simple. The free listing, marketing tools, and direct buyer communication changed everything. No commissions, no middlemen — just a transparent process that saved me thousands!",
      name: "Michael Torres",
      role: "Homeowner",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      id: 3,
      quote: "As a buyer, I found my dream home through SaveOnYourHome.com. The 24/7 access to detailed listings, direct contact with the homeowner, and zero agent pressure made the experience seamless. We saved on costs and got more home for our money!",
      name: "Jennifer Adams",
      role: "Home Buyer",
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      id: 4,
      quote: "The professional photography package transformed our listing. Within two weeks of upgrading our photos, we had three serious offers. SaveOnYourHome's tools and support made the entire FSBO process feel effortless.",
      name: "David & Lisa Park",
      role: "Homeowners",
      avatar: "https://images.pexels.com/photos/5378700/pexels-photo-5378700.jpeg?auto=compress&cs=tinysrgb&w=200"
    }
  ];

  // Calculate responsive card width
  useEffect(() => {
    const updateWidth = () => {
      if (sliderRef.current) {
        const containerWidth = sliderRef.current.offsetWidth;
        if (window.innerWidth < 640) {
          setCardWidth(containerWidth - 16);
        } else if (window.innerWidth < 1024) {
          setCardWidth(Math.min(480, containerWidth - 48));
        } else {
          setCardWidth(Math.min(520, (containerWidth - 24) / 2));
        }
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const gap = 24;
  const maxSlide = testimonials.length - 1;

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between mb-12 md:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center bg-[#0891B2]/[0.08] rounded-full px-4 py-1.5 mb-5">
              <span className="text-[#0891B2] text-[13px] font-inter font-semibold tracking-wide uppercase">
                Testimonials
              </span>
            </div>
            <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-inter font-bold text-[#111] leading-[1.15] tracking-[-0.03em]">
              What Homeowners are Saying
            </h2>
            <p className="text-[15px] text-gray-500 font-inter mt-3 max-w-md leading-[1.7]">
              Real stories from real people who saved thousands selling their homes.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-2.5">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="bg-white hover:bg-[#0891B2] p-3 rounded-full shadow-md border border-gray-100 transition-all duration-300 group disabled:opacity-40 disabled:hover:bg-white"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-white group-disabled:group-hover:text-gray-600 transition-colors" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === maxSlide}
              className="bg-white hover:bg-[#0891B2] p-3 rounded-full shadow-md border border-gray-100 transition-all duration-300 group disabled:opacity-40 disabled:hover:bg-white"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white group-disabled:group-hover:text-gray-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="overflow-hidden" ref={sliderRef}>
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              gap: `${gap}px`,
              transform: `translateX(-${currentSlide * (cardWidth + gap)}px)`
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#F5F4F1] rounded-3xl p-7 sm:p-9 border border-gray-200/60 flex-shrink-0 flex flex-col justify-between relative overflow-hidden group hover:border-gray-300/80 transition-all duration-300"
                style={{ width: `${cardWidth}px`, minHeight: '400px' }}
              >
                {/* Decorative quote icon */}
                <div className="absolute top-6 right-8 opacity-[0.06]">
                  <Quote className="w-20 h-20 sm:w-24 sm:h-24 text-[#0891B2]" />
                </div>

                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-5 sm:mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-[#111] text-[15px] sm:text-[17px] md:text-[18px] font-inter font-medium leading-[1.7] tracking-[-0.01em]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-7 sm:mt-8 flex items-center gap-4 relative z-10">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                  />
                  <div>
                    <h4 className="text-[#111] text-[15px] sm:text-[16px] font-inter font-semibold tracking-[-0.01em]">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-[13px] sm:text-[14px] font-inter">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentSlide === index ? 'w-8 bg-[#0891B2]' : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

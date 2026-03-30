import React from 'react';
import { BookOpen } from 'lucide-react';

const InsightsArticlesSection = () => {
  const articles = [
    {
      id: 1,
      date: 'January 15, 2025',
      title: "Maximizing Your Home's Value: Top Tips for FSBO Sellers",
      image: 'https://images.pexels.com/photos/8469939/pexels-photo-8469939.jpeg?auto=compress&cs=tinysrgb&w=1200',
      link: '#'
    },
    {
      id: 2,
      date: 'January 10, 2025',
      title: 'Why For Sale By Owner is the Future of Home Selling',
      image: 'https://images.pexels.com/photos/7578894/pexels-photo-7578894.jpeg?auto=compress&cs=tinysrgb&w=1200',
      link: '#'
    }
  ];

  return (
    <section className="bg-[#EEEDEA] py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
      {/* Tag */}
      <div className="inline-flex items-center gap-2 bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
        <BookOpen className="w-4 h-4 text-[#666]" />
        <span style={{ fontFamily: '"Instrument Sans", sans-serif' }} className="text-[#666] text-sm font-medium">
          Resources & Tips
        </span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
        {/* Title */}
        <h2 className="max-w-[600px]">
          Learn from home selling experts
        </h2>

        {/* Description & Buttons */}
        <div className="flex flex-col items-start lg:items-end gap-6">
          <p
            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
            className="text-[14px] font-medium text-[#666] max-w-[400px] text-left lg:text-right"
          >
            Get expert tips, market insights, and practical advice to help you successfully sell your home without paying realtor commissions.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex items-center gap-[0.4rem] bg-[#413936] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#312926]"
              href="/list-property"
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
            >
              <span>List Your Property</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_56_2205" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: 'alpha' }}>
                  <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"></rect>
                </mask>
                <g mask="url(#mask0_56_2205)">
                  <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"></path>
                </g>
              </svg>
            </a>

            <a
              className="inline-flex items-center gap-[0.4rem] bg-transparent border border-[#D0CCC7] text-[#111] rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#E5E1DC]"
              href="/properties"
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
            >
              <span>Browse Properties</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_56_2206" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: 'alpha' }}>
                  <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"></rect>
                </mask>
                <g mask="url(#mask0_56_2206)">
                  <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="currentColor"></path>
                </g>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {articles.map((article) => (
          <div key={article.id} className="flex flex-col">
            {/* Image */}
            <div className="w-full h-[480px] mb-6 overflow-hidden rounded-2xl">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Date */}
            <p
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
              className="text-sm text-[#413936] mb-3"
            >
              {article.date}
            </p>

            {/* Title */}
            <h3
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
              className="text-2xl font-semibold text-[#111] mb-6 leading-[130%]"
            >
              {article.title}
            </h3>

            {/* Read Article Button */}
            <a
              href={article.link}
              className="group relative w-[159px] inline-flex items-center gap-2 overflow-hidden"
            >
              <div className="relative h-6 overflow-hidden">
                <div
                  style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                  className="absolute transition-transform duration-400 ease-[cubic-bezier(0.645,0.045,0.355,1)] group-hover:-translate-y-full text-[#413936] font-medium"
                >
                  Read Article
                </div>
                <div
                  style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                  className="absolute translate-y-full transition-transform duration-400 ease-[cubic-bezier(0.645,0.045,0.355,1)] group-hover:translate-y-0 text-[#413936] font-medium"
                >
                  Read Article
                </div>
              </div>
              <span className="text-[#413936] text-lg transition-transform duration-400 group-hover:translate-x-1 inline-block" aria-hidden="true">&rarr;</span>
            </a>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default InsightsArticlesSection;

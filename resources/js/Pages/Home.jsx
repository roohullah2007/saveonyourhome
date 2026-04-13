import React from 'react';
import SEOHead from '@/Components/SEOHead';
import HeroSection from '@/Components/Sections/Homepage/HeroSection';
import ShowcaseSection from '@/Components/Sections/Homepage/ShowcaseSection';
import SellingSection from '@/Components/Sections/Homepage/SellingSection';
import PropertiesSection from '@/Components/Sections/Homepage/PropertiesSection';
import CTACardsSection from '@/Components/Sections/Homepage/MLSSection';
import FAQSection from '@/Components/Sections/Homepage/FAQSection';

export default function Home({ featuredProperties = [] }) {
  return (
    <>
      <SEOHead
        title="Sell Your Home For Free"
        description="SaveOnYourHome is the #1 FSBO platform. List your home for free, connect with buyers directly, and save thousands in commission fees. No hidden costs."
        keywords="FSBO, for sale by owner, sell home free, no commission, free home listing, real estate, SaveOnYourHome"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'SaveOnYourHome',
          url: typeof window !== 'undefined' ? window.location.origin : '',
          description: 'Sell your home for free with SaveOnYourHome. No commissions, no hidden fees.',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: (typeof window !== 'undefined' ? window.location.origin : '') + '/properties?search={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/* Hero Section */}
      <HeroSection featuredProperties={featuredProperties} />

      {/* FSBO Resources & Support Section */}
      <ShowcaseSection />

      {/* How It Works / Supercharge Your Sale */}
      <SellingSection />

      {/* Properties Section */}
      <PropertiesSection properties={featuredProperties} />

      {/* Guides & CTA Cards */}
      <CTACardsSection />

      {/* FAQ Section */}
      <FAQSection />
    </>
  );
}

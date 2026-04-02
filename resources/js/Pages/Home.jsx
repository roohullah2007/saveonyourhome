import React from 'react';
import { Head } from '@inertiajs/react';
import HeroSection from '@/Components/Sections/Homepage/HeroSection';
import ShowcaseSection from '@/Components/Sections/Homepage/ShowcaseSection';
import SellingSection from '@/Components/Sections/Homepage/SellingSection';
import PropertiesSection from '@/Components/Sections/Homepage/PropertiesSection';
import MLSSection from '@/Components/Sections/Homepage/MLSSection';
import FAQSection from '@/Components/Sections/Homepage/FAQSection';

export default function Home({ featuredProperties = [] }) {
  return (
    <>
      <Head title="Home - SaveOnYourHome" />

      {/* Hero Section */}
      <HeroSection featuredProperties={featuredProperties} />

      {/* FSBO Resources & Support Section */}
      <ShowcaseSection />

      {/* How It Works / Supercharge Your Sale */}
      <SellingSection />

      {/* Properties Section */}
      <PropertiesSection properties={featuredProperties} />

      {/* Guides & CTA Cards */}
      <MLSSection />

      {/* FAQ Section */}
      <FAQSection />
    </>
  );
}

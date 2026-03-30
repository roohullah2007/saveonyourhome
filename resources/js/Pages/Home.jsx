import React from 'react';
import { Head } from '@inertiajs/react';
import HeroSection from '@/Components/Sections/Homepage/HeroSection';
import ShowcaseSection from '@/Components/Sections/Homepage/ShowcaseSection';
import HowItWorksSection from '@/Components/Sections/Homepage/HowItWorksSection';
import SellingSection from '@/Components/Sections/Homepage/SellingSection';
import ServicesSection from '@/Components/Sections/Homepage/ServicesSection';
import PropertiesSection from '@/Components/Sections/Homepage/PropertiesSection';
import MLSSection from '@/Components/Sections/Homepage/MLSSection';
import TestimonialsSection from '@/Components/Sections/Homepage/TestimonialsSection';
import CTABannerSection from '@/Components/Sections/Homepage/CTABannerSection';
import FAQSection from '@/Components/Sections/Homepage/FAQSection';

export default function Home({ featuredProperties = [] }) {
  return (
    <>
      <Head title="Home - SaveOnYourHome" />

      {/* Hero Section */}
      <HeroSection />

      {/* FSBO Resources & Support Section */}
      <ShowcaseSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Supercharge Your Sale */}
      <SellingSection />

      {/* Services Section - Multimedia */}
      <ServicesSection />

      {/* MLS Section */}
      <MLSSection />

      {/* Properties Section */}
      <PropertiesSection properties={featuredProperties} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Banner */}
      <CTABannerSection />

      {/* FAQ Section */}
      <FAQSection />
    </>
  );
}

import React from 'react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function TermsOfUse() {
  return (
    <>
      <SEOHead
        title="Terms of Use"
        description="Review the terms of use for SaveOnYourHome. Understand the rules and guidelines for using our FSBO real estate platform."
        noindex={true}
      />

      {/* Hero Section */}
      <div className="relative">
        <div className="bg-[#EEEDEA] py-12 md:py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[40px]">
            <h1
              className="text-[44px] md:text-[61px] font-medium text-[#111] leading-tight"
             
            >
              Terms of Use
            </h1>
            <p
              className="text-[18px] md:text-[20px] text-[#666] mt-4"
             
            >
              Last updated: January 6, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16 md:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[40px]">
          <div className="max-w-4xl">
            {/* Agreement to Terms */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Agreement to Terms
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed mb-4"
               
              >
                These Terms of Use ("Terms") constitute a legally binding agreement between you and SAVEONYOURHOME ("Company," "we," "us," or "our") concerning your access to and use of the saveonyourhome.com website and all related services.
              </p>
              <p
                className="text-[17px] text-[#666] leading-relaxed"
               
              >
                By accessing or using our website and services, you agree that you have read, understood, and agree to be bound by these Terms. If you do not agree with these Terms, you must discontinue use immediately.
              </p>
            </section>

            {/* Eligibility */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Eligibility
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed"
               
              >
                You must be at least 18 years old to use our services. By using our website, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms. If you are using our services on behalf of an entity, you represent that you have the authority to bind that entity to these Terms.
              </p>
            </section>

            {/* Services Description */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Services Description
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed mb-4"
               
              >
                SAVEONYOURHOME provides an online platform that allows property owners in Oklahoma to:
              </p>
              <ul className="list-disc list-inside text-[17px] text-[#666] leading-relaxed space-y-2 ml-4">
                <li>List properties for sale by owner (FSBO)</li>
                <li>Order professional multimedia services including photography, drone footage, 3D tours, and video walkthroughs</li>
                <li>Connect with potential buyers</li>
                <li>Access resources and tools for selling real estate</li>
              </ul>
              <p
                className="text-[17px] text-[#666] leading-relaxed mt-4"
               
              >
                We do not act as a real estate broker or agent. We provide a platform and tools to facilitate For Sale By Owner transactions.
              </p>
            </section>

            {/* User Accounts */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                User Accounts
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed mb-4"
               
              >
                To access certain features, you must create an account. When creating an account, you agree to:
              </p>
              <ul className="list-disc list-inside text-[17px] text-[#666] leading-relaxed space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
              <p
                className="text-[17px] text-[#666] leading-relaxed mt-4"
               
              >
                We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our discretion.
              </p>
            </section>

            {/* Property Listings */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Property Listings
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed mb-4"
               
              >
                When listing a property on our platform, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside text-[17px] text-[#666] leading-relaxed space-y-2 ml-4">
                <li>You are the legal owner of the property or authorized to list it</li>
                <li>All information provided is accurate and truthful</li>
                <li>The property is legally available for sale</li>
                <li>Photos and descriptions accurately represent the property</li>
                <li>You will comply with all applicable real estate laws and regulations</li>
              </ul>
              <p
                className="text-[17px] text-[#666] leading-relaxed mt-4"
               
              >
                We reserve the right to remove any listing that violates these Terms or contains inaccurate, misleading, or inappropriate content.
              </p>
            </section>


            {/* Multimedia Services */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Multimedia Services
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed mb-4"
               
              >
                We offer professional multimedia services including photography, drone footage, video walkthroughs, Matterport 3D tours, and virtual twilight. By ordering these services:
              </p>
              <ul className="list-disc list-inside text-[17px] text-[#666] leading-relaxed space-y-2 ml-4">
                <li>You agree to provide access to the property at the scheduled time</li>
                <li>You grant us the right to use the media for promotional purposes</li>
                <li>Turnaround times are estimates and not guaranteed</li>
                <li>Rescheduling may be subject to additional fees</li>
                <li>Weather-dependent services (drone) may require rescheduling</li>
              </ul>
            </section>

            {/* Payments and Refunds */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Payments and Refunds
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed mb-4"
               
              >
                Payment terms:
              </p>
              <ul className="list-disc list-inside text-[17px] text-[#666] leading-relaxed space-y-2 ml-4">
                <li>All prices are in US dollars</li>
                <li>Payment is due at the time of the service order</li>
                <li>We accept major credit cards and other payment methods, as displayed</li>
                <li>Refund requests must be submitted within 14 days of purchase</li>
                <li>Completed services are non-refundable</li>
                <li>Cancellations made less than 24 hours before scheduled service may incur fees</li>
              </ul>
            </section>

            {/* Prohibited Activities */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Prohibited Activities
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed mb-4"
               
              >
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-[17px] text-[#666] leading-relaxed space-y-2 ml-4">
                <li>Use the service for any illegal purpose</li>
                <li>Post false, misleading, or fraudulent listings</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated systems to scrape or collect data</li>
                <li>Interfere with the proper functioning of the website</li>
                <li>Impersonate another person or entity</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Intellectual Property
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed mb-4"
               
              >
                The SAVEONYOURHOME name, logo, website design, and all content created by us are our intellectual property and protected by copyright and trademark laws. You may not use, reproduce, or distribute our intellectual property without written permission.
              </p>
              <p
                className="text-[17px] text-[#666] leading-relaxed"
               
              >
                You retain ownership of content you submit (property photos, descriptions, etc.) but grant us a non-exclusive license to use, display, and distribute such content in connection with our services.
              </p>
            </section>

            {/* Disclaimer of Warranties */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Disclaimer of Warranties
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed mb-4"
               
              >
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT YOUR PROPERTY WILL SELL OR THAT YOU WILL RECEIVE A SPECIFIC PRICE.
              </p>
              <p
                className="text-[17px] text-[#666] leading-relaxed"
               
              >
                We are not responsible for the actions of buyers, sellers, or other users of our platform. We do not verify the accuracy of listings or the identity of users.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Limitation of Liability
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed"
               
              >
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SAVEONYOURHOME SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OUR SERVICES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE MONTHS PRECEDING THE CLAIM.
              </p>
            </section>

            {/* Indemnification */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Indemnification
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed"
               
              >
                You agree to indemnify, defend, and hold harmless SAVEONYOURHOME and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorney's fees) arising from your use of our services, violation of these Terms, or infringement of any third-party rights.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Governing Law
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed"
               
              >
                These Terms shall be governed by and construed in accordance with the laws of the State of Oklahoma, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts located in Oklahoma County, Oklahoma.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Changes to Terms
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed"
               
              >
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website with a new "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Contact Us */}
            <section className="mb-12">
              <h2
                className="text-[26px] md:text-[30px] font-medium text-[#111] mb-4"
               
              >
                Contact Us
              </h2>
              <p
                className="text-[17px] text-[#666] leading-relaxed mb-4"
               
              >
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-[#EEEDEA] rounded-xl p-6">
                <p className="text-[17px] text-[#111] font-medium mb-2">
                  SAVEONYOURHOME
                </p>
                <p className="text-[17px] text-[#666]">
                  Email: info@saveonyourhome.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

TermsOfUse.layout = page => <MainLayout children={page} />;

export default TermsOfUse;

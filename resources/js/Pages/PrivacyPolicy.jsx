import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

function PrivacyPolicy() {
  return (
    <>
      <Head title="Privacy Policy - SAVEONYOURHOME" />

      {/* Hero Section */}
      <div className="relative pt-0 md:pt-[77px]">
        <div className="bg-[#EEEDEA] py-16 md:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <h1
              className="text-[40px] md:text-[56px] font-medium text-[#111] leading-tight"
             
            >
              Privacy Policy
            </h1>
            <p
              className="text-[16px] md:text-[18px] text-[#666] mt-4"
             
            >
              Last updated: January 6, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16 md:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-4xl">
            {/* Introduction */}
            <section className="mb-12">
              <h2
                className="text-[24px] md:text-[28px] font-medium text-[#111] mb-4"
               
              >
                Introduction
              </h2>
              <p
                className="text-[15px] text-[#666] leading-relaxed mb-4"
               
              >
                SAVEONYOURHOME ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website saveonyourhome.com and use our services.
              </p>
              <p
                className="text-[15px] text-[#666] leading-relaxed"
               
              >
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <h2
                className="text-[24px] md:text-[28px] font-medium text-[#111] mb-4"
               
              >
                Information We Collect
              </h2>

              <h3
                className="text-[18px] font-medium text-[#111] mb-3 mt-6"
               
              >
                Personal Information
              </h3>
              <p
                className="text-[15px] text-[#666] leading-relaxed mb-4"
               
              >
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-[15px] text-[#666] leading-relaxed space-y-2 ml-4">
                <li>Register for an account</li>
                <li>List a property for sale</li>
                <li>Submit an inquiry about a property</li>
                <li>Request multimedia services (photography, 3D tours, etc.)</li>
                <li>Contact us through our contact forms</li>
                <li>Subscribe to our newsletter</li>
              </ul>
              <p
                className="text-[15px] text-[#666] leading-relaxed mt-4"
               
              >
                This information may include your name, email address, phone number, mailing address, property details, and payment information.
              </p>

              <h3
                className="text-[18px] font-medium text-[#111] mb-3 mt-6"
               
              >
                Automatically Collected Information
              </h3>
              <p
                className="text-[15px] text-[#666] leading-relaxed"
               
              >
                When you access our website, we may automatically collect certain information about your device, including your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the site.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-12">
              <h2
                className="text-[24px] md:text-[28px] font-medium text-[#111] mb-4"
               
              >
                How We Use Your Information
              </h2>
              <p
                className="text-[15px] text-[#666] leading-relaxed mb-4"
               
              >
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-[15px] text-[#666] leading-relaxed space-y-2 ml-4">
                <li>Create and manage your account</li>
                <li>Process property listings and facilitate real estate transactions</li>
                <li>Provide multimedia services you request</li>
                <li>Send you important information regarding your account and listings</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our website and services</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </section>

            {/* SMS/Text Communications */}
            <section className="mb-12">
              <h2
                className="text-[24px] md:text-[28px] font-medium text-[#111] mb-4"
               
              >
                SMS/Text Communications
              </h2>
              <p
                className="text-[15px] text-[#666] leading-relaxed mb-4"
               
              >
                If you opt in to receive text messages, we may send SMS messages to the phone number you provide regarding your property listing, buyer inquiries, and service updates. Message frequency varies. Message and data rates may apply.
              </p>
              <p
                className="text-[15px] text-[#666] leading-relaxed mb-4"
               
              >
                You can opt out at any time by replying STOP to any message. After opting out, you will no longer receive text messages from us. Reply HELP for help or contact us at hello@saveonyourhome.com.
              </p>
              <p
                className="text-[15px] text-[#666] leading-relaxed"
               
              >
                Carriers are not liable for delayed or undelivered messages. Your consent to receive text messages is not a condition of purchasing any goods or services.
              </p>
            </section>

            {/* Sharing Your Information */}
            <section className="mb-12">
              <h2
                className="text-[24px] md:text-[28px] font-medium text-[#111] mb-4"
               
              >
                Sharing Your Information
              </h2>
              <p
                className="text-[15px] text-[#666] leading-relaxed mb-4"
               
              >
                We may share your information in the following situations:
              </p>
              <ul className="list-disc list-inside text-[15px] text-[#666] leading-relaxed space-y-2 ml-4">
                <li><strong>With MLS Services:</strong> If you opt for an MLS listing, your property information will be shared with the Multiple Listing Service and syndicated to partner websites like Zillow, Realtor.com, and Redfin.</li>
                <li><strong>With Service Providers:</strong> We may share information with third-party vendors who provide services such as photography, payment processing, and data analytics.</li>
                <li><strong>With Potential Buyers:</strong> Your contact information may be shared with interested buyers who inquire about your listed property.</li>
                <li><strong>For Legal Purposes:</strong> We may disclose information when required by law or to protect our rights and safety.</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <h2
                className="text-[24px] md:text-[28px] font-medium text-[#111] mb-4"
               
              >
                Data Security
              </h2>
              <p
                className="text-[15px] text-[#666] leading-relaxed"
               
              >
                We implement appropriate technical and organizational security measures to protect your personal information. However, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            {/* Cookies */}
            <section className="mb-12">
              <h2
                className="text-[24px] md:text-[28px] font-medium text-[#111] mb-4"
               
              >
                Cookies and Tracking Technologies
              </h2>
              <p
                className="text-[15px] text-[#666] leading-relaxed mb-4"
               
              >
                We may use cookies, web beacons, and other tracking technologies to collect information about your browsing activities. You can set your browser to refuse cookies, but some features of our website may not function properly without them.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-12">
              <h2
                className="text-[24px] md:text-[28px] font-medium text-[#111] mb-4"
               
              >
                Your Rights
              </h2>
              <p
                className="text-[15px] text-[#666] leading-relaxed mb-4"
               
              >
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-[15px] text-[#666] leading-relaxed space-y-2 ml-4">
                <li>Access and receive a copy of your personal information</li>
                <li>Correct inaccurate personal information</li>
                <li>Request the deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent where applicable</li>
              </ul>
              <p
                className="text-[15px] text-[#666] leading-relaxed mt-4"
               
              >
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            {/* Third-Party Links */}
            <section className="mb-12">
              <h2
                className="text-[24px] md:text-[28px] font-medium text-[#111] mb-4"
               
              >
                Third-Party Links
              </h2>
              <p
                className="text-[15px] text-[#666] leading-relaxed"
               
              >
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-12">
              <h2
                className="text-[24px] md:text-[28px] font-medium text-[#111] mb-4"
               
              >
                Children's Privacy
              </h2>
              <p
                className="text-[15px] text-[#666] leading-relaxed"
               
              >
                Our services are not intended for individuals under 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will delete it.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section className="mb-12">
              <h2
                className="text-[24px] md:text-[28px] font-medium text-[#111] mb-4"
               
              >
                Changes to This Privacy Policy
              </h2>
              <p
                className="text-[15px] text-[#666] leading-relaxed"
               
              >
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            {/* Contact Us */}
            <section className="mb-12">
              <h2
                className="text-[24px] md:text-[28px] font-medium text-[#111] mb-4"
               
              >
                Contact Us
              </h2>
              <p
                className="text-[15px] text-[#666] leading-relaxed mb-4"
               
              >
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-[#EEEDEA] rounded-xl p-6">
                <p className="text-[15px] text-[#111] font-medium mb-2">
                  SAVEONYOURHOME
                </p>
                <p className="text-[15px] text-[#666]">
                  Email: privacy@saveonyourhome.com
                </p>
                <p className="text-[15px] text-[#666]">
                  Phone: 888-441-6526
                </p>
                <p className="text-[15px] text-[#666]">
                  Address: 1611 S Utica Ave #515, Tulsa, OK 74104
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

PrivacyPolicy.layout = page => <MainLayout children={page} />;

export default PrivacyPolicy;

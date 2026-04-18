import React from 'react';
import SEOHead from '@/Components/SEOHead';
import HeroBadge from '@/Components/HeroBadge';
import MainLayout from '@/Layouts/MainLayout';

function HonorPledge() {
  const sections = [
    {
      title: 'Partnership and Collaboration',
      bullets: [
        'We will actively support the vision and goals of SaveOnYourHome.com, contributing positively to the platform and its community of homeowners and buyers.',
        'We believe in mutual success and will work collaboratively with SaveOnYourHome.com to create value for all parties involved.',
      ],
    },
    {
      title: 'Commitment to Users',
      bullets: [
        'We will always prioritize the needs and interests of SaveOnYourHome.com users, ensuring our products and services genuinely benefit them.',
        'We pledge to provide honest, accurate, and helpful information, avoiding any misleading claims or deceptive practices.',
      ],
    },
    {
      title: 'Quality and Integrity',
      bullets: [
        'We commit to maintaining the highest standards of quality in every product and service we offer through the SaveOnYourHome.com platform.',
        'We will conduct our business with integrity, ensuring ethical practices in all our interactions and transactions.',
      ],
    },
    {
      title: 'Feedback and Improvement',
      bullets: [
        'We will actively seek and be receptive to feedback from SaveOnYourHome.com users, using it as a valuable tool for continuous improvement.',
        'We understand and support the ratings system on SaveOnYourHome.com, recognizing it as a mechanism to maintain high standards and accountability.',
        'We are committed to constructive improvement and will take meaningful steps to address any concerns or issues raised by users or the platform.',
      ],
    },
    {
      title: 'Compliance and Transparency',
      bullets: [
        'We will adhere to all applicable laws, regulations, and guidelines relevant to our industry and the services we provide.',
        'We pledge transparency in our business practices, including pricing, terms of service, and any potential conflicts of interest.',
      ],
    },
    {
      title: 'Community and Long-Term Relationship',
      bullets: [
        'We view ourselves as responsible members of the SaveOnYourHome.com community and will act in ways that strengthen and uplift this community.',
        'We are committed to building a long-term, trust-based relationship with SaveOnYourHome.com and its users, understanding that lasting partnerships are built on consistent, positive actions.',
      ],
    },
  ];

  return (
    <>
      <SEOHead
        title="Advertiser & Sponsor Honor Pledge"
        description="Read the SaveOnYourHome Advertiser and Sponsor Honor Pledge. Our partners commit to trust, integrity, quality, and collaboration to serve the FSBO community."
        noindex={true}
      />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Advertiser and Sponsor Honor Pledge"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            height: '200px',
            background:
              'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)',
          }}
        />
        <div className="relative flex flex-col h-full">
          <div
            className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]"
            style={{ maxWidth: '1400px', width: '100%' }}
          >
            <div className="w-full max-w-[650px]">
              <HeroBadge>OUR COMMITMENT</HeroBadge>
              <h1
                className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white"
                style={{ letterSpacing: '-0.5px' }}
              >
                Advertiser & Sponsor{' '}
                <span
                  style={{
                    background:
                      'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Honor Pledge
                </span>
              </h1>
              <p
                className="mt-5"
                style={{
                  fontSize: '19px',
                  lineHeight: '30px',
                  color: 'rgba(255,255,255,0.75)',
                  maxWidth: '560px',
                }}
              >
                At SaveOnYourHome.com we believe in fostering a community of
                trust and integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div
          className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20"
          style={{ maxWidth: '1400px' }}
        >
          {/* Intro */}
          <div className="max-w-4xl mb-12">
            <p className="text-[17px] text-[#666] leading-relaxed">
              As an advertiser or sponsor on SaveOnYourHome.com, we understand
              the importance of maintaining a trustworthy and beneficial
              environment for all users. We hereby pledge to uphold the
              following principles in our partnership with SaveOnYourHome.com:
            </p>
          </div>

          {/* Pledge Sections */}
          <div className="grid gap-8 max-w-4xl">
            {sections.map((section, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200/60 p-8"
                style={{
                  background: 'rgba(255,255,255,0.65)',
                  backdropFilter: 'blur(16px)',
                  boxShadow:
                    'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background:
                        'linear-gradient(135deg, #1A1816 0%, #333 100%)',
                    }}
                  >
                    <span
                      className="text-white font-bold"
                      style={{ fontSize: '17px' }}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[22px] md:text-[24px] font-medium text-[#111] mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.bullets.map((bullet, bIndex) => (
                        <li key={bIndex} className="flex items-start gap-3">
                          <div
                            className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"
                          />
                          <span className="text-[17px] text-[#666] leading-relaxed">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Closing Statement */}
          <div className="max-w-4xl mt-12">
            <div
              className="rounded-2xl border border-gray-200/60 p-8"
              style={{
                background: 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(16px)',
                boxShadow:
                  'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset',
              }}
            >
              <p className="text-[17px] text-[#111] leading-relaxed font-medium">
                By signing this Honor Pledge, we affirm our commitment to
                uphold these principles and work collaboratively with
                SaveOnYourHome.com to transform the FSBO real estate market.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

HonorPledge.layout = (page) => <MainLayout>{page}</MainLayout>;

export default HonorPledge;

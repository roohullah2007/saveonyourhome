import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

const defaultResources = [
  {
    title: 'Secure Your Dream Home: The Power of a Pre-Approval in Home Buying',
    excerpt:
      'Learn why getting pre-approved is one of the most important first steps in the home buying process and how it gives you a competitive edge.',
  },
  {
    title: 'Transforming Real Estate: The SaveOnYourHome.com Difference',
    excerpt:
      'Discover how SaveOnYourHome.com is changing the way buyers and sellers connect, saving thousands in commissions along the way.',
  },
  {
    title: 'Market Updates: FSBO Insights and Opportunities',
    excerpt:
      'Stay informed with the latest trends in the FSBO market and find out how to take advantage of current opportunities.',
  },
  {
    title: 'Why Buyers Love FSBO Homes: A Deep Dive',
    excerpt:
      'Explore the benefits of buying directly from homeowners, from cost savings to more transparent negotiations.',
  },
];

function BuyerResources({ resources }) {
  const items =
    resources && resources.length > 0
      ? resources
      : defaultResources;

  return (
    <>
      <SEOHead
        title="Buyer Resources"
        description="Unlock your path to homeownership with our concise resources. Designed for all buyers, our tools cover contracts, articles, and forms."
        keywords="buyer resources, home buying guide, FSBO buyer tips, home buying tools, SaveOnYourHome buyer help"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img
          src="https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Buyer Resources"
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
            <div className="w-full max-w-[600px]">
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5"
                style={{
                  border: '1px solid rgba(156,163,175,0.25)',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px',
                }}
              >
                <div
                  className="h-2 w-2 rounded-full bg-emerald-400"
                  style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }}
                />
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  BUYER RESOURCES
                </span>
              </div>
              <h1
                className="text-[26px] leading-[34px] sm:text-[36px] sm:leading-[44px] lg:text-[46px] lg:leading-[56px] font-extrabold text-white"
                style={{ letterSpacing: '-0.5px' }}
              >
                Your Home Buying{' '}
                <span
                  style={{
                    background:
                      'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Hub!
                </span>
              </h1>
              <p
                className="mt-5"
                style={{
                  fontSize: '17px',
                  lineHeight: '28px',
                  color: 'rgba(255,255,255,0.75)',
                  maxWidth: '480px',
                }}
              >
                Unlock your path to homeownership with our concise resources.
                Designed for all buyers, our tools cover contracts, articles, and
                forms. Happy browsing!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div
          className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20"
          style={{ maxWidth: '1400px' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200/60 p-8"
                style={{
                  background: 'rgba(255,255,255,0.65)',
                  backdropFilter: 'blur(16px)',
                  boxShadow:
                    'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset',
                }}
              >
                <h3
                  className="mb-3"
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'rgb(26,24,22)',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="mb-6"
                  style={{
                    fontSize: '15px',
                    lineHeight: '24px',
                    color: 'rgb(100,100,100)',
                  }}
                >
                  {item.excerpt || item.description || ''}
                </p>
                {item.slug && (
                  <Link
                    href={`/resources/${item.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold"
                    style={{ color: 'rgb(26,24,22)' }}
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Buyers Guide Link */}
          <div className="mt-12 text-center">
            <p
              style={{
                fontSize: '17px',
                lineHeight: '28px',
                color: 'rgb(100,100,100)',
                marginBottom: '16px',
              }}
            >
              Access our Buyers Guide here
            </p>
            <Link
              href="/buyers-guide"
              className="inline-flex items-center justify-center gap-2 rounded-full transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'rgb(26,24,22)',
                color: 'white',
                height: '46px',
                paddingLeft: '28px',
                paddingRight: '28px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Buyers Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Cards */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div
          className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20"
          style={{ maxWidth: '1400px' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="rounded-2xl border border-gray-200/60 p-8"
              style={{
                background: 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(16px)',
                boxShadow:
                  'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset',
              }}
            >
              <h3
                className="mb-3"
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'rgb(26,24,22)',
                }}
              >
                Search For Your Dream Home
              </h3>
              <p
                className="mb-6"
                style={{
                  fontSize: '15px',
                  lineHeight: '24px',
                  color: 'rgb(100,100,100)',
                }}
              >
                Browse through SaveOnYourHome to find your dream home!
              </p>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: 'rgb(26,24,22)' }}
              >
                Search Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div
              className="rounded-2xl border border-gray-200/60 p-8"
              style={{
                background: 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(16px)',
                boxShadow:
                  'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset',
              }}
            >
              <h3
                className="mb-3"
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'rgb(26,24,22)',
                }}
              >
                How to Sell Your Home By Owner
              </h3>
              <p
                className="mb-6"
                style={{
                  fontSize: '15px',
                  lineHeight: '24px',
                  color: 'rgb(100,100,100)',
                }}
              >
                Expose your property to buyers. Get offers to your inbox and
                start saving the commissions with SaveOnYourHome.
              </p>
              <Link
                href="/list-property"
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: 'rgb(26,24,22)' }}
              >
                List Your Home <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div
              className="rounded-2xl border border-gray-200/60 p-8"
              style={{
                background: 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(16px)',
                boxShadow:
                  'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset',
              }}
            >
              <h3
                className="mb-3"
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'rgb(26,24,22)',
                }}
              >
                About SaveOnYourHome.com
              </h3>
              <p
                className="mb-6"
                style={{
                  fontSize: '15px',
                  lineHeight: '24px',
                  color: 'rgb(100,100,100)',
                }}
              >
                We are Empowering Sellers and Connecting Buyers, and
                transforming the home buying process. See what we are all about!
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: 'rgb(26,24,22)' }}
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

BuyerResources.layout = (page) => <MainLayout>{page}</MainLayout>;

export default BuyerResources;

import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function ResourceDetail({ resource }) {
  const categoryLabel = () => {
    switch (resource.category) {
      case 'seller': return 'SELLER RESOURCE';
      case 'buyer': return 'BUYER RESOURCE';
      case 'blog': return 'BLOG';
      default: return 'RESOURCE';
    }
  };

  const backLink = () => {
    switch (resource.category) {
      case 'seller': return '/seller-resources';
      case 'buyer': return '/buyer-resources';
      case 'blog': return '/blog';
      default: return '/seller-resources';
    }
  };

  const heroImage = resource.image || '/images/seller-resources.webp';

  const isHtml = (str) => /<[a-z][\s\S]*>/i.test(str);

  const formattedDate = resource.published_at
    ? new Date(resource.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <>
      <SEOHead
        title={resource.title}
        description={resource.excerpt || ''}
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[300px] md:h-[350px] lg:h-[400px]">
        <img src={heroImage} alt={resource.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>{categoryLabel()}</span>
              </div>
              <h1 className="text-[26px] leading-[34px] sm:text-[36px] sm:leading-[44px] lg:text-[46px] lg:leading-[56px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                {resource.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <article className="mx-auto" style={{ maxWidth: '800px' }}>
            {formattedDate && (
              <p className="mb-8" style={{ fontSize: '14px', fontWeight: 500, color: 'rgb(100,100,100)' }}>
                Published on {formattedDate}
              </p>
            )}

            {resource.content && (
              isHtml(resource.content) ? (
                <div
                  className="prose prose-lg max-w-none"
                  style={{ fontSize: '16px', lineHeight: '28px', color: 'rgb(55,55,55)' }}
                  dangerouslySetInnerHTML={{ __html: resource.content }}
                />
              ) : (
                <div style={{ fontSize: '16px', lineHeight: '28px', color: 'rgb(55,55,55)' }}>
                  {resource.content.split('\n').filter(Boolean).map((paragraph, i) => (
                    <p key={i} className="mb-5">{paragraph}</p>
                  ))}
                </div>
              )
            )}

            {/* Back Link */}
            <div className="mt-12 pt-8 border-t border-gray-200/60">
              <Link href={backLink()} className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgb(26,24,22)' }}>
                <ArrowRight className="w-4 h-4 rotate-180" /> Back to Resources
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Bottom CTA Cards */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              <h3 className="mb-3" style={{ fontSize: '18px', fontWeight: 700, color: 'rgb(26,24,22)' }}>How to Sell Your Home By Owner</h3>
              <p className="mb-6" style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100,100,100)' }}>
                Expose your property to buyers. Get offers to your inbox and start saving the commissions with SaveOnYourHome.
              </p>
              <Link href="/list-property" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgb(26,24,22)' }}>
                List Your Home <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              <h3 className="mb-3" style={{ fontSize: '18px', fontWeight: 700, color: 'rgb(26,24,22)' }}>Search For Your Dream Home</h3>
              <p className="mb-6" style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100,100,100)' }}>
                Browse through SaveOnYourHome to find your dream home!
              </p>
              <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgb(26,24,22)' }}>
                Search Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              <h3 className="mb-3" style={{ fontSize: '18px', fontWeight: 700, color: 'rgb(26,24,22)' }}>About SaveOnYourHome.com</h3>
              <p className="mb-6" style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100,100,100)' }}>
                We are Empowering Sellers and Connecting Buyers, and transforming the home buying process. See what we are all about!
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgb(26,24,22)' }}>
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

ResourceDetail.layout = (page) => <MainLayout>{page}</MainLayout>;

export default ResourceDetail;

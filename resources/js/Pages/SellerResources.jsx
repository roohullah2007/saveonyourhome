import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

const defaultArticles = [
  { title: 'Tips for Hosting a Successful Open House', excerpt: 'Learn how to prepare your home, attract more buyers, and make a lasting impression during your open house event.' },
  { title: 'Strategies for Setting The Sales Price On Your Home', excerpt: 'Discover proven pricing strategies that help you attract serious buyers while maximizing your return on investment.' },
  { title: 'When to Hire an Attorney for Your FSBO Home Sale', excerpt: 'Understand when legal guidance is essential and how an attorney can protect your interests during a FSBO transaction.' },
  { title: 'Expert Tips for a Seamless FSBO Experience', excerpt: 'From listing to closing, get actionable advice to navigate the for-sale-by-owner process with confidence.' },
  { title: 'Maximizing Safety When Selling Your Home On Your Own', excerpt: 'Protect yourself and your property with essential safety tips for private showings and open houses.' },
  { title: 'DIY Home Photography and Staging: Tips for Cost-Conscious Sellers', excerpt: 'Capture stunning listing photos and stage your home like a pro without breaking the bank.' },
  { title: 'Selling Your Home: FSBO vs. Real Estate Agent – How to Decide', excerpt: 'Weigh the pros and cons of selling by owner versus hiring an agent to find the best path for your situation.' },
  { title: 'Avoid the Pitfalls of Selling By Owner', excerpt: 'Identify common FSBO mistakes and learn how to avoid them for a smoother, more profitable home sale.' },
];

function SellerResources({ resources = [] }) {
  const hasResources = resources.length > 0;

  return (
    <>
      <SEOHead
        title="Seller Resources"
        description="Your go-to hub for expert tips and essential tools, empowering your property sale journey. Streamline your process and maximize your profit."
        keywords="seller resources, FSBO tips, selling home by owner, home selling guide, SaveOnYourHome seller tools"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img src="/images/seller-resources.webp" alt="Seller Resources" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>SELLER RESOURCES</span>
              </div>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Seller <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Resources</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                Your go-to hub for expert tips and essential tools, empowering your property sale journey. Streamline your process and maximize your profit. Get started today!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hasResources
              ? resources.map((resource) => (
                  <Link
                    key={resource.id}
                    href={`/resources/${resource.slug}`}
                    className="group rounded-2xl border border-gray-200/60 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      {resource.image ? (
                        <img
                          src={resource.image}
                          alt={resource.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full" style={{ background: 'linear-gradient(135deg, rgb(26,24,22) 0%, rgb(60,60,60) 100%)' }} />
                      )}
                    </div>
                    <div className="p-6">
                      {resource.published_at && (
                        <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1px', color: 'rgb(140,140,140)' }}>
                          {new Date(resource.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      )}
                      <h3 className="mt-2 mb-2" style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(26,24,22)', lineHeight: '28px' }}>
                        {resource.title}
                      </h3>
                      <p className="mb-4" style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100,100,100)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {resource.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group-hover:text-emerald-600" style={{ color: 'rgb(26,24,22)' }}>
                        Read More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))
              : defaultArticles.map((article, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-gray-200/60 overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <div className="h-full w-full" style={{ background: `linear-gradient(135deg, hsl(${i * 45}, 15%, 15%) 0%, hsl(${i * 45 + 30}, 20%, 30%) 100%)` }} />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2" style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(26,24,22)', lineHeight: '28px' }}>
                        {article.title}
                      </h3>
                      <p style={{ fontSize: '15px', lineHeight: '24px', color: 'rgb(100,100,100)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-4"><span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>NEED MORE HELP?</span></div>
            <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] mb-5" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
              Our customer service team is always ready to assist you.
            </h2>
            <p style={{ fontSize: '17px', lineHeight: '28px', color: 'rgb(100,100,100)', marginBottom: '32px' }}>
              Selling by owner doesn't mean you're on your own. Get your questions answered so you can move forward with confidence.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90" style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}>
                Contact Us <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Cards */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(26,24,22)' }}>How to Sell Your Home By Owner</h3>
              <p className="mb-6" style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>
                Expose your property to buyers. Get offers to your inbox and start saving the commissions with SaveOnYourHome.
              </p>
              <Link href="/list-property" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgb(26,24,22)' }}>
                List Your Home <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(26,24,22)' }}>Search For Your Dream Home</h3>
              <p className="mb-6" style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>
                Browse through SaveOnYourHome to find your dream home!
              </p>
              <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgb(26,24,22)' }}>
                Search Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>
              <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(26,24,22)' }}>About SaveOnYourHome.com</h3>
              <p className="mb-6" style={{ fontSize: '17px', lineHeight: '26px', color: 'rgb(100,100,100)' }}>
                We are Empowering Sellers and Connecting Buyers, and transforming the home buying process. See what we are all about!
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgb(26,24,22)' }}>
                Learn More <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

SellerResources.layout = (page) => <MainLayout>{page}</MainLayout>;

export default SellerResources;

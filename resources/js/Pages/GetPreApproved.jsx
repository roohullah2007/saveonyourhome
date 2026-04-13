import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function GetPreApproved() {
  const { flash } = usePage().props;
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const { data, setData, post, processing, errors, reset, transform } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    property_type: '',
    property_use: '',
    credit: '',
    loan_type: '',
  });

  transform((data) => ({
    name: `${data.first_name} ${data.last_name}`.trim(),
    email: data.email,
    phone: data.phone,
    subject: 'Pre-Approval Request',
    message: `Property Type: ${data.property_type}\nProperty Use: ${data.property_use}\nCredit: ${data.credit}\nLoan Type: ${data.loan_type}`,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('contact.store'), {
      onSuccess: () => {
        reset();
        setCurrentStep(1);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      },
    });
  };

  const steps = [1, 2, 3, 4];

  const selectStyle = {
    height: '48px',
    fontSize: '15px',
    color: 'rgb(26,24,22)',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  };

  return (
    <>
      <SEOHead
        title="Get Pre-Approved"
        description="Get pre-approved for your mortgage with SaveOnYourHome.com. Connect with licensed mortgage bankers for priority service and a free pre-approval letter."
        keywords="mortgage pre-approval, home loan, pre-approval letter, mortgage lender, home financing"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px]">
        <img src="https://images.pexels.com/photos/7821486/pexels-photo-7821486.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Get pre-approved for your mortgage" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>MORTGAGE</span>
              </div>
              <h1 className="text-[26px] leading-[34px] sm:text-[36px] sm:leading-[44px] lg:text-[46px] lg:leading-[56px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Get Pre-Approved For <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Loan!</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                The team at SaveOnYourHome.com recommends that you strengthen your offer by obtaining a pre-approval letter from a licensed mortgage banker.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20 text-center" style={{ maxWidth: '1400px' }}>
          <p className="mx-auto mb-4" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgb(100,100,100)', maxWidth: '700px' }}>
            We are happy to connect you with a lender who will provide you with priority service and a free pre-approval.
          </p>
          <p className="mx-auto mb-8" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgb(100,100,100)', maxWidth: '700px' }}>
            Whether you're searching for your first home or investment properties, our lenders offer a wide range of products designed to meet your needs.
          </p>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}>
            Request Pre-Approval <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Multi-Step Form Section */}
      <section style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="mb-4 text-center"><span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>PRE-APPROVAL</span></div>
          <h2 className="mb-14 text-center text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>Get pre-approved for your next mortgage.</h2>

          <div className="mx-auto" style={{ maxWidth: '640px' }}>
            <div className="rounded-2xl border border-gray-200/60 p-8" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: 'rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset' }}>

              {(submitted || flash?.success) && (
                <div className="mb-6 rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'rgb(240,253,244)', border: '1px solid rgb(187,247,208)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(22,163,74)" strokeWidth="2"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'rgb(22,101,52)' }}>Request sent successfully! We'll connect you with a lender soon.</p>
                </div>
              )}

              {/* Step Indicators */}
              <div className="flex items-center justify-center gap-3 mb-8">
                {steps.map((step) => (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-full transition-colors duration-300"
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: currentStep >= step ? 'rgb(26,24,22)' : 'rgb(229,231,235)',
                        color: currentStep >= step ? 'white' : 'rgb(156,163,175)',
                        fontSize: '13px',
                        fontWeight: 700,
                      }}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div style={{ width: '32px', height: '2px', backgroundColor: currentStep > step ? 'rgb(26,24,22)' : 'rgb(229,231,235)', borderRadius: '1px', transition: 'background-color 0.3s' }} />
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1 */}
                {currentStep === 1 && (
                  <div>
                    <label style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: 'rgb(26,24,22)', marginBottom: '8px' }}>Property Type</label>
                    <select
                      value={data.property_type}
                      onChange={(e) => setData('property_type', e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500"
                      style={selectStyle}
                    >
                      <option value="">Select property type</option>
                      <option value="Single Family">Single Family</option>
                      <option value="Condo">Condo</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Multi-Family">Multi-Family</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                )}

                {/* Step 2 */}
                {currentStep === 2 && (
                  <div>
                    <label style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: 'rgb(26,24,22)', marginBottom: '8px' }}>Property Use</label>
                    <select
                      value={data.property_use}
                      onChange={(e) => setData('property_use', e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500"
                      style={selectStyle}
                    >
                      <option value="">Select property use</option>
                      <option value="Primary Residence">Primary Residence</option>
                      <option value="Secondary Home">Secondary Home</option>
                      <option value="Investment Property">Investment Property</option>
                    </select>
                  </div>
                )}

                {/* Step 3 */}
                {currentStep === 3 && (
                  <div>
                    <label style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: 'rgb(26,24,22)', marginBottom: '8px' }}>How is your credit?</label>
                    <select
                      value={data.credit}
                      onChange={(e) => setData('credit', e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500"
                      style={selectStyle}
                    >
                      <option value="">Select credit range</option>
                      <option value="Excellent (720+)">Excellent (720+)</option>
                      <option value="Good (680-719)">Good (680-719)</option>
                      <option value="Fair (640-679)">Fair (640-679)</option>
                      <option value="Below Average (Below 640)">Below Average (Below 640)</option>
                    </select>
                  </div>
                )}

                {/* Step 4 */}
                {currentStep === 4 && (
                  <div>
                    <label style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: 'rgb(26,24,22)', marginBottom: '8px' }}>Loan Type</label>
                    <div className="flex gap-3 mb-6">
                      <button
                        type="button"
                        onClick={() => setData('loan_type', 'Purchase')}
                        className="flex-1 rounded-xl border transition-all duration-200"
                        style={{
                          height: '48px',
                          fontSize: '15px',
                          fontWeight: 600,
                          backgroundColor: data.loan_type === 'Purchase' ? 'rgb(26,24,22)' : 'white',
                          color: data.loan_type === 'Purchase' ? 'white' : 'rgb(26,24,22)',
                          borderColor: data.loan_type === 'Purchase' ? 'rgb(26,24,22)' : 'rgb(209,213,219)',
                        }}
                      >
                        Purchase
                      </button>
                      <button
                        type="button"
                        onClick={() => setData('loan_type', 'Refinance')}
                        className="flex-1 rounded-xl border transition-all duration-200"
                        style={{
                          height: '48px',
                          fontSize: '15px',
                          fontWeight: 600,
                          backgroundColor: data.loan_type === 'Refinance' ? 'rgb(26,24,22)' : 'white',
                          color: data.loan_type === 'Refinance' ? 'white' : 'rgb(26,24,22)',
                          borderColor: data.loan_type === 'Refinance' ? 'rgb(26,24,22)' : 'rgb(209,213,219)',
                        }}
                      >
                        Refinance
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>First Name *</label>
                        <input type="text" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} placeholder="First name" required className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' }} />
                        {errors.first_name && <p style={{ fontSize: '12px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.first_name}</p>}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Last Name *</label>
                        <input type="text" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} placeholder="Last name" required className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' }} />
                        {errors.last_name && <p style={{ fontSize: '12px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.last_name}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Email Address *</label>
                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="your@email.com" required className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' }} />
                        {errors.email && <p style={{ fontSize: '12px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.email}</p>}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>Phone Number</label>
                        <input type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="(555) 123-4567" className="w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500" style={{ height: '48px', fontSize: '15px', color: 'rgb(26,24,22)' }} />
                        {errors.phone && <p style={{ fontSize: '12px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.phone}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="inline-flex items-center justify-center rounded-full border border-gray-300 transition-opacity hover:opacity-80"
                      style={{ height: '46px', paddingLeft: '24px', paddingRight: '24px', fontSize: '14px', fontWeight: 600, color: 'rgb(26,24,22)' }}
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}
                    >
                      {processing ? 'Submitting...' : 'Submit Request'} <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: 'rgb(26,24,22)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-16 md:py-24 text-center" style={{ maxWidth: '1400px' }}>
          <h2 className="text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px] text-white mb-5" style={{ fontWeight: 700 }}>
            Ready to get started?
          </h2>
          <p className="mx-auto mb-8" style={{ fontSize: '15px', lineHeight: '26px', color: 'rgba(255,255,255,0.65)', maxWidth: '600px' }}>
            Take the first step toward homeownership. Our lenders are ready to help you get pre-approved.
          </p>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(255,255,255)', color: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}>
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

GetPreApproved.layout = (page) => <MainLayout>{page}</MainLayout>;

export default GetPreApproved;

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
    // Step 1
    property_type: '',
    property_use: '',
    credit: '',
    loan_type: 'Purchase',
    // Step 2
    purchase_price: '',
    down_payment: '',
    loan_amount: '',
    // Step 3
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
  });

  transform((data) => ({
    name: `${data.first_name} ${data.last_name}`.trim(),
    email: data.email,
    phone: data.phone,
    subject: 'Pre-Approval Request',
    message: [
      `Property Type: ${data.property_type}`,
      `Property Use: ${data.property_use}`,
      `Credit: ${data.credit}`,
      `Loan Type: ${data.loan_type}`,
      `Estimated Purchase Price: ${data.purchase_price}`,
      `Down Payment: ${data.down_payment}`,
      `Loan Amount: ${data.loan_amount}`,
      '',
      data.message ? `Message: ${data.message}` : '',
    ].filter(Boolean).join('\n'),
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

  const selectClass = "w-full rounded-xl border border-gray-300 bg-white px-4 outline-none transition-colors focus:border-gray-500 appearance-none";
  const selectStyle = {
    height: '57px',
    fontSize: '17px',
    color: 'rgb(26,24,22)',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
  };
  const inputClass = "w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-500";
  const inputStyle = { height: '57px', fontSize: '17px', color: 'rgb(26,24,22)' };
  const labelStyle = { display: 'block', fontSize: '17px', fontWeight: 700, color: 'rgb(26,24,22)', marginBottom: '8px' };

  return (
    <>
      <SEOHead
        title="Get Pre-Approved"
        description="Get pre-approved for your mortgage with SaveOnYourHome.com. Connect with licensed mortgage bankers for priority service and a free pre-approval letter."
        keywords="mortgage pre-approval, home loan, pre-approval letter, mortgage lender, home financing"
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden h-[400px] md:h-[450px] lg:h-[500px] dark-selection">
        <img src="https://images.pexels.com/photos/7821486/pexels-photo-7821486.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Get pre-approved" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>MORTGAGE</span>
              </div>
              <h1 className="text-[28px] leading-[37px] sm:text-[40px] sm:leading-[48px] lg:text-[50px] lg:leading-[61px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Get Pre-Approved For <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Loan!</span>
              </h1>
              <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                Strengthen your offer by obtaining a pre-approval letter from a licensed mortgage banker.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-16 text-center" style={{ maxWidth: '1400px' }}>
          <p className="mx-auto mb-4" style={{ fontSize: '18px', lineHeight: '30px', color: 'rgb(100,100,100)', maxWidth: '700px' }}>
            Whether you're searching for your first home or investment properties, our lenders offer a wide range of products designed to meet your needs.
          </p>
          <h2
            className="mt-6 text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px]"
            style={{ fontWeight: 700, color: 'rgb(26, 24, 22)' }}
          >
            Get pre-approved for your next mortgage.
          </h2>
        </div>
      </section>

      {/* 3-Step Form */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] pb-16 md:pb-24" style={{ maxWidth: '1400px' }}>
          <div className="mx-auto" style={{ maxWidth: '680px' }}>
            <div className="rounded-3xl border border-gray-200 p-8 sm:p-10" style={{ background: 'rgb(248,248,248)', boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}>

              {(submitted || flash?.success) && (
                <div className="mb-6 rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'rgb(240,253,244)', border: '1px solid rgb(187,247,208)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(22,163,74)" strokeWidth="2"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgb(22,101,52)' }}>Request sent successfully! We'll connect you with a lender soon.</p>
                </div>
              )}

              {/* Step Indicators */}
              <div className="flex items-center mb-10 px-2">
                {[1, 2, 3].map((step, i) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div
                        className="flex items-center justify-center rounded-full transition-all duration-300"
                        style={{
                          width: '40px',
                          height: '44px',
                          backgroundColor: currentStep >= step ? '#3355FF' : 'transparent',
                          border: currentStep >= step ? '2px solid #3355FF' : '2px solid rgb(200,200,200)',
                          color: currentStep >= step ? 'white' : 'rgb(180,180,180)',
                          fontSize: '17px',
                          fontWeight: 700,
                        }}
                      >
                        {step}
                      </div>
                      {step > 1 && (
                        <span style={{ fontSize: '13px', fontWeight: 600, color: currentStep >= step ? '#3355FF' : 'rgb(180,180,180)', marginTop: '4px' }}>Step</span>
                      )}
                    </div>
                    {i < 2 && (
                      <div className="flex-1 mx-2" style={{ height: '2px', backgroundColor: currentStep > step ? '#3355FF' : 'rgb(220,220,220)', marginBottom: step > 1 ? '20px' : '0', transition: 'background-color 0.3s' }} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Property Details */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label style={labelStyle}>Property Type</label>
                        <select value={data.property_type} onChange={(e) => setData('property_type', e.target.value)} className={selectClass} style={selectStyle}>
                          <option value="">Choose</option>
                          <option value="Single Family">Single Family</option>
                          <option value="Condo">Condo</option>
                          <option value="Townhouse">Townhouse</option>
                          <option value="Multi-Family">Multi-Family</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Property Use</label>
                        <select value={data.property_use} onChange={(e) => setData('property_use', e.target.value)} className={selectClass} style={selectStyle}>
                          <option value="">Choose</option>
                          <option value="Primary Residence">Primary Residence</option>
                          <option value="Secondary Home">Secondary Home</option>
                          <option value="Investment Property">Investment Property</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label style={labelStyle}>How is your credit?</label>
                        <select value={data.credit} onChange={(e) => setData('credit', e.target.value)} className={selectClass} style={selectStyle}>
                          <option value="">Choose</option>
                          <option value="Excellent (720+)">Excellent (720+)</option>
                          <option value="Good (680-719)">Good (680-719)</option>
                          <option value="Fair (640-679)">Fair (640-679)</option>
                          <option value="Below Average">Below Average</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Loan Type</label>
                        <select value={data.loan_type} onChange={(e) => setData('loan_type', e.target.value)} className={selectClass} style={selectStyle}>
                          <option value="Purchase">Purchase</option>
                          <option value="Refinance">Refinance</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Financial Details */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label style={labelStyle}>Estimated Purchase Price/Appraised Value</label>
                        <input type="text" value={data.purchase_price} onChange={(e) => setData('purchase_price', e.target.value)} placeholder="" className={inputClass} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Down Payment</label>
                        <input type="text" value={data.down_payment} onChange={(e) => setData('down_payment', e.target.value)} placeholder="" className={inputClass} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Loan Amount</label>
                      <input type="text" value={data.loan_amount} onChange={(e) => setData('loan_amount', e.target.value)} placeholder="" className={inputClass} style={{ ...inputStyle, maxWidth: '50%' }} />
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Info */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label style={labelStyle}>First Name</label>
                        <input type="text" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} required className={inputClass} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Last Name</label>
                        <input type="text" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} required className={inputClass} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required className={inputClass} style={{ ...inputStyle, maxWidth: '50%' }} />
                      {errors.email && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.email}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number</label>
                      <input type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Your Message</label>
                      <textarea value={data.message} onChange={(e) => setData('message', e.target.value)} rows={4} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-gray-500 resize-vertical" style={{ fontSize: '17px', color: 'rgb(26,24,22)' }} />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center gap-4 mt-8">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="inline-flex items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: 'rgb(120,120,130)', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}
                    >
                      Previous
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="inline-flex items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}
                    >
                      {processing ? 'Submitting...' : 'Submit'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="dark-selection" style={{ backgroundColor: '#3355FF' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-16 md:py-24 text-center" style={{ maxWidth: '1400px' }}>
          <h2 className="text-[28px] leading-[37px] sm:text-[35px] sm:leading-[44px] lg:text-[40px] lg:leading-[48px] text-white mb-5" style={{ fontWeight: 700 }}>
            Ready to get started?
          </h2>
          <p className="mx-auto mb-8" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgba(255,255,255,0.65)', maxWidth: '600px' }}>
            Take the first step toward homeownership. Our lenders are ready to help you get pre-approved.
          </p>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full transition-opacity hover:opacity-90" style={{ backgroundColor: 'rgb(255,255,255)', color: 'rgb(26,24,22)', height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600 }}>
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}

GetPreApproved.layout = (page) => <MainLayout>{page}</MainLayout>;

export default GetPreApproved;

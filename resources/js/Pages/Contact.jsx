import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import MainLayout from '@/Layouts/MainLayout';

function Contact() {
  const { flash } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('contact.store'), {
      data: {
        name: `${data.first_name} ${data.last_name}`.trim(),
        email: data.email,
        phone: data.phone,
        message: data.message,
        subject: 'Contact Form Inquiry',
      },
      onSuccess: () => {
        reset();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 6000);
      },
    });
  };

  const inputClass = 'w-full rounded-xl border border-gray-300 px-4 outline-none transition-colors focus:border-gray-800 bg-white';
  const inputStyle = { height: '52px', fontSize: '16px', color: 'rgb(26,24,22)' };
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: 500, color: 'rgb(55,65,81)', marginBottom: '6px' };

  return (
    <>
      <SEOHead
        title="Contact Us"
        description="Do you have questions or need support? Contact SaveOnYourHome — we're happy to answer your questions about selling or buying your home."
        keywords="contact SaveOnYourHome, FSBO support, real estate help"
      />

      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-14 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="max-w-3xl">
            <h1 className="text-[32px] leading-[40px] sm:text-[44px] sm:leading-[52px] lg:text-[52px] lg:leading-[60px] font-extrabold" style={{ color: 'rgb(26,24,22)', letterSpacing: '-0.5px' }}>
              Contact Us
            </h1>
            <p className="mt-5" style={{ fontSize: '19px', lineHeight: '30px', color: 'rgb(75,85,99)', maxWidth: '640px' }}>
              Do you have questions or need support? Contact us now, we will be happy to answer your questions.
            </p>
          </div>

          <div className="mt-10 grid lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-5">
              <a
                href="tel:2016960291"
                className="block rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md hover:border-gray-300"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-xl" style={{ width: '48px', height: '48px', backgroundColor: 'rgb(245,245,244)' }}>
                    <Phone className="w-6 h-6" style={{ color: 'rgb(26,24,22)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1px', color: 'rgb(107,114,128)' }}>PHONE</div>
                    <div className="mt-1" style={{ fontSize: '18px', fontWeight: 700, color: 'rgb(26,24,22)' }}>201.696.0291</div>
                  </div>
                </div>
              </a>
              <a
                href="mailto:info@saveonyourhome.com"
                className="block rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md hover:border-gray-300"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-xl" style={{ width: '48px', height: '48px', backgroundColor: 'rgb(245,245,244)' }}>
                    <Mail className="w-6 h-6" style={{ color: 'rgb(26,24,22)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1px', color: 'rgb(107,114,128)' }}>EMAIL US</div>
                    <div className="mt-1 break-all" style={{ fontSize: '18px', fontWeight: 700, color: 'rgb(26,24,22)' }}>info@saveonyourhome.com</div>
                  </div>
                </div>
              </a>
            </div>

            {/* Form */}
            <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              {(submitted || flash?.success) && (
                <div className="mb-5 rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'rgb(240,253,244)', border: '1px solid rgb(187,247,208)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(22,163,74)" strokeWidth="2"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p style={{ fontSize: '15px', fontWeight: 500, color: 'rgb(22,101,52)' }}>Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>First Name *</label>
                    <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} required className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name *</label>
                    <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} required className={inputClass} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required className={inputClass} style={inputStyle} />
                  {errors.email && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.email}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputClass} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea value={data.message} onChange={e => setData('message', e.target.value)} required rows={5} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-gray-800 resize-none bg-white" style={{ fontSize: '16px', color: 'rgb(26,24,22)' }} />
                  {errors.message && <p style={{ fontSize: '13px', color: 'rgb(239,68,68)', marginTop: '4px' }}>{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: 'rgb(26,24,22)', height: '50px', paddingLeft: '32px', paddingRight: '32px', fontSize: '15px', fontWeight: 600 }}
                >
                  {processing ? 'Sending...' : 'Send'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Contact.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Contact;

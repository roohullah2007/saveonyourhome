import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Plus, X } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import HeroBadge from '@/Components/HeroBadge';
import MainLayout from '@/Layouts/MainLayout';

function BecomePartner({ categories = [] }) {
  const { flash } = usePage().props;
  const [submitted, setSubmitted] = useState(false);
  const [serviceInput, setServiceInput] = useState('');

  const { data, setData, post, processing, errors, reset, progress } = useForm({
    name: '',
    contact_name: '',
    category: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    description: '',
    services: [],
    logo: null,
  });

  const addService = () => {
    const v = serviceInput.trim();
    if (!v) return;
    if (data.services.includes(v)) return;
    setData('services', [...data.services, v]);
    setServiceInput('');
  };

  const removeService = (s) => setData('services', data.services.filter((x) => x !== s));

  const submit = (e) => {
    e.preventDefault();
    post('/become-a-partner', {
      forceFormData: true,
      onSuccess: () => {
        reset();
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  };

  const inputCls = 'w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-500';

  return (
    <>
      <SEOHead
        title="Become a Partner"
        description="Apply to join SaveOnYourHome's trusted partner network. Reach motivated FSBO sellers and buyers — add your business, services and logo. Admin review within 2 business days."
      />

      <section className="bg-gradient-to-br from-[#1a1816] to-[#2d2a26]">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-14" style={{ maxWidth: 1400 }}>
          <nav className="flex items-center text-sm text-white/60 gap-2 mb-5">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/partners" className="hover:text-white">Partners</Link>
            <span>/</span>
            <span className="text-white">Become a Partner</span>
          </nav>
          <div className="max-w-2xl">
            <HeroBadge className="mb-4">Partner Application</HeroBadge>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Grow your business with SaveOnYourHome
            </h1>
            <p className="mt-4 text-white/75 text-lg leading-relaxed">
              Reach motivated FSBO sellers and active homebuyers. Add your business, services and logo below — our team reviews every application within 2 business days.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1400 }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="lg:col-span-1 space-y-4">
              {[
                { h: 'Targeted visibility', b: 'Appear in our partner directory and in relevant category searches.' },
                { h: 'Direct inquiries', b: 'Users can contact you straight from your partner profile.' },
                { h: 'Free to apply', b: 'No listing fees for qualified partners during our launch period.' },
                { h: 'Honor Pledge alignment', b: 'Partners commit to our transparency and consumer-first principles.' },
              ].map((f) => (
                <div key={f.h} className="rounded-2xl bg-white border border-gray-200 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5" style={{ color: '#3355FF' }} />
                    <div>
                      <div className="font-bold text-[#1a1816] text-sm">{f.h}</div>
                      <div className="text-sm text-gray-600 mt-1">{f.b}</div>
                    </div>
                  </div>
                </div>
              ))}
            </aside>

            <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 p-6 md:p-8">
              {(submitted || flash?.success) && (
                <div className="mb-6 rounded-xl p-4 bg-green-50 border border-green-200 text-sm text-green-800">
                  Application submitted! We'll review and contact you within 2 business days.
                </div>
              )}

              <form onSubmit={submit} className="space-y-5" encType="multipart/form-data">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Business name *</label>
                    <input required type="text" className={inputCls} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Contact person</label>
                    <input type="text" className={inputCls} value={data.contact_name} onChange={(e) => setData('contact_name', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Category *</label>
                  <select required className={inputCls + ' bg-white'} value={data.category} onChange={(e) => setData('category', e.target.value)}>
                    <option value="">Select a category</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Email *</label>
                    <input required type="email" className={inputCls} value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Phone</label>
                    <input type="tel" className={inputCls} value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Website</label>
                  <input type="url" placeholder="https://..." className={inputCls} value={data.website} onChange={(e) => setData('website', e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Business address</label>
                  <input type="text" className={inputCls} value={data.address} onChange={(e) => setData('address', e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">About your business *</label>
                  <textarea required rows={5} className={inputCls + ' resize-vertical'} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                  {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Services offered</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Deep cleaning"
                      className={inputCls + ' flex-1'}
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addService(); } }}
                    />
                    <button type="button" onClick={addService} className="rounded-xl px-4 text-sm font-semibold text-white" style={{ backgroundColor: '#3355FF' }}>
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {data.services.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {data.services.map((s) => (
                        <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs">
                          {s}
                          <button type="button" onClick={() => removeService(s)}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Logo (optional, max 2MB)</label>
                  <input type="file" accept="image/*" onChange={(e) => setData('logo', e.target.files[0] || null)} className="block w-full text-sm text-gray-600" />
                  {progress && <progress value={progress.percentage} max="100" className="mt-2 w-full" />}
                  {errors.logo && <p className="text-xs text-red-600 mt-1">{errors.logo}</p>}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#3355FF' }}
                >
                  {processing ? 'Submitting…' : 'Submit application'}
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

BecomePartner.layout = (page) => <MainLayout>{page}</MainLayout>;
export default BecomePartner;

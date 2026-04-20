import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import SEOHead from '@/Components/SEOHead';
import AuthModal from '@/Components/AuthModal';
import { Download, BookOpen, Loader2 } from 'lucide-react';
import axios from 'axios';

function humanSize(bytes) {
  const n = Number(bytes) || 0;
  if (n <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let v = n, i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return (i === 0 ? Math.round(v) : v.toFixed(1)) + ' ' + units[i];
}

function EbookCard({ ebook, onDownload, downloading }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)]">
      <div className="aspect-[3/4] bg-gradient-to-br from-[#E5E1DC] to-[#D0CCC7] flex items-center justify-center">
        {ebook.cover_url ? (
          <img src={ebook.cover_url} alt={ebook.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <BookOpen className="w-14 h-14 text-[#3D3D3D]" />
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-[#0F172A] mb-2 leading-snug">{ebook.title}</h3>
        {ebook.description && (
          <p className="text-sm text-[#6B7280] mb-4 line-clamp-4 whitespace-pre-line">{ebook.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-xs text-[#9CA3AF]">
            {ebook.file_size_human || humanSize(ebook.file_size)}
            {ebook.download_count > 0 && (
              <span className="ml-2">· {ebook.download_count.toLocaleString()} downloads</span>
            )}
          </span>
          <button
            type="button"
            onClick={onDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1A1816] text-white px-4 py-2 text-sm font-semibold hover:bg-[#3355FF] transition-colors disabled:opacity-60"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

function Ebooks({ ebooks = [] }) {
  const { auth } = usePage().props;
  const [authOpen, setAuthOpen] = useState(false);
  const [downloadingSlug, setDownloadingSlug] = useState(null);

  const handleDownload = async (ebook) => {
    if (!auth?.user) {
      setAuthOpen(true);
      return;
    }
    try {
      setDownloadingSlug(ebook.slug);
      const res = await axios.post(route('ebooks.download', ebook.slug), null, { responseType: 'blob' });

      // Figure out filename from Content-Disposition; fall back to the slug.
      const cd = res.headers?.['content-disposition'] || '';
      const match = /filename\*?=(?:UTF-8'')?"?([^";]+)/i.exec(cd);
      const filename = match ? decodeURIComponent(match[1].replace(/"/g, '')) : `${ebook.slug}.pdf`;

      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 419) {
        setAuthOpen(true);
      } else {
        alert('Could not start the download. Please try again.');
      }
    } finally {
      setDownloadingSlug(null);
    }
  };

  return (
    <>
      <Head title="Free eBooks & Guides — SaveOnYourHome" />
      <SEOHead
        title="Free eBooks & Guides"
        description="Download free real-estate guides and buyer/seller eBooks from SaveOnYourHome."
      />

      <div className="bg-[#F4F3F0] min-h-screen pb-16">
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4">Free eBooks & Guides</h1>
              <p className="text-lg text-[#475569]">
                Practical, commission-free real-estate guides for buyers and sellers. Create a free account to download &mdash; we'll never share your email.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {ebooks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-[#0F172A]">No eBooks yet</h2>
              <p className="text-sm text-[#6B7280] mt-1">Check back soon &mdash; we publish new guides regularly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ebooks.map((eb) => (
                <EbookCard
                  key={eb.id}
                  ebook={eb}
                  downloading={downloadingSlug === eb.slug}
                  onDownload={() => handleDownload(eb)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        intent="download"
        initialTab="register"
      />
    </>
  );
}

Ebooks.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Ebooks;

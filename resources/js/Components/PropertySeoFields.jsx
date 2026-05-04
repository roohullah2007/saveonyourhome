import React from 'react';
import { Search } from 'lucide-react';

export default function PropertySeoFields({
    values,
    errors = {},
    onChange,
    fallbackTitle,
    fallbackDescription,
    fallbackImage,
}) {
    const seoTitle = values.seo_title || '';
    const seoDescription = values.seo_description || '';
    const ogImage = values.og_image || '';

    const titleLen = seoTitle.length;
    const descLen = seoDescription.length;

    const previewTitle = (seoTitle || fallbackTitle || '').slice(0, 90);
    const previewDescription = (seoDescription || fallbackDescription || '').slice(0, 200);
    const previewImage = ogImage || fallbackImage || '';

    return (
        <div className="bg-white rounded-2xl border border-[#E7E4DF] p-6 lg:p-8">
            <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-[#F0F4FF] flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-[#3355FF]" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-[#111] leading-tight">SEO & Social Sharing</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Optional. These control how your listing appears in Google results and on Facebook,
                        LinkedIn, iMessage, etc. Leave blank and we'll auto-generate from the listing details.
                    </p>
                </div>
            </div>

            <div className="space-y-5">
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-semibold text-[#111]">SEO Title</label>
                        <span className={`text-xs ${titleLen > 60 ? 'text-amber-600' : 'text-gray-400'}`}>
                            {titleLen}/60 recommended
                        </span>
                    </div>
                    <input
                        type="text"
                        maxLength={255}
                        value={seoTitle}
                        onChange={(e) => onChange('seo_title', e.target.value)}
                        placeholder={fallbackTitle || '4-bed home in Austin, TX — Listed at $525,000'}
                        className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                    />
                    {errors.seo_title && <p className="text-red-500 text-xs mt-1">{errors.seo_title}</p>}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-semibold text-[#111]">SEO / Social Description</label>
                        <span className={`text-xs ${descLen > 160 ? 'text-amber-600' : 'text-gray-400'}`}>
                            {descLen}/160 recommended
                        </span>
                    </div>
                    <textarea
                        rows={3}
                        maxLength={320}
                        value={seoDescription}
                        onChange={(e) => onChange('seo_description', e.target.value)}
                        placeholder={fallbackDescription || 'A short, scannable summary of this listing.'}
                        className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all resize-vertical"
                    />
                    {errors.seo_description && <p className="text-red-500 text-xs mt-1">{errors.seo_description}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-[#111] mb-1.5">Social Share Image URL</label>
                    <input
                        type="text"
                        maxLength={2048}
                        value={ogImage}
                        onChange={(e) => onChange('og_image', e.target.value)}
                        placeholder="https://… (defaults to your first listing photo)"
                        className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">
                        Leave blank to use your first listing photo. For best results use a 1200×630 image.
                    </p>
                    {errors.og_image && <p className="text-red-500 text-xs mt-1">{errors.og_image}</p>}
                </div>

                {/* Preview */}
                <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                    <p className="px-4 py-2 text-[11px] uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-200">
                        Link Preview
                    </p>
                    {previewImage && (
                        <div className="aspect-[1200/630] bg-gray-100 overflow-hidden">
                            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                            <img
                                src={previewImage}
                                alt="Social share preview"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        </div>
                    )}
                    <div className="p-4">
                        <p className="text-[11px] uppercase tracking-wider text-gray-500">saveonyourhome.com</p>
                        <p className="font-semibold text-[#0F172A] line-clamp-2">{previewTitle || 'Your SEO title will appear here'}</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {previewDescription || 'Your SEO description will appear here.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

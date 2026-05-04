import { useEffect, useMemo, useState } from 'react';
import { X, Package } from 'lucide-react';

const PARTNER_BASE = 'https://humanitysource.org/product/dave-on-your-house-yard-sign-24-x-18-inch-double-sided-print-h-stake-included/';

function buildPartnerUrl(listing) {
    if (!listing) return null;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const listingUrl = `${origin}/properties/${listing.slug || listing.id}`;
    const qrImageUrl = `${origin}/qr.png?size=500&data=${encodeURIComponent(listingUrl)}`;
    return `${PARTNER_BASE}?qrcode=${encodeURIComponent(qrImageUrl)}`;
}

export default function OrderYardSignLinkModal({ isOpen, onClose, listings = [], defaultListingId = null }) {
    const eligible = useMemo(
        () => (listings || []).filter((l) => l && (l.transaction_type === 'for_sale' || !l.transaction_type)),
        [listings]
    );

    const [selectedId, setSelectedId] = useState(defaultListingId || eligible[0]?.id || null);

    useEffect(() => {
        if (!isOpen) return;
        const initial = defaultListingId ?? eligible[0]?.id ?? null;
        setSelectedId(initial);
    }, [isOpen, defaultListingId, eligible]);

    if (!isOpen) return null;

    const selected = eligible.find((l) => l.id === selectedId) || null;
    const partnerUrl = buildPartnerUrl(selected);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Order Yard Sign</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Custom "For Sale By Owner" sign with a QR code that links to your listing.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="bg-gray-50 p-4">
                    <img
                        src="/images/SOYH%20Yard%20Sign.jpeg"
                        alt="SaveOnYourHome yard sign sample"
                        className="w-full h-auto rounded-xl object-contain max-h-[55vh] bg-white"
                    />
                </div>

                <div className="px-5 py-4 space-y-4">
                    {eligible.length === 0 ? (
                        <p className="text-sm text-gray-600">
                            You don't have an active listing yet. Add a listing first so we can generate the QR code for your yard sign.
                        </p>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Choose a listing</label>
                            <select
                                value={selectedId ?? ''}
                                onChange={(e) => setSelectedId(Number(e.target.value))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3355FF]/20 focus:border-[#3355FF] bg-white text-sm"
                            >
                                {eligible.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.property_title || `Listing #${l.id}`}
                                        {l.address ? ` — ${l.address}${l.city ? ', ' + l.city : ''}` : ''}
                                    </option>
                                ))}
                            </select>
                            <p className="text-[11px] text-gray-500 mt-2">
                                The QR on the printed sign will scan straight to this listing's page.
                            </p>
                        </div>
                    )}
                </div>

                <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    {partnerUrl ? (
                        <a
                            href={partnerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#1D4ED8] transition-colors"
                        >
                            <Package className="w-4 h-4" />
                            Order Yard Sign
                        </a>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-2 bg-gray-200 text-gray-500 px-5 py-2 rounded-full text-sm font-semibold cursor-not-allowed"
                        >
                            <Package className="w-4 h-4" />
                            Order Yard Sign
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

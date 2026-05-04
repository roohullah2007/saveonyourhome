import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Package, Check, QrCode } from 'lucide-react';

export default function OrderYardSignModal({
    isOpen,
    onClose,
    listing,
    authUser = null,
    submitRouteName = 'dashboard.listings.order',
    title = 'Order Free Yard Sign',
    successText = "Your custom yard sign will be printed and shipped within 5-7 business days. We'll send a confirmation email shortly.",
}) {
    const form = useForm({
        service_type: 'yard_sign',
        shipping_name: '',
        shipping_address: '',
        shipping_city: '',
        shipping_state: '',
        shipping_zip: '',
        shipping_phone: '',
        notes: '',
    });
    const [success, setSuccess] = React.useState(false);

    useEffect(() => {
        if (isOpen) {
            setSuccess(false);
            form.reset();
            form.clearErrors();
            form.setData({
                service_type: 'yard_sign',
                shipping_name: authUser?.name || '',
                shipping_address: listing?.address || '',
                shipping_city: listing?.city || '',
                shipping_state: listing?.state || '',
                shipping_zip: listing?.zip_code || listing?.zip || '',
                shipping_phone: authUser?.phone || '',
                notes: '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, listing?.id]);

    if (!isOpen || !listing) return null;

    // Build the listing URL + actual QR image URL the printer/admin will use.
    const listingUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/properties/${listing.slug || listing.id}`
        : `/properties/${listing.slug || listing.id}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=4&data=${encodeURIComponent(listingUrl)}`;

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route(submitRouteName, listing.id), {
            preserveScroll: true,
            onSuccess: () => setSuccess(true),
        });
    };

    const handleClose = () => {
        setSuccess(false);
        form.reset();
        form.clearErrors();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={handleClose}>
            <div
                className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Close">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">Order Submitted!</h4>
                            <p className="text-gray-500 mb-6">{successText}</p>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1D4ED8] transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-gray-50 rounded-xl p-4 mb-5">
                                <p className="text-sm text-gray-500">Ordering for:</p>
                                <p className="font-medium text-gray-900">{listing.property_title}</p>
                                <p className="text-sm text-gray-600">{listing.address}, {listing.city}</p>
                            </div>

                            <div className="rounded-xl p-4 mb-4 bg-emerald-50">
                                <h5 className="font-medium mb-2 flex items-center gap-2 text-emerald-900">
                                    <Package className="w-4 h-4" />
                                    What You'll Receive (FREE)
                                </h5>
                                <ul className="text-sm space-y-1 text-emerald-800">
                                    <li>• 18" × 24" professional corrugated plastic yard sign</li>
                                    <li>• Weatherproof, double-sided print</li>
                                    <li>• "For Sale By Owner" branding</li>
                                    <li>• Custom QR code linking to your listing</li>
                                    <li>• Your property address printed on the sign</li>
                                    <li>• H-stakes included for easy installation</li>
                                </ul>
                            </div>

                            {/* Sign preview with the actual QR for this listing */}
                            <div className="rounded-xl p-4 mb-5 border border-emerald-200 bg-white">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Sign preview</p>
                                <div className="mx-auto max-w-xs rounded-md border-2 border-[#A41E34] bg-white p-4 text-center">
                                    <div className="bg-[#A41E34] text-white font-black text-sm py-2 rounded-t -mx-4 -mt-4 mb-3">
                                        FOR SALE BY OWNER
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">
                                        SaveOnYourHome.com
                                    </div>
                                    <div className="my-3 mx-auto h-24 w-24 rounded-md border border-gray-300 bg-white p-1 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={qrImageUrl}
                                            alt="QR code linking to this listing"
                                            className="w-full h-full object-contain"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="text-[11px] font-bold text-[#1a1816] leading-tight">
                                        {listing.address}
                                    </div>
                                    <div className="text-[10px] text-gray-600">
                                        {listing.city}{listing.city && listing.state ? ', ' : ''}{listing.state}
                                    </div>
                                    <div className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-[#A41E34]">
                                        Scan QR to view listing
                                    </div>
                                </div>
                                <p className="text-[11px] text-gray-500 text-center mt-2">
                                    The QR auto-routes scans to <span className="font-medium text-gray-700 break-all">{listingUrl}</span>
                                </p>
                            </div>

                            {form.errors.service_type && (
                                <div className="rounded-lg bg-red-50 border border-red-200 p-3 mb-4 text-sm text-red-700">
                                    {form.errors.service_type}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                                    <input
                                        type="text"
                                        value={form.data.shipping_name}
                                        onChange={(e) => form.setData('shipping_name', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3355FF]/20 focus:border-[#3355FF]"
                                        required
                                    />
                                    {form.errors.shipping_name && <p className="text-red-500 text-xs mt-1">{form.errors.shipping_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                                    <input
                                        type="text"
                                        value={form.data.shipping_address}
                                        onChange={(e) => form.setData('shipping_address', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3355FF]/20 focus:border-[#3355FF]"
                                        required
                                    />
                                    {form.errors.shipping_address && <p className="text-red-500 text-xs mt-1">{form.errors.shipping_address}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                        <input
                                            type="text"
                                            value={form.data.shipping_city}
                                            onChange={(e) => form.setData('shipping_city', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3355FF]/20 focus:border-[#3355FF]"
                                            required
                                        />
                                        {form.errors.shipping_city && <p className="text-red-500 text-xs mt-1">{form.errors.shipping_city}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                        <input
                                            type="text"
                                            value={form.data.shipping_state}
                                            onChange={(e) => form.setData('shipping_state', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3355FF]/20 focus:border-[#3355FF]"
                                            required
                                        />
                                        {form.errors.shipping_state && <p className="text-red-500 text-xs mt-1">{form.errors.shipping_state}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                                        <input
                                            type="text"
                                            value={form.data.shipping_zip}
                                            onChange={(e) => form.setData('shipping_zip', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3355FF]/20 focus:border-[#3355FF]"
                                            required
                                        />
                                        {form.errors.shipping_zip && <p className="text-red-500 text-xs mt-1">{form.errors.shipping_zip}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                        <input
                                            type="tel"
                                            value={form.data.shipping_phone}
                                            onChange={(e) => form.setData('shipping_phone', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3355FF]/20 focus:border-[#3355FF]"
                                            required
                                        />
                                        {form.errors.shipping_phone && <p className="text-red-500 text-xs mt-1">{form.errors.shipping_phone}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions (optional)</label>
                                    <textarea
                                        value={form.data.notes}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3355FF]/20 focus:border-[#3355FF] resize-vertical"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100"
                                        disabled={form.processing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-60"
                                    >
                                        <QrCode className="w-4 h-4" />
                                        {form.processing ? 'Submitting…' : 'Submit Order'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

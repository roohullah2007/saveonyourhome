import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import {
    Plus,
    Search,
    Eye,
    MessageSquare,
    Edit,
    Trash2,
    ExternalLink,
    MapPin,
    Home,
    ChevronLeft,
    ChevronRight,
    Bed,
    Bath,
    Square,
    AlertCircle,
    QrCode,
    Download,
    X,
    Sticker,
    Package,
    Check,
    Loader2,
    Sparkles,
    Video,
    Building2,
    ArrowRight,
    Camera,
    Globe
} from 'lucide-react';
import { useState } from 'react';

export default function Listings({ listings, filters = {}, counts = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [listingToDelete, setListingToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [qrListing, setQrListing] = useState(null);

    // Order modals
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderType, setOrderType] = useState(null); // 'stickers' only now
    const [orderListing, setOrderListing] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Upgrade modal
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeListing, setUpgradeListing] = useState(null);

    // Yard sign sample preview modal
    const [showYardSignSample, setShowYardSignSample] = useState(false);

    const orderForm = useForm({
        service_type: '',
        shipping_name: '',
        shipping_address: '',
        shipping_city: '',
        shipping_state: '',
        shipping_zip: '',
        shipping_phone: '',
        quantity: 2,
        notes: '',
    });

    const openOrderModal = (listing, type) => {
        setOrderListing(listing);
        setOrderType(type);
        setOrderSuccess(false);
        orderForm.reset();
        orderForm.setData('service_type', type);
        setShowOrderModal(true);
    };

    const submitOrder = (e) => {
        e.preventDefault();
        orderForm.post(route('dashboard.listings.order', orderListing.id), {
            onSuccess: () => {
                setOrderSuccess(true);
            },
        });
    };

    const closeOrderModal = () => {
        setShowOrderModal(false);
        setOrderListing(null);
        setOrderType(null);
        setOrderSuccess(false);
        orderForm.reset();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('dashboard.listings'), { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (status) => {
        router.get(route('dashboard.listings'), { ...filters, status }, { preserveState: true });
    };

    const handleDelete = () => {
        if (listingToDelete) {
            setDeleting(true);
            router.delete(route('dashboard.listings.destroy', listingToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setListingToDelete(null);
                    setDeleting(false);
                },
                onError: () => {
                    setDeleting(false);
                }
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'changes_requested': return 'bg-orange-100 text-orange-700';
            case 'draft': return 'bg-gray-200 text-gray-700';
            case 'sold': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'changes_requested': return 'Changes requested';
            case 'draft': return 'Draft';
            default: return status;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const listingData = listings?.data || listings || [];

    return (
        <UserDashboardLayout title="My Listings">
            <Head title="My Listings" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        My Listings
                    </h1>
                    <p className="text-gray-500">Manage your property listings</p>
                </div>
                <Link
                    href="/list-property"
                    className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1D4ED8] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add New Listing
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {[
                    { key: 'all', label: 'All', count: counts.all || 0 },
                    { key: 'active', label: 'Active', count: counts.active || 0 },
                    { key: 'pending', label: 'Pending', count: counts.pending || 0 },
                    { key: 'sold', label: 'Sold', count: counts.sold || 0 },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleFilter(tab.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                            (filters.status || 'all') === tab.key
                                ? 'bg-[#3355FF] text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search listings..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Listings */}
            {listingData.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <Home className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings found</h3>
                    <p className="text-gray-500 mb-6">
                        {search || (filters.status && filters.status !== 'all')
                            ? 'Try adjusting your search or filters'
                            : 'Start by adding your first property listing'}
                    </p>
                    <Link
                        href="/list-property"
                        className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1D4ED8] transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Your First Listing
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {listingData.map((listing) => (
                        <div key={listing.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex">
                                {/* Image - Smaller */}
                                <div className="w-28 sm:w-36 h-28 sm:h-32 bg-gray-200 flex-shrink-0">
                                    <img
                                        src={listing.photos?.[0] || '/images/property-placeholder.jpg'}
                                        alt={listing.property_title}
                                        className="w-full h-full object-cover object-center"
                                        onError={(e) => e.target.src = '/images/property-placeholder.jpg'}
                                    />
                                </div>

                                {/* Content - Compact */}
                                <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
                                    <div>
                                        {/* Top Row: Title, Status, Price */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-base font-semibold text-gray-900 truncate">
                                                        {listing.property_title}
                                                    </h3>
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize flex-shrink-0 ${getStatusColor(listing.approval_status)}`}>
                                                        {getStatusLabel(listing.approval_status)}
                                                    </span>
                                                    {/* Listing Status Badge */}
                                                    {listing.listing_status && listing.listing_status !== 'for_sale' && (
                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
                                                            listing.listing_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            listing.listing_status === 'sold' ? 'bg-gray-200 text-gray-700' :
                                                            listing.listing_status === 'inactive' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {listing.listing_status === 'for_sale' ? 'For Sale' :
                                                             listing.listing_status === 'pending' ? 'Pending' :
                                                             listing.listing_status === 'sold' ? 'Sold' :
                                                             listing.listing_status === 'inactive' ? 'Inactive' :
                                                             listing.listing_status}
                                                        </span>
                                                    )}
                                                    {/* Video icon */}
                                                    {(listing.video_tour_url || listing.has_video) && (
                                                        <Video className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" title="Has video tour" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                                    {listing.address}, {listing.city}
                                                </p>
                                            </div>
                                            <span className="text-lg font-bold text-[#1A1816] flex-shrink-0">
                                                ${Number(listing.price).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Rejection reason - Compact */}
                                        {listing.approval_status === 'rejected' && listing.rejection_reason && (
                                            <div className="mt-2 p-2 bg-red-50 rounded-lg flex items-start gap-2">
                                                <AlertCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-red-700 line-clamp-1">{listing.rejection_reason}</p>
                                            </div>
                                        )}

                                        {listing.approval_status === 'changes_requested' && listing.admin_feedback && (
                                            <div className="mt-2 p-2 bg-orange-50 rounded-lg flex items-start gap-2">
                                                <AlertCircle className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-orange-800">Admin requested changes</p>
                                                    <p className="text-xs text-orange-700 line-clamp-2">{listing.admin_feedback}</p>
                                                </div>
                                            </div>
                                        )}

                                        {listing.approval_status === 'draft' && (
                                            <div className="mt-2 p-2 bg-gray-50 rounded-lg flex items-start gap-2">
                                                <AlertCircle className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-gray-700">This listing is a draft — publish it from the edit page to send it to admin for review.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Row: Stats and Actions */}
                                    <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-gray-100">
                                        {/* Stats */}
                                        <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Bed className="w-3 h-3" />
                                                {listing.bedrooms}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Bath className="w-3 h-3" />
                                                {(listing.full_bathrooms || 0) + (listing.half_bathrooms ? listing.half_bathrooms * 0.5 : 0)}
                                            </span>
                                            {listing.sqft && (
                                                <span className="hidden sm:flex items-center gap-1">
                                                    <Square className="w-3 h-3" />
                                                    {Number(listing.sqft).toLocaleString()}
                                                </span>
                                            )}
                                            <span className="hidden sm:flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {listing.views || 0}
                                            </span>
                                            <span className="hidden sm:flex items-center gap-1">
                                                <MessageSquare className="w-3 h-3" />
                                                {listing.inquiries_count || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <QrCode className="w-3 h-3" />
                                                {listing.qr_scans_count || 0}
                                            </span>
                                        </div>

                                        {/* Action Buttons with Text */}
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <button
                                                onClick={() => {
                                                    setQrListing(listing);
                                                    setShowQrModal(true);
                                                }}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-[#3355FF] hover:bg-[#1D4ED8] rounded-lg transition-colors"
                                            >
                                                <QrCode className="w-3.5 h-3.5" />
                                                QR Code
                                            </button>
                                            {listing.is_active && listing.approval_status === 'approved' && (listing.transaction_type === 'for_sale' || !listing.transaction_type) && (() => {
                                                const origin = typeof window !== 'undefined' ? window.location.origin : '';
                                                const listingUrl = `${origin}/properties/${listing.slug || listing.id}`;
                                                const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(listingUrl)}`;
                                                const partnerUrl = `https://humanitysource.org/product/dave-on-your-house-yard-sign-24-x-18-inch-double-sided-print-h-stake-included/?qrcode=${encodeURIComponent(qrImageUrl)}`;
                                                return (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowYardSignSample(true)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-white border border-emerald-200 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                            See sample
                                                        </button>
                                                        <a
                                                            href={partnerUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                                                        >
                                                            <Package className="w-3.5 h-3.5" />
                                                            Order Yard Sign
                                                        </a>
                                                    </>
                                                );
                                            })()}
                                            <Link
                                                href={route('dashboard.listings.edit', listing.id)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                Edit
                                            </Link>
                                            <Link
                                                href={`/properties/${listing.slug || listing.id}`}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                View
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setListingToDelete(listing);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {listings?.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 bg-white rounded-2xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">
                        Showing {listings.from} to {listings.to} of {listings.total}
                    </p>
                    <div className="flex items-center gap-2">
                        {listings.prev_page_url && (
                            <Link
                                href={listings.prev_page_url}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                        )}
                        <span className="text-sm text-gray-600">
                            Page {listings.current_page} of {listings.last_page}
                        </span>
                        {listings.next_page_url && (
                            <Link
                                href={listings.next_page_url}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Listing</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete <strong>{listingToDelete?.property_title}</strong>? This will also delete all inquiries related to this property. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setListingToDelete(null); }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Yard Sign Sample Preview Modal */}
            {showYardSignSample && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowYardSignSample(false)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Yard Sign Sample</h3>
                                <p className="text-xs text-gray-500 mt-0.5">This is what the printed SaveOnYourHome yard sign looks like.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowYardSignSample(false)}
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
                                className="w-full h-auto rounded-xl object-contain max-h-[70vh] bg-white"
                            />
                        </div>
                        <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowYardSignSample(false)}
                                className="px-4 py-2 rounded-lg bg-[#1A1816] text-white text-sm font-semibold hover:opacity-90"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {showQrModal && qrListing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                QR Sticker for Your Listing
                            </h3>
                            <button
                                onClick={() => { setShowQrModal(false); setQrListing(null); }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="text-center">
                            {/* QR Code Preview */}
                            <div className="bg-gray-50 rounded-xl p-6 mb-4">
                                <img
                                    src={route('dashboard.listings.qrcode.preview', qrListing.id)}
                                    alt={`QR Code for ${qrListing.property_title}`}
                                    className="w-48 h-48 mx-auto"
                                />
                                <p className="text-xs text-gray-500 mt-2">Scan to View Listing</p>
                            </div>

                            <h4 className="font-medium text-gray-900 mb-1">{qrListing.property_title}</h4>
                            <p className="text-sm text-gray-500 mb-2">
                                {qrListing.address}, {qrListing.city}
                            </p>

                            {/* Scan Stats */}
                            {qrListing.qr_sticker && (
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                        <Eye className="w-4 h-4" />
                                        {qrListing.qr_sticker.scan_count || 0} scans
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        Code: {qrListing.qr_sticker.short_code}
                                    </span>
                                </div>
                            )}

                            <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
                                <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                                    <QrCode className="w-4 h-4" />
                                    Print-Ready QR Sticker
                                </h5>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• 4" x 4" size - fits FSBO yard signs</li>
                                    <li>• 300 DPI - professional print quality</li>
                                    <li>• Includes "Scan to View Listing" text</li>
                                    <li>• All scans are tracked in your dashboard</li>
                                </ul>
                            </div>

                            <a
                                href={route('dashboard.listings.qrcode', qrListing.id)}
                                download={`qr-sticker-${qrListing.id}.png`}
                                className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1D4ED8] transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                Download Sticker (PNG)
                            </a>
                            <p className="text-xs text-gray-500 mt-3">
                                Print at 100% size for 4" x 4" sticker
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Stickers / Yard Sign Modal */}
            {showOrderModal && orderListing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {orderType === 'yard_sign' ? 'Order Free Yard Sign' : 'Order Free QR Stickers'}
                                </h3>
                                <button
                                    onClick={closeOrderModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {orderSuccess ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Order Submitted!</h4>
                                    <p className="text-gray-500 mb-6">
                                        {orderType === 'yard_sign'
                                            ? 'Your custom yard sign will be printed and shipped within 5-7 business days.'
                                            : 'Your free QR stickers will be mailed to you within 3-5 business days.'}
                                    </p>
                                    <button
                                        onClick={closeOrderModal}
                                        className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1D4ED8] transition-colors"
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Property Info */}
                                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                        <p className="text-sm text-gray-500">Ordering for:</p>
                                        <p className="font-medium text-gray-900">{orderListing.property_title}</p>
                                        <p className="text-sm text-gray-600">{orderListing.address}, {orderListing.city}</p>
                                    </div>

                                    {/* What You Get */}
                                    {orderType === 'yard_sign' ? (
                                        <>
                                            <div className="rounded-xl p-4 mb-4 bg-emerald-50">
                                                <h5 className="font-medium mb-2 flex items-center gap-2 text-emerald-900">
                                                    <Package className="w-4 h-4" />
                                                    What You'll Receive (FREE)
                                                </h5>
                                                <ul className="text-sm space-y-1 text-emerald-800">
                                                    <li>• 18" × 24" professional corrugated plastic yard sign</li>
                                                    <li>• Weatherproof, double-sided print</li>
                                                    <li>• SaveOnYourHome branding + "For Sale By Owner" callout</li>
                                                    <li>• Custom QR code linking to your listing</li>
                                                    <li>• Your property address printed on the sign</li>
                                                    <li>• H-stakes included for easy installation</li>
                                                </ul>
                                            </div>
                                            {/* Yard sign preview */}
                                            <div className="rounded-xl p-4 mb-6 border border-emerald-200 bg-white">
                                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Sign preview</p>
                                                <div className="mx-auto max-w-xs rounded-md border-2 border-[#A41E34] bg-white p-4 text-center">
                                                    <div className="bg-[#A41E34] text-white font-black text-sm py-2 rounded-t -mx-4 -mt-4 mb-3">
                                                        FOR SALE BY OWNER
                                                    </div>
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">
                                                        SaveOnYourHome.com
                                                    </div>
                                                    <div className="my-3 mx-auto flex h-20 w-20 items-center justify-center rounded-md bg-gray-100 border border-gray-300">
                                                        <QrCode className="w-10 h-10 text-gray-400" />
                                                    </div>
                                                    <div className="text-[11px] font-bold text-[#1a1816] leading-tight">
                                                        {orderListing.address}
                                                    </div>
                                                    <div className="text-[10px] text-gray-600">
                                                        {orderListing.city}, {orderListing.state}
                                                    </div>
                                                    <div className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-[#A41E34]">
                                                        Scan QR to view listing
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="rounded-xl p-4 mb-6 bg-orange-50">
                                            <h5 className="font-medium mb-2 flex items-center gap-2 text-orange-900">
                                                <Sticker className="w-4 h-4" />
                                                What You'll Receive (FREE)
                                            </h5>
                                            <ul className="text-sm space-y-1 text-orange-800">
                                                <li>• Waterproof vinyl QR code stickers</li>
                                                <li>• 4" x 4" size - fits FSBO yard signs</li>
                                                <li>• Weather resistant for outdoor use</li>
                                                <li>• "Scan to View Listing" text included</li>
                                                <li>• Links directly to your listing</li>
                                            </ul>
                                        </div>
                                    )}

                                    <form onSubmit={submitOrder} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Your Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={orderForm.data.shipping_name}
                                                onChange={(e) => orderForm.setData('shipping_name', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                                required
                                            />
                                            {orderForm.errors.shipping_name && (
                                                <p className="text-red-500 text-xs mt-1">{orderForm.errors.shipping_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Street Address *
                                            </label>
                                            <input
                                                type="text"
                                                value={orderForm.data.shipping_address}
                                                onChange={(e) => orderForm.setData('shipping_address', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                                required
                                            />
                                            {orderForm.errors.shipping_address && (
                                                <p className="text-red-500 text-xs mt-1">{orderForm.errors.shipping_address}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={orderForm.data.shipping_city}
                                                    onChange={(e) => orderForm.setData('shipping_city', e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    ZIP Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={orderForm.data.shipping_zip}
                                                    onChange={(e) => orderForm.setData('shipping_zip', e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                value={orderForm.data.shipping_phone}
                                                onChange={(e) => orderForm.setData('shipping_phone', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                                required
                                            />
                                        </div>

                                        {orderType !== 'yard_sign' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Quantity
                                                </label>
                                                <select
                                                    value={orderForm.data.quantity}
                                                    onChange={(e) => orderForm.setData('quantity', parseInt(e.target.value))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                                >
                                                    <option value={2}>2 stickers</option>
                                                    <option value={4}>4 stickers</option>
                                                    <option value={6}>6 stickers</option>
                                                </select>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Special Instructions (optional)
                                            </label>
                                            <textarea
                                                value={orderForm.data.notes}
                                                onChange={(e) => orderForm.setData('notes', e.target.value)}
                                                rows={2}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                                placeholder="Any special delivery instructions..."
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={closeOrderModal}
                                                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={orderForm.processing}
                                                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#3355FF] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
                                            >
                                                {orderForm.processing ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Package className="w-4 h-4" />
                                                        Submit Order
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </UserDashboardLayout>
    );
}

Listings.layout = (page) => page;

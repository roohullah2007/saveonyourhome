import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeft,
    Download,
    Clock,
    CheckCircle,
    AlertTriangle,
    Trash2,
    FileText,
    CalendarPlus,
    ExternalLink,
    Share2,
    Copy,
    QrCode,
    X,
    User,
    ImagePlus,
} from 'lucide-react';

export default function ImportsShow({ batch, properties, viewedCount }) {
    const [showExtendModal, setShowExtendModal] = useState(false);
    const [shareProperty, setShareProperty] = useState(null);
    const [copied, setCopied] = useState(false);
    const [refetching, setRefetching] = useState(false);
    const extendForm = useForm({ days: 30 });

    const isExpired = new Date(batch.expires_at) < new Date();

    const handleExtend = (e) => {
        e.preventDefault();
        extendForm.post(route('admin.imports.extend', batch.id), {
            onSuccess: () => setShowExtendModal(false),
        });
    };

    const handleDeleteProperty = (propertyId) => {
        if (confirm('Delete this imported property?')) {
            router.delete(route('admin.imports.destroy-property', propertyId));
        }
    };

    const handleDeleteBatch = () => {
        if (confirm('Delete this entire batch and all unclaimed properties? This cannot be undone.')) {
            router.delete(route('admin.imports.destroy', batch.id));
        }
    };

    const handleRefetchImages = () => {
        if (confirm('Re-fetch images from Zillow for properties with 0-1 photos? This may take a while.')) {
            setRefetching(true);
            router.post(route('admin.imports.refetch-images', batch.id), {}, {
                onFinish: () => setRefetching(false),
            });
        }
    };

    const getClaimUrl = (property) => {
        return `${window.location.origin}/claim/${property.claim_token}`;
    };

    const handleCopyLink = (property) => {
        navigator.clipboard.writeText(getClaimUrl(property));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (property) => {
        setShareProperty(property);
        setCopied(false);
    };

    return (
        <AdminLayout title={`Import Batch #${batch.id}`}>
            <Head title={`Batch #${batch.id}`} />

            <div className="mb-6">
                <Link
                    href={route('admin.imports.index')}
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Imports
                </Link>
            </div>

            {/* Batch Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            {batch.original_filename}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Imported by {batch.importer?.name || 'Admin'} on{' '}
                            {new Date(batch.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isExpired ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-red-100 text-red-700 rounded-full">
                                <AlertTriangle className="w-3.5 h-3.5" /> Expired
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                                <CheckCircle className="w-3.5 h-3.5" /> Active
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mb-4">
                    <div>
                        <p className="text-xs text-gray-500">Source</p>
                        <p className="font-medium capitalize">{batch.source}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Imported</p>
                        <p className="font-medium">{batch.imported_count}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Viewed</p>
                        <p className="font-medium text-blue-600">{viewedCount}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Claimed</p>
                        <p className="font-medium text-green-600">{batch.claimed_count}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Unclaimed</p>
                        <p className="font-medium text-orange-600">{batch.imported_count - batch.claimed_count}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Expires</p>
                        <p className="font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {new Date(batch.expires_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {batch.notes && (
                    <div className="bg-gray-50 rounded p-3 mb-4">
                        <p className="text-xs text-gray-500 mb-1">Notes</p>
                        <p className="text-sm text-gray-700">{batch.notes}</p>
                    </div>
                )}

                {batch.errors && batch.errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                        <p className="text-xs font-medium text-red-700 mb-1">Import Errors ({batch.errors.length})</p>
                        <div className="max-h-24 overflow-y-auto space-y-1">
                            {batch.errors.map((err, i) => (
                                <p key={i} className="text-xs text-red-600">
                                    Row {err.row}: {err.message}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t">
                    <a
                        href={route('admin.imports.batch-letters', batch.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                    >
                        <Download className="w-4 h-4" /> Download All Letters
                    </a>
                    <button
                        onClick={() => setShowExtendModal(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                        <CalendarPlus className="w-4 h-4" /> Extend Expiration
                    </button>
                    {batch.source === 'zillow' && (
                        <button
                            onClick={handleRefetchImages}
                            disabled={refetching}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50"
                        >
                            <ImagePlus className="w-4 h-4" />
                            {refetching ? 'Fetching Images...' : 'Re-fetch Images'}
                        </button>
                    )}
                    <button
                        onClick={handleDeleteBatch}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium ml-auto"
                    >
                        <Trash2 className="w-4 h-4" /> Delete Batch
                    </button>
                </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-4 py-3 border-b bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700">
                        Imported Properties ({properties.total})
                    </h3>
                </div>
                {properties.data.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No properties in this batch</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="w-16 px-4 py-2"></th>
                                <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">Property</th>
                                <th className="text-right px-4 py-2 font-medium text-gray-500 text-xs">Price</th>
                                <th className="text-center px-4 py-2 font-medium text-gray-500 text-xs">Details</th>
                                <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">Owner/Contact</th>
                                <th className="text-center px-4 py-2 font-medium text-gray-500 text-xs">Viewed</th>
                                <th className="text-center px-4 py-2 font-medium text-gray-500 text-xs">Status</th>
                                <th className="text-right px-4 py-2 font-medium text-gray-500 text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {properties.data.map((property) => (
                                <tr key={property.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        {property.photos && property.photos.length > 0 ? (
                                            <div className="relative">
                                                <img src={property.photos[0]} alt="" className="w-12 h-9 object-cover rounded" />
                                                <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-[9px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                                                    {property.photos.length}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="w-12 h-9 bg-gray-100 rounded flex items-center justify-center">
                                                <span className="text-gray-300 text-[10px]">No img</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900">{property.address}</p>
                                        <p className="text-xs text-gray-500">
                                            {property.city}, {property.state} {property.zip_code}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        ${Number(property.price).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center text-xs text-gray-500">
                                        {property.bedrooms > 0 && <span>{property.bedrooms} bd</span>}
                                        {property.bathrooms > 0 && <span> / {property.bathrooms} ba</span>}
                                        {property.sqft > 0 && <span> / {Number(property.sqft).toLocaleString()} sqft</span>}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-600">
                                        {(property.owner_name && property.owner_name !== 'Property Owner') || property.owner_phone || property.owner_email ? (
                                            <div className="flex items-start gap-1.5">
                                                <User className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                                                <div className="min-w-0">
                                                    {property.owner_name && property.owner_name !== 'Property Owner' && (
                                                        <p className="font-medium text-gray-800 truncate">{property.owner_name}</p>
                                                    )}
                                                    {property.owner_phone && (
                                                        <p className="text-gray-500 truncate">{property.owner_phone}</p>
                                                    )}
                                                    {property.owner_email && (
                                                        <p className="text-gray-500 truncate">{property.owner_email}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center text-xs text-gray-500">
                                        {property.claim_view_count > 0 ? (
                                            <span>
                                                {property.claim_view_count} {property.claim_view_count === 1 ? 'view' : 'views'}
                                                <span className="text-gray-400"> · {new Date(property.claim_last_viewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            </span>
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {property.claimed_at ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                                                <CheckCircle className="w-3 h-3" /> Claimed
                                            </span>
                                        ) : new Date(property.claim_expires_at) < new Date() ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                                                <AlertTriangle className="w-3 h-3" /> Expired
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
                                                <Clock className="w-3 h-3" /> Unclaimed
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {!property.claimed_at && new Date(property.claim_expires_at) >= new Date() && (
                                                <button
                                                    onClick={() => handleShare(property)}
                                                    className="p-1.5 text-gray-400 hover:text-[#555] hover:bg-red-50 rounded"
                                                    title="Share Claim Link"
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            {!property.claimed_at && (
                                                <>
                                                    <a
                                                        href={route('admin.imports.letter', property.id)}
                                                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded"
                                                        title="Download Letter"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                    <a
                                                        href={getClaimUrl(property)}
                                                        target="_blank"
                                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                        title="Preview Claim Page"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </>
                                            )}
                                            {property.claimed_at && (
                                                <Link
                                                    href={route('properties.show', property.id)}
                                                    target="_blank"
                                                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                                                    title="View Live Listing"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleDeleteProperty(property.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {properties.last_page > 1 && (
                    <div className="px-4 py-3 border-t flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {properties.from} to {properties.to} of {properties.total}
                        </p>
                        <div className="flex gap-1">
                            {properties.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 text-sm rounded ${
                                        link.active
                                            ? 'bg-[#3355FF] text-white'
                                            : link.url
                                            ? 'text-gray-600 hover:bg-gray-100'
                                            : 'text-gray-300 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Share Modal */}
            {shareProperty && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShareProperty(null)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Share Claim Link</h3>
                                <button
                                    onClick={() => setShareProperty(null)}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <p className="font-medium text-gray-900">{shareProperty.address}</p>
                                <p className="text-sm text-gray-500">
                                    {shareProperty.city}, {shareProperty.state} {shareProperty.zip_code}
                                </p>
                                <p className="text-sm font-medium text-[#1A1816] mt-1">
                                    ${Number(shareProperty.price).toLocaleString()}
                                </p>
                            </div>

                            {/* Claim Link */}
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Claim Link</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={getClaimUrl(shareProperty)}
                                        className="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm text-gray-700"
                                        onClick={(e) => e.target.select()}
                                    />
                                    <button
                                        onClick={() => handleCopyLink(shareProperty)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            copied
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-[#3355FF] text-white hover:bg-[#1D4ED8]'
                                        }`}
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" /> Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" /> Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <a
                                    href={route('admin.imports.qr-code', shareProperty.id)}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                                >
                                    <QrCode className="w-4 h-4" /> Download QR Code
                                </a>
                                <a
                                    href={route('admin.imports.letter', shareProperty.id)}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium"
                                >
                                    <FileText className="w-4 h-4" /> Download Letter
                                </a>
                            </div>

                            <p className="text-xs text-gray-400 mt-4 text-center">
                                Share this link with the property owner so they can claim their listing.
                                <br />
                                Expires {new Date(shareProperty.claim_expires_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Extend Expiration Modal */}
            {showExtendModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowExtendModal(false)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Extend Expiration</h3>
                            <form onSubmit={handleExtend}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Extend by (days)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={extendForm.data.days}
                                    onChange={(e) => extendForm.setData('days', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg text-sm mb-4"
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowExtendModal(false)}
                                        className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={extendForm.processing}
                                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {extendForm.processing ? 'Extending...' : 'Extend'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
}

ImportsShow.layout = (page) => page;

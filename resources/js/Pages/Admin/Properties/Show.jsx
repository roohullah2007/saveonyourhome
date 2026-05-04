import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { resolvePhotoUrl } from '@/utils/photoUrl';
import {
    ArrowLeft,
    MapPin,
    Bed,
    Bath,
    Square,
    Calendar,
    Home,
    User,
    Mail,
    Phone,
    CheckCircle,
    XCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    Building,
    DollarSign,
    FileText,
    AlertCircle,
    Download,
    Upload,
    Trash2,
    Image,
    Loader2,
    Award,
    MessageSquare,
    RefreshCw,
    Pencil,
    Package,
} from 'lucide-react';
import { useState, useRef } from 'react';
import OrderYardSignLinkModal from '@/Components/OrderYardSignLinkModal';

export default function PropertiesShow({ property, listingStatuses = {} }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showAdminYardSignModal, setShowAdminYardSignModal] = useState(false);
    const [showChangesModal, setShowChangesModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showDeletePhotoModal, setShowDeletePhotoModal] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [adminFeedback, setAdminFeedback] = useState('');
    const [processing, setProcessing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [downloadingZip, setDownloadingZip] = useState(false);
    const fileInputRef = useRef(null);

    // Listing status & tour URLs state
    const [listingStatus, setListingStatus] = useState(property.listing_status || 'for_sale');
    const [virtualTourUrl, setVirtualTourUrl] = useState(property.virtual_tour_url || '');
    const [matterportUrl, setMatterportUrl] = useState(property.matterport_url || '');
    const [videoTourUrl, setVideoTourUrl] = useState(property.video_tour_url || '');
    const [mlsVirtualTourUrl, setMlsVirtualTourUrl] = useState(property.mls_virtual_tour_url || '');
    const [savingDetails, setSavingDetails] = useState(false);

    // Showcase & testimonial state
    const [testimonial, setTestimonial] = useState(property.testimonial || '');
    const [testimonialName, setTestimonialName] = useState(property.testimonial_name || '');
    const [savingTestimonial, setSavingTestimonial] = useState(false);
    const [togglingShowcase, setTogglingShowcase] = useState(false);
    const [showConvertModal, setShowConvertModal] = useState(false);

    const handleSaveDetails = () => {
        setSavingDetails(true);
        router.put(route('admin.properties.update', property.id), {
            ...property,
            listing_status: listingStatus,
            virtual_tour_url: virtualTourUrl || null,
            matterport_url: matterportUrl || null,
            video_tour_url: videoTourUrl || null,
            mls_virtual_tour_url: mlsVirtualTourUrl || null,
        }, {
            preserveScroll: true,
            onFinish: () => setSavingDetails(false),
        });
    };

    const handleToggleShowcase = () => {
        setTogglingShowcase(true);
        router.post(route('admin.properties.toggle-showcase', property.id), {}, {
            preserveScroll: true,
            onFinish: () => setTogglingShowcase(false),
        });
    };

    const handleSaveTestimonial = () => {
        setSavingTestimonial(true);
        router.post(route('admin.properties.update-testimonial', property.id), {
            testimonial: testimonial || null,
            testimonial_name: testimonialName || null,
        }, {
            preserveScroll: true,
            onFinish: () => setSavingTestimonial(false),
        });
    };

    const handleConvertToShowcase = () => {
        setProcessing(true);
        router.post(route('admin.properties.convert-showcase', property.id), {
            testimonial: testimonial || null,
            testimonial_name: testimonialName || null,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setShowConvertModal(false);
            },
        });
    };

    const handleForceDelete = () => {
        if (confirm('Are you sure you want to PERMANENTLY delete this property? This cannot be undone.')) {
            router.delete(route('admin.properties.force-delete', property.id));
        }
    };

    const photos = property.photos && property.photos.length > 0
        ? property.photos.map((p) => resolvePhotoUrl(p))
        : ['/images/property-placeholder.svg'];

    const hasRealPhotos = property.photos && property.photos.length > 0;

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    const handleApprove = () => {
        setProcessing(true);
        router.post(route('admin.properties.approve', property.id), {}, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setShowApproveModal(false);
            }
        });
    };

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        setProcessing(true);
        router.post(route('admin.properties.reject', property.id), {
            rejection_reason: rejectionReason
        }, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setShowRejectModal(false);
            }
        });
    };

    const handleRequestChanges = () => {
        if (!adminFeedback.trim()) {
            alert('Please describe what the seller needs to change.');
            return;
        }
        setProcessing(true);
        router.post(route('admin.properties.request-changes', property.id), {
            admin_feedback: adminFeedback,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setShowChangesModal(false);
            }
        });
    };

    const handleDownloadPhotos = () => {
        if (!hasRealPhotos) return;
        setDownloadingZip(true);
        // Use window.location for file download
        window.location.href = route('admin.properties.download-photos', property.id);
        // Reset after a delay (download starts immediately)
        setTimeout(() => setDownloadingZip(false), 2000);
    };

    const handleUploadPhotos = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        Array.from(files).forEach((file, index) => {
            formData.append(`photos[${index}]`, file);
        });

        router.post(route('admin.properties.add-photos', property.id), formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => {
                setUploading(false);
                setShowUploadModal(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleDeletePhoto = (index) => {
        setPhotoToDelete(index);
        setShowDeletePhotoModal(true);
    };

    const confirmDeletePhoto = () => {
        if (photoToDelete === null) return;

        setProcessing(true);
        router.post(route('admin.properties.remove-photo', property.id), {
            photo_index: photoToDelete,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setShowDeletePhotoModal(false);
                setPhotoToDelete(null);
                // Reset image index if needed
                if (currentImageIndex >= (property.photos?.length || 1) - 1) {
                    setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
                }
            },
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStatusBadge = (status) => {
        const styles = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'approved': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const getPropertyTypeName = (type) => {
        const types = {
            'single-family-home': 'Single Family Home',
            'condos-townhomes-co-ops': 'Condo / Townhome',
            'multi-family': 'Multi-Family',
            'land': 'Land',
            'commercial': 'Commercial',
            'farms-ranches': 'Farm / Ranch',
            'mfd-mobile-homes': 'Mobile Home',
        };
        return types[type] || type;
    };

    return (
        <AdminLayout title="Review Property">
            <Head title={`Review: ${property.property_title} - Admin`} />

            {/* Header */}
            {(() => {
                const statusPillByStatus = {
                    pending: { label: 'Pending Review', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
                    approved: { label: 'Approved · Live', className: 'bg-green-50 text-green-700 border-green-200' },
                    rejected: { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-200' },
                    on_hold: { label: 'On Hold', className: 'bg-blue-50 text-blue-700 border-blue-200' },
                    changes_requested: { label: 'Changes Requested', className: 'bg-orange-50 text-orange-700 border-orange-200' },
                    draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700 border-gray-200' },
                };
                const statusPill = statusPillByStatus[property.approval_status] || statusPillByStatus.pending;
                return (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-start gap-3 min-w-0">
                                <Link
                                    href={route('admin.properties.index')}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex-shrink-0"
                                    title="Back to properties"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="inline-flex items-center text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                                            #{property.id}
                                        </span>
                                        <span className={`inline-flex items-center text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-md border ${statusPill.className}`}>
                                            {statusPill.label}
                                        </span>
                                        {property.is_featured && (
                                            <span className="inline-flex items-center text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                                        {property.property_title}
                                    </h1>
                                    <p className="text-sm text-gray-500 truncate">
                                        {[property.address, property.city, property.state].filter(Boolean).join(', ')}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {property.approval_status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => setShowApproveModal(true)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => setShowChangesModal(true)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            Request changes
                                        </button>
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </>
                                )}

                                {property.approval_status === 'rejected' && (
                                    <button
                                        onClick={() => setShowApproveModal(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve Now
                                    </button>
                                )}

                                <Link
                                    href={route('admin.properties.edit', property.id)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#3355FF] text-white rounded-lg text-sm font-semibold hover:bg-[#1D4ED8] transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => setShowAdminYardSignModal(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors"
                                >
                                    <Package className="w-4 h-4" />
                                    Order Yard Sign on Behalf
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Status Banner */}
            {property.approval_status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <div>
                        <p className="font-medium text-yellow-800">Pending Review</p>
                        <p className="text-sm text-yellow-700">This property is awaiting your approval before it goes live.</p>
                    </div>
                </div>
            )}

            {property.approval_status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <div>
                            <p className="font-medium text-red-800">Rejected</p>
                            {property.rejection_reason && (
                                <p className="text-sm text-red-700">Reason: {property.rejection_reason}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {property.approval_status === 'approved' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                        <p className="font-medium text-green-800">Approved</p>
                        <p className="text-sm text-green-700">This property is live and visible to the public.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Gallery */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Photo Management Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Image className="w-5 h-5 text-gray-400" />
                                <span className="font-medium text-gray-900">
                                    Photos ({hasRealPhotos ? property.photos.length : 0}/50)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Upload Button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4" />
                                    )}
                                    {uploading ? 'Uploading...' : 'Add Photos'}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*,.heic,.heif"
                                    onChange={handleUploadPhotos}
                                    className="hidden"
                                />
                                {/* Download ZIP Button */}
                                {hasRealPhotos && (
                                    <button
                                        onClick={handleDownloadPhotos}
                                        disabled={downloadingZip}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                                    >
                                        {downloadingZip ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                        {downloadingZip ? 'Preparing...' : 'Download ZIP'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <img
                                src={photos[currentImageIndex]}
                                alt={property.property_title}
                                className="w-full h-[400px] object-cover object-center"
                                onError={(e) => e.target.src = '/images/property-placeholder.svg'}
                            />

                            {photos.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                        {currentImageIndex + 1} / {photos.length}
                                    </div>
                                </>
                            )}

                            {/* Delete Photo Button (only for real photos) */}
                            {hasRealPhotos && (
                                <button
                                    onClick={() => handleDeletePhoto(currentImageIndex)}
                                    className="absolute top-4 right-4 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full transition-all"
                                    title="Delete this photo"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(property.approval_status)}`}>
                                    {property.approval_status?.toUpperCase()}
                                </span>
                                {property.is_featured && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                        FEATURED
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails with delete buttons */}
                        {photos.length > 1 && (
                            <div className="p-4 flex gap-2 overflow-x-auto">
                                {photos.map((photo, index) => (
                                    <div key={index} className="relative flex-shrink-0 group">
                                        <button
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                index === currentImageIndex ? 'border-[#1A1816]' : 'border-transparent'
                                            }`}
                                        >
                                            <img
                                                src={photo}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.src = '/images/property-placeholder.svg'}
                                            />
                                        </button>
                                        {hasRealPhotos && (
                                            <button
                                                onClick={() => handleDeletePhoto(index)}
                                                className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                title="Delete photo"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* No photos message */}
                        {!hasRealPhotos && (
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <p className="text-sm text-gray-500 text-center">
                                    No photos uploaded yet. Click "Add Photos" to upload.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Property Details */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Home className="w-5 h-5 text-gray-400" />
                            Property Details
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <Bed className="w-5 h-5 text-[#1A1816] mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                                <p className="text-sm text-gray-500">Bedrooms</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <Bath className="w-5 h-5 text-[#1A1816] mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{property.full_bathrooms || 0}{property.half_bathrooms > 0 ? `.${property.half_bathrooms > 1 ? property.half_bathrooms : '5'}` : ''}</p>
                                <p className="text-sm text-gray-500">Bathrooms</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <Square className="w-5 h-5 text-[#1A1816] mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{property.sqft?.toLocaleString() || 'N/A'}</p>
                                <p className="text-sm text-gray-500">Sq Ft</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <Calendar className="w-5 h-5 text-[#1A1816] mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{property.year_built || 'N/A'}</p>
                                <p className="text-sm text-gray-500">Year Built</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Property Type:</span>
                                <span className="ml-2 font-medium text-gray-900">{getPropertyTypeName(property.property_type)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Status:</span>
                                <span className="ml-2 font-medium text-gray-900 capitalize">{property.status?.replace('-', ' ')}</span>
                            </div>
                            {property.lot_size && (
                                <div>
                                    <span className="text-gray-500">Lot Size:</span>
                                    <span className="ml-2 font-medium text-gray-900">{property.lot_size?.toLocaleString()} sq ft{property.acres ? ` (${Number(property.acres).toLocaleString()} Acres)` : ''}</span>
                                </div>
                            )}
                            {property.subdivision && (
                                <div>
                                    <span className="text-gray-500">Subdivision:</span>
                                    <span className="ml-2 font-medium text-gray-900">{property.subdivision}</span>
                                </div>
                            )}
                            {property.developer && (
                                <div>
                                    <span className="text-gray-500">Developer:</span>
                                    <span className="ml-2 font-medium text-gray-900">{property.developer}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            Description
                        </h2>
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {property.description}
                        </p>
                    </div>

                    {/* Features */}
                    {property.features && property.features.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-gray-400" />
                                Features & Amenities
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {property.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Price Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-[#1A1816]" />
                            <span className="text-gray-500 text-sm">Listing Price</span>
                        </div>
                        <p className="text-3xl font-bold text-[#1A1816]">
                            {formatPrice(property.price)}
                        </p>
                    </div>

                    {/* Location */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            Location
                        </h3>
                        <div className="space-y-2 text-sm">
                            <p className="font-medium text-gray-900">{property.address}</p>
                            <p className="text-gray-600">{property.city}, {property.state} {property.zip_code}</p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" />
                            Seller Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <User className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium text-gray-900">{property.contact_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <Mail className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <a href={`mailto:${property.contact_email}`} className="font-medium text-[#1A1816] hover:underline">
                                        {property.contact_email}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <Phone className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <a href={`tel:${property.contact_phone}`} className="font-medium text-[#1A1816] hover:underline">
                                        {property.contact_phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Listing Owner */}
                    {property.user && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Building className="w-5 h-5 text-gray-400" />
                                Listed By
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p className="font-medium text-gray-900">{property.user.name}</p>
                                <p className="text-gray-600">{property.user.email}</p>
                                <p className="text-gray-500">
                                    Listed on {new Date(property.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Stats</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Views</span>
                                <span className="font-medium text-gray-900">{property.views || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Listing Tier</span>
                                <span className="font-medium text-gray-900 capitalize">{property.listing_tier || 'Free'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Active</span>
                                <span className={`font-medium ${property.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                    {property.is_active ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Listing Status & Tour URLs */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Status & Tours</h3>
                        <div className="space-y-4">
                            {/* Listing Status Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Listing Status</label>
                                <select
                                    value={listingStatus}
                                    onChange={(e) => setListingStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                >
                                    <option value="for_sale">For Sale (Active)</option>
                                    <option value="pending">Pending (Under Contract)</option>
                                    <option value="sold">Sold</option>
                                    <option value="inactive">Inactive (Off-Market)</option>
                                </select>
                            </div>

                            {/* Virtual Tour URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Virtual Tour URL</label>
                                <input
                                    type="url"
                                    value={virtualTourUrl}
                                    onChange={(e) => setVirtualTourUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                />
                            </div>

                            {/* Matterport URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Matterport 3D URL</label>
                                <input
                                    type="url"
                                    value={matterportUrl}
                                    onChange={(e) => setMatterportUrl(e.target.value)}
                                    placeholder="https://my.matterport.com/show/?m=..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                />
                            </div>

                            {/* Video Tour URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Video Tour URL</label>
                                <input
                                    type="url"
                                    value={videoTourUrl}
                                    onChange={(e) => setVideoTourUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                />
                            </div>


                            {/* Save Button */}
                            <button
                                onClick={handleSaveDetails}
                                disabled={savingDetails}
                                className="w-full px-4 py-2 bg-[#3355FF] text-white rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
                            >
                                {savingDetails ? 'Saving...' : 'Save Status & Tours'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Approve Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Approve Property</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to approve this property listing? Once approved, it will be visible to the public on the website.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="font-medium text-gray-900">{property.property_title}</p>
                            <p className="text-sm text-gray-500">{property.address}, {property.city}</p>
                            <p className="text-sm font-semibold text-[#1A1816] mt-1">{formatPrice(property.price)}</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={processing}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Approving...' : 'Approve Property'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 p-2 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Reject Property</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Please provide a reason for rejecting this property listing. This will be shared with the seller.
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={processing || !rejectionReason.trim()}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Rejecting...' : 'Reject Property'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Changes Modal */}
            {showChangesModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Request changes</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Tell the seller what needs to be updated before you approve this listing. They'll get an email with your feedback and can resubmit from their dashboard.
                        </p>
                        <textarea
                            value={adminFeedback}
                            onChange={(e) => setAdminFeedback(e.target.value)}
                            placeholder="e.g. Please add at least 4 interior photos and clarify the school district."
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowChangesModal(false); setAdminFeedback(''); }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRequestChanges}
                                disabled={processing || !adminFeedback.trim()}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Sending…' : 'Send feedback'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Photo Modal */}
            {showDeletePhotoModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 p-2 rounded-lg">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Delete Photo</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this photo? This action cannot be undone.
                        </p>
                        {photoToDelete !== null && property.photos && property.photos[photoToDelete] && (
                            <div className="mb-6 rounded-lg overflow-hidden">
                                <img
                                    src={resolvePhotoUrl(property.photos[photoToDelete])}
                                    alt="Photo to delete"
                                    className="w-full h-40 object-cover"
                                />
                            </div>
                        )}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowDeletePhotoModal(false);
                                    setPhotoToDelete(null);
                                }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeletePhoto}
                                disabled={processing}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Deleting...' : 'Delete Photo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Convert to Showcase Modal */}
            {showConvertModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <Award className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Convert to Sold Showcase</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            This will mark the property as <strong>Sold</strong> and add it to the public showcase for marketing purposes.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="font-medium text-gray-900">{property.property_title}</p>
                            <p className="text-sm text-gray-500">{property.address}, {property.city}</p>
                        </div>
                        <div className="space-y-3 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial (optional)</label>
                                <textarea
                                    value={testimonial}
                                    onChange={(e) => setTestimonial(e.target.value)}
                                    placeholder="Enter seller testimonial..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={testimonialName}
                                    onChange={(e) => setTestimonialName(e.target.value)}
                                    placeholder="e.g., John D., Austin TX"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConvertModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConvertToShowcase}
                                disabled={processing}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Converting...' : 'Convert to Showcase'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <OrderYardSignLinkModal
                isOpen={showAdminYardSignModal}
                onClose={() => setShowAdminYardSignModal(false)}
                listings={[property]}
                defaultListingId={property.id}
            />
        </AdminLayout>
    );
}

PropertiesShow.layout = (page) => page;

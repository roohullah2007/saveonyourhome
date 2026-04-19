import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import LocationMapPicker from '@/Components/Properties/LocationMapPicker';
import OpenHouseManager from '@/Components/OpenHouseManager';
import RichTextEditor from '@/Components/RichTextEditor';
import HomeValuationModal from '@/Components/HomeValuationModal';
import {
    ArrowLeft,
    Save,
    Home,
    MapPin,
    DollarSign,
    Bed,
    Bath,
    Square,
    Calendar,
    FileText,
    User,
    Mail,
    Phone,
    Image,
    AlertCircle,
    Upload,
    X,
    Trash2,
    Star,
    Loader2,
    CheckCircle,
    Sparkles,
    Video,
    Code2,
} from 'lucide-react';

export default function EditListing({ property }) {
    const { taxonomies } = usePage().props;
    const txPropertyTypes = taxonomies?.property_types || [];
    const txTransactionTypes = taxonomies?.transaction_types || [];
    const txListingLabels = taxonomies?.listing_labels || [];
    const { data, setData, put, processing, errors } = useForm({
        property_title: property.property_title || '',
        listing_headline: property.listing_headline || '',
        developer: property.developer || '',
        property_type: property.property_type || 'single-family-home',
        status: property.status || 'for-sale',
        listing_status: property.listing_status || 'for_sale',
        transaction_type: property.transaction_type || 'for_sale',
        listing_label: property.listing_label || '',
        price: property.price ?? '',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zip_code: property.zip_code || '',
        county: property.county || '',
        subdivision: property.subdivision || '',
        // School Information
        school_district: property.school_district || '',
        grade_school: property.grade_school || '',
        middle_school: property.middle_school || '',
        high_school: property.high_school || '',
        bedrooms: property.bedrooms ?? '',
        full_bathrooms: property.full_bathrooms ?? '',
        half_bathrooms: property.half_bathrooms ?? '',
        sqft: property.sqft ?? '',
        lot_size: property.lot_size != null ? String(property.lot_size) : '',
        acres: property.acres ?? '',
        zoning: property.zoning ?? '',
        year_built: property.year_built ?? '',
        garage: property.garage ?? '',
        description: property.description || '',
        features: Array.isArray(property.features) ? property.features : [],
        contact_name: property.contact_name || '',
        contact_email: property.contact_email || '',
        contact_phone: property.contact_phone || '',
        virtual_tour_url: property.virtual_tour_url ?? '',
        virtual_tour_type: property.virtual_tour_type || (property.virtual_tour_embed ? 'embed' : 'video'),
        virtual_tour_embed: property.virtual_tour_embed ?? '',
        matterport_url: property.matterport_url ?? '',
        property_dimensions: property.property_dimensions ?? '',
        video_tour_url: property.video_tour_url ?? '',
        // Financials + seller preferences
        annual_property_tax: property.annual_property_tax ?? '',
        has_hoa: !!property.has_hoa,
        hoa_fee: property.hoa_fee ?? '',
        is_motivated_seller: !!property.is_motivated_seller,
        is_licensed_agent: !!property.is_licensed_agent,
        open_to_realtors: property.open_to_realtors ?? true,
        requires_pre_approval: !!property.requires_pre_approval,
        latitude: property.latitude ?? '',
        longitude: property.longitude ?? '',
    });

    // Handler for map location changes (with optional address data from reverse geocoding)
    const handleLocationChange = useCallback((lat, lng, addressData) => {
        setData(data => {
            const updates = {
                ...data,
                latitude: lat,
                longitude: lng,
            };

            // If address data is provided from reverse geocoding, populate the form fields
            if (addressData) {
                if (addressData.address) {
                    updates.address = addressData.address;
                }
                if (addressData.city) {
                    updates.city = addressData.city;
                }
                if (addressData.state) {
                    updates.state = addressData.state;
                }
                if (addressData.zip_code) {
                    updates.zip_code = addressData.zip_code;
                }
            }

            return updates;
        });
    }, [setData]);

    // Photo management state
    const [uploadError, setUploadError] = useState('');
    const [showValuation, setShowValuation] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const fileInputRef = useRef(null);

    // Progressive upload state for new photos
    const [newPhotoPreviews, setNewPhotoPreviews] = useState([]); // Photos being uploaded
    const [isUploading, setIsUploading] = useState(false);

    const photos = property.photos || [];
    const maxPhotos = 50;

    // Calculate total photos (existing + successfully uploaded new ones)
    const successfulNewPhotos = newPhotoPreviews.filter(p => p.serverPath && !p.error);
    const totalPhotos = photos.length + successfulNewPhotos.length;

    const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files || files.length === 0) return;

        setUploadError('');

        // Calculate remaining slots
        const remainingSlots = maxPhotos - totalPhotos;

        if (remainingSlots <= 0) {
            setUploadError(`Maximum ${maxPhotos} photos allowed. Remove some photos to add more.`);
            return;
        }

        // Limit files to remaining slots
        const filesToProcess = files.slice(0, remainingSlots);

        // Validate each file
        const validFiles = [];
        const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
        const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'];

        for (const file of filesToProcess) {
            const fileExtension = file.name.split('.').pop().toLowerCase();

            // Check file type
            if (!supportedTypes.includes(file.type.toLowerCase()) && !supportedExtensions.includes(fileExtension)) {
                setUploadError('Some files skipped. Supported formats: JPG, PNG, GIF, WebP, HEIC (iPhone)');
                continue;
            }

            // Check file size (30MB max)
            if (file.size > 30 * 1024 * 1024) {
                setUploadError('Some files skipped. Maximum file size is 30MB per photo.');
                continue;
            }

            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        setIsUploading(true);

        // Process and upload each file one by one
        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const isHeic = fileExtension === 'heic' || fileExtension === 'heif';
            const previewId = Date.now() + i + Math.random();

            // Create preview first (with uploading status)
            let previewUrl = null;
            if (!isHeic) {
                previewUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (event) => resolve(event.target.result);
                    reader.readAsDataURL(file);
                });
            }

            const newPreview = {
                id: previewId,
                url: previewUrl,
                name: file.name,
                isHeic,
                uploading: true,
                progress: 0,
                error: null,
                serverPath: null
            };

            // Add preview to state immediately
            setNewPhotoPreviews(prev => [...prev, newPreview]);

            // Upload the file
            try {
                const formData = new FormData();
                formData.append('photo', file);

                const response = await axios.post('/upload-photo', formData, {
                    timeout: 120000, // 2 minute timeout for large files
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setNewPhotoPreviews(prev => prev.map(p =>
                            p.id === previewId ? { ...p, progress: percentCompleted } : p
                        ));
                    }
                });

                if (response.data.success) {
                    // Update preview with server path and completed status
                    setNewPhotoPreviews(prev => prev.map(p =>
                        p.id === previewId ? { ...p, uploading: false, progress: 100, serverPath: response.data.path } : p
                    ));
                } else {
                    // Mark as error
                    setNewPhotoPreviews(prev => prev.map(p =>
                        p.id === previewId ? { ...p, uploading: false, error: response.data.message || 'Upload failed' } : p
                    ));
                }
            } catch (error) {
                console.error('Upload error:', error);
                // Mark as error but keep in list
                setNewPhotoPreviews(prev => prev.map(p =>
                    p.id === previewId ? { ...p, uploading: false, error: error.response?.data?.message || 'Upload failed' } : p
                ));
            }
        }

        setIsUploading(false);

        // Clear file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Remove a new photo preview (before saving)
    const handleRemoveNewPhoto = async (previewId) => {
        const preview = newPhotoPreviews.find(p => p.id === previewId);

        // If the photo was uploaded to server, delete it
        if (preview?.serverPath) {
            try {
                await axios.post('/delete-uploaded-photo', {
                    path: preview.serverPath
                });
            } catch (error) {
                console.error('Failed to delete photo from server:', error);
            }
        }

        setNewPhotoPreviews(prev => prev.filter(p => p.id !== previewId));
    };

    // Save new photos to the property
    const handleSaveNewPhotos = () => {
        const successfulPaths = newPhotoPreviews
            .filter(p => p.serverPath && !p.error)
            .map(p => p.serverPath);

        if (successfulPaths.length === 0) {
            setUploadError('No photos to save. Please upload photos first.');
            return;
        }

        router.post(route('dashboard.listings.photos.add', property.id), {
            photo_paths: successfulPaths
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewPhotoPreviews([]);
            },
            onError: () => {
                setUploadError('Failed to save photos. Please try again.');
            }
        });
    };

    const handleDeletePhoto = (index) => {
        setPhotoToDelete(index);
        setShowDeleteModal(true);
    };

    const confirmDeletePhoto = () => {
        if (photoToDelete === null) return;

        setDeleting(true);
        router.post(route('dashboard.listings.photos.remove', property.id), {
            photo_index: photoToDelete,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setShowDeleteModal(false);
                setPhotoToDelete(null);
            },
        });
    };

    const setAsMainPhoto = (index) => {
        if (index === 0) return; // Already main

        // Reorder to put this photo first
        const newOrder = [index];
        for (let i = 0; i < photos.length; i++) {
            if (i !== index) newOrder.push(i);
        }

        router.post(route('dashboard.listings.photos.reorder', property.id), {
            photo_order: newOrder,
        }, {
            preserveScroll: true,
        });
    };

    const propertyTypes = txPropertyTypes.length > 0 ? txPropertyTypes : [
        { value: 'single-family-home', label: 'Single Family Home' },
        { value: 'single_family', label: 'Single Family Home' },
        { value: 'condos-townhomes-co-ops', label: 'Condos/Townhomes/Co-Ops' },
        { value: 'condo', label: 'Condo / Townhome' },
        { value: 'townhouse', label: 'Townhouse' },
        { value: 'multi-family', label: 'Multi-Family' },
        { value: 'multi_family', label: 'Multi-Family' },
        { value: 'land', label: 'Lot/Land' },
        { value: 'farms-ranches', label: 'Farms/Ranches' },
        { value: 'mfd-mobile-homes', label: 'Manufactured/Mobile Homes' },
        { value: 'mobile_home', label: 'Mobile Home' },
    ];

    const statusOptions = txTransactionTypes.length > 0 ? txTransactionTypes : [
        { value: 'for_sale', label: 'For Sale By Owner' },
        { value: 'for_rent', label: 'For Rent By Owner' },
    ];

    const featureOptions = [
        'Central AC',
        'Central Heat',
        'Fireplace',
        'Swimming Pool',
        'Hot Tub',
        'Garage',
        'Covered Patio',
        'Deck',
        'Balcony',
        'Walk-In Closet',
        'Hardwood Floors',
        'Carpet',
        'Tile Floors',
        'Granite Countertops',
        'Stainless Steel Appliances',
        'Updated Kitchen',
        'Updated Bathroom',
        'Security System',
        'Sprinkler System',
        'Fenced Yard',
        'Mature Trees',
        'Mountain View',
        'Lakefront',
        'Waterfront',
        'Golf Course',
        'Guest Quarters',
    ];

    const landFeatureOptions = [
        'Fenced',
        'Mature Trees',
        'Additional Land Available',
        'Corner Lot',
        'Cul-De-Sac',
        'Farm or Ranch',
        'Greenbelt',
        'Golf Course Frontage',
        'Hunting',
        'Livestock Allowed',
        'Mobile Ready',
        'Pond',
        'Sidewalk',
        'Spring/Creek',
        'Water Frontage',
        'Zero Lot Line',
    ];

    const [savingPhotos, setSavingPhotos] = useState(false);

    const handleSubmit = async (e, isDraft = false) => {
        if (e && e.preventDefault) e.preventDefault();

        // Check if there are any photos still uploading
        if (newPhotoPreviews.some(p => p.uploading)) {
            setUploadError('Please wait for all photos to finish uploading before saving.');
            return;
        }

        // If there are new photos to save, save them first
        const successfulPaths = newPhotoPreviews
            .filter(p => p.serverPath && !p.error)
            .map(p => p.serverPath);

        if (successfulPaths.length > 0) {
            setSavingPhotos(true);
            try {
                await new Promise((resolve, reject) => {
                    router.post(route('dashboard.listings.photos.add', property.id), {
                        photo_paths: successfulPaths
                    }, {
                        preserveScroll: true,
                        onSuccess: () => {
                            setNewPhotoPreviews([]);
                            resolve();
                        },
                        onError: () => {
                            reject(new Error('Failed to save photos'));
                        }
                    });
                });
            } catch (error) {
                setSavingPhotos(false);
                setUploadError('Failed to save photos. Please try again.');
                return;
            }
            setSavingPhotos(false);
        }

        // Now save the form data - transform lot_size to integer for database
        put(route('dashboard.listings.update', property.id), {
            preserveScroll: true,
            transform: (formData) => ({
                ...formData,
                lot_size: formData.lot_size ? parseInt(formData.lot_size, 10) : null,
                is_draft: isDraft,
            }),
            onError: (errors) => {
                console.error('Validation errors:', errors);
                // Scroll to top to show error summary
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
        });
    };

    const toggleFeature = (feature) => {
        const currentFeatures = Array.isArray(data.features) ? data.features : [];
        if (currentFeatures.includes(feature)) {
            setData('features', currentFeatures.filter(f => f !== feature));
        } else {
            setData('features', [...currentFeatures, feature]);
        }
    };

    return (
        <UserDashboardLayout title="Edit Listing">
            <Head title={`Edit - ${property.property_title}`} />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href={route('dashboard.listings')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Edit Listing
                    </h1>
                    <p className="text-gray-500">Update your property details</p>
                </div>
            </div>

            {/* Approval Status Alert */}
            {property.approval_status === 'rejected' && property.rejection_reason && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-red-800">Your listing was rejected</p>
                        <p className="text-sm text-red-700 mt-1">{property.rejection_reason}</p>
                        <p className="text-sm text-red-600 mt-2">Please update your listing and it will be reviewed again.</p>
                    </div>
                </div>
            )}

            {property.approval_status === 'pending' && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-yellow-800">Pending Approval</p>
                        <p className="text-sm text-yellow-700 mt-1">Your listing is currently being reviewed. You can still make changes.</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Validation Errors Summary */}
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-red-800">Please fix the following errors:</p>
                                <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                                    {Object.entries(errors).map(([field, message]) => (
                                        <li key={field}><strong>{field.replace(/_/g, ' ')}:</strong> {message}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Basic Information */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Home className="w-5 h-5 text-[#1A1816]" />
                        Basic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Property Title *
                            </label>
                            <input
                                type="text"
                                value={data.property_title}
                                onChange={(e) => setData('property_title', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                    errors.property_title ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., Beautiful 3 Bedroom Family Home"
                            />
                            <p className="text-xs text-gray-500 mt-1">Shown as the main heading on your listing.</p>
                            {errors.property_title && (
                                <p className="text-red-500 text-sm mt-1">{errors.property_title}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Headline</label>
                            <input
                                type="text" maxLength={80}
                                value={data.listing_headline}
                                onChange={(e) => setData('listing_headline', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                placeholder="Short tagline (80 chars max)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Developer / Builder</label>
                            <input
                                type="text"
                                value={data.developer}
                                onChange={(e) => setData('developer', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                placeholder="Optional"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Property Type *
                            </label>
                            <select
                                value={data.property_type}
                                onChange={(e) => setData('property_type', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                    errors.property_type ? 'border-red-500' : 'border-gray-200'
                                }`}
                            >
                                {propertyTypes.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                            {errors.property_type && (
                                <p className="text-red-500 text-sm mt-1">{errors.property_type}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Property Status *
                            </label>
                            <select
                                value={data.transaction_type}
                                onChange={(e) => setData('transaction_type', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                    errors.transaction_type ? 'border-red-500' : 'border-gray-200'
                                }`}
                            >
                                {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                            {errors.transaction_type && (
                                <p className="text-red-500 text-sm mt-1">{errors.transaction_type}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                                <label className="block text-sm font-medium text-gray-700">
                                    <DollarSign className="w-4 h-4 inline-block mr-1" />
                                    Price *
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowValuation(true)}
                                    className="text-xs font-semibold text-[#1A1816] underline underline-offset-2 hover:text-[#3355FF] transition-colors"
                                >
                                    Use Home Valuation Tool
                                </button>
                            </div>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                    errors.price ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., 350000"
                            />
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#1A1816]" />
                        Location
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Street Address *
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                    errors.address ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., 123 Main Street"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                            </label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                    errors.city ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., Oklahoma City"
                            />
                            {errors.city && (
                                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                State *
                            </label>
                            <input
                                type="text"
                                value={data.state}
                                onChange={(e) => setData('state', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                    errors.state ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., OK"
                            />
                            {errors.state && (
                                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP Code *
                            </label>
                            <input
                                type="text"
                                value={data.zip_code}
                                onChange={(e) => setData('zip_code', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                    errors.zip_code ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., 73102"
                            />
                            {errors.zip_code && (
                                <p className="text-red-500 text-sm mt-1">{errors.zip_code}</p>
                            )}
                        </div>

                        {/* Location Map Picker */}
                        <div className="md:col-span-2">
                            <LocationMapPicker
                                latitude={data.latitude}
                                longitude={data.longitude}
                                address={data.address}
                                city={data.city}
                                state={data.state}
                                zipCode={data.zip_code}
                                onLocationChange={handleLocationChange}
                            />
                        </div>
                    </div>
                </div>

                {/* School Information */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#1A1816]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                        School Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                School District *
                            </label>
                            <input
                                type="text"
                                value={data.school_district}
                                onChange={(e) => setData('school_district', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                    errors.school_district ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., Tulsa Public Schools"
                            />
                            {errors.school_district && (
                                <p className="text-red-500 text-sm mt-1">{errors.school_district}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Grade School
                            </label>
                            <input
                                type="text"
                                value={data.grade_school}
                                onChange={(e) => setData('grade_school', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                placeholder="Elementary school name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Middle/Jr High School
                            </label>
                            <input
                                type="text"
                                value={data.middle_school}
                                onChange={(e) => setData('middle_school', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                placeholder="Middle school name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                High School
                            </label>
                            <input
                                type="text"
                                value={data.high_school}
                                onChange={(e) => setData('high_school', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                placeholder="High school name"
                            />
                        </div>
                    </div>
                </div>

                {/* Property Details / Lot Details */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#1A1816]" />
                        {data.property_type === 'land' ? 'Lot Details' : 'Property Details'}
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Only show bedrooms, bathrooms, sqft, year built for non-land properties */}
                        {data.property_type !== 'land' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Bed className="w-4 h-4 inline-block mr-1" />
                                        Bedrooms *
                                    </label>
                                    <input
                                        type="number"
                                        value={data.bedrooms}
                                        onChange={(e) => setData('bedrooms', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                            errors.bedrooms ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        min="0"
                                    />
                                    {errors.bedrooms && (
                                        <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Bath className="w-4 h-4 inline-block mr-1" />
                                        Full Baths *
                                    </label>
                                    <input
                                        type="number"
                                        value={data.full_bathrooms}
                                        onChange={(e) => setData('full_bathrooms', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                            errors.full_bathrooms ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        min="0"
                                    />
                                    {errors.full_bathrooms && (
                                        <p className="text-red-500 text-sm mt-1">{errors.full_bathrooms}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Bath className="w-4 h-4 inline-block mr-1" />
                                        Half Baths
                                    </label>
                                    <input
                                        type="number"
                                        value={data.half_bathrooms}
                                        onChange={(e) => setData('half_bathrooms', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                            errors.half_bathrooms ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        min="0"
                                    />
                                    {errors.half_bathrooms && (
                                        <p className="text-red-500 text-sm mt-1">{errors.half_bathrooms}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Square className="w-4 h-4 inline-block mr-1" />
                                        Sq. Ft.
                                    </label>
                                    <input
                                        type="number"
                                        value={data.sqft}
                                        onChange={(e) => setData('sqft', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                            errors.sqft ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        min="0"
                                    />
                                    {errors.sqft && (
                                        <p className="text-red-500 text-sm mt-1">{errors.sqft}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Calendar className="w-4 h-4 inline-block mr-1" />
                                        Year Built
                                    </label>
                                    <input
                                        type="number"
                                        value={data.year_built}
                                        onChange={(e) => setData('year_built', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                            errors.year_built ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        min="1800"
                                        max={new Date().getFullYear() + 1}
                                    />
                                    {errors.year_built && (
                                        <p className="text-red-500 text-sm mt-1">{errors.year_built}</p>
                                    )}
                                </div>
                            </>
                        )}

                        <div className={data.property_type === 'land' ? '' : 'col-span-2'}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lot Size (Sq Ft) {data.property_type === 'land' ? '*' : ''}
                            </label>
                            <input
                                type="text"
                                value={data.lot_size}
                                onChange={(e) => setData('lot_size', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                    errors.lot_size ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., 43560"
                            />
                            {errors.lot_size && (
                                <p className="text-red-500 text-sm mt-1">{errors.lot_size}</p>
                            )}
                        </div>

                        {data.property_type === 'land' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Acres
                                    </label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        value={data.acres}
                                        onChange={(e) => setData('acres', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                        placeholder="e.g., 5.5"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Acres x 43,560 = sqft</p>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Zoning
                                    </label>
                                    <input
                                        type="text"
                                        value={data.zoning}
                                        onChange={(e) => setData('zoning', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                        placeholder="e.g., Agricultural, Residential"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Property Dimensions
                            </label>
                            <input
                                type="text"
                                value={data.property_dimensions}
                                onChange={(e) => setData('property_dimensions', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                placeholder="e.g., 70x70"
                            />
                            <p className="text-xs text-gray-400 mt-1">Width × depth in feet</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        const res = await axios.post(route('dashboard.listings.generate-description', property.id));
                                        if (res.data?.description) setData('description', res.data.description);
                                    } catch (e) {
                                        alert('Could not generate a description right now. Please try again.');
                                    }
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3355FF] to-[#7c3aed] text-white px-3 py-1 text-xs font-semibold hover:opacity-90"
                            >
                                <Sparkles className="w-3.5 h-3.5" /> Generate with AI
                            </button>
                        </div>
                        <RichTextEditor
                            value={data.description}
                            onChange={(html) => setData('description', html)}
                            placeholder={data.property_type === 'land' ? 'Describe your lot/land…' : 'Describe your property…'}
                            minHeight={200}
                        />
                        <p className="text-xs text-gray-500 mt-1.5">Bold, italic, and lists are supported. Click Generate with AI to start from a quick draft.</p>
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {data.property_type === 'land' ? 'Land Features' : 'Features & Amenities'}
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {(data.property_type === 'land' ? landFeatureOptions : featureOptions).map((feature) => {
                            const features = Array.isArray(data.features) ? data.features : [];
                            const isSelected = features.includes(feature);
                            return (
                                <label
                                    key={feature}
                                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                                        isSelected
                                            ? 'border-[#1A1816] bg-[#1A1816]/5 text-[#1A1816]'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleFeature(feature)}
                                        className="sr-only"
                                    />
                                    <span className={`w-4 h-4 rounded border flex items-center justify-center ${
                                        isSelected
                                            ? 'bg-[#1A1816] border-[#1A1816]'
                                            : 'border-gray-300'
                                    }`}>
                                        {isSelected && (
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </span>
                                    <span className="text-sm">{feature}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Virtual Tours & Media */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#1A1816]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                        Virtual Tours & Media
                    </h2>

                    {/* Virtual Tour Type */}
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Virtual Tour Type</label>
                        <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                            <button
                                type="button"
                                onClick={() => setData('virtual_tour_type', 'video')}
                                className={`inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${data.virtual_tour_type === 'video' ? 'bg-white shadow text-[#111]' : 'text-gray-500'}`}
                            >
                                <Video className="w-4 h-4" /> Video URL
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('virtual_tour_type', 'embed')}
                                className={`inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${data.virtual_tour_type === 'embed' ? 'bg-white shadow text-[#111]' : 'text-gray-500'}`}
                            >
                                <Code2 className="w-4 h-4" /> Embed code
                            </button>
                        </div>
                    </div>

                    {data.virtual_tour_type === 'video' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                            <input
                                type="url"
                                value={data.virtual_tour_url}
                                onChange={(e) => setData('virtual_tour_url', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${errors.virtual_tour_url ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="https://www.youtube.com/watch?v=…  or  https://vimeo.com/…"
                            />
                            <p className="text-xs text-gray-500 mt-1">Paste a YouTube, Vimeo, or direct video URL. We'll render it on your listing detail page.</p>
                            {errors.virtual_tour_url && <p className="text-red-500 text-sm mt-1">{errors.virtual_tour_url}</p>}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Embed code</label>
                            <textarea
                                rows={6}
                                value={data.virtual_tour_embed}
                                onChange={(e) => setData('virtual_tour_embed', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] font-mono text-xs ${errors.virtual_tour_embed ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder={'<iframe src="https://my.matterport.com/show/?m=..." allow="fullscreen"></iframe>'}
                            />
                            <p className="text-xs text-gray-500 mt-1">Paste the iframe/embed code from Matterport, Kuula, iStaging, or your provider. We'll render it responsively.</p>
                            {errors.virtual_tour_embed && <p className="text-red-500 text-sm mt-1">{errors.virtual_tour_embed}</p>}
                        </div>
                    )}
                </div>

                {/* Open Houses */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <OpenHouseManager
                        property={property}
                        openHouses={property.open_houses || []}
                        routePrefix="dashboard.listings"
                    />
                </div>

                {/* Financials & Seller Preferences */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-[#1A1816]" />
                        Financials & Seller Preferences
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Property Tax ($)</label>
                            <input
                                type="number" min="0" step="0.01"
                                value={data.annual_property_tax}
                                onChange={(e) => setData('annual_property_tax', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                placeholder="e.g., 4080"
                            />
                            <p className="text-xs text-gray-500 mt-1">Used in the mortgage calculator for buyers.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">HOA Fee ($ / month)</label>
                            <input
                                type="number" min="0" step="0.01"
                                value={data.hoa_fee}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setData((d) => ({ ...d, hoa_fee: v, has_hoa: v !== '' && parseFloat(v) > 0 }));
                                }}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                placeholder="e.g., 170"
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave blank if no HOA.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                            <input
                                type="text"
                                value={data.county}
                                onChange={(e) => setData('county', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subdivision</label>
                            <input
                                type="text"
                                value={data.subdivision}
                                onChange={(e) => setData('subdivision', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>
                        {data.property_type !== 'land' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Garage (# of cars)</label>
                                <input
                                    type="number" min="0" max="5"
                                    value={data.garage}
                                    onChange={(e) => setData('garage', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Special Notice</label>
                            <select
                                value={data.listing_label}
                                onChange={(e) => setData('listing_label', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            >
                                <option value="">None</option>
                                {(txListingLabels.length > 0 ? txListingLabels : [
                                    { value: 'new_listing', label: 'New Listing' },
                                    { value: 'open_house', label: 'Open House' },
                                    { value: 'motivated_seller', label: 'Motivated Seller' },
                                    { value: 'price_reduction', label: 'Price Reduction' },
                                    { value: 'new_construction', label: 'New Construction' },
                                    { value: 'auction', label: 'Auction' },
                                    { value: 'must_sell_by_date', label: 'Must Sell By Date' },
                                ]).map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Yes/No prefs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-5 border-t border-gray-100">
                        {[
                            { key: 'is_licensed_agent', label: 'Seller is licensed real estate agent' },
                            { key: 'open_to_realtors', label: 'Seller is open to contact from Realtors' },
                            { key: 'requires_pre_approval', label: 'Seller requires a Pre-Approval from a Licensed Mortgage Company Prior to Viewing the Home' },
                            { key: 'is_motivated_seller', label: 'Show a Motivated Seller badge on the listing' },
                        ].map((f) => {
                            const on = !!data[f.key];
                            return (
                                <div key={f.key}>
                                    <div className="text-sm font-semibold text-gray-800 mb-2.5 leading-snug">{f.label}</div>
                                    <div className="flex items-center gap-6">
                                        {[{v: true, lbl: 'Yes'}, {v: false, lbl: 'No'}].map((r) => (
                                            <button
                                                key={r.lbl}
                                                type="button"
                                                onClick={() => setData(f.key, r.v)}
                                                className="inline-flex items-center gap-2 select-none"
                                            >
                                                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${on === r.v ? 'border-[#3355FF]' : 'border-gray-300'}`}>
                                                    {on === r.v && <span className="h-2.5 w-2.5 rounded-full bg-[#3355FF]" />}
                                                </span>
                                                <span className="text-sm text-gray-700">{r.lbl}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#1A1816]" />
                        Contact Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <User className="w-4 h-4 inline-block mr-1" />
                                Contact Name *
                            </label>
                            <input
                                type="text"
                                value={data.contact_name}
                                onChange={(e) => setData('contact_name', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                    errors.contact_name ? 'border-red-500' : 'border-gray-200'
                                }`}
                            />
                            {errors.contact_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.contact_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Mail className="w-4 h-4 inline-block mr-1" />
                                Contact Email *
                            </label>
                            <input
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                    errors.contact_email ? 'border-red-500' : 'border-gray-200'
                                }`}
                            />
                            {errors.contact_email && (
                                <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Phone className="w-4 h-4 inline-block mr-1" />
                                Contact Phone *
                            </label>
                            <input
                                type="tel"
                                value={data.contact_phone}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] ${
                                    errors.contact_phone ? 'border-red-500' : 'border-gray-200'
                                }`}
                            />
                            {errors.contact_phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.contact_phone}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Photo Management */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Image className="w-5 h-5 text-[#1A1816]" />
                            Photos ({totalPhotos}/{maxPhotos})
                        </h2>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading || totalPhotos >= maxPhotos}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3355FF] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
                        >
                            {isUploading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4" />
                            )}
                            {isUploading ? 'Uploading...' : 'Add Photos'}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,.heic,.heif"
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />
                    </div>

                    {/* Upload Error */}
                    {uploadError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-red-700">{uploadError}</span>
                        </div>
                    )}

                    {/* Upload Progress Summary */}
                    {newPhotoPreviews.length > 0 && (
                        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                {newPhotoPreviews.some(p => p.uploading) && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Loader2 className="w-4 h-4 animate-spin text-[#1A1816]" />
                                        <span>Uploading {newPhotoPreviews.filter(p => p.uploading).length} photo(s)...</span>
                                    </div>
                                )}
                                {newPhotoPreviews.some(p => p.error) && (
                                    <div className="flex items-center gap-2 text-sm text-red-600">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{newPhotoPreviews.filter(p => p.error).length} failed</span>
                                    </div>
                                )}
                                {successfulNewPhotos.length > 0 && !newPhotoPreviews.some(p => p.uploading) && (
                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>{successfulNewPhotos.length} ready to save</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* New Photos Grid (uploads in progress) */}
                    {newPhotoPreviews.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">New Photos (not yet saved)</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {newPhotoPreviews.map((preview) => (
                                    <div key={preview.id} className={`relative aspect-video rounded-xl overflow-hidden bg-gray-100 group ${preview.error ? 'ring-2 ring-red-500' : ''}`}>
                                        {preview.isHeic ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-2">
                                                <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                                                    <Image className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <span className="text-xs text-gray-500 text-center truncate w-full px-1">{preview.name}</span>
                                                <span className="text-[10px] text-green-600 mt-1">HEIC</span>
                                            </div>
                                        ) : (
                                            <img
                                                src={preview.url}
                                                alt={preview.name}
                                                className="w-full h-full object-cover object-center"
                                            />
                                        )}

                                        {/* Upload Progress Overlay */}
                                        {preview.uploading && (
                                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                                                <div className="w-3/4 bg-white/30 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="h-full bg-white rounded-full transition-all duration-300"
                                                        style={{ width: `${preview.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-white text-xs mt-1 font-medium">{preview.progress}%</span>
                                            </div>
                                        )}

                                        {/* Error Overlay */}
                                        {preview.error && !preview.uploading && (
                                            <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center p-2">
                                                <AlertCircle className="w-6 h-6 text-white mb-1" />
                                                <span className="text-white text-xs text-center font-medium">Upload Failed</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveNewPhoto(preview.id)}
                                                    className="mt-2 bg-white text-red-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-50 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}

                                        {/* Success Indicator */}
                                        {!preview.uploading && !preview.error && preview.serverPath && (
                                            <div className="absolute top-2 right-2 bg-green-500 p-1 rounded-full">
                                                <CheckCircle className="w-3 h-3 text-white" />
                                            </div>
                                        )}

                                        {/* Remove button - visible on hover when not uploading */}
                                        {!preview.uploading && !preview.error && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveNewPhoto(preview.id)}
                                                    className="bg-white hover:bg-red-50 text-red-600 p-2 rounded-full transition-colors"
                                                    title="Remove photo"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Save Photos Button - Prominent */}
                            {successfulNewPhotos.length > 0 && !newPhotoPreviews.some(p => p.uploading) && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-green-800">
                                                    {successfulNewPhotos.length} photo(s) ready to save
                                                </p>
                                                <p className="text-xs text-green-600 mt-0.5">
                                                    Click "Save Photos" or "Save Changes" at the bottom to add them to your listing
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSaveNewPhotos}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Save Photos
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Existing Photos Grid */}
                    {photos.length > 0 ? (
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Saved Photos</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {photos.map((photo, index) => (
                                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 group">
                                        <img
                                            src={photo}
                                            alt={`Property photo ${index + 1}`}
                                            className="w-full h-full object-cover object-center"
                                            onError={(e) => e.target.src = '/images/property-placeholder.svg'}
                                        />
                                        {/* Main Photo Badge */}
                                        {index === 0 && (
                                            <span className="absolute top-2 left-2 bg-[#3355FF] text-white text-xs px-2 py-1 rounded-full font-medium">
                                                Main Photo
                                            </span>
                                        )}
                                        {/* Action Buttons - visible on hover */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            {index !== 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setAsMainPhoto(index)}
                                                    className="bg-white hover:bg-yellow-50 text-gray-700 p-2 rounded-full transition-colors"
                                                    title="Set as main photo"
                                                >
                                                    <Star className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleDeletePhoto(index)}
                                                className="bg-white hover:bg-red-50 text-red-600 p-2 rounded-full transition-colors"
                                                title="Delete photo"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : newPhotoPreviews.length === 0 && (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                            <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 mb-2">No photos uploaded yet</p>
                            <p className="text-sm text-gray-400">Click "Add Photos" to upload images for your listing</p>
                        </div>
                    )}

                    {/* Email Photos Option */}
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                                <Mail className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-blue-800">
                                    Have many photos or large files?
                                </p>
                                <p className="text-sm text-blue-700 mt-1">
                                    Email up to 50 photos to{' '}
                                    <a href="mailto:photos@saveonyourhome.com" className="font-medium underline hover:text-blue-900">
                                        photos@saveonyourhome.com
                                    </a>{' '}
                                    with your property address in the subject line and we'll add them for you.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Supported Formats */}
                    <p className="text-xs text-gray-400 mt-3">
                        Supported formats: JPG, PNG, GIF, WebP, HEIC (iPhone). Max 30MB per file. Photos are uploaded one by one with progress tracking.
                    </p>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white rounded-2xl shadow-sm p-6">
                    <Link
                        href={route('dashboard.listings')}
                        className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors text-center"
                    >
                        Cancel
                    </Link>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={processing || savingPhotos || isUploading}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Save as draft
                        </button>
                        <button
                            type="submit"
                            disabled={processing || savingPhotos || isUploading}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#3355FF] text-white rounded-xl font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
                        >
                            {(processing || savingPhotos) ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {savingPhotos ? 'Saving Photos…' : processing ? 'Saving…' : (property.approval_status === 'draft' || property.approval_status === 'changes_requested' || property.approval_status === 'rejected' ? 'Publish for review' : 'Save changes')}
                        </button>
                    </div>
                </div>
                {(property.approval_status === 'draft' || property.approval_status === 'changes_requested' || property.approval_status === 'rejected') && (
                    <p className="text-xs text-center text-gray-500 pt-2">
                        Clicking "Publish for review" will submit your listing to an admin for approval.
                    </p>
                )}
            </form>

            {/* Delete Photo Modal */}
            {showDeleteModal && (
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
                        {photoToDelete !== null && photos[photoToDelete] && (
                            <div className="mb-6 rounded-lg overflow-hidden">
                                <img
                                    src={photos[photoToDelete]}
                                    alt="Photo to delete"
                                    className="w-full h-40 object-cover object-center"
                                />
                            </div>
                        )}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setPhotoToDelete(null);
                                }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeletePhoto}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Photo'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <HomeValuationModal isOpen={showValuation} onClose={() => setShowValuation(false)} />
        </UserDashboardLayout>
    );
}

EditListing.layout = (page) => page;

import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import LocationMapPicker from '@/Components/Properties/LocationMapPicker';
import OpenHouseManager from '@/Components/OpenHouseManager';
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
    Loader2,
    CheckCircle,
    Eye,
    Video,
    Globe,
    Users,
    Star
} from 'lucide-react';

export default function EditProperty({ property, users = [], listingStatuses = {} }) {
    const [saving, setSaving] = useState(false);
    const pageErrors = usePage().props.errors || {};
    const { data, setData, put, processing } = useForm({
        user_id: property.user_id || '',
        property_title: property.property_title || '',
        property_type: property.property_type || 'single-family-home',
        status: property.status || 'for-sale',
        listing_status: property.listing_status || 'for_sale',
        price: property.price || '',
        address: property.address || '',
        city: property.city || '',
        state: property.state || 'Oklahoma',
        zip_code: property.zip_code || '',
        subdivision: property.subdivision || '',
        // School Information
        school_district: property.school_district || '',
        grade_school: property.grade_school || '',
        middle_school: property.middle_school || '',
        high_school: property.high_school || '',
        bedrooms: property.bedrooms ?? 0,
        full_bathrooms: property.full_bathrooms ?? 0,
        half_bathrooms: property.half_bathrooms ?? 0,
        sqft: property.sqft || '',
        lot_size: property.lot_size != null ? String(property.lot_size) : '',
        acres: property.acres ?? '',
        zoning: property.zoning || '',
        year_built: property.year_built || '',
        description: property.description || '',
        features: Array.isArray(property.features) ? property.features : [],
        contact_name: property.contact_name || '',
        contact_email: property.contact_email || '',
        contact_phone: property.contact_phone || '',
        is_featured: property.is_featured || false,
        is_active: property.is_active ?? true,
        virtual_tour_url: property.virtual_tour_url || '',
        matterport_url: property.matterport_url || '',
        video_tour_url: property.video_tour_url || '',
        mls_virtual_tour_url: property.mls_virtual_tour_url || '',
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

            if (addressData) {
                if (addressData.address) updates.address = addressData.address;
                if (addressData.city) updates.city = addressData.city;
                if (addressData.state) updates.state = addressData.state;
                if (addressData.zip_code) updates.zip_code = addressData.zip_code;
            }

            return updates;
        });
    }, [setData]);

    const [uploadError, setUploadError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [newPhotoPreviews, setNewPhotoPreviews] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
    const [mainPhotoSource, setMainPhotoSource] = useState('existing');
    const [mainNewPhotoId, setMainNewPhotoId] = useState(null);
    const fileInputRef = useRef(null);

    const photos = property.photos || [];
    const maxPhotos = 50;
    const successfulNewPhotos = newPhotoPreviews.filter(p => p.serverPath && !p.error);
    const totalPhotos = photos.length + successfulNewPhotos.length;

    const handleSetMainExisting = (index) => {
        setMainPhotoSource('existing');
        setMainPhotoIndex(index);
        setMainNewPhotoId(null);
    };

    const handleSetMainNew = (previewId) => {
        setMainPhotoSource('new');
        setMainNewPhotoId(previewId);
    };

    const toggleFeature = (feature) => {
        const currentFeatures = Array.isArray(data.features) ? data.features : [];
        if (currentFeatures.includes(feature)) {
            setData('features', currentFeatures.filter(f => f !== feature));
        } else {
            setData('features', [...currentFeatures, feature]);
        }
    };

    const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files || files.length === 0) return;

        setUploadError('');
        const remainingSlots = maxPhotos - totalPhotos;

        if (remainingSlots <= 0) {
            setUploadError(`Maximum ${maxPhotos} photos allowed.`);
            return;
        }

        const filesToProcess = files.slice(0, remainingSlots);
        const validFiles = [];
        const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];

        for (const file of filesToProcess) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!supportedTypes.includes(file.type.toLowerCase()) && !['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'].includes(fileExtension)) {
                continue;
            }
            if (file.size > 30 * 1024 * 1024) continue;
            validFiles.push(file);
        }

        if (validFiles.length === 0) return;
        setIsUploading(true);

        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            const previewId = Date.now() + i + Math.random();
            const isHeic = ['heic', 'heif'].includes(file.name.split('.').pop().toLowerCase());

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

            setNewPhotoPreviews(prev => [...prev, newPreview]);

            try {
                const formData = new FormData();
                formData.append('photo', file);

                const response = await axios.post('/upload-photo', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setNewPhotoPreviews(prev => prev.map(p =>
                            p.id === previewId ? { ...p, progress } : p
                        ));
                    }
                });

                if (response.data.success) {
                    setNewPhotoPreviews(prev => prev.map(p =>
                        p.id === previewId ? { ...p, uploading: false, serverPath: response.data.path, url: response.data.path } : p
                    ));
                } else {
                    setNewPhotoPreviews(prev => prev.map(p =>
                        p.id === previewId ? { ...p, uploading: false, error: response.data.message || 'Upload failed' } : p
                    ));
                }
            } catch (error) {
                setNewPhotoPreviews(prev => prev.map(p =>
                    p.id === previewId ? { ...p, uploading: false, error: 'Upload failed' } : p
                ));
            }
        }

        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveNewPhoto = async (preview) => {
        if (preview.serverPath) {
            try {
                await axios.post('/delete-uploaded-photo', { path: preview.serverPath });
            } catch (e) { }
        }
        if (mainPhotoSource === 'new' && mainNewPhotoId === preview.id) {
            setMainPhotoSource('existing');
            setMainPhotoIndex(0);
            setMainNewPhotoId(null);
        }
        setNewPhotoPreviews(prev => prev.filter(p => p.id !== preview.id));
    };

    const handleDeleteExistingPhoto = (index) => {
        setPhotoToDelete(index);
        setShowDeleteModal(true);
    };

    const confirmDeletePhoto = async () => {
        if (photoToDelete === null) return;
        setDeleting(true);

        try {
            await router.post(route('admin.properties.remove-photo', property.id), {
                photo_index: photoToDelete
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteModal(false);
                    // Adjust mainPhotoIndex after deletion
                    if (mainPhotoSource === 'existing') {
                        if (photoToDelete === mainPhotoIndex) {
                            setMainPhotoIndex(0);
                        } else if (photoToDelete < mainPhotoIndex) {
                            setMainPhotoIndex(prev => prev - 1);
                        }
                    }
                    setPhotoToDelete(null);
                },
                onFinish: () => setDeleting(false)
            });
        } catch (error) {
            setDeleting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPhotoPaths = successfulNewPhotos.map(p => p.serverPath);
        let reorderedExisting = [...photos];
        let reorderedNew = [...newPhotoPaths];

        if (mainPhotoSource === 'existing' && mainPhotoIndex > 0 && mainPhotoIndex < photos.length) {
            const [mainPhoto] = reorderedExisting.splice(mainPhotoIndex, 1);
            reorderedExisting.unshift(mainPhoto);
        } else if (mainPhotoSource === 'new' && mainNewPhotoId) {
            const mainPreview = successfulNewPhotos.find(p => p.id === mainNewPhotoId);
            if (mainPreview) {
                reorderedNew = reorderedNew.filter(path => path !== mainPreview.serverPath);
                reorderedExisting.unshift(mainPreview.serverPath);
            }
        }

        const allPhotos = [...reorderedExisting, ...reorderedNew];

        // Check if this is a land property
        const isLand = data.property_type === 'land';

        // Ensure numeric fields are numbers, not empty strings
        // For land properties, set bedrooms/bathrooms/sqft to 0 (they don't apply)
        const submitData = {
            ...data,
            photos: allPhotos,
            bedrooms: isLand ? 0 : (parseInt(data.bedrooms) || 0),
            full_bathrooms: isLand ? 0 : (parseInt(data.full_bathrooms) || 0),
            half_bathrooms: isLand ? 0 : (parseInt(data.half_bathrooms) || 0),
            sqft: isLand ? 0 : (parseInt(data.sqft) || 0),
            price: parseFloat(data.price) || 0,
            lot_size: data.lot_size ? parseInt(data.lot_size) : null,
            year_built: isLand ? null : (data.year_built ? parseInt(data.year_built) : null),
            // Ensure URL fields are explicitly included (keep value or empty string)
            virtual_tour_url: data.virtual_tour_url || '',
            matterport_url: data.matterport_url || '',
            video_tour_url: data.video_tour_url || '',
            mls_virtual_tour_url: data.mls_virtual_tour_url || '',
        };

        setSaving(true);
        router.put(route('admin.properties.update', property.id), submitData, {
            preserveScroll: true,
            onSuccess: () => {
                setNewPhotoPreviews([]);
                setSaving(false);
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                setSaving(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onFinish: () => {
                setSaving(false);
            },
        });
    };

    const propertyTypes = [
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

    const statusOptions = [
        { value: 'for_sale', label: 'Active (For Sale)' },
        { value: 'pending', label: 'Pending (Under Contract)' },
        { value: 'sold', label: 'Sold' },
        { value: 'inactive', label: 'Inactive (Temporarily Off-Market)' },
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

    return (
        <AdminLayout title="Edit Property">
            <Head title={`Edit: ${property.property_title} - Admin`} />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Link
                        href={route('admin.properties.show', property.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
                        <p className="text-sm text-gray-500">{property.address}, {property.city}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link
                        href={route('admin.properties.show', property.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        <Eye className="w-4 h-4" />
                        View Details
                    </Link>
                    <a
                        href={`/properties/${property.slug || property.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        <Globe className="w-4 h-4" />
                        View Public Page
                    </a>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Summary */}
                {Object.keys(pageErrors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-red-800">Please fix the following errors:</h3>
                                <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                                    {Object.entries(pageErrors).map(([field, message]) => (
                                        <li key={field}>{message}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Assign to User */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#1A1816]" />
                        Property Owner
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned User *</label>
                        <select
                            value={data.user_id}
                            onChange={e => setData('user_id', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                        >
                            <option value="">Select a user...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email}){user.role === 'admin' ? ' - Admin' : ''}
                                </option>
                            ))}
                        </select>
                        {pageErrors.user_id && <p className="text-red-500 text-sm mt-1">{pageErrors.user_id}</p>}
                        {property.user && (
                            <p className="text-xs text-gray-400 mt-1">
                                Currently owned by: {property.user.name} ({property.user.email})
                            </p>
                        )}
                    </div>
                </div>

                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Home className="w-5 h-5 text-[#1A1816]" />
                        Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                            <input
                                type="text"
                                value={data.property_title}
                                onChange={e => setData('property_title', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                            {pageErrors.property_title && <p className="text-red-500 text-sm mt-1">{pageErrors.property_title}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                            <select
                                value={data.property_type}
                                onChange={e => setData('property_type', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            >
                                {propertyTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Status *</label>
                            <select
                                value={data.listing_status}
                                onChange={(e) => {
                                    const newListingStatus = e.target.value;
                                    const statusMap = {
                                        'for_sale': 'for-sale',
                                        'pending': 'pending',
                                        'sold': 'sold',
                                        'inactive': 'inactive',
                                    };
                                    setData(data => ({
                                        ...data,
                                        listing_status: newListingStatus,
                                        status: statusMap[newListingStatus] || 'for-sale'
                                    }));
                                }}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            >
                                {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                            {pageErrors.listing_status && <p className="text-red-500 text-sm mt-1">{pageErrors.listing_status}</p>}
                            {data.listing_status === 'inactive' && (
                                <p className="text-sm text-amber-600 mt-1">This listing will be hidden from public search while inactive.</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                />
                            </div>
                            {pageErrors.price && <p className="text-red-500 text-sm mt-1">{pageErrors.price}</p>}
                        </div>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={e => setData('is_featured', e.target.checked)}
                                    className="w-4 h-4 text-[#1A1816] border-gray-300 rounded focus:ring-[#1A1816]"
                                />
                                <span className="text-sm font-medium text-gray-700">Featured</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 text-[#1A1816] border-gray-300 rounded focus:ring-[#1A1816]"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#1A1816]" />
                        Location
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                            {pageErrors.address && <p className="text-red-500 text-sm mt-1">{pageErrors.address}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={e => setData('city', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                            {pageErrors.city && <p className="text-red-500 text-sm mt-1">{pageErrors.city}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input
                                type="text"
                                value={data.state}
                                onChange={e => setData('state', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                            <input
                                type="text"
                                value={data.zip_code}
                                onChange={e => setData('zip_code', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                            {pageErrors.zip_code && <p className="text-red-500 text-sm mt-1">{pageErrors.zip_code}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subdivision</label>
                            <input
                                type="text"
                                value={data.subdivision}
                                onChange={e => setData('subdivision', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
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
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#1A1816]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                        School Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">School District *</label>
                            <input
                                type="text"
                                value={data.school_district}
                                onChange={e => setData('school_district', e.target.value)}
                                placeholder="e.g., Tulsa Public Schools"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                            {pageErrors.school_district && <p className="text-red-500 text-sm mt-1">{pageErrors.school_district}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Grade School</label>
                            <input
                                type="text"
                                value={data.grade_school}
                                onChange={e => setData('grade_school', e.target.value)}
                                placeholder="Elementary school name"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Middle/Jr High School</label>
                            <input
                                type="text"
                                value={data.middle_school}
                                onChange={e => setData('middle_school', e.target.value)}
                                placeholder="Middle school name"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">High School</label>
                            <input
                                type="text"
                                value={data.high_school}
                                onChange={e => setData('high_school', e.target.value)}
                                placeholder="High school name"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>
                    </div>
                </div>

                {/* Property Details / Lot Details */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Square className="w-5 h-5 text-[#1A1816]" />
                        {data.property_type === 'land' ? 'Lot Details' : 'Property Details'}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Only show bedrooms, bathrooms, sqft, year built for non-land properties */}
                        {data.property_type !== 'land' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                                    <input
                                        type="number"
                                        value={data.bedrooms}
                                        onChange={e => setData('bedrooms', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Baths</label>
                                    <input
                                        type="number"
                                        value={data.full_bathrooms}
                                        onChange={e => setData('full_bathrooms', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Half Baths</label>
                                    <input
                                        type="number"
                                        value={data.half_bathrooms}
                                        onChange={e => setData('half_bathrooms', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sqft</label>
                                    <input
                                        type="number"
                                        value={data.sqft}
                                        onChange={e => setData('sqft', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                                    <input
                                        type="number"
                                        value={data.year_built}
                                        onChange={e => setData('year_built', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                    />
                                </div>
                            </>
                        )}
                        <div className={data.property_type === 'land' ? '' : ''}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lot Size (Sq Ft) {data.property_type === 'land' ? '*' : ''}
                            </label>
                            <input
                                type="text"
                                value={data.lot_size}
                                onChange={e => setData('lot_size', e.target.value)}
                                placeholder="e.g., 43560"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>

                        {data.property_type === 'land' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Acres</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        value={data.acres}
                                        onChange={e => setData('acres', e.target.value)}
                                        placeholder="e.g., 5.5"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Acres x 43,560 = sqft</p>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Zoning</label>
                                    <input
                                        type="text"
                                        value={data.zoning}
                                        onChange={e => setData('zoning', e.target.value)}
                                        placeholder="e.g., Agricultural, Residential"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={5}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            placeholder={data.property_type === 'land' ? 'Describe your lot/land...' : 'Describe your property...'}
                        />
                        {pageErrors.description && <p className="text-red-500 text-sm mt-1">{pageErrors.description}</p>}
                    </div>
                </div>

                {/* Virtual Tours */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Video className="w-5 h-5 text-[#1A1816]" />
                        Virtual Tours & Media
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Virtual Tour URL</label>
                            <input
                                type="url"
                                value={data.virtual_tour_url}
                                onChange={e => setData('virtual_tour_url', e.target.value)}
                                placeholder="https://..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Matterport 3D URL</label>
                            <input
                                type="url"
                                value={data.matterport_url}
                                onChange={e => setData('matterport_url', e.target.value)}
                                placeholder="https://my.matterport.com/show/?m=..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Video Tour URL</label>
                            <input
                                type="url"
                                value={data.video_tour_url}
                                onChange={e => setData('video_tour_url', e.target.value)}
                                placeholder="https://..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white rounded-xl shadow-sm p-6">
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

                {/* Open Houses */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <OpenHouseManager
                        property={property}
                        openHouses={property.open_houses || []}
                        routePrefix="admin.properties"
                    />
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#1A1816]" />
                        Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                            <input
                                type="text"
                                value={data.contact_name}
                                onChange={e => setData('contact_name', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={data.contact_email}
                                onChange={e => setData('contact_email', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={data.contact_phone}
                                onChange={e => setData('contact_phone', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>
                    </div>
                </div>

                {/* Photos */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <Image className="w-5 h-5 text-[#1A1816]" />
                        Photos ({totalPhotos}/{maxPhotos})
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">Hover over a photo and click "Set as Main" to choose the primary listing image.</p>

                    {uploadError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {uploadError}
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                        {/* Existing Photos */}
                        {photos.map((photo, index) => {
                            const isMain = mainPhotoSource === 'existing' && index === mainPhotoIndex;
                            return (
                            <div key={`existing-${index}`} className={`relative group aspect-square rounded-lg overflow-hidden bg-gray-100 ${isMain ? 'ring-2 ring-[#1A1816]' : ''}`}>
                                <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover object-center" />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteExistingPhoto(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                                {isMain && (
                                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#1A1816] text-white text-xs rounded flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />Main
                                    </span>
                                )}
                                {!isMain && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetMainExisting(index)}
                                        className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                    >
                                        <Star className="w-3 h-3" />Set as Main
                                    </button>
                                )}
                            </div>
                            );
                        })}

                        {/* New Photo Previews */}
                        {newPhotoPreviews.map((preview, idx) => {
                            const isMain = (mainPhotoSource === 'new' && preview.id === mainNewPhotoId) ||
                                (mainPhotoSource === 'existing' && photos.length === 0 && idx === 0 && !mainNewPhotoId);
                            return (
                            <div key={preview.id} className={`relative group aspect-square rounded-lg overflow-hidden bg-gray-100 ${isMain && preview.serverPath ? 'ring-2 ring-[#1A1816]' : ''}`}>
                                {preview.url ? (
                                    <img src={preview.url} alt={preview.name} className="w-full h-full object-cover object-center" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Image className="w-8 h-8" />
                                    </div>
                                )}
                                {preview.uploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1" />
                                            <span className="text-xs">{preview.progress}%</span>
                                        </div>
                                    </div>
                                )}
                                {preview.error && (
                                    <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                                        <AlertCircle className="w-6 h-6 text-white" />
                                    </div>
                                )}
                                {isMain && preview.serverPath && (
                                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#1A1816] text-white text-xs rounded flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />Main
                                    </span>
                                )}
                                {!isMain && preview.serverPath && !preview.uploading && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetMainNew(preview.id)}
                                        className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                    >
                                        <Star className="w-3 h-3" />Set as Main
                                    </button>
                                )}
                                {!preview.uploading && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveNewPhoto(preview)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                            );
                        })}

                        {/* Upload Button */}
                        {totalPhotos < maxPhotos && (
                            <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#1A1816] cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-[#555] transition-colors">
                                <Upload className="w-6 h-6 mb-1" />
                                <span className="text-xs">Add Photos</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*,.heic,.heif"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Link
                        href={route('admin.properties.show', property.id)}
                        className="px-6 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving || isUploading}
                        className="px-6 py-2 bg-[#1A1816] text-white rounded-lg hover:bg-[#111111] disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* Delete Photo Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Photo</h3>
                        <p className="text-gray-600 mb-4">Are you sure you want to delete this photo?</p>
                        {photoToDelete !== null && photos[photoToDelete] && (
                            <img src={photos[photoToDelete]} alt="Photo to delete" className="w-full h-32 object-cover object-center rounded-lg mb-4" />
                        )}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setPhotoToDelete(null); }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeletePhoto}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

EditProperty.layout = (page) => page;

import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import LocationMapPicker from '@/Components/Properties/LocationMapPicker';
import {
    ArrowLeft,
    Save,
    Home,
    MapPin,
    DollarSign,
    Square,
    User,
    Image,
    AlertCircle,
    Upload,
    X,
    Loader2,
    CheckCircle,
    Video,
    Users,
    Star
} from 'lucide-react';

export default function CreateProperty({ users = [], listingStatuses = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        property_title: '',
        property_type: 'single-family-home',
        status: 'for-sale',
        listing_status: 'for_sale',
        price: '',
        address: '',
        city: '',
        state: 'Oklahoma',
        zip_code: '',
        subdivision: '',
        school_district: '',
        grade_school: '',
        middle_school: '',
        high_school: '',
        bedrooms: 0,
        full_bathrooms: 0,
        half_bathrooms: 0,
        sqft: '',
        lot_size: '',
        acres: '',
        zoning: '',
        year_built: '',
        description: '',
        features: [],
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        is_featured: false,
        is_active: true,
        virtual_tour_url: '',
        matterport_url: '',
        video_tour_url: '',
        mls_virtual_tour_url: '',
        latitude: '',
        longitude: '',
    });

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
    const [newPhotoPreviews, setNewPhotoPreviews] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [mainPhotoId, setMainPhotoId] = useState(null);
    const fileInputRef = useRef(null);

    const maxPhotos = 50;
    const successfulNewPhotos = newPhotoPreviews.filter(p => p.serverPath && !p.error);
    const totalPhotos = successfulNewPhotos.length;

    const handleSetMainPhoto = (previewId) => {
        setMainPhotoId(previewId);
    };

    // Auto-fill contact info when user is selected
    const handleUserChange = (userId) => {
        setData(data => {
            const updates = { ...data, user_id: userId };
            if (userId) {
                const selectedUser = users.find(u => u.id === parseInt(userId));
                if (selectedUser) {
                    updates.contact_name = selectedUser.name || '';
                    updates.contact_email = selectedUser.email || '';
                    updates.contact_phone = selectedUser.phone || '';
                }
            }
            return updates;
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
        if (mainPhotoId === preview.id) {
            setMainPhotoId(null);
        }
        setNewPhotoPreviews(prev => prev.filter(p => p.id !== preview.id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let orderedPhotos = [...successfulNewPhotos];
        if (mainPhotoId) {
            const mainIndex = orderedPhotos.findIndex(p => p.id === mainPhotoId);
            if (mainIndex > 0) {
                const [mainPhoto] = orderedPhotos.splice(mainIndex, 1);
                orderedPhotos.unshift(mainPhoto);
            }
        }
        const newPhotoPaths = orderedPhotos.map(p => p.serverPath);
        const isLand = data.property_type === 'land';

        const submitData = {
            ...data,
            photos: newPhotoPaths,
            bedrooms: isLand ? 0 : (parseInt(data.bedrooms) || 0),
            full_bathrooms: isLand ? 0 : (parseInt(data.full_bathrooms) || 0),
            half_bathrooms: isLand ? 0 : (parseInt(data.half_bathrooms) || 0),
            sqft: isLand ? 0 : (parseInt(data.sqft) || 0),
            price: parseFloat(data.price) || 0,
            lot_size: data.lot_size ? parseInt(data.lot_size) : null,
            year_built: isLand ? null : (data.year_built ? parseInt(data.year_built) : null),
            virtual_tour_url: data.virtual_tour_url || '',
            matterport_url: data.matterport_url || '',
            video_tour_url: data.video_tour_url || '',
            mls_virtual_tour_url: data.mls_virtual_tour_url || '',
        };

        router.post(route('admin.properties.store'), submitData, {
            preserveScroll: true,
            onSuccess: () => {
                setNewPhotoPreviews([]);
            }
        });
    };

    const propertyTypes = [
        { value: 'single-family-home', label: 'Single Family Home' },
        { value: 'condos-townhomes-co-ops', label: 'Condos/Townhomes/Co-Ops' },
        { value: 'multi-family', label: 'Multi-Family' },
        { value: 'land', label: 'Lot/Land' },
        { value: 'farms-ranches', label: 'Farms/Ranches' },
        { value: 'mfd-mobile-homes', label: 'Manufactured/Mobile Homes' },
    ];

    const statusOptions = [
        { value: 'for_sale', label: 'Active (For Sale)' },
        { value: 'pending', label: 'Pending (Under Contract)' },
        { value: 'sold', label: 'Sold' },
        { value: 'inactive', label: 'Inactive (Temporarily Off-Market)' },
    ];

    const featureOptions = [
        'Central AC', 'Central Heat', 'Fireplace', 'Swimming Pool', 'Hot Tub',
        'Garage', 'Covered Patio', 'Deck', 'Balcony', 'Walk-In Closet',
        'Hardwood Floors', 'Carpet', 'Tile Floors', 'Granite Countertops',
        'Stainless Steel Appliances', 'Updated Kitchen', 'Updated Bathroom',
        'Security System', 'Sprinkler System', 'Fenced Yard', 'Mature Trees',
        'Mountain View', 'Lakefront', 'Waterfront', 'Golf Course', 'Guest Quarters',
    ];

    const landFeatureOptions = [
        'Fenced', 'Mature Trees', 'Additional Land Available', 'Corner Lot',
        'Cul-De-Sac', 'Farm or Ranch', 'Greenbelt', 'Golf Course Frontage',
        'Hunting', 'Livestock Allowed', 'Mobile Ready', 'Pond', 'Sidewalk',
        'Spring/Creek', 'Water Frontage', 'Zero Lot Line',
    ];

    return (
        <AdminLayout title="Create Property">
            <Head title="Create Property - Admin" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Link
                        href={route('admin.properties.index')}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Property</h1>
                        <p className="text-sm text-gray-500">Create a new property listing and assign to an existing user</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Assign to User */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#1A1816]" />
                        Assign to User
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Owner *</label>
                        <select
                            value={data.user_id}
                            onChange={e => handleUserChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                        >
                            <option value="">Select a user...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email}){user.role === 'admin' ? ' - Admin' : ''}
                                </option>
                            ))}
                        </select>
                        {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
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
                            {errors.property_title && <p className="text-red-500 text-sm mt-1">{errors.property_title}</p>}
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
                            {errors.listing_status && <p className="text-red-500 text-sm mt-1">{errors.listing_status}</p>}
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
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
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
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={e => setData('city', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
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
                            {errors.zip_code && <p className="text-red-500 text-sm mt-1">{errors.zip_code}</p>}
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
                            {errors.school_district && <p className="text-red-500 text-sm mt-1">{errors.school_district}</p>}
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
                        <div>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={5}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            placeholder={data.property_type === 'land' ? 'Describe your lot/land...' : 'Describe your property...'}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
                                        isSelected ? 'bg-[#1A1816] border-[#1A1816]' : 'border-gray-300'
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
                        {/* New Photo Previews */}
                        {newPhotoPreviews.map((preview, index) => {
                            const isMain = mainPhotoId ? preview.id === mainPhotoId : index === 0;
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
                                        onClick={() => handleSetMainPhoto(preview.id)}
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
                        href={route('admin.properties.index')}
                        className="px-6 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing || isUploading}
                        className="px-6 py-2 bg-[#1A1816] text-white rounded-lg hover:bg-[#111111] disabled:opacity-50 flex items-center gap-2"
                    >
                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {processing ? 'Creating...' : 'Create Property'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}

CreateProperty.layout = (page) => page;

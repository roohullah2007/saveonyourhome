import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { MapPin, BedDouble, Bath, Maximize2, Calendar, Home, CheckCircle2, ChevronLeft, ChevronRight, X, Shield, QrCode, DollarSign, Mail, BadgeCheck, Share2, Camera, BarChart3, FileText } from 'lucide-react';
import SinglePropertyMap from '@/Components/Properties/SinglePropertyMap';

export default function ClaimShow({ property, token, isAuthenticated, user }) {
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [mobileIndex, setMobileIndex] = useState(0);

    const claimForm = useForm({});
    const registerForm = useForm({
        name: property.owner_name || '',
        email: property.owner_email || '',
        password: '',
        password_confirmation: '',
        phone: property.owner_phone || '',
        sms_consent: false,
    });

    const handleClaim = (e) => {
        e.preventDefault();
        claimForm.post(route('claim.process', token));
    };

    const handleRegister = (e) => {
        e.preventDefault();
        registerForm.post(route('claim.register', token));
    };

    const photos = property.photos && property.photos.length > 0
        ? property.photos
        : ['/images/property-placeholder.svg'];

    const openGallery = (index) => {
        setGalleryIndex(index);
        setShowGalleryModal(true);
    };

    useEffect(() => {
        if (showGalleryModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showGalleryModal]);

    useEffect(() => {
        if (!showGalleryModal) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setShowGalleryModal(false);
            if (e.key === 'ArrowLeft') setGalleryIndex((prev) => Math.max(0, prev - 1));
            if (e.key === 'ArrowRight') setGalleryIndex((prev) => Math.min(photos.length - 1, prev + 1));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showGalleryModal, photos.length]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const propertyTypeLabels = {
        'single_family': 'Single Family Home',
        'condo': 'Condo / Townhome',
        'townhouse': 'Townhouse',
        'multi_family': 'Multi-Family',
        'land': 'Land',
        'mobile_home': 'Mobile Home',
    };

    return (
        <>
            <Head title={`Claim Your Listing - ${property.address} - SaveOnYourHome`} />

            {/* Header */}
            <header className="bg-white border-b fixed top-0 left-0 right-0 z-30">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[40px] py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-[#1A1816]">
                        SaveOnYourHome
                    </Link>
                    <div className="flex items-center gap-3">
                        {!isAuthenticated && (
                            <Link href={route('login')} className="text-sm text-gray-600 hover:text-gray-900">
                                Already have an account? <span className="font-medium text-[#1A1816]">Log in</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Claim Banner */}
            <div className="bg-green-600 text-white pt-[73px]">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[40px] py-3 flex items-center justify-center gap-2 text-sm font-medium">
                    <BadgeCheck className="w-5 h-5" />
                    We saw your listing on Zillow &mdash; claim your FREE SaveOnYourHome listing for more exposure!
                </div>
            </div>

            {/* Property Header */}
            <section className="bg-[#EEEDEA] pb-6 pt-6">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[40px]">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div>
                            <h1
                                className="text-[28px] md:text-[36px] font-medium text-[#111] mb-2"
                               
                            >
                                {property.property_title || `${property.address}, ${property.city}`}
                            </h1>
                            <p className="text-lg text-[#666] flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                {property.address}, {property.city}, {property.state} {property.zip_code}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span
                                className="text-[28px] md:text-[36px] font-bold text-[#1A1816]"
                               
                            >
                                {formatPrice(property.price)}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Gallery */}
            <section className="bg-white py-6">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[40px]">
                    {/* Desktop Grid */}
                    {photos.length === 1 ? (
                        <div className="hidden md:block rounded-2xl overflow-hidden cursor-pointer" style={{ height: '550px' }} onClick={() => openGallery(0)}>
                            <img
                                src={photos[0]}
                                alt={`${property.address} - Image 1`}
                                className="w-full h-full object-cover object-center"
                                onError={(e) => e.target.src = '/images/property-placeholder.svg'}
                            />
                        </div>
                    ) : (
                        <div className="hidden md:grid grid-cols-3 gap-2 rounded-2xl overflow-hidden" style={{ height: '450px' }}>
                            <div className="col-span-2 relative cursor-pointer" onClick={() => openGallery(0)}>
                                <img
                                    src={photos[0]}
                                    alt={`${property.address} - Image 1`}
                                    className="w-full h-full object-cover object-center"
                                    onError={(e) => e.target.src = '/images/property-placeholder.svg'}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex-1 relative cursor-pointer" onClick={() => openGallery(1)}>
                                    <img src={photos[1]} alt="Image 2" className="w-full h-full object-cover object-center" onError={(e) => e.target.src = '/images/property-placeholder.svg'} />
                                </div>
                                {photos[2] ? (
                                    <div className="flex-1 relative cursor-pointer" onClick={() => openGallery(2)}>
                                        <img src={photos[2]} alt="Image 3" className="w-full h-full object-cover object-center" onError={(e) => e.target.src = '/images/property-placeholder.svg'} />
                                        {photos.length > 3 && (
                                            <button onClick={(e) => { e.stopPropagation(); openGallery(0); }} className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-[#111] px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
                                                See all {photos.length} photos
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex-1 relative cursor-pointer" onClick={() => openGallery(0)}>
                                        <img src={photos[0]} alt="Image 1" className="w-full h-full object-cover object-[center_60%]" onError={(e) => e.target.src = '/images/property-placeholder.svg'} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mobile Carousel */}
                    <div className="md:hidden relative rounded-2xl overflow-hidden">
                        <img
                            src={photos[mobileIndex]}
                            alt={`Image ${mobileIndex + 1}`}
                            className="w-full h-[350px] object-cover object-center"
                            onClick={() => openGallery(mobileIndex)}
                            onError={(e) => e.target.src = '/images/property-placeholder.svg'}
                        />
                        {photos.length > 1 && (
                            <>
                                <button onClick={() => setMobileIndex((p) => (p === 0 ? photos.length - 1 : p - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button onClick={() => setMobileIndex((p) => (p === photos.length - 1 ? 0 : p + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                                    {mobileIndex + 1} / {photos.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Fullscreen Gallery Modal */}
            {showGalleryModal && (
                <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 text-white">
                        <div>
                            <p className="text-sm text-white/70">{property.address}, {property.city}, {property.state}</p>
                            <p className="text-sm text-white/50">{galleryIndex + 1} of {photos.length}</p>
                        </div>
                        <button onClick={() => setShowGalleryModal(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6 text-white" /></button>
                    </div>
                    <div className="flex-1 flex items-center justify-center relative px-4 min-h-0">
                        <button onClick={() => setGalleryIndex((p) => Math.max(0, p - 1))} disabled={galleryIndex === 0} className={`absolute left-4 z-10 p-3 rounded-full ${galleryIndex === 0 ? 'bg-white/5 text-white/20' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <img src={photos[galleryIndex]} alt={`Image ${galleryIndex + 1}`} className="max-w-full max-h-full object-contain" onError={(e) => e.target.src = '/images/property-placeholder.svg'} />
                        <button onClick={() => setGalleryIndex((p) => Math.min(photos.length - 1, p + 1))} disabled={galleryIndex === photos.length - 1} className={`absolute right-4 z-10 p-3 rounded-full ${galleryIndex === photos.length - 1 ? 'bg-white/5 text-white/20' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                    {photos.length > 1 && (
                        <div className="px-4 sm:px-6 py-4 overflow-x-auto">
                            <div className="flex gap-2 justify-center">
                                {photos.map((photo, i) => (
                                    <button key={i} onClick={() => setGalleryIndex(i)} className={`flex-shrink-0 w-20 h-[60px] rounded-lg overflow-hidden border-2 ${i === galleryIndex ? 'border-blue-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                                        <img src={photo} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" onError={(e) => e.target.src = '/images/property-placeholder.svg'} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Mobile Sticky Claim Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg safe-bottom">
                <div className="flex gap-3 items-center">
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Claim your listing</p>
                        <p className="font-bold text-[#1A1816]">{formatPrice(property.price)}</p>
                    </div>
                    <a href="#claim-form" className="flex items-center justify-center gap-2 bg-[#3355FF] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-colors">
                        <BadgeCheck className="w-5 h-5" />
                        Claim Now
                    </a>
                </div>
            </div>

            {/* Property Details + Claim Sidebar */}
            <section className="bg-[#EEEDEA] py-10 pb-32 lg:pb-10">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[40px]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Quick Stats */}
                            <div className="bg-white rounded-2xl p-6 mb-6">
                                <h2 className="text-xl font-semibold text-[#111] mb-4">
                                    {property.property_type === 'land' ? 'Lot Details' : 'Property Details'}
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {property.property_type !== 'land' && (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-[#EEEDEA] p-3 rounded-lg"><BedDouble className="w-5 h-5 text-[#1A1816]" /></div>
                                                <div>
                                                    <p className="text-sm text-[#666]">Bedrooms</p>
                                                    <p className="font-semibold text-[#111]">{property.bedrooms}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-[#EEEDEA] p-3 rounded-lg"><Bath className="w-5 h-5 text-[#1A1816]" /></div>
                                                <div>
                                                    <p className="text-sm text-[#666]">Bathrooms</p>
                                                    <p className="font-semibold text-[#111]">
                                                        {property.full_bathrooms || 0} Full{property.half_bathrooms > 0 ? `, ${property.half_bathrooms} Half` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-[#EEEDEA] p-3 rounded-lg"><Maximize2 className="w-5 h-5 text-[#1A1816]" /></div>
                                                <div>
                                                    <p className="text-sm text-[#666]">Square Feet</p>
                                                    <p className="font-semibold text-[#111]">{property.sqft ? property.sqft.toLocaleString() : 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-[#EEEDEA] p-3 rounded-lg"><Calendar className="w-5 h-5 text-[#1A1816]" /></div>
                                                <div>
                                                    <p className="text-sm text-[#666]">Year Built</p>
                                                    <p className="font-semibold text-[#111]">{property.year_built || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {property.property_type === 'land' && (
                                        <>
                                            {property.acres && (
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#EEEDEA] p-3 rounded-lg"><Maximize2 className="w-5 h-5 text-[#1A1816]" /></div>
                                                    <div>
                                                        <p className="text-sm text-[#666]">Acres</p>
                                                        <p className="font-semibold text-[#111]">{Number(property.acres).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {property.lot_size && (
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#EEEDEA] p-3 rounded-lg"><Maximize2 className="w-5 h-5 text-[#1A1816]" /></div>
                                                    <div>
                                                        <p className="text-sm text-[#666]">Lot Size</p>
                                                        <p className="font-semibold text-[#111]">{Number(property.lot_size).toLocaleString()} sq ft</p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-[#666]">Property Type</p>
                                        <p className="font-semibold text-[#111]">{propertyTypeLabels[property.property_type] || property.property_type}</p>
                                    </div>
                                    {property.property_type !== 'land' && property.lot_size && (
                                        <div>
                                            <p className="text-sm text-[#666]">Lot Size</p>
                                            <p className="font-semibold text-[#111]">{Number(property.lot_size).toLocaleString()} sq ft</p>
                                        </div>
                                    )}
                                    {property.subdivision && (
                                        <div>
                                            <p className="text-sm text-[#666]">Subdivision</p>
                                            <p className="font-semibold text-[#111]">{property.subdivision}</p>
                                        </div>
                                    )}
                                    {property.property_type === 'land' && property.zoning && (
                                        <div>
                                            <p className="text-sm text-[#666]">Zoning</p>
                                            <p className="font-semibold text-[#111]">{property.zoning}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-2xl p-6 mb-6">
                                <h2 className="text-xl font-semibold text-[#111] mb-4">
                                    Description
                                </h2>
                                <p className="text-[#666] leading-relaxed whitespace-pre-line">
                                    {property.description}
                                </p>
                            </div>

                            {/* School Information */}
                            {property.school_district && (
                                <div className="bg-white rounded-2xl p-6 mb-6">
                                    <h2 className="text-xl font-semibold text-[#111] mb-4">
                                        School Information
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-[#666]">School District</p>
                                            <p className="font-semibold text-[#111]">{property.school_district}</p>
                                        </div>
                                        {property.grade_school && (
                                            <div>
                                                <p className="text-sm text-[#666]">Grade School</p>
                                                <p className="font-semibold text-[#111]">{property.grade_school}</p>
                                            </div>
                                        )}
                                        {property.middle_school && (
                                            <div>
                                                <p className="text-sm text-[#666]">Middle School</p>
                                                <p className="font-semibold text-[#111]">{property.middle_school}</p>
                                            </div>
                                        )}
                                        {property.high_school && (
                                            <div>
                                                <p className="text-sm text-[#666]">High School</p>
                                                <p className="font-semibold text-[#111]">{property.high_school}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Features */}
                            {property.features && property.features.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 mb-6">
                                    <h2 className="text-xl font-semibold text-[#111] mb-4">
                                        Features & Amenities
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {property.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-[#666]">
                                                <CheckCircle2 className="w-4 h-4 text-[#1A1816] flex-shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Map */}
                            {property.latitude && property.longitude && (
                                <div className="bg-white rounded-2xl p-6 mb-6">
                                    <h2 className="text-xl font-semibold text-[#111] mb-4">
                                        Location
                                    </h2>
                                    <div className="rounded-xl overflow-hidden" style={{ height: '300px' }}>
                                        <SinglePropertyMap property={property} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Claim CTA */}
                        <div className="lg:col-span-1" id="claim-form">
                            <div className="lg:sticky lg:top-[90px]">
                                {/* Claim Card */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
                                            <BadgeCheck className="w-7 h-7 text-green-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-[#111]">
                                            Your FREE Listing Is Ready!
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Just add your email and create a password to go live
                                        </p>
                                    </div>

                                    {isAuthenticated ? (
                                        <div>
                                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 p-3 rounded-lg mb-4 text-sm">
                                                <Shield className="w-4 h-4 flex-shrink-0" />
                                                <span>Logged in as <strong>{user?.name}</strong></span>
                                            </div>
                                            <form onSubmit={handleClaim}>
                                                <button
                                                    type="submit"
                                                    disabled={claimForm.processing}
                                                    className="w-full py-3.5 bg-[#3355FF] text-white rounded-xl font-semibold hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors text-lg"
                                                   
                                                >
                                                    {claimForm.processing ? 'Claiming...' : 'Claim My Listing'}
                                                </button>
                                            </form>
                                            {claimForm.errors.token && (
                                                <p className="text-sm text-red-600 mt-2">{claimForm.errors.token}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-4">Claim this awesome listing &mdash; it only takes 60 seconds!</p>
                                            <form onSubmit={handleRegister} className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                    <input type="text" value={registerForm.data.name} onChange={(e) => registerForm.setData('name', e.target.value)} className="w-full px-3 py-2.5 border rounded-xl focus:ring-[#1A1816] focus:border-[#1A1816]" required />
                                                    {registerForm.errors.name && <p className="text-xs text-red-600 mt-1">{registerForm.errors.name}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                    <input type="email" value={registerForm.data.email} onChange={(e) => registerForm.setData('email', e.target.value)} className="w-full px-3 py-2.5 border rounded-xl focus:ring-[#1A1816] focus:border-[#1A1816]" required />
                                                    {registerForm.errors.email && <p className="text-xs text-red-600 mt-1">{registerForm.errors.email}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-gray-400">(optional)</span></label>
                                                    <input type="tel" value={registerForm.data.phone} onChange={(e) => registerForm.setData('phone', e.target.value)} className="w-full px-3 py-2.5 border rounded-xl focus:ring-[#1A1816] focus:border-[#1A1816]" />
                                                    <label className="flex items-start gap-2 mt-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={registerForm.data.sms_consent}
                                                            onChange={(e) => registerForm.setData('sms_consent', e.target.checked)}
                                                            className="mt-0.5 rounded border-gray-300 text-[#1A1816] focus:ring-[#1A1816]"
                                                        />
                                                        <span className="text-xs text-gray-600">Text me updates about my listing and buyer inquiries</span>
                                                    </label>
                                                    <p className="text-[11px] text-gray-400 mt-1 ml-6">Msg & data rates may apply. Reply STOP to opt out.</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                    <input type="password" value={registerForm.data.password} onChange={(e) => registerForm.setData('password', e.target.value)} className="w-full px-3 py-2.5 border rounded-xl focus:ring-[#1A1816] focus:border-[#1A1816]" required />
                                                    <p className="text-[11px] text-gray-400 mt-1">Must be at least 8 characters</p>
                                                    {registerForm.errors.password && <p className="text-xs text-red-600 mt-1">{registerForm.errors.password}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                                    <input type="password" value={registerForm.data.password_confirmation} onChange={(e) => registerForm.setData('password_confirmation', e.target.value)} className="w-full px-3 py-2.5 border rounded-xl focus:ring-[#1A1816] focus:border-[#1A1816]" required />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={registerForm.processing}
                                                    className="w-full py-3.5 bg-[#3355FF] text-white rounded-xl font-semibold hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors text-lg"
                                                   
                                                >
                                                    {registerForm.processing ? 'Creating Account...' : 'Create Account & Claim'}
                                                </button>
                                                {registerForm.errors.token && <p className="text-sm text-red-600">{registerForm.errors.token}</p>}
                                            </form>
                                            <p className="text-xs text-gray-400 text-center mt-3">
                                                By creating an account, you agree to our{' '}
                                                <Link href="/terms-of-use" className="underline">Terms</Link> and{' '}
                                                <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Benefits */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                                    <h3 className="font-semibold text-[#111] mb-4">
                                        What You Get - FREE
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { icon: Home, title: 'Property Listing', desc: 'Your home visible to buyers nationwide' },
                                            { icon: QrCode, title: 'QR Code Stickers', desc: 'Free sticker for your yard sign' },
                                            { icon: DollarSign, title: 'Zero Fees', desc: 'No commissions, no contract, no obligation' },
                                            { icon: Mail, title: 'Direct Inquiries', desc: 'Buyer messages sent straight to you' },
                                        ].map((benefit, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                                                    <benefit.icon className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#111] text-sm">{benefit.title}</p>
                                                    <p className="text-xs text-gray-500">{benefit.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* After Claiming - Conversion Boosters */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border mt-6">
                                    <h3 className="font-semibold text-[#111] mb-4">
                                        After Claiming, You Can:
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { icon: Mail, title: 'Receive buyer inquiries directly' },
                                            { icon: QrCode, title: 'Get your free QR code sticker' },
                                            { icon: Share2, title: 'Share your listing on social media' },
                                            { icon: Calendar, title: 'Add open houses' },
                                            { icon: Camera, title: 'Upload photos' },
                                            { icon: BarChart3, title: 'Track interest' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
                                                    <item.icon className="w-4 h-4 text-[#1A1816]" />
                                                </div>
                                                <p className="font-medium text-[#111] text-sm">{item.title}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

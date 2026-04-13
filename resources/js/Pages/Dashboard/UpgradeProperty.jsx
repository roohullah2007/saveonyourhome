import { Head, Link, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import {
    ArrowLeft,
    Camera,
    Video,
    Eye,
    Home,
    MapPin,
    CheckCircle,
    Clock,
    AlertCircle,
    Send,
    Calendar,
    Star
} from 'lucide-react';
import { useState } from 'react';

export default function UpgradeProperty({ property, existingRequests = [] }) {
    const [selectedService, setSelectedService] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        service_type: '',
        notes: '',
        preferred_date: '',
        preferred_time: '',
    });

    const services = [
        {
            id: 'photos',
            title: 'Professional Photos',
            description: 'High-quality professional photography to showcase your property at its best',
            icon: Camera,
            features: [
                'Up to 25 professional photos',
                'Wide-angle interior shots',
                'Exterior & aerial views',
                'Photo editing included',
                '24-hour turnaround',
            ],
            price: 'Contact for pricing',
        },
        {
            id: 'virtual_tour',
            title: 'Virtual Tour',
            description: 'Interactive 3D virtual tour allowing buyers to explore your property online',
            icon: Eye,
            features: [
                'Full 360° walkthrough',
                'Interactive floor plan',
                'Mobile & VR compatible',
                'Shareable links',
                'Embedded on listing',
            ],
            price: 'Contact for pricing',
        },
        {
            id: 'video',
            title: 'Video Walkthrough',
            description: 'Professional video tour with narration highlighting key features',
            icon: Video,
            features: [
                '2-3 minute video tour',
                'Professional narration',
                'Music & transitions',
                'YouTube/social ready',
                'Embedded on listing',
            ],
            price: 'Contact for pricing',
        },
    ];

    // Check if service has pending request
    const hasPendingRequest = (serviceId) => {
        return existingRequests.some(req =>
            req.service_type === serviceId &&
            ['pending', 'approved', 'in_progress'].includes(req.status)
        );
    };

    const handleSelectService = (serviceId) => {
        if (hasPendingRequest(serviceId)) return;
        setSelectedService(serviceId);
        setData('service_type', serviceId);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('dashboard.listings.upgrade.submit', property.id));
    };

    const getStatusBadge = (serviceId) => {
        const request = existingRequests.find(req =>
            req.service_type === serviceId &&
            ['pending', 'approved', 'in_progress'].includes(req.status)
        );

        if (!request) return null;

        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-700',
            approved: 'bg-blue-100 text-blue-700',
            in_progress: 'bg-purple-100 text-purple-700',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[request.status]}`}>
                {request.status === 'pending' ? 'Request Pending' :
                 request.status === 'approved' ? 'Approved' : 'In Progress'}
            </span>
        );
    };

    return (
        <UserDashboardLayout title="Upgrade Listing">
            <Head title={`Upgrade - ${property.property_title}`} />

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
                        Upgrade Your Listing
                    </h1>
                    <p className="text-gray-500">Boost visibility with professional services</p>
                </div>
            </div>

            {/* Property Card */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                            src={property.photos?.[0] || '/images/property-placeholder.svg'}
                            alt={property.property_title}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = '/images/property-placeholder.svg'}
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {property.property_title}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {property.address}, {property.city}, {property.state}
                        </p>
                        <p className="text-lg font-bold text-[#1A1816] mt-1">
                            ${Number(property.price).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Current Tier Info */}
            {property.listing_tier && property.listing_tier !== 'free' && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                        <p className="font-medium text-green-800">Current Tier: Photos & Multimedia</p>
                        <p className="text-sm text-green-700 mt-1"></p>
                    </div>
                </div>
            )}

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {services.map((service) => {
                    const isPending = hasPendingRequest(service.id);
                    const isSelected = selectedService === service.id;

                    return (
                        <div
                            key={service.id}
                            onClick={() => !isPending && handleSelectService(service.id)}
                            className={`bg-white rounded-2xl shadow-sm p-6 cursor-pointer transition-all ${
                                isPending
                                    ? 'opacity-75 cursor-not-allowed'
                                    : isSelected
                                        ? 'ring-2 ring-[#1A1816] border-transparent'
                                        : 'hover:shadow-md border border-transparent'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${isSelected ? 'bg-[#1A1816]' : 'bg-gray-100'}`}>
                                    <service.icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                                </div>
                                {getStatusBadge(service.id) || (
                                    isSelected && (
                                        <CheckCircle className="w-6 h-6 text-[#1A1816]" />
                                    )
                                )}
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {service.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {service.description}
                            </p>

                            <ul className="space-y-2 mb-4">
                                {service.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm font-medium text-[#1A1816]">{service.price}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Request Form */}
            {selectedService && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Request Details
                    </h3>

                    {(selectedService === 'photos' || selectedService === 'virtual_tour' || selectedService === 'video') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Calendar className="w-4 h-4 inline-block mr-1" />
                                    Preferred Date
                                </label>
                                <input
                                    type="date"
                                    value={data.preferred_date}
                                    onChange={(e) => setData('preferred_date', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                />
                                {errors.preferred_date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.preferred_date}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Clock className="w-4 h-4 inline-block mr-1" />
                                    Preferred Time
                                </label>
                                <select
                                    value={data.preferred_time}
                                    onChange={(e) => setData('preferred_time', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                >
                                    <option value="">Select a time</option>
                                    <option value="morning">Morning (9 AM - 12 PM)</option>
                                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                                    <option value="flexible">Flexible</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Notes (Optional)
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            placeholder="Any special instructions or questions..."
                        />
                        {errors.notes && (
                            <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                        )}
                    </div>

                    {errors.service_type && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <p className="text-sm text-red-700">{errors.service_type}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <Link
                            href={route('dashboard.listings')}
                            className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1A1816] text-white rounded-xl font-medium hover:bg-[#111111] transition-colors disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                            {processing ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            )}

            {!selectedService && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                    <Star className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="font-medium text-blue-800">Select a service above to get started</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Our team will contact you to discuss details and pricing after you submit your request.
                        </p>
                    </div>
                </div>
            )}
        </UserDashboardLayout>
    );
}

UpgradeProperty.layout = (page) => page;

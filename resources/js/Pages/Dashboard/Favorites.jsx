import { Head, Link, router } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import { resolvePhotoUrl } from '@/utils/photoUrl';
import {
    Search,
    Heart,
    MapPin,
    Bed,
    Bath,
    Square,
    ExternalLink,
    Trash2,
    Home,
    Grid,
    List,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export default function Favorites({ favorites, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState('grid');
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [propertyToRemove, setPropertyToRemove] = useState(null);
    const [removing, setRemoving] = useState(false);

    const favoritesData = favorites?.data || favorites || [];
    const totalCount = favorites?.total || favoritesData.length;

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('dashboard.favorites'), { search }, { preserveState: true });
    };

    const handleRemove = () => {
        if (propertyToRemove) {
            setRemoving(true);
            router.delete(route('dashboard.favorites.remove', propertyToRemove.id), {
                preserveState: true,
                onSuccess: () => {
                    setShowRemoveModal(false);
                    setPropertyToRemove(null);
                    setRemoving(false);
                },
                onError: () => {
                    setRemoving(false);
                }
            });
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

    return (
        <UserDashboardLayout title="Favorites">
            <Head title="Favorites" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Favorites
                    </h1>
                    <p className="text-gray-500">{totalCount} properties favorited</p>
                </div>
                <Link
                    href="/properties"
                    className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1D4ED8] transition-colors"
                >
                    <Home className="w-5 h-5" />
                    Browse Properties
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <form onSubmit={handleSearch} className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search favorites..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                        />
                    </form>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-lg transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-[#3355FF] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-lg transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-[#3355FF] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Properties */}
            {favoritesData.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
                    <p className="text-gray-500 mb-6">
                        {search ? 'No properties match your search' : 'Start saving properties you\'re interested in'}
                    </p>
                    <Link
                        href="/properties"
                        className="inline-flex items-center gap-2 bg-[#3355FF] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1D4ED8] transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        Browse Properties
                    </Link>
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoritesData.map((property) => (
                        <div key={property.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                            {/* Image */}
                            <div className="relative h-48">
                                <img
                                    src={resolvePhotoUrl(property.photos?.[0] || property.images?.[0]?.url, '/images/property-placeholder.jpg')}
                                    alt={property.property_title}
                                    className="w-full h-full object-cover object-center"
                                    onError={(e) => e.target.src = '/images/property-placeholder.jpg'}
                                />
                                {property.status === 'sold' && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold">
                                            SOLD
                                        </span>
                                    </div>
                                )}
                                <button
                                    onClick={() => {
                                        setPropertyToRemove(property);
                                        setShowRemoveModal(true);
                                    }}
                                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                >
                                    <Heart className="w-5 h-5 text-[#1A1816] fill-[#1A1816]" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    {property.property_title}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                                    <MapPin className="w-4 h-4" />
                                    {property.address}, {property.city}, {property.state}
                                </p>

                                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Bed className="w-4 h-4" />
                                        {property.bedrooms}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Bath className="w-4 h-4" />
                                        {(property.full_bathrooms || 0) + (property.half_bathrooms ? property.half_bathrooms * 0.5 : 0)}
                                    </span>
                                    {property.sqft && (
                                        <span className="flex items-center gap-1">
                                            <Square className="w-4 h-4" />
                                            {Number(property.sqft).toLocaleString()} sq ft
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className="text-xl font-bold text-[#1A1816]">
                                        ${Number(property.price).toLocaleString()}
                                    </span>
                                    <Link
                                        href={`/properties/${property.slug || property.id}`}
                                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#555]"
                                    >
                                        View <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="space-y-4">
                    {favoritesData.map((property) => (
                        <div key={property.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row">
                                {/* Image */}
                                <div className="relative sm:w-48 md:w-64 h-48 sm:h-auto flex-shrink-0">
                                    <img
                                        src={resolvePhotoUrl(property.photos?.[0] || property.images?.[0]?.url, '/images/property-placeholder.jpg')}
                                        alt={property.property_title}
                                        className="w-full h-full object-cover object-center"
                                        onError={(e) => e.target.src = '/images/property-placeholder.jpg'}
                                    />
                                    {property.status === 'sold' && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold">
                                                SOLD
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-4 sm:p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {property.property_title}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <MapPin className="w-4 h-4" />
                                                {property.address}, {property.city}, {property.state}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setPropertyToRemove(property);
                                                setShowRemoveModal(true);
                                            }}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove from saved"
                                        >
                                            <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-600" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Bed className="w-4 h-4" />
                                            {property.bedrooms} bed
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Bath className="w-4 h-4" />
                                            {(property.full_bathrooms || 0) + (property.half_bathrooms ? property.half_bathrooms * 0.5 : 0)} bath
                                        </span>
                                        {property.sqft && (
                                            <span className="flex items-center gap-1">
                                                <Square className="w-4 h-4" />
                                                {Number(property.sqft).toLocaleString()} sq ft
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                        <span className="text-2xl font-bold text-[#1A1816]">
                                            ${Number(property.price).toLocaleString()}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            {property.pivot?.created_at && (
                                                <span className="text-xs text-gray-400">
                                                    Saved {formatDate(property.pivot.created_at)}
                                                </span>
                                            )}
                                            <Link
                                                href={`/properties/${property.slug || property.id}`}
                                                className="inline-flex items-center gap-1 px-4 py-2 bg-[#3355FF] text-white rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition-colors"
                                            >
                                                View Property
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {favorites?.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 bg-white rounded-2xl shadow-sm p-4">
                    <p className="text-sm text-gray-500">
                        Showing {favorites.from} to {favorites.to} of {favorites.total}
                    </p>
                    <div className="flex items-center gap-2">
                        {favorites.prev_page_url && (
                            <Link
                                href={favorites.prev_page_url}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                        )}
                        <span className="text-sm text-gray-600">
                            Page {favorites.current_page} of {favorites.last_page}
                        </span>
                        {favorites.next_page_url && (
                            <Link
                                href={favorites.next_page_url}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Remove Modal */}
            {showRemoveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove from Saved</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to remove <strong>{propertyToRemove?.property_title}</strong> from your favorites?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowRemoveModal(false); setPropertyToRemove(null); }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                disabled={removing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRemove}
                                disabled={removing}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {removing ? 'Removing...' : 'Remove'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UserDashboardLayout>
    );
}

Favorites.layout = (page) => page;

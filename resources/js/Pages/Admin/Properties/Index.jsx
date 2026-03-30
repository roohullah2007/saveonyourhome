import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    Star,
    StarOff,
    ChevronLeft,
    ChevronRight,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';

export default function PropertiesIndex({ properties, filters = {}, counts = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);
    const [propertyToReject, setPropertyToReject] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.properties.index'), { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key, value) => {
        router.get(route('admin.properties.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    const approveProperty = (property) => {
        router.post(route('admin.properties.approve', property.id), {}, { preserveScroll: true });
    };

    const rejectProperty = () => {
        if (propertyToReject && rejectionReason) {
            router.post(route('admin.properties.reject', propertyToReject.id), {
                rejection_reason: rejectionReason
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowRejectModal(false);
                    setPropertyToReject(null);
                    setRejectionReason('');
                }
            });
        }
    };

    const toggleFeatured = (property) => {
        router.post(route('admin.properties.toggle-featured', property.id), {}, { preserveScroll: true });
    };

    const toggleActive = (property) => {
        router.post(route('admin.properties.toggle-active', property.id), {}, { preserveScroll: true });
    };

    const deleteProperty = () => {
        if (propertyToDelete) {
            router.delete(route('admin.properties.destroy', propertyToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setPropertyToDelete(null);
                }
            });
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            approved: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    const tabs = [
        { key: '', label: 'All', count: counts.all || properties.total || 0 },
        { key: 'pending', label: 'Pending', count: counts.pending || 0 },
        { key: 'approved', label: 'Approved', count: counts.approved || 0 },
        { key: 'rejected', label: 'Rejected', count: counts.rejected || 0 },
    ];

    const propertyList = properties.data || properties;

    return (
        <AdminLayout title="Properties">
            <Head title="Properties - Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                        Properties
                    </h1>
                    <p className="text-gray-500">Manage all property listings</p>
                </div>
                <Link
                    href={route('admin.properties.create')}
                    className="inline-flex items-center gap-2 bg-[#0891B2] text-white px-4 py-2 rounded-lg hover:bg-[#0E7490] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Property
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleFilter('approval', tab.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            (filters.approval || '') === tab.key
                                ? 'bg-[#0891B2] text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search properties..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Property</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Owner</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Views</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {propertyList.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No properties found
                                    </td>
                                </tr>
                            ) : (
                                propertyList.map((property) => (
                                    <tr key={property.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{property.property_title}</p>
                                                <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-[#0891B2]">
                                                ${Number(property.price).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full w-fit ${getStatusBadge(property.approval_status || 'pending')}`}>
                                                    {property.approval_status || 'pending'}
                                                </span>
                                                {property.is_featured && (
                                                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 w-fit">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {property.user?.name || property.contact_name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{property.views}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                {(property.approval_status === 'pending' || !property.approval_status) && (
                                                    <>
                                                        <button
                                                            onClick={() => approveProperty(property)}
                                                            className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setPropertyToReject(property);
                                                                setShowRejectModal(true);
                                                            }}
                                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => toggleFeatured(property)}
                                                    className={`p-2 rounded-lg ${
                                                        property.is_featured
                                                            ? 'text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50'
                                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                                    }`}
                                                    title={property.is_featured ? 'Remove Featured' : 'Make Featured'}
                                                >
                                                    {property.is_featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                                                </button>
                                                <Link
                                                    href={route('admin.properties.show', property.id)}
                                                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={route('admin.properties.edit', property.id)}
                                                    className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setPropertyToDelete(property);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {properties.last_page > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Showing {properties.from} to {properties.to} of {properties.total}
                        </p>
                        <div className="flex items-center gap-2">
                            {properties.prev_page_url && (
                                <Link href={properties.prev_page_url} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                    <ChevronLeft className="w-5 h-5" />
                                </Link>
                            )}
                            <span className="text-sm">Page {properties.current_page} of {properties.last_page}</span>
                            {properties.next_page_url && (
                                <Link href={properties.next_page_url} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Property</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete <strong>{propertyToDelete?.property_title}</strong>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => { setShowDeleteModal(false); setPropertyToDelete(null); }} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={deleteProperty} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Reject Property</h3>
                        <p className="text-gray-500 mb-4">Provide a reason for rejection:</p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 mb-4"
                            rows="3"
                            placeholder="Enter rejection reason..."
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => { setShowRejectModal(false); setPropertyToReject(null); setRejectionReason(''); }} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={rejectProperty} disabled={!rejectionReason.trim()} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

PropertiesIndex.layout = (page) => page;

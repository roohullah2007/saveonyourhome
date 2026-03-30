import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Package, Clock, CheckCircle, XCircle, Search, MapPin, Mail,
    Phone, User, FileText, Truck, QrCode, StickyNote, ChevronDown
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function Index({ serviceRequests, counts, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || 'all');
    const [selectedType, setSelectedType] = useState(filters?.type || 'all');
    const [noteModal, setNoteModal] = useState(null);
    const [noteText, setNoteText] = useState('');

    const noteForm = useForm({ admin_notes: '' });

    const applyFilters = (overrides = {}) => {
        const params = {
            search: searchTerm,
            status: selectedStatus,
            type: selectedType,
            ...overrides,
        };
        // Remove 'all' values
        Object.keys(params).forEach(key => {
            if (params[key] === 'all' || params[key] === '') delete params[key];
        });
        router.get('/admin/service-requests', params, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        applyFilters({ status });
    };

    const handleTypeFilter = (e) => {
        const type = e.target.value;
        setSelectedType(type);
        applyFilters({ type });
    };

    const handleStatusUpdate = (requestId, newStatus) => {
        router.put(`/admin/service-requests/${requestId}/status`, {
            status: newStatus,
        }, { preserveState: true });
    };

    const openNoteModal = (request) => {
        setNoteModal(request);
        setNoteText(request.admin_notes || '');
    };

    const saveNote = () => {
        router.put(`/admin/service-requests/${noteModal.id}/note`, {
            admin_notes: noteText,
        }, {
            preserveState: true,
            onSuccess: () => setNoteModal(null),
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-orange-100 text-orange-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        const labels = {
            pending: 'Pending',
            approved: 'Approved',
            in_progress: 'In Progress',
            completed: 'Completed',
            cancelled: 'Cancelled',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const getTypeBadge = (type) => {
        const styles = {
            qr_stickers: 'bg-indigo-100 text-indigo-800',
            yard_sign: 'bg-emerald-100 text-emerald-800',
            photos: 'bg-blue-100 text-blue-800',
            virtual_tour: 'bg-purple-100 text-purple-800',
            video: 'bg-pink-100 text-pink-800',
            mls: 'bg-cyan-100 text-cyan-800',
        };
        const labels = {
            qr_stickers: 'QR Stickers',
            yard_sign: 'Yard Sign',
            photos: 'Photos',
            virtual_tour: 'Virtual Tour',
            video: 'Video',
            mls: 'MLS',
        };
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
                {type === 'qr_stickers' && <QrCode className="w-3 h-3 mr-1" />}
                {type === 'yard_sign' && <Package className="w-3 h-3 mr-1" />}
                {labels[type] || type}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const parseShippingInfo = (notes) => {
        if (!notes) return null;
        try {
            const data = JSON.parse(notes);
            if (data.shipping_address) {
                return `${data.shipping_address}, ${data.shipping_city || ''} ${data.shipping_state || ''} ${data.shipping_zip || ''}`.trim();
            }
            if (data.address) {
                return data.address;
            }
        } catch {
            // Not JSON, just return null
        }
        return null;
    };

    const parseQuantity = (notes) => {
        if (!notes) return null;
        try {
            const data = JSON.parse(notes);
            return data.quantity || data.sticker_count || null;
        } catch {
            return null;
        }
    };

    const parsePhone = (notes) => {
        if (!notes) return null;
        try {
            const data = JSON.parse(notes);
            return data.phone || null;
        } catch {
            return null;
        }
    };

    const tabs = [
        { key: 'all', label: 'All', count: counts?.all || 0 },
        { key: 'pending', label: 'Pending', count: counts?.pending || 0 },
        { key: 'approved', label: 'Approved', count: counts?.approved || 0 },
        { key: 'in_progress', label: 'In Progress', count: counts?.in_progress || 0 },
        { key: 'completed', label: 'Completed', count: counts?.completed || 0 },
        { key: 'cancelled', label: 'Cancelled', count: counts?.cancelled || 0 },
    ];

    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'qr_stickers', label: 'QR Stickers' },
        { value: 'yard_sign', label: 'Yard Sign' },
        { value: 'photos', label: 'Photos' },
        { value: 'virtual_tour', label: 'Virtual Tour' },
        { value: 'video', label: 'Video' },
        { value: 'mls', label: 'MLS' },
    ];

    return (
        <>
            <Head title="Service Requests - Admin" />

            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Service Requests</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage QR sticker orders, yard sign requests, and other service orders.
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Pending</p>
                                <p className="text-2xl font-semibold text-gray-900">{counts?.pending || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Truck className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">In Progress</p>
                                <p className="text-2xl font-semibold text-gray-900">{counts?.in_progress || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Completed</p>
                                <p className="text-2xl font-semibold text-gray-900">{counts?.completed || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                                <p className="text-2xl font-semibold text-gray-900">{counts?.cancelled || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleStatusFilter(tab.key)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                    selectedStatus === tab.key
                                        ? 'border-[#0891B2] text-[#0891B2]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                                <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${
                                    selectedStatus === tab.key
                                        ? 'bg-[#0891B2]/10 text-[#0891B2]'
                                        : 'bg-gray-100 text-gray-900'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Search + Type Filter */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, email, or property address..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                            />
                        </div>
                        <select
                            value={selectedType}
                            onChange={handleTypeFilter}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] bg-white"
                        >
                            {typeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#0891B2] text-white rounded-lg hover:bg-[#0E7490] transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Property
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {serviceRequests?.data?.length > 0 ? (
                                    serviceRequests.data.map((req) => {
                                        const shippingInfo = parseShippingInfo(req.notes);
                                        const quantity = parseQuantity(req.notes);
                                        const phone = parsePhone(req.notes);

                                        return (
                                            <tr key={req.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        #{req.id}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {formatDate(req.created_at)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 flex items-center gap-1">
                                                        <User className="w-3 h-3 text-gray-400" />
                                                        {req.user?.name || 'Unknown'}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {req.user?.email || '-'}
                                                    </div>
                                                    {phone && (
                                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Phone className="w-3 h-3" />
                                                            {phone}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {req.property ? (
                                                        <div className="text-sm text-gray-900 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 text-gray-400" />
                                                            <Link
                                                                href={`/admin/properties/${req.property.id}`}
                                                                className="text-[#0891B2] hover:underline"
                                                            >
                                                                {req.property.address}
                                                            </Link>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getTypeBadge(req.service_type)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600 max-w-xs">
                                                        {quantity && (
                                                            <div className="mb-1">
                                                                <span className="font-medium">Qty:</span> {quantity}
                                                            </div>
                                                        )}
                                                        {shippingInfo && (
                                                            <div className="flex items-start gap-1 text-xs text-gray-500">
                                                                <Truck className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                                <span className="truncate">{shippingInfo}</span>
                                                            </div>
                                                        )}
                                                        {req.admin_notes && (
                                                            <div className="flex items-start gap-1 text-xs text-blue-600 mt-1">
                                                                <StickyNote className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                                <span className="truncate">{req.admin_notes}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(req.status)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <select
                                                            value={req.status}
                                                            onChange={(e) => handleStatusUpdate(req.id, e.target.value)}
                                                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-[#0891B2] focus:border-[#0891B2]"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="approved">Approved</option>
                                                            <option value="in_progress">In Progress</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                        <button
                                                            onClick={() => openNoteModal(req)}
                                                            className="text-gray-400 hover:text-[#0891B2] transition-colors"
                                                            title="Add/Edit Note"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <Package className="w-12 h-12 text-gray-300 mb-4" />
                                                <p className="text-gray-500 font-medium">No service requests found</p>
                                                <p className="text-gray-400 text-sm">
                                                    {searchTerm ? 'Try adjusting your search terms' : 'Service requests will appear here when customers place them'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {serviceRequests?.data?.length > 0 && serviceRequests.last_page > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{serviceRequests.from}</span> to{' '}
                            <span className="font-medium">{serviceRequests.to}</span> of{' '}
                            <span className="font-medium">{serviceRequests.total}</span> requests
                        </div>
                        <nav className="flex gap-2">
                            {serviceRequests.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 text-sm rounded-lg ${
                                        link.active
                                            ? 'bg-[#0891B2] text-white'
                                            : link.url
                                            ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>

            {/* Admin Note Modal */}
            {noteModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setNoteModal(null)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Admin Note - Request #{noteModal.id}
                            </h3>
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                                placeholder="Add admin notes..."
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => setNoteModal(null)}
                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveNote}
                                    className="px-4 py-2 text-sm bg-[#0891B2] text-white rounded-lg hover:bg-[#0E7490] transition-colors"
                                >
                                    Save Note
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Index;

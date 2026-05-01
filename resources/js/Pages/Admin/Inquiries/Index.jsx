import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    Eye,
    Trash2,
    CheckCircle,
    Mail,
    Archive,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Home,
    Clock,
    User
} from 'lucide-react';

export default function InquiriesIndex({ inquiries, filters = {}, counts = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [inquiryToDelete, setInquiryToDelete] = useState(null);
    const [selectedInquiries, setSelectedInquiries] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.inquiries.index'), { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key, value) => {
        router.get(route('admin.inquiries.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    const markAsRead = (inquiry) => {
        router.post(route('admin.inquiries.mark-read', inquiry.id), {}, { preserveScroll: true });
    };

    const markAsResponded = (inquiry) => {
        router.post(route('admin.inquiries.mark-responded', inquiry.id), {}, { preserveScroll: true });
    };

    const archiveInquiry = (inquiry) => {
        router.post(route('admin.inquiries.archive', inquiry.id), {}, { preserveScroll: true });
    };

    const deleteInquiry = () => {
        if (inquiryToDelete) {
            router.delete(route('admin.inquiries.destroy', inquiryToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setInquiryToDelete(null);
                }
            });
        }
    };

    const toggleSelect = (id) => {
        setSelectedInquiries(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        const allIds = inquiryList.map(i => i.id);
        setSelectedInquiries(prev =>
            prev.length === allIds.length ? [] : allIds
        );
    };

    const bulkAction = (action) => {
        if (selectedInquiries.length === 0) return;
        router.post(route('admin.inquiries.bulk-action'), {
            ids: selectedInquiries,
            action
        }, {
            preserveScroll: true,
            onSuccess: () => setSelectedInquiries([])
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            new: 'bg-blue-100 text-blue-700',
            read: 'bg-yellow-100 text-yellow-700',
            responded: 'bg-green-100 text-green-700',
            on_hold: 'bg-indigo-100 text-indigo-700',
            archived: 'bg-gray-100 text-gray-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusLabel = (status) => {
        const labels = {
            new: 'New',
            read: 'Read',
            responded: 'Responded',
            on_hold: 'On Hold',
            archived: 'Archived',
        };
        return labels[status] || (status ? status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'New');
    };

    const tabs = [
        { key: '', label: 'All', count: counts.all || 0 },
        { key: 'new', label: 'New', count: counts.new || 0 },
        { key: 'read', label: 'Read', count: counts.read || 0 },
        { key: 'responded', label: 'Responded', count: counts.responded || 0 },
        { key: 'archived', label: 'Archived', count: counts.archived || 0 },
    ];

    const inquiryList = inquiries.data || inquiries;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <AdminLayout title="Inquiries">
            <Head title="Inquiries - Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Property Inquiries
                    </h1>
                    <p className="text-gray-500">Manage inquiries from potential buyers</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleFilter('status', tab.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            (filters.status || '') === tab.key
                                ? 'bg-[#3355FF] text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Search and Bulk Actions */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search inquiries..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Search
                        </button>
                    </form>

                    {selectedInquiries.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => bulkAction('read')}
                                className="px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                            >
                                Mark Read
                            </button>
                            <button
                                onClick={() => bulkAction('responded')}
                                className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                            >
                                Mark Responded
                            </button>
                            <button
                                onClick={() => bulkAction('archive')}
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Archive
                            </button>
                            <button
                                onClick={() => bulkAction('delete')}
                                className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Inquiries Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-3 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedInquiries.length === inquiryList.length && inquiryList.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300 text-[#1A1816] focus:ring-[#1A1816]"
                                    />
                                </th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">From</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Property</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Message</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Status</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Date</th>
                                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {inquiryList.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>No inquiries found</p>
                                    </td>
                                </tr>
                            ) : (
                                inquiryList.map((inquiry) => (
                                    <tr key={inquiry.id} className={`group hover:bg-gray-50 ${inquiry.status === 'new' ? 'bg-blue-50/30' : ''}`}>
                                        <td className="px-3 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedInquiries.includes(inquiry.id)}
                                                onChange={() => toggleSelect(inquiry.id)}
                                                className="rounded border-gray-300 text-[#1A1816] focus:ring-[#1A1816]"
                                            />
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#1A1816]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <User className="w-5 h-5 text-[#1A1816]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">{inquiry.name}</p>
                                                    <p className="text-sm text-gray-500 truncate">{inquiry.email}</p>
                                                    {inquiry.phone && (
                                                        <p className="text-sm text-gray-500 truncate">{inquiry.phone}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 max-w-[12rem]">
                                            {inquiry.property ? (
                                                <div className="flex items-start gap-2">
                                                    <Home className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <span
                                                        className="text-sm text-gray-900 line-clamp-2 break-words"
                                                        title={inquiry.property.property_title}
                                                    >
                                                        {inquiry.property.property_title}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">Property deleted</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-4 max-w-[14rem]">
                                            <p className="text-sm text-gray-600 truncate" title={inquiry.message}>
                                                {inquiry.message}
                                            </p>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(inquiry.status)}`}>
                                                {getStatusLabel(inquiry.status)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Clock className="w-4 h-4 flex-shrink-0" />
                                                {formatDate(inquiry.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-0.5">
                                                {inquiry.status === 'new' && (
                                                    <button
                                                        onClick={() => markAsRead(inquiry)}
                                                        className="p-1.5 text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg"
                                                        title="Mark as Read"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {inquiry.status !== 'responded' && inquiry.status !== 'archived' && (
                                                    <button
                                                        onClick={() => markAsResponded(inquiry)}
                                                        className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg"
                                                        title="Mark as Responded"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {inquiry.status !== 'archived' && (
                                                    <button
                                                        onClick={() => archiveInquiry(inquiry)}
                                                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                                        title="Archive"
                                                    >
                                                        <Archive className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <a
                                                    href={`mailto:${inquiry.email}`}
                                                    className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                                    title="Reply via Email"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        setInquiryToDelete(inquiry);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
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
                {inquiries.last_page > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Showing {inquiries.from} to {inquiries.to} of {inquiries.total}
                        </p>
                        <div className="flex items-center gap-2">
                            {inquiries.prev_page_url && (
                                <Link href={inquiries.prev_page_url} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                    <ChevronLeft className="w-5 h-5" />
                                </Link>
                            )}
                            <span className="text-sm">Page {inquiries.current_page} of {inquiries.last_page}</span>
                            {inquiries.next_page_url && (
                                <Link href={inquiries.next_page_url} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Inquiry</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete the inquiry from <strong>{inquiryToDelete?.name}</strong>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setInquiryToDelete(null); }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteInquiry}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

InquiriesIndex.layout = (page) => page;

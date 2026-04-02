import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    Eye,
    Trash2,
    CheckCircle,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    Users,
    Clock,
    User,
    MapPin,
    DollarSign,
    Building,
    FileCheck,
    X
} from 'lucide-react';

export default function BuyerInquiriesIndex({ inquiries, filters = {}, counts = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [inquiryToDelete, setInquiryToDelete] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [notes, setNotes] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.buyer-inquiries.index'), { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key, value) => {
        router.get(route('admin.buyer-inquiries.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    const updateStatus = (inquiry, status) => {
        router.put(route('admin.buyer-inquiries.update', inquiry.id), { status }, { preserveScroll: true });
    };

    const updateNotes = () => {
        if (selectedInquiry) {
            router.put(route('admin.buyer-inquiries.update', selectedInquiry.id), { notes }, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDetailModal(false);
                    setSelectedInquiry(null);
                    setNotes('');
                }
            });
        }
    };

    const deleteInquiry = () => {
        if (inquiryToDelete) {
            router.delete(route('admin.buyer-inquiries.destroy', inquiryToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setInquiryToDelete(null);
                }
            });
        }
    };

    const openDetail = (inquiry) => {
        setSelectedInquiry(inquiry);
        setNotes(inquiry.notes || '');
        setShowDetailModal(true);
    };

    const getStatusBadge = (status) => {
        const styles = {
            new: 'bg-blue-100 text-blue-700',
            contacted: 'bg-yellow-100 text-yellow-700',
            converted: 'bg-green-100 text-green-700',
            closed: 'bg-gray-100 text-gray-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusLabel = (status) => {
        const labels = {
            new: 'New Lead',
            contacted: 'Contacted',
            converted: 'Converted',
            closed: 'Closed',
        };
        return labels[status] || status;
    };

    const tabs = [
        { key: 'all', label: 'All Leads', count: counts.all || 0 },
        { key: 'new', label: 'New', count: counts.new || 0 },
        { key: 'contacted', label: 'Contacted', count: counts.contacted || 0 },
        { key: 'converted', label: 'Converted', count: counts.converted || 0 },
        { key: 'closed', label: 'Closed', count: counts.closed || 0 },
    ];

    const inquiryList = inquiries.data || inquiries;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        // Remove any non-numeric characters except decimal
        const numericPrice = price.replace(/[^0-9.]/g, '');
        if (!numericPrice) return price;
        return '$' + parseInt(numericPrice).toLocaleString();
    };

    return (
        <AdminLayout title="Buyer Inquiries">
            <Head title="Buyer Inquiries - Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Buyer Leads
                    </h1>
                    <p className="text-gray-500">Manage buyer sign-ups from the properties page</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{counts.all || 0} total leads</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleFilter('status', tab.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            (filters.status || 'all') === tab.key
                                ? 'bg-[#1A1816] text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, or area..."
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
            </div>

            {/* Inquiries Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Area</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price Range</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">MLS</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Preapproved</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {inquiryList.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>No buyer leads found</p>
                                    </td>
                                </tr>
                            ) : (
                                inquiryList.map((inquiry) => (
                                    <tr key={inquiry.id} className={`hover:bg-gray-50 ${inquiry.status === 'new' ? 'bg-blue-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#1A1816]/10 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-[#1A1816]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{inquiry.name}</p>
                                                    <p className="text-sm text-gray-500">{inquiry.email}</p>
                                                    {inquiry.phone && (
                                                        <p className="text-sm text-gray-500">{inquiry.phone}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-900">{inquiry.preferred_area}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm">
                                                <DollarSign className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-900">
                                                    {formatPrice(inquiry.price_min)} - {formatPrice(inquiry.price_max)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                                inquiry.mls_setup === 'yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {inquiry.mls_setup === 'yes' ? (
                                                    <>
                                                        <CheckCircle className="w-3 h-3" />
                                                        Yes
                                                    </>
                                                ) : 'No'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                                inquiry.preapproved === 'yes' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {inquiry.preapproved === 'yes' ? (
                                                    <>
                                                        <FileCheck className="w-3 h-3" />
                                                        Yes
                                                    </>
                                                ) : 'Not yet'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={inquiry.status}
                                                onChange={(e) => updateStatus(inquiry, e.target.value)}
                                                className={`px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${getStatusBadge(inquiry.status)}`}
                                            >
                                                <option value="new">New Lead</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="converted">Converted</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                {formatDate(inquiry.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openDetail(inquiry)}
                                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <a
                                                    href={`mailto:${inquiry.email}`}
                                                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                                    title="Email"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </a>
                                                {inquiry.phone && (
                                                    <a
                                                        href={`tel:${inquiry.phone}`}
                                                        className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg"
                                                        title="Call"
                                                    >
                                                        <Phone className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setInquiryToDelete(inquiry);
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

            {/* Detail Modal */}
            {showDetailModal && selectedInquiry && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Buyer Lead Details</h3>
                            <button
                                onClick={() => { setShowDetailModal(false); setSelectedInquiry(null); }}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Contact Info */}
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-[#1A1816]/10 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-[#1A1816]" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">{selectedInquiry.name}</h4>
                                    <div className="flex flex-col gap-1 mt-2">
                                        <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {selectedInquiry.email}
                                        </a>
                                        {selectedInquiry.phone && (
                                            <a href={`tel:${selectedInquiry.phone}`} className="text-green-600 hover:underline flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                {selectedInquiry.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Property Preferences */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Preferred Area</p>
                                    <p className="text-gray-900 font-medium flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {selectedInquiry.preferred_area}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Price Range</p>
                                    <p className="text-gray-900 font-medium flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        {formatPrice(selectedInquiry.price_min)} - {formatPrice(selectedInquiry.price_max)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">MLS Setup Requested</p>
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-full ${
                                        selectedInquiry.mls_setup === 'yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {selectedInquiry.mls_setup === 'yes' ? 'Yes, set me up' : 'No, thank you'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Preapproved</p>
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-full ${
                                        selectedInquiry.preapproved === 'yes' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {selectedInquiry.preapproved === 'yes' ? 'Yes' : 'Not yet'}
                                    </span>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Status</p>
                                <select
                                    value={selectedInquiry.status}
                                    onChange={(e) => {
                                        updateStatus(selectedInquiry, e.target.value);
                                        setSelectedInquiry({ ...selectedInquiry, status: e.target.value });
                                    }}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                                >
                                    <option value="new">New Lead</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="converted">Converted</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            {/* Notes */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Notes</p>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                    placeholder="Add notes about this lead..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] resize-none"
                                />
                            </div>

                            {/* Submitted Date */}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                Submitted on {formatDate(selectedInquiry.created_at)}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={() => { setShowDetailModal(false); setSelectedInquiry(null); }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateNotes}
                                className="px-4 py-2 bg-[#1A1816] text-white rounded-lg hover:bg-[#111111]"
                            >
                                Save Notes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Buyer Lead</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete the lead from <strong>{inquiryToDelete?.name}</strong>? This action cannot be undone.
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

BuyerInquiriesIndex.layout = (page) => page;

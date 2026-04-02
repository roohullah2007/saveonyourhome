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
    MessageCircle,
    Clock,
    User,
    Send
} from 'lucide-react';

export default function MessagesIndex({ messages, filters = {}, counts = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewMessage, setViewMessage] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.messages.index'), { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key, value) => {
        router.get(route('admin.messages.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    const markAsRead = (message) => {
        router.post(route('admin.messages.mark-read', message.id), {}, { preserveScroll: true });
    };

    const markAsResponded = (message) => {
        router.post(route('admin.messages.mark-responded', message.id), {}, { preserveScroll: true });
    };

    const archiveMessage = (message) => {
        router.post(route('admin.messages.archive', message.id), {}, { preserveScroll: true });
    };

    const deleteMessage = () => {
        if (messageToDelete) {
            router.delete(route('admin.messages.destroy', messageToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setMessageToDelete(null);
                }
            });
        }
    };

    const toggleSelect = (id) => {
        setSelectedMessages(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        const allIds = messageList.map(m => m.id);
        setSelectedMessages(prev =>
            prev.length === allIds.length ? [] : allIds
        );
    };

    const bulkAction = (action) => {
        if (selectedMessages.length === 0) return;
        router.post(route('admin.messages.bulk-action'), {
            ids: selectedMessages,
            action
        }, {
            preserveScroll: true,
            onSuccess: () => setSelectedMessages([])
        });
    };

    const openViewModal = (message) => {
        setViewMessage(message);
        setShowViewModal(true);
        if (message.status === 'new') {
            markAsRead(message);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            new: 'bg-blue-100 text-blue-700',
            read: 'bg-yellow-100 text-yellow-700',
            responded: 'bg-green-100 text-green-700',
            archived: 'bg-gray-100 text-gray-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    const tabs = [
        { key: '', label: 'All', count: counts.all || 0 },
        { key: 'new', label: 'New', count: counts.new || 0 },
        { key: 'read', label: 'Read', count: counts.read || 0 },
        { key: 'responded', label: 'Responded', count: counts.responded || 0 },
        { key: 'archived', label: 'Archived', count: counts.archived || 0 },
    ];

    const messageList = messages.data || messages;

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

    return (
        <AdminLayout title="Messages">
            <Head title="Messages - Admin" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Contact Messages
                    </h1>
                    <p className="text-gray-500">Manage messages from the contact form</p>
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
                                ? 'bg-[#1A1816] text-white'
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
                                placeholder="Search messages..."
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

                    {selectedMessages.length > 0 && (
                        <div className="flex gap-2">
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

            {/* Messages Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedMessages.length === messageList.length && messageList.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300 text-[#1A1816] focus:ring-[#1A1816]"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">From</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {messageList.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>No messages found</p>
                                    </td>
                                </tr>
                            ) : (
                                messageList.map((message) => (
                                    <tr key={message.id} className={`hover:bg-gray-50 ${message.status === 'new' ? 'bg-blue-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedMessages.includes(message.id)}
                                                onChange={() => toggleSelect(message.id)}
                                                className="rounded border-gray-300 text-[#1A1816] focus:ring-[#1A1816]"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#1A1816]/10 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-[#1A1816]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{message.name}</p>
                                                    <p className="text-sm text-gray-500">{message.email}</p>
                                                    {message.phone && (
                                                        <p className="text-sm text-gray-500">{message.phone}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">{message.subject || 'No Subject'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 truncate max-w-xs cursor-pointer hover:text-[#555]" title="Click to view full message" onClick={() => openViewModal(message)}>
                                                {message.message}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(message.status)}`}>
                                                {message.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                {formatDate(message.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openViewModal(message)}
                                                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                                    title="View Message"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {message.status !== 'responded' && message.status !== 'archived' && (
                                                    <button
                                                        onClick={() => markAsResponded(message)}
                                                        className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg"
                                                        title="Mark as Responded"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {message.status !== 'archived' && (
                                                    <button
                                                        onClick={() => archiveMessage(message)}
                                                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                                        title="Archive"
                                                    >
                                                        <Archive className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.location.href = `mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject || 'Your Message')}`;
                                                    }}
                                                    className="p-2 text-[#1A1816] hover:text-[#111111] hover:bg-red-50 rounded-lg"
                                                    title="Reply via Email"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setMessageToDelete(message);
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
                {messages.last_page > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Showing {messages.from} to {messages.to} of {messages.total}
                        </p>
                        <div className="flex items-center gap-2">
                            {messages.prev_page_url && (
                                <Link href={messages.prev_page_url} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                    <ChevronLeft className="w-5 h-5" />
                                </Link>
                            )}
                            <span className="text-sm">Page {messages.current_page} of {messages.last_page}</span>
                            {messages.next_page_url && (
                                <Link href={messages.next_page_url} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Message</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete the message from <strong>{messageToDelete?.name}</strong>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setMessageToDelete(null); }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteMessage}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Message Modal */}
            {showViewModal && viewMessage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Message Details</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(viewMessage.status)}`}>
                                {viewMessage.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 bg-[#1A1816]/10 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-[#1A1816]" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{viewMessage.name}</p>
                                    <p className="text-sm text-gray-500">{viewMessage.email}</p>
                                    {viewMessage.phone && <p className="text-sm text-gray-500">{viewMessage.phone}</p>}
                                </div>
                            </div>

                            {viewMessage.subject && (
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
                                    <p className="text-gray-900 mt-1">{viewMessage.subject}</p>
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Message</label>
                                <p className="text-gray-700 mt-1 whitespace-pre-wrap">{viewMessage.message}</p>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                Received: {formatDate(viewMessage.created_at)}
                            </div>
                        </div>

                        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                            <div className="flex gap-2">
                                {viewMessage.status !== 'responded' && (
                                    <button
                                        onClick={() => {
                                            markAsResponded(viewMessage);
                                            setShowViewModal(false);
                                        }}
                                        className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                                    >
                                        Mark as Responded
                                    </button>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = `mailto:${viewMessage.email}?subject=Re: ${encodeURIComponent(viewMessage.subject || 'Your Message')}`;
                                    }}
                                    className="px-4 py-2 text-sm bg-[#1A1816] text-white rounded-lg hover:bg-[#111111] inline-flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Reply via Email
                                </button>
                            </div>
                            <button
                                onClick={() => { setShowViewModal(false); setViewMessage(null); }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

MessagesIndex.layout = (page) => page;

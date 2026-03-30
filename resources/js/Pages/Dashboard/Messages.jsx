import { Head, Link, router } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import {
    Search,
    User,
    Send,
    Trash2,
    Check,
    CheckCheck,
    Clock,
    Home,
    MessageSquare,
    ChevronRight,
    ChevronLeft,
    Mail,
    Phone
} from 'lucide-react';
import { useState } from 'react';

export default function Messages({ messages, filters = {}, counts = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const messagesData = messages?.data || messages || [];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('dashboard.messages'), { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (status) => {
        router.get(route('dashboard.messages'), { ...filters, status }, { preserveState: true });
    };

    const handleMarkRead = (inquiry) => {
        if (inquiry.status !== 'new') return;
        setActionLoading(true);
        router.post(route('dashboard.messages.read', inquiry.id), {}, {
            preserveState: true,
            onSuccess: () => {
                setActionLoading(false);
                if (selectedMessage?.id === inquiry.id) {
                    setSelectedMessage({ ...selectedMessage, status: 'read' });
                }
            },
            onError: () => setActionLoading(false)
        });
    };

    const handleMarkResponded = (inquiry) => {
        setActionLoading(true);
        router.post(route('dashboard.messages.responded', inquiry.id), {}, {
            preserveState: true,
            onSuccess: () => {
                setActionLoading(false);
                if (selectedMessage?.id === inquiry.id) {
                    setSelectedMessage({ ...selectedMessage, status: 'responded' });
                }
            },
            onError: () => setActionLoading(false)
        });
    };

    const handleDelete = () => {
        if (messageToDelete) {
            setDeleting(true);
            router.delete(route('dashboard.messages.destroy', messageToDelete.id), {
                preserveState: true,
                onSuccess: () => {
                    if (selectedMessage?.id === messageToDelete.id) {
                        setSelectedMessage(null);
                    }
                    setShowDeleteModal(false);
                    setMessageToDelete(null);
                    setDeleting(false);
                },
                onError: () => {
                    setDeleting(false);
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

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return formatDate(dateString);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'new':
                return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">New</span>;
            case 'read':
                return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Read</span>;
            case 'responded':
                return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Responded</span>;
            default:
                return null;
        }
    };

    return (
        <UserDashboardLayout title="Messages">
            <Head title="Messages" />

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
                {/* Messages List */}
                <div className="lg:w-96 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                                Inbox
                            </h2>
                            {counts.unread > 0 && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#0891B2] text-white">
                                    {counts.unread} new
                                </span>
                            )}
                        </div>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                            />
                        </form>

                        {/* Filters */}
                        <div className="flex gap-2">
                            {[
                                { key: 'all', label: 'All', count: counts.all || 0 },
                                { key: 'unread', label: 'Unread', count: counts.unread || 0 },
                                { key: 'read', label: 'Read', count: counts.read || 0 }
                            ].map((f) => (
                                <button
                                    key={f.key}
                                    onClick={() => handleFilter(f.key)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                        (filters.status || 'all') === f.key
                                            ? 'bg-[#0891B2] text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {f.label} ({f.count})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto">
                        {messagesData.length === 0 ? (
                            <div className="p-8 text-center">
                                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-gray-500 text-sm">
                                    {search || (filters.status && filters.status !== 'all')
                                        ? 'No messages found'
                                        : 'No inquiries yet'}
                                </p>
                            </div>
                        ) : (
                            messagesData.map((msg) => (
                                <button
                                    key={msg.id}
                                    onClick={() => {
                                        setSelectedMessage(msg);
                                        if (msg.status === 'new') {
                                            handleMarkRead(msg);
                                        }
                                    }}
                                    className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                        selectedMessage?.id === msg.id ? 'bg-[#0891B2]/5 border-l-2 border-l-[#0891B2]' : ''
                                    } ${msg.status === 'new' ? 'bg-blue-50/50' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={`text-sm truncate ${msg.status === 'new' ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                    {msg.name}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    {msg.status === 'new' && (
                                                        <span className="w-2 h-2 bg-[#0891B2] rounded-full" />
                                                    )}
                                                    <span className="text-xs text-gray-400">{formatTime(msg.created_at)}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-[#0891B2] mt-0.5 truncate">
                                                Re: {msg.property?.property_title || 'Property'}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {msg.message}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {messages?.last_page > 1 && (
                        <div className="p-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                Page {messages.current_page} of {messages.last_page}
                            </span>
                            <div className="flex gap-1">
                                {messages.prev_page_url && (
                                    <Link
                                        href={messages.prev_page_url}
                                        className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Link>
                                )}
                                {messages.next_page_url && (
                                    <Link
                                        href={messages.next_page_url}
                                        className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Message Detail */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    {selectedMessage ? (
                        <>
                            {/* Message Header */}
                            <div className="p-4 sm:p-6 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#0891B2]/10 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-[#0891B2]" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                                                    {selectedMessage.name}
                                                </h3>
                                                {getStatusBadge(selectedMessage.status)}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                                                <a href={`mailto:${selectedMessage.email}`} className="flex items-center gap-1 hover:text-[#0891B2]">
                                                    <Mail className="w-4 h-4" />
                                                    {selectedMessage.email}
                                                </a>
                                                {selectedMessage.phone && (
                                                    <a href={`tel:${selectedMessage.phone}`} className="flex items-center gap-1 hover:text-[#0891B2]">
                                                        <Phone className="w-4 h-4" />
                                                        {selectedMessage.phone}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {selectedMessage.status !== 'responded' && (
                                            <button
                                                onClick={() => handleMarkResponded(selectedMessage)}
                                                disabled={actionLoading}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                                                title="Mark as Responded"
                                            >
                                                <CheckCheck className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                setMessageToDelete(selectedMessage);
                                                setShowDeleteModal(true);
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Property Reference */}
                                {selectedMessage.property && (
                                    <Link
                                        href={`/properties/${selectedMessage.property.id}`}
                                        className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3 hover:bg-gray-100 transition-colors"
                                    >
                                        <Home className="w-5 h-5 text-gray-400" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Regarding</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedMessage.property.property_title}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </Link>
                                )}
                            </div>

                            {/* Message Content */}
                            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                    <Clock className="w-4 h-4" />
                                    {formatDate(selectedMessage.created_at)} • {formatTime(selectedMessage.created_at)}
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            {/* Reply Section */}
                            <div className="p-4 sm:p-6 border-t border-gray-100">
                                <div className="flex gap-3">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.property?.property_title || 'Your Inquiry'}`}
                                        onClick={() => {
                                            if (selectedMessage.status !== 'responded') {
                                                handleMarkResponded(selectedMessage);
                                            }
                                        }}
                                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0891B2] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0E7490] transition-colors"
                                    >
                                        <Send className="w-5 h-5" />
                                        Reply via Email
                                    </a>
                                    {selectedMessage.phone && (
                                        <a
                                            href={`tel:${selectedMessage.phone}`}
                                            className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                        >
                                            <Phone className="w-5 h-5" />
                                            Call
                                        </a>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a message</h3>
                                <p className="text-gray-500">Choose a message from the list to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Message</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete this message from <strong>{messageToDelete?.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setMessageToDelete(null); }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UserDashboardLayout>
    );
}

Messages.layout = (page) => page;

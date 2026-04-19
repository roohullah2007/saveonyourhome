import { Head, Link, router, usePage } from '@inertiajs/react';
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
    Phone,
    Reply
} from 'lucide-react';
import { useState } from 'react';

export default function Messages({ messages, filters = {}, counts = {}, sentCount = 0, activeTab = 'received' }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user;
    const [search, setSearch] = useState(filters.search || '');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replySending, setReplySending] = useState(false);

    const messagesData = messages?.data || messages || [];

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('dashboard.messages'), { ...filters, tab: activeTab, search }, { preserveState: true });
    };

    const handleFilter = (status) => {
        router.get(route('dashboard.messages'), { ...filters, tab: activeTab, status }, { preserveState: true });
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

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-96px)] lg:h-[calc(100vh-96px)] min-h-[600px]">
                {/* Messages List */}
                <div className="lg:w-96 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100">
                        {/* Received / Sent Tabs */}
                        <div className="flex items-center gap-1 mb-4 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => { setSelectedMessage(null); setShowReplyForm(false); router.get(route('dashboard.messages'), { tab: 'received' }); }}
                                className="flex-1 rounded-md py-2 text-xs font-semibold transition-colors text-center"
                                style={{
                                    backgroundColor: activeTab === 'received' ? 'rgb(26,24,22)' : 'transparent',
                                    color: activeTab === 'received' ? 'white' : 'rgb(107,114,128)',
                                }}
                            >
                                Received {counts.all > 0 && <span className="ml-1">({counts.all})</span>}
                            </button>
                            <button
                                onClick={() => { setSelectedMessage(null); setShowReplyForm(false); router.get(route('dashboard.messages'), { tab: 'sent' }); }}
                                className="flex-1 rounded-md py-2 text-xs font-semibold transition-colors text-center"
                                style={{
                                    backgroundColor: activeTab === 'sent' ? 'rgb(26,24,22)' : 'transparent',
                                    color: activeTab === 'sent' ? 'white' : 'rgb(107,114,128)',
                                }}
                            >
                                Sent {sentCount > 0 && <span className="ml-1">({sentCount})</span>}
                            </button>
                        </div>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
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
                                            ? 'bg-[#3355FF] text-white'
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
                            messagesData.map((msg) => {
                                const replies = msg.replies || [];
                                const latestReply = replies.length > 0 ? replies[replies.length - 1] : null;
                                const lastSeen = msg.last_seen_at ? new Date(msg.last_seen_at) : null;
                                const latestReplyTime = latestReply ? new Date(latestReply.created_at) : null;
                                const hasNewReply = latestReply && latestReply.user_id !== currentUser?.id && (!lastSeen || latestReplyTime > lastSeen);
                                const neverSeen = !lastSeen && (msg.status === 'new' || replies.length > 0);
                                const isNew = neverSeen || hasNewReply;
                                const latestTime = latestReply ? latestReply.created_at : msg.created_at;

                                return (
                                <button
                                    key={msg.id}
                                    onClick={() => {
                                        setSelectedMessage({ ...msg, last_seen_at: new Date().toISOString(), status: msg.status === 'new' ? 'read' : msg.status });
                                        // Mark as seen on server — refresh page data to update counts and list
                                        router.post(route('dashboard.messages.seen', msg.id), {}, { preserveScroll: true });
                                    }}
                                    className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                        selectedMessage?.id === msg.id ? 'bg-[#1A1816]/5 border-l-2 border-l-[#1A1816]' : ''
                                    } ${isNew ? 'bg-blue-50/50' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="relative w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-gray-500" />
                                            {isNew && (
                                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={`text-sm truncate ${isNew ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                    {msg.name}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs text-gray-400">{formatTime(latestTime)}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-[#1A1816] mt-0.5 truncate">
                                                Re: {msg.property?.property_title || 'Property'}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {msg.message}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                                );
                            })
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
                                        <div className="w-12 h-12 bg-[#1A1816]/10 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-[#1A1816]" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900">
                                                    {selectedMessage.name}
                                                </h3>
                                                {getStatusBadge(selectedMessage.status)}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                                                <a href={`mailto:${selectedMessage.email}`} className="flex items-center gap-1 hover:text-[#555]">
                                                    <Mail className="w-4 h-4" />
                                                    {selectedMessage.email}
                                                </a>
                                                {selectedMessage.phone && (
                                                    <a href={`tel:${selectedMessage.phone}`} className="flex items-center gap-1 hover:text-[#555]">
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

                            {/* Message Content — Chat Thread */}
                            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                                {(() => {
                                    const isBuyerMe = selectedMessage.user_id === currentUser?.id || selectedMessage.email === currentUser?.email;
                                    const buyerName = selectedMessage.name || 'Buyer';
                                    const sellerName = selectedMessage.property?.contact_name || 'Seller';
                                    const replies = selectedMessage.replies || [];

                                    return (
                                        <>
                                            {/* Original inquiry message */}
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                                                <User className="w-3.5 h-3.5" />
                                                <span className="font-medium" style={{ color: 'rgb(26,24,22)' }}>{isBuyerMe ? 'You' : buyerName}</span>
                                                <span>•</span>
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatDate(selectedMessage.created_at)} • {formatTime(selectedMessage.created_at)}
                                            </div>
                                            <div className={`rounded-xl p-4 mb-4 ${isBuyerMe ? 'bg-[#1A1816]/5 ml-8' : 'bg-gray-50 mr-8'}`}>
                                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed" style={{ fontSize: '14px' }}>
                                                    {selectedMessage.message}
                                                </p>
                                            </div>

                                            {/* All replies in chronological order */}
                                            {replies.map((reply, idx) => {
                                                const isMe = reply.user_id === currentUser?.id;
                                                const replyerName = reply.user?.name || 'Unknown';
                                                const replyTime = reply.created_at ? new Date(reply.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';
                                                return (
                                                    <div key={reply.id || idx} className="mt-3">
                                                        <div className={`flex items-center gap-2 text-xs text-gray-400 mb-1 ${isMe ? 'justify-end mr-8' : 'ml-0'}`}>
                                                            {!isMe && <Reply className="w-3.5 h-3.5" />}
                                                            <span className="font-semibold" style={{ color: isMe ? 'rgb(26,24,22)' : 'rgb(22,163,74)' }}>{isMe ? 'You' : replyerName}</span>
                                                            <span>•</span>
                                                            <span>{replyTime}</span>
                                                            {isMe && <Reply className="w-3.5 h-3.5" />}
                                                        </div>
                                                        <div className={`rounded-xl p-4 ${isMe ? 'bg-[#1A1816]/5 ml-8' : 'bg-green-50 border border-green-100 mr-8'}`}>
                                                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed" style={{ fontSize: '14px' }}>
                                                                {reply.message}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Fallback: show seller_reply if no replies in message_replies table */}
                                            {replies.length === 0 && selectedMessage.seller_reply && (
                                                <div className="mt-3">
                                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                                                        <Reply className="w-3.5 h-3.5" />
                                                        <span className="font-medium" style={{ color: 'rgb(26,24,22)' }}>{sellerName}</span>
                                                        <span>•</span>
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {selectedMessage.seller_replied_at ? formatTime(selectedMessage.seller_replied_at) : ''}
                                                    </div>
                                                    <div className="rounded-xl p-4 bg-green-50 border border-green-100 mr-8">
                                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed" style={{ fontSize: '14px' }}>
                                                            {selectedMessage.seller_reply}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* End of chat indicator */}
                                            {(replies.length > 0 || selectedMessage.seller_reply) && (
                                                <div className="mt-4 text-center">
                                                    <span style={{ fontSize: '11px', color: 'rgb(156,163,175)' }}>End of conversation</span>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Reply Section */}
                            <div className="p-4 sm:p-6 border-t border-gray-100">
                                {showReplyForm ? (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgb(107,114,128)', marginBottom: '6px' }}>
                                            {(() => {
                                                const isBuyerMe = selectedMessage.user_id === currentUser?.id || selectedMessage.email === currentUser?.email;
                                                return isBuyerMe ? `Reply to ${selectedMessage.property?.contact_name || 'Seller'}` : `Reply to ${selectedMessage.name}`;
                                            })()}
                                        </label>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type your reply here..."
                                            rows={4}
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-gray-500 resize-none mb-3"
                                            style={{ fontSize: '14px', color: 'rgb(26,24,22)' }}
                                        />
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => {
                                                    if (!replyText.trim()) return;
                                                    setReplySending(true);
                                                    const msgId = selectedMessage.id;
                                                    router.post(route('dashboard.messages.reply', msgId), {
                                                        reply: replyText,
                                                    }, {
                                                        preserveScroll: true,
                                                        onSuccess: (page) => {
                                                            setReplySending(false);
                                                            setShowReplyForm(false);
                                                            setReplyText('');
                                                            // Find the updated message from refreshed data
                                                            const updatedMessages = page.props.messages?.data || page.props.messages || [];
                                                            const updated = updatedMessages.find(m => m.id === msgId);
                                                            if (updated) {
                                                                setSelectedMessage(updated);
                                                            }
                                                        },
                                                        onError: () => setReplySending(false),
                                                    });
                                                }}
                                                disabled={replySending || !replyText.trim()}
                                                className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                                                style={{ backgroundColor: '#3355FF', height: '42px', paddingLeft: '20px', paddingRight: '20px', fontSize: '13px', fontWeight: 600 }}
                                            >
                                                <Send className="w-4 h-4" />
                                                {replySending ? 'Sending...' : 'Send Reply'}
                                            </button>
                                            <button
                                                onClick={() => { setShowReplyForm(false); setReplyText(''); }}
                                                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white transition-colors hover:bg-gray-50"
                                                style={{ height: '42px', paddingLeft: '20px', paddingRight: '20px', fontSize: '13px', fontWeight: 600, color: 'rgb(26,24,22)' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-400">
                                            Your reply will be emailed to {selectedMessage.email}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <button
                                            onClick={() => setShowReplyForm(true)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90"
                                            style={{ backgroundColor: '#3355FF', height: '44px', fontSize: '14px', fontWeight: 600 }}
                                        >
                                            <Reply className="w-4 h-4" />
                                            {selectedMessage.seller_reply ? 'Reply Again' : 'Reply in Platform'}
                                        </button>
                                        <a
                                            href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.property?.property_title || 'Your Inquiry'}`}
                                            onClick={() => {
                                                if (selectedMessage.status !== 'responded') {
                                                    handleMarkResponded(selectedMessage);
                                                }
                                            }}
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white transition-colors hover:bg-gray-50"
                                            style={{ height: '44px', fontSize: '14px', fontWeight: 600, color: 'rgb(26,24,22)' }}
                                        >
                                            <Mail className="w-4 h-4" />
                                            Reply via Email
                                        </a>
                                        {selectedMessage.phone && (
                                            <a
                                                href={`tel:${selectedMessage.phone}`}
                                                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white transition-colors hover:bg-gray-50"
                                                style={{ height: '44px', paddingLeft: '20px', paddingRight: '20px', fontSize: '14px', fontWeight: 600, color: 'rgb(26,24,22)' }}
                                            >
                                                <Phone className="w-4 h-4" />
                                                Call
                                            </a>
                                        )}
                                    </div>
                                )}
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

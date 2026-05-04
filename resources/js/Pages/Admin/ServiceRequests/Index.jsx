import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    Home,
    Package,
    Tag,
    Sticker,
    Camera,
    Video,
    Globe,
    X,
    StickyNote,
    Mail,
    Phone,
} from 'lucide-react';

const SERVICE_TYPE_LABELS = {
    yard_sign: 'Yard Sign',
    qr_stickers: 'QR Stickers',
    photos: 'Professional Photos',
    virtual_tour: 'Virtual Tour',
    video: 'Video Walkthrough',
    mls: 'MLS Listing',
};

const SERVICE_TYPE_ICONS = {
    yard_sign: Tag,
    qr_stickers: Sticker,
    photos: Camera,
    virtual_tour: Globe,
    video: Video,
    mls: Globe,
};

const STATUS_LABELS = {
    pending: 'Pending',
    approved: 'Approved',
    in_progress: 'In progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const STATUS_BADGES = {
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    approved: 'bg-blue-100 text-blue-800 border border-blue-200',
    in_progress: 'bg-purple-100 text-purple-800 border border-purple-200',
    completed: 'bg-green-100 text-green-800 border border-green-200',
    cancelled: 'bg-gray-100 text-gray-700 border border-gray-200',
};

const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
};

export default function ServiceRequestsIndex({ serviceRequests, counts = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [detailRequest, setDetailRequest] = useState(null);
    const noteForm = useForm({ admin_notes: '' });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.service-requests.index'), { ...filters, search }, { preserveState: true });
    };

    const setFilter = (key, value) => {
        const next = { ...filters, [key]: value };
        if (!value || value === 'all') delete next[key];
        router.get(route('admin.service-requests.index'), next, { preserveState: true });
    };

    const updateStatus = (sr, status) => {
        router.post(route('admin.service-requests.update-status', sr.id), { status }, { preserveScroll: true });
    };

    const openDetail = (sr) => {
        setDetailRequest(sr);
        noteForm.setData('admin_notes', sr.admin_notes || '');
    };

    const saveNote = (e) => {
        e.preventDefault();
        if (!detailRequest) return;
        noteForm.post(route('admin.service-requests.add-note', detailRequest.id), {
            preserveScroll: true,
            onSuccess: () => setDetailRequest(null),
        });
    };

    const data = serviceRequests?.data || [];
    const links = serviceRequests?.links || [];

    const activeStatus = filters.status || 'all';
    const activeType = filters.type || 'all';

    return (
        <AdminLayout>
            <Head title="Service Requests" />

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
                    <p className="text-sm text-gray-500 mt-1">Yard sign orders, QR stickers, and other seller service requests.</p>
                </div>
            </div>

            {/* Status tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
                {[
                    { key: 'all', label: 'All' },
                    { key: 'pending', label: 'Pending' },
                    { key: 'approved', label: 'Approved' },
                    { key: 'in_progress', label: 'In progress' },
                    { key: 'completed', label: 'Completed' },
                    { key: 'cancelled', label: 'Cancelled' },
                ].map((s) => (
                    <button
                        key={s.key}
                        type="button"
                        onClick={() => setFilter('status', s.key)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                            activeStatus === s.key
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {s.label}
                        <span className={`text-xs ${activeStatus === s.key ? 'text-white/80' : 'text-gray-400'}`}>
                            {counts[s.key] ?? 0}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search + type filter */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by user, email, address, or notes…"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm"
                            />
                        </div>
                    </form>
                    <select
                        value={activeType}
                        onChange={(e) => setFilter('type', e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 bg-white"
                    >
                        <option value="all">All types</option>
                        {Object.entries(SERVICE_TYPE_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="text-left px-4 py-3 font-medium">Type</th>
                                <th className="text-left px-4 py-3 font-medium">Requested by</th>
                                <th className="text-left px-4 py-3 font-medium">Property</th>
                                <th className="text-left px-4 py-3 font-medium">Status</th>
                                <th className="text-left px-4 py-3 font-medium">Submitted</th>
                                <th className="text-right px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400">
                                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                        No service requests found.
                                    </td>
                                </tr>
                            )}
                            {data.map((sr) => {
                                const Icon = SERVICE_TYPE_ICONS[sr.service_type] || Package;
                                return (
                                    <tr key={sr.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                    <Icon className="w-4 h-4 text-[#3355FF]" />
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {SERVICE_TYPE_LABELS[sr.service_type] || sr.service_type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900 flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5 text-gray-400" />
                                                {sr.user?.name || '—'}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                                                <Mail className="w-3 h-3 text-gray-400" />
                                                {sr.user?.email || '—'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {sr.property ? (
                                                <Link
                                                    href={route('admin.properties.show', sr.property.id)}
                                                    className="text-[#3355FF] hover:underline"
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <Home className="w-3.5 h-3.5 text-gray-400" />
                                                        <span className="line-clamp-1">{sr.property.property_title || sr.property.address}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        {sr.property.city}, {sr.property.state}
                                                    </div>
                                                </Link>
                                            ) : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGES[sr.status] || STATUS_BADGES.pending}`}>
                                                {STATUS_LABELS[sr.status] || sr.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                {formatDate(sr.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="inline-flex items-center gap-1.5">
                                                <select
                                                    value={sr.status}
                                                    onChange={(e) => updateStatus(sr, e.target.value)}
                                                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10 bg-white"
                                                >
                                                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                                                        <option key={k} value={k}>{v}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => openDetail(sr)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                                >
                                                    <StickyNote className="w-3.5 h-3.5" />
                                                    Details
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {serviceRequests?.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
                        <div className="text-xs text-gray-600">
                            Showing {serviceRequests.from || 0}–{serviceRequests.to || 0} of {serviceRequests.total || 0}
                        </div>
                        <div className="flex items-center gap-1">
                            {links.map((link, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    className={`px-3 py-1.5 text-xs rounded-lg ${
                                        link.active
                                            ? 'bg-gray-900 text-white'
                                            : link.url
                                                ? 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-700'
                                                : 'text-gray-300 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Detail / notes modal */}
            {detailRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetailRequest(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {SERVICE_TYPE_LABELS[detailRequest.service_type] || detailRequest.service_type} request #{detailRequest.id}
                                </h3>
                                <button onClick={() => setDetailRequest(null)} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Close">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                <div className="rounded-xl bg-gray-50 p-3">
                                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Requested by</p>
                                    <p className="font-medium text-gray-900">{detailRequest.user?.name || '—'}</p>
                                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                                        <Mail className="w-3 h-3" />
                                        {detailRequest.user?.email || '—'}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-gray-50 p-3">
                                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Status</p>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGES[detailRequest.status] || STATUS_BADGES.pending}`}>
                                        {STATUS_LABELS[detailRequest.status] || detailRequest.status}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-2">Submitted {formatDate(detailRequest.created_at)}</p>
                                </div>
                            </div>

                            {detailRequest.property && (
                                <div className="rounded-xl border border-gray-200 p-3 mb-5">
                                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Property</p>
                                    <p className="font-medium text-gray-900">{detailRequest.property.property_title || detailRequest.property.address}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {detailRequest.property.address}, {detailRequest.property.city}, {detailRequest.property.state} {detailRequest.property.zip_code}
                                    </p>
                                </div>
                            )}

                            {/* Yard-sign-specific: print kit (listing URL + QR ready to forward to printer) */}
                            {detailRequest.service_type === 'yard_sign' && detailRequest.property && (() => {
                                const slug = detailRequest.property.slug || detailRequest.property.id;
                                const origin = typeof window !== 'undefined' ? window.location.origin : '';
                                const listingUrl = `${origin}/properties/${slug}`;
                                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(listingUrl)}`;
                                return (
                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 mb-5">
                                        <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold mb-3">Print kit</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-start">
                                            <a href={qrUrl} target="_blank" rel="noopener noreferrer" className="block w-[120px] h-[120px] bg-white border border-emerald-200 rounded-lg overflow-hidden">
                                                <img src={qrUrl} alt="Listing QR code" className="w-full h-full object-contain" />
                                            </a>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-500">Listing URL</p>
                                                    <a href={listingUrl} target="_blank" rel="noopener noreferrer" className="text-[#3355FF] hover:underline break-all">{listingUrl}</a>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">QR code image (500×500 PNG)</p>
                                                    <a href={qrUrl} target="_blank" rel="noopener noreferrer" className="text-[#3355FF] hover:underline break-all">{qrUrl}</a>
                                                </div>
                                                <div className="pt-1">
                                                    <a href={qrUrl} download={`yard-sign-qr-${detailRequest.property.id}.png`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline">
                                                        Download QR (PNG)
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="rounded-xl bg-gray-50 p-3 mb-5">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Submitted notes (shipping info)</p>
                                <pre className="text-xs whitespace-pre-wrap text-gray-700 font-mono">{detailRequest.notes || '—'}</pre>
                            </div>

                            <form onSubmit={saveNote} className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin note</label>
                                    <textarea
                                        rows={4}
                                        value={noteForm.data.admin_notes}
                                        onChange={(e) => noteForm.setData('admin_notes', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 text-sm"
                                        placeholder="Internal notes about this request…"
                                    />
                                    {noteForm.errors.admin_notes && <p className="text-red-500 text-xs mt-1">{noteForm.errors.admin_notes}</p>}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setDetailRequest(null)}
                                        className="px-4 py-2 text-sm rounded-full text-gray-700 hover:bg-gray-100"
                                        disabled={noteForm.processing}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={noteForm.processing}
                                        className="px-5 py-2 text-sm rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-60"
                                    >
                                        {noteForm.processing ? 'Saving…' : 'Save note'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Pencil, Mail, Phone, MapPin, Calendar, Shield, Home, MessageSquare, Activity } from 'lucide-react';

const roleLabels = {
    admin: { label: 'Admin', className: 'bg-purple-100 text-purple-700' },
    seller: { label: 'Seller', className: 'bg-blue-100 text-blue-700' },
    buyer: { label: 'Buyer', className: 'bg-green-100 text-green-700' },
    agent: { label: 'Agent', className: 'bg-orange-100 text-orange-700' },
};

function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtDateOnly(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ShowUser({ user, properties = [], inquiries = [], activityLogs = [] }) {
    const role = roleLabels[user.role] || { label: user.role, className: 'bg-gray-100 text-gray-700' };

    return (
        <AdminLayout title={user.name}>
            <Head title={`${user.name} — Admin`} />

            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                        <Link
                            href={route('admin.users.index')}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex-shrink-0"
                            title="Back to users"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                                    #{user.id}
                                </span>
                                <span className={`inline-flex items-center text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-md ${role.className}`}>
                                    {role.label}
                                </span>
                                <span className={`inline-flex items-center text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-md ${user.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{user.name}</h1>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.users.edit', user.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3355FF] text-white rounded-lg text-sm font-semibold hover:bg-[#1D4ED8] transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit user
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#3355FF]" />
                            Profile
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                    <dt className="text-xs text-gray-500">Email</dt>
                                    <dd className="text-gray-900 truncate">{user.email || '—'}</dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                    <dt className="text-xs text-gray-500">Phone</dt>
                                    <dd className="text-gray-900">{user.phone || '—'}</dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                    <dt className="text-xs text-gray-500">Address</dt>
                                    <dd className="text-gray-900">
                                        {[user.address, user.city, user.state, user.zip_code].filter(Boolean).join(', ') || '—'}
                                    </dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <dt className="text-xs text-gray-500">Joined</dt>
                                    <dd className="text-gray-900">{fmtDateOnly(user.created_at)}</dd>
                                </div>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Activity columns */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Home className="w-4 h-4 text-[#3355FF]" />
                            Recent listings
                            <span className="text-xs font-normal text-gray-500">({properties.length})</span>
                        </h2>
                        {properties.length === 0 ? (
                            <p className="text-sm text-gray-500">No listings yet.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {properties.map((p) => (
                                    <li key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <Link
                                                href={route('admin.properties.show', p.id)}
                                                className="text-sm font-medium text-gray-900 hover:text-[#3355FF] truncate block"
                                            >
                                                {p.property_title}
                                            </Link>
                                            <p className="text-xs text-gray-500 truncate">{p.city}, {p.state}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">{fmtDateOnly(p.created_at)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-[#3355FF]" />
                            Recent inquiries
                            <span className="text-xs font-normal text-gray-500">({inquiries.length})</span>
                        </h2>
                        {inquiries.length === 0 ? (
                            <p className="text-sm text-gray-500">No inquiries yet.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {inquiries.map((i) => (
                                    <li key={i.id} className="py-2.5">
                                        <p className="text-sm text-gray-900 line-clamp-2">{i.message}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {i.property?.property_title ? `Re: ${i.property.property_title} · ` : ''}
                                            {fmtDate(i.created_at)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#3355FF]" />
                            Activity log
                            <span className="text-xs font-normal text-gray-500">({activityLogs.length})</span>
                        </h2>
                        {activityLogs.length === 0 ? (
                            <p className="text-sm text-gray-500">No recorded activity yet.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {activityLogs.map((log) => (
                                    <li key={log.id} className="py-2.5 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900">{log.action}</p>
                                            {log.description && <p className="text-xs text-gray-500 truncate">{log.description}</p>}
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">{fmtDate(log.created_at)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

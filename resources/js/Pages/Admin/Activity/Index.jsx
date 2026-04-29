import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Activity as ActivityIcon, Search, User as UserIcon, Clock } from 'lucide-react';

function formatTimestamp(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function actionTone(action) {
    if (action?.endsWith('_created') || action?.endsWith('_approved') || action?.endsWith('_added')) return 'bg-green-50 text-green-700';
    if (action?.endsWith('_updated')) return 'bg-blue-50 text-blue-700';
    if (action?.endsWith('_deleted') || action?.endsWith('_rejected') || action?.endsWith('_removed')) return 'bg-red-50 text-red-700';
    return 'bg-gray-100 text-gray-700';
}

export default function ActivityIndex({ logs = { data: [] }, filters = {}, actions = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [action, setAction] = useState(filters.action || '');

    const applyFilters = (next = {}) => {
        router.get(route('admin.activity.index'), { ...filters, search, action, ...next }, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Activity — Admin" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ActivityIcon className="w-6 h-6 text-[#3355FF]" /> Activity Log
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Every notable admin + system event. Useful for auditing who changed what and when.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap items-end gap-3 shadow-sm">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search description or action…"
                                className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-[#3355FF] focus:ring-2 focus:ring-[#3355FF]/20"
                            />
                        </div>
                    </div>
                    <div className="min-w-[180px]">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Action</label>
                        <select
                            value={action}
                            onChange={(e) => { setAction(e.target.value); applyFilters({ action: e.target.value }); }}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#3355FF] focus:ring-2 focus:ring-[#3355FF]/20"
                        >
                            <option value="">All actions</option>
                            {actions.map((a) => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="rounded-lg bg-[#3355FF] text-white px-4 py-2 text-sm font-semibold hover:opacity-90">
                        Apply
                    </button>
                </form>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-5 py-3">When</th>
                                    <th className="px-5 py-3">Action</th>
                                    <th className="px-5 py-3">Description</th>
                                    <th className="px-5 py-3">User</th>
                                    <th className="px-5 py-3">IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {!logs.data.length ? (
                                    <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500">No activity yet.</td></tr>
                                ) : logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 whitespace-nowrap text-gray-700 text-xs">
                                            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" /> {formatTimestamp(log.created_at)}</div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${actionTone(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-gray-700 max-w-[480px]">{log.description || '—'}</td>
                                        <td className="px-5 py-3">
                                            {log.user ? (
                                                <div className="flex items-center gap-1.5 text-gray-700">
                                                    <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{log.user.name}</span>
                                                </div>
                                            ) : <span className="text-gray-400">System</span>}
                                        </td>
                                        <td className="px-5 py-3 text-xs font-mono text-gray-500">{log.ip_address || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {logs.links && logs.data.length > 0 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs text-gray-600">
                            <span>Page {logs.current_page} of {logs.last_page} · {logs.total} total</span>
                            <div className="flex gap-2">
                                {logs.prev_page_url && <Link href={logs.prev_page_url} className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50">Previous</Link>}
                                {logs.next_page_url && <Link href={logs.next_page_url} className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50">Next</Link>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

ActivityIndex.layout = (page) => <AdminLayout title="Activity">{page}</AdminLayout>;

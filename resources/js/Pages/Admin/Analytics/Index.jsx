import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { BarChart3, Download, Users, Home as HomeIcon, BookOpen, MessageSquare, Clock, User as UserIcon } from 'lucide-react';

function StatCard({ label, value, sub, icon: Icon, accent = 'bg-blue-50 text-blue-700' }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</div>
                <div className={`rounded-lg p-1.5 ${accent}`}><Icon className="w-4 h-4" /></div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{value?.toLocaleString?.() ?? value}</div>
            {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
        </div>
    );
}

// Tiny inline sparkline — accepts [{date, count}] and renders an SVG polyline.
function Sparkline({ series = [], height = 60 }) {
    const { points, max, count } = useMemo(() => {
        const c = series.length || 1;
        const m = series.reduce((acc, s) => Math.max(acc, s.count), 0) || 1;
        const step = 100 / Math.max(c - 1, 1);
        const pts = series.map((s, i) => `${(i * step).toFixed(2)},${(100 - (s.count / m) * 100).toFixed(2)}`).join(' ');
        return { points: pts, max: m, count: c };
    }, [series]);

    if (!series.length) {
        return <div className="text-xs text-gray-400 italic">No downloads yet</div>;
    }

    return (
        <div className="w-full" style={{ height }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <polyline fill="none" stroke="#3355FF" strokeWidth="2" vectorEffect="non-scaling-stroke" points={points} />
            </svg>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>{series[0].date}</span>
                <span>peak: {max}</span>
                <span>{series[count - 1].date}</span>
            </div>
        </div>
    );
}

function formatTimestamp(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AnalyticsIndex({ stats = {}, topEbooks = [], downloadSeries = [], recentDownloads = [] }) {
    return (
        <>
            <Head title="Analytics — Admin" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-[#3355FF]" /> Analytics
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Downloads, signups, and listing activity at a glance. Every eBook download is logged here.</p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                    <StatCard label="Downloads (total)" value={stats.total_downloads} sub={`${stats.total_ebooks || 0} eBooks · ${stats.active_ebooks || 0} active`} icon={Download} accent="bg-indigo-50 text-indigo-700" />
                    <StatCard label="Downloads · 7d" value={stats.downloads_7d} icon={Download} accent="bg-blue-50 text-blue-700" />
                    <StatCard label="Downloads · 30d" value={stats.downloads_30d} sub={`${stats.unique_downloaders_30d || 0} unique users`} icon={Download} accent="bg-blue-50 text-blue-700" />
                    <StatCard label="Users (total)" value={stats.total_users} sub={`${stats.new_users_7d || 0} new this week`} icon={Users} accent="bg-green-50 text-green-700" />
                    <StatCard label="Listings · approved" value={stats.approved_properties} sub={`${stats.total_properties || 0} total · ${stats.new_listings_7d || 0} this week`} icon={HomeIcon} accent="bg-orange-50 text-orange-700" />
                    <StatCard label="Inquiries · 7d" value={stats.new_inquiries_7d} icon={MessageSquare} accent="bg-purple-50 text-purple-700" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sparkline + top ebooks */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm lg:col-span-2">
                        <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><Download className="w-4 h-4 text-[#3355FF]" /> Downloads · last 30 days</h2>
                        <Sparkline series={downloadSeries} />
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#3355FF]" /> Top eBooks</h2>
                        {topEbooks.length === 0 ? (
                            <p className="text-sm text-gray-500">No downloads yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {topEbooks.map((eb, i) => (
                                    <li key={eb.id} className="flex items-center gap-3">
                                        <span className="w-5 text-xs font-bold text-gray-400">{i + 1}</span>
                                        {eb.cover_url ? (
                                            <img src={eb.cover_url} alt="" className="w-8 h-10 object-cover rounded border border-gray-200" />
                                        ) : (
                                            <div className="w-8 h-10 rounded border border-gray-200 bg-gray-100 flex items-center justify-center">
                                                <BookOpen className="w-4 h-4 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-900 truncate">{eb.title}</div>
                                            <div className="text-xs text-gray-500">{eb.download_count?.toLocaleString() || 0} downloads</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Recent downloads log */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Clock className="w-4 h-4 text-[#3355FF]" /> Recent downloads</h2>
                        <Link href={route('admin.ebooks.index')} className="text-xs text-[#3355FF] hover:underline font-semibold">Manage eBooks →</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-5 py-3">When</th>
                                    <th className="px-5 py-3">eBook</th>
                                    <th className="px-5 py-3">User</th>
                                    <th className="px-5 py-3">IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentDownloads.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-10 text-center text-gray-500">No downloads yet.</td>
                                    </tr>
                                ) : recentDownloads.map((dl) => (
                                    <tr key={dl.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 whitespace-nowrap text-gray-700">{formatTimestamp(dl.created_at)}</td>
                                        <td className="px-5 py-3">
                                            {dl.ebook ? (
                                                <span className="font-medium text-gray-900">{dl.ebook.title}</span>
                                            ) : <span className="text-gray-400">(deleted)</span>}
                                        </td>
                                        <td className="px-5 py-3">
                                            {dl.user ? (
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{dl.user.name}</span>
                                                    <span className="text-xs text-gray-400">{dl.user.email}</span>
                                                </div>
                                            ) : <span className="text-gray-400">Guest</span>}
                                        </td>
                                        <td className="px-5 py-3 text-xs font-mono text-gray-500">{dl.ip_address || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

AnalyticsIndex.layout = (page) => <AdminLayout title="Analytics">{page}</AdminLayout>;

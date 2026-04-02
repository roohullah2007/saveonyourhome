import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Upload,
    FileText,
    Clock,
    CheckCircle,
    AlertTriangle,
    Trash2,
    Eye,
    Download,
    Plus,
} from 'lucide-react';

export default function ImportsIndex({ batches, stats, filters }) {
    const tabs = [
        { key: '', label: 'All', count: stats.total_batches },
        { key: 'active', label: 'Active', count: stats.active_batches },
        { key: 'expired', label: 'Expired', count: stats.total_batches - stats.active_batches },
    ];

    const handleDelete = (batchId) => {
        if (confirm('Delete this batch and all unclaimed properties? This cannot be undone.')) {
            router.delete(route('admin.imports.destroy', batchId));
        }
    };

    return (
        <AdminLayout title="Zillow FSBO Imports">
            <Head title="Imports" />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total_batches}</p>
                            <p className="text-sm text-gray-500">Total Batches</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Clock className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.active_batches}</p>
                            <p className="text-sm text-gray-500">Active Batches</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Upload className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total_imported}</p>
                            <p className="text-sm text-gray-500">Total Imported</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Eye className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total_viewed}</p>
                            <p className="text-sm text-gray-500">Total Viewed</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total_claimed}</p>
                            <p className="text-sm text-gray-500">Total Claimed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.key}
                            href={route('admin.imports.index', tab.key ? { tab: tab.key } : {})}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                (filters.tab || '') === tab.key
                                    ? 'bg-[#1A1816] text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border'
                            }`}
                        >
                            {tab.label} ({tab.count})
                        </Link>
                    ))}
                </div>
                <Link
                    href={route('admin.imports.create')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A1816] text-white rounded-lg hover:bg-[#111111] transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Import CSV
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {batches.data.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No imports yet</p>
                        <p className="text-sm mt-1">Upload a Zillow FSBO CSV to get started</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Batch</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Source</th>
                                <th className="text-center px-4 py-3 font-medium text-gray-500">Imported</th>
                                <th className="text-center px-4 py-3 font-medium text-gray-500">Viewed</th>
                                <th className="text-center px-4 py-3 font-medium text-gray-500">Claimed</th>
                                <th className="text-center px-4 py-3 font-medium text-gray-500">Failed</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Expires</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                                <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {batches.data.map((batch) => {
                                const isExpired = new Date(batch.expires_at) < new Date();
                                return (
                                    <tr key={batch.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-gray-900">#{batch.id}</p>
                                                <p className="text-xs text-gray-500">{batch.original_filename}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                                                {batch.source}
                                            </span>
                                        </td>
                                        <td className="text-center px-4 py-3 font-medium">{batch.imported_count}</td>
                                        <td className="text-center px-4 py-3">
                                            <span className="text-blue-600 font-medium">{batch.viewed_count || 0}</span>
                                            <span className="text-gray-400">/{batch.imported_count}</span>
                                        </td>
                                        <td className="text-center px-4 py-3">
                                            <span className="text-green-600 font-medium">{batch.claimed_count}</span>
                                            <span className="text-gray-400">/{batch.imported_count}</span>
                                        </td>
                                        <td className="text-center px-4 py-3">
                                            {batch.failed_count > 0 ? (
                                                <span className="text-red-600">{batch.failed_count}</span>
                                            ) : (
                                                <span className="text-gray-400">0</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {new Date(batch.expires_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isExpired ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                                                    <AlertTriangle className="w-3 h-3" /> Expired
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                                                    <CheckCircle className="w-3 h-3" /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.imports.show', batch.id)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <a
                                                    href={route('admin.imports.batch-letters', batch.id)}
                                                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded"
                                                    title="Download Letters"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(batch.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {batches.links && batches.last_page > 1 && (
                    <div className="px-4 py-3 border-t flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {batches.from} to {batches.to} of {batches.total}
                        </p>
                        <div className="flex gap-1">
                            {batches.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 text-sm rounded ${
                                        link.active
                                            ? 'bg-[#1A1816] text-white'
                                            : link.url
                                            ? 'text-gray-600 hover:bg-gray-100'
                                            : 'text-gray-300 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

ImportsIndex.layout = (page) => page;

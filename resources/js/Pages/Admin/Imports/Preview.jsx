import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    AlertTriangle,
    FileText,
    Upload,
} from 'lucide-react';

export default function ImportsPreview({ validRows, errors, filename, tempPath, expirationDays, notes }) {
    const [importing, setImporting] = useState(false);

    const handleImport = () => {
        setImporting(true);
        router.post(route('admin.imports.store'), {
            temp_path: tempPath,
            expiration_days: expirationDays,
            notes: notes,
        });
    };

    return (
        <AdminLayout title="Preview Import">
            <Head title="Preview Import" />

            <div className="mb-6">
                <Link
                    href={route('admin.imports.create')}
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Upload
                </Link>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">File</span>
                    </div>
                    <p className="font-medium text-gray-900 truncate">{filename}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-500">Valid Rows</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{validRows.length}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-500">Errors</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{errors.length}</p>
                </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-medium text-red-800 mb-2">
                        Errors ({errors.length} rows will be skipped)
                    </h3>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                        {errors.map((error, i) => (
                            <p key={i} className="text-xs text-red-700">
                                Row {error.row}: {error.message}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* Valid Rows Preview */}
            {validRows.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
                    <div className="px-4 py-3 border-b bg-gray-50">
                        <h3 className="text-sm font-medium text-gray-700">
                            Preview ({validRows.length} properties to import)
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs">#</th>
                                    <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs">Owner</th>
                                    <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs">Address</th>
                                    <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs">City</th>
                                    <th className="text-right px-3 py-2 font-medium text-gray-500 text-xs">Price</th>
                                    <th className="text-center px-3 py-2 font-medium text-gray-500 text-xs">Beds</th>
                                    <th className="text-center px-3 py-2 font-medium text-gray-500 text-xs">Baths</th>
                                    <th className="text-right px-3 py-2 font-medium text-gray-500 text-xs">Sqft</th>
                                    <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {validRows.slice(0, 50).map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                                        <td className="px-3 py-2">
                                            <div>
                                                <p className="text-gray-900">{row.owner_name || '-'}</p>
                                                {row.owner_email && (
                                                    <p className="text-xs text-gray-400">{row.owner_email}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-gray-900">{row.address}</td>
                                        <td className="px-3 py-2 text-gray-600">{row.city}</td>
                                        <td className="px-3 py-2 text-right font-medium">
                                            ${Number(String(row.price).replace(/[,$]/g, '')).toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2 text-center">{row.bedrooms || '-'}</td>
                                        <td className="px-3 py-2 text-center">{row.bathrooms || '-'}</td>
                                        <td className="px-3 py-2 text-right">{row.sqft ? Number(String(row.sqft).replace(',', '')).toLocaleString() : '-'}</td>
                                        <td className="px-3 py-2 text-gray-600">{row.property_type || 'single_family'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {validRows.length > 50 && (
                        <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 text-center">
                            Showing first 50 of {validRows.length} rows
                        </div>
                    )}
                </div>
            )}

            {/* Import Settings Summary */}
            <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Import Settings</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Claim expiration:</span>{' '}
                        <span className="font-medium">{expirationDays} days</span>
                    </div>
                    {notes && (
                        <div>
                            <span className="text-gray-500">Notes:</span>{' '}
                            <span className="font-medium">{notes}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                <Link
                    href={route('admin.imports.create')}
                    className="px-4 py-2.5 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                    Cancel
                </Link>
                <button
                    onClick={handleImport}
                    disabled={importing || validRows.length === 0}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#0891B2] text-white rounded-lg hover:bg-[#0E7490] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                    {importing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Importing...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" />
                            Import {validRows.length} Properties
                        </>
                    )}
                </button>
            </div>
        </AdminLayout>
    );
}

ImportsPreview.layout = (page) => page;

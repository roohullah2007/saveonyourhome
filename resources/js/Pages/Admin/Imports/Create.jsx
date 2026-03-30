import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';
import { Upload, FileText, AlertCircle, ArrowLeft, Search, Globe, Check, X, Ban, Download } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function ImportsCreate({ hasZillowApi }) {
    const [activeTab, setActiveTab] = useState(hasZillowApi ? 'api' : 'csv');

    return (
        <AdminLayout title="Import FSBO Listings">
            <Head title="Import FSBO Listings" />

            <div className="mb-6">
                <Link
                    href={route('admin.imports.index')}
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Imports
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {hasZillowApi && (
                    <button
                        onClick={() => setActiveTab('api')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'api'
                                ? 'bg-[#0891B2] text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border'
                        }`}
                    >
                        <Globe className="w-4 h-4" /> Zillow API Search
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('csv')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'csv'
                            ? 'bg-[#0891B2] text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border'
                    }`}
                >
                    <Upload className="w-4 h-4" /> CSV Upload
                </button>
            </div>

            {activeTab === 'api' && hasZillowApi ? <ZillowApiTab /> : <CsvUploadTab />}
        </AdminLayout>
    );
}

function ZillowApiTab() {
    const [location, setLocation] = useState('');
    const [listingType, setListingType] = useState('fsbo');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showFsboOnly, setShowFsboOnly] = useState(false);
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [importing, setImporting] = useState(false);
    const [expirationDays, setExpirationDays] = useState(30);
    const [notes, setNotes] = useState('');

    const displayResults = results?.results
        ? (showFsboOnly ? results.results.filter((l) => l.is_fsbo) : results.results)
        : [];

    const handleSearch = async (page = 1) => {
        if (location.trim().length < 2) {
            setError('Please enter a city, state, or zip code');
            return;
        }

        setSearching(true);
        setError('');

        try {
            const params = { location: location.trim(), page, listing_type: listingType };
            if (minPrice) params.min_price = parseInt(minPrice);
            if (maxPrice) params.max_price = parseInt(maxPrice);

            const { data } = await axios.get(route('admin.imports.search-zillow'), {
                params,
            });

            if (data.success) {
                setResults(data);
                setCurrentPage(data.currentPage);
                if (page === 1) {
                    setSelectedIds(new Set());
                }
            } else {
                setError(data.error || 'Search failed');
                setResults(null);
            }
        } catch (e) {
            setError(e.response?.data?.error || e.response?.data?.message || 'Network error. Please try again.');
        } finally {
            setSearching(false);
        }
    };

    const selectableResults = displayResults.filter((l) => !l.already_imported);

    const toggleSelect = (index) => {
        // Prevent selecting already-imported listings
        if (results.results[index]?.already_imported) return;
        const next = new Set(selectedIds);
        if (next.has(index)) {
            next.delete(index);
        } else {
            next.add(index);
        }
        setSelectedIds(next);
    };

    const selectAll = () => {
        if (!selectableResults.length) return;
        if (selectedIds.size === selectableResults.length) {
            setSelectedIds(new Set());
        } else {
            // Only select items that aren't already imported
            const indices = new Set(
                selectableResults.map((item) => results.results.indexOf(item))
            );
            setSelectedIds(indices);
        }
    };

    const handleImport = () => {
        if (selectedIds.size === 0) return;

        const listings = Array.from(selectedIds).map((i) => results.results[i]);
        setImporting(true);

        router.post(route('admin.imports.store-api'), {
            listings,
            expiration_days: expirationDays,
            notes,
        });
    };

    return (
        <div className="max-w-5xl">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-lg font-semibold mb-1">Search Zillow FSBO Listings</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Search for For Sale by Owner listings by city, state, or zip code.
                </p>

                {/* Search */}
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Tulsa, OK or 74105"
                        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-[#0891B2] focus:border-[#0891B2]"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={() => handleSearch(1)}
                        disabled={searching || !location.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0891B2] text-white rounded-lg hover:bg-[#0E7490] disabled:opacity-50 text-sm font-medium"
                    >
                        {searching ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Search className="w-4 h-4" />
                        )}
                        Search
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-gray-500">Listing Type:</label>
                        <select
                            value={listingType}
                            onChange={(e) => setListingType(e.target.value)}
                            className="px-2 py-1.5 border rounded text-sm focus:ring-[#0891B2] focus:border-[#0891B2]"
                        >
                            <option value="fsbo">FSBO Only</option>
                            <option value="all">All Listings</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-gray-500">Price Range:</label>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min"
                            className="w-28 px-2 py-1.5 border rounded text-sm focus:ring-[#0891B2] focus:border-[#0891B2]"
                        />
                        <span className="text-gray-400 text-sm">to</span>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max"
                            className="w-28 px-2 py-1.5 border rounded text-sm focus:ring-[#0891B2] focus:border-[#0891B2]"
                        />
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                    <strong>Tip:</strong> Enter a city and state (e.g. "Tulsa, OK"), a zip code (e.g. "74105"),
                    or a state name (e.g. "Oklahoma"). Use the price range to narrow results.
                    <br />
                    <strong>Note:</strong> Some FSBO listings on Zillow may not appear in API results.
                    For specific listings, use the CSV Upload tab instead.
                </div>

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                        {error}
                    </div>
                )}
            </div>

            {/* Results */}
            {results && (
                <>
                    {/* Import Settings */}
                    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                        <div className="flex items-center gap-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Claim Expiration</label>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={expirationDays}
                                        onChange={(e) => setExpirationDays(e.target.value)}
                                        className="w-20 px-2 py-1.5 border rounded text-sm"
                                    />
                                    <span className="text-sm text-gray-500">days</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Notes (optional)</label>
                                <input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Notes about this import..."
                                    className="w-full px-2 py-1.5 border rounded text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-4">
                        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-sm font-medium text-gray-700">
                                    Found {results.totalCount.toLocaleString()} listings
                                </h3>
                                <span className="text-xs text-gray-400">
                                    Page {results.currentPage} ({displayResults.length} shown)
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                {listingType === 'all' && (
                                    <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showFsboOnly}
                                            onChange={(e) => {
                                                setShowFsboOnly(e.target.checked);
                                                setSelectedIds(new Set());
                                            }}
                                            className="rounded border-gray-300 text-[#0891B2] focus:ring-[#0891B2]"
                                        />
                                        <span className="font-medium text-gray-600">Show FSBO only</span>
                                    </label>
                                )}
                                <button
                                    onClick={selectAll}
                                    className="text-xs text-[#0891B2] hover:underline font-medium"
                                >
                                    {selectedIds.size === selectableResults.length && selectableResults.length > 0 ? 'Deselect All' : 'Select All'}
                                </button>
                                <span className="text-xs text-gray-400">
                                    {selectedIds.size} selected
                                </span>
                            </div>
                        </div>

                        {displayResults.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                {showFsboOnly
                                    ? 'No FSBO listings found on this page. Try unchecking the filter or searching a different area.'
                                    : 'No listings found for this search. Try a different location.'}
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="w-10 px-3 py-2"></th>
                                        <th className="w-16 px-3 py-2"></th>
                                        <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs">Address</th>
                                        <th className="text-right px-3 py-2 font-medium text-gray-500 text-xs">Price</th>
                                        <th className="text-center px-3 py-2 font-medium text-gray-500 text-xs">Beds</th>
                                        <th className="text-center px-3 py-2 font-medium text-gray-500 text-xs">Baths</th>
                                        <th className="text-right px-3 py-2 font-medium text-gray-500 text-xs">Sqft</th>
                                        <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs">Type</th>
                                        <th className="text-center px-3 py-2 font-medium text-gray-500 text-xs">Listing</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {displayResults.map((listing) => {
                                        const originalIndex = results.results.indexOf(listing);
                                        const isImported = listing.already_imported;
                                        return (
                                            <tr
                                                key={originalIndex}
                                                className={`transition-colors ${
                                                    isImported
                                                        ? 'bg-gray-50 opacity-60 cursor-not-allowed'
                                                        : selectedIds.has(originalIndex)
                                                        ? 'bg-red-50 cursor-pointer'
                                                        : 'hover:bg-gray-50 cursor-pointer'
                                                }`}
                                                onClick={() => toggleSelect(originalIndex)}
                                            >
                                                <td className="px-3 py-2 text-center">
                                                    {isImported ? (
                                                        <div className="w-5 h-5 rounded border-2 border-gray-300 bg-gray-200 flex items-center justify-center">
                                                            <Ban className="w-3 h-3 text-gray-400" />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                                selectedIds.has(originalIndex)
                                                                    ? 'border-[#0891B2] bg-[#0891B2]'
                                                                    : 'border-gray-300'
                                                            }`}
                                                        >
                                                            {selectedIds.has(originalIndex) && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {listing.image_url ? (
                                                        <img src={listing.image_url} alt="" className="w-12 h-9 object-cover rounded" />
                                                    ) : (
                                                        <div className="w-12 h-9 bg-gray-100 rounded flex items-center justify-center">
                                                            <span className="text-gray-300 text-[10px]">No img</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <p className="font-medium text-gray-900">{listing.address}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {listing.city}, {listing.state} {listing.zip_code}
                                                    </p>
                                                </td>
                                                <td className="px-3 py-2 text-right font-medium">
                                                    {listing.price_formatted || `$${Number(listing.price).toLocaleString()}`}
                                                </td>
                                                <td className="px-3 py-2 text-center">{listing.bedrooms || '-'}</td>
                                                <td className="px-3 py-2 text-center">{listing.bathrooms || '-'}</td>
                                                <td className="px-3 py-2 text-right">
                                                    {listing.sqft ? Number(listing.sqft).toLocaleString() : '-'}
                                                </td>
                                                <td className="px-3 py-2 text-gray-600 text-xs">{listing.property_type}</td>
                                                <td className="px-3 py-2 text-center">
                                                    {isImported ? (
                                                        <span className="inline-block px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                                                            Imported
                                                        </span>
                                                    ) : listing.is_fsbo ? (
                                                        <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                                            FSBO
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                                                            Agent
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        {/* Pagination */}
                        {results.totalCount > results.results.length && (
                            <div className="px-4 py-3 border-t flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    Showing page {results.currentPage} of ~{Math.ceil(results.totalCount / 41)}
                                </span>
                                <div className="flex gap-2">
                                    {results.currentPage > 1 && (
                                        <button
                                            onClick={() => handleSearch(results.currentPage - 1)}
                                            disabled={searching}
                                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleSearch(results.currentPage + 1)}
                                        disabled={searching}
                                        className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next Page
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Import Button */}
                    {selectedIds.size > 0 && (
                        <div className="sticky bottom-4">
                            <div className="bg-white rounded-lg shadow-lg border-2 border-[#0891B2] p-4 flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    {selectedIds.size} listing{selectedIds.size !== 1 ? 's' : ''} selected
                                </span>
                                <button
                                    onClick={handleImport}
                                    disabled={importing}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#0891B2] text-white rounded-lg hover:bg-[#0E7490] disabled:opacity-50 font-medium text-sm"
                                >
                                    {importing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Importing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Import {selectedIds.size} Listings
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function CsvUploadTab() {
    const [dragOver, setDragOver] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        csv_file: null,
        expiration_days: 30,
        notes: '',
    });

    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('csv_file', file);
            setFileName(file.name);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.csv') || file.type === 'text/csv')) {
            setData('csv_file', file);
            setFileName(file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.imports.preview'), {
            forceFormData: true,
        });
    };

    return (
        <div className="max-w-2xl">
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-1">Upload CSV File</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Import FSBO listings from a CSV file. Properties will be created as inactive
                    until claimed by the homeowner.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CSV File</label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                dragOver
                                    ? 'border-[#0891B2] bg-red-50'
                                    : fileName
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                        >
                            {fileName ? (
                                <div className="flex items-center justify-center gap-2 text-green-700">
                                    <FileText className="w-6 h-6" />
                                    <span className="font-medium">{fileName}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData('csv_file', null);
                                            setFileName('');
                                        }}
                                        className="text-gray-400 hover:text-red-500 ml-2"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-600">
                                        Drag & drop a CSV file, or{' '}
                                        <label className="text-[#0891B2] hover:underline cursor-pointer font-medium">
                                            browse
                                            <input
                                                type="file"
                                                accept=".csv"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Max 10MB</p>
                                </>
                            )}
                        </div>
                        {errors.csv_file && (
                            <p className="text-sm text-red-600 mt-1">{errors.csv_file}</p>
                        )}
                    </div>

                    {/* Expected Columns */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> Expected CSV Columns
                            </span>
                            <a
                                href={route('admin.imports.csv-template')}
                                className="inline-flex items-center gap-1 text-xs font-medium text-[#0891B2] hover:underline"
                            >
                                <Download className="w-3.5 h-3.5" /> Download Template
                            </a>
                        </h3>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            <strong>Required:</strong> address, city, price<br />
                            <strong>Optional:</strong> owner_name, owner_address, owner_phone, owner_email,
                            state, zip_code, bedrooms, bathrooms, sqft, property_type, year_built,
                            lot_size, description
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                            <strong>Property types:</strong> single_family, condo, townhouse, multi_family, land, mobile_home
                            <br />
                            <strong>Note:</strong> State defaults to Oklahoma if not provided.
                        </p>
                    </div>

                    {/* Expiration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Claim Expiration (days)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="365"
                            value={data.expiration_days}
                            onChange={(e) => setData('expiration_days', e.target.value)}
                            className="w-32 px-3 py-2 border rounded-lg text-sm focus:ring-[#0891B2] focus:border-[#0891B2]"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Homeowners must claim their listing within this period
                        </p>
                        {errors.expiration_days && (
                            <p className="text-sm text-red-600 mt-1">{errors.expiration_days}</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (optional)
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-[#0891B2] focus:border-[#0891B2]"
                            placeholder="Any notes about this import batch..."
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing || !data.csv_file}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0891B2] text-white rounded-lg hover:bg-[#0E7490] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Preview Import
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

ImportsCreate.layout = (page) => page;

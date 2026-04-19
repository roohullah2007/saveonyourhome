import React, { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight, Home, Heart, MapPin, X } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';
import Header from '@/Components/Header';
import PropertyMap from '@/Components/Properties/PropertyMap';
import AuthModal from '@/Components/AuthModal';
import { AMENITY_GROUPS, groupItems } from '@/constants/amenities';

// Beds & Baths dropdown with own local state so Apply always works
function BedsDropdown({ searchParams, onApply }) {
  const [beds, setBeds] = useState(searchParams.bedrooms || '');
  const [baths, setBaths] = useState(searchParams.bathrooms || '');

  return (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-xl z-50 p-4">
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-500 mb-2">Bedrooms</label>
        <div className="flex gap-1.5">
          {['', '1', '2', '3', '4', '5'].map((v) => (
            <button key={`bd-${v}`} type="button" className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${beds === v ? 'bg-[#1a1816] text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`} onClick={() => setBeds(v)}>{v === '' ? 'Any' : `${v}+`}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Bathrooms</label>
        <div className="flex gap-1.5">
          {['', '1', '2', '3', '4'].map((v) => (
            <button key={`ba-${v}`} type="button" className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${baths === v ? 'bg-[#1a1816] text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`} onClick={() => setBaths(v)}>{v === '' ? 'Any' : `${v}+`}</button>
          ))}
        </div>
      </div>
      <button type="button" onClick={() => onApply(beds, baths)} className="mt-3 w-full rounded-lg bg-[#1a1816] text-white py-2 text-sm font-semibold hover:opacity-90 transition-opacity">Apply</button>
    </div>
  );
}

function Properties({ properties = { data: [] }, filters = {}, isAdmin = false, allPropertiesForMap = [], sellerInfo = null }) {
  const { auth } = usePage().props;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'map' or 'list'
  const [searchParams, setSearchParams] = useState({
    keyword: String(filters.keyword || ''),
    location: String(filters.location || ''),
    status: String(filters.status || 'for-sale'),
    propertyType: String(filters.propertyType || ''),
    priceMin: String(filters.priceMin || ''),
    priceMax: String(filters.priceMax || ''),
    bedrooms: String(filters.bedrooms || ''),
    bathrooms: String(filters.bathrooms || ''),
    sort: (filters && typeof filters === 'object' && !Array.isArray(filters) && filters.sort) ? String(filters.sort) : 'newest',
    hasOpenHouse: String(filters.hasOpenHouse || ''),
    hasVirtualTour: String(filters.hasVirtualTour || ''),
    schoolDistrict: String(filters.schoolDistrict || ''),
    lotSizeMin: String(filters.lotSizeMin || ''),
    amenities: typeof filters.amenities === 'string'
      ? filters.amenities.split(',').filter(Boolean)
      : (Array.isArray(filters.amenities) ? filters.amenities : []),
  });
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationInputRef = useRef(null);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [saveSearchStatus, setSaveSearchStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
  const filterBarRef = useRef(null);
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
      if (locationInputRef.current && !locationInputRef.current.contains(e.target)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Build unique city/state suggestions from the map-wide property set
  const locationSuggestions = React.useMemo(() => {
    const query = (searchParams.location || '').trim().toLowerCase();
    const counts = new Map();
    (allPropertiesForMap || []).forEach((p) => {
      if (!p.city) return;
      const label = p.state ? `${p.city}, ${p.state}` : p.city;
      counts.set(label, {
        label,
        value: p.city,
        count: (counts.get(label)?.count || 0) + 1,
      });
    });
    let list = Array.from(counts.values());
    if (query) {
      list = list.filter((s) => s.label.toLowerCase().includes(query));
    }
    return list.sort((a, b) => b.count - a.count).slice(0, 8);
  }, [allPropertiesForMap, searchParams.location]);

  const propertyList = properties.data || properties || [];
  const pagination = properties.data ? properties : null;
  const totalCount = pagination ? pagination.total : propertyList.length;

  const handleSearchChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  // Serialize params for URL — amenities array → comma-separated string.
  const serializeParams = (p) => ({
    ...p,
    amenities: Array.isArray(p.amenities) ? p.amenities.join(',') : (p.amenities || ''),
  });

  const handleSearch = (e, overrideParams) => {
    e?.preventDefault();
    setOpenDropdown(null);
    const params = overrideParams || searchParams;
    router.get('/properties', serializeParams(params), { preserveState: true });
  };

  const handleSortChange = (value) => {
    const newParams = { ...searchParams, sort: value };
    setSearchParams(newParams);
    router.get('/properties', serializeParams(newParams), { preserveState: true });
  };

  const handleStatusTab = (status) => {
    const newParams = { ...searchParams, status };
    setSearchParams(newParams);
    router.get('/properties', serializeParams(newParams), { preserveState: true });
  };

  const toggleAmenity = (item) => {
    setSearchParams(prev => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter(a => a !== item)
        : [...prev.amenities, item],
    }));
  };

  const applyAmenities = () => {
    setShowAmenitiesModal(false);
    router.get('/properties', serializeParams(searchParamsRef.current), { preserveState: true });
  };

  const clearAmenities = () => {
    setSearchParams(prev => ({ ...prev, amenities: [] }));
  };

  const handleSaveSearch = async () => {
    if (!auth?.user) {
      setShowAuthModal(true);
      return;
    }
    setSaveSearchStatus('saving');
    // Build a readable name from active filters
    const parts = [];
    if (searchParams.location) parts.push(searchParams.location);
    if (searchParams.propertyType) parts.push(searchParams.propertyType.replace(/-/g, ' '));
    if (searchParams.priceMin || searchParams.priceMax) {
      parts.push(`$${searchParams.priceMin || '0'}-$${searchParams.priceMax || '∞'}`);
    }
    if (searchParams.bedrooms) parts.push(`${searchParams.bedrooms}+ bd`);
    const name = parts.length > 0 ? parts.join(', ') : 'All Properties';

    try {
      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: JSON.stringify({ name, filters: searchParams }),
      });
      if (response.ok) {
        setSaveSearchStatus('saved');
        setTimeout(() => setSaveSearchStatus(null), 2000);
      } else {
        setSaveSearchStatus('error');
        setTimeout(() => setSaveSearchStatus(null), 2000);
      }
    } catch {
      setSaveSearchStatus('error');
      setTimeout(() => setSaveSearchStatus(null), 2000);
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 mo ago';
    if (diffMonths < 12) return `${diffMonths} mo ago`;
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} yr ago`;
  };

  const handleFavorite = (e, property) => {
    e.preventDefault();
    e.stopPropagation();
    if (!auth?.user) {
      setShowAuthModal(true);
      return;
    }
    // Toggle favorite in localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.includes(property.id)) {
      localStorage.setItem('favorites', JSON.stringify(favorites.filter(id => id !== property.id)));
    } else {
      favorites.push(property.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  };

  const isFavorite = (propertyId) => {
    if (typeof window === 'undefined') return false;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(propertyId);
  };

  // Build pagination URL with all current filters
  const buildPageUrl = (page) => {
    const params = new URLSearchParams();
    params.set('page', page);
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value !== '' && !(key === 'status' && value === 'for-sale') && !(key === 'sort' && value === 'newest')) {
        params.set(key, value);
      }
    });
    // Always include status and sort
    if (searchParams.status) params.set('status', searchParams.status);
    if (searchParams.sort) params.set('sort', searchParams.sort);
    return `/properties?${params.toString()}`;
  };

  const mapProperties = allPropertiesForMap.length > 0 ? allPropertiesForMap : propertyList;

  return (
    <>
      <SEOHead
        title="Browse Properties For Sale"
        description="Browse FSBO homes for sale on SaveOnYourHome. Find properties listed by owner with no commission fees. Search by location, price, bedrooms, and more."
        keywords="homes for sale, FSBO listings, for sale by owner properties, houses for sale, real estate listings, buy home no commission"
      />

      <div className="flex flex-col min-h-screen">
        <Header maxWidth={1400} />

        {/* Seller Filter Banner */}
        {sellerInfo && (
          <div className="shrink-0 bg-[#EEF4FF] border-b border-[#DBE5F8]">
            <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-3 flex items-center justify-between gap-4 flex-wrap" style={{ maxWidth: 1400 }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-white border border-[#DBE5F8] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-[#6B7280]">Showing listings by</p>
                  <p className="text-sm font-semibold text-[#0F172A] truncate">{sellerInfo.name}</p>
                </div>
              </div>
              <Link
                href="/properties"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563EB] hover:underline"
              >
                Clear filter
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* Filter Bar - Single Row */}
        <div className="relative z-30 shrink-0 border-b border-gray-200 bg-white py-2.5">
          <div className="mx-auto flex items-center gap-2 px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: 1400 }} ref={filterBarRef}>
            {/* Search Input */}
            <div className="relative flex-1" style={{ maxWidth: 800 }}>
              <form className="relative flex" onSubmit={handleSearch}>
                <div className="relative flex-1" ref={locationInputRef}>
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search city, neighborhood..."
                    className="w-full rounded-xl border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm transition-colors focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    autoComplete="off"
                    style={{ height: 40, fontSize: 14 }}
                    value={searchParams.location}
                    onChange={(e) => { handleSearchChange('location', e.target.value); setShowLocationSuggestions(true); }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { setShowLocationSuggestions(false); handleSearch(e); } }}
                  />
                  {searchParams.location && (
                    <button
                      type="button"
                      onClick={() => { handleSearchChange('location', ''); setShowLocationSuggestions(false); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 text-gray-400"
                      aria-label="Clear"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50 max-h-64 overflow-y-auto">
                      {locationSuggestions.map((s) => (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => {
                            const np = { ...searchParams, location: s.value };
                            setSearchParams(np);
                            setShowLocationSuggestions(false);
                            router.get('/properties', serializeParams(np), { preserveState: true });
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2.5"
                        >
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-900 truncate">{s.label}</div>
                            <div className="text-[11px] text-gray-500">{s.count} {s.count === 1 ? 'property' : 'properties'}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Mobile filter toggle */}
            <button
              className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm transition-colors hover:bg-gray-50 lg:hidden"
              style={{ height: 40, fontSize: 13, fontWeight: 500, color: '#1a1816', whiteSpace: 'nowrap' }}
              onClick={() => setOpenDropdown(openDropdown === 'mobile' ? null : 'mobile')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
                <circle cx="8" cy="6" r="1.5" fill="currentColor" /><circle cx="16" cy="12" r="1.5" fill="currentColor" /><circle cx="10" cy="18" r="1.5" fill="currentColor" />
              </svg>
              Filters
            </button>

            {/* Desktop dropdown buttons */}
            <div className="hidden lg:contents">
              {/* Price */}
              {(() => {
                const priceOpts = [
                  { value: '', label: 'Min' },
                  { value: '100000', label: '$100,000' },
                  { value: '200000', label: '$200,000' },
                  { value: '300000', label: '$300,000' },
                  { value: '400000', label: '$400,000' },
                  { value: '500000', label: '$500,000' },
                  { value: '600000', label: '$600,000' },
                  { value: '750000', label: '$750,000' },
                  { value: '1000000', label: '$1,000,000' },
                  { value: '1500000', label: '$1,500,000' },
                  { value: '2000000', label: '$2,000,000' },
                  { value: '3000000', label: '$3,000,000' },
                  { value: '5000000', label: '$5,000,000' },
                ];
                const maxOpts = priceOpts.map(o => o.value === '' ? { value: '', label: 'Max' } : o);
                const formatLabel = (min, max) => {
                  if (!min && !max) return 'Price';
                  const fmtPrice = (v) => {
                    const n = parseInt(v);
                    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
                    return `$${(n / 1000).toFixed(0)}k`;
                  };
                  if (min && max) return `${fmtPrice(min)} – ${fmtPrice(max)}`;
                  if (min) return `${fmtPrice(min)}+`;
                  return `Up to ${fmtPrice(max)}`;
                };
                const sliderMax = 5000000;
                const minVal = parseInt(searchParams.priceMin || '0');
                const maxVal = parseInt(searchParams.priceMax || '') || sliderMax;
                const leftPct = (minVal / sliderMax) * 100;
                const rightPct = 100 - (maxVal / sliderMax) * 100;

                return (
                  <div className="relative">
                    <button className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm transition-colors hover:bg-gray-50" style={{ height: 40, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', color: '#1a1816' }} onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}>
                      {formatLabel(searchParams.priceMin, searchParams.priceMax)}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    {openDropdown === 'price' && (
                      <div className="absolute left-0 top-full z-50 mt-2 rounded-xl border border-gray-200 bg-white p-4 shadow-xl" style={{ minWidth: 280 }}>
                        <div className="space-y-3">
                          <label className="block text-xs font-medium text-gray-600">Price Range</label>
                          {/* Formatted price inputs (sync with slider) */}
                          <div className="flex gap-2">
                            <div className="relative w-full">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Min"
                                className="w-full rounded-lg border border-gray-300 bg-white pl-6 pr-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={searchParams.priceMin ? Number(searchParams.priceMin).toLocaleString() : ''}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  handleSearchChange('priceMin', raw);
                                }}
                              />
                            </div>
                            <div className="relative w-full">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Max"
                                className="w-full rounded-lg border border-gray-300 bg-white pl-6 pr-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={searchParams.priceMax ? Number(searchParams.priceMax).toLocaleString() : ''}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '');
                                  handleSearchChange('priceMax', raw);
                                }}
                              />
                            </div>
                          </div>
                          {/* Dual range slider */}
                          <div className="pt-1 pb-2">
                            <div className="relative h-6" style={{ touchAction: 'none' }}>
                              <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-200" />
                              <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full" style={{ left: `${leftPct}%`, right: `${rightPct}%`, backgroundColor: '#2563eb' }} />
                              <input type="range" min="0" max={sliderMax} step="50000"
                                className="range-thumb absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
                                style={{ zIndex: 3 }}
                                value={minVal}
                                onChange={(e) => {
                                  const v = parseInt(e.target.value);
                                  if (v <= maxVal) handleSearchChange('priceMin', v === 0 ? '' : String(v));
                                }}
                              />
                              <input type="range" min="0" max={sliderMax} step="50000"
                                className="range-thumb absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
                                style={{ zIndex: 4 }}
                                value={maxVal}
                                onChange={(e) => {
                                  const v = parseInt(e.target.value);
                                  if (v >= minVal) handleSearchChange('priceMax', v === sliderMax ? '' : String(v));
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                              <span>$0k</span>
                              <span>$5.0M</span>
                            </div>
                          </div>
                          {/* Clear / Apply */}
                          <div className="flex justify-end gap-2 pt-1">
                            <button className="text-xs text-gray-500 hover:text-gray-700" onClick={() => { handleSearchChange('priceMin', ''); handleSearchChange('priceMax', ''); }}>Clear</button>
                            <button className="rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gray-800" onClick={() => { setOpenDropdown(null); router.get('/properties', serializeParams(searchParamsRef.current), { preserveState: true }); }}>Apply</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Beds & Baths - uses local state so Apply can read latest */}
              {(() => {
                const bedsLabel = searchParams.bedrooms || searchParams.bathrooms
                  ? `${searchParams.bedrooms || 'Any'}+ bd / ${searchParams.bathrooms || 'Any'}+ ba`
                  : 'Beds & Baths';
                return (
                  <div className="relative">
                    <button className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm transition-colors hover:bg-gray-50" style={{ height: 40, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', color: '#1a1816' }} onClick={() => setOpenDropdown(openDropdown === 'beds' ? null : 'beds')}>
                      {bedsLabel}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    {openDropdown === 'beds' && (
                      <BedsDropdown
                        searchParams={searchParams}
                        onApply={(beds, baths) => {
                          const np = { ...searchParams, bedrooms: beds, bathrooms: baths };
                          setSearchParams(np);
                          setOpenDropdown(null);
                          router.get('/properties', serializeParams(np), { preserveState: true });
                        }}
                      />
                    )}
                  </div>
                );
              })()}

              {/* Type */}
              {(() => {
                const typeLabels = { '': 'Type', 'single-family-home': 'Single Family', 'condos-townhomes-co-ops': 'Condo / Townhome', 'multi-family': 'Multi-Family', 'land': 'Land', 'farms-ranches': 'Farm / Ranch', 'mfd-mobile-homes': 'Mobile / Manufactured' };
                return (
                  <div className="relative">
                    <button className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm transition-colors hover:bg-gray-50" style={{ height: 40, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', color: '#1a1816' }} onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}>
                      {typeLabels[searchParams.propertyType] || 'Type'}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    {openDropdown === 'type' && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl z-50 py-1">
                        {[{ value: '', label: 'All Types' }, { value: 'single-family-home', label: 'Single Family' }, { value: 'condos-townhomes-co-ops', label: 'Condo / Townhome' }, { value: 'multi-family', label: 'Multi-Family' }, { value: 'land', label: 'Land' }, { value: 'farms-ranches', label: 'Farm / Ranch' }, { value: 'mfd-mobile-homes', label: 'Mobile / Manufactured' }].map((opt) => (
                          <button key={opt.value} className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${searchParams.propertyType === opt.value ? 'font-semibold text-[#1a1816]' : 'text-gray-600'}`} onClick={() => { const np = { ...searchParams, propertyType: opt.value }; setSearchParams(np); setOpenDropdown(null); router.get('/properties', serializeParams(np), { preserveState: true }); }}>{opt.label}</button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Land Size */}
              {(() => {
                const landLabels = { '': 'Land Size', '2000': '2,000+ sqft', '5000': '5,000+ sqft', '10000': '¼ acre+', '21780': '½ acre+', '43560': '1 acre+', '217800': '5 acres+' };
                return (
                  <div className="relative">
                    <button className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm transition-colors hover:bg-gray-50" style={{ height: 40, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', color: '#1a1816' }} onClick={() => setOpenDropdown(openDropdown === 'land' ? null : 'land')}>
                      {landLabels[searchParams.lotSizeMin] || 'Land Size'}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    {openDropdown === 'land' && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl z-50 py-1">
                        {[{ value: '', label: 'Any Size' }, { value: '2000', label: '2,000+ sqft' }, { value: '5000', label: '5,000+ sqft' }, { value: '10000', label: '¼ acre+' }, { value: '21780', label: '½ acre+' }, { value: '43560', label: '1 acre+' }, { value: '217800', label: '5 acres+' }].map((opt) => (
                          <button key={opt.value} className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${searchParams.lotSizeMin === opt.value ? 'font-semibold text-[#1a1816]' : 'text-gray-600'}`} onClick={() => { const np = { ...searchParams, lotSizeMin: opt.value }; setSearchParams(np); setOpenDropdown(null); router.get('/properties', serializeParams(np), { preserveState: true }); }}>{opt.label}</button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Amenities & Features */}
              <button
                className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                style={{ height: 40, fontSize: 13, fontWeight: 500, color: '#1a1816', whiteSpace: 'nowrap' }}
                onClick={() => setShowAmenitiesModal(true)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Amenities &amp; Features
                {searchParams.amenities.length > 0 && (
                  <span className="ml-1 rounded-full bg-[#1a1816] text-white text-[10px] font-bold px-1.5 py-0.5">
                    {searchParams.amenities.length}
                  </span>
                )}
              </button>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Map / List Toggle */}
              <div className="flex items-center overflow-hidden rounded-lg border border-gray-300" style={{ height: 36 }}>
                <button className="flex items-center gap-1.5 px-3 transition-colors" style={{ height: '100%', fontSize: 12, fontWeight: 600, backgroundColor: viewMode === 'map' ? '#1a1816' : 'white', color: viewMode === 'map' ? 'white' : '#6b7280', whiteSpace: 'nowrap' }} onClick={() => setViewMode('map')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
                  Map
                </button>
                <button className="flex items-center gap-1.5 border-l border-gray-300 px-3 transition-colors" style={{ height: '100%', fontSize: 12, fontWeight: 600, backgroundColor: viewMode === 'list' ? '#1a1816' : 'white', color: viewMode === 'list' ? 'white' : '#6b7280', whiteSpace: 'nowrap' }} onClick={() => setViewMode('list')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                  Grid
                </button>
              </div>

              {/* Save Search */}
              <button
                className="flex items-center gap-2 rounded-xl px-5 py-2 text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ height: 40, backgroundColor: saveSearchStatus === 'saved' ? '#16a34a' : '#1a1816', fontSize: 13, fontWeight: 600, letterSpacing: '0.3px', whiteSpace: 'nowrap' }}
                onClick={handleSaveSearch}
                disabled={saveSearchStatus === 'saving'}
              >
                {saveSearchStatus === 'saved' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                )}
                {saveSearchStatus === 'saving' ? 'SAVING...' : saveSearchStatus === 'saved' ? 'SAVED!' : saveSearchStatus === 'error' ? 'ERROR' : 'SAVE SEARCH'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filters Panel */}
        {openDropdown === 'mobile' && (
          <div className="lg:hidden border-b border-gray-200 bg-white px-4 py-4 z-20">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Min Price</label>
                <input type="text" placeholder="No Min" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={searchParams.priceMin} onChange={(e) => handleSearchChange('priceMin', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Max Price</label>
                <input type="text" placeholder="No Max" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={searchParams.priceMax} onChange={(e) => handleSearchChange('priceMax', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Beds</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white" value={searchParams.bedrooms} onChange={(e) => handleSearchChange('bedrooms', e.target.value)}>
                  <option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Baths</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white" value={searchParams.bathrooms} onChange={(e) => handleSearchChange('bathrooms', e.target.value)}>
                  <option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white" value={searchParams.propertyType} onChange={(e) => handleSearchChange('propertyType', e.target.value)}>
                  <option value="">All Types</option><option value="single-family-home">Single Family</option><option value="condos-townhomes-co-ops">Condo / Townhome</option><option value="multi-family">Multi-Family</option><option value="land">Land</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white" value={searchParams.status} onChange={(e) => handleSearchChange('status', e.target.value)}>
                  <option value="all">All</option><option value="for-sale">For Sale</option><option value="pending">Pending</option><option value="sold">Sold</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setOpenDropdown(null); router.get('/properties', serializeParams(searchParamsRef.current), { preserveState: true }); }} className="flex-1 rounded-lg bg-[#1a1816] text-white py-2.5 text-sm font-semibold">Apply Filters</button>
              <button onClick={() => setOpenDropdown(null)} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600">Cancel</button>
            </div>
          </div>
        )}

        {/* Main Content: Map + Listings */}
        <div
          className={`flex ${viewMode === 'map' ? 'min-h-0' : ''}`}
          style={viewMode === 'map' ? { height: 'calc(100vh - 60px)' } : undefined}
        >
          {/* Map - Desktop */}
          {viewMode === 'map' && (
            <div className="hidden lg:block" style={{ width: '57%' }}>
              <div className="relative h-full w-full overflow-hidden">
                <PropertyMap properties={mapProperties} />
              </div>
            </div>
          )}

          {/* Listings Panel */}
          <div className={`flex flex-col bg-white ${viewMode === 'map' ? 'min-h-0 flex-1 border-l border-gray-200 lg:max-w-[43%]' : 'flex-1'}`}>
            {/* Listings Header */}
            <div className={`shrink-0 border-b border-gray-100 ${viewMode === 'list' ? 'mx-auto w-full px-4 sm:px-6 lg:px-[40px]' : 'px-5'} pt-4 pb-3`} style={viewMode === 'list' ? { maxWidth: 1400 } : {}}>
              <div className="flex items-center justify-between">
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1816' }}>
                  {searchParams.status === 'all' ? 'All Listings' : searchParams.status === 'sold' ? 'Sold' : searchParams.status === 'pending' ? 'Pending' : 'All Listings'}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center gap-1.5">
                    <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>Sort:</span>
                    <button
                      className="flex items-center gap-1 text-sm"
                      style={{ fontSize: 12, fontWeight: 600, color: '#1a1816' }}
                      onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                    >
                      {searchParams.sort === 'newest' ? 'Recommended' : searchParams.sort === 'price_low' ? 'Price ↑' : searchParams.sort === 'price_high' ? 'Price ↓' : searchParams.sort === 'bedrooms' ? 'Bedrooms' : 'Sq Ft'}
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                    {openDropdown === 'sort' && (
                      <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-gray-200 shadow-xl z-50 py-1">
                        {[
                          { value: 'newest', label: 'Recommended' },
                          { value: 'price_low', label: 'Price: Low → High' },
                          { value: 'price_high', label: 'Price: High → Low' },
                          { value: 'bedrooms', label: 'Bedrooms' },
                          { value: 'sqft', label: 'Square Feet' },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-gray-50 ${searchParams.sort === opt.value ? 'font-bold text-slate-800' : 'text-gray-600'}`}
                            onClick={() => { handleSortChange(opt.value); setOpenDropdown(null); }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{totalCount.toLocaleString()} results</span>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  className="rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: searchParams.status === 'for-sale' ? '#1e293b' : 'transparent',
                    color: searchParams.status === 'for-sale' ? 'white' : '#1a1816',
                    border: searchParams.status === 'for-sale' ? '1px solid #1e293b' : '1px solid #d1d5db',
                    letterSpacing: '0.5px',
                  }}
                  onClick={() => handleStatusTab('for-sale')}
                >
                  FOR SALE
                </button>
                <button
                  className="rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: searchParams.status === 'sold' ? '#1e293b' : 'transparent',
                    color: searchParams.status === 'sold' ? 'white' : '#1a1816',
                    border: searchParams.status === 'sold' ? '1px solid #1e293b' : '1px solid #d1d5db',
                    letterSpacing: '0.5px',
                  }}
                  onClick={() => handleStatusTab('sold')}
                >
                  SOLD
                </button>
                <button
                  className="rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: searchParams.status === 'all' ? '#1e293b' : 'transparent',
                    color: searchParams.status === 'all' ? 'white' : '#1a1816',
                    border: searchParams.status === 'all' ? '1px solid #1e293b' : '1px solid #d1d5db',
                    letterSpacing: '0.5px',
                  }}
                  onClick={() => handleStatusTab('all')}
                >
                  ALL
                </button>
              </div>

              {/* Quick Filters */}
              <div className="mt-3 flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-1.5">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={searchParams.hasVirtualTour === 'yes'}
                    onChange={(e) => {
                      const newParams = { ...searchParams, hasVirtualTour: e.target.checked ? 'yes' : '' };
                      setSearchParams(newParams);
                      router.get('/properties', serializeParams(newParams), { preserveState: true });
                    }}
                  />
                  <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Virtual Tour</span>
                </label>
                <label className="flex cursor-pointer items-center gap-1.5">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={searchParams.hasOpenHouse === 'yes'}
                    onChange={(e) => {
                      const newParams = { ...searchParams, hasOpenHouse: e.target.checked ? 'yes' : '' };
                      setSearchParams(newParams);
                      router.get('/properties', serializeParams(newParams), { preserveState: true });
                    }}
                  />
                  <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Open House</span>
                </label>
              </div>
            </div>

            {/* Property Cards */}
            <div className={`py-4 ${viewMode === 'map' ? 'flex-1 overflow-y-auto px-5' : 'mx-auto w-full px-4 sm:px-6 lg:px-[40px]'}`} style={viewMode === 'list' ? { maxWidth: 1400 } : {}}>
              {propertyList.length > 0 ? (
                <div className={`grid gap-4 ${viewMode === 'list' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {propertyList.map((property) => {
                    const propertyImage = property.photos && property.photos.length > 0
                      ? property.photos[0]
                      : '/images/property-placeholder.svg';

                    const baths = (property.full_bathrooms || 0) + (property.half_bathrooms ? property.half_bathrooms * 0.5 : 0);
                    const timeAgo = getTimeAgo(property.created_at || property.listed_date);

                    const statusLabel = (property.listing_status || property.status) === 'sold' ? 'SOLD' : (property.listing_status || property.status) === 'pending' ? 'PENDING' : 'FOR SALE';
                    const statusColor = (property.listing_status || property.status) === 'sold' ? 'bg-gray-700' : (property.listing_status || property.status) === 'pending' ? 'bg-yellow-600' : 'bg-[#A41E34]';

                    return (
                      <Link
                        key={property.id}
                        href={`/properties/${property.slug || property.id}`}
                        className="block"
                      >
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group flex flex-col">
                          {/* Image */}
                          <div className="relative h-[180px] overflow-hidden flex-shrink-0">
                            <img
                              src={propertyImage}
                              alt={property.property_title || property.address}
                              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => e.target.src = '/images/property-placeholder.svg'}
                            />
                            {/* Status Badge */}
                            <div className={`absolute top-4 right-4 ${statusColor} text-white px-3 py-1.5 text-xs font-semibold rounded-full`}>
                              {statusLabel}
                            </div>
                            {/* Left Badges */}
                            <div className="absolute top-4 left-4 flex gap-1.5">
                              {(property.virtual_tour_url || property.matterport_url || property.has_virtual_tour) && (
                                <div className="bg-purple-600/90 text-white p-1.5 rounded-full" title="Virtual Tour">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
                                </div>
                              )}
                            </div>
                            {/* Action Buttons */}
                            <div className="absolute bottom-4 right-4 flex gap-2">
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(`/properties/${property.slug || property.id}`, '_blank'); }}
                                className="bg-white/90 hover:bg-white p-2 rounded-lg transition-all duration-300 hover:scale-105" title="Open in new tab"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800"><path d="M15 3h6v6" /><path d="m21 3-7 7" /><path d="m3 21 7-7" /><path d="M9 21H3v-6" /></svg>
                              </button>
                              <button
                                onClick={(e) => handleFavorite(e, property)}
                                className="bg-white/90 hover:bg-white p-2 rounded-lg transition-all duration-300 hover:scale-105" title="Favorite"
                              >
                                <Heart className={`w-4 h-4 ${isFavorite(property.id) ? 'fill-red-500 text-red-500' : 'text-[#413936]'}`} />
                              </button>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="px-3 pt-2.5 pb-3 flex flex-col">
                            <div className="pb-2 mb-2 border-b border-gray-200">
                              <span className="font-bold text-base text-[#293056]">${Number(property.price).toLocaleString()}</span>
                            </div>
                            {property.property_title && (
                              <div className="pb-2 mb-2 border-b border-gray-200">
                                <p className="text-sm font-semibold text-[#293056] line-clamp-1">{property.property_title}</p>
                              </div>
                            )}
                            <div className="pb-2 mb-2 border-b border-gray-200">
                              <p className="text-sm text-[#293056] line-clamp-2">
                                {property.address}{property.city ? `, ${property.city}` : ''}{property.state ? `, ${property.state}` : ''} {property.zip_code || ''}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-[#293056]">
                                {property.property_type === 'land' ? (
                                  <>Lot/Land{property.acres ? ` | ${Number(property.acres).toLocaleString()} Acres` : property.lot_size ? ` | ${Number(property.lot_size).toLocaleString()} sq ft` : ''}</>
                                ) : (
                                  <>{property.bedrooms}BD | {baths}BA | {property.sqft ? `${Number(property.sqft).toLocaleString()} sq ft` : 'Area N/A'}</>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Home className="w-12 h-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">No Properties Found</h3>
                  <p className="text-sm text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
                  <button
                    onClick={() => {
                      setSearchParams({
                        keyword: '', location: '', status: 'for-sale', propertyType: '',
                        priceMin: '', priceMax: '', bedrooms: '', bathrooms: '',
                        sort: 'newest', hasOpenHouse: '', hasVirtualTour: '',
                        schoolDistrict: '', lotSizeMin: '',
                      });
                      router.get('/properties');
                    }}
                    className="rounded-full bg-slate-800 text-white px-5 py-2 text-sm font-semibold hover:bg-slate-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <>
                  <div className="mt-6 flex items-center justify-center gap-1 pb-4">
                    {/* Prev */}
                    <button
                      disabled={!pagination.prev_page_url}
                      className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => pagination.prev_page_url && router.get(pagination.prev_page_url, {}, { preserveState: true })}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                      let page;
                      if (pagination.last_page <= 5) {
                        page = i + 1;
                      } else if (pagination.current_page <= 3) {
                        page = i + 1;
                      } else if (pagination.current_page >= pagination.last_page - 2) {
                        page = pagination.last_page - 4 + i;
                      } else {
                        page = pagination.current_page - 2 + i;
                      }
                      return (
                        <button
                          key={page}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors"
                          style={{
                            backgroundColor: page === pagination.current_page ? '#1e293b' : 'transparent',
                            color: page === pagination.current_page ? 'white' : '#374151',
                          }}
                          onClick={() => router.get(buildPageUrl(page), {}, { preserveState: true })}
                        >
                          {page}
                        </button>
                      );
                    })}

                    {/* Next */}
                    <button
                      disabled={!pagination.next_page_url}
                      className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => pagination.next_page_url && router.get(pagination.next_page_url, {}, { preserveState: true })}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 pb-4 text-center" style={{ fontSize: 12, color: '#9ca3af' }}>
                    Showing {pagination.per_page} of {totalCount.toLocaleString()} listings
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Amenities & Features Modal */}
      {showAmenitiesModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAmenitiesModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-[#111]">Amenities &amp; Features</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {searchParams.amenities.length} selected
                </p>
              </div>
              <button
                onClick={() => setShowAmenitiesModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {AMENITY_GROUPS.map((group) => (
                <div key={group.category}>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    {group.category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                    {groupItems(group).map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={searchParams.amenities.includes(item)}
                          onChange={() => toggleAmenity(item)}
                          className="w-4 h-4 text-[#1a1816] rounded border-gray-300 focus:ring-[#1a1816]"
                        />
                        <span className="text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={clearAmenities}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Clear all
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAmenitiesModal(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={applyAmenities}
                  className="rounded-lg bg-[#1a1816] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// No MainLayout - this page has its own full-screen layout
Properties.layout = (page) => page;

export default Properties;

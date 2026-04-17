import React, { useState } from 'react';
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react';

const SearchFilters = ({ searchParams, onSearchChange }) => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: searchParams.minPrice,
    max: searchParams.maxPrice
  });

  const cities = [
    { value: 'afton', label: 'Afton', subtext: 'Oklahoma' },
    { value: 'beggs', label: 'Beggs' },
    { value: 'bixby', label: 'Bixby' },
    { value: 'blanchard', label: 'Blanchard' },
    { value: 'broken-arrow', label: 'Broken Arrow', subtext: 'OK' },
    { value: 'checotah', label: 'Checotah' },
    { value: 'claremore', label: 'Claremore' },
    { value: 'collinsville', label: 'Collinsville' },
    { value: 'coweta', label: 'Coweta' },
    { value: 'edmond', label: 'Edmond' },
    { value: 'glenpool', label: 'Glenpool' },
    { value: 'grove', label: 'Grove' },
    { value: 'lawton', label: 'Lawton' },
    { value: 'norman', label: 'Norman', subtext: 'Oklahoma' },
    { value: 'oklahoma-city', label: 'Oklahoma City', subtext: 'Oklahoma County' },
    { value: 'owasso', label: 'Owasso' },
    { value: 'tulsa', label: 'Tulsa', subtext: 'OK' },
    { value: 'yukon', label: 'Yukon' },
  ];

  const statuses = [
    { value: 'coming-soon', label: 'Coming Soon' },
    { value: 'for-sale', label: 'For Sale' },
    { value: 'pending', label: 'Pending (Under Contract)' },
    { value: 'sold', label: 'Sold' },
  ];

  const propertyTypes = [
    { value: 'single-family-home', label: 'Single Family Home' },
    { value: 'condos-townhomes-co-ops', label: 'Condos/Townhomes/Co-Ops' },
    { value: 'multi-family', label: 'Multi-Family' },
    { value: 'land', label: 'Lot/Land' },
    { value: 'farms-ranches', label: 'Farms/Ranches' },
    { value: 'mfd-mobile-homes', label: 'Manufactured/Mobile Homes' },
    { value: 'multi-family', label: 'Multi-Family' },
  ];

  const features = [
    { value: '9-ceiling-height', label: "9' Ceiling Height" },
    { value: 'additional-land', label: 'Additional Land' },
    { value: 'additional-residence', label: 'Additional Residence' },
    { value: 'balcony', label: 'Balcony' },
    { value: 'barn', label: 'Barn' },
    { value: 'built-in-grill', label: 'Built-in Grill' },
    { value: 'ceiling-fan', label: 'Ceiling Fan' },
    { value: 'central-ac', label: 'Central AC' },
    { value: 'central-heat', label: 'Central Heat' },
    { value: 'corner-lot', label: 'Corner Lot' },
    { value: 'covered-patio', label: 'Covered Patio' },
    { value: 'fireplace', label: 'Fireplace' },
    { value: 'garage', label: 'Garage' },
    { value: 'golf-course-frontage', label: 'Golf Course Frontage' },
    { value: 'greenhouse', label: 'Greenhouse' },
    { value: 'guest-quarters', label: 'Guest Quarters' },
    { value: 'hot-tub', label: 'Hot Tub' },
    { value: 'lakefront', label: 'Lakefront' },
    { value: 'mountain-view', label: 'Mountain View' },
    { value: 'outdoor-kitchen', label: 'Outdoor Kitchen' },
    { value: 'pool', label: 'Swimming Pool' },
    { value: 'security-system', label: 'Security System' },
    { value: 'sprinkler-system', label: 'Sprinkler System' },
    { value: 'tennis-court', label: 'Tennis Court' },
    { value: 'walk-in-closet', label: 'Walk-In Closet' },
    { value: 'waterfront', label: 'Waterfront' },
    { value: 'wine-cellar', label: 'Wine Cellar' },
  ];

  const handleInputChange = (field, value) => {
    onSearchChange({ [field]: value });
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = searchParams[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onSearchChange({ [field]: newValues });
  };

  return (
    <div className="bg-white">
      <div className="p-6">
        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter an address, town, street, zip or property ID"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent text-sm"
              value={searchParams.keyword}
              onChange={(e) => handleInputChange('keyword', e.target.value)}
            />
          </div>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {/* City Select */}
          <div>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent text-sm appearance-none bg-white"
              value={searchParams.location[0] || ''}
              onChange={(e) => handleInputChange('location', e.target.value ? [e.target.value] : [])}
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city.value} value={city.value}>
                  {city.label} {city.subtext ? `(${city.subtext})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent text-sm appearance-none bg-white"
              value={searchParams.status[0] || ''}
              onChange={(e) => handleInputChange('status', e.target.value ? [e.target.value] : [])}
            >
              <option value="">Status</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent text-sm appearance-none bg-white"
              value={searchParams.type[0] || ''}
              onChange={(e) => handleInputChange('type', e.target.value ? [e.target.value] : [])}
            >
              <option value="">Type</option>
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent text-sm appearance-none bg-white"
              value={searchParams.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', e.target.value)}
            >
              <option value="">Bedrooms</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
              <option value="any">Any</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent text-sm appearance-none bg-white"
              value={searchParams.bathrooms}
              onChange={(e) => handleInputChange('bathrooms', e.target.value)}
            >
              <option value="">Bathrooms</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
              <option value="any">Any</option>
            </select>
          </div>

          {/* Min Area */}
          <div>
            <input
              type="text"
              placeholder="Min. Area"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent text-sm"
              value={searchParams.minArea}
              onChange={(e) => handleInputChange('minArea', e.target.value)}
            />
          </div>

          {/* Max Area */}
          <div>
            <input
              type="text"
              placeholder="Max. Area"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent text-sm"
              value={searchParams.maxArea}
              onChange={(e) => handleInputChange('maxArea', e.target.value)}
            />
          </div>

          {/* Property ID */}
          <div>
            <input
              type="text"
              placeholder="Property ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent text-sm"
              value={searchParams.propertyId}
              onChange={(e) => handleInputChange('propertyId', e.target.value)}
            />
          </div>

          {/* Subdivision */}
          <div>
            <input
              type="text"
              placeholder="Subdivision"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent text-sm"
              value={searchParams.subdivision}
              onChange={(e) => handleInputChange('subdivision', e.target.value)}
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Price Range</span>
            <span className="text-sm text-gray-600">
              ${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-3">
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={priceRange.min}
              onChange={(e) => {
                const newMin = parseInt(e.target.value);
                setPriceRange({ ...priceRange, min: newMin });
                onSearchChange({ minPrice: newMin });
              }}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={priceRange.max}
              onChange={(e) => {
                const newMax = parseInt(e.target.value);
                setPriceRange({ ...priceRange, max: newMax });
                onSearchChange({ maxPrice: newMax });
              }}
              className="flex-1"
            />
          </div>
        </div>

        {/* Other Features Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Other Features</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${showFeatures ? 'rotate-180' : ''}`} />
          </button>

          {showFeatures && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                {features.map(feature => (
                  <label key={feature.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(searchParams.features || []).includes(feature.value)}
                      onChange={() => handleMultiSelect('features', feature.value)}
                      className="w-4 h-4 text-[#1A1816] rounded border-gray-300 focus:ring-[#1A1816]"
                    />
                    <span className="text-sm text-gray-700">{feature.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button className="w-full bg-[#1A1816] hover:bg-[#1D4ED8] text-white py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2">
          <Search className="w-4 h-4" />
          Search Properties
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;

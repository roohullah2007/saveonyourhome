import React, { useState } from 'react';
import { Info } from 'lucide-react';
import PropertyCard from '@/Components/PropertyCard';
import AuthModal from '@/Components/AuthModal';

const PropertyList = ({ properties }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="p-6">
      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-medium text-gray-900" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          <span className="text-[#0891B2]">{properties.length}</span> Properties Found
        </h2>
        <select
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0891B2] focus:border-transparent bg-white cursor-pointer hover:border-[#0891B2] transition-colors"
          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
        >
          <option>Sort by: Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Bedrooms</option>
          <option>Square Feet</option>
        </select>
      </div>

      {/* Property Cards Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onAuthRequired={() => setShowAuthModal(true)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <div className="text-gray-300 mb-4">
            <Info className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-2xl font-medium text-gray-800 mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            No Properties Found
          </h3>
          <p className="text-gray-600 text-lg" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Try adjusting your search filters to see more results
          </p>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default PropertyList;

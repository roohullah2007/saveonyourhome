import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, X, ChevronUp, BedDouble, Bath, Maximize2, Layers } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { onMapsAuthFailure, isMapsAuthFailed } from '@/Components/Properties/LocationMapPicker';

const PropertyMap = ({ properties = [], onPropertyClick }) => {
  const { googleMapsApiKey } = usePage().props;
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const overlaysRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [showListingsPanel, setShowListingsPanel] = useState(false);
  const [mapType, setMapType] = useState('roadmap');
  const [authFailed, setAuthFailed] = useState(isMapsAuthFailed());

  useEffect(() => onMapsAuthFailure(() => setAuthFailed(true)), []);

  // Continental US default center
  const defaultLat = 39.5;
  const defaultLng = -98.35;
  const defaultZoom = 7;

  useEffect(() => {
    if (!googleMapsApiKey) {
      console.error('Google Maps API key is not configured');
      return;
    }

    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      initializeMap();
    } else {
      loadGoogleMaps();
    }

    return () => {
      // Clean up markers and overlays
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }
      if (overlaysRef.current) {
        overlaysRef.current.forEach(overlay => overlay.setMap(null));
        overlaysRef.current = [];
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      mapInstanceRef.current = null;
    };
  }, [googleMapsApiKey]);

  // Update markers when properties change
  useEffect(() => {
    if (mapInstance && window.google && window.google.maps) {
      updateMarkers();
    }
  }, [properties, mapInstance]);

  const loadGoogleMaps = () => {
    // Check if script is already loading
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogle);
          initializeMap();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => initializeMap();
    script.onerror = () => console.error('Failed to load Google Maps');
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || mapInstance) return;
    // If the Maps JS SDK failed to initialize (e.g. ApiNotActivatedMapError),
    // window.google.maps.Map will be missing — bail cleanly so we don't throw.
    if (!window.google?.maps?.Map) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: defaultLat, lng: defaultLng },
      zoom: defaultZoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false,
      mapTypeId: mapType,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    // Create a single info window to reuse
    infoWindowRef.current = new window.google.maps.InfoWindow();

    mapInstanceRef.current = map;
    setMapInstance(map);
  };

  const updateMarkers = () => {
    if (!window.google || !window.google.maps || !mapInstance) return;

    // Clear existing markers and overlays
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    overlaysRef.current.forEach(overlay => overlay.setMap(null));
    overlaysRef.current = [];

    const validProperties = properties.filter(p => p.latitude && p.longitude);

    if (validProperties.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    validProperties.forEach((property) => {
      const lat = parseFloat(property.latitude);
      const lng = parseFloat(property.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      bounds.extend({ lat, lng });

      const priceLabel = property.price >= 1000000
        ? `$${(property.price / 1000000).toFixed(1)}M`
        : `$${(property.price / 1000).toFixed(0)}k`;

      // Create custom marker element
      const markerDiv = document.createElement('div');
      markerDiv.innerHTML = `
        <div style="background-color:#1e293b;color:white;padding:5px 10px;border-radius:8px;font-size:12px;font-weight:700;white-space:nowrap;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,0.4);line-height:1;display:inline-block;z-index:999;position:relative;transition:transform 0.15s,background-color 0.15s;">
          ${priceLabel}
        </div>
      `;

      // Use regular marker with custom overlay for HTML price labels
      let marker;
      marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 0,
        },
      });

      // Create overlay for custom HTML marker
      const overlay = new window.google.maps.OverlayView();
      overlay.onAdd = function() {
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(markerDiv);
      };
      overlay.draw = function() {
        const projection = this.getProjection();
        const position = projection.fromLatLngToDivPixel(new window.google.maps.LatLng(lat, lng));
        markerDiv.style.position = 'absolute';
        markerDiv.style.left = (position.x - 40) + 'px';
        markerDiv.style.top = (position.y - 40) + 'px';
      };
      overlay.onRemove = function() {
        markerDiv.parentNode?.removeChild(markerDiv);
      };
      overlay.setMap(mapInstance);
      overlaysRef.current.push(overlay);

      const photo = property.photos && property.photos.length > 0
        ? property.photos[0]
        : '/images/property-placeholder.svg';

      const baths = (property.full_bathrooms || 0) + (property.half_bathrooms ? property.half_bathrooms * 0.5 : 0);

      // Time ago
      const getTimeAgo = (d) => {
        if (!d) return '';
        const now = new Date();
        const diff = Math.floor((now - new Date(d)) / (1000 * 60 * 60 * 24));
        if (diff < 1) return 'Today';
        if (diff === 1) return '1 day ago';
        if (diff < 30) return diff + ' days ago';
        const mo = Math.floor(diff / 30);
        if (mo === 1) return '1 mo ago';
        if (mo < 12) return mo + ' mo ago';
        return Math.floor(mo / 12) + ' yr ago';
      };
      const timeAgo = getTimeAgo(property.created_at || property.listed_date);

      const propType = property.property_type === 'land' ? 'Land for sale'
        : `${property.bedrooms || 0} bd · ${baths} ba${property.sqft ? ' · ' + Number(property.sqft).toLocaleString() + ' sqft' : ''}`;

      const fullAddress = `${property.address || ''}${property.city ? ', ' + property.city : ''}${property.state ? ', ' + property.state : ''} ${property.zip_code || ''}`;

      const popupContent = `
        <div style="width:280px;font-family:system-ui,-apple-system,sans-serif;">
          <a href="/properties/${property.slug || property.id}" style="text-decoration:none;color:inherit;display:block;">
            <div style="position:relative;height:150px;overflow:hidden;border-radius:10px 10px 0 0;">
              <img src="${photo}" alt="" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='/images/property-placeholder.svg'" />
              ${timeAgo ? `<div style="position:absolute;left:8px;top:8px;background:rgba(0,0,0,0.6);color:white;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:600;">${timeAgo}</div>` : ''}
              <div style="position:absolute;right:8px;top:8px;width:28px;height:28px;border-radius:50%;border:1.5px solid rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </div>
            </div>
            <div style="padding:10px 12px 12px;">
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <div style="font-size:17px;font-weight:700;color:#1A1816;">$${Number(property.price).toLocaleString()}</div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#9ca3af"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>
              </div>
              <div style="margin-top:3px;font-size:11px;color:#6b7280;display:flex;align-items:center;gap:4px;flex-wrap:wrap;">${propType}</div>
              <div style="margin-top:8px;font-size:12px;color:#374151;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${fullAddress}</div>
              ${property.city ? `<div style="margin-top:8px;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.3px;">${property.city}${property.state ? ', ' + property.state : ''}</div>` : ''}
            </div>
          </a>
        </div>
      `;

      // Add click listener
      const clickHandler = () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(popupContent);
          infoWindowRef.current.setPosition({ lat, lng });
          infoWindowRef.current.open(mapInstance);
        }
        if (onPropertyClick) {
          onPropertyClick(property);
        }
      };

      markerDiv.addEventListener('click', clickHandler);

      markersRef.current.push(marker);
    });

    // Fit map to bounds
    if (validProperties.length > 0) {
      mapInstance.fitBounds(bounds, { padding: 40 });
      // Limit max zoom when fitting bounds
      const listener = window.google.maps.event.addListener(mapInstance, 'idle', () => {
        if (mapInstance.getZoom() > 14) {
          mapInstance.setZoom(14);
        }
        window.google.maps.event.removeListener(listener);
      });
    }
  };

  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.setZoom(mapInstance.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.setZoom(mapInstance.getZoom() - 1);
    }
  };

  const handleResetView = () => {
    if (mapInstance) {
      mapInstance.setCenter({ lat: defaultLat, lng: defaultLng });
      mapInstance.setZoom(defaultZoom);
    }
  };

  const handleToggleMapType = () => {
    const newType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
    setMapType(newType);
    if (mapInstance) {
      mapInstance.setMapTypeId(newType);
    }
  };

  const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude);

  if (authFailed) {
    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-center px-6" style={{ minHeight: '400px' }}>
        <MapPin className="w-10 h-10 text-gray-400 mb-3" />
        <p className="text-sm font-semibold text-gray-800">Map unavailable</p>
        <p className="text-xs text-gray-500 mt-1 max-w-md">
          We couldn't load the map right now. The listings below are still searchable and filterable.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[10]">
        <button
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Zoom In"
          onClick={handleZoomIn}
        >
          <ZoomIn className="w-4 h-4 text-gray-700" />
        </button>
        <button
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Zoom Out"
          onClick={handleZoomOut}
        >
          <ZoomOut className="w-4 h-4 text-gray-700" />
        </button>
        <button
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Reset View"
          onClick={handleResetView}
        >
          <Navigation className="w-4 h-4 text-gray-700" />
        </button>
        <button
          className={`p-2 rounded-lg shadow-lg transition-colors ${mapType === 'satellite' ? 'bg-[#3355FF] text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
          title={mapType === 'satellite' ? 'Switch to Road Map' : 'Switch to Satellite View'}
          onClick={handleToggleMapType}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Property Count - Clickable */}
      <button
        onClick={() => setShowListingsPanel(!showListingsPanel)}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg z-[10] hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#1A1816]" />
          <span className="font-semibold text-sm text-gray-700">
            {propertiesWithCoords.length} on map
          </span>
          <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${showListingsPanel ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Listings Panel */}
      {showListingsPanel && propertiesWithCoords.length > 0 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[340px] max-h-[300px] bg-white rounded-xl shadow-2xl z-[11] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="font-semibold text-sm text-gray-700">
              Properties on Map ({propertiesWithCoords.length})
            </span>
            <button
              onClick={() => setShowListingsPanel(false)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[250px]">
            {propertiesWithCoords.map((property) => {
              const photo = property.photos && property.photos.length > 0
                ? property.photos[0]
                : '/images/property-placeholder.svg';
              const baths = (property.full_bathrooms || 0) + (property.half_bathrooms ? property.half_bathrooms * 0.5 : 0);

              return (
                <a
                  key={property.id}
                  href={`/properties/${property.slug || property.id}`}
                  className="flex gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  onClick={(e) => {
                    if (onPropertyClick) {
                      e.preventDefault();
                      onPropertyClick(property);
                      // Center map on this property
                      if (mapInstance) {
                        mapInstance.setCenter({
                          lat: parseFloat(property.latitude),
                          lng: parseFloat(property.longitude)
                        });
                        mapInstance.setZoom(15);
                      }
                      setShowListingsPanel(false);
                    }
                  }}
                >
                  <img
                    src={photo}
                    alt={property.property_title || ''}
                    className="w-16 h-16 object-cover object-center rounded-lg flex-shrink-0"
                    onError={(e) => e.target.src = '/images/property-placeholder.svg'}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1A1816] text-sm">
                      ${Number(property.price).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {property.address}
                    </p>
                    <p className="text-xs text-gray-500">
                      {property.city}, {property.state || 'OK'}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-0.5">
                        <BedDouble className="w-3 h-3" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Bath className="w-3 h-3" />
                        {baths}
                      </span>
                      {property.sqft && (
                        <span className="flex items-center gap-0.5">
                          <Maximize2 className="w-3 h-3" />
                          {Number(property.sqft).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading */}
      {!mapInstance && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A1816] mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;

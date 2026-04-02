import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Navigation, Layers } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const SinglePropertyMap = ({ property }) => {
  const { googleMapsApiKey } = usePage().props;
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const [mapType, setMapType] = useState('roadmap');

  // Oklahoma default center
  const defaultLat = 35.5;
  const defaultLng = -97.5;
  const defaultZoom = 7;

  const hasCoordinates = property?.latitude && property?.longitude;
  const lat = hasCoordinates ? parseFloat(property.latitude) : defaultLat;
  const lng = hasCoordinates ? parseFloat(property.longitude) : defaultLng;
  const zoom = hasCoordinates ? 15 : defaultZoom;

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
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      mapInstanceRef.current = null;
    };
  }, [googleMapsApiKey]);

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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => initializeMap();
    script.onerror = () => console.error('Failed to load Google Maps');
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || mapInstance) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: zoom,
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

    // Add marker if we have coordinates
    if (hasCoordinates) {
      // Create custom marker icon
      const markerIcon = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: '#1A1816',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
        scale: 2,
        anchor: new window.google.maps.Point(12, 22),
      };

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        icon: markerIcon,
        animation: window.google.maps.Animation.DROP,
      });

      const address = `${property.address || ''}, ${property.city || ''}, ${property.state || 'OK'} ${property.zip_code || ''}`;

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding:8px;font-family:'Manrope',sans-serif;">
            <p style="font-weight:600;color:#111;margin:0 0 4px 0;">${property.property_title || 'Property Location'}</p>
            <p style="color:#666;font-size:13px;margin:0;">${address}</p>
          </div>
        `,
        maxWidth: 250,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markerRef.current = marker;
      infoWindowRef.current = infoWindow;
    }

    mapInstanceRef.current = map;
    setMapInstance(map);
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
      mapInstance.setCenter({ lat, lng });
      mapInstance.setZoom(zoom);
    }
  };

  const handleToggleMapType = () => {
    const newType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
    setMapType(newType);
    if (mapInstance) {
      mapInstance.setMapTypeId(newType);
    }
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '300px' }} />

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
          className={`p-2 rounded-lg shadow-lg transition-colors ${mapType === 'satellite' ? 'bg-[#1A1816] text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
          title={mapType === 'satellite' ? 'Switch to Road Map' : 'Switch to Satellite View'}
          onClick={handleToggleMapType}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Loading */}
      {!mapInstance && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A1816] mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* No coordinates message */}
      {mapInstance && !hasCoordinates && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg z-[10]">
          <p className="text-sm text-gray-600">
            Exact location not available
          </p>
        </div>
      )}
    </div>
  );
};

export default SinglePropertyMap;

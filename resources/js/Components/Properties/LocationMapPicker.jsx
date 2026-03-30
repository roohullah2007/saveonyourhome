import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, Loader2, AlertCircle, Layers } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

// Simple debounce implementation
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Helper to check if a coordinate value is valid (not null, undefined, or empty string)
const isValidCoord = (val) => val !== null && val !== undefined && val !== '' && !isNaN(parseFloat(val));

/**
 * LocationMapPicker - A Google Maps component with a draggable marker for selecting property location
 *
 * Props:
 * - latitude: Initial latitude (optional)
 * - longitude: Initial longitude (optional)
 * - address: Address string for geocoding (optional)
 * - city: City for geocoding (optional)
 * - state: State for geocoding (optional)
 * - zipCode: ZIP code for geocoding (optional)
 * - onLocationChange: Callback function(lat, lng, addressData) when marker is moved
 *   - addressData contains { address, city, state, zip_code } from reverse geocoding
 * - className: Additional CSS classes
 */
const LocationMapPicker = ({
    latitude,
    longitude,
    address,
    city,
    state,
    zipCode,
    onLocationChange,
    className = '',
}) => {
    const { googleMapsApiKey } = usePage().props;
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [geocodeError, setGeocodeError] = useState(null);
    const [currentCoords, setCurrentCoords] = useState({
        lat: isValidCoord(latitude) ? parseFloat(latitude) : null,
        lng: isValidCoord(longitude) ? parseFloat(longitude) : null,
    });
    const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
    const [mapType, setMapType] = useState('roadmap'); // 'roadmap' or 'satellite'
    const [latInput, setLatInput] = useState(isValidCoord(latitude) ? parseFloat(latitude).toFixed(6) : '');
    const [lngInput, setLngInput] = useState(isValidCoord(longitude) ? parseFloat(longitude).toFixed(6) : '');

    // Oklahoma default center
    const defaultLat = 35.5;
    const defaultLng = -97.5;
    const defaultZoom = 7;
    const addressZoom = 16;

    // Reverse geocode coordinates to get address
    const reverseGeocode = useCallback(async (lat, lng) => {
        setIsReverseGeocoding(true);

        try {
            const response = await axios.post('/api/reverse-geocode', {
                latitude: lat,
                longitude: lng,
            });

            if (response.data.success) {
                return {
                    address: response.data.address,
                    city: response.data.city,
                    state: response.data.state,
                    zip_code: response.data.zip_code,
                };
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error);
        } finally {
            setIsReverseGeocoding(false);
        }

        return null;
    }, []);

    // Handle marker placement/drag with reverse geocoding
    const handleMarkerPositionChange = useCallback(async (lat, lng) => {
        setCurrentCoords({ lat, lng });
        setGeocodeError(null);

        // Reverse geocode to get address
        const addressData = await reverseGeocode(lat, lng);

        // Call onLocationChange with coordinates and address data
        if (onLocationChange) {
            onLocationChange(lat, lng, addressData);
        }
    }, [onLocationChange, reverseGeocode]);

    // Create a draggable marker
    const createMarker = useCallback((lat, lng) => {
        if (!mapInstanceRef.current) return;

        // Remove existing marker
        if (markerRef.current) {
            markerRef.current.setMap(null);
        }

        // Create custom marker icon
        const markerIcon = {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#0891B2',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 2,
            anchor: new window.google.maps.Point(12, 22),
        };

        const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            draggable: true,
            icon: markerIcon,
            animation: window.google.maps.Animation.DROP,
        });

        // Handle marker drag end
        marker.addListener('dragend', () => {
            const position = marker.getPosition();
            const newLat = position.lat();
            const newLng = position.lng();
            handleMarkerPositionChange(newLat, newLng);
        });

        markerRef.current = marker;
    }, [handleMarkerPositionChange]);

    // Place marker at a specific location (with reverse geocoding)
    const placeMarker = useCallback((lat, lng) => {
        createMarker(lat, lng);
        handleMarkerPositionChange(lat, lng);
    }, [createMarker, handleMarkerPositionChange]);

    // Update marker position
    const updateMarkerPosition = useCallback((lat, lng) => {
        if (markerRef.current) {
            markerRef.current.setPosition({ lat, lng });
        } else {
            createMarker(lat, lng);
        }
    }, [createMarker]);

    // Load Google Maps Script
    const loadGoogleMapsScript = useCallback(() => {
        if (window.google && window.google.maps) {
            initializeMap();
            return;
        }

        // Check if script is already being loaded
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
        script.onerror = () => {
            console.error('Failed to load Google Maps script');
            setGeocodeError('Failed to load Google Maps. Please refresh the page.');
        };
        document.head.appendChild(script);
    }, [googleMapsApiKey]);

    // Initialize the map
    const initializeMap = useCallback(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Check if coordinates are valid numbers (including 0)
        const hasCoords = currentCoords.lat !== null && currentCoords.lng !== null;
        const initialLat = hasCoords ? currentCoords.lat : defaultLat;
        const initialLng = hasCoords ? currentCoords.lng : defaultLng;
        const initialZoom = hasCoords ? addressZoom : defaultZoom;

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: initialLat, lng: initialLng },
            zoom: initialZoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
            gestureHandling: 'greedy',
            scrollwheel: true,
            draggable: true,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }],
                },
            ],
        });

        mapInstanceRef.current = map;

        // Create marker if we have coordinates
        if (hasCoords) {
            createMarker(initialLat, initialLng);
        }

        // Click on map to place/move marker
        map.addListener('click', (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            placeMarker(lat, lng);
        });

        setIsMapLoaded(true);
    }, [currentCoords.lat, currentCoords.lng, createMarker, placeMarker]);

    // Geocode using Google Geocoding API (client-side)
    const geocodeAddress = useCallback(async (addr, cty, st, zip) => {
        if (!addr || !cty) return;

        setIsGeocoding(true);
        setGeocodeError(null);

        try {
            // Use the backend geocode endpoint which uses Google Geocoding API
            const response = await axios.post('/api/geocode', {
                address: addr,
                city: cty,
                state: st || 'Oklahoma',
                zip_code: zip,
            });

            if (response.data.success && response.data.latitude && response.data.longitude) {
                const lat = parseFloat(response.data.latitude);
                const lng = parseFloat(response.data.longitude);

                setCurrentCoords({ lat, lng });

                if (mapInstanceRef.current) {
                    updateMarkerPosition(lat, lng);
                    mapInstanceRef.current.setCenter({ lat, lng });
                    mapInstanceRef.current.setZoom(addressZoom);
                }

                if (onLocationChange) {
                    onLocationChange(lat, lng);
                }
            } else {
                setGeocodeError('Could not find this address. Please drag the marker to the correct location.');
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            setGeocodeError('Could not geocode address. Please drag the marker to the correct location.');
        } finally {
            setIsGeocoding(false);
        }
    }, [updateMarkerPosition, onLocationChange]);

    // Create debounced geocode function
    const debouncedGeocode = useMemo(() => {
        return debounce(geocodeAddress, 1000);
    }, [geocodeAddress]);

    // Initialize map on mount
    useEffect(() => {
        if (googleMapsApiKey) {
            loadGoogleMapsScript();
        } else {
            setGeocodeError('Google Maps API key is not configured.');
        }

        return () => {
            if (markerRef.current) {
                markerRef.current.setMap(null);
                markerRef.current = null;
            }
            mapInstanceRef.current = null;
        };
    }, [googleMapsApiKey, loadGoogleMapsScript]);

    // Update marker when coordinates change from props
    useEffect(() => {
        // Check for valid coordinates (not empty, not null, and valid numbers)
        if (isValidCoord(latitude) && isValidCoord(longitude)) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            setCurrentCoords({ lat, lng });

            if (mapInstanceRef.current && isMapLoaded) {
                updateMarkerPosition(lat, lng);
                mapInstanceRef.current.setCenter({ lat, lng });
                mapInstanceRef.current.setZoom(addressZoom);
            }
        }
    }, [latitude, longitude, isMapLoaded, updateMarkerPosition]);

    // Geocode when address fields change (only if no coordinates are set)
    useEffect(() => {
        if (currentCoords.lat === null && currentCoords.lng === null && address && city && isMapLoaded) {
            debouncedGeocode(address, city, state, zipCode);
        }
    }, [address, city, state, zipCode, isMapLoaded, debouncedGeocode, currentCoords.lat, currentCoords.lng]);

    const handleGeocodeClick = () => {
        if (address && city) {
            geocodeAddress(address, city, state, zipCode);
        }
    };

    const handleResetView = () => {
        if (mapInstanceRef.current) {
            if (currentCoords.lat !== null && currentCoords.lng !== null) {
                mapInstanceRef.current.setCenter({ lat: currentCoords.lat, lng: currentCoords.lng });
                mapInstanceRef.current.setZoom(addressZoom);
            } else {
                mapInstanceRef.current.setCenter({ lat: defaultLat, lng: defaultLng });
                mapInstanceRef.current.setZoom(defaultZoom);
            }
        }
    };

    // Sync lat/lng input fields whenever currentCoords changes
    useEffect(() => {
        if (currentCoords.lat !== null && currentCoords.lng !== null) {
            setLatInput(currentCoords.lat.toFixed(6));
            setLngInput(currentCoords.lng.toFixed(6));
        }
    }, [currentCoords.lat, currentCoords.lng]);

    // Handle manual coordinate input
    const handleManualCoordChange = useCallback(() => {
        const lat = parseFloat(latInput);
        const lng = parseFloat(lngInput);

        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return;
        }

        setCurrentCoords({ lat, lng });

        if (mapInstanceRef.current) {
            if (markerRef.current) {
                markerRef.current.setPosition({ lat, lng });
            } else {
                createMarker(lat, lng);
            }
            mapInstanceRef.current.setCenter({ lat, lng });
            mapInstanceRef.current.setZoom(addressZoom);
        }

        if (onLocationChange) {
            onLocationChange(lat, lng);
        }
    }, [latInput, lngInput, createMarker, onLocationChange]);

    const handleCoordKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleManualCoordChange();
        }
    };

    const handleZoomIn = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
        }
    };

    const handleZoomOut = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
        }
    };

    return (
        <div className={`relative ${className}`}>
            {/* Instructions */}
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-800">
                            Adjust property location on the map
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                            Click on the map or drag the marker to set the exact property location. This helps buyers find your property.
                        </p>
                    </div>
                </div>
            </div>

            {/* Geocoding Status */}
            {isGeocoding && (
                <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                    <span className="text-sm text-gray-700">Finding address on map...</span>
                </div>
            )}

            {/* Reverse Geocoding Status */}
            {isReverseGeocoding && (
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                    <span className="text-sm text-green-700">Getting address from location...</span>
                </div>
            )}

            {/* Geocode Error */}
            {geocodeError && (
                <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-amber-700">{geocodeError}</span>
                </div>
            )}

            {/* Lat/Lng Manual Inputs */}
            <div className="mb-3 grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                        type="text"
                        value={latInput}
                        onChange={(e) => setLatInput(e.target.value)}
                        onBlur={handleManualCoordChange}
                        onKeyDown={handleCoordKeyDown}
                        placeholder="e.g., 35.4676"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                        type="text"
                        value={lngInput}
                        onChange={(e) => setLngInput(e.target.value)}
                        onBlur={handleManualCoordChange}
                        onKeyDown={handleCoordKeyDown}
                        placeholder="e.g., -97.5164"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2]"
                    />
                </div>
            </div>

            {/* Map Container */}
            <div className="relative w-full rounded-xl overflow-hidden border border-gray-200" style={{ height: '300px' }}>
                <div ref={mapRef} className="w-full h-full" />

                {/* Map Controls */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-[10]">
                    <button
                        type="button"
                        className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                        title="Zoom In"
                        onClick={handleZoomIn}
                    >
                        <ZoomIn className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                        type="button"
                        className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                        title="Zoom Out"
                        onClick={handleZoomOut}
                    >
                        <ZoomOut className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                        type="button"
                        className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                        title="Reset View"
                        onClick={handleResetView}
                    >
                        <Navigation className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                        type="button"
                        className={`p-2 rounded-lg shadow-lg transition-colors ${mapType === 'satellite' ? 'bg-[#0891B2] text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
                        title={mapType === 'satellite' ? 'Switch to Road Map' : 'Switch to Satellite View'}
                        onClick={() => {
                            const newType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
                            setMapType(newType);
                            if (mapInstanceRef.current) {
                                mapInstanceRef.current.setMapTypeId(newType);
                            }
                        }}
                    >
                        <Layers className="w-4 h-4" />
                    </button>
                </div>

                {/* Geocode Button */}
                {address && city && (
                    <button
                        type="button"
                        onClick={handleGeocodeClick}
                        disabled={isGeocoding}
                        className="absolute bottom-3 left-3 bg-white px-3 py-2 rounded-lg shadow-lg z-[10] hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isGeocoding ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <MapPin className="w-4 h-4" />
                        )}
                        Find Address
                    </button>
                )}

                {/* Coordinates Display */}
                {currentCoords.lat !== null && currentCoords.lng !== null && (
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg z-[10] text-xs text-gray-600">
                        {currentCoords.lat.toFixed(6)}, {currentCoords.lng.toFixed(6)}
                    </div>
                )}

                {/* Loading State */}
                {!isMapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0891B2] mx-auto mb-3"></div>
                            <p className="text-gray-500 text-sm">Loading map...</p>
                        </div>
                    </div>
                )}

                {/* Click instruction overlay when no marker */}
                {isMapLoaded && currentCoords.lat === null && currentCoords.lng === null && !isGeocoding && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm text-gray-600">
                            Click on the map to place the property marker
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationMapPicker;

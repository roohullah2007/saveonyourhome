import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, Loader2, AlertCircle, Layers } from 'lucide-react';
import { usePage } from '@inertiajs/react';

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

const isValidCoord = (val) => val !== null && val !== undefined && val !== '' && !isNaN(parseFloat(val));

// Load Google Maps script once globally
let googleMapsLoadPromise = null;
// Maximum total wait for the Maps SDK + Places library to become usable
// after the script tag fires `onload`. With `loading=async`, the bootstrap
// script returns immediately and fetches the library modules in the
// background, so we have to poll for `places` to actually be available.
const GMAPS_READY_TIMEOUT_MS = 15000;

function waitForMaps(timeoutMs = GMAPS_READY_TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
        if (window.google?.maps?.places) return resolve();
        const start = Date.now();
        const check = setInterval(() => {
            if (mapsAuthFailed) {
                clearInterval(check);
                reject(new Error('Google Maps key was rejected (gm_authFailure). Check the API key, billing, and HTTP referer restrictions in the Google Cloud Console.'));
                return;
            }
            if (window.google?.maps?.places) {
                clearInterval(check);
                resolve();
                return;
            }
            if (Date.now() - start > timeoutMs) {
                clearInterval(check);
                reject(new Error('Google Maps SDK did not finish initializing within ' + (timeoutMs / 1000) + 's. The script loaded but `google.maps.places` is still undefined — usually an ad blocker, a referer/domain restriction on the API key, or the Places API is not enabled on the GCP project.'));
            }
        }, 120);
    });
}

// Load the Maps JS SDK with the `places` library — needed for the Street
// Address autocomplete on ListProperty.jsx as well as the map picker.
function loadGoogleMaps(apiKey) {
    if (window.google?.maps?.places) return Promise.resolve();
    if (googleMapsLoadPromise) return googleMapsLoadPromise;

    googleMapsLoadPromise = new Promise((resolve, reject) => {
        // Check if script tag already exists but hasn't loaded yet
        const existing = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existing) {
            waitForMaps().then(resolve, (err) => {
                googleMapsLoadPromise = null;
                reject(err);
            });
            return;
        }

        const script = document.createElement('script');
        // loading=async is the Google-recommended pattern; avoids the
        // "loaded directly without loading=async" console warning and
        // unlocks best-practice perf for the Maps JS SDK.
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&v=weekly`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            // The bootstrap script has parsed but with `loading=async` the
            // library files (incl. places) are still being fetched. Poll
            // until they're actually usable before resolving.
            waitForMaps().then(resolve, (err) => {
                googleMapsLoadPromise = null;
                reject(err);
            });
        };
        script.onerror = () => {
            googleMapsLoadPromise = null;
            reject(new Error('Failed to load the Google Maps script (network or DNS error). Check your connection and any ad blockers.'));
        };
        document.head.appendChild(script);
    });

    return googleMapsLoadPromise;
}

// Singleton registry for Google Maps auth failures. The Maps SDK fires
// `window.gm_authFailure` once when the API key is rejected (e.g. the
// required APIs aren't enabled on the GCP project). Multiple map
// components need to react to it, so we own the handler in one place and
// fan out to any subscribers.
let mapsAuthFailed = false;
const authFailureSubscribers = new Set();

if (typeof window !== 'undefined' && !window.__gmAuthHookInstalled) {
    window.__gmAuthHookInstalled = true;
    window.gm_authFailure = () => {
        mapsAuthFailed = true;
        authFailureSubscribers.forEach((cb) => {
            try { cb(); } catch (_) { /* noop */ }
        });
    };
}

function onMapsAuthFailure(cb) {
    authFailureSubscribers.add(cb);
    if (mapsAuthFailed) cb();
    return () => authFailureSubscribers.delete(cb);
}

function isMapsAuthFailed() {
    return mapsAuthFailed;
}

export { loadGoogleMaps, onMapsAuthFailure, isMapsAuthFailed };

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
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const onLocationChangeRef = useRef(onLocationChange);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [geocodeError, setGeocodeError] = useState(null);
    const [currentCoords, setCurrentCoords] = useState({
        lat: isValidCoord(latitude) ? parseFloat(latitude) : null,
        lng: isValidCoord(longitude) ? parseFloat(longitude) : null,
    });
    const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
    const [mapType, setMapType] = useState('roadmap');
    const [latInput, setLatInput] = useState(isValidCoord(latitude) ? parseFloat(latitude).toFixed(6) : '');
    const [lngInput, setLngInput] = useState(isValidCoord(longitude) ? parseFloat(longitude).toFixed(6) : '');
    const [authFailed, setAuthFailed] = useState(isMapsAuthFailed());

    // Swap the map container for a friendly placeholder if the Maps API key
    // is rejected at runtime.
    useEffect(() => onMapsAuthFailure(() => setAuthFailed(true)), []);

    const defaultLat = 40.0583;
    const defaultLng = -74.4057;
    const defaultZoom = 7;
    const addressZoom = 16;

    // Keep callback ref fresh
    onLocationChangeRef.current = onLocationChange;

    // Client-side reverse geocode using Google Maps Geocoder
    const reverseGeocode = useCallback(async (lat, lng) => {
        if (!window.google?.maps) return null;
        setIsReverseGeocoding(true);
        try {
            const geocoder = new window.google.maps.Geocoder();
            const result = await new Promise((resolve, reject) => {
                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                    if (status === 'OK' && results[0]) resolve(results[0]);
                    else reject(status);
                });
            });

            const get = (type) => {
                const comp = result.address_components.find(c => c.types.includes(type));
                return comp ? comp.long_name : '';
            };

            return {
                address: `${get('street_number')} ${get('route')}`.trim(),
                city: get('locality') || get('sublocality') || get('administrative_area_level_2'),
                state: get('administrative_area_level_1'),
                zip_code: get('postal_code'),
            };
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return null;
        } finally {
            setIsReverseGeocoding(false);
        }
    }, []);

    // Place/move marker and reverse geocode
    const placeMarkerAt = useCallback(async (lat, lng, { skipReverseGeocode = false } = {}) => {
        if (!mapInstanceRef.current) return;

        // Remove existing marker
        if (markerRef.current) {
            markerRef.current.setMap(null);
        }

        const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            draggable: true,
            icon: {
                path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                fillColor: '#1A1816',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 2,
                anchor: new window.google.maps.Point(12, 22),
            },
            animation: window.google.maps.Animation.DROP,
        });

        marker.addListener('dragend', async () => {
            const pos = marker.getPosition();
            const newLat = pos.lat();
            const newLng = pos.lng();
            setCurrentCoords({ lat: newLat, lng: newLng });
            setGeocodeError(null);
            const addressData = await reverseGeocode(newLat, newLng);
            onLocationChangeRef.current?.(newLat, newLng, addressData);
        });

        markerRef.current = marker;
        setCurrentCoords({ lat, lng });
        setGeocodeError(null);

        if (!skipReverseGeocode) {
            const addressData = await reverseGeocode(lat, lng);
            onLocationChangeRef.current?.(lat, lng, addressData);
        } else {
            onLocationChangeRef.current?.(lat, lng);
        }
    }, [reverseGeocode]);

    // Initialize map - runs once after Google Maps script loads and DOM is ready
    useEffect(() => {
        if (!googleMapsApiKey) {
            setGeocodeError('Google Maps API key is not configured.');
            return;
        }

        let cancelled = false;

        // If the Maps SDK has already flagged an auth failure (e.g. key
        // rejected), surface a useful banner immediately instead of leaving
        // the user staring at a perma-spinner.
        const unsubAuth = onMapsAuthFailure(() => {
            if (cancelled) return;
            setGeocodeError('Google Maps key was rejected. Check the API key, billing, and HTTP referer restrictions in the Google Cloud Console.');
        });

        loadGoogleMaps(googleMapsApiKey)
            .then(() => {
                if (cancelled || !mapContainerRef.current) return;

                const hasCoords = isValidCoord(latitude) && isValidCoord(longitude);
                const initialLat = hasCoords ? parseFloat(latitude) : defaultLat;
                const initialLng = hasCoords ? parseFloat(longitude) : defaultLng;
                const initialZoom = hasCoords ? addressZoom : defaultZoom;

                const map = new window.google.maps.Map(mapContainerRef.current, {
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

                // Place initial marker if coords exist
                if (hasCoords) {
                    const lat = parseFloat(latitude);
                    const lng = parseFloat(longitude);

                    const marker = new window.google.maps.Marker({
                        position: { lat, lng },
                        map,
                        draggable: true,
                        icon: {
                            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                            fillColor: '#1A1816',
                            fillOpacity: 1,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 2,
                            scale: 2,
                            anchor: new window.google.maps.Point(12, 22),
                        },
                    });

                    marker.addListener('dragend', async () => {
                        const pos = marker.getPosition();
                        const newLat = pos.lat();
                        const newLng = pos.lng();
                        setCurrentCoords({ lat: newLat, lng: newLng });
                        setGeocodeError(null);
                        const addrData = await reverseGeocode(newLat, newLng);
                        onLocationChangeRef.current?.(newLat, newLng, addrData);
                    });

                    markerRef.current = marker;
                    setCurrentCoords({ lat, lng });
                }

                // Click on map to place marker
                map.addListener('click', (e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();

                    if (markerRef.current) {
                        markerRef.current.setMap(null);
                    }

                    const marker = new window.google.maps.Marker({
                        position: { lat, lng },
                        map: mapInstanceRef.current,
                        draggable: true,
                        icon: {
                            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                            fillColor: '#1A1816',
                            fillOpacity: 1,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 2,
                            scale: 2,
                            anchor: new window.google.maps.Point(12, 22),
                        },
                        animation: window.google.maps.Animation.DROP,
                    });

                    marker.addListener('dragend', async () => {
                        const pos = marker.getPosition();
                        const newLat = pos.lat();
                        const newLng = pos.lng();
                        setCurrentCoords({ lat: newLat, lng: newLng });
                        setGeocodeError(null);
                        const addrData = await reverseGeocode(newLat, newLng);
                        onLocationChangeRef.current?.(newLat, newLng, addrData);
                    });

                    markerRef.current = marker;
                    setCurrentCoords({ lat, lng });
                    setGeocodeError(null);

                    // Reverse geocode the clicked location
                    (async () => {
                        const addrData = await reverseGeocode(lat, lng);
                        onLocationChangeRef.current?.(lat, lng, addrData);
                    })();
                });

                setIsMapLoaded(true);
            })
            .catch((err) => {
                if (!cancelled) {
                    const msg = err && err.message ? err.message : 'Failed to load Google Maps.';
                    // Log the precise failure to the console so we can debug
                    // on the user's device; show a concise message in the UI.
                    // eslint-disable-next-line no-console
                    console.error('[LocationMapPicker] Google Maps load failed:', err);
                    setGeocodeError(msg);
                }
            });

        return () => {
            cancelled = true;
            unsubAuth?.();
            if (markerRef.current) {
                markerRef.current.setMap(null);
                markerRef.current = null;
            }
            mapInstanceRef.current = null;
            setIsMapLoaded(false);
        };
    // Only run once on mount - props captured via refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [googleMapsApiKey]);

    // Client-side geocode using Google Maps Geocoder
    const geocodeAddress = useCallback(async (addr, cty, st, zip) => {
        if (!addr || !cty) return;
        if (!window.google?.maps) return;

        setIsGeocoding(true);
        setGeocodeError(null);

        try {
            const geocoder = new window.google.maps.Geocoder();

            // Build address parts, avoiding duplicate city/state if already in the street address
            const addrLower = addr.toLowerCase();
            const parts = [addr];
            if (cty && !addrLower.includes(cty.toLowerCase())) {
                parts.push(cty);
            }
            if (st && !addrLower.includes(st.toLowerCase())) {
                parts.push(st);
            }
            if (zip) {
                parts.push(zip);
            }
            const fullAddress = parts.join(', ');

            const result = await new Promise((resolve, reject) => {
                geocoder.geocode({ address: fullAddress }, (results, status) => {
                    if (status === 'OK' && results[0]) resolve(results[0]);
                    else reject(status);
                });
            });

            const location = result.geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            // Determine zoom based on result precision
            const locationType = result.geometry.location_type;
            const zoom = locationType === 'ROOFTOP' ? 19
                       : locationType === 'RANGE_INTERPOLATED' ? 18
                       : addressZoom;

            setCurrentCoords({ lat, lng });

            if (mapInstanceRef.current) {
                if (markerRef.current) {
                    markerRef.current.setPosition({ lat, lng });
                } else {
                    placeMarkerAt(lat, lng, { skipReverseGeocode: true });
                }
                mapInstanceRef.current.setCenter({ lat, lng });
                mapInstanceRef.current.setZoom(zoom);
            }

            // Extract proper address components from the geocode result
            const get = (type) => {
                const comp = result.address_components.find(c => c.types.includes(type));
                return comp ? comp.long_name : '';
            };

            const addressData = {
                address: `${get('street_number')} ${get('route')}`.trim() || addr,
                city: get('locality') || get('sublocality') || get('administrative_area_level_2') || cty,
                state: get('administrative_area_level_1') || st,
                zip_code: get('postal_code') || zip,
            };

            onLocationChangeRef.current?.(lat, lng, addressData);
        } catch (error) {
            console.error('Geocoding error:', error);
            setGeocodeError('Could not find this address. Please drag the marker to the correct location.');
        } finally {
            setIsGeocoding(false);
        }
    }, [placeMarkerAt]);

    const debouncedGeocode = useMemo(() => debounce(geocodeAddress, 1000), [geocodeAddress]);

    // Update marker when coordinates change from props
    useEffect(() => {
        if (isValidCoord(latitude) && isValidCoord(longitude) && mapInstanceRef.current && isMapLoaded) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            setCurrentCoords({ lat, lng });

            if (markerRef.current) {
                markerRef.current.setPosition({ lat, lng });
            }
            mapInstanceRef.current.setCenter({ lat, lng });
            mapInstanceRef.current.setZoom(addressZoom);
        }
    }, [latitude, longitude, isMapLoaded]);

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

    // Sync lat/lng input fields
    useEffect(() => {
        if (currentCoords.lat !== null && currentCoords.lng !== null) {
            setLatInput(currentCoords.lat.toFixed(6));
            setLngInput(currentCoords.lng.toFixed(6));
        }
    }, [currentCoords.lat, currentCoords.lng]);

    const handleManualCoordChange = useCallback(() => {
        const lat = parseFloat(latInput);
        const lng = parseFloat(lngInput);

        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) return;

        setCurrentCoords({ lat, lng });

        if (mapInstanceRef.current) {
            if (markerRef.current) {
                markerRef.current.setPosition({ lat, lng });
            } else {
                placeMarkerAt(lat, lng, { skipReverseGeocode: true });
            }
            mapInstanceRef.current.setCenter({ lat, lng });
            mapInstanceRef.current.setZoom(addressZoom);
        }

        onLocationChangeRef.current?.(lat, lng);
    }, [latInput, lngInput, placeMarkerAt]);

    const handleCoordKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleManualCoordChange();
        }
    };

    const handleZoomIn = () => mapInstanceRef.current?.setZoom(mapInstanceRef.current.getZoom() + 1);
    const handleZoomOut = () => mapInstanceRef.current?.setZoom(mapInstanceRef.current.getZoom() - 1);

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
                        placeholder="e.g., 40.0583"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
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
                        placeholder="e.g., -74.4057"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816]"
                    />
                </div>
            </div>

            {/* Map Container */}
            <div className="relative w-full rounded-xl overflow-hidden border border-gray-200" style={{ height: '300px' }}>
                {authFailed ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 bg-gray-50 text-gray-600">
                        <MapPin className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm font-semibold text-gray-800">Map unavailable</p>
                        <p className="text-xs text-gray-500 mt-1 max-w-sm">
                            The map can't load right now. You can still enter the address and coordinates manually — everything else on this form works as usual.
                        </p>
                    </div>
                ) : (
                    <div ref={mapContainerRef} className="w-full h-full" />
                )}

                {/* Map Controls — hide when the SDK failed to auth */}
                {!authFailed && (<>
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
                        className={`p-2 rounded-lg shadow-lg transition-colors ${mapType === 'satellite' ? 'bg-[#3355FF] text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
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
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A1816] mx-auto mb-3"></div>
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
                </>)}
            </div>
        </div>
    );
};

export default LocationMapPicker;

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { loadGoogleMaps } from '@/Components/Properties/LocationMapPicker';
import { useForm, router, usePage } from '@inertiajs/react';
import SEOHead from '@/Components/SEOHead';
import { Upload, Home, MapPin, DollarSign, Image, FileText, CheckCircle, ChevronRight, ChevronDown, X, AlertCircle, Loader2, Star, Sparkles, PlusCircle, XCircle, Wand2 } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import axios from 'axios';
import LocationMapPicker from '@/Components/Properties/LocationMapPicker';
import HomeValuationModal from '@/Components/HomeValuationModal';
import { AMENITY_GROUPS, groupItems } from '@/constants/amenities';

// Yes/No radio pair, used for seller-preference fields.
function YesNoField({ label, value, onChange }) {
  const on = !!value;
  const Radio = ({ checked, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 cursor-pointer select-none"
    >
      <span
        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${checked ? 'border-[#3355FF]' : 'border-gray-300'}`}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-[#3355FF]" />}
      </span>
      <span className="text-sm font-medium text-[#111]">{children}</span>
    </button>
  );
  return (
    <div>
      <label className="block text-sm font-semibold text-[#111] mb-3 leading-snug">{label}</label>
      <div className="flex items-center gap-6">
        <Radio checked={on} onClick={() => onChange(true)}>Yes</Radio>
        <Radio checked={!on} onClick={() => onChange(false)}>No</Radio>
      </div>
    </div>
  );
}

// Floor Plan card — rendered once per plan. Kept outside ListProperty so the
// component identity stays stable between parent renders and inputs don't lose focus.
function FloorPlanCard({ plan, onChange, onRemove, onImage, canRemove }) {
  const fileRef = useRef(null);
  const previewUrl = plan.image ? `/storage/${plan.image}` : '';
  return (
    <div className="border border-[#E5E1DC] rounded-2xl p-5 md:p-6 relative bg-white">
      <div className="absolute top-4 right-4">
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-600 transition-colors"
            aria-label="Remove floor plan"
          >
            <XCircle className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#111] mb-2">Floor Plan Title</label>
          <input
            type="text"
            value={plan.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Enter the plan title"
            className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
          />
          <p className="text-xs text-[#888] mt-1">For example: First Floor</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111] mb-2">Bedrooms on this floor</label>
          <input
            type="number"
            min="0"
            value={plan.bedrooms}
            onChange={(e) => onChange({ bedrooms: e.target.value })}
            placeholder="Enter the number of bedrooms"
            className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111] mb-2">Bathrooms on this floor</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={plan.bathrooms}
            onChange={(e) => onChange({ bathrooms: e.target.value })}
            placeholder="Enter the number of bathrooms"
            className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111] mb-2">Floor Size</label>
          <input
            type="text"
            value={plan.size}
            onChange={(e) => onChange({ size: e.target.value })}
            placeholder="Enter the plan size"
            className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
          />
          <p className="text-xs text-[#888] mt-1">For example: 200 Sq Ft</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111] mb-2">Plan Image</label>
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-lg border border-[#D0CCC7] bg-[#F4F3F0] overflow-hidden flex items-center justify-center">
              {plan.uploading ? (
                <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
              ) : previewUrl ? (
                <img src={previewUrl} alt="Floor plan" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <Image className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) onImage(e.target.files[0]); e.target.value = ''; }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-lg bg-[#3355FF] text-white px-4 py-2.5 text-sm font-semibold hover:bg-[#1D4ED8] transition-colors"
            >
              Select Image
            </button>
          </div>
          <p className="text-xs text-[#888] mt-1">Minimum size 800 x 600 px</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#111] mb-2">Description of this floor</label>
          <textarea
            rows={4}
            value={plan.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Enter the plan description"
            className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all resize-y"
          />
        </div>
      </div>
    </div>
  );
}

function ListProperty() {
  const { auth, taxonomies, googleMapsApiKey } = usePage().props;
  const txPropertyTypes = (taxonomies?.property_types || []);
  const txTransactionTypes = (taxonomies?.transaction_types || []);
  const txListingLabels = (taxonomies?.listing_labels || []);
  // Admin-managed amenity catalog (DB) — fall back to the bundled JS constant
  // if the shared prop isn't populated (first page load during development).
  const amenityGroups = (Array.isArray(taxonomies?.amenity_groups) && taxonomies.amenity_groups.length)
    ? taxonomies.amenity_groups
    : AMENITY_GROUPS;
  const user = auth?.user;

  const fileInputRef = useRef(null);
  const [photoFiles, setPhotoFiles] = useState([]); // Original files for preview
  const [photoPreviews, setPhotoPreviews] = useState([]); // Preview data with upload status
  const [uploadedPaths, setUploadedPaths] = useState([]); // Server paths of uploaded photos
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0); // Track which photo is the main/front photo
  const [uploadError, setUploadError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Track if any upload is in progress
  const [isDragActive, setIsDragActive] = useState(false); // Track drag state for visual feedback
  const [openAmenityGroups, setOpenAmenityGroups] = useState([]);
  const [showValuation, setShowValuation] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  // Floor plans: each entry is { id, title, bedrooms, bathrooms, size, image, description, uploading? }
  const makeFloorPlan = () => ({
    id: `fp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    image: '',
    description: '',
    uploading: false,
  });
  const [floorPlans, setFloorPlans] = useState([]);
  const toggleAmenityGroup = (cat) =>
    setOpenAmenityGroups((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  const maxPhotos = 50;

  const { data, setData, post, processing, errors, reset } = useForm({
    // Basic Info
    propertyTitle: '',
    developer: '',
    propertyType: '',
    status: 'for-sale',
    price: '',

    // Location
    address: '',
    city: '',
    state: '',
    zipCode: '',
    subdivision: '',

    // School Information
    schoolDistrict: '',
    gradeSchool: '',
    middleSchool: '',
    highSchool: '',

    // Property Details
    bedrooms: '',
    fullBathrooms: '',
    halfBathrooms: '',
    sqft: '',
    lotSize: '',
    acres: '',
    propertyDimensions: '',
    zoning: '',
    yearBuilt: '',
    garage: '',

    // County & financial disclosures
    county: '',
    annualPropertyTax: '',
    hasHoa: false,
    hoaFee: '',

    // Seller preferences
    isMotivatedSeller: false,
    isLicensedAgent: false,
    openToRealtors: true,
    requiresPreApproval: false,
    transactionType: 'for_sale',
    listingLabel: '',

    // Description
    description: '',

    // Features
    features: [],

    // Virtual tour
    virtualTourType: 'video',
    virtualTourUrl: '',
    virtualTourEmbed: '',

    // Photos
    photos: [],

    // Contact - Pre-fill from logged-in user
    contactName: user?.name || '',
    contactEmail: user?.email || '',
    contactPhone: user?.phone || '',

    // Location coordinates (set by map picker)
    latitude: '',
    longitude: '',
  });

  // Handler for map location changes (with optional address data from reverse geocoding)
  const handleLocationChange = useCallback((lat, lng, addressData) => {
    setData(data => {
      const updates = {
        ...data,
        latitude: lat,
        longitude: lng,
      };

      // If address data is provided from geocoding/reverse geocoding, update form fields
      if (addressData) {
        // Always update city, state, zip from geocode results to fix wrong defaults
        if (addressData.city) {
          updates.city = addressData.city;
        }
        if (addressData.state) {
          updates.state = addressData.state;
        }
        if (addressData.zip_code) {
          updates.zipCode = addressData.zip_code;
        }
        // Only update address if the user hasn't typed one yet
        if (addressData.address && !data.address) {
          updates.address = addressData.address;
        }
      }

      return updates;
    });
  }, [setData]);

  // Dynamic property types come from admin-managed taxonomy. Fall back to a
  // sensible built-in list if the shared prop hasn't propagated yet.
  const propertyTypes = txPropertyTypes.length > 0 ? txPropertyTypes : [
    { value: 'single-family-home', label: 'Single Family Home' },
    { value: 'condos-townhomes-co-ops', label: 'Condos/Townhomes/Co-Ops' },
    { value: 'multi-family', label: 'Multi-Family' },
    { value: 'land', label: 'Lot/Land' },
    { value: 'farms-ranches', label: 'Farms/Ranches' },
    { value: 'mfd-mobile-homes', label: 'Manufactured/Mobile Homes' },
  ];

  const features = [
    'Central AC', 'Central Heat', 'Fireplace', 'Swimming Pool', 'Hot Tub',
    'Garage', 'Covered Patio', 'Deck', 'Balcony', 'Walk-In Closet',
    'Hardwood Floors', 'Carpet', 'Tile Floors', 'Granite Countertops',
    'Stainless Steel Appliances', 'Updated Kitchen', 'Updated Bathroom',
    'Security System', 'Sprinkler System', 'Fenced Yard', 'Mature Trees',
    'Mountain View', 'Lakefront', 'Waterfront', 'Golf Course', 'Guest Quarters'
  ];

  const landFeatures = [
    'Fenced', 'Mature Trees', 'Additional Land Available', 'Corner Lot', 'Cul-De-Sac',
    'Farm or Ranch', 'Greenbelt', 'Golf Course Frontage', 'Hunting', 'Livestock Allowed',
    'Mobile Ready', 'Pond', 'Sidewalk', 'Spring/Creek', 'Water Frontage', 'Zero Lot Line'
  ];

  const handleInputChange = (field, value) => {
    setData(field, value);
  };

  // RentCast auto-fill state + handler.
  const [autoFillBusy, setAutoFillBusy] = useState(false);
  const [autoFillMsg, setAutoFillMsg] = useState('');
  const [autoFillErr, setAutoFillErr] = useState('');
  const [placesDisabled, setPlacesDisabled] = useState(false);
  const addressInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const skipAutocompleteNextChange = useRef(false);

  /**
   * Google's Places library hijacks the input and shows a disabled
   * "Oops! Something went wrong." state if the API key / project isn't
   * authorized. Roll the input back to a plain one so the seller can type
   * manually and still use the RentCast auto-fill button.
   */
  const resetAddressInputAfterAuthFailure = () => {
    const el = addressInputRef.current;
    if (!el) return;
    el.disabled = false;
    el.removeAttribute('disabled');
    el.classList.remove('gm-err-autocomplete', 'pac-target-input');
    el.style.backgroundImage = '';
    el.placeholder = 'Start typing — e.g., 1600 Pennsylvania Ave NW';
    // Also drop the invisible pac-container dropdown Google injected.
    document.querySelectorAll('.pac-container').forEach((n) => n.remove());
    setPlacesDisabled(true);
  };

  const applyRentcastRecord = (r) => {
    setData((prev) => {
      const next = { ...prev };
      // Only overwrite fields the seller hasn't filled yet — never blow away their edits.
      const merge = (key, value) => {
        if (value === undefined || value === null || value === '') return;
        if (prev[key] === '' || prev[key] === null || prev[key] === undefined || prev[key] === 0 || prev[key] === false) {
          next[key] = value;
        }
      };
      merge('propertyType', r.propertyType);
      merge('city', r.city);
      merge('state', r.state);
      merge('zipCode', r.zipCode);
      merge('county', r.county);
      merge('bedrooms', r.bedrooms);
      merge('fullBathrooms', r.fullBathrooms);
      merge('halfBathrooms', r.halfBathrooms);
      merge('sqft', r.sqft);
      merge('yearBuilt', r.yearBuilt);
      merge('lotSize', r.lotSize);
      merge('annualPropertyTax', r.annualPropertyTax);
      if (r.hasHoa !== undefined) next.hasHoa = prev.hasHoa || r.hasHoa;
      merge('hoaFee', r.hoaFee);
      if (Array.isArray(r.features) && r.features.length && (!prev.features || prev.features.length === 0)) {
        next.features = r.features;
      }
      if (r.latitude && !prev.latitude) next.latitude = r.latitude;
      if (r.longitude && !prev.longitude) next.longitude = r.longitude;
      return next;
    });
  };

  const runRentcastLookup = async (composedAddress) => {
    const composed = (composedAddress || '').trim();
    if (!composed) {
      setAutoFillErr('Enter an address first.');
      return;
    }
    setAutoFillBusy(true);
    setAutoFillMsg('');
    setAutoFillErr('');
    try {
      const { data: resp } = await axios.post(route('api.rentcast-lookup'), { address: composed });
      if (!resp?.success || !resp.data) throw new Error('No match');
      applyRentcastRecord(resp.data);
      setAutoFillMsg('Auto-filled from property records — review and edit anything that looks off.');
    } catch (err) {
      setAutoFillErr(
        err?.response?.data?.message ||
        "We couldn't find a record for that address. Try adding the city/state or ZIP."
      );
    } finally {
      setAutoFillBusy(false);
    }
  };

  const runAutoFill = () => {
    const composed = [data.address, data.city, data.state, data.zipCode]
      .filter(Boolean)
      .join(', ');
    return runRentcastLookup(composed);
  };

  // Wire Google Places Autocomplete onto the Street Address input. When the
  // user picks a suggestion we parse address_components, fill the individual
  // fields, then trigger the RentCast lookup with the selected formatted
  // address so beds/baths/etc. also fill in without a second click.
  useEffect(() => {
    if (!googleMapsApiKey) return;
    if (!addressInputRef.current) return;

    // Google invokes window.gm_authFailure when the API key is rejected
    // (e.g. Maps JS / Places not enabled on the GCP project). Wire it up
    // *before* loading so we can recover whenever it fires.
    const priorAuthFailureHandler = window.gm_authFailure;
    window.gm_authFailure = () => {
      resetAddressInputAfterAuthFailure();
      if (typeof priorAuthFailureHandler === 'function') priorAuthFailureHandler();
    };

    let mounted = true;
    loadGoogleMaps(googleMapsApiKey).then(() => {
      if (!mounted || !addressInputRef.current) return;
      if (autocompleteRef.current) return; // already initialized
      if (!window.google?.maps?.places?.Autocomplete) {
        // Places library didn't load — probably ApiNotActivated. Don't
        // throw, just leave the input as a plain text box.
        resetAddressInputAfterAuthFailure();
        return;
      }

      let ac;
      try {
        ac = new window.google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'formatted_address', 'geometry'],
        });
      } catch (e) {
        console.warn('Places autocomplete failed to initialize', e);
        resetAddressInputAfterAuthFailure();
        return;
      }
      autocompleteRef.current = ac;

      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        if (!place || !place.address_components) return;

        // Parse address components.
        const get = (type, short = false) => {
          const c = place.address_components.find((x) => x.types.includes(type));
          return c ? (short ? c.short_name : c.long_name) : '';
        };

        const streetNumber = get('street_number');
        const route = get('route');
        const streetAddress = [streetNumber, route].filter(Boolean).join(' ');
        const city = get('locality') || get('sublocality') || get('postal_town');
        const state = get('administrative_area_level_1', true);
        const zip = get('postal_code');
        const county = get('administrative_area_level_2').replace(/ County$/, '');
        const lat = place.geometry?.location?.lat?.();
        const lng = place.geometry?.location?.lng?.();

        // Overwrite the main location fields unconditionally since the user
        // just explicitly picked this address from the dropdown.
        skipAutocompleteNextChange.current = true;
        setData((prev) => ({
          ...prev,
          address: streetAddress || place.formatted_address || prev.address,
          city: city || prev.city,
          state: state || prev.state,
          zipCode: zip || prev.zipCode,
          county: county || prev.county,
          latitude: lat ?? prev.latitude,
          longitude: lng ?? prev.longitude,
        }));

        // Kick off the RentCast auto-fill with the canonical formatted address.
        const composed = place.formatted_address
          || [streetAddress, city, state, zip].filter(Boolean).join(', ');
        if (composed) runRentcastLookup(composed);
      });
    }).catch(() => {
      resetAddressInputAfterAuthFailure();
    });

    return () => {
      mounted = false;
      if (window.gm_authFailure === resetAddressInputAfterAuthFailure) {
        window.gm_authFailure = priorAuthFailureHandler;
      }
    };
  }, [googleMapsApiKey]);

  const handleFeatureToggle = (feature) => {
    const currentFeatures = data.features;
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    setData('features', newFeatures);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading && photoPreviews.length < maxPhotos) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set inactive if we're leaving the drop zone entirely
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (isUploading || photoPreviews.length >= maxPhotos) return;

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/') ||
      file.name.toLowerCase().endsWith('.heic') ||
      file.name.toLowerCase().endsWith('.heif')
    );

    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handlePhotoChange = async (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = async (files) => {
    setUploadError('');

    // Calculate remaining slots
    const remainingSlots = maxPhotos - photoPreviews.length;

    if (remainingSlots <= 0) {
      setUploadError(`Maximum ${maxPhotos} photos allowed. Remove some photos to add more.`);
      return;
    }

    // Limit files to remaining slots
    const filesToProcess = files.slice(0, remainingSlots);

    // Validate each file
    const validFiles = [];
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
    const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'];

    for (const file of filesToProcess) {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      // Check file type (including HEIC from iPhones)
      if (!supportedTypes.includes(file.type.toLowerCase()) && !supportedExtensions.includes(fileExtension)) {
        setUploadError('Some files skipped. Supported formats: JPG, PNG, GIF, WebP, HEIC (iPhone)');
        continue;
      }

      // Check file size (30MB max)
      if (file.size > 30 * 1024 * 1024) {
        setUploadError('Some files skipped. Maximum file size is 30MB per photo.');
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setIsUploading(true);

      // Process and upload each file one by one
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const isHeic = fileExtension === 'heic' || fileExtension === 'heif';
        const previewId = Date.now() + i + Math.random();

        // Create preview first (with uploading status)
        let previewUrl = null;
        if (!isHeic) {
          previewUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.readAsDataURL(file);
          });
        }

        const newPreview = {
          id: previewId,
          url: previewUrl,
          name: file.name,
          isHeic,
          uploading: true,
          progress: 0,
          error: null,
          serverPath: null
        };

        // Add preview to state immediately
        setPhotoPreviews(prev => [...prev, newPreview]);
        setPhotoFiles(prev => [...prev, file]);

        // Upload the file
        try {
          const formData = new FormData();
          formData.append('photo', file);

          const response = await axios.post('/upload-photo', formData, {
            timeout: 120000, // 2 minute timeout for large files
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setPhotoPreviews(prev => prev.map(p =>
                p.id === previewId ? { ...p, progress: percentCompleted } : p
              ));
            }
          });

          if (response.data.success) {
            // Update preview with server path and completed status
            setPhotoPreviews(prev => prev.map(p =>
              p.id === previewId ? { ...p, uploading: false, progress: 100, serverPath: response.data.path } : p
            ));
            setUploadedPaths(prev => [...prev, { id: previewId, path: response.data.path }]);
          } else {
            // Mark as error
            setPhotoPreviews(prev => prev.map(p =>
              p.id === previewId ? { ...p, uploading: false, error: 'Upload failed' } : p
            ));
          }
        } catch (error) {
          console.error('Upload error:', error);
          // Mark as error but keep in list
          setPhotoPreviews(prev => prev.map(p =>
            p.id === previewId ? { ...p, uploading: false, error: error.response?.data?.message || 'Upload failed' } : p
          ));
        }
      }

      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async (index) => {
    const preview = photoPreviews[index];

    // If the photo was uploaded to server, delete it
    if (preview?.serverPath) {
      try {
        await axios.post('/delete-uploaded-photo', {
          path: preview.serverPath
        });
      } catch (error) {
        console.error('Failed to delete photo from server:', error);
      }
    }

    const updatedFiles = photoFiles.filter((_, i) => i !== index);
    const updatedPreviews = photoPreviews.filter((_, i) => i !== index);
    const updatedPaths = uploadedPaths.filter(p => p.id !== preview?.id);

    setPhotoFiles(updatedFiles);
    setPhotoPreviews(updatedPreviews);
    setUploadedPaths(updatedPaths);

    // Adjust main photo index if needed
    if (index === mainPhotoIndex) {
      setMainPhotoIndex(0); // Reset to first photo
    } else if (index < mainPhotoIndex) {
      setMainPhotoIndex(mainPhotoIndex - 1); // Shift index down
    }
  };

  const setAsMainPhoto = (index) => {
    setMainPhotoIndex(index);
  };

  const updateFloorPlan = (id, patch) =>
    setFloorPlans((prev) => prev.map((fp) => fp.id === id ? { ...fp, ...patch } : fp));

  const addFloorPlan = () => setFloorPlans((prev) => [...prev, makeFloorPlan()]);

  const removeFloorPlan = async (id) => {
    const target = floorPlans.find((fp) => fp.id === id);
    setFloorPlans((prev) => prev.filter((fp) => fp.id !== id));
    if (target?.image) {
      try { await axios.post('/delete-uploaded-photo', { path: target.image }); } catch (_) { /* ignore */ }
    }
  };

  const handleFloorPlanImage = async (id, file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const target = floorPlans.find((fp) => fp.id === id);
    const previousPath = target?.image;
    updateFloorPlan(id, { uploading: true });
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const res = await axios.post('/upload-photo', fd, { timeout: 120000 });
      if (res.data?.success && res.data?.path) {
        updateFloorPlan(id, { uploading: false, image: res.data.path });
        if (previousPath && previousPath !== res.data.path) {
          try { await axios.post('/delete-uploaded-photo', { path: previousPath }); } catch (_) { /* ignore */ }
        }
      } else {
        updateFloorPlan(id, { uploading: false });
      }
    } catch (_) {
      updateFloorPlan(id, { uploading: false });
    }
  };

  const generateDescription = async () => {
    setGeneratingDescription(true);
    try {
      const res = await axios.post('/dashboard/listings/generate-description-draft', {
        property_type: data.propertyType,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms, 10) : null,
        full_bathrooms: data.fullBathrooms ? parseInt(data.fullBathrooms, 10) : null,
        half_bathrooms: data.halfBathrooms ? parseInt(data.halfBathrooms, 10) : null,
        sqft: data.sqft ? parseInt(data.sqft, 10) : null,
        year_built: data.yearBuilt ? parseInt(data.yearBuilt, 10) : null,
        price: data.price || null,
        address: data.address,
        city: data.city,
        state: data.state,
        school_district: data.schoolDistrict || null,
        grade_school: data.gradeSchool || null,
        middle_school: data.middleSchool || null,
        high_school: data.highSchool || null,
        has_hoa: !!data.hasHoa,
        hoa_fee: data.hoaFee || null,
        annual_property_tax: data.annualPropertyTax || null,
        features: Array.isArray(data.features) ? data.features : [],
      });
      if (res.data?.description) {
        // The backend returns HTML paragraphs; strip tags into plain text
        // since this form uses a textarea rather than a rich editor.
        const plain = String(res.data.description)
          .replace(/<\/p>\s*<p>/gi, '\n\n')
          .replace(/<[^>]+>/g, '')
          .trim();
        handleInputChange('description', plain);
      }
    } catch (err) {
      alert('Could not generate a description right now. Please try again.');
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleSubmit = (e, isDraft = false) => {
    if (e && e.preventDefault) e.preventDefault();

    // Check if there are any photos still uploading
    const stillUploading = photoPreviews.some(p => p.uploading);
    if (stillUploading) {
      setUploadError('Please wait for all photos to finish uploading before submitting.');
      return;
    }

    // Check if there are any failed uploads
    const failedUploads = photoPreviews.filter(p => p.error);
    if (failedUploads.length > 0) {
      setUploadError(`${failedUploads.length} photo(s) failed to upload. Please remove them and try again.`);
      return;
    }

    // Get the server paths of successfully uploaded photos
    const successfulPreviews = photoPreviews.filter(p => p.serverPath);

    // Reorder photos so main photo is first
    let reorderedPaths = successfulPreviews.map(p => p.serverPath);
    if (mainPhotoIndex > 0 && mainPhotoIndex < reorderedPaths.length) {
      const mainPhotoPath = reorderedPaths.splice(mainPhotoIndex, 1)[0];
      reorderedPaths.unshift(mainPhotoPath);
    }

    // Submit form data with pre-uploaded photo paths (no files to upload)
    const submitData = {
      propertyTitle: data.propertyTitle,
      developer: data.developer || '',
      propertyType: data.propertyType,
      status: data.status,
      price: data.price,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      subdivision: data.subdivision || '',
      // School Information
      schoolDistrict: data.schoolDistrict,
      gradeSchool: data.gradeSchool || '',
      middleSchool: data.middleSchool || '',
      highSchool: data.highSchool || '',
      bedrooms: data.bedrooms,
      fullBathrooms: data.fullBathrooms,
      halfBathrooms: data.halfBathrooms || 0,
      sqft: data.sqft,
      lotSize: data.lotSize ? parseInt(data.lotSize, 10) : null,
      acres: data.acres ? parseFloat(data.acres) : null,
      propertyDimensions: data.propertyDimensions || null,
      zoning: data.zoning || '',
      yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt, 10) : null,
      garage: data.garage !== '' ? parseInt(data.garage, 10) : null,
      county: data.county || '',
      annualPropertyTax: data.annualPropertyTax !== '' ? parseFloat(data.annualPropertyTax) : null,
      hasHoa: !!data.hasHoa,
      hoaFee: data.hoaFee !== '' ? parseFloat(data.hoaFee) : null,
      isMotivatedSeller: !!data.isMotivatedSeller,
      isLicensedAgent: !!data.isLicensedAgent,
      openToRealtors: !!data.openToRealtors,
      requiresPreApproval: !!data.requiresPreApproval,
      transactionType: data.transactionType || 'for_sale',
      listingLabel: data.listingLabel || null,
      description: data.description,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      features: JSON.stringify(data.features),
      photoPaths: reorderedPaths, // Pre-uploaded photo paths
      floorPlans: floorPlans
        .filter((fp) => fp.title || fp.image || fp.description)
        .map((fp) => ({
          title: fp.title || '',
          bedrooms: fp.bedrooms === '' ? null : parseInt(fp.bedrooms, 10),
          bathrooms: fp.bathrooms === '' ? null : parseFloat(fp.bathrooms),
          size: fp.size || '',
          image: fp.image || '',
          description: fp.description || '',
        })),
      // Virtual tour
      virtualTourType: data.virtualTourType || 'video',
      virtualTourUrl: data.virtualTourUrl || null,
      virtualTourEmbed: data.virtualTourEmbed || null,
      // Location coordinates from map picker
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      is_draft: isDraft,
    };

    router.post('/properties', submitData, {
      onSuccess: () => {
        reset();
        setPhotoFiles([]);
        setPhotoPreviews([]);
        setUploadedPaths([]);
        setMainPhotoIndex(0);
        setFloorPlans([]);
        setShowSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (errors) => {
        console.error('Submission errors:', errors);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  return (
    <>
      <SEOHead
        title="List Your Property For Free"
        description="List your home for sale by owner on SaveOnYourHome. Free FSBO listing with photos, descriptions, and direct buyer connections. No commissions or hidden fees."
        keywords="list home for sale, FSBO listing, sell home by owner, free property listing, list property online"
        noindex={true}
      />

      {/* Hero Section */}
      <div className="relative">
        <div className="relative min-h-[60vh] flex items-center py-16 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/home-img.webp"
              alt="List Property Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          </div>

          {/* Content */}
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[40px] relative z-10 w-full">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
                <Home className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-medium">
                  List Your Property
                </span>
              </div>

              <h1 className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-5 drop-shadow-2xl">
                Create Your Free Listing
              </h1>

              <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-4 drop-shadow-lg">
                Congratulations on taking the first step to selling your home! Fill out the form below to create your free listing.
              </p>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 drop-shadow-lg">
                Once your listing is live, you can order professional photos and multimedia packages to maximize your exposure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-[#EEEDEA] py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[40px]">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-green-800 mb-2">
                    Property Listed Successfully!
                  </h3>
                  <p className="text-green-700 mb-4">
                    Thank you for listing your property with SaveOnYourHome. Your listing is now pending approval and will be reviewed by our team within 24-48 hours.
                  </p>
                  <p className="text-green-600 text-sm mb-6">
                    You will receive an email notification once your listing is approved and live on our website.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="/properties"
                      className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
                      style={{ height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600, backgroundColor: '#16A34A' }}
                    >
                      Browse Properties
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowSuccess(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 hover:opacity-90"
                      style={{ height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600, backgroundColor: '#FFFFFF', color: '#15803D', border: '1px solid #86EFAC' }}
                    >
                      List Another Property
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSuccess(false)}
                  className="text-green-500 hover:text-green-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Please fix the following errors:
                  </h3>
                  <ul className="list-disc list-inside text-red-700 space-y-1">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#E5E1DC] p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-[#3D3D3D]" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-[#111]">
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Property Type *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                   
                    value={data.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    required
                  >
                    <option value="">Select Type</option>
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                    <label className="block text-sm font-semibold text-[#111]">
                      Listing Price *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowValuation(true)}
                      className="text-xs font-semibold text-[#1A1816] underline underline-offset-2 hover:text-[#3355FF] transition-colors"
                    >
                      Use Home Valuation Tool
                    </button>
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                    <input
                      type="number"
                      placeholder="299000"
                      className="w-full pl-10 pr-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"

                      value={data.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Developer/Builder
                  </label>
                  <input
                    type="text"
                    placeholder="Optional — e.g., Simmons Homes"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                    value={data.developer}
                    onChange={(e) => handleInputChange('developer', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#E5E1DC] p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-[#3D3D3D]" />
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold text-[#111]">
                    Location
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={runAutoFill}
                  disabled={autoFillBusy}
                  className="inline-flex items-center gap-2 rounded-full border border-[#3355FF]/30 bg-[#3355FF]/5 text-[#3355FF] text-xs font-semibold px-3 py-2 hover:bg-[#3355FF]/10 disabled:opacity-60"
                  title="Use RentCast to auto-fill property facts from the address"
                >
                  {autoFillBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  {autoFillBusy ? 'Looking up…' : 'Auto-fill from address'}
                </button>
              </div>

              {(autoFillMsg || autoFillErr) && (
                <div className={`mb-5 text-xs rounded-lg px-3 py-2 border ${autoFillErr ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                  {autoFillErr || autoFillMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Street Address *
                  </label>
                  <input
                    ref={addressInputRef}
                    type="text"
                    placeholder="Start typing — e.g., 1600 Pennsylvania Ave NW"
                    autoComplete="off"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                    value={data.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                  <p className="mt-1.5 text-xs text-gray-500">
                    {placesDisabled
                      ? "Address suggestions unavailable right now — type the address, then click Auto-fill to pull the property facts."
                      : "Pick an address from the dropdown and we'll auto-fill city, state, ZIP, and the property facts from public records."}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="Tulsa"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                   
                    value={data.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    placeholder="State"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                    value={data.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    placeholder="74101"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                   
                    value={data.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    County
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tulsa"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                    value={data.county}
                    onChange={(e) => handleInputChange('county', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Subdivision
                  </label>
                  <input
                    type="text"
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"

                    value={data.subdivision}
                    onChange={(e) => handleInputChange('subdivision', e.target.value)}
                  />
                </div>

                {/* Location Map Picker */}
                <div className="md:col-span-2">
                  <LocationMapPicker
                    latitude={data.latitude}
                    longitude={data.longitude}
                    address={data.address}
                    city={data.city}
                    state={data.state}
                    zipCode={data.zipCode}
                    onLocationChange={handleLocationChange}
                  />
                </div>
              </div>
            </div>

            {/* School Information */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#E5E1DC] p-3 rounded-lg">
                  <svg className="w-6 h-6 text-[#3D3D3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-[#111]">
                  School Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    School District *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tulsa Public Schools"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                   
                    value={data.schoolDistrict}
                    onChange={(e) => handleInputChange('schoolDistrict', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Grade School
                  </label>
                  <input
                    type="text"
                    placeholder="Elementary school name"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                   
                    value={data.gradeSchool}
                    onChange={(e) => handleInputChange('gradeSchool', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Middle/Jr High School
                  </label>
                  <input
                    type="text"
                    placeholder="Middle school name"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                   
                    value={data.middleSchool}
                    onChange={(e) => handleInputChange('middleSchool', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    High School
                  </label>
                  <input
                    type="text"
                    placeholder="High school name"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                   
                    value={data.highSchool}
                    onChange={(e) => handleInputChange('highSchool', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Property Details / Lot Details */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#E5E1DC] p-3 rounded-lg">
                  <Home className="w-6 h-6 text-[#3D3D3D]" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-[#111]">
                  {data.propertyType === 'land' ? 'Lot Details' : 'Property Details'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Only show bedrooms, bathrooms, sqft, year built for non-land properties */}
                {data.propertyType !== 'land' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-[#111] mb-2">
                        Bedrooms *
                      </label>
                      <input
                        type="number"
                        placeholder="3"
                        min="0"
                        className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                       
                        value={data.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#111] mb-2">
                        Full Bathrooms *
                      </label>
                      <input
                        type="number"
                        placeholder="2"
                        min="0"
                        className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                       
                        value={data.fullBathrooms}
                        onChange={(e) => handleInputChange('fullBathrooms', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#111] mb-2">
                        Half Bathrooms
                      </label>
                      <input
                        type="number"
                        placeholder="1"
                        min="0"
                        className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                       
                        value={data.halfBathrooms}
                        onChange={(e) => handleInputChange('halfBathrooms', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#111] mb-2">
                        Square Feet *
                      </label>
                      <input
                        type="number"
                        placeholder="2000"
                        className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                       
                        value={data.sqft}
                        onChange={(e) => handleInputChange('sqft', e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <div className={data.propertyType === 'land' ? '' : ''}>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Lot Size (Sq Ft) {data.propertyType === 'land' ? '*' : ''}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g., 43560"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                   
                    value={data.lotSize}
                    onChange={(e) => handleInputChange('lotSize', e.target.value)}
                    required={data.propertyType === 'land'}
                  />
                </div>

                {data.propertyType === 'land' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-[#111] mb-2">
                        Acres
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="e.g., 5.5"
                        className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                       
                        value={data.acres}
                        onChange={(e) => handleInputChange('acres', e.target.value)}
                      />
                      <p className="text-xs text-[#666] mt-1">Multiply Acres x 43,560 for sqft</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#111] mb-2">
                        Zoning
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Agricultural, Residential"
                        className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                       
                        value={data.zoning}
                        onChange={(e) => handleInputChange('zoning', e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Property Dimensions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 70x70"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                    value={data.propertyDimensions}
                    onChange={(e) => handleInputChange('propertyDimensions', e.target.value)}
                  />
                  <p className="text-xs text-[#666] mt-1">Width × depth in feet</p>
                </div>

                {data.propertyType !== 'land' && (
                  <div>
                    <label className="block text-sm font-semibold text-[#111] mb-2">
                      Year Built
                    </label>
                    <input
                      type="number"
                      placeholder="2010"
                      className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"

                      value={data.yearBuilt}
                      onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                    />
                  </div>
                )}

                {data.propertyType !== 'land' && (
                  <div>
                    <label className="block text-sm font-semibold text-[#111] mb-2">
                      Garage (# of cars)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      placeholder="e.g., 2"
                      className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                      value={data.garage}
                      onChange={(e) => handleInputChange('garage', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Financials & Seller Preferences */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#E5E1DC] p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-[#3D3D3D]" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-[#111]">
                  Financials & Seller Preferences
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Annual Property Tax ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 4080"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                    value={data.annualPropertyTax}
                    onChange={(e) => handleInputChange('annualPropertyTax', e.target.value)}
                  />
                  <p className="text-xs text-[#888] mt-1">Used in the mortgage calculator for buyers.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    HOA Fee ($ / month)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 170"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                    value={data.hoaFee}
                    onChange={(e) => {
                      handleInputChange('hoaFee', e.target.value);
                      handleInputChange('hasHoa', e.target.value !== '' && parseFloat(e.target.value) > 0);
                    }}
                  />
                  <p className="text-xs text-[#888] mt-1">Leave blank if no HOA.</p>
                </div>
              </div>

              {/* Seller preferences — Yes/No radios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                <YesNoField
                  label="Seller is licensed real estate agent"
                  value={data.isLicensedAgent}
                  onChange={(v) => handleInputChange('isLicensedAgent', v)}
                />
                <YesNoField
                  label="Seller is open to contact from Realtors"
                  value={data.openToRealtors}
                  onChange={(v) => handleInputChange('openToRealtors', v)}
                />
                <YesNoField
                  label="Seller requires a Pre-Approval from a Licensed Mortgage Company Prior to Viewing the Home"
                  value={data.requiresPreApproval}
                  onChange={(v) => handleInputChange('requiresPreApproval', v)}
                />
                <YesNoField
                  label="Show a Motivated Seller badge on the listing"
                  value={data.isMotivatedSeller}
                  onChange={(v) => handleInputChange('isMotivatedSeller', v)}
                />
              </div>

              {/* Transaction Type + Special Notice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">Transaction Type</label>
                  <select
                    value={data.transactionType}
                    onChange={(e) => handleInputChange('transactionType', e.target.value)}
                    className="w-full border border-[#D0CCC7] rounded-lg px-4 py-3 text-[#111] bg-white focus:border-[#1A1816] focus:ring-1 focus:ring-[#1A1816] outline-none"
                  >
                    {(txTransactionTypes.length > 0 ? txTransactionTypes : [
                      { value: 'for_sale', label: 'For Sale By Owner' },
                      { value: 'for_rent', label: 'For Rent By Owner' },
                    ]).map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">Special Notice</label>
                  <select
                    value={data.listingLabel}
                    onChange={(e) => handleInputChange('listingLabel', e.target.value)}
                    className="w-full border border-[#D0CCC7] rounded-lg px-4 py-3 text-[#111] bg-white focus:border-[#1A1816] focus:ring-1 focus:ring-[#1A1816] outline-none"
                  >
                    <option value="">None</option>
                    {(txListingLabels.length > 0 ? txListingLabels : [
                      { value: 'new_listing', label: 'New Listing' },
                      { value: 'open_house', label: 'Open House' },
                      { value: 'motivated_seller', label: 'Motivated Seller' },
                      { value: 'price_reduction', label: 'Price Reduction' },
                      { value: 'new_construction', label: 'New Construction' },
                      { value: 'auction', label: 'Auction' },
                      { value: 'must_sell_by_date', label: 'Must Sell By Date' },
                    ]).map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-[#666] mt-1">Badge shown on your listing card.</p>
                </div>
              </div>
            </div>

            {/* Virtual Tour */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-[#111] mb-4">360° Virtual Tour</h2>
              <p className="text-sm text-[#111] leading-relaxed mb-4">
                360° Virtual Tour is a 3D View of the property interior or exterior. You can generate it using tools like{' '}
                <a href="https://www.klapty.com/" target="_blank" rel="noopener noreferrer" className="text-[#3355FF] hover:underline">Klapty</a>
                {' '}or{' '}
                <a href="https://matterport.com/" target="_blank" rel="noopener noreferrer" className="text-[#3355FF] hover:underline">Matterport</a>,
                then paste the generated embed code in the input field below.
              </p>

              <div className="mb-4">
                <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => handleInputChange('virtualTourType', 'video')}
                    className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${data.virtualTourType === 'video' ? 'bg-white shadow text-[#111]' : 'text-gray-500'}`}
                  >
                    Video URL
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('virtualTourType', 'embed')}
                    className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${data.virtualTourType === 'embed' ? 'bg-white shadow text-[#111]' : 'text-gray-500'}`}
                  >
                    Embed code
                  </button>
                </div>
              </div>

              {data.virtualTourType === 'video' ? (
                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">Video URL</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=…  or  https://vimeo.com/…"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                    value={data.virtualTourUrl}
                    onChange={(e) => handleInputChange('virtualTourUrl', e.target.value)}
                  />
                  <p className="text-xs text-[#666] mt-1">YouTube, Vimeo, or any direct video link. Optional.</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">Embed code</label>
                  <textarea
                    rows={6}
                    placeholder={'<iframe src="https://my.matterport.com/show/?m=..." allow="fullscreen"></iframe>'}
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all font-mono text-xs"
                    value={data.virtualTourEmbed}
                    onChange={(e) => handleInputChange('virtualTourEmbed', e.target.value)}
                  />
                  <p className="text-xs text-[#666] mt-1">Paste the iframe/embed code from Matterport, Kuula, iStaging, or your 3D-tour provider.</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#E5E1DC] p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-[#3D3D3D]" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-[#111]">
                  Description
                </h2>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                  <label className="block text-sm font-semibold text-[#111]">
                    Property Description *
                  </label>
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={generatingDescription}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3355FF] to-[#7c3aed] text-white px-3 py-1 text-xs font-semibold hover:opacity-90 disabled:opacity-60"
                  >
                    {generatingDescription
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                      : <><Sparkles className="w-3.5 h-3.5" /> Generate with AI</>}
                  </button>
                </div>
                <textarea
                  rows="6"
                  placeholder="Describe your property in detail. Include information about the neighborhood, recent updates, special features, etc."
                  className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent resize-none transition-all"

                  value={data.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                ></textarea>
                <p className="text-xs text-[#666] mt-1.5">Click Generate with AI to start from a quick draft based on your listing details.</p>
              </div>
            </div>

            {/* Features / Amenities */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#E5E1DC] p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-[#3D3D3D]" />
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold text-[#111]">
                    {data.propertyType === 'land' ? 'Land Features' : 'Amenities & Features'}
                  </h2>
                </div>
                {data.propertyType !== 'land' && data.features.length > 0 && (
                  <span className="text-sm text-gray-500">{data.features.length} selected</span>
                )}
              </div>

              {data.propertyType === 'land' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {landFeatures.map(feature => (
                    <label key={feature} className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-[#EEEDEA] transition-colors">
                      <input
                        type="checkbox"
                        checked={data.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="w-5 h-5 text-[#1A1816] rounded border-[#D0CCC7] focus:ring-[#1A1816]"
                      />
                      <span className="text-sm text-[#111]">{feature}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {amenityGroups.map((group) => {
                    const allItems = groupItems(group);
                    const selectedInGroup = allItems.filter(i => data.features.includes(i)).length;
                    const isOpen = openAmenityGroups.includes(group.category);
                    const renderCheckbox = (item) => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[#F4F3F0] transition-colors">
                        <input
                          type="checkbox"
                          checked={data.features.includes(item)}
                          onChange={() => handleFeatureToggle(item)}
                          className="w-4 h-4 text-[#1A1816] rounded border-[#D0CCC7] focus:ring-[#1A1816]"
                        />
                        <span className="text-sm text-[#111]">{item}</span>
                      </label>
                    );
                    return (
                      <div key={group.category} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAmenityGroup(group.category)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-[#111] text-sm">{group.category}</span>
                            {selectedInGroup > 0 && (
                              <span className="bg-[#3355FF] text-white text-[11px] font-semibold rounded-full px-2 py-0.5">
                                {selectedInGroup}
                              </span>
                            )}
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="p-4 space-y-5">
                            {group.subgroups ? (
                              group.subgroups.map((sg) => (
                                <div key={sg.label}>
                                  <div className="text-xs font-semibold uppercase tracking-wide text-[#666] mb-2">{sg.label}</div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {sg.items.map(renderCheckbox)}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {group.items.map(renderCheckbox)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Photos */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#E5E1DC] p-3 rounded-lg">
                    <Image className="w-6 h-6 text-[#3D3D3D]" />
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold text-[#111]">
                    Photos
                  </h2>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {photoPreviews.length} / {maxPhotos} photos
                </span>
              </div>

              {/* Photo Instructions */}
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Upload up to {maxPhotos} photos and select your main (front) photo
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      Click the star icon on any photo to set it as your main listing photo. The main photo will be shown first in search results.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Error */}
              {uploadError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-700">{uploadError}</span>
                </div>
              )}

              {/* Upload Progress Summary */}
              {photoPreviews.length > 0 && (
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {photoPreviews.some(p => p.uploading) && (
                      <div className="flex items-center gap-2 text-sm text-[#666]">
                        <Loader2 className="w-4 h-4 animate-spin text-[#1A1816]" />
                        <span>
                          Uploading {photoPreviews.filter(p => p.uploading).length} photo(s)...
                        </span>
                      </div>
                    )}
                    {photoPreviews.some(p => p.error) && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>
                          {photoPreviews.filter(p => p.error).length} failed
                        </span>
                      </div>
                    )}
                    {photoPreviews.filter(p => p.serverPath && !p.error).length > 0 && !photoPreviews.some(p => p.uploading) && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>
                          {photoPreviews.filter(p => p.serverPath && !p.error).length} uploaded successfully
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Photo Grid */}
              {photoPreviews.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {photoPreviews.map((preview, index) => (
                      <div key={preview.id} className={`relative group aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-md ${preview.error ? 'ring-2 ring-red-500' : ''}`}>
                        {preview.isHeic ? (
                          // HEIC placeholder
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-2">
                            <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                              <Image className="w-6 h-6 text-gray-400" />
                            </div>
                            <span className="text-xs text-gray-500 text-center truncate w-full px-1">{preview.name}</span>
                            <span className="text-[10px] text-green-600 mt-1">HEIC</span>
                          </div>
                        ) : (
                          <img
                            src={preview.url}
                            alt={preview.name}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Upload Progress Overlay */}
                        {preview.uploading && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                            <div className="w-3/4 bg-white/30 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-white rounded-full transition-all duration-300"
                                style={{ width: `${preview.progress}%` }}
                              />
                            </div>
                            <span className="text-white text-xs mt-1 font-medium">{preview.progress}%</span>
                          </div>
                        )}

                        {/* Error Overlay */}
                        {preview.error && !preview.uploading && (
                          <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center p-2">
                            <AlertCircle className="w-6 h-6 text-white mb-1" />
                            <span className="text-white text-xs text-center font-medium">Upload Failed</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto(index);
                              }}
                              className="mt-2 bg-white text-red-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-50 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        )}

                        {/* Success Indicator */}
                        {!preview.uploading && !preview.error && preview.serverPath && (
                          <div className="absolute top-2 right-2 bg-green-500 p-1 rounded-full">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}

                        {/* Main Photo Badge */}
                        {index === mainPhotoIndex && !preview.uploading && !preview.error && (
                          <span className="absolute top-2 left-2 bg-[#3355FF] text-white text-[10px] px-2 py-1 rounded-full font-medium">
                            Main Photo
                          </span>
                        )}

                        {/* Hover Actions - only show when not uploading and no error */}
                        {!preview.uploading && !preview.error && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {/* Set as Main Photo button */}
                            {index !== mainPhotoIndex && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAsMainPhoto(index);
                                }}
                                className="bg-white hover:bg-yellow-50 text-gray-700 p-2 rounded-full transition-colors shadow-lg"
                                title="Set as main photo"
                              >
                                <Star className="w-4 h-4" />
                              </button>
                            )}
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto(index);
                              }}
                              className="bg-white hover:bg-red-50 text-red-600 p-2 rounded-full transition-colors shadow-lg"
                              title="Remove photo"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area - Click or Drag & Drop */}
              <div
                onClick={!isUploading && photoPreviews.length < maxPhotos ? handlePhotoClick : undefined}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-all ${
                  isDragActive
                    ? 'border-[#1A1816] bg-[#1A1816]/10 scale-[1.02]'
                    : isUploading || photoPreviews.length >= maxPhotos
                      ? 'border-[#D0CCC7] opacity-50 cursor-not-allowed'
                      : 'border-[#D0CCC7] hover:border-[#1A1816] hover:bg-[#1A1816]/5 cursor-pointer'
                }`}
              >
                {isUploading ? (
                  <Loader2 className="w-10 h-10 text-[#1A1816] mx-auto mb-3 animate-spin" />
                ) : isDragActive ? (
                  <Upload className="w-10 h-10 text-[#1A1816] mx-auto mb-3 animate-bounce" />
                ) : (
                  <Upload className="w-10 h-10 text-[#666] mx-auto mb-3" />
                )}
                <p className="text-base font-semibold text-[#111] mb-1">
                  {isUploading
                    ? 'Uploading photos...'
                    : isDragActive
                      ? 'Drop photos here!'
                      : photoPreviews.length === 0
                        ? 'Click or drag photos here'
                        : 'Add more photos'}
                </p>
                <p className="text-sm text-[#666] mb-1">
                  JPG, PNG, GIF, WebP, or HEIC (iPhone) - max 30MB each
                </p>
                <p className="text-xs text-[#888]">
                  {isDragActive ? 'Release to upload' : 'Drag & drop or click to browse'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.heic,.heif"
                  onChange={handlePhotoChange}
                  className="hidden"
                  disabled={isUploading || photoPreviews.length >= maxPhotos}
                />
              </div>

              {/* Email Photos Option */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      Having trouble uploading? Email your photos instead!
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Send up to 50 photos to{' '}
                      <a href="mailto:photos@saveonyourhome.com" className="font-semibold underline hover:text-blue-900">
                        photos@saveonyourhome.com
                      </a>{' '}
                      with your property address in the subject line.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floor Plans */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#E5E1DC] p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-[#3D3D3D]" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-[#111]">Floor Plans</h2>
              </div>
              <p className="text-sm text-[#666] mb-6">
                Add each floor as its own card. Title, bedrooms, bathrooms, size, image, and a short description are shown on your listing detail page.
              </p>

              <div className="space-y-6">
                {floorPlans.map((fp, idx) => (
                  <FloorPlanCard
                    key={fp.id}
                    plan={fp}
                    onChange={(patch) => updateFloorPlan(fp.id, patch)}
                    onRemove={() => removeFloorPlan(fp.id)}
                    onImage={(file) => handleFloorPlanImage(fp.id, file)}
                    canRemove={floorPlans.length > 1 || idx > 0}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={addFloorPlan}
                disabled={floorPlans.length >= 20}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#3355FF] text-white px-4 py-2.5 text-sm font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                Add New
              </button>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#E5E1DC] p-3 rounded-lg">
                  <Home className="w-6 h-6 text-[#3D3D3D]" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-[#111]">
                  Contact Information
                </h2>
              </div>

              <p className="text-sm text-[#666] mb-6">
                This information is used for buyer inquiries only and will be sent to your account email. Your email address is not displayed publicly on the listing.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                   
                    value={data.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg bg-gray-50 text-[#666] cursor-not-allowed"
                   
                    value={data.contactEmail}
                    readOnly
                  />
                  <p className="text-xs text-[#888] mt-1">
                    Inquiries will be sent to your account email
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                   
                    value={data.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons: Save draft OR Submit for review */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={processing || isUploading || photoPreviews.some(p => p.uploading)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-[#1a1816] transition-all duration-300 hover:bg-gray-50 disabled:opacity-50"
                style={{ height: '46px', paddingLeft: '22px', paddingRight: '22px', fontSize: '14px', fontWeight: 600 }}
              >
                Save as draft
              </button>
              <button
                type="submit"
                disabled={processing || isUploading || photoPreviews.some(p => p.uploading)}
                className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600, backgroundColor: '#3355FF' }}
              >
                {processing ? (
                  <>
                    <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />
                    <span>Submitting…</span>
                  </>
                ) : isUploading || photoPreviews.some(p => p.uploading) ? (
                  <>
                    <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />
                    <span>Uploading Photos…</span>
                  </>
                ) : (
                  <>
                    <span>Publish listing for review</span>
                    <ChevronRight style={{ width: '16px', height: '16px' }} />
                  </>
                )}
              </button>
            </div>
            <p className="text-center text-xs text-[#666] mt-3">
              Save a draft to keep your progress, or publish — publishing sends it to an admin for a quick approval.
            </p>
          </form>
        </div>
      </div>

      {/* Loading Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-[#1A1816]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-[#1A1816] animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-[#111] mb-2">
              Submitting Your Listing
            </h3>
            <p className="text-[#666] mb-4">
              Please wait while we submit your listing. Your photos have already been uploaded.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-[#888]">
              <div className="w-2 h-2 bg-[#1A1816] rounded-full animate-pulse"></div>
              <span>Do not close or refresh this page</span>
            </div>
          </div>
        </div>
      )}

      <HomeValuationModal isOpen={showValuation} onClose={() => setShowValuation(false)} />
    </>
  );
}

// Specify MainLayout for this page to include Header and Footer
ListProperty.layout = (page) => <MainLayout>{page}</MainLayout>;

export default ListProperty;

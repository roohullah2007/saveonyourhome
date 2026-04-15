import React, { useRef, useState, useCallback } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import SEOHead from '@/Components/SEOHead';
import { Upload, Home, MapPin, DollarSign, Image, FileText, CheckCircle, ChevronRight, ChevronDown, X, AlertCircle, Loader2, Star } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import axios from 'axios';
import LocationMapPicker from '@/Components/Properties/LocationMapPicker';
import { AMENITY_GROUPS } from '@/constants/amenities';

function ListProperty() {
  const { auth } = usePage().props;
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
    state: 'Oklahoma',
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
    zoning: '',
    yearBuilt: '',

    // Description
    description: '',

    // Features
    features: [],

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

  const propertyTypes = [
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

  const handleSubmit = (e) => {
    e.preventDefault();

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
      zoning: data.zoning || '',
      yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt, 10) : null,
      description: data.description,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      features: JSON.stringify(data.features),
      photoPaths: reorderedPaths, // Pre-uploaded photo paths
      // Location coordinates from map picker
      latitude: data.latitude || null,
      longitude: data.longitude || null,
    };

    router.post('/properties', submitData, {
      onSuccess: () => {
        reset();
        setPhotoFiles([]);
        setPhotoPreviews([]);
        setUploadedPaths([]);
        setMainPhotoIndex(0);
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
      <div className="relative pt-0 md:pt-[77px]">
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
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors"
                     
                    >
                      Browse Properties
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowSuccess(false)}
                      className="inline-flex items-center gap-2 bg-white text-green-700 border border-green-300 px-6 py-3 rounded-full font-medium hover:bg-green-50 transition-colors"
                     
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
                <h2 className="text-2xl md:text-3xl font-semibold text-[#111]">
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Beautiful Home in Great Neighborhood"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                   
                    value={data.propertyTitle}
                    onChange={(e) => handleInputChange('propertyTitle', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Developer/Builder
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ABC Homes"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                   
                    value={data.developer}
                    onChange={(e) => handleInputChange('developer', e.target.value)}
                  />
                </div>

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
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Listing Price *
                  </label>
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
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#E5E1DC] p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-[#3D3D3D]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#111]">
                  Location
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#111] mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent transition-all"
                   
                    value={data.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
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
                    value="Oklahoma"
                    className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg bg-[#EEEDEA]"
                   
                    disabled
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
                <h2 className="text-2xl md:text-3xl font-semibold text-[#111]">
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
                <h2 className="text-2xl md:text-3xl font-semibold text-[#111]">
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
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#E5E1DC] p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-[#3D3D3D]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#111]">
                  Description
                </h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111] mb-2">
                  Property Description *
                </label>
                <textarea
                  rows="6"
                  placeholder="Describe your property in detail. Include information about the neighborhood, recent updates, special features, etc."
                  className="w-full px-4 py-3 border border-[#D0CCC7] rounded-lg focus:ring-2 focus:ring-[#1A1816] focus:border-transparent resize-none transition-all"
                 
                  value={data.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            {/* Features / Amenities */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#E5E1DC] p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-[#3D3D3D]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#111]">
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
                  {AMENITY_GROUPS.map((group) => {
                    const selectedInGroup = group.items.filter(i => data.features.includes(i)).length;
                    const isOpen = openAmenityGroups.includes(group.category);
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
                              <span className="bg-[#1A1816] text-white text-[11px] font-semibold rounded-full px-2 py-0.5">
                                {selectedInGroup}
                              </span>
                            )}
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {group.items.map(item => (
                              <label key={item} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[#F4F3F0] transition-colors">
                                <input
                                  type="checkbox"
                                  checked={data.features.includes(item)}
                                  onChange={() => handleFeatureToggle(item)}
                                  className="w-4 h-4 text-[#1A1816] rounded border-[#D0CCC7] focus:ring-[#1A1816]"
                                />
                                <span className="text-sm text-[#111]">{item}</span>
                              </label>
                            ))}
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
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#111]">
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
                          <span className="absolute top-2 left-2 bg-[#1A1816] text-white text-[10px] px-2 py-1 rounded-full font-medium">
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

            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#E5E1DC] p-3 rounded-lg">
                  <Home className="w-6 h-6 text-[#3D3D3D]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#111]">
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

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={processing || isUploading || photoPreviews.some(p => p.uploading)}
                className="inline-flex items-center gap-3 bg-[#1A1816] hover:bg-[#8B1829] text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
               
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : isUploading || photoPreviews.some(p => p.uploading) ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading Photos...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Property Listing</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
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
    </>
  );
}

// Specify MainLayout for this page to include Header and Footer
ListProperty.layout = (page) => <MainLayout>{page}</MainLayout>;

export default ListProperty;

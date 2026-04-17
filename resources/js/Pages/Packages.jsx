import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import SEOHead from '@/Components/SEOHead';
import {
  Camera, Video, Box, Sun, Plane, FileText, Globe, Users,
  ChevronRight, ChevronDown, CheckCircle, MapPin, Clock,
  Phone, Mail, Home, DollarSign, Star, Shield, Zap, Eye,
  X, AlertCircle, Calendar, User, Building, Lock, ArrowLeft, ArrowRight,
  Play, Layers, Image, HelpCircle
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import CompanyLogosGrid from '@/Components/Sections/CompanyLogosGrid';

// Pricing data based on square footage
const PRICING = {
  photosDrone: [
    { range: '0-1,499', min: 0, max: 1499, price: 175 },
    { range: '1,500-1,999', min: 1500, max: 1999, price: 200 },
    { range: '2,000-2,499', min: 2000, max: 2499, price: 225 },
    { range: '2,500-2,999', min: 2500, max: 2999, price: 250 },
    { range: '3,000-3,499', min: 3000, max: 3499, price: 275 },
    { range: '3,500-3,999', min: 3500, max: 3999, price: 300 },
    { range: '4,000-4,499', min: 4000, max: 4499, price: 325 },
    { range: '4,500-4,999', min: 4500, max: 4999, price: 350 },
    { range: '5,000-5,499', min: 5000, max: 5499, price: 375 },
    { range: '5,500-5,999', min: 5500, max: 5999, price: 400 },
  ],
  zillow3D: [
    { range: '0-1,499', min: 0, max: 1499, price: 135 },
    { range: '1,500-1,999', min: 1500, max: 1999, price: 135 },
    { range: '2,000-2,499', min: 2000, max: 2499, price: 155 },
    { range: '2,500-2,999', min: 2500, max: 2999, price: 155 },
    { range: '3,000-3,499', min: 3000, max: 3499, price: 175 },
    { range: '3,500-3,999', min: 3500, max: 3999, price: 175 },
    { range: '4,000-4,499', min: 4000, max: 4499, price: 195 },
    { range: '4,500-4,999', min: 4500, max: 4999, price: 195 },
    { range: '5,000-5,499', min: 5000, max: 5499, price: 215 },
    { range: '5,500-5,999', min: 5500, max: 5999, price: 215 },
  ],
  videoWalkthrough: [
    { range: '0-1,499', min: 0, max: 1499, price: 175 },
    { range: '1,500-1,999', min: 1500, max: 1999, price: 200 },
    { range: '2,000-2,499', min: 2000, max: 2499, price: 225 },
    { range: '2,500-2,999', min: 2500, max: 2999, price: 250 },
    { range: '3,000-3,499', min: 3000, max: 3499, price: 275 },
    { range: '3,500-3,999', min: 3500, max: 3999, price: 300 },
    { range: '4,000-4,499', min: 4000, max: 4499, price: 325 },
    { range: '4,500-4,999', min: 4500, max: 4999, price: 350 },
    { range: '5,000-5,499', min: 5000, max: 5499, price: 375 },
    { range: '5,500-5,999', min: 5500, max: 5999, price: 400 },
  ],
  matterport: [
    { range: '0-1,499', min: 0, max: 1499, price: 300 },
    { range: '1,500-1,999', min: 1500, max: 1999, price: 300 },
    { range: '2,000-2,499', min: 2000, max: 2499, price: 375 },
    { range: '2,500-2,999', min: 2500, max: 2999, price: 375 },
    { range: '3,000-3,499', min: 3000, max: 3499, price: 375 },
    { range: '3,500-3,999', min: 3500, max: 3999, price: 375 },
    { range: '4,000-4,499', min: 4000, max: 4499, price: 450 },
    { range: '4,500-4,999', min: 4500, max: 4999, price: 450 },
    { range: '5,000-5,499', min: 5000, max: 5499, price: 450 },
    { range: '5,500-5,999', min: 5500, max: 5999, price: 450 },
  ],
  reelsTikTok: [
    { range: '0-1,499', min: 0, max: 1499, price: 150 },
    { range: '1,500-1,999', min: 1500, max: 1999, price: 150 },
    { range: '2,000-2,499', min: 2000, max: 2499, price: 225 },
    { range: '2,500-2,999', min: 2500, max: 2999, price: 225 },
    { range: '3,000-3,499', min: 3000, max: 3499, price: 225 },
    { range: '3,500-3,999', min: 3500, max: 3999, price: 225 },
    { range: '4,000-4,499', min: 4000, max: 4499, price: 225 },
    { range: '4,500-4,999', min: 4500, max: 4999, price: 225 },
    { range: '5,000-5,499', min: 5000, max: 5499, price: 225 },
    { range: '5,500-5,999', min: 5500, max: 5999, price: 225 },
  ],
  floorPlan: 40, // Flat rate
  virtualTwilight: 15, // Per photo
};

// Square footage options for dropdown
const SQFT_OPTIONS = [
  { value: '', label: 'Select Square Footage' },
  { value: '0-1499', label: '0 - 1,499 sq ft', min: 0, max: 1499 },
  { value: '1500-1999', label: '1,500 - 1,999 sq ft', min: 1500, max: 1999 },
  { value: '2000-2499', label: '2,000 - 2,499 sq ft', min: 2000, max: 2499 },
  { value: '2500-2999', label: '2,500 - 2,999 sq ft', min: 2500, max: 2999 },
  { value: '3000-3499', label: '3,000 - 3,499 sq ft', min: 3000, max: 3499 },
  { value: '3500-3999', label: '3,500 - 3,999 sq ft', min: 3500, max: 3999 },
  { value: '4000-4499', label: '4,000 - 4,499 sq ft', min: 4000, max: 4499 },
  { value: '4500-4999', label: '4,500 - 4,999 sq ft', min: 4500, max: 4999 },
  { value: '5000-5499', label: '5,000 - 5,499 sq ft', min: 5000, max: 5499 },
  { value: '5500-5999', label: '5,500 - 5,999 sq ft', min: 5500, max: 5999 },
  { value: '6000+', label: '6,000+ sq ft (Contact for Quote)', min: 6000, max: 999999 },
];

function getPriceForSqft(pricingArray, sqftValue) {
  const option = SQFT_OPTIONS.find(opt => opt.value === sqftValue);
  if (!option || option.min >= 6000) return null;

  const priceEntry = pricingArray.find(p => option.min >= p.min && option.min <= p.max);
  return priceEntry ? priceEntry.price : null;
}

function Packages({ userListings = [] }) {
  const { auth } = usePage().props;

  // State for the booking form
  const [currentStep, setCurrentStep] = useState(0); // 0 = overview, 1-4 = form steps
  const [selectedListing, setSelectedListing] = useState(null);

  // Helper to get sqft range value from actual sqft number
  const getSqftRangeValue = (sqft) => {
    if (!sqft) return '';
    const sqftNum = parseInt(sqft);
    if (sqftNum >= 6000) return '6000+';
    if (sqftNum >= 5500) return '5500-5999';
    if (sqftNum >= 5000) return '5000-5499';
    if (sqftNum >= 4500) return '4500-4999';
    if (sqftNum >= 4000) return '4000-4499';
    if (sqftNum >= 3500) return '3500-3999';
    if (sqftNum >= 3000) return '3000-3499';
    if (sqftNum >= 2500) return '2500-2999';
    if (sqftNum >= 2000) return '2000-2499';
    if (sqftNum >= 1500) return '1500-1999';
    return '0-1499';
  };

  // Handle listing selection
  const handleListingSelect = (listingId) => {
    const listing = userListings.find(l => l.id === parseInt(listingId));
    setSelectedListing(listing || null);

    if (listing) {
      // Pre-fill form data from listing
      setFormData(prev => ({
        ...prev,
        address: `${listing.address}, ${listing.city}, ${listing.state} ${listing.zip_code}`,
        sqft: getSqftRangeValue(listing.sqft),
        propertyId: listing.id,
      }));
    } else {
      // Clear pre-filled data
      setFormData(prev => ({
        ...prev,
        address: '',
        sqft: '',
        propertyId: null,
      }));
    }
  };

  // Handle URL state for proper back button navigation
  useEffect(() => {
    // Check URL params on mount
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get('step');
    if (stepParam) {
      const step = parseInt(stepParam);
      if (step >= 1 && step <= 4) {
        setCurrentStep(step);
      }
    }

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get('step');
      if (stepParam) {
        const step = parseInt(stepParam);
        if (step >= 0 && step <= 4) {
          setCurrentStep(step);
        }
      } else {
        setCurrentStep(0);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update step with URL state for proper navigation using Inertia router
  const goToOrderForm = () => {
    router.visit('/our-packages?step=1', {
      preserveState: true,
      preserveScroll: true,
      only: [], // Don't reload any data
      onSuccess: () => setCurrentStep(1),
    });
  };

  const goToOverview = () => {
    router.visit('/our-packages', {
      preserveState: true,
      preserveScroll: true,
      only: [],
      onSuccess: () => setCurrentStep(0),
    });
  };
  const [showServiceAreaModal, setShowServiceAreaModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Service details data
  const SERVICES_DATA = {
    photosDrone: {
      id: 'photosDrone',
      icon: Camera,
      title: 'Professional Photos + Drone',
      shortDesc: '30-40 HDR photos including aerial drone shots. Next day delivery. Full use rights for all listing sites.',
      description: 'Professional real estate photography is the ideal starting point if you want your listing to stand out and reach its full potential. This is full-coverage photography with full use rights for your real estate listings. Your photos are sized to work great on SaveOnYourHome and other listing sites, like Zillow and Trulia.',
      features: [
        '30-40 professional HDR photos',
        'Aerial drone photography included at no extra charge',
        'Next day delivery',
        'Full coverage - Interior & Exterior',
        'Neighborhood amenities at your request (pools, parks, etc.)',
        'Full use rights for all listing sites',
      ],
      pricing: PRICING.photosDrone,
      turnaround: 'Next Day',
      sampleUrl: null,
    },
    zillow3D: {
      id: 'zillow3D',
      icon: Layers,
      title: 'Zillow 3D + Interactive Floor Plan',
      shortDesc: '360 photo tour with interactive 2D floor plan. Perfect for Zillow listings.',
      description: 'Create an immersive 360-degree photo tour that allows buyers to virtually walk through your property. Includes a professional 2D floor plan that helps buyers understand the layout and flow of your home.',
      features: [
        '360-degree photo tour',
        'Interactive 2D floor plan included',
        'Zillow-ready format',
        'Works on all major listing sites',
        'Mobile-friendly viewing experience',
        'Helps buyers visualize the space',
      ],
      pricing: PRICING.zillow3D,
      turnaround: '1-2 Days',
      sampleUrl: null,
    },
    videoWalkthrough: {
      id: 'videoWalkthrough',
      icon: Video,
      title: 'Video Walkthrough',
      shortDesc: 'Cinematic video tour of your entire property. Two-day turnaround.',
      description: 'A professionally produced walkthrough video tour that brings your property to life. Perfect for social media, listing sites, and sharing with potential buyers who want to see the flow of the home.',
      features: [
        'Cinematic walkthrough video',
        'Professional editing and music',
        'Full coverage - Interior & Exterior',
        'Two-day turnaround',
        'HD quality video',
        'Perfect for social media sharing',
        'Downloadable file for your use',
      ],
      pricing: PRICING.videoWalkthrough,
      turnaround: '2 Days',
      sampleUrl: null,
    },
    matterport: {
      id: 'matterport',
      icon: Box,
      title: 'Matterport 3D Tour',
      shortDesc: 'Fully immersive 3D experience with dollhouse view. 1 year hosting included.',
      description: 'The ultimate virtual tour experience. Matterport creates a fully immersive 3D digital twin of your property that buyers can explore from anywhere. Includes the famous "dollhouse" view that shows the entire property layout.',
      features: [
        'Fully immersive 3D virtual tour',
        'Iconic "Dollhouse" view',
        'Floor plan view included',
        'One-day turnaround',
        '1 year hosting included',
        'Measurement mode for buyers',
        'VR compatible',
        'Embed on any website',
      ],
      pricing: PRICING.matterport,
      turnaround: '1 Day',
      sampleUrl: null,
    },
    reelsTikTok: {
      id: 'reelsTikTok',
      icon: Play,
      title: 'Reels/TikTok Video',
      shortDesc: 'Social media optimized short-form video. Perfect for Instagram and TikTok.',
      description: 'Short-form vertical video optimized for Instagram Reels and TikTok. These attention-grabbing videos are perfect for reaching younger buyers and generating social media buzz for your listing.',
      features: [
        'Vertical format (9:16) for social media',
        'Trending music and effects',
        'Two-day turnaround',
        'Full coverage - Interior & Exterior',
        'Optimized for Instagram Reels & TikTok',
        'High engagement format',
        'Multiple clips for posting',
      ],
      pricing: PRICING.reelsTikTok,
      turnaround: '2 Days',
      sampleUrl: null,
    },
    virtualTwilight: {
      id: 'virtualTwilight',
      icon: Sun,
      title: 'Virtual Twilight',
      shortDesc: 'Transform daytime photos into stunning twilight shots digitally.',
      description: 'Virtual Twilight digitally transforms your daytime exterior photos into stunning twilight/dusk shots. This creates a dramatic, eye-catching image that makes your listing stand out without the need for an evening photo shoot.',
      features: [
        'Transforms daytime photos to twilight',
        'Dramatic sunset sky replacement',
        'Interior lights turned on digitally',
        'Warm, inviting atmosphere',
        '24-hour turnaround',
        'Professional color grading',
        'Perfect for hero images',
      ],
      pricing: null,
      flatPrice: PRICING.virtualTwilight,
      priceNote: 'per photo',
      turnaround: '24 Hours',
      sampleUrl: null,
    },
    floorPlan: {
      id: 'floorPlan',
      icon: FileText,
      title: 'Basic 2D Floor Plan',
      shortDesc: 'Professional property floor plan to help buyers visualize the space.',
      description: 'A clean, professional 2D floor plan that helps buyers understand the layout and flow of your property. Includes room dimensions and labels.',
      features: [
        'Professional 2D floor plan',
        'Room dimensions included',
        'Room labels',
        'Digital delivery',
        'Print-ready format',
        'Easy to understand layout',
      ],
      pricing: null,
      flatPrice: PRICING.floorPlan,
      priceNote: 'flat rate',
      turnaround: '1-2 Days',
      sampleUrl: null,
    },
  };

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Property Details
    propertyId: null, // ID of selected listing
    address: '',
    sqft: '',
    accessMethod: '',
    comboCode: '',
    occupiedStatus: '',
    subdivision: '',
    notes: '',

    // Step 2: Photo Package Selection
    photoPackage: '', // 'photos' or 'photosDrone'

    // Step 3: Additional Media
    additionalMedia: {
      zillow3D: false,
      videoWalkthrough: false,
      matterport: false,
      reelsTikTok: false,
      floorPlan: false,
      virtualTwilight: false,
      virtualTwilightCount: 1,
    },

    // Step 4: Scheduling
    brokerAssisted: false,

    // Scheduling
    preferredDate: '',
    preferredTime: '',

    // Contact/Account
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;

    // Photo package
    if (formData.photoPackage && formData.sqft && formData.sqft !== '6000+') {
      const photoPrice = getPriceForSqft(PRICING.photosDrone, formData.sqft);
      if (photoPrice) total += photoPrice;
    }

    // Additional media
    if (formData.additionalMedia.zillow3D && formData.sqft && formData.sqft !== '6000+') {
      const price = getPriceForSqft(PRICING.zillow3D, formData.sqft);
      if (price) total += price;
    }
    if (formData.additionalMedia.videoWalkthrough && formData.sqft && formData.sqft !== '6000+') {
      const price = getPriceForSqft(PRICING.videoWalkthrough, formData.sqft);
      if (price) total += price;
    }
    if (formData.additionalMedia.matterport && formData.sqft && formData.sqft !== '6000+') {
      const price = getPriceForSqft(PRICING.matterport, formData.sqft);
      if (price) total += price;
    }
    if (formData.additionalMedia.reelsTikTok && formData.sqft && formData.sqft !== '6000+') {
      const price = getPriceForSqft(PRICING.reelsTikTok, formData.sqft);
      if (price) total += price;
    }
    if (formData.additionalMedia.floorPlan) {
      total += PRICING.floorPlan;
    }
    if (formData.additionalMedia.virtualTwilight) {
      total += PRICING.virtualTwilight * formData.additionalMedia.virtualTwilightCount;
    }

    return total;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('additionalMedia.')) {
      const mediaKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        additionalMedia: {
          ...prev.additionalMedia,
          [mediaKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };


  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // For logged in users with listings, require a listing to be selected
      if (auth?.user && userListings.length > 0) {
        if (!formData.propertyId) newErrors.propertyId = 'Please select a listing';
      }
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.sqft) newErrors.sqft = 'Square footage is required';
      if (!formData.accessMethod) newErrors.accessMethod = 'Access method is required';
      if (formData.accessMethod === 'combo' && !formData.comboCode) {
        newErrors.comboCode = 'Combo code is required';
      }
      if (!formData.occupiedStatus) newErrors.occupiedStatus = 'Please indicate if property is occupied';
    }

    if (step === 2) {
      if (!formData.photoPackage) newErrors.photoPackage = 'Please select a photo package';
    }

    if (step === 4) {
      if (!formData.preferredTime) newErrors.preferredTime = 'Please select a preferred time';

      if (!auth?.user) {
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      // Check if 6000+ sqft or outside service area
      if (currentStep === 1 && formData.sqft === '6000+') {
        setShowQuoteModal(true);
        return;
      }
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(4)) return;

    setIsSubmitting(true);

    // Prepare the data for submission
    const submitData = {
      ...formData,
      totalPrice: calculateTotal(),
      additionalMedia: JSON.stringify(formData.additionalMedia),
    };

    router.post('/media-order', submitData, {
      onSuccess: () => {
        setIsSubmitting(false);
        // Reset form or redirect
      },
      onError: (errors) => {
        setIsSubmitting(false);
        setErrors(errors);
      }
    });
  };

  // Service Area Modal Component
  const ServiceAreaModal = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-2xl font-medium text-[#111]">
            Service Areas
          </h3>
          <button
            onClick={() => setShowServiceAreaModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-[#666] mb-6">
            Our professional photography services are available in the Tulsa and Oklahoma City metro areas.
            Properties outside these areas may incur a travel fee (typically $25-$35).
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Tulsa Service Area */}
            <div className="bg-[#EEEDEA] rounded-xl p-6">
              <h4 className="text-lg font-medium text-[#111] mb-4">
                Tulsa Metro Area
              </h4>
              <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d206176.88985567698!2d-95.9927!3d36.154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1703561234567!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
              <p className="text-sm text-[#666]">
                Coverage includes Tulsa and surrounding areas within approximately 30 miles.
              </p>
            </div>

            {/* OKC Service Area */}
            <div className="bg-[#EEEDEA] rounded-xl p-6">
              <h4 className="text-lg font-medium text-[#111] mb-4">
                Oklahoma City Metro Area
              </h4>
              <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d206546.71374804086!2d-97.5164!3d35.4676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1703561234567!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
              <p className="text-sm text-[#666]">
                Coverage includes Oklahoma City and surrounding areas within approximately 30 miles.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium">
                  Outside our service area?
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  No problem! Properties outside these areas may incur a small travel fee.
                  <Link href="/contact" className="underline font-medium ml-1">Contact us</Link> for a custom quote.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowServiceAreaModal(false)}
              className="bg-[#3355FF] text-white rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-[#1D4ED8]"
             
            >
              Got it, Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Quote Request Modal
  const QuoteModal = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-2xl font-medium text-[#111]">
            Request a Quote
          </h3>
          <button
            onClick={() => setShowQuoteModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-amber-600" />
            </div>
            <h4 className="text-lg font-medium text-[#111] mb-2">
              Special Quote Required
            </h4>
            <p className="text-[#666]">
              Properties over 6,000 square feet or outside our normal service areas require a custom quote.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/contact"
              className="w-full flex items-center justify-center gap-2 bg-[#3355FF] text-white rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-[#1D4ED8]"
             
            >
              <Mail className="w-5 h-5" />
              Request a Quote
            </Link>
            <a
              href="tel:888-441-6526"
              className="w-full flex items-center justify-center gap-2 bg-[#413936] text-white rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-[#312926]"
             
            >
              <Phone className="w-5 h-5" />
              Call 888-441-OKBO (6526)
            </a>
          </div>

          <button
            onClick={() => {
              setShowQuoteModal(false);
              setFormData(prev => ({ ...prev, sqft: '' }));
            }}
            className="w-full mt-4 text-[#666] hover:text-[#111] text-sm transition-colors"
           
          >
            Go back and select different square footage
          </button>
        </div>
      </div>
    </div>
  );

  // Service Detail Modal
  const ServiceDetailModal = () => {
    if (!selectedService) return null;
    const IconComponent = selectedService.icon;

    const howItWorksSteps = [
      {
        number: '1',
        title: 'Create Your Free Listing',
        description: 'List your property on SaveOnYourHome for free. It only takes a few minutes.'
      },
      {
        number: '2',
        title: 'Select Your Services',
        description: 'Choose from professional photos, drone, 2D floor plan, HD video walkthrough, Matterport 3D tour, and more.'
      },
      {
        number: '3',
        title: 'Order from Your Dashboard',
        description: 'Access your seller dashboard to order multimedia services for your listing.'
      },
      {
        number: '4',
        title: 'We Come to You',
        description: 'Our photographer will contact you to schedule a convenient time to capture your property.'
      }
    ];

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedService(null)}>
        <div
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#1A1816] p-3 rounded-xl">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-medium text-[#111]">
                {selectedService.title}
              </h3>
            </div>
            <button
              onClick={() => setSelectedService(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            {/* Description */}
            <p className="text-[#666] mb-6 leading-relaxed">
              {selectedService.description}
            </p>

            {/* Turnaround Time */}
            <div className="flex items-center gap-2 mb-6 bg-green-50 text-green-700 rounded-lg px-4 py-2 w-fit">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Turnaround: {selectedService.turnaround}
              </span>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-[#111] mb-4">
                What's Included
              </h4>
              <ul className="space-y-3">
                {selectedService.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[#666]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing Table */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-[#111] mb-4">
                Pricing
              </h4>
              {selectedService.pricing ? (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#EEEDEA]">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-[#666]">Square Footage</th>
                        <th className="text-right px-4 py-3 text-sm font-medium text-[#666]">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedService.pricing.map((tier, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-[#666]">{tier.range} sq ft</td>
                          <td className="px-4 py-3 text-sm text-[#1A1816] font-bold text-right">${tier.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-[#EEEDEA] rounded-xl px-6 py-4">
                  <span className="text-2xl font-bold text-[#1A1816]">
                    ${selectedService.flatPrice}
                  </span>
                  <span className="text-[#666] ml-2">
                    {selectedService.priceNote}
                  </span>
                </div>
              )}
            </div>

            {/* Sample Link */}
            {selectedService.sampleUrl && (
              <div className="mb-6">
                <a
                  href={selectedService.sampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#1A1816] hover:text-[#111111] font-medium transition-colors"
                 
                >
                  <Eye className="w-5 h-5" />
                  View Sample Work
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* How It Works Section */}
            <div className="mb-6 bg-[#EEEDEA] rounded-xl p-5">
              <h4 className="text-lg font-medium text-[#111] mb-4">
                How It Works
              </h4>
              <div className="space-y-4">
                {howItWorksSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 bg-[#3355FF] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                    <div>
                      <h5 className="font-medium text-[#111] text-sm">
                        {step.title}
                      </h5>
                      <p className="text-xs text-[#666] mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note about ordering */}
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Multimedia services are ordered from your seller dashboard after creating your free listing. Our photographer will schedule a visit once you place your order.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {auth?.user ? (
                <Link
                  href="/dashboard/listings"
                  className="w-full flex items-center justify-center gap-2 bg-[#3355FF] text-white rounded-full px-6 py-4 font-medium text-lg transition-all duration-300 hover:bg-[#1D4ED8]"
                 
                >
                  <Home className="w-5 h-5" />
                  Go to My Listings
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href="/list-property"
                  className="w-full flex items-center justify-center gap-2 bg-[#3355FF] text-white rounded-full px-6 py-4 font-medium text-lg transition-all duration-300 hover:bg-[#1D4ED8]"
                 
                >
                  <Home className="w-5 h-5" />
                  List Your Property Free
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // How It Works Modal
  const HowItWorksModal = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowHowItWorksModal(false)}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#E5E1DC] p-3 rounded-xl">
              <HelpCircle className="w-6 h-6 text-[#3D3D3D]" />
            </div>
            <h3 className="text-2xl font-medium text-[#111]">
              How It Works
            </h3>
          </div>
          <button
            onClick={() => setShowHowItWorksModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-[#666] mb-6 leading-relaxed">
            Our simple 4-step process makes ordering professional real estate photography quick and easy.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#3355FF] text-white flex items-center justify-center font-medium flex-shrink-0">1</div>
              <div>
                <h4 className="text-lg font-medium text-[#111] mb-1">Select Your Services</h4>
                <p className="text-[#666]">Choose photos, drone, 3D tours, video, and more.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#3355FF] text-white flex items-center justify-center font-medium flex-shrink-0">2</div>
              <div>
                <h4 className="text-lg font-medium text-[#111] mb-1">Schedule Your Appointment</h4>
                <p className="text-[#666]">Tell us your preferred date and time. We'll confirm within 24 hours.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#3355FF] text-white flex items-center justify-center font-medium flex-shrink-0">3</div>
              <div>
                <h4 className="text-lg font-medium text-[#111] mb-1">Prepare Your Property</h4>
                <p className="text-[#666]">Receive instructions on preparing your home for the best photos.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#3355FF] text-white flex items-center justify-center font-medium flex-shrink-0">4</div>
              <div>
                <h4 className="text-lg font-medium text-[#111] mb-1">Receive Your Photos</h4>
                <p className="text-[#666]">Get your professionally edited photos via email the next day. Pay after delivery.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => {
                setShowHowItWorksModal(false);
                goToOrderForm();
              }}
              className="inline-flex items-center gap-2 bg-[#3355FF] text-white rounded-full px-6 py-4 font-medium transition-all duration-300 hover:bg-[#1D4ED8]"
             
            >
              <Camera className="w-5 h-5" />
              Start Your Order
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Step Progress Indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
              currentStep >= step
                ? 'bg-[#3355FF] text-white'
                : 'bg-[#E5E1DC] text-[#666]'
            }`}
           
          >
            {currentStep > step ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              step
            )}
          </div>
          {index < 3 && (
            <div
              className={`w-16 h-1 mx-2 rounded ${
                currentStep > step ? 'bg-[#1A1816]' : 'bg-[#E5E1DC]'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Step 1: Property Details
  const Step1PropertyDetails = () => {
    // Not logged in - prompt to login or create listing
    if (!auth?.user) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-medium text-[#111] mb-2">
              Create Your Listing First
            </h3>
            <p className="text-[#666]">
              To order photos and media packages, you need to create a free listing first.
            </p>
          </div>

          <div className="bg-[#FFF8F0] border border-[#F0E6D8] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-[#1A1816]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-[#1A1816]" />
            </div>
            <h4 className="text-xl font-medium text-[#111] mb-2">
              Free Listing Required
            </h4>
            <p className="text-[#666] mb-6">
              Create your free property listing on SaveOnYourHome, then come back to order professional photos, videos, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/list-property"
                className="inline-flex items-center justify-center gap-2 bg-[#3355FF] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1D4ED8] transition-colors"
               
              >
                <Home className="w-5 h-5" />
                Create Free Listing
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 border border-[#D0CCC7] text-[#111] px-6 py-3 rounded-full font-medium hover:bg-[#F5F3F0] transition-colors"
               
              >
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Logged in but no listings
    if (userListings.length === 0) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-medium text-[#111] mb-2">
              Create Your Listing First
            </h3>
            <p className="text-[#666]">
              You don't have any active listings yet. Create a free listing to order packages.
            </p>
          </div>

          <div className="bg-[#FFF8F0] border border-[#F0E6D8] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-[#1A1816]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-[#1A1816]" />
            </div>
            <h4 className="text-xl font-medium text-[#111] mb-2">
              No Active Listings Found
            </h4>
            <p className="text-[#666] mb-6">
              Create your free property listing on SaveOnYourHome first, then come back to order professional photos, videos, 3D tours, and more.
            </p>
            <Link
              href="/list-property"
              className="inline-flex items-center justify-center gap-2 bg-[#3355FF] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1D4ED8] transition-colors"
             
            >
              <Home className="w-5 h-5" />
              Create Free Listing
            </Link>
          </div>
        </div>
      );
    }

    // Logged in with listings - show selector
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-medium text-[#111] mb-2">
            Select Your Property
          </h3>
          <p className="text-[#666]">
            Choose which listing you want to order photos and media for.
          </p>
        </div>

        {/* Listing Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#111] mb-2">
            Select Your Listing *
          </label>
          <select
            value={selectedListing?.id || ''}
            onChange={(e) => handleListingSelect(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all ${
              errors.propertyId ? 'border-red-500' : 'border-[#D0CCC7]'
            }`}
           
          >
            <option value="">-- Select a listing --</option>
            {userListings.map(listing => (
              <option key={listing.id} value={listing.id}>
                {listing.property_title || listing.address} - {listing.city}, {listing.state}
              </option>
            ))}
          </select>
          {errors.propertyId && <p className="text-red-500 text-sm mt-1">{errors.propertyId}</p>}
        </div>

        {/* Show selected listing info */}
        {selectedListing && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">
                  {selectedListing.property_title || selectedListing.address}
                </p>
                <p className="text-sm text-green-700">
                  {selectedListing.address}, {selectedListing.city}, {selectedListing.state} {selectedListing.zip_code}
                </p>
                {selectedListing.sqft && (
                  <p className="text-sm text-green-600 mt-1">
                    {parseInt(selectedListing.sqft).toLocaleString()} sq ft
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add new listing link */}
        <div className="text-center mb-6">
          <p className="text-sm text-[#666]">
            Don't see your property?{' '}
            <Link href="/list-property" className="text-[#1A1816] hover:underline font-medium">
              Create a new listing
            </Link>
          </p>
        </div>

        {/* Only show additional fields if a listing is selected */}
        {selectedListing && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Address - Pre-filled and readonly */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#111] mb-2">
                  Property Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666]" />
                  <input
                    type="text"
                    value={formData.address}
                    readOnly
                    className="w-full pl-12 pr-4 py-3 border border-[#D0CCC7] rounded-xl bg-gray-50 text-[#666]"
                   
                  />
                </div>
              </div>

              {/* Square Footage - Pre-filled */}
              <div>
                <label className="block text-sm font-medium text-[#111] mb-2">
                  Square Footage
                </label>
                <select
                  name="sqft"
                  value={formData.sqft}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[#D0CCC7] rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all"
                 
                >
                  {SQFT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Access Method */}
              <div>
                <label className="block text-sm font-medium text-[#111] mb-2">
                  How will the photographer access the home? *
                </label>
                <select
                  name="accessMethod"
                  value={formData.accessMethod}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all ${
                    errors.accessMethod ? 'border-red-500' : 'border-[#D0CCC7]'
                  }`}
                 
                >
                  <option value="">Select access method</option>
                  <option value="homeowner">Homeowner will be present</option>
                  <option value="combo">Combo/Lock Box Code</option>
                  <option value="garage">Garage Code</option>
                </select>
                {errors.accessMethod && <p className="text-red-500 text-sm mt-1">{errors.accessMethod}</p>}
              </div>

              {/* Combo/Garage Code - Only show if combo or garage selected */}
              {(formData.accessMethod === 'combo' || formData.accessMethod === 'garage') && (
                <div>
                  <label className="block text-sm font-medium text-[#111] mb-2">
                    {formData.accessMethod === 'combo' ? 'Combo/Lock Box Code' : 'Garage Code'} *
                  </label>
                  <input
                    type="text"
                    name="comboCode"
                    value={formData.comboCode}
                    onChange={handleInputChange}
                    placeholder="Enter code"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all ${
                      errors.comboCode ? 'border-red-500' : 'border-[#D0CCC7]'
                    }`}
                   
                  />
                  {errors.comboCode && <p className="text-red-500 text-sm mt-1">{errors.comboCode}</p>}
                </div>
              )}

              {/* Occupied Status */}
              <div>
                <label className="block text-sm font-medium text-[#111] mb-2">
                  Is the property occupied or vacant? *
                </label>
                <select
                  name="occupiedStatus"
                  value={formData.occupiedStatus}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all ${
                    errors.occupiedStatus ? 'border-red-500' : 'border-[#D0CCC7]'
                  }`}
                 
                >
                  <option value="">Select status</option>
                  <option value="occupied">Occupied</option>
                  <option value="vacant">Vacant</option>
                </select>
                {errors.occupiedStatus && <p className="text-red-500 text-sm mt-1">{errors.occupiedStatus}</p>}
              </div>

              {/* Subdivision */}
              <div>
                <label className="block text-sm font-medium text-[#111] mb-2">
                  Housing Addition/Subdivision (if applicable)
                </label>
                <input
                  type="text"
                  name="subdivision"
                  value={formData.subdivision}
                  onChange={handleInputChange}
                  placeholder="Enter subdivision name"
                  className="w-full px-4 py-3 border border-[#D0CCC7] rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all"
                 
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#111] mb-2">
                  Notes for Photographer
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any special instructions? (e.g., park or pool shots needed, pets on property, etc.)"
                  className="w-full px-4 py-3 border border-[#D0CCC7] rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all resize-none"
                 
                />
                <p className="text-xs text-[#666] mt-1">
                  *If a park or public pool shot is needed, we ask the homeowner to accompany the photographer.
                </p>
              </div>
            </div>

          {/* Service Area Check */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  Check Service Area
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  We service Tulsa and OKC metro areas.
                  <button
                    onClick={() => setShowServiceAreaModal(true)}
                    className="underline font-medium ml-1"
                  >
                    View service area map
                  </button>
                </p>
              </div>
            </div>
          </div>
        </>
        )}
      </div>
    );
  };

  // Step 2: Photo Package Selection
  const Step2PhotoSelection = () => {
    const photoPrice = getPriceForSqft(PRICING.photosDrone, formData.sqft);

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-medium text-[#111] mb-2">
            Select Your Photo Package
          </h3>
          <p className="text-[#666]">
            Professional real estate photography is the ideal starting point if you want your listing to stand out.
          </p>
        </div>

        <p className="text-sm text-[#666] mb-6">
          This is full-coverage photography with full use rights for your real estate listings. Your photos are sized to work great on SaveOnYourHome and other listing sites, like Zillow and Trulia. We include interiors, exteriors, and details with every appointment, as well as neighborhood amenities at your request.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Photos Only */}
          <div
            onClick={() => setFormData(prev => ({ ...prev, photoPackage: 'photos' }))}
            className={`cursor-pointer border-2 rounded-2xl p-6 transition-all ${
              formData.photoPackage === 'photos'
                ? 'border-[#1A1816] bg-[#1A1816]/5'
                : 'border-[#D0CCC7] hover:border-[#1A1816]/50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-[#E5E1DC] p-3 rounded-xl">
                <Camera className="w-8 h-8 text-[#3D3D3D]" />
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                formData.photoPackage === 'photos'
                  ? 'border-[#1A1816] bg-[#1A1816]'
                  : 'border-[#D0CCC7]'
              }`}>
                {formData.photoPackage === 'photos' && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <h4 className="text-xl font-medium text-[#111] mb-2">
              Photos Only
            </h4>
            <p className="text-sm text-[#666] mb-4">
              Real estate photos for listing sites
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm text-[#666]">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>30-40 professional photos</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#666]">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Next day delivery</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#666]">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Full coverage - Interior & Exterior</span>
              </li>
            </ul>
            {photoPrice && (
              <div className="text-2xl font-bold text-[#1A1816]">
                ${photoPrice}
              </div>
            )}
          </div>

          {/* Photos + Drone */}
          <div
            onClick={() => setFormData(prev => ({ ...prev, photoPackage: 'photosDrone' }))}
            className={`cursor-pointer border-2 rounded-2xl p-6 transition-all relative ${
              formData.photoPackage === 'photosDrone'
                ? 'border-[#1A1816] bg-[#1A1816]/5'
                : 'border-[#D0CCC7] hover:border-[#1A1816]/50'
            }`}
          >
            <div className="absolute -top-3 right-4 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full">
              RECOMMENDED
            </div>
            <div className="flex items-start justify-between mb-4">
              <div className="bg-[#E5E1DC] p-3 rounded-xl">
                <Plane className="w-8 h-8 text-[#3D3D3D]" />
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                formData.photoPackage === 'photosDrone'
                  ? 'border-[#1A1816] bg-[#1A1816]'
                  : 'border-[#D0CCC7]'
              }`}>
                {formData.photoPackage === 'photosDrone' && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <h4 className="text-xl font-medium text-[#111] mb-2">
              Photos + Drone
            </h4>
            <p className="text-sm text-[#666] mb-4">
              Drone photos included at no extra charge!
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm text-[#666]">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>30-40 professional photos</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#666]">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Aerial drone photography</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#666]">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Next day delivery</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#666]">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Full coverage - Interior & Exterior</span>
              </li>
            </ul>
            {photoPrice && (
              <div className="text-2xl font-bold text-[#1A1816]">
                ${photoPrice}
                <span className="text-sm font-normal text-[#666] ml-2">Same price!</span>
              </div>
            )}
          </div>
        </div>

        {errors.photoPackage && (
          <p className="text-red-500 text-sm text-center">{errors.photoPackage}</p>
        )}
      </div>
    );
  };

  // Step 3: Additional Media Products
  const Step3AdditionalMedia = () => {
    const zillow3DPrice = getPriceForSqft(PRICING.zillow3D, formData.sqft);
    const videoPrice = getPriceForSqft(PRICING.videoWalkthrough, formData.sqft);
    const matterportPrice = getPriceForSqft(PRICING.matterport, formData.sqft);
    const reelsPrice = getPriceForSqft(PRICING.reelsTikTok, formData.sqft);

    const mediaProducts = [
      {
        key: 'zillow3D',
        icon: Layers,
        title: 'Zillow 3D + Interactive Floor Plan',
        description: '360 Photo Tour with 2D Floor Plan',
        price: zillow3DPrice,
        features: ['360 degree photo tour', '2D floor plan included', 'Zillow-ready format'],
        sampleUrl: null
      },
      {
        key: 'videoWalkthrough',
        icon: Video,
        title: 'Video Walkthrough',
        description: 'Cinematic video tour of your property',
        price: videoPrice,
        features: ['Two-day turnaround', 'Full coverage - Interior & Exterior', 'Professional editing'],
        sampleUrl: null
      },
      {
        key: 'matterport',
        icon: Box,
        title: 'Matterport 3D Tour',
        description: 'Fully immersive 3D experience',
        price: matterportPrice,
        features: ['One-day turnaround', 'Dollhouse view', '1 year hosting included'],
        sampleUrl: null
      },
      {
        key: 'reelsTikTok',
        icon: Play,
        title: 'Reels/TikTok Video',
        description: 'Social media ready short-form video',
        price: reelsPrice,
        features: ['Two-day turnaround', 'Full coverage - Interior & Exterior', 'Social media optimized'],
        sampleUrl: null
      },
      {
        key: 'floorPlan',
        icon: FileText,
        title: 'Basic 2D Floor Plan',
        description: 'Professional property floor plan',
        price: PRICING.floorPlan,
        isFlat: true,
        features: ['Standard floor plan layout', 'Room dimensions included', 'Digital delivery'],
        sampleUrl: null
      },
      {
        key: 'virtualTwilight',
        icon: Sun,
        title: 'Virtual Twilight',
        description: 'Transform daytime photos into stunning twilight shots',
        price: PRICING.virtualTwilight,
        isPerPhoto: true,
        features: ['Per photo pricing', 'Professional editing', '24-hour turnaround'],
        sampleUrl: null
      },
    ];

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-medium text-[#111] mb-2">
            Add More Media Products
          </h3>
          <p className="text-[#666]">
            Professional real estate marketing sets your listing apart from the rest.
            These services are optional but highly recommended.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaProducts.map((product) => {
            const IconComponent = product.icon;
            const isSelected = formData.additionalMedia[product.key];

            return (
              <div
                key={product.key}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    additionalMedia: {
                      ...prev.additionalMedia,
                      [product.key]: !prev.additionalMedia[product.key]
                    }
                  }));
                }}
                className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                  isSelected
                    ? 'border-[#1A1816] bg-[#1A1816]/5'
                    : 'border-[#D0CCC7] hover:border-[#1A1816]/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-[#E5E1DC] p-2 rounded-lg">
                    <IconComponent className="w-5 h-5 text-[#3D3D3D]" />
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-[#1A1816] bg-[#1A1816]'
                      : 'border-[#D0CCC7]'
                  }`}>
                    {isSelected && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <h4 className="text-base font-medium text-[#111] mb-1">
                  {product.title}
                </h4>
                <p className="text-xs text-[#666] mb-3">
                  {product.description}
                </p>
                <ul className="space-y-1 mb-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-1 text-xs text-[#666]">
                      <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {product.sampleUrl && (
                  <a
                    href={product.sampleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-[#1A1816] underline mb-2 inline-block"
                  >
                    View Sample
                  </a>
                )}
                <div className="text-lg font-bold text-[#1A1816]">
                  ${product.price}
                  {product.isPerPhoto && <span className="text-xs font-normal text-[#666]">/photo</span>}
                  {product.isFlat && <span className="text-xs font-normal text-[#666]"> flat rate</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Virtual Twilight Count */}
        {formData.additionalMedia.virtualTwilight && (
          <div className="bg-[#EEEDEA] rounded-xl p-4">
            <label className="block text-sm font-medium text-[#111] mb-2">
              How many Virtual Twilight photos?
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  additionalMedia: {
                    ...prev.additionalMedia,
                    virtualTwilightCount: Math.max(1, prev.additionalMedia.virtualTwilightCount - 1)
                  }
                }))}
                className="w-10 h-10 rounded-full bg-white border border-[#D0CCC7] flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-xl font-medium w-12 text-center">
                {formData.additionalMedia.virtualTwilightCount}
              </span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  additionalMedia: {
                    ...prev.additionalMedia,
                    virtualTwilightCount: prev.additionalMedia.virtualTwilightCount + 1
                  }
                }))}
                className="w-10 h-10 rounded-full bg-white border border-[#D0CCC7] flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
              <span className="text-sm text-[#666]">
                = ${PRICING.virtualTwilight * formData.additionalMedia.virtualTwilightCount}
              </span>
            </div>
          </div>
        )}

        <p className="text-sm text-center text-[#666]">
          You can skip this step if you only want photos. These are optional add-ons.
        </p>
      </div>
    );
  };

  // Step 4: Scheduling & Contact
  const Step4MLSAndScheduling = () => (
    <div className="space-y-8">
      {/* Broker Assisted Section */}
      <div className="bg-gradient-to-r from-[#413936] to-[#5a4f4c] rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-medium mb-2">
              Broker-Assisted Program
            </h4>
            <p className="text-white/80 text-sm mb-4">
              Get professional broker assistance throughout the entire selling process for a fraction of the traditional commission.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>0.5% of final sales price or $2,000 minimum (paid at closing)</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Full broker support from listing to closing</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Only pay if your property successfully closes</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>If seller finds unrepresented buyer: 1% or $4,000 minimum</span>
              </li>
            </ul>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="brokerAssisted"
                checked={formData.brokerAssisted}
                onChange={handleInputChange}
                className="w-5 h-5 rounded border-white/30 bg-white/10 text-[#1A1816] focus:ring-[#1A1816]"
              />
              <span className="text-sm font-medium">
                Yes, I'm interested in Broker Assistance
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Scheduling Section */}
      <div>
        <h4 className="text-lg font-medium text-[#111] mb-4">
          Scheduling Preferences
        </h4>
        <p className="text-sm text-[#666] mb-4">
          The estimated photo session is 60-90 minutes. We'll contact you to confirm the exact appointment time.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#111] mb-2">
              When are you ready for photos?
            </label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-[#D0CCC7] rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all"
             
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111] mb-2">
              What time of day works best? *
            </label>
            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all ${
                errors.preferredTime ? 'border-red-500' : 'border-[#D0CCC7]'
              }`}
             
            >
              <option value="">Select preferred time</option>
              <option value="morning">Morning (8am - 12pm)</option>
              <option value="afternoon">Afternoon (12pm - 5pm)</option>
              <option value="flexible">Flexible - Any time works</option>
            </select>
            {errors.preferredTime && <p className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>}
          </div>
        </div>
      </div>

      {/* Account/Contact Section */}
      {!auth?.user && (
        <div>
          <h4 className="text-lg font-medium text-[#111] mb-4">
            Create Your Account
          </h4>
          <p className="text-sm text-[#666] mb-4">
            Create an account to manage your content, marketing, and listings easily.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#111] mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all ${
                  errors.firstName ? 'border-red-500' : 'border-[#D0CCC7]'
                }`}
               
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111] mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all ${
                  errors.lastName ? 'border-red-500' : 'border-[#D0CCC7]'
                }`}
               
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all ${
                  errors.email ? 'border-red-500' : 'border-[#D0CCC7]'
                }`}
               
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111] mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all ${
                  errors.phone ? 'border-red-500' : 'border-[#D0CCC7]'
                }`}
               
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111] mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all ${
                  errors.password ? 'border-red-500' : 'border-[#D0CCC7]'
                }`}
               
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111] mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1A1816]/20 focus:border-[#1A1816] transition-all ${
                  errors.confirmPassword ? 'border-red-500' : 'border-[#D0CCC7]'
                }`}
               
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>
      )}

      {auth?.user && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-green-800 font-medium">
                Logged in as {auth.user.name}
              </p>
              <p className="text-sm text-green-700">
                Your order will be linked to your existing account.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Order Summary Sidebar
  const OrderSummary = () => {
    const total = calculateTotal();
    const photoPrice = getPriceForSqft(PRICING.photosDrone, formData.sqft);

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
        <h4 className="text-lg font-medium text-[#111] mb-4 pb-4 border-b border-gray-200">
          Order Summary
        </h4>

        <div className="space-y-3 mb-6">
          {formData.photoPackage && photoPrice && (
            <div className="flex justify-between text-sm">
              <span className="text-[#666]">
                {formData.photoPackage === 'photosDrone' ? 'Photos + Drone' : 'Photos Only'}
              </span>
              <span className="font-medium">${photoPrice}</span>
            </div>
          )}

          {formData.additionalMedia.zillow3D && (
            <div className="flex justify-between text-sm">
              <span className="text-[#666]">Zillow 3D + Floor Plan</span>
              <span className="font-medium">${getPriceForSqft(PRICING.zillow3D, formData.sqft)}</span>
            </div>
          )}

          {formData.additionalMedia.videoWalkthrough && (
            <div className="flex justify-between text-sm">
              <span className="text-[#666]">Video Walkthrough</span>
              <span className="font-medium">${getPriceForSqft(PRICING.videoWalkthrough, formData.sqft)}</span>
            </div>
          )}

          {formData.additionalMedia.matterport && (
            <div className="flex justify-between text-sm">
              <span className="text-[#666]">Matterport 3D</span>
              <span className="font-medium">${getPriceForSqft(PRICING.matterport, formData.sqft)}</span>
            </div>
          )}

          {formData.additionalMedia.reelsTikTok && (
            <div className="flex justify-between text-sm">
              <span className="text-[#666]">Reels/TikTok Video</span>
              <span className="font-medium">${getPriceForSqft(PRICING.reelsTikTok, formData.sqft)}</span>
            </div>
          )}

          {formData.additionalMedia.floorPlan && (
            <div className="flex justify-between text-sm">
              <span className="text-[#666]">Floor Plan</span>
              <span className="font-medium">${PRICING.floorPlan}</span>
            </div>
          )}

          {formData.additionalMedia.virtualTwilight && (
            <div className="flex justify-between text-sm">
              <span className="text-[#666]">Virtual Twilight ({formData.additionalMedia.virtualTwilightCount})</span>
              <span className="font-medium">${PRICING.virtualTwilight * formData.additionalMedia.virtualTwilightCount}</span>
            </div>
          )}

          {formData.brokerAssisted && (
            <div className="flex justify-between text-sm">
              <span className="text-[#666]">Broker Assisted</span>
              <span className="font-medium text-[#1A1816]">At closing</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-[#111]">
              Total
            </span>
            <span className="text-2xl font-bold text-[#1A1816]">
              ${total}
            </span>
          </div>
          {formData.brokerAssisted && (
            <p className="text-xs text-[#666] mt-2">
              + Broker Assistance fee at closing
            </p>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs text-blue-800">
            <strong>No payment required today.</strong> We accept Venmo, CashApp, PayPal, Cash, or Check once photos are taken.
          </p>
        </div>
      </div>
    );
  };

  // Main Overview Content (Step 0)
  const OverviewContent = () => (
    <>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden h-[520px] md:h-[500px] lg:h-[600px]">
        <img src="https://images.pexels.com/photos/3761509/pexels-photo-3761509.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Professional real estate photography" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,15,30,0.75) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.65) 100%)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0" style={{ height: '200px', background: 'linear-gradient(transparent 0%, rgba(249,250,251,0.4) 50%, rgb(249,250,251) 100%)' }} />
        <div className="relative flex flex-col h-full">
          <div className="mx-auto flex flex-1 items-center px-4 sm:px-6 lg:px-[40px]" style={{ maxWidth: '1400px', width: '100%' }}>
            <div className="w-full max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5" style={{ border: '1px solid rgba(156,163,175,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: 'rgba(0,0,0,0.12) 0px 8px 32px' }}>
                <div className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: 'rgba(52,211,153,0.6) 0px 0px 8px' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.9)' }}>MEDIA PACKAGES</span>
              </div>
              <h1 className="text-[26px] leading-[34px] sm:text-[36px] sm:leading-[44px] lg:text-[46px] lg:leading-[56px] font-extrabold text-white" style={{ letterSpacing: '-0.5px' }}>
                Professional <span style={{ background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Multimedia</span> Marketing
              </h1>
              <p className="mt-5" style={{ fontSize: '17px', lineHeight: '28px', color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                Photos, drones, floor plans, 3D tours, and more. Everything you need to market your property like a pro.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <button onClick={goToOrderForm} className="inline-flex items-center justify-center gap-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: '#3355FF', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}>
                  Order Photos & Media <ArrowRight className="w-4 h-4" />
                </button>
                <Link href="/list-property" className="inline-flex items-center justify-center gap-2 rounded-full transition-colors" style={{ height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.25)', color: 'white', background: 'rgba(255,255,255,0.08)' }}>
                  Create Free Listing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section style={{ backgroundColor: 'rgb(249,250,251)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20" style={{ maxWidth: '1400px' }}>
          <div className="text-center mb-14">
            <div className="mb-4">
              <span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgb(100,100,100)' }}>OUR SERVICES</span>
            </div>
            <h2 className="mb-4 text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]" style={{ fontWeight: 700, color: 'rgb(26,24,22)' }}>
              Professional Real Estate Marketing
            </h2>
            <p style={{ fontSize: '15px', color: 'rgb(100,100,100)', maxWidth: '600px', margin: '0 auto', lineHeight: '24px' }}>
              Everything you need to market your property like a pro. If you'd expect professional marketing from a traditional agent — why not do the same? Sell by owner!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Photo Service Card */}
            <div
              onClick={() => setSelectedService(SERVICES_DATA.photosDrone)}
              className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group relative p-6" style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", boxShadow: "rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset" }}
            >
              <div className="mb-4 flex items-center justify-center rounded-2xl" style={{ width: "56px", height: "56px", backgroundColor: "rgb(245,245,244)" }}>
                <Camera className="w-6 h-6 text-[#3D3D3D] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-medium text-[#111] mb-2">
                Professional Photos + Drone
              </h3>
              <p className="text-sm text-[#666] mb-4">
                30-40 HDR photos including aerial drone shots. Next day delivery. Full use rights for all listing sites.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-[#1A1816]">
                  From $175
                </div>
                <span className="text-sm text-[#1A1816] group-hover:underline">
                  View Details →
                </span>
              </div>
            </div>

            {/* Zillow 3D Card */}
            <div
              onClick={() => setSelectedService(SERVICES_DATA.zillow3D)}
              className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group relative p-6" style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", boxShadow: "rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset" }}
            >
              <div className="mb-4 flex items-center justify-center rounded-2xl" style={{ width: "56px", height: "56px", backgroundColor: "rgb(245,245,244)" }}>
                <Layers className="w-6 h-6 text-[#3D3D3D] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-medium text-[#111] mb-2">
                Zillow 3D + Floor Plan
              </h3>
              <p className="text-sm text-[#666] mb-4">
                360 photo tour with interactive 2D floor plan. Perfect for Zillow listings.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-[#1A1816]">
                  From $135
                </div>
                <span className="text-sm text-[#1A1816] group-hover:underline">
                  View Details →
                </span>
              </div>
            </div>

            {/* Video Walkthrough Card */}
            <div
              onClick={() => setSelectedService(SERVICES_DATA.videoWalkthrough)}
              className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group relative p-6" style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", boxShadow: "rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset" }}
            >
              <div className="mb-4 flex items-center justify-center rounded-2xl" style={{ width: "56px", height: "56px", backgroundColor: "rgb(245,245,244)" }}>
                <Video className="w-6 h-6 text-[#3D3D3D] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-medium text-[#111] mb-2">
                Video Walkthrough
              </h3>
              <p className="text-sm text-[#666] mb-4">
                Cinematic video tour of your entire property. Two-day turnaround.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-[#1A1816]">
                  From $175
                </div>
                <span className="text-sm text-[#1A1816] group-hover:underline">
                  View Details →
                </span>
              </div>
            </div>

            {/* Matterport Card */}
            <div
              onClick={() => setSelectedService(SERVICES_DATA.matterport)}
              className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group relative p-6" style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", boxShadow: "rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset" }}
            >
              <div className="mb-4 flex items-center justify-center rounded-2xl" style={{ width: "56px", height: "56px", backgroundColor: "rgb(245,245,244)" }}>
                <Box className="w-6 h-6 text-[#3D3D3D] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-medium text-[#111] mb-2">
                Matterport 3D Tour
              </h3>
              <p className="text-sm text-[#666] mb-4">
                Fully immersive 3D experience with dollhouse view. 1 year hosting included.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-[#1A1816]">
                  From $300
                </div>
                <span className="text-sm text-[#1A1816] group-hover:underline">
                  View Details →
                </span>
              </div>
            </div>

            {/* Reels/TikTok Card */}
            <div
              onClick={() => setSelectedService(SERVICES_DATA.reelsTikTok)}
              className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group relative p-6" style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", boxShadow: "rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset" }}
            >
              <div className="mb-4 flex items-center justify-center rounded-2xl" style={{ width: "56px", height: "56px", backgroundColor: "rgb(245,245,244)" }}>
                <Play className="w-6 h-6 text-[#3D3D3D] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-medium text-[#111] mb-2">
                Reels/TikTok Video
              </h3>
              <p className="text-sm text-[#666] mb-4">
                Social media optimized short-form video. Perfect for Instagram and TikTok.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-[#1A1816]">
                  From $150
                </div>
                <span className="text-sm text-[#1A1816] group-hover:underline">
                  View Details →
                </span>
              </div>
            </div>

            {/* Virtual Twilight Card */}
            <div
              onClick={() => setSelectedService(SERVICES_DATA.virtualTwilight)}
              className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group relative p-6" style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", boxShadow: "rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset" }}
            >
              <div className="mb-4 flex items-center justify-center rounded-2xl" style={{ width: "56px", height: "56px", backgroundColor: "rgb(245,245,244)" }}>
                <Sun className="w-6 h-6 text-[#3D3D3D] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-medium text-[#111] mb-2">
                Virtual Twilight
              </h3>
              <p className="text-sm text-[#666] mb-4">
                Transform daytime photos into stunning twilight shots digitally.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-[#1A1816]">
                  $15/photo
                </div>
                <span className="text-sm text-[#1A1816] group-hover:underline">
                  View Details →
                </span>
              </div>
            </div>

            {/* Floor Plan Card */}
            <div
              onClick={() => setSelectedService(SERVICES_DATA.floorPlan)}
              className="rounded-2xl border border-gray-200/60 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group relative p-6" style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", boxShadow: "rgba(0,0,0,0.06) 0px 4px 24px, rgba(255,255,255,0.8) 0px 1px 0px inset" }}
            >
              <div className="mb-4 flex items-center justify-center rounded-2xl" style={{ width: "56px", height: "56px", backgroundColor: "rgb(245,245,244)" }}>
                <FileText className="w-6 h-6 text-[#3D3D3D] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-medium text-[#111] mb-2">
                2D Floor Plan
              </h3>
              <p className="text-sm text-[#666] mb-4">
                Professional property floor plan to help buyers visualize the space.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-[#1A1816]">
                  $40 flat
                </div>
                <span className="text-sm text-[#1A1816] group-hover:underline">
                  View Details →
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button
              onClick={goToOrderForm}
              className="inline-flex items-center gap-2 bg-[#3355FF] text-white rounded-full px-8 py-4 font-medium text-lg transition-all duration-300 hover:bg-[#1D4ED8] hover:shadow-lg"
             
            >
              <Camera className="w-5 h-5" />
              Start Your Order
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowHowItWorksModal(true)}
              className="inline-flex items-center gap-2 bg-white border-2 border-[#1A1816] text-[#1A1816] rounded-full px-6 py-4 font-medium text-lg transition-all duration-300 hover:bg-[#1A1816] hover:text-white hover:shadow-lg"
             
            >
              <HelpCircle className="w-5 h-5" />
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Broker Assisted Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#3355FF' }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent)', filter: 'blur(40px)' }} />
        <div className="mx-auto px-4 sm:px-6 lg:px-[40px] py-12 md:py-20 relative z-10" style={{ maxWidth: '1400px' }}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)' }}>BROKER ASSISTANCE</span>
              </div>
              <h2 className="text-[26px] leading-[34px] sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px] mb-6" style={{ fontWeight: 700, color: 'white' }}>
                Need Help?<br />Get Broker Assistance
              </h2>
              <p style={{ fontSize: '15px', lineHeight: '26px', color: 'rgba(255,255,255,0.65)', marginBottom: '32px' }}>
                Should you prefer to have Broker-Assistance available throughout the entire process to closing, upgrade to Broker-Assistance. Save thousands compared to traditional real estate commissions.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { text: <><strong style={{ color: 'white' }}>1.5% of the final sales price</strong> or a minimum of $2,500 (paid at closing)</> },
                  { text: <>If the seller finds an unrepresented buyer: <strong style={{ color: 'white' }}>3% or $5,000 minimum</strong> fee to handle both sides</> },
                  { text: <>Only collected if your property successfully closes</> },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(52,211,153)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p style={{ fontSize: '14px', lineHeight: '22px', color: 'rgba(255,255,255,0.75)' }}>{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-4 mb-8" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>All real estate services to be performed by M&T Realty Group, License #180717.</p>
              </div>

              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full transition-opacity hover:opacity-90" style={{ backgroundColor: 'white', color: 'rgb(26,24,22)', height: '46px', paddingLeft: '28px', paddingRight: '28px', fontSize: '14px', fontWeight: 600 }}>
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Savings Comparison Card */}
            <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '24px' }}>Compare Savings</h3>
              <div className="overflow-hidden rounded-xl">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div />
                  <div className="text-center py-2" style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>WITH AGENT</div>
                  <div className="text-center py-2" style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>NO AGENT</div>
                </div>
                <div className="grid grid-cols-3 gap-2 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Traditional Agent (6%)</div>
                  <div className="text-center" style={{ fontSize: '15px', fontWeight: 600, color: 'white' }}>$18,000</div>
                  <div className="text-center" style={{ fontSize: '15px', fontWeight: 600, color: 'white' }}>$18,000</div>
                </div>
                <div className="grid grid-cols-3 gap-2 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>M&T Broker Assisted</div>
                  <div className="text-center" style={{ fontSize: '15px', fontWeight: 600, color: 'rgb(52,211,153)' }}>$13,500</div>
                  <div className="text-center" style={{ fontSize: '15px', fontWeight: 600, color: 'rgb(52,211,153)' }}>$9,000</div>
                </div>
                <div className="grid grid-cols-3 gap-2 py-4 mt-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Your Savings</div>
                  <div className="text-center" style={{ fontSize: '22px', fontWeight: 800, color: 'rgb(52,211,153)' }}>$4,500</div>
                  <div className="text-center" style={{ fontSize: '22px', fontWeight: 800, color: 'rgb(52,211,153)' }}>$9,000</div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '16px' }}>*Based on a $300,000 home sale price, and 3% going to the buyer's agent.</p>
            </div>
          </div>
        </div>
      </section>

    </>
  );

  return (
    <>
      <SEOHead
        title="Packages & Pricing"
        description="Professional real estate photography, virtual tours, drone photography, and more. Affordable packages to help sell your FSBO home faster."
        keywords="real estate photography, virtual tour, drone photography, home selling packages, FSBO services, professional home photos"
      />

      {/* Service Area Modal */}
      {showServiceAreaModal && <ServiceAreaModal />}

      {/* Quote Modal */}
      {showQuoteModal && <QuoteModal />}

      {/* Service Detail Modal */}
      {selectedService && <ServiceDetailModal />}

      {/* How It Works Modal */}
      {showHowItWorksModal && <HowItWorksModal />}

      {currentStep === 0 ? (
        <OverviewContent />
      ) : (
        /* Multi-Step Form */
        <div className="pt-[77px] min-h-screen bg-[#F8F7F5]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[40px] py-8">
            {/* Back Button */}
            <button
              onClick={() => currentStep === 1 ? goToOverview() : prevStep()}
              className="inline-flex items-center gap-2 text-[#666] hover:text-[#111] mb-6 transition-colors"
             
            >
              <ArrowLeft className="w-5 h-5" />
              {currentStep === 1 ? 'Back to Packages' : 'Previous Step'}
            </button>

            {/* Step Indicator */}
            <StepIndicator />

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form Area */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                  <form onSubmit={handleSubmit}>
                    {currentStep === 1 && <Step1PropertyDetails />}
                    {currentStep === 2 && <Step2PhotoSelection />}
                    {currentStep === 3 && <Step3AdditionalMedia />}
                    {currentStep === 4 && <Step4MLSAndScheduling />}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                          currentStep === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-[#666] hover:text-[#111] hover:bg-gray-100'
                        }`}
                        disabled={currentStep === 1}
                       
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                      </button>

                      {currentStep < 4 ? (
                        // On step 1, only show Continue if user is logged in, has listings, and selected one
                        currentStep === 1 && (!auth?.user || userListings.length === 0 || !selectedListing) ? null : (
                          <button
                            type="button"
                            onClick={nextStep}
                            className="inline-flex items-center gap-2 bg-[#3355FF] text-white rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-[#1D4ED8]"
                           
                          >
                            {currentStep === 3 ? 'Continue to Scheduling' : 'Continue'}
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        )
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-2 bg-[#3355FF] text-white rounded-full px-8 py-3 font-medium transition-all duration-300 hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed"
                         
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Order Request'}
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <OrderSummary />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Specify MainLayout for this page
Packages.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Packages;

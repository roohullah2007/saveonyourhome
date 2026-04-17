import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Menu, X, User, Settings, LogOut, LayoutDashboard, ChevronDown, Shield } from 'lucide-react';
import AuthModal from '@/Components/AuthModal';

const Header = ({ maxWidth, noPadding }) => {
  const { auth } = usePage().props;
  const user = auth?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sellDropdownOpen, setSellDropdownOpen] = useState(false);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);
  const [mobileSellOpen, setMobileSellOpen] = useState(false);
  const [mobileBuyOpen, setMobileBuyOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [fsboToolsDropdownOpen, setFsboToolsDropdownOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [mobileFsboToolsOpen, setMobileFsboToolsOpen] = useState(false);
  const sellDropdownRef = useRef(null);
  const buyDropdownRef = useRef(null);
  const resourcesDropdownRef = useRef(null);
  const fsboToolsDropdownRef = useRef(null);

  const handleListProperty = (e) => {
    e.preventDefault();
    if (user) {
      router.visit('/list-property');
    } else {
      setMobileMenuOpen(false);
      setShowAuthModal(true);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sellDropdownRef.current && !sellDropdownRef.current.contains(e.target)) {
        setSellDropdownOpen(false);
      }
      if (buyDropdownRef.current && !buyDropdownRef.current.contains(e.target)) {
        setBuyDropdownOpen(false);
      }
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(e.target)) {
        setResourcesDropdownOpen(false);
      }
      if (fsboToolsDropdownRef.current && !fsboToolsDropdownRef.current.contains(e.target)) {
        setFsboToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buyDropdownItems = [
    { label: 'Search Homes', href: '/properties' },
    { label: 'Buyer FAQs', href: '/buyer-faqs' },
    { label: 'Get Pre-Approved', href: '/get-pre-approved' },
    { label: 'Buyers Guide', href: '/buyers-guide' },
  ];

  const fsboToolsDropdownItems = [
    { label: 'Claim Your Free FSBO Sign!', href: '/claim-your-free-fsbo-sign' },
    { label: 'Request Free FSBO Guide', href: '/request-free-fsbo-guide' },
    { label: 'Join the FSBO Weekly Call', href: '/join-the-fsbo-weekly-call' },
  ];

  const resourcesDropdownItems = [
    { label: 'Seller Resources', href: '/seller-resources' },
    { label: 'Buyer Resources', href: '/buyer-resources' },
    { label: 'Advertiser & Sponsor Honor Pledge', href: '/honor-pledge' },
    { label: 'Blog', href: '/blog' },
    { label: 'E-Book', href: '/ebook' },
  ];

  const sellDropdownItems = [
    { label: 'Sell Your Home', href: '/sell-your-home' },
    { label: 'What Is My Home Worth?', href: '/home-worth' },
    { label: 'Seller FAQs', href: '/seller-faqs' },
    { label: 'FSBO Sellers Guide', href: '/fsbo-guide' },
    { label: 'Get Information On 360 Virtual Tour', href: '/virtual-tours' },
  ];

  return (
    <>
      <header className="relative z-50">
        {/* Blue Top Bar (fixed) */}
        <div className="w-full bg-[#3355FF]" style={{ height: '36px' }}>
          <div className={`mx-auto h-full flex items-center justify-center px-4`} style={{ maxWidth: maxWidth || 1400 }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'white', letterSpacing: '0.3px' }}>
              Empowering Sellers, Connecting Buyers
            </span>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-300 h-[65px]">
          <div className={`mx-auto h-full ${noPadding ? 'px-4' : 'px-4 sm:px-6 lg:px-[40px]'}`} style={{ maxWidth: maxWidth || 1400 }}>
            <div className="flex items-center justify-between h-full">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <img
                  src="/images/saveonyourhome-logo.png"
                  alt="SaveOnYourHome"
                  className="h-[46px] sm:h-[54px] lg:h-[60px] w-auto"
                />
              </Link>

              {/* Center Navigation - Desktop */}
              <nav className="hidden lg:flex items-center gap-8">
                <Link href="/" className="text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group">
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1A1816] group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/properties" className="text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group">
                  Properties
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1A1816] group-hover:w-full transition-all duration-300"></span>
                </Link>
                {/* Buy Dropdown */}
                <div className="relative" ref={buyDropdownRef}>
                  <button
                    onClick={() => setBuyDropdownOpen(!buyDropdownOpen)}
                    className="flex items-center gap-1 text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group"
                  >
                    Buy
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${buyDropdownOpen ? 'rotate-180' : ''}`} />
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1A1816] group-hover:w-full transition-all duration-300"></span>
                  </button>

                  {buyDropdownOpen && (
                    <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-2">
                      {buyDropdownItems.map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          className="block px-5 py-3 text-[15px] text-gray-800 hover:bg-gray-50 transition-colors"
                          onClick={() => setBuyDropdownOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sell Dropdown */}
                <div className="relative" ref={sellDropdownRef}>
                  <button
                    onClick={() => setSellDropdownOpen(!sellDropdownOpen)}
                    className="flex items-center gap-1 text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group"
                  >
                    Sell
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${sellDropdownOpen ? 'rotate-180' : ''}`} />
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1A1816] group-hover:w-full transition-all duration-300"></span>
                  </button>

                  {sellDropdownOpen && (
                    <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-2">
                      {sellDropdownItems.map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          className="block px-5 py-3 text-[15px] text-gray-800 hover:bg-gray-50 transition-colors"
                          onClick={() => setSellDropdownOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Free FSBO Tools Dropdown */}
                <div className="relative" ref={fsboToolsDropdownRef}>
                  <button
                    onClick={() => setFsboToolsDropdownOpen(!fsboToolsDropdownOpen)}
                    className="flex items-center gap-1 text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group"
                  >
                    Free FSBO Tools
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${fsboToolsDropdownOpen ? 'rotate-180' : ''}`} />
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1A1816] group-hover:w-full transition-all duration-300"></span>
                  </button>
                  {fsboToolsDropdownOpen && (
                    <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-2">
                      {fsboToolsDropdownItems.map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          className="block px-5 py-3 text-[15px] text-gray-800 hover:bg-gray-50 transition-colors"
                          onClick={() => setFsboToolsDropdownOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resources Dropdown */}
                <div className="relative" ref={resourcesDropdownRef}>
                  <button
                    onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                    className="flex items-center gap-1 text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group"
                  >
                    Resources
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1A1816] group-hover:w-full transition-all duration-300"></span>
                  </button>

                  {resourcesDropdownOpen && (
                    <div className="absolute top-full left-0 mt-3 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-2">
                      {resourcesDropdownItems.map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          className="block px-5 py-3 text-[15px] text-gray-800 hover:bg-gray-50 transition-colors"
                          onClick={() => setResourcesDropdownOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link href="/partners" className="text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group">
                  Partners
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1A1816] group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/about" className="text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group">
                  About
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1A1816] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </nav>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                {user ? (
                  /* Logged In - Profile Dropdown */
                  <div className="relative">
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-9 h-9 bg-[#1A1816] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-500 hidden md:block transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {profileMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setProfileMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-2">
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#1A1816] rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              </div>
                            </div>
                            {user.role === 'admin' && (
                              <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-[#1A1816]/10 text-[#1A1816] text-xs font-medium rounded-full">
                                <Shield className="w-3 h-3" />
                                Admin
                              </span>
                            )}
                          </div>

                          {/* Menu Items */}
                          <div className="py-1">
                            <Link
                              href={route('dashboard')}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <LayoutDashboard className="w-4 h-4 text-gray-400" />
                              Dashboard
                            </Link>
                            <Link
                              href={route('profile.edit')}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <User className="w-4 h-4 text-gray-400" />
                              Profile Settings
                            </Link>
                            {user.role === 'admin' && (
                              <Link
                                href={route('admin.dashboard')}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1816] hover:bg-red-50 transition-colors"
                                onClick={() => setProfileMenuOpen(false)}
                              >
                                <Shield className="w-4 h-4" />
                                Admin Panel
                              </Link>
                            )}
                          </div>

                          {/* Logout */}
                          <div className="border-t border-gray-100 pt-1">
                            <Link
                              href={route('logout')}
                              method="post"
                              as="button"
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <LogOut className="w-4 h-4 text-gray-400" />
                              Sign Out
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  /* Not Logged In - Login Button */
                  <Link
                    href="/login"
                    className="hidden md:block text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors"
                  >
                    Login
                  </Link>
                )}

                <button
                  onClick={handleListProperty}
                  className="hidden sm:flex items-center justify-center gap-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
                  style={{ height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600, backgroundColor: '#1A1816' }}
                >
                  <span className="hidden md:inline">List Your Property</span>
                  <span className="md:hidden">List</span>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_56_2205" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                      <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_56_2205)">
                      <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                    </g>
                  </svg>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 text-[#111111] hover:text-[#555] transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Menu Panel */}
          <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 shadow-xl max-h-screen overflow-y-auto">
            <nav className="max-w-[1400px] mx-auto px-4 py-6 space-y-4">
              <Link
                href="/"
                className="block text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/properties"
                className="block text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Properties
              </Link>
              {/* Mobile Buy Dropdown */}
              <div>
                <button
                  onClick={() => setMobileBuyOpen(!mobileBuyOpen)}
                  className="flex items-center justify-between w-full text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                >
                  Buy
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileBuyOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileBuyOpen && (
                  <div className="pl-4 space-y-1 mt-1">
                    {buyDropdownItems.map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        className="block text-[15px] text-gray-600 hover:text-[#111] transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Sell Dropdown */}
              <div>
                <button
                  onClick={() => setMobileSellOpen(!mobileSellOpen)}
                  className="flex items-center justify-between w-full text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                >
                  Sell
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSellOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileSellOpen && (
                  <div className="pl-4 space-y-1 mt-1">
                    {sellDropdownItems.map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        className="block text-[15px] text-gray-600 hover:text-[#111] transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Free FSBO Tools Dropdown */}
              <div>
                <button
                  onClick={() => setMobileFsboToolsOpen(!mobileFsboToolsOpen)}
                  className="flex items-center justify-between w-full text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                >
                  Free FSBO Tools
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileFsboToolsOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileFsboToolsOpen && (
                  <div className="pl-4 space-y-1 mt-1">
                    {fsboToolsDropdownItems.map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        className="block text-[15px] text-gray-600 hover:text-[#111] transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Resources Dropdown */}
              <div>
                <button
                  onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                  className="flex items-center justify-between w-full text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                >
                  Resources
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileResourcesOpen && (
                  <div className="pl-4 space-y-1 mt-1">
                    {resourcesDropdownItems.map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        className="block text-[15px] text-gray-600 hover:text-[#111] transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/partners"
                className="block text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Partners
              </Link>
              <Link
                href="/about"
                className="block text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    {/* Logged in mobile user */}
                    <div className="flex items-center gap-3 py-3">
                      <div className="w-10 h-10 bg-[#1A1816] rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href={route('dashboard')}
                      className="flex items-center gap-3 text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link
                      href={route('profile.edit')}
                      className="flex items-center gap-3 text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Profile Settings
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href={route('admin.dashboard')}
                        className="flex items-center gap-3 text-[16px] font-semibold text-[#1A1816] hover:text-[#111111] transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      href={route('logout')}
                      method="post"
                      as="button"
                      className="flex items-center gap-3 text-[16px] font-semibold text-gray-600 hover:text-red-600 transition-colors py-2 w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                <button
                  onClick={handleListProperty}
                  className="block sm:hidden mt-2 w-full text-center rounded-full text-white transition-all duration-300 hover:opacity-90"
                  style={{ height: '46px', paddingLeft: '26px', paddingRight: '26px', fontSize: '14px', fontWeight: 600, backgroundColor: '#1A1816' }}
                >
                  List Your Property
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Header;

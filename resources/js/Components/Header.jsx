import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, User, Settings, LogOut, LayoutDashboard, ChevronDown, Shield } from 'lucide-react';

const Header = ({ maxWidth, noPadding }) => {
  const { auth } = usePage().props;
  const user = auth?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-300 h-[65px]">
        <div className={`mx-auto h-full ${noPadding ? 'px-4' : 'px-4 sm:px-6 lg:px-[40px]'}`} style={{ maxWidth: maxWidth || 1400 }}>
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/images/saveonyourhome-logo.png"
                alt="SaveOnYourHome"
                style={{ height: '52px', width: 'auto' }}
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
              <Link href="/buyers" className="text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group">
                Buyers
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1A1816] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/sellers" className="text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group">
                Sellers
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1A1816] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/our-packages" className="text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group">
                Packages
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1A1816] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/mortgages" className="text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group">
                Mortgage
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1A1816] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/about" className="text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1A1816] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/contact" className="text-[14px] font-semibold text-[#111111] hover:text-[#555] transition-colors relative group">
                Contact
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

              <Link
                href="/list-property"
                className="hidden sm:flex items-center justify-start gap-1.5 bg-[#000000] text-gray-100 rounded-full py-2.5 px-6 lg:px-8 font-medium text-sm leading-[120%] transition-[background-color] duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#111111]"
              >
                <span className="hidden md:inline">List Your Property</span>
                <span className="md:hidden">List</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_56_2205" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                    <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_56_2205)">
                    <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                  </g>
                </svg>
              </Link>

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
          <div className="fixed top-[65px] left-0 right-0 bg-white border-b border-gray-300 shadow-xl max-h-[calc(100vh-65px)] overflow-y-auto">
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
              <Link
                href="/buyers"
                className="block text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Buyers
              </Link>
              <Link
                href="/sellers"
                className="block text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sellers
              </Link>
              <Link
                href="/our-packages"
                className="block text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Packages
              </Link>
              <Link
                href="/mortgages"
                className="block text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mortgage
              </Link>
              <Link
                href="/about"
                className="block text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block text-[16px] font-semibold text-[#111111] hover:text-[#555] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
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
                <Link
                  href="/list-property"
                  className="block sm:hidden mt-2 text-center bg-[#1A1816] text-white rounded-full py-3 px-6 font-medium transition-all duration-300 hover:bg-[#111111]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  List Your Property
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
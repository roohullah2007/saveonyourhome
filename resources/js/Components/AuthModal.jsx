import React from 'react';
import { Link } from '@inertiajs/react';
import { X, Heart, User, UserPlus } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-[#111]" />
        </button>

        {/* Modal Content */}
        <div className="p-8 pt-14">
          {/* Icon */}
          <div className="w-16 h-16 bg-[#1A1816]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-[#1A1816]" />
          </div>

          {/* Title */}
          <h2
            className="text-[24px] font-semibold text-[#111] text-center mb-3"
           
          >
            Save Your Favorites
          </h2>

          {/* Description */}
          <p
            className="text-[14px] text-[#666] text-center mb-8 leading-relaxed"
           
          >
            Create an account or sign in to save your favorite properties and access them from any device.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 bg-[#3355FF] text-white rounded-full px-6 py-3.5 font-medium transition-all duration-300 hover:bg-[#1D4ED8]"
             
            >
              <User className="w-5 h-5" />
              Sign In
            </Link>

            <Link
              href="/register"
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#1A1816] text-[#1A1816] rounded-full px-6 py-3.5 font-medium transition-all duration-300 hover:bg-[#1A1816]/5"
             
            >
              <UserPlus className="w-5 h-5" />
              Create Account
            </Link>
          </div>

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p
              className="text-[12px] text-[#666] text-center mb-4"
             
            >
              Why create an account?
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-[13px] text-[#666]">
                <div className="w-1.5 h-1.5 bg-[#1A1816] rounded-full"></div>
                Save properties to your favorites
              </li>
              <li className="flex items-center gap-2 text-[13px] text-[#666]">
                <div className="w-1.5 h-1.5 bg-[#1A1816] rounded-full"></div>
                Get notified about new listings
              </li>
              <li className="flex items-center gap-2 text-[13px] text-[#666]">
                <div className="w-1.5 h-1.5 bg-[#1A1816] rounded-full"></div>
                Access favorites from any device
              </li>
              <li className="flex items-center gap-2 text-[13px] text-[#666]">
                <div className="w-1.5 h-1.5 bg-[#1A1816] rounded-full"></div>
                List your own property for free
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const HOMEBOT_SCRIPT_SRC = 'https://embed.homebotapp.com/lgw/v1/widget.js';
const HOMEBOT_ACCOUNT_ID = 'a508f8e866719096643708d4c7e9877465d7eb7250768ae5';

// Injects the Homebot loader exactly once. Subsequent calls reuse the existing script tag.
function ensureHomebotLoader() {
  if (typeof window === 'undefined') return;
  if (window.Homebot) return;

  // The loader pattern Homebot provides: stub the global and queue calls until the real script loads.
  window.__hb_namespace = 'Homebot';
  window.Homebot = window.Homebot || function () {
    (window.Homebot.q = window.Homebot.q || []).push(arguments);
  };

  if (document.querySelector(`script[src="${HOMEBOT_SCRIPT_SRC}"]`)) return;

  const s = document.createElement('script');
  s.async = true;
  s.src = HOMEBOT_SCRIPT_SRC;
  const first = document.getElementsByTagName('script')[0];
  first?.parentNode?.insertBefore(s, first);
}

export default function HomeValuationModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    ensureHomebotLoader();
    // Re-invoke after the target div has mounted so the widget attaches each time the modal opens.
    const id = requestAnimationFrame(() => {
      if (window.Homebot) {
        try { window.Homebot('#homebot_homeowner', HOMEBOT_ACCOUNT_ID); } catch (_) {}
      }
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Home Valuation Tool"
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-[#111]">Home Valuation Tool</h2>
            <p className="text-sm text-[#666]">Get an instant estimate of your home's value.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50">
          <div id="homebot_homeowner" className="min-h-[500px]" />
        </div>
      </div>
    </div>
  );
}

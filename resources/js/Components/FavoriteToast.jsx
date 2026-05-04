import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Heart } from 'lucide-react';

/**
 * Small, opinionated toast that renders in response to favorite events
 * fired anywhere in the app:
 *
 *   window.dispatchEvent(new CustomEvent('soyh:favorite-toast', {
 *       detail: { kind: 'added' | 'removed', title: 'Listing title' }
 *   }))
 *
 * Drop one <FavoriteToast /> into a top-level layout so cards on every
 * page share a single toast surface (avoids multiple stacked toasts).
 */
export default function FavoriteToast() {
    const [toast, setToast] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        const onToast = (e) => {
            const detail = e?.detail || {};
            if (timerRef.current) clearTimeout(timerRef.current);
            setToast({ kind: detail.kind || 'added', title: detail.title || 'Listing' });
            timerRef.current = setTimeout(() => setToast(null), 2500);
        };
        window.addEventListener('soyh:favorite-toast', onToast);
        return () => {
            window.removeEventListener('soyh:favorite-toast', onToast);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    if (!toast) return null;
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="fixed z-[80] bottom-6 left-1/2 -translate-x-1/2 max-w-md w-[calc(100vw-2rem)] sm:w-auto pointer-events-none"
            role="status"
            aria-live="polite"
        >
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#0F172A] text-white shadow-2xl">
                <Heart
                    className={`w-5 h-5 flex-shrink-0 ${toast.kind === 'added' ? 'fill-red-500 text-red-500' : 'text-white/80'}`}
                />
                <div className="text-sm leading-snug">
                    <p className="font-semibold">
                        {toast.kind === 'added' ? 'Saved to favorites' : 'Removed from favorites'}
                    </p>
                    <p className="text-white/70 line-clamp-1">{toast.title}</p>
                </div>
            </div>
        </div>,
        document.body
    );
}

export function emitFavoriteToast(kind, title) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('soyh:favorite-toast', { detail: { kind, title } }));
}

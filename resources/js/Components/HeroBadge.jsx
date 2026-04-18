import React from 'react';

/**
 * Hero pill badge — canonical site-wide style.
 * Matches the original homepage hero spec:
 *   padding 7px 16px, 11px / 600 / tracking 1.2px / white/90,
 *   7px emerald dot with green glow, translucent bg + blur.
 *
 * Props:
 *   children – the label text (usually uppercase, e.g. "PARTNERS").
 *   className – optional extra classes (e.g. "mb-6") for margin/positioning.
 */
export default function HeroBadge({ children, className = 'mb-6' }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full ${className}`}
      style={{
        border: '1px solid rgba(156, 163, 175, 0.25)',
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 8px 32px',
        padding: '7px 16px',
      }}
    >
      <div
        className="rounded-full bg-emerald-400"
        style={{ height: '7px', width: '7px', boxShadow: 'rgba(52, 211, 153, 0.6) 0px 0px 7px' }}
      />
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '1.2px',
          color: 'rgba(255, 255, 255, 0.9)',
          textTransform: 'uppercase',
        }}
      >
        {children}
      </span>
    </div>
  );
}

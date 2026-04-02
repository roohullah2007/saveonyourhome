import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * LogoImage - Shows image with text fallback on error
 */
const LogoImage = ({ logo }) => {
    const [imgError, setImgError] = useState(false);

    if (logo.image_path && !imgError) {
        return (
            <img
                src={logo.image_path}
                alt={logo.name}
                className="h-10 w-auto object-contain"
                onError={() => setImgError(true)}
            />
        );
    }

    if (logo.text_logo || imgError) {
        return (
            <span
                className={`font-bold tracking-tight ${logo.text_size || 'text-lg'}`}
                style={{ color: (imgError ? logo.hover_color : logo.text_color) || '#333', fontFamily: 'system-ui' }}
            >
                {logo.text_logo || logo.name}
            </span>
        );
    }

    return <span className="text-gray-500 font-medium">{logo.name}</span>;
};

/**
 * CompanyLogosGrid - Reusable component to display company logos from the database
 *
 * Props:
 * - variant: "cards" (image logos in bordered cards) or "text" (name-only text display)
 * - className: Additional CSS classes for the container
 */
const CompanyLogosGrid = ({ variant = 'cards', className = '' }) => {
    const { companyLogos = [] } = usePage().props;

    if (!companyLogos || companyLogos.length === 0) return null;

    if (variant === 'text') {
        return (
            <div className={`grid grid-cols-3 gap-4 ${className}`}>
                {companyLogos.map((logo) => (
                    <div
                        key={logo.id}
                        className="bg-[#F8F7F5] rounded-xl p-4 flex items-center justify-center h-[70px] hover:bg-[#EEEDEA] transition-all duration-300"
                    >
                        <span
                            className="text-[#333] text-[14px] font-semibold"
                           
                        >
                            {logo.name}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    // Default: "cards" variant with images
    return (
        <div className={`grid grid-cols-3 gap-3 ${className}`}>
            {companyLogos.map((logo) => (
                <div
                    key={logo.id}
                    className="bg-white border border-[#E5E1DC] rounded-xl p-4 text-center hover:shadow-md transition-all"
                    style={{ ['--hover-border']: logo.hover_color || '#E5E1DC' }}
                    onMouseEnter={(e) => {
                        if (logo.hover_color) e.currentTarget.style.borderColor = logo.hover_color;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E5E1DC';
                    }}
                >
                    <div className="h-12 flex items-center justify-center">
                        <LogoImage logo={logo} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CompanyLogosGrid;

import React from 'react';

/**
 * Modern Javanese Elegance — Vector Batik Ornaments
 * Pure inline SVG vector patterns with configurable opacity and placement.
 * Guaranteed non-intrusive (pointer-events-none, aria-hidden="true").
 */

interface BatikProps {
  className?: string;
  opacity?: number;
  color?: string;
}

/**
 * Batik Parang Rusak — Symbol of resilience, continuous flow, and entrepreneurial progress.
 */
export const BatikParang: React.FC<BatikProps> = ({
  className = '',
  opacity = 0.08,
  color = '#8C5835',
}) => {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <pattern
        id="batik-parang-pattern"
        width="60"
        height="80"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(-25)"
      >
        {/* Parang diagonal main blade */}
        <path
          d="M10 0 C25 20, 35 40, 50 80 M20 0 C35 20, 45 40, 60 80"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Mlinjon (diamond accents) */}
        <polygon points="30,20 35,28 30,36 25,28" fill={color} />
        <polygon points="45,55 50,63 45,71 40,63" fill={color} />
        {/* Isen-isen (feathering lines) */}
        <line x1="18" y1="12" x2="26" y2="16" stroke={color} strokeWidth="1" />
        <line x1="22" y1="24" x2="30" y2="28" stroke={color} strokeWidth="1" />
        <line x1="33" y1="48" x2="41" y2="52" stroke={color} strokeWidth="1" />
        <line x1="37" y1="60" x2="45" y2="64" stroke={color} strokeWidth="1" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#batik-parang-pattern)" />
    </svg>
  );
};

/**
 * Batik Kawung — Symbol of integrity, self-control, and universal balance.
 */
export const BatikKawung: React.FC<BatikProps> = ({
  className = '',
  opacity = 0.08,
  color = '#8C5835',
}) => {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <pattern
        id="batik-kawung-pattern"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        {/* Central cross/grid */}
        <line x1="20" y1="0" x2="20" y2="40" stroke={color} strokeWidth="0.75" />
        <line x1="0" y1="20" x2="40" y2="20" stroke={color} strokeWidth="0.75" />

        {/* 4 Elliptical Petals intersecting at center */}
        <ellipse cx="20" cy="10" rx="6" ry="9" stroke={color} strokeWidth="1.2" fill="none" />
        <ellipse cx="20" cy="30" rx="6" ry="9" stroke={color} strokeWidth="1.2" fill="none" />
        <ellipse cx="10" cy="20" rx="9" ry="6" stroke={color} strokeWidth="1.2" fill="none" />
        <ellipse cx="30" cy="20" rx="9" ry="6" stroke={color} strokeWidth="1.2" fill="none" />

        {/* Inner kernels / seeds */}
        <circle cx="20" cy="10" r="1.5" fill={color} />
        <circle cx="20" cy="30" r="1.5" fill={color} />
        <circle cx="10" cy="20" r="1.5" fill={color} />
        <circle cx="30" cy="20" r="1.5" fill={color} />
        <circle cx="20" cy="20" r="2.2" stroke={color} strokeWidth="1" fill="none" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#batik-kawung-pattern)" />
    </svg>
  );
};

/**
 * BatikFlank — Vertical ornamental flanking strip for edges of hero or major sections
 */
export const BatikFlank: React.FC<{
  position?: 'left' | 'right';
  className?: string;
  opacity?: number;
}> = ({ position = 'left', className = '', opacity = 0.07 }) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute top-0 bottom-0 pointer-events-none select-none z-0 hidden lg:block overflow-hidden w-24 xl:w-36 ${
        position === 'left' ? 'left-0' : 'right-0'
      } ${className}`}
    >
      <div
        className={`w-full h-full ${
          position === 'left'
            ? 'bg-gradient-to-r from-transparent via-[#C5A059]/10 to-transparent'
            : 'bg-gradient-to-l from-transparent via-[#C5A059]/10 to-transparent'
        }`}
      >
        <BatikParang
          opacity={opacity}
          color="#8C5835"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

/**
 * BatikDivider — Section divider featuring subtle hairline rules and a central Kawung seal
 */
export const BatikDivider: React.FC<{
  className?: string;
  badge?: string;
}> = ({ className = '', badge }) => {
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center my-10 sm:my-14 pointer-events-none select-none ${className}`}
    >
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-800/20 to-amber-800/40" />
      <div className="mx-4 sm:mx-6 flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-amber-900/15 shadow-2xs">
        {/* Mini Kawung Emblem */}
        <svg
          className="w-4 h-4 text-[#8C5835]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <ellipse cx="12" cy="7" rx="3" ry="4.5" />
          <ellipse cx="12" cy="17" rx="3" ry="4.5" />
          <ellipse cx="7" cy="12" rx="4.5" ry="3" />
          <ellipse cx="17" cy="12" rx="4.5" ry="3" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
        {badge && (
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#8C5835]">
            {badge}
          </span>
        )}
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-800/20 to-amber-800/40" />
    </div>
  );
};

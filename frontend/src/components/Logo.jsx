import React from 'react';

/**
 * RiskMatrix Brand Logo Component
 * Encapsulates the provided SVG brand identity.
 */
export const Logo = ({ className = "", height = "40", showText = true }) => {
  return (
    <svg 
      width={showText ? undefined : "60"} 
      height={height} 
      viewBox={showText ? "0 0 240 80" : "0 0 80 80"} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ height: `${height}px`, width: showText ? 'auto' : `${height}px` }}
    >
      <defs>
        <clipPath id="rm-logo-clip">
          <rect width="60" height="60" x="10" y="10" rx="14"/>
        </clipPath>
      </defs>
      
      {/* Icon Background */}
      <rect x="10" y="10" width="60" height="60" rx="14" fill="#100c22"/>
      
      {/* Geometric Icon Paths */}
      <g clipPath="url(#rm-logo-clip)">
        <path d="M24,33 L31,40 L24,47 L17,40 Z" fill="#1e1940"/>
        <path d="M32,25 L39,32 L32,39 L25,32 Z" fill="#2E2660"/>
        <path d="M32,41 L39,48 L32,55 L25,48 Z" fill="#2E2660"/>
        <path d="M40,17 L47,24 L40,31 L33,24 Z" fill="#534AB7"/>
        <path d="M40,49 L47,56 L40,63 L33,56 Z" fill="#3C3489"/>
        <path d="M40,33 L47,40 L40,47 L33,40 Z" fill="#7F77DD"/>
        <path d="M48,25 L55,32 L48,39 L41,32 Z" fill="#AFA9EC"/>
        <path d="M48,41 L55,48 L48,55 L41,48 Z" fill="#CECBF6"/>
        <path d="M56,33 L63,40 L56,47 L49,40 Z" fill="#FFFFFF"/>
      </g>
      
      {/* Brand Text */}
      {showText && (
        <>
          <text x="82" y="38" fontFamily="Arial,sans-serif" fontSize="24" fontWeight="700" fill="#100c22" letterSpacing="-1">Risk</text>
          <text x="82" y="62" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="300" fill="#534AB7" letterSpacing="4">Matrix</text>
        </>
      )}
    </svg>
  );
};

export default Logo;

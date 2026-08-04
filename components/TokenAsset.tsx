'use client';

import React from 'react';

interface TokenAssetProps {
  type: 'base' | 'extra';
  themeId: string;
  className?: string;
}

export const TokenAsset: React.FC<TokenAssetProps> = ({ type, themeId, className = '' }) => {
  if (themeId === 'sports') {
    return type === 'base' ? (
      <div className={`w-full h-full flex items-center justify-center text-3xl filter drop-shadow-md ${className}`}>
        🏆
      </div>
    ) : (
      <div className={`w-full h-full flex items-center justify-center text-3xl filter drop-shadow-md ${className}`}>
        🏀
      </div>
    );
  }

  if (themeId === 'legos') {
    return type === 'base' ? (
      <div className={`w-full h-full flex items-center justify-center text-3xl filter drop-shadow-md ${className}`}>
        🧱
      </div>
    ) : (
      <div className={`w-full h-full flex items-center justify-center text-3xl filter drop-shadow-md ${className}`}>
        🟨
      </div>
    );
  }

  if (themeId === 'construction') {
    return type === 'base' ? (
      <div className={`w-full h-full flex items-center justify-center text-3xl filter drop-shadow-md ${className}`}>
        ⚠️
      </div>
    ) : (
      <div className={`w-full h-full flex items-center justify-center text-3xl filter drop-shadow-md ${className}`}>
        🪨
      </div>
    );
  }

  // Default Dino Eggs - Rich SVG Illustrated Spotted Eggs
  return type === 'base' ? (
    <svg viewBox="0 0 100 120" className={`w-[85%] h-[85%] filter drop-shadow-lg ${className}`}>
      <defs>
        <radialGradient id="goldEggGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="30%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="65" rx="42" ry="50" fill="url(#goldEggGrad)" />
      {/* Egg Spots */}
      <circle cx="35" cy="50" r="6" fill="#d97706" opacity="0.35" />
      <circle cx="65" cy="70" r="8" fill="#d97706" opacity="0.35" />
      <circle cx="45" cy="85" r="5" fill="#d97706" opacity="0.35" />
      {/* Specular Highlight */}
      <ellipse cx="32" cy="35" rx="8" ry="12" fill="#ffffff" opacity="0.6" transform="rotate(-20 32 35)" />
    </svg>
  ) : (
    <svg viewBox="0 0 100 120" className={`w-[85%] h-[85%] filter drop-shadow-lg ${className}`}>
      <defs>
        <radialGradient id="blueEggGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f0f9ff" />
          <stop offset="30%" stopColor="#bae6fd" />
          <stop offset="70%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="65" rx="42" ry="50" fill="url(#blueEggGrad)" />
      {/* Egg Spots */}
      <circle cx="35" cy="50" r="6" fill="#0369a1" opacity="0.35" />
      <circle cx="65" cy="70" r="8" fill="#0369a1" opacity="0.35" />
      <circle cx="45" cy="85" r="5" fill="#0369a1" opacity="0.35" />
      {/* Specular Highlight */}
      <ellipse cx="32" cy="35" rx="8" ry="12" fill="#ffffff" opacity="0.6" transform="rotate(-20 32 35)" />
    </svg>
  );
};

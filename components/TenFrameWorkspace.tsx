'use client';

import React from 'react';
import { ThemeConfig } from '../lib/themeData';

interface TenFrameWorkspaceProps {
  num1: number;
  num2: number;
  placedOnes: number;
  theme: ThemeConfig;
  onSlotClick: (index: number) => void;
  onBaseClick: (index: number) => void;
}

export const TenFrameWorkspace: React.FC<TenFrameWorkspaceProps> = ({
  num1,
  num2,
  placedOnes,
  theme,
  onSlotClick,
  onBaseClick,
}) => {
  return (
    <div className="flex flex-col gap-3.5">
      {/* Frame 1: Base Frame */}
      {num1 > 0 && (
        <div className="bg-black/25 rounded-2xl p-3.5 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-amber-400 uppercase">Ten-Frame 1 (Base {num1})</span>
            <span className="text-amber-400 font-bold text-xs">{num1} {theme.tokenBaseLabel}</span>
          </div>
          <div className="grid grid-cols-5 gap-2.5">
            {Array.from({ length: 10 }).map((_, i) => {
              const isFilled = i < num1;
              return (
                <div
                  key={`frame1-${i}`}
                  onClick={() => onBaseClick(i)}
                  className={`aspect-square bg-white/5 border-2 ${
                    isFilled ? 'border-white/40 border-solid' : 'border-white/20 border-dashed'
                  } rounded-xl flex justify-center items-center cursor-pointer hover:bg-white/10 hover:scale-105 transition-all`}
                >
                  {isFilled && (
                    <div className="w-[84%] h-[84%] rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex justify-center items-center text-xl shadow-md animate-pop">
                      {theme.tokenBaseIcon}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Frame 2: Active Manipulative Ones Frame */}
      <div className="bg-black/25 rounded-2xl p-3.5 border border-white/10">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-xs text-amber-400 uppercase">
            {num1 > 0 ? 'Ten-Frame 2' : 'Ten-Frame'} (Tap to add {num2} Ones)
          </span>
          <span className="text-sky-400 font-bold text-xs">
            {placedOnes} / {num2} Placed
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2.5">
          {Array.from({ length: 10 }).map((_, i) => {
            const isFilled = i < placedOnes;
            const isTargetHint = i === placedOnes && placedOnes < num2;

            return (
              <div
                key={`frame2-${i}`}
                onClick={() => onSlotClick(i)}
                className={`aspect-square bg-white/5 border-2 ${
                  isFilled
                    ? 'border-white/40 border-solid'
                    : isTargetHint
                    ? 'border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)] animate-pulse'
                    : 'border-white/20 border-dashed'
                } rounded-xl flex justify-center items-center cursor-pointer hover:bg-white/10 hover:scale-105 transition-all`}
              >
                {isFilled && (
                  <div className="w-[84%] h-[84%] rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex justify-center items-center text-xl shadow-md animate-pop">
                    {theme.tokenExtraIcon}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

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
    <div className="flex flex-col gap-4">
      {/* Frame 1: Base Frame */}
      {num1 > 0 && (
        <div className="bg-black/30 rounded-[28px] p-4 border border-white/10 shadow-inner">
          <div className="flex justify-between items-center mb-2.5">
            <span className="font-bold text-xs text-amber-400 uppercase tracking-wider">
              Ten-Frame 1 (Base {num1})
            </span>
            <span className="text-amber-300 font-bold text-xs bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              {num1} {theme.tokenBaseLabel}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => {
              const isFilled = i < num1;
              return (
                <div
                  key={`frame1-${i}`}
                  onClick={() => onBaseClick(i)}
                  className={`aspect-square bg-white/5 border-2 ${
                    isFilled ? 'border-white/30 border-solid shadow-inner' : 'border-white/15 border-dashed'
                  } rounded-2xl flex justify-center items-center cursor-pointer hover:bg-white/10 transition-all`}
                >
                  {isFilled && (
                    <div className="w-[85%] h-[85%] token-3d token-gold flex justify-center items-center text-2xl shadow-xl animate-spring">
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
      <div className="bg-black/30 rounded-[28px] p-4 border border-white/10 shadow-inner">
        <div className="flex justify-between items-center mb-2.5">
          <span className="font-bold text-xs text-amber-400 uppercase tracking-wider">
            {num1 > 0 ? 'Ten-Frame 2' : 'Ten-Frame'} (Tap to add {num2} Ones)
          </span>
          <span className="text-sky-300 font-bold text-xs bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
            {placedOnes} / {num2} Placed
          </span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => {
            const isFilled = i < placedOnes;
            const isTargetHint = i === placedOnes && placedOnes < num2;

            return (
              <div
                key={`frame2-${i}`}
                onClick={() => onSlotClick(i)}
                className={`aspect-square bg-white/5 border-2 ${
                  isFilled
                    ? 'border-white/30 border-solid shadow-inner'
                    : isTargetHint
                    ? 'border-sky-400 animate-glow-sky'
                    : 'border-white/15 border-dashed'
                } rounded-2xl flex justify-center items-center cursor-pointer hover:bg-white/10 transition-all`}
              >
                {isFilled && (
                  <div className="w-[85%] h-[85%] token-3d token-blue flex justify-center items-center text-2xl shadow-xl animate-spring">
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

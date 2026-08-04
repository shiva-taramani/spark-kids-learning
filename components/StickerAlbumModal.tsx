'use client';

import React from 'react';
import { ALL_STICKERS } from '../lib/progressStore';

interface StickerAlbumModalProps {
  isOpen: boolean;
  unlockedStickers: string[];
  onClose: () => void;
}

export const StickerAlbumModal: React.FC<StickerAlbumModalProps> = ({
  isOpen,
  unlockedStickers,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-opacity">
      <div className="glass-panel rounded-[36px] p-8 max-w-[620px] w-full max-h-[85vh] overflow-y-auto border border-white/20 text-center shadow-2xl flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5 font-bold text-2xl text-amber-300">
            <span className="text-3xl">📖</span>
            <span>Hero Sticker Album</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white/10 rounded-full text-slate-300 font-bold flex items-center justify-center hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-400 text-xs font-semibold mb-6">
          Solve math and reading challenges to heal patients and unlock 3D collectible hero badges!
        </p>

        {/* Sticker Badge Grid */}
        <div className="w-full grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
          {ALL_STICKERS.map((sticker) => {
            const isUnlocked = unlockedStickers.includes(sticker.id);
            return (
              <div
                key={sticker.id}
                className={`p-4 rounded-3xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  isUnlocked
                    ? 'bg-white/10 border-amber-400/50 shadow-lg scale-105'
                    : 'bg-black/40 border-white/5 opacity-40 grayscale'
                }`}
              >
                <div className="text-5xl drop-shadow-md">
                  {isUnlocked ? sticker.icon : '🔒'}
                </div>
                <div className="font-bold text-xs text-slate-200">
                  {isUnlocked ? sticker.name : 'Locked'}
                </div>
                {isUnlocked && (
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30">
                    UNLOCKED ⭐
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-lg py-3.5 rounded-2xl shadow-xl hover:scale-105 transition-transform"
        >
          Back to Game 🎮
        </button>
      </div>
    </div>
  );
};

'use client';

import React from 'react';

interface HeaderNavProps {
  activeSubject: 'math' | 'words';
  setActiveSubject: (subject: 'math' | 'words') => void;
  activeLevel: string;
  setActiveLevel: (level: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  stars: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeSubject,
  setActiveSubject,
  activeLevel,
  setActiveLevel,
  soundEnabled,
  toggleSound,
  stars,
}) => {
  return (
    <header className="w-full max-w-[980px] flex justify-between items-center bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-[32px] mb-5 shadow-lg">
      <div className="flex items-center gap-2.5 font-bold text-xl text-slate-50 tracking-wide">
        <span className="text-3xl">🦕</span>
        <span>Dino Rescue</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Apple-style Segmented Control */}
        <div className="bg-black/30 p-1 rounded-full flex gap-1 border border-white/10">
          <button
            className={`px-3.5 py-1.5 rounded-2xl font-semibold text-xs transition-all ${
              activeSubject === 'math' ? 'bg-white/15 text-white shadow-md' : 'text-slate-400'
            }`}
            onClick={() => setActiveSubject('math')}
          >
            🧮 Math
          </button>
          <button
            className={`px-3.5 py-1.5 rounded-2xl font-semibold text-xs transition-all ${
              activeSubject === 'words' ? 'bg-white/15 text-white shadow-md' : 'text-slate-400'
            }`}
            onClick={() => setActiveSubject('words')}
          >
            🔤 Words
          </button>
        </div>

        {/* Age Level Pill */}
        <select
          value={activeLevel}
          onChange={(e) => setActiveLevel(e.target.value)}
          className="bg-white/10 border border-white/10 text-slate-100 font-semibold text-xs px-3.5 py-1.5 rounded-full outline-none cursor-pointer"
        >
          <option value="age4" className="bg-slate-900 text-white">Age 4-5 (Junior)</option>
          <option value="age6" className="bg-slate-900 text-white">Age 6 (Medic)</option>
          <option value="age8" className="bg-slate-900 text-white">Age 7-8 (Chief Vet)</option>
        </select>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="bg-white/10 border border-white/10 text-white font-semibold text-xs px-3.5 py-1.5 rounded-full cursor-pointer"
        >
          {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
        </button>

        {/* Star Reward Counter */}
        <div className="bg-amber-500/15 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5">
          <span>⭐</span>
          <span>{stars}</span>
        </div>
      </div>
    </header>
  );
};

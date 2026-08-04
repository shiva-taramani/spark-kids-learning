'use client';

import React from 'react';

interface HeaderNavProps {
  activeSubject: 'math' | 'words';
  setActiveSubject: (subject: 'math' | 'words') => void;
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
  activeLevel: string;
  setActiveLevel: (level: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  stars: number;
  unlockedCount: number;
  onOpenAlbum: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeSubject,
  setActiveSubject,
  activeTheme,
  setActiveTheme,
  activeLevel,
  setActiveLevel,
  soundEnabled,
  toggleSound,
  stars,
  unlockedCount,
  onOpenAlbum,
}) => {
  return (
    <header className="w-full max-w-[980px] flex justify-between items-center glass-panel px-6 py-3.5 rounded-[36px] mb-6 shadow-2xl flex-wrap gap-3">
      {/* Brand Title */}
      <div className="flex items-center gap-3 font-bold text-2xl text-slate-50 tracking-tight">
        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shadow-inner border border-white/10">
          {activeTheme === 'sports' ? '⚽' : activeTheme === 'legos' ? '🧱' : activeTheme === 'construction' ? '🚜' : '🦕'}
        </div>
        <span>
          {activeTheme === 'sports' ? 'Sports League' : activeTheme === 'legos' ? 'Lego Builders' : activeTheme === 'construction' ? 'Construction Crew' : 'Dino Rescue'}
        </span>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* iOS-Style Segmented Control */}
        <div className="bg-black/40 p-1.5 rounded-full flex gap-1 border border-white/10 shadow-inner">
          <button
            className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all duration-300 ${
              activeSubject === 'math'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveSubject('math')}
          >
            🧮 Math
          </button>
          <button
            className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all duration-300 ${
              activeSubject === 'words'
                ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 shadow-md scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveSubject('words')}
          >
            🔤 Words
          </button>
        </div>

        {/* Custom Glass Theme Pill Dropdown */}
        <div className="relative">
          <select
            value={activeTheme}
            onChange={(e) => setActiveTheme(e.target.value)}
            className="glass-pill text-amber-300 font-bold text-xs px-4 py-2 rounded-full outline-none cursor-pointer appearance-none pr-8 border-amber-400/30"
          >
            <option value="dino" className="bg-slate-900 text-white">🦕 Dino Theme</option>
            <option value="sports" className="bg-slate-900 text-white">⚽ Sports Theme</option>
            <option value="legos" className="bg-slate-900 text-white">🧱 Lego Theme</option>
            <option value="construction" className="bg-slate-900 text-white">🚜 Excavator Theme</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-400 text-xs">▾</span>
        </div>

        {/* Hero Sticker Album Button */}
        <button
          onClick={onOpenAlbum}
          className="glass-pill text-amber-300 font-bold text-xs px-3.5 py-2 rounded-full cursor-pointer hover:scale-105 flex items-center gap-1.5 border-amber-400/30"
        >
          <span>📖</span>
          <span>Album ({unlockedCount}/12)</span>
        </button>

        {/* Age Level Dropdown */}
        <div className="relative">
          <select
            value={activeLevel}
            onChange={(e) => setActiveLevel(e.target.value)}
            className="glass-pill text-slate-200 font-bold text-xs px-4 py-2 rounded-full outline-none cursor-pointer appearance-none pr-8"
          >
            <option value="age4" className="bg-slate-900 text-white">Age 4-5 (Junior)</option>
            <option value="age6" className="bg-slate-900 text-white">Age 6 (Medic)</option>
            <option value="age8" className="bg-slate-900 text-white">Age 7-8 (Chief Vet)</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▾</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="glass-pill text-slate-200 font-bold text-xs px-3.5 py-2 rounded-full cursor-pointer hover:scale-105"
        >
          {soundEnabled ? '🔊 Sound' : '🔇 Mute'}
        </button>

        {/* Star Badge */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-300 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-lg">
          <span className="text-sm">⭐</span>
          <span>{stars}</span>
        </div>
      </div>
    </header>
  );
};

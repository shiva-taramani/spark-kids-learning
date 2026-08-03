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
}) => {
  return (
    <header className="w-full max-w-[980px] flex justify-between items-center bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-[32px] mb-5 shadow-lg flex-wrap gap-3">
      <div className="flex items-center gap-2.5 font-bold text-xl text-slate-50 tracking-wide">
        <span className="text-3xl">
          {activeTheme === 'sports' ? '⚽' : activeTheme === 'legos' ? '🧱' : activeTheme === 'construction' ? '🚜' : '🦕'}
        </span>
        <span>
          {activeTheme === 'sports' ? 'Sports League' : activeTheme === 'legos' ? 'Lego Builders' : activeTheme === 'construction' ? 'Construction Crew' : 'Dino Rescue'}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Apple-style Segmented Subject Control */}
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

        {/* Dynamic Theme Selector Pill */}
        <select
          value={activeTheme}
          onChange={(e) => setActiveTheme(e.target.value)}
          className="bg-white/10 border border-white/10 text-slate-100 font-semibold text-xs px-3.5 py-1.5 rounded-full outline-none cursor-pointer"
          title="Choose Interest Theme"
        >
          <option value="dino" className="bg-slate-900 text-white">🦕 Dino Rescue</option>
          <option value="sports" className="bg-slate-900 text-white">⚽ Sports League</option>
          <option value="legos" className="bg-slate-900 text-white">🧱 Lego Builders</option>
          <option value="construction" className="bg-slate-900 text-white">🚜 Construction / Excavator</option>
        </select>

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

'use client';

import React, { useState } from 'react';
import { ChildProfile } from '../lib/childProfiles';

interface ChildProfileModalProps {
  isOpen: boolean;
  profiles: ChildProfile[];
  activeId: string;
  onSelectChild: (id: string) => void;
  onAddChild: (name: string, ageGroup: string, preferredTheme: string) => void;
  onClose: () => void;
}

export const ChildProfileModal: React.FC<ChildProfileModalProps> = ({
  isOpen,
  profiles,
  activeId,
  onSelectChild,
  onAddChild,
  onClose,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newAgeGroup, setNewAgeGroup] = useState('age6');
  const [newTheme, setNewTheme] = useState('dino');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    onAddChild(newChildName.trim(), newAgeGroup, newTheme);
    setNewChildName('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-opacity">
      <div className="glass-panel rounded-[36px] p-8 max-w-[500px] w-full border border-white/20 text-center shadow-2xl flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5 font-bold text-2xl text-sky-300">
            <span className="text-3xl">👦</span>
            <span>Child Profiles</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white/10 rounded-full text-slate-300 font-bold flex items-center justify-center hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-400 text-xs font-semibold mb-6">
          Each child has their own independent age level, theme, stars, and unlocked hero stickers!
        </p>

        {/* Existing Child Profiles List */}
        {!isAdding && (
          <div className="w-full flex flex-col gap-3 mb-6">
            {profiles.map((p) => {
              const isActive = p.id === activeId;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectChild(p.id);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500/20 to-blue-500/20 border-sky-400/60 shadow-lg scale-105'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-sky-300">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-100 text-sm">{p.name}</div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {p.ageGroup === 'age4' ? 'Age 4-5' : p.ageGroup === 'age6' ? 'Age 6' : 'Age 7-8'} • {p.stars} ⭐
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="text-xs bg-sky-400/20 text-sky-300 font-extrabold px-3 py-1 rounded-full border border-sky-400/30">
                      PLAYING NOW
                    </span>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-sky-400/40 text-sky-300 font-bold text-sm hover:bg-sky-400/10 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>➕ Add Child Profile</span>
            </button>
          </div>
        )}

        {/* Add New Child Form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="w-full flex flex-col gap-4 mb-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Child Name</label>
              <input
                type="text"
                placeholder="e.g. Leo, Maya, Sam"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 font-bold text-sm outline-none focus:border-sky-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Age Level</label>
                <select
                  value={newAgeGroup}
                  onChange={(e) => setNewAgeGroup(e.target.value)}
                  className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2.5 text-white font-bold text-xs"
                >
                  <option value="age4">Age 4-5 (Junior)</option>
                  <option value="age6">Age 6 (Medic)</option>
                  <option value="age8">Age 7-8 (Chief Vet)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Theme</label>
                <select
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2.5 text-white font-bold text-xs"
                >
                  <option value="dino">🦕 Dino Rescue</option>
                  <option value="sports">⚽ Sports League</option>
                  <option value="legos">🧱 Lego Builders</option>
                  <option value="construction">🚜 Excavators</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="w-1/2 bg-white/10 text-slate-300 font-bold text-xs py-3 rounded-xl hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg hover:scale-105"
              >
                Create Profile 🚀
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

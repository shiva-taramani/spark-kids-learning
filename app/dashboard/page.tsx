'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { ChildProfile, loadLocalProfiles, saveLocalProfiles } from '../../lib/childProfiles';

export default function ParentDashboard() {
  const [parentEmail, setParentEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string>('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuthAndLoad() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data && data.user) {
          setParentEmail(data.user.email || 'Parent');
        }

        const { profiles: loadedProfiles, activeId } = loadLocalProfiles();
        setProfiles(loadedProfiles);
        setActiveChildId(activeId);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    checkAuthAndLoad();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleUpdateAge = (childId: string, ageGroup: string) => {
    const updated = profiles.map((p) => (p.id === childId ? { ...p, ageGroup } : p));
    setProfiles(updated);
    saveLocalProfiles(updated, activeChildId);
  };

  const handleUpdateTheme = (childId: string, preferredTheme: string) => {
    const updated = profiles.map((p) => (p.id === childId ? { ...p, preferredTheme } : p));
    setProfiles(updated);
    saveLocalProfiles(updated, activeChildId);
  };

  const activeChild = profiles.find((p) => p.id === activeChildId) || profiles[0] || {
    id: 'guest',
    name: 'Player 1',
    ageGroup: 'age6',
    preferredTheme: 'dino',
    stars: 0,
    skillElo: 100,
    unlockedStickers: ['rexy'],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold">
        Loading Parent Portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-[980px] mx-auto p-6 flex flex-col gap-6">
      {/* Top Parent Header */}
      <header className="glass-panel p-6 rounded-[36px] flex justify-between items-center flex-wrap gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
            📊
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Parent Dashboard</h1>
            <p className="text-slate-400 text-xs font-medium">Logged in as {parentEmail || 'Guest Parent'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>🎮 Launch Game Mode</span>
          </Link>

          {parentEmail && (
            <button
              onClick={handleSignOut}
              className="glass-pill text-slate-300 text-xs font-bold px-4 py-2.5 rounded-full hover:bg-white/20"
            >
              Sign Out 🚪
            </button>
          )}
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Child Learning Analytics Card */}
        <section className="glass-panel p-6 rounded-[36px] flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2 font-bold text-xl text-amber-300">
            <span>⭐</span>
            <span>Active Student Overview ({activeChild.name})</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
              <div className="text-3xl font-extrabold text-amber-400">{activeChild.stars}</div>
              <div className="text-xs text-slate-400 font-bold uppercase mt-1">Total Stars Earned</div>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
              <div className="text-3xl font-extrabold text-sky-400">{activeChild.skillElo}</div>
              <div className="text-xs text-slate-400 font-bold uppercase mt-1">Procedural Skill Elo</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
            <span className="text-slate-300 text-xs font-bold">Unlocked Hero Badges</span>
            <span className="text-amber-300 font-extrabold text-sm">
              {activeChild.unlockedStickers ? activeChild.unlockedStickers.length : 1} / 12 Unlocked 📖
            </span>
          </div>
        </section>

        {/* Child Profile Settings Card */}
        <section className="glass-panel p-6 rounded-[36px] flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2 font-bold text-xl text-sky-300">
            <span>👦</span>
            <span>Child Settings</span>
          </div>

          <div className="flex flex-col gap-4">
            {profiles.map((child) => (
              <div
                key={child.id}
                className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <div className="font-bold text-slate-100 text-base">{child.name}</div>
                  <span className="text-xs text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full font-bold">
                    {child.stars} ⭐
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">Target Age Level</label>
                    <select
                      value={child.ageGroup}
                      onChange={(e) => handleUpdateAge(child.id, e.target.value)}
                      className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                    >
                      <option value="age4">Age 4-5 (Junior)</option>
                      <option value="age6">Age 6 (Medic)</option>
                      <option value="age8">Age 7-8 (Chief Vet)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">Preferred Theme</label>
                    <select
                      value={child.preferredTheme}
                      onChange={(e) => handleUpdateTheme(child.id, e.target.value)}
                      className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                    >
                      <option value="dino">🦕 Dino Rescue</option>
                      <option value="sports">⚽ Sports League</option>
                      <option value="legos">🧱 Lego Builders</option>
                      <option value="construction">🚜 Excavators</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

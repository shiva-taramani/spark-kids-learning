'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import {
  ChildProfile,
  fetchUserChildProfiles,
  saveLocalProfiles,
  createChildProfile,
} from '../../lib/childProfiles';

export default function ParentDashboard() {
  const [parentEmail, setParentEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('age8');
  const [newChildTheme, setNewChildTheme] = useState('dino');
  const [isAdding, setIsAdding] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuthAndLoad() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data && data.user) {
          setParentEmail(data.user.email || 'Parent');
        }

        const { profiles: loadedProfiles, activeId } = await fetchUserChildProfiles();
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

  const handleSelectActiveChild = (childId: string) => {
    setActiveChildId(childId);
    saveLocalProfiles(profiles, childId);
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

  const handleCreateChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    setIsAdding(true);
    try {
      const created = await createChildProfile(
        newChildName.trim(),
        newChildAge,
        newChildTheme
      );
      setProfiles((prev) => [...prev.filter((p) => !p.id.startsWith('guest-')), created]);
      setActiveChildId(created.id);
      setNewChildName('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to create child profile:', err);
    } finally {
      setIsAdding(false);
    }
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
            href="/game"
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
          <div className="flex items-center justify-between font-bold text-xl text-amber-300">
            <div className="flex items-center gap-2">
              <span>⭐</span>
              <span>Active Student ({activeChild.name})</span>
            </div>
            <span className="text-xs bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
              Active Profile
            </span>
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
          <div className="flex justify-between items-center font-bold text-xl text-sky-300">
            <div className="flex items-center gap-2">
              <span>👦</span>
              <span>Child Profiles</span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40 text-xs font-extrabold px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
            >
              <span>➕ Add Child</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {profiles.map((child) => {
              const isActive = child.id === activeChildId;
              return (
                <div
                  key={child.id}
                  className={`bg-white/5 border p-4 rounded-2xl flex flex-col gap-3 transition-all ${
                    isActive ? 'border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)] bg-sky-400/5' : 'border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelectActiveChild(child.id)}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isActive ? 'border-sky-400 bg-sky-400' : 'border-slate-500'
                        }`}
                      >
                        {isActive && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                      </button>
                      <div className="font-bold text-slate-100 text-base">{child.name}</div>
                    </div>
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
              );
            })}
          </div>
        </section>
      </div>

      {/* Add Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateChild}
            className="glass-panel border-sky-400/40 p-6 rounded-[32px] w-full max-w-md flex flex-col gap-4 shadow-2xl animate-in fade-in"
          >
            <h3 className="text-xl font-bold text-slate-50 flex items-center gap-2">
              <span>👦</span> Add Child Profile
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Child Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Leo"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Age Group</label>
                <select
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(e.target.value)}
                  className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-white font-bold text-xs"
                >
                  <option value="age4">Age 4-5 (Junior)</option>
                  <option value="age6">Age 6 (Medic)</option>
                  <option value="age8">Age 7-8 (Chief Vet)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Theme</label>
                <select
                  value={newChildTheme}
                  onChange={(e) => setNewChildTheme(e.target.value)}
                  className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-white font-bold text-xs"
                >
                  <option value="dino">🦕 Dino</option>
                  <option value="sports">⚽ Sports</option>
                  <option value="legos">🧱 Lego</option>
                  <option value="construction">🚜 Construction</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 font-bold text-xs hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAdding}
                className="bg-gradient-to-r from-sky-400 to-blue-600 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                {isAdding ? 'Creating...' : 'Save Profile ✨'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

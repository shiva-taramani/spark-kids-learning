'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full max-w-[1040px] mx-auto p-6 flex flex-col items-center justify-between text-center gap-12">
      {/* Header Bar */}
      <header className="w-full glass-panel px-8 py-4 rounded-[36px] flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3 font-extrabold text-2xl text-slate-50 tracking-tight">
          <span className="text-3xl">🌟</span>
          <span>Spark Kids Learning</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="glass-pill text-sky-300 font-bold text-xs px-5 py-2.5 rounded-full hover:scale-105 transition-all border-sky-400/30"
          >
            🔑 Parent Sign In
          </Link>
          <Link
            href="/game"
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-full shadow-lg hover:scale-105 transition-all"
          >
            🎮 Play as Guest
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center gap-6 max-w-[760px] my-4">
        <div className="bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-extrabold px-4 py-1.5 rounded-full tracking-wider uppercase shadow-md">
          ✨ Singapore Math & Phonics for Kids Aged 4–8
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-50 tracking-tight leading-tight">
          Learning Math & Reading Should Feel Like <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-sky-300 to-emerald-300">Magic</span>
        </h1>

        <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-[640px]">
          An active manipulative learning game tailored to your child&apos;s interests—from dinosaurs and excavators to legos and sports.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Link
            href="/game"
            className="bg-gradient-to-r from-emerald-400 via-sky-400 to-blue-500 text-slate-950 font-extrabold text-lg px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-3"
          >
            <span>🎮 Start Playing Now</span>
            <span>→</span>
          </Link>
          <Link
            href="/login"
            className="glass-panel text-slate-100 font-bold text-lg px-8 py-4 rounded-full hover:bg-white/15 transition-all flex items-center gap-2 border-white/20"
          >
            <span>🔑 Parent Portal</span>
          </Link>
        </div>
      </section>

      {/* Interest Themes Grid */}
      <section className="w-full glass-panel p-8 rounded-[40px] shadow-2xl flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-amber-300">Choose Your Child&apos;s Favorite Theme</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
            <span className="text-5xl drop-shadow-md">🦕</span>
            <span className="font-bold text-sm text-slate-100">Dino Rescue</span>
            <span className="text-[11px] text-slate-400 font-medium">Gold Eggs & Mud Wipes</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
            <span className="text-5xl drop-shadow-md">⚽</span>
            <span className="font-bold text-sm text-slate-100">Sports League</span>
            <span className="text-[11px] text-slate-400 font-medium">Trophies & Basketballs</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
            <span className="text-5xl drop-shadow-md">🧱</span>
            <span className="font-bold text-sm text-slate-100">Lego Builders</span>
            <span className="text-[11px] text-slate-400 font-medium">Bricks & Yellow Studs</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
            <span className="text-5xl drop-shadow-md">🚜</span>
            <span className="font-bold text-sm text-slate-100">Excavators</span>
            <span className="text-[11px] text-slate-400 font-medium">Cones & Heavy Rocks</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-slate-500 text-xs font-semibold py-4">
        Spark Kids Learning Platform • Powered by Next.js 14, Supabase & Railway
      </footer>
    </div>
  );
}

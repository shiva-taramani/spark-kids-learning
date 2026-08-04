'use client';

import React from 'react';
import { ThemePatient } from '../lib/themeData';

interface DinoStageProps {
  patient: ThemePatient;
  health: number;
  isHappy: boolean;
  statusAction: string;
}

export const DinoStage: React.FC<DinoStageProps> = ({ patient, health, isHappy, statusAction }) => {
  return (
    <section className="glass-panel rounded-[36px] p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
      {/* Ambient Radial Background Glow */}
      <div
        className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: patient.color }}
      />

      <div className="font-bold text-xl mb-3 flex items-center gap-2.5 text-slate-50">
        <span className="text-3xl">{patient.icon}</span>
        <span>{patient.name}</span>
        <span className="text-xs bg-white/10 border border-white/15 px-3 py-1 rounded-full text-amber-300 font-semibold">
          {patient.species}
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-4 bg-black/40 rounded-full p-0.5 border border-white/10 mb-5 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-blue-500 rounded-full transition-all duration-500 shadow-md"
          style={{ width: `${health}%` }}
        />
      </div>

      {/* Hero Character Stage Box */}
      <div className="w-full h-[230px] bg-gradient-to-b from-white/5 to-black/30 rounded-[28px] border border-white/10 flex justify-center items-center relative overflow-hidden shadow-inner">
        <div className={`transition-transform duration-500 ${isHappy ? 'animate-bounce scale-110' : 'hover:scale-105'}`}>
          <div className="text-9xl drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] animate-pulse">
            {patient.icon}
          </div>
        </div>

        {/* Translucent Mud Overlay Wipes */}
        <div className="absolute inset-0 pointer-events-none">
          {health < 100 && (
            <>
              <div className="absolute top-[30%] left-[30%] w-10 h-10 bg-[#3d2616]/80 rounded-full blur-[1px] shadow-lg" />
              <div className="absolute top-[48%] left-[48%] w-12 h-12 bg-[#3d2616]/85 rounded-full blur-[1px] shadow-lg" />
              <div className="absolute top-[58%] left-[25%] w-9 h-9 bg-[#3d2616]/75 rounded-full blur-[1px] shadow-lg" />
            </>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-400 font-bold uppercase tracking-wider">
        {statusAction} {patient.name}! {patient.actionText}
      </div>
    </section>
  );
};

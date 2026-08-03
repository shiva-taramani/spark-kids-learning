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
    <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl flex flex-col items-center text-center">
      <div className="font-bold text-xl mb-2.5 flex items-center gap-2 text-slate-100">
        <span className="text-3xl">{patient.icon}</span>
        <span>{patient.name}</span>
        <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full text-amber-300">{patient.species}</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-3.5 bg-black/30 rounded-full p-0.5 border border-white/10 mb-4">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full transition-all duration-500"
          style={{ width: `${health}%` }}
        />
      </div>

      {/* Hero Character Stage Box */}
      <div className="w-full h-[220px] bg-[radial-gradient(circle,rgba(56,189,248,0.1)_0%,rgba(0,0,0,0.2)_70%)] rounded-2xl flex justify-center items-center relative overflow-hidden">
        <div className={`w-[170px] h-[170px] flex justify-center items-center text-8xl transition-transform duration-400 ${isHappy ? 'animate-bounce' : ''}`}>
          <div className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            {patient.icon}
          </div>
        </div>

        {/* Mud / Dirt Spots Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {health < 100 && (
            <>
              <div className="absolute top-[35%] left-[35%] w-7 h-7 bg-[#4a3324] rounded-full opacity-80" />
              <div className="absolute top-[50%] left-[50%] w-8 h-8 bg-[#4a3324] rounded-full opacity-80" />
              <div className="absolute top-[60%] left-[28%] w-7 h-7 bg-[#4a3324] rounded-full opacity-80" />
            </>
          )}
        </div>
      </div>

      <div className="mt-3.5 text-sm text-slate-400 font-semibold">
        {statusAction} {patient.name}! {patient.actionText}
      </div>
    </section>
  );
};

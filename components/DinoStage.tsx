'use client';

import React from 'react';
import { Patient } from '../lib/patientData';

interface DinoStageProps {
  patient: Patient;
  health: number;
  isHappy: boolean;
}

export const DinoStage: React.FC<DinoStageProps> = ({ patient, health, isHappy }) => {
  return (
    <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl flex flex-col items-center text-center">
      <div className="font-bold text-xl mb-2.5 flex items-center gap-2 text-slate-100">
        <span>{patient.icon}</span>
        <span>{patient.name}</span>
      </div>

      {/* Rescue Health Bar Track */}
      <div className="w-full h-3.5 bg-black/30 rounded-full p-0.5 border border-white/10 mb-4">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full transition-all duration-500"
          style={{ width: `${health}%` }}
        />
      </div>

      {/* Dinosaur Stage Box */}
      <div className="w-full h-[220px] bg-[radial-gradient(circle,rgba(56,189,248,0.1)_0%,rgba(0,0,0,0.2)_70%)] rounded-2xl flex justify-center items-center relative">
        <div className={`w-[170px] h-[170px] transition-transform duration-400 ${isHappy ? 'animate-bounce' : ''}`}>
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            <path d="M 40 130 Q 10 120 20 90 Q 40 100 60 120 Z" fill={patient.color} />
            <ellipse cx="100" cy="130" rx="50" ry="40" fill={patient.color} />
            <rect x="70" y="155" width="18" height="30" rx="8" fill={patient.color} />
            <rect x="110" y="155" width="18" height="30" rx="8" fill={patient.color} />
            <path d="M 120 110 Q 140 80 150 60 Q 175 60 180 85 Q 160 110 130 120 Z" fill={patient.color} />
            <circle cx="158" cy="72" r="7" fill="#ffffff" />
            <circle cx="160" cy="72" r="3.5" fill="#000000" />
            <circle cx="162" cy="70" r="1.2" fill="#ffffff" />
            <path d="M 165 85 Q 155 92 145 86" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Mud Spots Overlay */}
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
        Tap empty slots to add eggs and heal {patient.name}! 🧼
      </div>
    </section>
  );
};

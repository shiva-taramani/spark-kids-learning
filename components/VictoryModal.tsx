'use client';

import React from 'react';

interface VictoryModalProps {
  isOpen: boolean;
  dinoIcon: string;
  patientName: string;
  onNext: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  dinoIcon,
  patientName,
  onNext,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex justify-center items-center z-50 transition-opacity">
      <div className="bg-slate-900 border border-white/10 rounded-[32px] p-8 text-center max-w-[400px] w-[90%] shadow-2xl">
        <h2 className="font-bold text-3xl text-amber-400 mb-2">Patient Rescued! 🎉</h2>
        <div className="text-6xl my-4 animate-bounce">{dinoIcon}</div>
        <p className="text-slate-400 mb-6 font-semibold">You fully healed {patientName}!</p>
        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-bold text-xl py-4 rounded-2xl shadow-lg hover:scale-105 transition-all"
        >
          Next Patient 🩺
        </button>
      </div>
    </div>
  );
};

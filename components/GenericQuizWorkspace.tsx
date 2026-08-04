'use client';

import React, { useState } from 'react';
import { audioEngine } from '../lib/audioEngine';

interface GenericQuizWorkspaceProps {
  pathId: string;
  onSuccess: () => void;
}

export const GenericQuizWorkspace: React.FC<GenericQuizWorkspaceProps> = ({ pathId, onSuccess }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const sampleQuestion = {
    title: pathId === 'astronomy' ? 'Which planet is closest to the Sun?' : 'What does a computer loop do?',
    options: pathId === 'astronomy' ? ['Mercury 🪐', 'Mars 🔴', 'Jupiter 🌕', 'Neptune 🔵'] : ['Repeats actions 🔄', 'Turns off 🛑', 'Plays music 🎵', 'Deletes files 📁'],
    correctIdx: 0,
  };

  const handleOptionClick = (idx: number) => {
    audioEngine.initCtx();
    setSelectedOption(idx);
    audioEngine.playTap(idx);

    if (idx === sampleQuestion.correctIdx) {
      audioEngine.playBubble();
      audioEngine.speak("Correct! Great job!");
      setTimeout(onSuccess, 500);
    } else {
      audioEngine.speak("Try again! You can do it!");
    }
  };

  return (
    <div className="flex flex-col gap-5 text-center">
      <div className="text-xl font-bold text-slate-100 bg-white/5 p-4 rounded-2xl border border-white/10">
        {sampleQuestion.title}
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {sampleQuestion.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === sampleQuestion.correctIdx;

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              className={`p-4 rounded-2xl font-bold text-sm border transition-all ${
                isSelected
                  ? isCorrect
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 scale-105 shadow-lg'
                    : 'bg-rose-500/30 border-rose-400 text-rose-300'
                  : 'bg-white/10 border-white/15 text-slate-100 hover:bg-white/20'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

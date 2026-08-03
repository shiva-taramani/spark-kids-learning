'use client';

import React from 'react';

interface PhonicsWorkspaceProps {
  targetWord: string;
  userWord: string[];
  onLetterClick: (letter: string, index: number) => void;
}

export const PhonicsWorkspace: React.FC<PhonicsWorkspaceProps> = ({
  targetWord,
  userWord,
  onLetterClick,
}) => {
  // Generate letter bank containing target letters + distractor letters
  const letterPool = React.useMemo(() => {
    return (targetWord + 'REST').split('').sort(() => Math.random() - 0.5);
  }, [targetWord]);

  return (
    <div className="flex flex-col gap-4">
      {/* Target Word Slots */}
      <div className="flex justify-center gap-2.5 my-4">
        {Array.from({ length: targetWord.length }).map((_, i) => {
          const char = userWord[i];
          return (
            <div
              key={`slot-${i}`}
              className={`w-[60px] h-[68px] bg-black/30 border-2 ${
                char ? 'border-solid bg-sky-500/20 text-white' : 'border-dashed border-amber-400 text-amber-400'
              } rounded-2xl flex justify-center items-center font-bold text-3xl shadow-inner`}
            >
              {char || '_'}
            </div>
          );
        })}
      </div>

      {/* Letter Bank Buttons */}
      <div className="flex justify-center gap-2 flex-wrap">
        {letterPool.map((letter, idx) => (
          <button
            key={`letter-${idx}`}
            onClick={() => onLetterClick(letter, idx)}
            className="w-[54px] h-[58px] bg-white/10 border border-white/15 rounded-2xl text-white font-bold text-2xl hover:bg-amber-400 hover:text-black transition-all"
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

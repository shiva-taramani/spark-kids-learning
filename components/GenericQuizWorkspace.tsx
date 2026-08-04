'use client';

import React, { useState, useEffect } from 'react';
import { audioEngine } from '../lib/audioEngine';
import { fetchModulesForPath, LearningModule } from '../lib/learningPaths';

interface GenericQuizWorkspaceProps {
  pathId: string;
  onSuccess: () => void;
}

export const GenericQuizWorkspace: React.FC<GenericQuizWorkspaceProps> = ({ pathId, onSuccess }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [moduleIdx, setModuleIdx] = useState<number>(0);

  useEffect(() => {
    async function loadModules() {
      const data = await fetchModulesForPath(pathId);
      setModules(data);
      setModuleIdx(0);
      setSelectedOption(null);
    }
    loadModules();
  }, [pathId]);

  const activeModule = modules[moduleIdx % Math.max(1, modules.length)];

  const sampleQuestion = activeModule
    ? {
        title: activeModule.question,
        options: activeModule.options,
        correctIdx: activeModule.correctIdx,
      }
    : {
        title:
          pathId === 'astronomy'
            ? 'Which planet is closest to the Sun?'
            : pathId === 'robotics'
            ? 'What does a REPEAT 4 times loop do?'
            : 'Which item powers an electric circuit?',
        options:
          pathId === 'astronomy'
            ? ['Mercury 🪐', 'Mars 🔴', 'Jupiter 🌕', 'Neptune 🔵']
            : pathId === 'robotics'
            ? ['Repeats actions 4 times 🔄', 'Turns off 🛑', 'Plays music 🎵', 'Deletes files 📁']
            : ['AA Battery 🔋', 'Glass Cup 🥛', 'Pencil ✏️', 'Paper 📄'],
        correctIdx: 0,
      };

  const handleOptionClick = (idx: number) => {
    audioEngine.initCtx();
    setSelectedOption(idx);
    audioEngine.playTap(idx);

    if (idx === sampleQuestion.correctIdx) {
      audioEngine.playBubble();
      audioEngine.speak("Correct! Great job!");
      setTimeout(() => {
        setModuleIdx((prev) => prev + 1);
        setSelectedOption(null);
        onSuccess();
      }, 600);
    } else {
      audioEngine.speak("Try again! You can do it!");
    }
  };

  return (
    <div className="flex flex-col gap-5 text-center">
      <div className="text-xl font-bold text-slate-100 bg-white/5 p-5 rounded-2xl border border-white/10 shadow-inner">
        {sampleQuestion.title}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

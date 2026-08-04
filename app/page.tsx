'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HeaderNav } from '../components/HeaderNav';
import { DinoStage } from '../components/DinoStage';
import { TenFrameWorkspace } from '../components/TenFrameWorkspace';
import { PhonicsWorkspace } from '../components/PhonicsWorkspace';
import { VictoryModal } from '../components/VictoryModal';
import { StickerAlbumModal } from '../components/StickerAlbumModal';
import { ChildProfileModal } from '../components/ChildProfileModal';
import { audioEngine } from '../lib/audioEngine';
import { THEMES } from '../lib/themeData';
import {
  ChildProfile,
  loadLocalProfiles,
  saveLocalProfiles,
  syncChildToSupabase,
} from '../lib/childProfiles';

export default function Home() {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string>('');
  const [isChildModalOpen, setIsChildModalOpen] = useState<boolean>(false);
  const [isAlbumOpen, setIsAlbumOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);

  const [activeSubject, setActiveSubject] = useState<'math' | 'words'>('math');
  const [activeThemeKey, setActiveThemeKey] = useState<string>('dino');
  const [activeLevel, setActiveLevel] = useState<string>('age6');
  const [patientIdx, setPatientIdx] = useState<number>(0);
  const [health, setHealth] = useState<number>(25);
  const [stars, setStars] = useState<number>(0);
  const [skillElo, setSkillElo] = useState<number>(100);
  const [unlockedStickers, setUnlockedStickers] = useState<string[]>(['rexy']);
  const [isHappy, setIsHappy] = useState<boolean>(false);

  // Question state
  const [num1, setNum1] = useState<number>(10);
  const [num2, setNum2] = useState<number>(2);
  const [placedOnes, setPlacedOnes] = useState<number>(0);
  const [targetWord, setTargetWord] = useState<string>('DINO');
  const [userWord, setUserWord] = useState<string[]>([]);
  const [speechPrompt, setSpeechPrompt] = useState<string>('Tap 2 slots to add 2 blue eggs!');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load profiles on mount
  useEffect(() => {
    const { profiles: loadedProfiles, activeId } = loadLocalProfiles();
    setProfiles(loadedProfiles);
    setActiveChildId(activeId);

    const activeChild = loadedProfiles.find((p) => p.id === activeId) || loadedProfiles[0];
    if (activeChild) {
      setStars(activeChild.stars || 0);
      setSkillElo(activeChild.skillElo || 100);
      setActiveLevel(activeChild.ageGroup || 'age6');
      setActiveThemeKey(activeChild.preferredTheme || 'dino');
      setUnlockedStickers(activeChild.unlockedStickers || ['rexy']);
    }
  }, []);

  const activeChild = profiles.find((p) => p.id === activeChildId) || profiles[0] || {
    id: 'guest',
    name: 'Player 1',
    ageGroup: 'age6',
    preferredTheme: 'dino',
    stars: 0,
    skillElo: 100,
    unlockedStickers: ['rexy'],
  };

  const activeTheme = THEMES[activeThemeKey] || THEMES.dino;
  const currentPatient = activeTheme.patients[patientIdx % activeTheme.patients.length];

  const generateQuestion = useCallback(() => {
    setPlacedOnes(0);
    setUserWord([]);

    if (activeSubject === 'math') {
      if (activeLevel === 'age4') {
        const target = Math.floor(Math.random() * 9) + 1;
        setNum1(0);
        setNum2(target);
        setSpeechPrompt(`Tap ${target} slots to count ${target} ${activeTheme.tokenExtraLabel}!`);
      } else if (activeLevel === 'age6') {
        const addend = Math.floor(Math.random() * 8) + 1;
        setNum1(10);
        setNum2(addend);
        setSpeechPrompt(`Tap ${addend} slots to add ${addend} ${activeTheme.tokenExtraLabel}!`);
      } else {
        const base = Math.floor(Math.random() * 3) + 7;
        const addend = Math.floor(Math.random() * 6) + 3;
        setNum1(base);
        setNum2(addend);
        setSpeechPrompt(`Add ${addend} ${activeTheme.tokenExtraLabel} to complete ${base} plus ${addend}!`);
      }
    } else {
      const wordPools: Record<string, string[]> = {
        age4: ['CAT', 'DOG', 'SUN', 'EGG', 'RED', 'BIG'],
        age6: ['DINO', 'ROAR', 'BONE', 'EGG', 'PARK', 'REXY'],
        age8: ['FOSSIL', 'JUNGLE', 'TRACKS', 'REPTILE'],
      };
      const list = wordPools[activeLevel] || wordPools.age6;
      const selected = list[Math.floor(Math.random() * list.length)];
      setTargetWord(selected);
      setSpeechPrompt(`Spell ${selected}`);
    }
  }, [activeSubject, activeLevel, activeTheme.tokenExtraLabel]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleSelectChild = (id: string) => {
    setActiveChildId(id);
    const target = profiles.find((p) => p.id === id);
    if (target) {
      setStars(target.stars || 0);
      setSkillElo(target.skillElo || 100);
      setActiveLevel(target.ageGroup || 'age6');
      setActiveThemeKey(target.preferredTheme || 'dino');
      setUnlockedStickers(target.unlockedStickers || ['rexy']);
      saveLocalProfiles(profiles, id);
    }
  };

  const handleAddChild = (name: string, ageGroup: string, preferredTheme: string) => {
    const newChild: ChildProfile = {
      id: `child-${Date.now()}`,
      name,
      ageGroup,
      preferredTheme,
      stars: 0,
      skillElo: 100,
      unlockedStickers: ['rexy'],
    };
    const updated = [...profiles, newChild];
    setProfiles(updated);
    handleSelectChild(newChild.id);
    saveLocalProfiles(updated, newChild.id);
    syncChildToSupabase(newChild);
  };

  const handleCorrect = useCallback(() => {
    const nextStars = stars + 1;
    const nextElo = skillElo + 25;
    setStars(nextStars);
    setSkillElo(nextElo);
    audioEngine.playBubble();

    if (activeSubject === 'math') {
      if (num1 === 0) {
        audioEngine.speak(`You counted ${num2}! Great job!`);
      } else {
        audioEngine.speak(`${num1} plus ${num2} equals ${num1 + num2}! Excellent!`);
      }
    } else {
      audioEngine.speak(`${targetWord}! Great job!`);
    }

    setHealth((h) => {
      const newHealth = Math.min(100, h + 34);
      if (newHealth >= 100) {
        setIsHappy(true);
        audioEngine.speak(`Awesome! ${currentPatient.name} is complete!`);

        const stickerId = currentPatient.id;
        const updatedStickers = Array.from(new Set([...unlockedStickers, stickerId]));
        setUnlockedStickers(updatedStickers);

        // Update active profile in array & save
        const updatedProfiles = profiles.map((p) =>
          p.id === activeChildId
            ? { ...p, stars: nextStars, skillElo: nextElo, unlockedStickers: updatedStickers }
            : p
        );
        setProfiles(updatedProfiles);
        saveLocalProfiles(updatedProfiles, activeChildId);

        setIsVictoryOpen(true);
      } else {
        const updatedProfiles = profiles.map((p) =>
          p.id === activeChildId
            ? { ...p, stars: nextStars, skillElo: nextElo }
            : p
        );
        setProfiles(updatedProfiles);
        saveLocalProfiles(updatedProfiles, activeChildId);
        setTimeout(generateQuestion, 1200);
      }
      return newHealth;
    });
  }, [activeSubject, num1, num2, targetWord, currentPatient.name, currentPatient.id, stars, skillElo, unlockedStickers, profiles, activeChildId, generateQuestion]);

  const handleSlotClick = (i: number) => {
    audioEngine.initCtx();
    let newPlaced = 0;
    if (i < placedOnes) {
      newPlaced = i;
      audioEngine.playTap(newPlaced);
    } else {
      newPlaced = i + 1;
      audioEngine.playTap(num1 + newPlaced);
      audioEngine.speak(`${num1 + newPlaced}`);
    }
    setPlacedOnes(newPlaced);

    if (newPlaced === num2) {
      setTimeout(handleCorrect, 400);
    }
  };

  const handleLetterClick = (letter: string, idx: number) => {
    audioEngine.initCtx();
    if (userWord.length < targetWord.length) {
      const nextWord = [...userWord, letter];
      setUserWord(nextWord);
      audioEngine.playTap(idx);
      audioEngine.speak(letter.toLowerCase());

      if (nextWord.length === targetWord.length && nextWord.join('') === targetWord) {
        setTimeout(handleCorrect, 400);
      }
    }
  };

  const handleNextPatient = () => {
    setIsVictoryOpen(false);
    setIsHappy(false);
    setPatientIdx((idx) => (idx + 1) % activeTheme.patients.length);
    setHealth(25);
    generateQuestion();
  };

  return (
    <main className="w-full max-w-[980px] flex flex-col items-center">
      <HeaderNav
        activeSubject={activeSubject}
        setActiveSubject={setActiveSubject}
        activeTheme={activeThemeKey}
        setActiveTheme={(t) => {
          setActiveThemeKey(t);
          setPatientIdx(0);
          setHealth(25);
        }}
        activeLevel={activeLevel}
        setActiveLevel={setActiveLevel}
        soundEnabled={soundEnabled}
        toggleSound={() => {
          audioEngine.enabled = !soundEnabled;
          setSoundEnabled(!soundEnabled);
        }}
        stars={stars}
        unlockedCount={unlockedStickers.length}
        activeChildName={activeChild.name}
        onOpenChildModal={() => setIsChildModalOpen(true)}
        onOpenAlbum={() => setIsAlbumOpen(true)}
      />

      <div className="w-full grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Hero Character Stage */}
        <DinoStage
          patient={currentPatient}
          health={health}
          isHappy={isHappy}
          statusAction={activeTheme.statusAction}
        />

        {/* Interactive Workspace Panel */}
        <section className="glass-panel rounded-[36px] p-6 shadow-2xl flex flex-col gap-5">
          <div className="text-center p-4 bg-white/5 rounded-[24px] border border-white/10 flex justify-center items-center gap-3.5 shadow-inner">
            <button
              onClick={() => audioEngine.speak(speechPrompt)}
              className="bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xl w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
            >
              🔊
            </button>

            <div className="text-3xl font-extrabold tracking-tight">
              {activeSubject === 'math' ? (
                num1 === 0 ? (
                  <>Add {num2}: <span className="text-amber-300">Count to {num2}</span></>
                ) : (
                  <>Add {num2}: <span className="text-amber-300">{num1} + {num2} = ?</span></>
                )
              ) : (
                <>Spell: <span className="text-amber-300">{targetWord}</span></>
              )}
            </div>
          </div>

          {/* Place Value Banner */}
          {activeSubject === 'math' && (
            <div className="bg-black/30 border border-amber-400/40 rounded-[24px] px-6 py-3.5 flex justify-around items-center font-bold text-xl shadow-inner">
              <div className="text-amber-300">{num1} ({num1 === 10 ? '1 Ten' : 'Base'})</div>
              <div className="text-slate-400">+</div>
              <div className="text-sky-300">{placedOnes} (Ones)</div>
              <div className="text-slate-400">=</div>
              <div className="text-emerald-300 text-2xl font-extrabold">{num1 + placedOnes}</div>
            </div>
          )}

          {/* Dynamic Workspace */}
          {activeSubject === 'math' ? (
            <TenFrameWorkspace
              num1={num1}
              num2={num2}
              placedOnes={placedOnes}
              theme={activeTheme}
              onSlotClick={handleSlotClick}
              onBaseClick={(i) => audioEngine.playTap(i)}
            />
          ) : (
            <PhonicsWorkspace
              targetWord={targetWord}
              userWord={userWord}
              onLetterClick={handleLetterClick}
            />
          )}
        </section>
      </div>

      <VictoryModal
        isOpen={isVictoryOpen}
        dinoIcon={currentPatient.icon}
        patientName={currentPatient.name}
        onNext={handleNextPatient}
      />

      <StickerAlbumModal
        isOpen={isAlbumOpen}
        unlockedStickers={unlockedStickers}
        onClose={() => setIsAlbumOpen(false)}
      />

      <ChildProfileModal
        isOpen={isChildModalOpen}
        profiles={profiles}
        activeId={activeChildId}
        onSelectChild={handleSelectChild}
        onAddChild={handleAddChild}
        onClose={() => setIsChildModalOpen(false)}
      />
    </main>
  );
}

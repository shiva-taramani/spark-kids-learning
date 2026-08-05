'use client';

import React, { useState } from 'react';
import { audioEngine } from '../lib/audioEngine';

interface CircuitWorkspaceProps {
  onSuccess: () => void;
}

type Material = {
  id: string;
  name: string;
  icon: string;
  isConductor: boolean;
  explanation: string;
};

const MATERIALS: Material[] = [
  { id: 'copper', name: 'Copper Wire', icon: '🪙', isConductor: true, explanation: 'Copper is a great conductor! Electrons flow easily.' },
  { id: 'spoon', name: 'Plastic Spoon', icon: '🥄', isConductor: false, explanation: 'Plastic is an insulator! It stops electric current.' },
  { id: 'wood', name: 'Wooden Stick', icon: '🪵', isConductor: false, explanation: 'Wood is an insulator! Current cannot flow.' },
  { id: 'nail', name: 'Iron Nail', icon: '📌', isConductor: true, explanation: 'Iron metal conducts electricity well!' },
];

export const CircuitWorkspace: React.FC<CircuitWorkspaceProps> = ({ onSuccess }) => {
  const [level, setLevel] = useState<1 | 2 | 3>(1);

  // Level 1 State
  const [wireRedConnected, setWireRedConnected] = useState(false);
  const [wireBlackConnected, setWireBlackConnected] = useState(false);
  const [switchOnL1, setSwitchOnL1] = useState(false);
  const [shortCircuitError, setShortCircuitError] = useState(false);

  // Level 2 State (Conductors vs Insulators)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [switchOnL2, setSwitchOnL2] = useState(false);
  const [l2Feedback, setL2Feedback] = useState<string | null>(null);

  // Level 3 State (Series vs Parallel)
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series');
  const [switchOnL3, setSwitchOnL3] = useState(false);

  // --- Level 1 Handlers ---
  const handleConnectRed = () => {
    audioEngine.playTap(3);
    setWireRedConnected(!wireRedConnected);
    setShortCircuitError(false);
  };

  const handleConnectBlack = () => {
    audioEngine.playTap(5);
    setWireBlackConnected(!wireBlackConnected);
    setShortCircuitError(false);
  };

  const handleDirectShort = () => {
    audioEngine.playTap(1);
    setShortCircuitError(true);
    audioEngine.speak(
      "Whoops! That is a short circuit! Connecting red and black wires directly gets the AA battery hot without powering a light. Always connect through a light bulb or switch!"
    );
  };

  const handleToggleSwitchL1 = () => {
    audioEngine.initCtx();
    audioEngine.playTap(8);
    const nextState = !switchOnL1;
    setSwitchOnL1(nextState);

    if (wireRedConnected && wireBlackConnected && nextState) {
      audioEngine.playBubble();
      audioEngine.speak("Success! Complete circuit! The LED light is powered safely!");
      setTimeout(() => {
        onSuccess();
        setLevel(2);
      }, 1000);
    }
  };

  const isL1Lit = wireRedConnected && wireBlackConnected && switchOnL1;

  // --- Level 2 Handlers ---
  const handleSelectMaterial = (mat: Material) => {
    audioEngine.playTap(4);
    setSelectedMaterial(mat);
    setL2Feedback(null);
    setSwitchOnL2(false);
  };

  const handleToggleSwitchL2 = () => {
    audioEngine.initCtx();
    audioEngine.playTap(8);
    if (!selectedMaterial) {
      setL2Feedback('Please pick a material to insert into the circuit gap first!');
      return;
    }
    const next = !switchOnL2;
    setSwitchOnL2(next);

    if (next) {
      if (selectedMaterial.isConductor) {
        audioEngine.playBubble();
        setL2Feedback(`⚡ SUCCESS! ${selectedMaterial.explanation}`);
        audioEngine.speak(`Awesome! ${selectedMaterial.explanation}`);
        setTimeout(() => {
          onSuccess();
          setLevel(3);
        }, 1200);
      } else {
        audioEngine.playTap(1);
        setL2Feedback(`❌ NO CURRENT: ${selectedMaterial.explanation}`);
        audioEngine.speak(selectedMaterial.explanation);
      }
    }
  };

  const isL2Lit = selectedMaterial?.isConductor && switchOnL2;

  // --- Level 3 Handlers ---
  const handleSelectCircuitType = (type: 'series' | 'parallel') => {
    audioEngine.playTap(6);
    setCircuitType(type);
    setSwitchOnL3(false);
  };

  const handleToggleSwitchL3 = () => {
    audioEngine.initCtx();
    audioEngine.playTap(8);
    const next = !switchOnL3;
    setSwitchOnL3(next);

    if (next) {
      audioEngine.playBubble();
      if (circuitType === 'parallel') {
        audioEngine.speak("Parallel Circuit! Both LEDs get full voltage and shine brightly!");
      } else {
        audioEngine.speak("Series Circuit! LEDs share the voltage and glow with medium brightness.");
      }
      setTimeout(onSuccess, 1200);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Level Selector Tabs */}
      <div className="flex gap-2 justify-center bg-slate-900/60 p-2 rounded-2xl border border-white/10">
        <button
          onClick={() => setLevel(1)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            level === 1
              ? 'bg-amber-400 text-slate-950 shadow-lg'
              : 'text-slate-400 hover:bg-white/5'
          }`}
        >
          Level 1: Basic Circuit 🔋
        </button>
        <button
          onClick={() => setLevel(2)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            level === 2
              ? 'bg-amber-400 text-slate-950 shadow-lg'
              : 'text-slate-400 hover:bg-white/5'
          }`}
        >
          Level 2: Conductors 🪙
        </button>
        <button
          onClick={() => setLevel(3)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            level === 3
              ? 'bg-amber-400 text-slate-950 shadow-lg'
              : 'text-slate-400 hover:bg-white/5'
          }`}
        >
          Level 3: Series vs Parallel 💡
        </button>
      </div>

      {/* SHORT CIRCUIT WARNING BANNER */}
      {shortCircuitError && (
        <div className="bg-rose-500/20 border-2 border-rose-400 text-rose-300 p-4 rounded-2xl text-center text-xs font-bold animate-bounce">
          ⚡ SHORT CIRCUIT WARNING! Direct Red (+) to Black (-) connection causes high heat! Always connect through a light bulb or switch!
        </div>
      )}

      {/* ================= LEVEL 1 ================= */}
      {level === 1 && (
        <div className="bg-slate-950/80 rounded-[32px] p-6 border-2 border-emerald-500/30 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
          {isL1Lit && <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse" />}

          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span className="text-emerald-400">⚡ LEVEL 1: AA BATTERY 1.5V LAB</span>
            <span>Target: Connect wires and switch to light the LED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Battery */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2">
              <div className="text-4xl">🔋</div>
              <div className="font-extrabold text-xs text-slate-200">AA Battery (1.5V)</div>
              
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleConnectRed}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    wireRedConnected
                      ? 'bg-rose-500 text-white shadow-lg scale-105'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/40'
                  }`}
                >
                  🔴 Red Wire (+)
                </button>

                <button
                  onClick={handleConnectBlack}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    wireBlackConnected
                      ? 'bg-slate-700 text-white shadow-lg scale-105'
                      : 'bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700'
                  }`}
                >
                  🖤 Black Wire (-)
                </button>
              </div>

              <button
                onClick={handleDirectShort}
                className="text-[10px] text-rose-400 underline mt-1 hover:text-rose-300"
              >
                ⚠️ Touch Red to Black Direct?
              </button>
            </div>

            {/* Switch */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-3">
              <div className="text-4xl">🔘</div>
              <div className="font-extrabold text-xs text-slate-200">Toggle Switch</div>
              <button
                onClick={handleToggleSwitchL1}
                className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                  switchOnL1
                    ? 'bg-emerald-400 text-slate-950 shadow-lg scale-105'
                    : 'bg-white/10 text-slate-400 border border-white/15'
                }`}
              >
                {switchOnL1 ? 'SWITCH ON 🟢' : 'SWITCH OFF 🔴'}
              </button>
            </div>

            {/* LED Light */}
            <div
              className={`bg-white/5 border rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${
                isL1Lit
                  ? 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)] scale-105'
                  : 'border-white/10'
              }`}
            >
              <div className={`text-5xl transition-transform ${isL1Lit ? 'animate-bounce' : 'opacity-40'}`}>
                💡
              </div>
              <div className="font-extrabold text-xs text-slate-200">Green LED Light</div>
              <div className={`text-[11px] font-bold ${isL1Lit ? 'text-emerald-300' : 'text-slate-500'}`}>
                {isL1Lit ? 'POWERED SAFE! ⚡' : 'Waiting for closed circuit...'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= LEVEL 2 ================= */}
      {level === 2 && (
        <div className="bg-slate-950/80 rounded-[32px] p-6 border-2 border-sky-500/30 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
          {isL2Lit && <div className="absolute inset-0 bg-sky-500/10 pointer-events-none animate-pulse" />}

          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span className="text-sky-400">⚡ LEVEL 2: CONDUCTORS VS INSULATORS</span>
            <span>Target: Find a material that conducts electricity to power the light</span>
          </div>

          {/* Material Picker */}
          <div>
            <div className="text-xs font-bold text-slate-300 mb-2">Select a test item for the circuit gap:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MATERIALS.map((mat) => {
                const isSelected = selectedMaterial?.id === mat.id;
                return (
                  <button
                    key={mat.id}
                    onClick={() => handleSelectMaterial(mat)}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'border-sky-400 bg-sky-400/20 shadow-lg scale-105'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-3xl">{mat.icon}</span>
                    <span className="text-xs font-bold text-slate-200">{mat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Circuit Simulator Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center border-t border-white/10 pt-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-3xl">🔋</div>
              <div className="text-xs font-bold text-slate-200 mt-1">AA Battery Pack</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2">
              <div className="text-xs font-bold text-slate-400">TEST GAP</div>
              <div className="text-2xl">{selectedMaterial ? selectedMaterial.icon : '❓'}</div>
              <button
                onClick={handleToggleSwitchL2}
                className={`w-full py-2 rounded-xl font-extrabold text-xs transition-all ${
                  switchOnL2
                    ? 'bg-sky-400 text-slate-950 shadow-lg'
                    : 'bg-white/10 text-slate-400 border border-white/15'
                }`}
              >
                {switchOnL2 ? 'POWER ON 🟢' : 'POWER OFF 🔴'}
              </button>
            </div>

            <div
              className={`bg-white/5 border rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${
                isL2Lit
                  ? 'border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.5)] scale-105'
                  : 'border-white/10'
              }`}
            >
              <div className={`text-5xl ${isL2Lit ? 'animate-bounce' : 'opacity-40'}`}>
                💡
              </div>
              <div className="font-extrabold text-xs text-slate-200">Test Light</div>
            </div>
          </div>

          {l2Feedback && (
            <div
              className={`p-3 rounded-xl text-center text-xs font-bold ${
                isL2Lit ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {l2Feedback}
            </div>
          )}
        </div>
      )}

      {/* ================= LEVEL 3 ================= */}
      {level === 3 && (
        <div className="bg-slate-950/80 rounded-[32px] p-6 border-2 border-purple-500/30 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
          {switchOnL3 && <div className="absolute inset-0 bg-purple-500/10 pointer-events-none animate-pulse" />}

          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span className="text-purple-400">⚡ LEVEL 3: SERIES VS PARALLEL CIRCUITS</span>
            <span>Target: Compare current flow and bulb brightness</span>
          </div>

          {/* Topology Selector */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSelectCircuitType('series')}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                circuitType === 'series'
                  ? 'border-purple-400 bg-purple-400/20 shadow-lg scale-105'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className="text-3xl">🔗</span>
              <span className="text-xs font-bold text-slate-100">Series Circuit</span>
              <span className="text-[10px] text-slate-400">Single line path (Bulbs share voltage)</span>
            </button>

            <button
              onClick={() => handleSelectCircuitType('parallel')}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                circuitType === 'parallel'
                  ? 'border-purple-400 bg-purple-400/20 shadow-lg scale-105'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className="text-3xl">🔀</span>
              <span className="text-xs font-bold text-slate-100">Parallel Circuit</span>
              <span className="text-[10px] text-slate-400">Multiple branch paths (Full voltage each)</span>
            </button>
          </div>

          {/* Active Circuit Visualization */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col items-center gap-4">
            <div className="flex items-center gap-8">
              <div className="text-4xl">🔋</div>
              <button
                onClick={handleToggleSwitchL3}
                className={`px-6 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                  switchOnL3
                    ? 'bg-purple-400 text-slate-950 shadow-lg scale-105'
                    : 'bg-white/10 text-slate-400 border border-white/15'
                }`}
              >
                {switchOnL3 ? 'CIRCUIT CLOSED 🟢' : 'CIRCUIT OPEN 🔴'}
              </button>
            </div>

            {/* Bulbs output */}
            <div className="flex gap-8 items-center mt-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`text-5xl transition-all ${
                    switchOnL3
                      ? circuitType === 'parallel'
                        ? 'text-amber-300 drop-shadow-[0_0_20px_rgba(252,211,77,1)] scale-110'
                        : 'text-amber-400/70 drop-shadow-[0_0_10px_rgba(252,211,77,0.4)]'
                      : 'opacity-30'
                  }`}
                >
                  💡
                </div>
                <span className="text-[11px] font-bold text-slate-300">Bulb 1</span>
              </div>

              <div className="text-xl text-purple-300 font-bold">
                {circuitType === 'series' ? '── ──' : '║ ║'}
              </div>

              <div className="flex flex-col items-center gap-1">
                <div
                  className={`text-5xl transition-all ${
                    switchOnL3
                      ? circuitType === 'parallel'
                        ? 'text-amber-300 drop-shadow-[0_0_20px_rgba(252,211,77,1)] scale-110'
                        : 'text-amber-400/70 drop-shadow-[0_0_10px_rgba(252,211,77,0.4)]'
                      : 'opacity-30'
                  }`}
                >
                  💡
                </div>
                <span className="text-[11px] font-bold text-slate-300">Bulb 2</span>
              </div>
            </div>

            {switchOnL3 && (
              <div className="text-xs font-bold text-purple-300 bg-purple-500/20 px-4 py-2 rounded-xl border border-purple-400/30 mt-2">
                {circuitType === 'parallel'
                  ? '⚡ Parallel Advantage: Both bulbs get full 1.5V battery power and shine BRIGHT!'
                  : '🔋 Series Tradeoff: Bulbs share the 1.5V battery power, so each glows dimmer!'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


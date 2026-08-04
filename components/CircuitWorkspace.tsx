'use client';

import React, { useState } from 'react';
import { audioEngine } from '../lib/audioEngine';

interface CircuitWorkspaceProps {
  onSuccess: () => void;
}

export const CircuitWorkspace: React.FC<CircuitWorkspaceProps> = ({ onSuccess }) => {
  const [wireRedConnected, setWireRedConnected] = useState(false);
  const [wireBlackConnected, setWireBlackConnected] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [shortCircuitError, setShortCircuitError] = useState(false);

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
      "Whoops! That is a short circuit! Connecting the red and black wires directly gets the battery hot without powering a light. Always connect through a light bulb or switch!"
    );
  };

  const handleToggleSwitch = () => {
    audioEngine.initCtx();
    audioEngine.playTap(8);
    const nextState = !switchOn;
    setSwitchOn(nextState);

    if (wireRedConnected && wireBlackConnected && nextState) {
      audioEngine.playBubble();
      audioEngine.speak("Success! Complete circuit! The LED light is powered safely!");
      setTimeout(onSuccess, 600);
    }
  };

  const isCircuitLit = wireRedConnected && wireBlackConnected && switchOn;

  return (
    <div className="flex flex-col gap-5">
      {/* Short Circuit Warning Banner */}
      {shortCircuitError && (
        <div className="bg-rose-500/20 border-2 border-rose-400 text-rose-300 p-4 rounded-2xl text-center text-xs font-bold animate-bounce">
          ⚡ CANCELED! Direct Red (+) to Black (-) connection causes a short circuit! Always connect through a light bulb or switch!
        </div>
      )}

      {/* Circuit Board Container */}
      <div className="bg-slate-950/80 rounded-[32px] p-6 border-2 border-emerald-500/30 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
        {/* Ambient Circuit Glow */}
        {isCircuitLit && (
          <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse" />
        )}

        <div className="flex justify-between items-center text-xs font-bold text-slate-400">
          <span className="text-emerald-400">⚡ BREADBOARD LAB (AA BATTERY 1.5V)</span>
          <span>Target: Light the LED safely</span>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* 1. Power Source (AA Battery) */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2">
            <div className="text-4xl">🔋</div>
            <div className="font-extrabold text-xs text-slate-200">AA Battery Pack</div>
            
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

            {/* Direct Touch Danger Button */}
            <button
              onClick={handleDirectShort}
              className="text-[10px] text-rose-400 underline mt-1 hover:text-rose-300"
            >
              ⚠️ Touch Red to Black Direct?
            </button>
          </div>

          {/* 2. Switch Element */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-3">
            <div className="text-4xl">🔘</div>
            <div className="font-extrabold text-xs text-slate-200">Toggle Switch</div>
            <button
              onClick={handleToggleSwitch}
              className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                switchOn
                  ? 'bg-emerald-400 text-slate-950 shadow-lg scale-105'
                  : 'bg-white/10 text-slate-400 border border-white/15'
              }`}
            >
              {switchOn ? 'SWITCH ON 🟢' : 'SWITCH OFF 🔴'}
            </button>
          </div>

          {/* 3. Output Load (LED Light) */}
          <div
            className={`bg-white/5 border rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${
              isCircuitLit
                ? 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)] scale-105'
                : 'border-white/10'
            }`}
          >
            <div className={`text-5xl transition-transform ${isCircuitLit ? 'animate-bounce' : 'opacity-40'}`}>
              💡
            </div>
            <div className="font-extrabold text-xs text-slate-200">Green LED Light</div>
            <div className={`text-[11px] font-bold ${isCircuitLit ? 'text-emerald-300' : 'text-slate-500'}`}>
              {isCircuitLit ? 'POWERED SAFE! ⚡' : 'Waiting for circuit...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

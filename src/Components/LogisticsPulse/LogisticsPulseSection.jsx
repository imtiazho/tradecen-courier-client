import React, { useState, useEffect } from 'react';
import { LogisticsNetwork } from './LogisticsNetwork';
import { PHILOSOPHY_WORDS } from '../../data/logisticsPulseData';
import { Play, Pause, Camera, Radio } from 'lucide-react';

export function LogisticsPulseSection() {
  const [philosophyIndex, setPhilosophyIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Rotate philosophy words every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPhilosophyIndex(prev => (prev + 1) % PHILOSOPHY_WORDS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentPhilosophy = PHILOSOPHY_WORDS[philosophyIndex];

  return (
    <section id="logistics-pulse" className="mt-12 w-full h-[500px] relative bg-secondary overflow-hidden select-none border-t border-white/10 rounded-[25px]">
      {/* 3D Network Background Canvas */}
      <div className="absolute inset-0 z-0">
        <LogisticsNetwork autoRotate={autoRotate} isPaused={isPaused} />
      </div>

      {/* Top Header Typography Overlay */}
      {/* <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10 pointer-events-none max-w-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#CAEB66] animate-pulse"></span>
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#CAEB66] uppercase">
            Living Network System
          </span>
        </div>

        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white uppercase font-mono">
          The Logistics Pulse
        </h2>

        <p className="text-xs md:text-sm text-slate-400 font-medium mt-1.5 leading-relaxed">
          Every delivery is part of a larger connected journey.
        </p>
      </div> */}

      {/* Philosophy Rotating Badge Overlay */}
      {/* <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10 pointer-events-none">
        <div className="glass-panel px-4 py-3 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-end transition-all duration-500">
          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-0.5">
            Core Logistics Principle
          </div>
          <div className="text-lg font-extrabold tracking-wider text-[#CAEB66] font-mono animate-in fade-in duration-500 key={currentPhilosophy.word}">
            {currentPhilosophy.word}
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5 text-right">
            {currentPhilosophy.caption}
          </p>
        </div>
      </div> */}

      {/* Minimal Floating Control UI */}
      <div className="absolute bottom-16 right-6 md:bottom-20 md:right-8 z-10 pointer-events-auto flex items-center gap-2">
        {/* Live Network Status Indicator */}
        <div className="glass-pill px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-xl">
          <Radio className={`w-3.5 h-3.5 ${isPaused ? 'text-amber-400' : 'text-[#CAEB66] animate-pulse'}`} />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            {isPaused ? 'PAUSED' : 'LIVE NETWORK'}
          </span>
        </div>

        {/* Auto Camera Toggle */}
        <button
          onClick={() => setAutoRotate(prev => !prev)}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 flex items-center gap-1.5 border ${
            autoRotate
              ? 'bg-[#CAEB66]/20 border-[#CAEB66] text-[#CAEB66]'
              : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Auto Cam</span>
        </button>

        {/* Pause / Resume Flow Toggle */}
        <button
          onClick={() => setIsPaused(prev => !prev)}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 flex items-center gap-1.5 border ${
            isPaused
              ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
              : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white'
          }`}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-slate-950" /> : <Pause className="w-3.5 h-3.5" />}
          <span>{isPaused ? 'Resume Flow' : 'Pause Flow'}</span>
        </button>
      </div>

      {/* Bottom Subtle Signature Tagline */}
      <div className="absolute bottom-6 left-0 w-full z-10 pointer-events-none flex justify-center">
        <p className="text-xs text-slate-500 font-mono font-medium tracking-widest uppercase opacity-75">
          “Behind every delivery, there is a network in motion.”
        </p>
      </div>
    </section>
  );
}

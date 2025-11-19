import React from 'react';
import { Button } from './Button';
import { GlitchText } from './GlitchText';

export const IntroPhase: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative z-10 p-8">
      <div className="max-w-2xl text-center space-y-12">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.5em] text-zinc-500 uppercase">Sequence 01</p>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-white leading-none">
            <GlitchText text="URBAN" />
            <br />
            <span className="text-zinc-600">ASCENT</span>
          </h1>
        </div>

        <div className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed max-w-md mx-auto border-l-2 border-lime-500 pl-6 text-left">
          <p>08:00 / MARKET NEGOTIATION</p>
          <p className="opacity-50">Selection is survival.</p>
          <br />
          <p>14:00 / VERTICAL ENDURANCE</p>
          <p className="opacity-50">Gravity is the only opponent.</p>
        </div>

        <div className="pt-12">
          <Button onClick={onStart}>Initiate Routine</Button>
        </div>
      </div>

      {/* Decorative BG Elements */}
      <div className="absolute bottom-10 right-10 w-32 h-32 border border-zinc-800 rounded-full animate-spin-slow opacity-30 border-dashed" />
    </div>
  );
};

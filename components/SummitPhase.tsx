import React, { useEffect, useState } from 'react';
import { GameState } from '../types';
import { Button } from './Button';
import { generateSummitReflection } from '../services/geminiService';
import { RefreshCw } from 'lucide-react';

interface SummitPhaseProps {
  gameState: GameState;
  onRestart: () => void;
}

export const SummitPhase: React.FC<SummitPhaseProps> = ({ gameState, onRestart }) => {
  const [reflection, setReflection] = useState<string | null>(null);

  useEffect(() => {
    const fetchReflection = async () => {
      const text = await generateSummitReflection(gameState.inventory, gameState.score);
      setReflection(text);
    };
    fetchReflection();
  }, [gameState]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative z-10 bg-zinc-200 text-black p-8 transition-colors duration-1000">
      <div className="max-w-xl w-full space-y-12 relative">
        
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-lime-300 rounded-full blur-[100px] opacity-40 mix-blend-multiply" />
        
        <div className="relative">
          <p className="font-mono text-xs tracking-widest mb-4 text-zinc-500">ALTITUDE: 2890M // HEART RATE: RESTING</p>
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-none tracking-tighter">
            PEAK
            <br />
            STATE
          </h1>
        </div>

        <div className="min-h-[150px] border-l-2 border-black pl-6 flex flex-col justify-center">
          {reflection ? (
            <div className="font-mono text-sm md:text-base whitespace-pre-line uppercase tracking-wide leading-loose animate-fadeIn">
              {reflection}
            </div>
          ) : (
            <p className="animate-pulse font-mono text-xs">ANALYZING BIOMETRICS...</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-zinc-300 pt-8 font-mono text-sm">
          <div>
            <span className="block text-zinc-500 text-xs mb-1">FUEL SOURCE</span>
            {gameState.inventory.map(i => i.name).join(' + ')}
          </div>
          <div className="text-right">
             <span className="block text-zinc-500 text-xs mb-1">TOTAL ASCENT</span>
             {gameState.score}M
          </div>
        </div>

        <div className="pt-8 flex justify-center">
          <Button onClick={onRestart} variant="primary" className="bg-black text-white hover:bg-zinc-800">
            <span className="flex items-center gap-2">
               <RefreshCw size={16} />
               REPEAT CYCLE
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

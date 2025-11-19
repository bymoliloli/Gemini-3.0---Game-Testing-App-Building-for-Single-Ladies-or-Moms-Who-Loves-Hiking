import React, { useEffect, useState } from 'react';
import { Ingredient } from '../types';
import { Button } from './Button';
import { Flame } from 'lucide-react';

interface KitchenPhaseProps {
  inventory: Ingredient[];
  onComplete: (stats: { maxStamina: number; agility: number }) => void;
}

export const KitchenPhase: React.FC<KitchenPhaseProps> = ({ inventory, onComplete }) => {
  const [isCooking, setIsCooking] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalEnergy = inventory.reduce((acc, item) => acc + item.energy, 0);
  const totalWeight = inventory.reduce((acc, item) => acc + item.weight, 0);
  
  // Agility is inverse of weight, normalized roughly 0-1
  const agility = Math.max(0.1, 1 - (totalWeight / 15)); 
  const maxStamina = totalEnergy * 10;

  const handleCook = () => {
    setIsCooking(true);
  };

  useEffect(() => {
    if (isCooking) {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => onComplete({ maxStamina, agility }), 500);
            return 100;
          }
          return p + 1;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [isCooking, onComplete, maxStamina, agility]);

  return (
    <div className="h-full w-full flex items-center justify-center relative bg-black">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

       <div className="relative z-10 w-full max-w-md p-8 border border-zinc-800 bg-black/80 backdrop-blur-sm">
          {!isCooking ? (
            <>
              <h2 className="text-4xl font-display text-center mb-8">PREPARATION</h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                  <span className="text-zinc-500 tracking-widest text-sm">INPUT</span>
                  <div className="flex gap-2">
                    {inventory.map(i => (
                      <div key={i.id} className="w-2 h-2 bg-lime-500 rounded-full animate-pulse" />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-zinc-900 p-4 border border-zinc-800">
                      <p className="text-zinc-500 text-xs mb-1">EST. ENERGY</p>
                      <p className="text-2xl font-mono text-white">{maxStamina}</p>
                   </div>
                   <div className="bg-zinc-900 p-4 border border-zinc-800">
                      <p className="text-zinc-500 text-xs mb-1">AGILITY FACTOR</p>
                      <p className="text-2xl font-mono text-white">{(agility * 100).toFixed(0)}%</p>
                   </div>
                </div>
              </div>

              <Button onClick={handleCook} className="w-full">
                <div className="flex items-center justify-center gap-2">
                  <Flame size={16} />
                  INITIATE PROCESS
                </div>
              </Button>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="font-mono text-6xl font-bold text-lime-500 glitch-effect">
                {progress}%
              </div>
              <p className="tracking-[0.5em] text-xs animate-pulse text-zinc-400">INTEGRATING NUTRIENTS</p>
              
              <div className="h-1 w-full bg-zinc-900 mt-8">
                <div 
                  className="h-full bg-white transition-all duration-75 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          )}
       </div>
    </div>
  );
};

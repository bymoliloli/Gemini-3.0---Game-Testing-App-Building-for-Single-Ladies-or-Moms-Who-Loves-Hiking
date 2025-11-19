import React, { useState } from 'react';
import { GamePhase, GameState, Ingredient } from './types';
import { IntroPhase } from './components/IntroPhase';
import { MarketPhase } from './components/MarketPhase';
import { KitchenPhase } from './components/KitchenPhase';
import { HikePhase } from './components/HikePhase';
import { SummitPhase } from './components/SummitPhase';

const INITIAL_STATE: GameState = {
  inventory: [],
  cookedDish: null,
  stats: {
    maxStamina: 100,
    agility: 1
  },
  score: 0
};

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.INTRO);
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  const handleMarketComplete = (inventory: Ingredient[]) => {
    setGameState(prev => ({ ...prev, inventory }));
    setPhase(GamePhase.KITCHEN);
  };

  const handleKitchenComplete = (stats: { maxStamina: number; agility: number }) => {
    setGameState(prev => ({ ...prev, stats }));
    setPhase(GamePhase.HIKE);
  };

  const handleHikeComplete = (result: { distance: number; time: number }) => {
    setGameState(prev => ({ ...prev, score: result.distance }));
    setPhase(GamePhase.SUMMIT);
  };

  const handleHikeFail = () => {
    alert("Exhaustion reached. The mountain claimed you today.");
    setPhase(GamePhase.INTRO);
    setGameState(INITIAL_STATE);
  };

  const restart = () => {
    setPhase(GamePhase.INTRO);
    setGameState(INITIAL_STATE);
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden font-sans text-white select-none">
      
      {phase === GamePhase.INTRO && (
        <IntroPhase onStart={() => setPhase(GamePhase.MARKET)} />
      )}

      {phase === GamePhase.MARKET && (
        <MarketPhase onComplete={handleMarketComplete} />
      )}

      {phase === GamePhase.KITCHEN && (
        <KitchenPhase 
          inventory={gameState.inventory} 
          onComplete={handleKitchenComplete} 
        />
      )}

      {phase === GamePhase.HIKE && (
        <HikePhase 
          stats={gameState.stats} 
          onComplete={handleHikeComplete}
          onFail={handleHikeFail}
        />
      )}

      {phase === GamePhase.SUMMIT && (
        <SummitPhase 
          gameState={gameState} 
          onRestart={restart} 
        />
      )}

    </div>
  );
}

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from './Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface HikePhaseProps {
  stats: { maxStamina: number; agility: number };
  onComplete: (result: { distance: number; time: number }) => void;
  onFail: () => void;
}

// Game Constants
const LANE_WIDTH = 100; // virtual pixels
const GAME_WIDTH = 400; // 4 lanes equivalent
const PLAYER_SIZE = 40;

export const HikePhase: React.FC<HikePhaseProps> = ({ stats, onComplete, onFail }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stamina, setStamina] = useState(stats.maxStamina);
  const [distance, setDistance] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  // Game State Ref to avoid closure staleness in animation loop
  const gameState = useRef({
    playerX: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
    targetX: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
    speed: 4 + (stats.agility * 2), // Agility affects base speed
    obstacles: [] as { x: number; y: number; type: 'rock' | 'water' | 'oxygen'; width: number; height: number }[],
    lastSpawn: 0,
    distance: 0,
    stamina: stats.maxStamina,
    running: true,
    time: 0
  });

  const handleLeft = useCallback(() => {
    gameState.current.targetX = Math.max(0, gameState.current.targetX - 80);
  }, []);

  const handleRight = useCallback(() => {
    gameState.current.targetX = Math.min(GAME_WIDTH - PLAYER_SIZE, gameState.current.targetX + 80);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleLeft();
      if (e.key === 'ArrowRight') handleRight();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLeft, handleRight]);

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const GOAL_DISTANCE = 2000; // Meters to hike

    // Canvas sizing for high DPI
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const loop = (timestamp: number) => {
      if (!gameState.current.running) return;

      const state = gameState.current;
      const scaleX = canvas.width / GAME_WIDTH;
      const scaleY = canvas.height / 800; // Virtual height 800

      // Clear
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Road/Path (Abstract lines)
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for(let i=1; i<5; i++) {
         const x = (i * (GAME_WIDTH/5)) * scaleX;
         ctx.moveTo(x, 0);
         ctx.lineTo(x, canvas.height);
      }
      ctx.stroke();

      // Update Player Position (Lerp for smoothness)
      state.playerX += (state.targetX - state.playerX) * 0.15; // Smooth movement

      // Move Obstacles
      state.obstacles.forEach(obs => {
        obs.y += state.speed;
      });

      // Spawn Obstacles
      if (timestamp - state.lastSpawn > 1000 / (state.speed * 0.2)) {
        const typeRoll = Math.random();
        let type: 'rock' | 'water' | 'oxygen' = 'rock';
        if (typeRoll > 0.8) type = 'water';
        else if (typeRoll > 0.95) type = 'oxygen';

        const lane = Math.floor(Math.random() * 5);
        // Center in lane
        const laneCenter = (lane * (GAME_WIDTH/5)) + ((GAME_WIDTH/5)/2);
        
        state.obstacles.push({
          x: laneCenter - (type === 'rock' ? 30 : 20), 
          y: -100,
          type: type,
          width: type === 'rock' ? 60 : 40,
          height: type === 'rock' ? 50 : 40
        });
        state.lastSpawn = timestamp;
      }

      // Cleanup Obstacles
      state.obstacles = state.obstacles.filter(obs => obs.y < 800 + 100); // 800 virtual height

      // Collision Detection
      const playerRect = { x: state.playerX + 5, y: 650, width: PLAYER_SIZE - 10, height: PLAYER_SIZE };
      
      // Check collisions backwards to allow removal
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        const obsRect = { x: obs.x, y: obs.y, width: obs.width, height: obs.height };

        if (
          playerRect.x < obsRect.x + obsRect.width &&
          playerRect.x + playerRect.width > obsRect.x &&
          playerRect.y < obsRect.y + obsRect.height &&
          playerRect.height + playerRect.y > obsRect.y
        ) {
          // Collision
          if (obs.type === 'rock') {
            state.stamina -= 200; // Hit Penalty
            // Shake effect visual (simplified)
            ctx.fillStyle = 'white'; 
            ctx.fillRect(0,0,canvas.width,canvas.height);
            state.obstacles.splice(i, 1);
          } else if (obs.type === 'water') {
             state.stamina = Math.min(stats.maxStamina, state.stamina + 150);
             state.obstacles.splice(i, 1);
          } else if (obs.type === 'oxygen') {
             state.speed += 0.5; // Boost
             state.obstacles.splice(i, 1);
          }
        }
      }

      // Draw Player (Triangle/Futuristic Shape)
      const px = state.playerX * scaleX;
      const py = 650 * scaleY;
      const pSize = PLAYER_SIZE * scaleX;

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(px + pSize/2, py);
      ctx.lineTo(px + pSize, py + pSize);
      ctx.lineTo(px, py + pSize);
      ctx.fill();
      
      // Player Glow
      ctx.shadowColor = '#84cc16'; // Lime
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Obstacles
      state.obstacles.forEach(obs => {
        const ox = obs.x * scaleX;
        const oy = obs.y * scaleY;
        const ow = obs.width * scaleX;
        const oh = obs.height * scaleY;

        if (obs.type === 'rock') {
          ctx.fillStyle = '#3f3f46'; // Zinc 700
          ctx.fillRect(ox, oy, ow, oh);
          // X pattern
          ctx.strokeStyle = '#52525b';
          ctx.beginPath();
          ctx.moveTo(ox, oy); ctx.lineTo(ox+ow, oy+oh);
          ctx.moveTo(ox+ow, oy); ctx.lineTo(ox, oy+oh);
          ctx.stroke();
        } else if (obs.type === 'water') {
          ctx.fillStyle = '#06b6d4'; // Cyan
          ctx.beginPath();
          ctx.arc(ox + ow/2, oy + oh/2, ow/2, 0, Math.PI * 2);
          ctx.fill();
        } else if (obs.type === 'oxygen') {
          ctx.fillStyle = '#fff';
          ctx.fillRect(ox, oy, ow, oh);
          ctx.strokeStyle = '#000';
          ctx.strokeRect(ox+2, oy+2, ow-4, oh-4);
        }
      });

      // Update Stats
      state.stamina -= 0.5; // Constant drain
      state.distance += state.speed / 10;
      state.time += 16; // ms

      // Sync React State for UI
      if (Math.random() > 0.9) { // Throttle updates
        setStamina(state.stamina);
        setDistance(Math.floor(state.distance));
      }

      // Win/Loss Condition
      if (state.stamina <= 0) {
        state.running = false;
        setGameOver(true);
        onFail();
      } else if (state.distance >= GOAL_DISTANCE) {
        state.running = false;
        onComplete({ distance: Math.floor(state.distance), time: state.time });
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [stats, onComplete, onFail]);


  return (
    <div className="h-full w-full relative bg-black flex flex-col">
      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
         <div>
           <h3 className="text-lime-500 text-xs tracking-[0.3em] mb-2">VITALS MONITOR</h3>
           <div className="flex items-end gap-2">
             <span className="text-4xl font-mono font-bold">{Math.max(0, Math.floor(stamina))}</span>
             <span className="text-zinc-500 text-sm mb-1">/ {stats.maxStamina} BPM</span>
           </div>
           {/* Bar */}
           <div className="w-48 h-1 bg-zinc-800 mt-2">
             <div className="h-full bg-lime-500 transition-all duration-200" style={{ width: `${Math.max(0, (stamina/stats.maxStamina)*100)}%` }} />
           </div>
         </div>

         <div className="text-right">
            <h3 className="text-white text-xs tracking-[0.3em] mb-2">ELEVATION GAIN</h3>
            <span className="text-4xl font-mono font-bold">{Math.floor(distance)}</span>
            <span className="text-zinc-500 text-sm"> / 2000M</span>
         </div>
      </div>

      {/* Game Viewport */}
      <canvas ref={canvasRef} className="flex-1 w-full h-full block touch-none" />

      {/* Mobile Controls */}
      <div className="absolute bottom-0 left-0 w-full h-48 flex z-20 p-4 gap-4 md:hidden">
         <button 
          className="flex-1 bg-white/5 border border-white/10 active:bg-white/20 backdrop-blur-sm flex items-center justify-center"
          onTouchStart={(e) => { e.preventDefault(); handleLeft(); }}
         >
           <ArrowLeft className="w-12 h-12 opacity-50" />
         </button>
         <button 
          className="flex-1 bg-white/5 border border-white/10 active:bg-white/20 backdrop-blur-sm flex items-center justify-center"
          onTouchStart={(e) => { e.preventDefault(); handleRight(); }}
         >
           <ArrowRight className="w-12 h-12 opacity-50" />
         </button>
      </div>

      {/* Instructions Overlay (Fades out) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-[fadeOut_3s_forwards_1s]">
        <p className="text-center text-white font-display tracking-widest bg-black px-4 py-2 border border-white">AVOID OBSTACLES // CONSUME ENERGY</p>
      </div>
    </div>
  );
};

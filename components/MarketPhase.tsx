import React, { useState } from 'react';
import { INGREDIENTS } from '../constants';
import { Ingredient } from '../types';
import { Button } from './Button';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

interface MarketPhaseProps {
  onComplete: (selected: Ingredient[]) => void;
}

export const MarketPhase: React.FC<MarketPhaseProps> = ({ onComplete }) => {
  const [cart, setCart] = useState<Ingredient[]>([]);
  const maxItems = 3;

  const toggleItem = (item: Ingredient) => {
    if (cart.find(i => i.id === item.id)) {
      setCart(cart.filter(i => i.id !== item.id));
    } else {
      if (cart.length < maxItems) {
        setCart([...cart, item]);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative z-10 bg-zinc-950">
      <div className="flex justify-between items-end p-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-20">
        <div>
           <p className="text-xs tracking-widest text-lime-500 mb-1">LOCATION: WET MARKET // SECTOR 4</p>
           <h2 className="text-3xl font-display">PROVISIONS</h2>
        </div>
        <div className="text-right">
          <p className="text-zinc-500 text-xs tracking-widest">CAPACITY</p>
          <div className="text-xl font-mono">{cart.length} / {maxItems}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
        {INGREDIENTS.map((item) => {
          const isSelected = !!cart.find(i => i.id === item.id);
          return (
            <div 
              key={item.id}
              onClick={() => toggleItem(item)}
              className={`
                relative group cursor-pointer border transition-all duration-500 overflow-hidden min-h-[300px] flex flex-col justify-end p-6
                ${isSelected ? 'border-lime-500 bg-zinc-900' : 'border-zinc-800 hover:border-zinc-600 bg-black'}
              `}
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className={`w-full h-full object-cover transition-all duration-700 ${isSelected ? 'grayscale-0 opacity-40' : 'grayscale opacity-20 group-hover:opacity-30'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`font-display text-xl ${isSelected ? 'text-white' : 'text-zinc-400'}`}>{item.name}</h3>
                  {isSelected ? <Minus className="text-lime-500" /> : <Plus className="text-zinc-600" />}
                </div>
                
                <div className="h-[1px] w-full bg-zinc-800 mb-4" />
                
                <p className="text-xs text-zinc-500 mb-4 font-mono leading-relaxed">{item.desc}</p>
                
                <div className="flex justify-between text-xs font-mono tracking-wider">
                  <span className="text-zinc-400">ENERGY: {item.energy}</span>
                  <span className="text-zinc-400">WT: {item.weight}KG</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent z-30 flex justify-center">
        <Button 
          onClick={() => onComplete(cart)} 
          disabled={cart.length === 0}
          className="w-full md:w-auto shadow-[0_0_50px_rgba(132,204,22,0.3)]"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag size={16} />
            PROCEED TO KITCHEN
          </span>
        </Button>
      </div>
    </div>
  );
};

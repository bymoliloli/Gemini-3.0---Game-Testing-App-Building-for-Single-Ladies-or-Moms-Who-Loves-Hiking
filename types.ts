export enum GamePhase {
  INTRO = 'INTRO',
  MARKET = 'MARKET',
  KITCHEN = 'KITCHEN',
  HIKE = 'HIKE',
  SUMMIT = 'SUMMIT',
}

export interface Ingredient {
  id: string;
  name: string;
  price: number;
  energy: number; // Stamina boost
  weight: number; // Agility penalty
  image: string;
  desc: string;
}

export interface GameState {
  inventory: Ingredient[];
  cookedDish: string | null;
  stats: {
    maxStamina: number;
    agility: number;
  };
  score: number;
}

export interface HikeResult {
  distance: number;
  time: number;
  collected: number;
}

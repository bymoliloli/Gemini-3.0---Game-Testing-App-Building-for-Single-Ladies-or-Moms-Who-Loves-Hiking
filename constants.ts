import { Ingredient } from './types';

export const INGREDIENTS: Ingredient[] = [
  {
    id: '1',
    name: 'SYNTHETIC KALE',
    price: 12,
    energy: 20,
    weight: 1,
    image: 'https://picsum.photos/id/102/400/400',
    desc: 'High fiber. Digital crunch.'
  },
  {
    id: '2',
    name: 'NEON RADISH',
    price: 8,
    energy: 15,
    weight: 0.5,
    image: 'https://picsum.photos/id/292/400/400',
    desc: 'Glows in the dark. Spicy.'
  },
  {
    id: '3',
    name: 'PROTEIN BLOCK',
    price: 45,
    energy: 60,
    weight: 5,
    image: 'https://picsum.photos/id/338/400/400',
    desc: 'Dense matter. Heavy but essential.'
  },
  {
    id: '4',
    name: 'HYDRA-GEL',
    price: 25,
    energy: 30,
    weight: 2,
    image: 'https://picsum.photos/id/404/400/400',
    desc: 'Structured water. Releases slowly.'
  },
  {
    id: '5',
    name: 'VOID MUSHROOM',
    price: 60,
    energy: 10,
    weight: 0.1,
    image: 'https://picsum.photos/id/106/400/400',
    desc: 'Enhances perception. Light as air.'
  },
  {
    id: '6',
    name: 'IRON ROOT',
    price: 15,
    energy: 40,
    weight: 4,
    image: 'https://picsum.photos/id/306/400/400',
    desc: 'Tastes like earth and metal.'
  }
];

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 1200;

import { create } from 'zustand';

export const DecorationType = {
  tree: 'tree',
} as const;

export type Decoration = {
  id: string;
  x: number;
  y: number;
  type: keyof typeof DecorationType;
  seed: string;
};

interface DecorationsStore {
  items: Decoration[];
  addItem: (decoration: Decoration) => void;
}

export const useDecorationStore = create<DecorationsStore>(set => ({
  items: [],
  addItem: (decoration: Omit<Decoration, 'seed'>) =>
    set(state => ({
      items: [
        ...state.items,
        { ...decoration, seed: Math.random().toString(36).substring(2, 9) },
      ],
    })),
}));

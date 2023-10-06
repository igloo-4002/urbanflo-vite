import { create } from 'zustand';

export const DecorationType = {
  tree: 'tree',
  building: 'building',
} as const;

export type DecorationTypeNames =
  (typeof DecorationType)[keyof typeof DecorationType];

export type Decoration = {
  id: string;
  x: number;
  y: number;
  type: DecorationTypeNames;
  seed: string;
};

interface DecorationsStore {
  items: Decoration[];
  addItem: (decoration: Omit<Decoration, 'seed'>) => void;
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

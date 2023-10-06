import { create } from 'zustand';

import { AddDecorationCommand } from '~/helpers/commands/AddDecorationCommand';
import { RemoveDecorationCommand } from '~/helpers/commands/RemoveDecorationCommand';

import { useUndoStore } from './useUndoStore';

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

export interface DecorationsStore {
  items: Decoration[];
  addItem: (decoration: Omit<Decoration, 'seed'>, seed?: string) => void;
  deleteItem: (id: string) => void;
}

export const useDecorationStore = create<DecorationsStore>((set, get) => ({
  items: [],
  addItem: (decoration: Omit<Decoration, 'seed'>, seed?: string) => {
    const newDecoration = {
      ...decoration,
      seed: seed ?? Math.random().toString(36).substring(2, 9),
    };

    const undoStore = useUndoStore.getState();
    undoStore.pushCommand(new AddDecorationCommand(get(), newDecoration));

    set(state => ({
      items: [...state.items, newDecoration],
    }));
  },
  deleteItem: (id: string) => {
    const items = get().items;
    const decorationIndex = items.findIndex(item => item.id === id);

    if (decorationIndex === -1) {
      return get();
    }

    const undoStore = useUndoStore.getState();
    undoStore.pushCommand(
      new RemoveDecorationCommand(get(), items[decorationIndex]),
    );

    set(state => ({
      items: state.items.filter(item => item.id !== id),
    }));
  },
}));

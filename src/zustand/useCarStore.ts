import { create } from 'zustand';

import { Point } from '~/types/Network';

export type Car = {
  location: Point;
  color: string;
};

type CarsState = {
  cars: Car[];
  setCars: (c: Car[]) => void;
};

export const useCarsStore = create<CarsState>(set => ({
  cars: [],
  setCars: (c: Car[]) => set({ cars: c }),
}));

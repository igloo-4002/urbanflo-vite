import { create } from 'zustand';

import { SimulationInfo, SimulationOutput } from '~/types/Simulation';

export interface Simulation {
  info: SimulationInfo;
  output: SimulationOutput;
}

export interface SimulationHistory {
  startTime: string;
  endTime: string;
  simulation: Simulation;
}

type SimulationHistoryState = {
  history: SimulationHistory[];
  showHistory: boolean;
  closeHistory: () => void;
  openHistory: () => void;
  updateHistory: (s: SimulationHistory) => void;
};

export const useSimulationHistory = create<SimulationHistoryState>(set => ({
  history: [],
  showHistory: false,
  closeHistory: () => set({ showHistory: false }),
  openHistory: () => set({ showHistory: true }),
  updateHistory: (s: SimulationHistory) =>
    set(state => ({
      history: [...state.history, s],
    })),
}));

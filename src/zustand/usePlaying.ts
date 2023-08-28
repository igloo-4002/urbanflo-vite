import { create } from 'zustand';

type Playing = {
  isPlaying: boolean;
  simulationId: string | null;
  changeSimulationId: (id: string | null) => void;
  play: () => void;
  pause: () => void;
};

export const usePlaying = create<Playing>(set => ({
  isPlaying: false,
  simulationId: null,
  changeSimulationId: (id: string | null) => set({ simulationId: id }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
}));

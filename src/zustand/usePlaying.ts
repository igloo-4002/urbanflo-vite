import { create } from 'zustand';

import { useSimulationTimer } from './useSimulationTimer';

type Playing = {
  isPlaying: boolean;
  simulationId: string | null;
  changeSimulationId: (id: string | null) => void;
  play: () => void;
  pause: () => void;
};

export const usePlaying = create<Playing>(set => {
  const play = () => {
    useSimulationTimer.getState().start();
    set({ isPlaying: true });
  };

  const pause = () => {
    useSimulationTimer.getState().stop();
    set({ isPlaying: false });
  };

  return {
    isPlaying: false,
    simulationId: null,
    changeSimulationId: (id: string | null) => set({ simulationId: id }),
    play,
    pause,
  };
});

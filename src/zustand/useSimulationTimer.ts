import { create } from 'zustand';

type SimulationTimer = {
  milliseconds: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
};

export const useSimulationTimer = create<SimulationTimer>((set, get) => {
  let interval: NodeJS.Timeout;

  const start = () => {
    reset();

    const startTime = Date.now() - get().milliseconds;
    interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      set({ milliseconds: elapsed });
    }, 10);
    set({ isRunning: true });
  };

  const stop = () => {
    if (get().isRunning) {
      clearInterval(interval);
      set({ isRunning: false });
    }
  };

  const reset = () => {
    if (get().isRunning) {
      stop();
    }
    set({ milliseconds: 0 });
  };

  return {
    isRunning: false,
    milliseconds: 0,
    start,
    stop,
    reset,
  };
});

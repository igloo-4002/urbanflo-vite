import { create } from 'zustand';

type Playing = {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
};

export const usePlaying = create<Playing>(set => ({
  isPlaying: false,
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
}));

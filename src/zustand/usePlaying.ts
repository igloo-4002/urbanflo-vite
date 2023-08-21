import { create } from 'zustand';

type Playing = {
  playing: boolean;
  play: () => void;
  pause: () => void;
};

export const usePlaying = create<Playing>(set => ({
  playing: false,
  play: () => set({ playing: true }),
  pause: () => set({ playing: false }),
}));

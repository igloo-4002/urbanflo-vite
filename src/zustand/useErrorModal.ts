import { create } from 'zustand';

type ErrorModal = {
  isOpen: boolean;
  heading: string;
  content: string;
  open: (heading: string, content: string) => void;
  close: () => void;
};

export const useErrorModal = create<ErrorModal>(set => ({
  isOpen: true,
  heading: '',
  content: '',
  open: (heading: string, content: string) =>
    set({ isOpen: true, heading, content }),
  close: () => set({ isOpen: false }),
}));
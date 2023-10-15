import { create } from 'zustand';

type ErrorModal = {
  isOpen: boolean;
  heading: string;
  body: string;
  open: (heading: string, content: string) => void;
  close: () => void;
};

export const useErrorModal = create<ErrorModal>(set => ({
  isOpen: false,
  heading: '',
  body: '',
  open: (heading: string, body: string) =>
    set({ isOpen: true, heading, body }),
  close: () => set({ isOpen: false }),
}));
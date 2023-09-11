import { create } from 'zustand';

type Views = 'road-editor' | 'traffic-light-editor' | null;

type LeftSideBar = {
  isOpen: boolean;
  view: Views;
  open: (viewName: Views) => void;
  close: () => void;
};

export const useLeftSideBar = create<LeftSideBar>(set => ({
  isOpen: false,
  view: null,
  open: (viewName: Views) => set({ view: viewName, isOpen: true }),
  close: () => set({ view: null, isOpen: false }),
}));

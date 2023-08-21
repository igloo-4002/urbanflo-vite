import { create } from 'zustand';

type LeftSideBar = {
  isOpen: boolean;
  viewName: ModalViewNamesValues | null;
  open: () => void;
  close: () => void;
};

export const useLeftSideBar = create<LeftSideBar>(set => ({
  isOpen: false,
  viewName: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export const ModalViewNames = {
  ROAD_PROPERTIES_EDITOR: 'road-properties-editor',
} as const;

export type ModalViewNamesValues =
  (typeof ModalViewNames)[keyof typeof ModalViewNames];

import { create } from 'zustand';

type LeftSideBar = {
  isOpen: boolean;
  viewName: ModalViewNamesValues | null;
  open: (viewName: ModalViewNamesValues) => void;
  close: () => void;
};

export const useLeftSideBar = create<LeftSideBar>(set => ({
  isOpen: false,
  viewName: null,
  open: (viewName: ModalViewNamesValues) => set({ viewName, isOpen: true }),
  close: () => set({ viewName: null, isOpen: false }),
}));

export const ModalViewNames = {
  ROAD_PROPERTIES_EDITOR: 'road-properties-editor',
} as const;

export type ModalViewNamesValues =
  (typeof ModalViewNames)[keyof typeof ModalViewNames];

import { create } from 'zustand';

type Selected = {
  selected: string | null;
  select: (id: string) => void;
  deselect: () => void;
};

export const useSelector = create<Selected>(set => ({
  selected: null,
  select: (id: string) => set({ selected: id }),
  deselect: () => set({ selected: null }),
}));

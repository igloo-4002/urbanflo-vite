import { create } from 'zustand';

import { ModalViewNames, useLeftSideBar } from './useLeftSideBar';

type Selection = {
  type: 'connection' | 'edge' | 'node' | 'decoration' | 'connection-control';
  id: string;
};

type Selected = {
  selected: Selection | null;
  select: (selection: Selection) => void;
  deselect: () => void;
};

export const useSelector = create<Selected>(set => ({
  selected: null,
  select: ({ type, id }) => {
    const leftSideBarState = useLeftSideBar.getState();

    if (type === 'edge') {
      // If it's an edge, open the left sidebar with road properties
      leftSideBarState.open(ModalViewNames.ROAD_PROPERTIES_EDITOR);
      set({ selected: { type, id } });
    } else if (type === 'node') {
      // If it's a node, open the left sidebar with intersection properties
      leftSideBarState.open(ModalViewNames.INTERSECTION_PROPERTIES_EDITOR);
      set({ selected: { type, id } });
    } else if (type === 'connection') {
      set({ selected: { type, id } });
    } else if (type === 'decoration') {
      set({ selected: { type, id } });
    } else if (type === 'connection-control') {
      set({ selected: { type, id } });
    } else {
      const never: never = type;
      return never;
    }
  },
  deselect: () => {
    const leftSideBarState = useLeftSideBar.getState();
    leftSideBarState.close();
    set({ selected: null });
  },
}));

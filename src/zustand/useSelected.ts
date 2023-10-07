import { create } from 'zustand';

import { ModalViewNames, useLeftSideBar } from './useLeftSideBar';
import { useNetworkStore } from './useNetworkStore';

type Selected = {
  selected: string | null;
  select: (id: string) => void;
  deselect: () => void;
};

export const useSelector = create<Selected>(set => ({
  selected: null,
  select: (id: string) => {
    const networkState = useNetworkStore.getState();
    const leftSideBarState = useLeftSideBar.getState();

    if (networkState.edges[id]) {
      // If it's an edge, open the left sidebar with road properties
      leftSideBarState.open(ModalViewNames.ROAD_PROPERTIES_EDITOR);
    } else if (networkState.nodes[id]) {
      // If it's a node, open the left sidebar with intersection properties
      leftSideBarState.open(ModalViewNames.INTERSECTION_PROPERTIES_EDITOR);
    }

    set({ selected: id });
  },
  deselect: () => {
    const leftSideBarState = useLeftSideBar.getState();
    leftSideBarState.close();
    set({ selected: null });
  },
}));

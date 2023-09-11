import { create } from 'zustand';

import { useLeftSideBar } from './useLeftSideBar';
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
      leftSideBarState.open('road-editor');
    } else if (
      networkState.nodes[id]
      // TODO: uncomment when ready
      // && networkState.nodes[id].type === 'traffic_light'
    ) {
      leftSideBarState.open('traffic-light-editor');
    } else {
      leftSideBarState.close();
    }

    set({ selected: id });
  },
  deselect: () => {
    const leftSideBarState = useLeftSideBar.getState();
    leftSideBarState.close();
    set({ selected: null });
  },
}));

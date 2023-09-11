import { create } from 'zustand';

import { toolbarItems } from '~/defaults/ToolbarItems';
import { LabelNamesType, ToolbarItem } from '~/types/Toolbar';

type ToolbarState = {
  isOpen: boolean;
  isShowingConnections: boolean;
  toggleShowingConnections: () => void;
  selectedToolBarItem: LabelNamesType | null;
  setSelectedToolBarItem: (selectedToolBarItem: LabelNamesType | null) => void;
  items: ToolbarItem[];
};

export const useToolbarStore = create<ToolbarState>(set => ({
  isOpen: true,
  isShowingConnections: true,
  toggleShowingConnections: () =>
    set(state => ({ isShowingConnections: !state.isShowingConnections })),
  selectedToolBarItem: null,
  setSelectedToolBarItem: (selectedToolBarItem: LabelNamesType | null) =>
    set({ selectedToolBarItem }),
  items: toolbarItems,
}));

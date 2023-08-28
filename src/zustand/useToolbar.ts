import { create } from 'zustand';

import { toolbarItems } from '~/defaults/ToolbarItems';
import { LabelNames, ToolbarItem } from '~/types/Toolbar';

type ToolbarState = {
  isOpen: boolean;
  selectedToolBarItem: LabelNames | null;
  setSelectedToolBarItem: (selectedToolBarItem: LabelNames | null) => void;
  items: ToolbarItem[];
};

export const useToolbarState = create<ToolbarState>(set => ({
  isOpen: true,
  selectedToolBarItem: null,
  setSelectedToolBarItem: (selectedToolBarItem: LabelNames | null) =>
    set({ selectedToolBarItem }),
  items: toolbarItems,
}));

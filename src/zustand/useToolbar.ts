import { create } from 'zustand';

import { LabelNames, ToolbarItem } from '~/types/Toolbar';

import intersectionIcon from '../../public/intersection.png';
import roadIcon from '../../public/road-icon.png';

type ToolbarState = {
  isOpen: boolean;
  selectedToolBarItem: LabelNames | null;
  setSelectedToolBarItem: (selectedToolBarItem: LabelNames | null) => void;
  items: ToolbarItem[];
};

const toolbarItems: ToolbarItem[] = [
  {
    label: 'Intersection',
    icon: intersectionIcon,
    onClick: () => {
      console.log('Intersection icon clicked');
    },
  },
  {
    label: 'Road',
    icon: roadIcon,
    onClick: () => {
      console.log('Road icon clicked');
    },
  },
];

export const useToolbarState = create<ToolbarState>(set => ({
  isOpen: true,
  selectedToolBarItem: null,
  setSelectedToolBarItem: (selectedToolBarItem: LabelNames | null) =>
    set({ selectedToolBarItem }),
  items: toolbarItems,
}));

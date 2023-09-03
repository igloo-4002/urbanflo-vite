import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';

import { ToolbarItem } from '~/types/Toolbar';

import intersectionIcon from '../../public/intersection.png';
import roadIcon from '../../public/road-icon.png';

export const toolbarItems: ToolbarItem[] = [
  {
    label: 'Pointer',
    heroIcon: <CursorArrowRaysIcon className="h-6 w-6" />,
    onClick: () => {
      console.log('Pointer icon clicked');
    },
  },
  {
    divider: true,
  },
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

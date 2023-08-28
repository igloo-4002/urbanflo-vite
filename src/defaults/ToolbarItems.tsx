import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';

import { ToolbarItem } from '~/types/Toolbar';

import intersectionIcon from '../../public/intersection.png';
import roadIcon from '../../public/road-icon.png';

export const toolbarItems: ToolbarItem[] = [
  {
    label: 'Pointer',
    heroIcon: <CursorArrowRaysIcon className="h-5 ml-2 center" />,
    onClick: () => {
      console.log('Pointer icon clicked');
    },
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

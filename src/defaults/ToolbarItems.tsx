import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';

import { LabelNames, ToolbarItem } from '~/types/Toolbar';

import intersectionIcon from '../../public/intersection.png';
import roadIcon from '../../public/road-icon.png';

export const toolbarItems: ToolbarItem[] = [
  {
    label: LabelNames.Pointer,
    heroIcon: <CursorArrowRaysIcon className="h-6 w-6" />,
  },
  {
    divider: true,
  },
  {
    label: LabelNames.Intersection,
    icon: intersectionIcon,
  },
  {
    label: LabelNames.Road,
    icon: roadIcon,
  },
];

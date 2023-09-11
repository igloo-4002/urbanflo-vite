import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';

import intersectionIcon from '~/assets/intersection.png';
import roadIcon from '~/assets/road-icon.png';
import { LabelNames, ToolbarItem } from '~/types/Toolbar';

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

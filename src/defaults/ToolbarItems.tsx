import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { LinkIcon } from '@heroicons/react/24/solid';

import intersectionIcon from '~/assets/intersection.png';
import roadIcon from '~/assets/road-icon.png';
import { LabelNames, ToolbarItem } from '~/types/Toolbar';
import { useToolbarStore } from '~/zustand/useToolbar';

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

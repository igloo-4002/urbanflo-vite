import buildingIcon from '~/assets/building.png';
import intersectionIcon from '~/assets/intersection.png';
import pointerIcon from '~/assets/pointer.png';
import roadIcon from '~/assets/road-icon.png';
import treeIcon from '~/assets/tree.png';
import { LabelNames, ToolbarItem } from '~/types/Toolbar';

export const toolbarItems: ToolbarItem[] = [
  {
    label: LabelNames.Pointer,
    icon: pointerIcon,
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
  {
    divider: true,
  },
  {
    label: LabelNames.Tree,
    icon: treeIcon,
  },
  {
    label: LabelNames.Building,
    icon: buildingIcon,
  },
];

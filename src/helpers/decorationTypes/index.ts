import { LabelNamesType } from '~/types/Toolbar';
import { DecorationTypeNames } from '~/zustand/useDecorations';

export function toolbarItemToDecoration(
  item: LabelNamesType,
): DecorationTypeNames {
  switch (item) {
    case 'Tree':
      return 'tree';
    case 'Building':
      return 'building';
    default:
      throw new Error(`${item} is an invalid decoration type`);
  }
}

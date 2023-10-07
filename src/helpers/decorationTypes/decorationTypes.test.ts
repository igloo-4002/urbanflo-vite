import { LabelNamesType } from '~/types/Toolbar';
import { DecorationTypeNames } from '~/zustand/useDecorations';

import { toolbarItemToDecoration } from '.';

describe('toolbarItemToDecoration', () => {
  it('should return "tree" for the "Tree" label', () => {
    const input: LabelNamesType = 'Tree';
    const output: DecorationTypeNames = toolbarItemToDecoration(input);
    expect(output).toBe('tree');
  });

  it('should return "building" for the "Building" label', () => {
    const input: LabelNamesType = 'Building';
    const output: DecorationTypeNames = toolbarItemToDecoration(input);
    expect(output).toBe('building');
  });

  it('should throw an error for invalid decoration types', () => {
    const invalidInput: LabelNamesType = 'InvalidLabel' as LabelNamesType;
    expect(() => toolbarItemToDecoration(invalidInput)).toThrowError(
      `${invalidInput} is an invalid decoration type`,
    );
  });
});

export type LabelNames = 'Intersection' | 'Road';

export type ToolbarItem = {
  label: LabelNames;
  icon: string;
  onClick: () => void;
};

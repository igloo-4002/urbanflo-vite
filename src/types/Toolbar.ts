export const LabelNames = {
  Intersection: 'Intersection',
  Road: 'Road',
  Pointer: 'Pointer',
} as const;

export type LabelNamesType = (typeof LabelNames)[keyof typeof LabelNames];

export type ToolbarItem = {
  label?: LabelNamesType;
  icon?: string;
  onClick?: () => void;
  heroIcon?: JSX.Element;
  divider?: boolean;
};

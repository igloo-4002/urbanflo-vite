export type LabelNames = 'Intersection' | 'Road' | 'Pointer';

export type ToolbarItem = {
  label?: LabelNames;
  icon?: string;
onClick?: () => void;
  heroIcon?: JSX.Element;
  divider?: boolean;
};

import { AllHTMLAttributes } from 'react';

type NativeDivProps = AllHTMLAttributes<HTMLDivElement>;

export function ColumnStack(props: NativeDivProps) {
  return (
    <div style={props.style} className="flex flex-col">
      {props.children}
    </div>
  );
}

export function RowStack(props: NativeDivProps) {
  return (
    <div
      style={props.style}
      className="flex flex-row items-center justify-between"
    >
      {props.children}
    </div>
  );
}

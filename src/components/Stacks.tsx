import { type CSSProperties, type ReactNode } from "react";

interface StackProps {
  style?: CSSProperties;
  children: ReactNode;
}

export function ColumnStack({ style = {}, children }: StackProps) {
  return (
    <div style={style} className="flex flex-col">
      {children}
    </div>
  );
}

export function RowStack({ style = {}, children }: StackProps) {
  return (
    <div style={style} className="flex flex-row items-center justify-between">
      {children}
    </div>
  );
}

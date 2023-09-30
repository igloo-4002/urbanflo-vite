import { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      <div
        className={`absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 ${
          visible ? 'opacity-100' : 'opacity-0 invisible'
        } inline-block px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg shadow-sm  transition-opacity duration-300 whitespace-nowrap`}
        role="tooltip"
      >
        {text}
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>
    </div>
  );
}

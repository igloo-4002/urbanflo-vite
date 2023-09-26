import { useState } from 'react';

interface TooltipProps {
  tooltipText: string;
  children: React.ReactNode;
}

export function Tooltip({ tooltipText, children }: TooltipProps) {
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
        } inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700 transition-opacity duration-300`}
        role="tooltip"
      >
        {tooltipText}
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>
    </div>
  );
}

export default Tooltip;

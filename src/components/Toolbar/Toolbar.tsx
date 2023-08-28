import { useToolbarState } from '~/zustand/useToolbar';

import { ToolbarDivider } from './ToolbarDivider';
import { ToolBarItem } from './ToolbarItem';

export function Toolbar() {
  const toolbarState = useToolbarState();

  return (
    <span
      style={{
        position: 'fixed',
        display: toolbarState.isOpen ? 'flex' : 'none',
        top: 115,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        backgroundColor: '#FAF9F6',
        padding: '8px',
        borderRadius: '10px',
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
      }}
    >
      {toolbarState.items.map((item, idx) => {
        if (item.divider) {
          return <ToolbarDivider key={idx} />;
        }
        return <ToolBarItem toolbarItem={item} key={idx} />;
      })}
    </span>
  );
}

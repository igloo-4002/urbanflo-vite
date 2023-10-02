import { canvasComponentBg } from '~/colors';
import { useToolbarStore } from '~/zustand/useToolbar';

import { ToolbarDivider } from './ToolbarDivider';
import { ToolBarItem } from './ToolbarItem';

export function Toolbar() {
  const toolbarStore = useToolbarStore();

  return (
    <span
      style={{
        transform: 'translateX(-50%)',
        backgroundColor: canvasComponentBg,
      }}
      className={`fixed ${
        toolbarStore.isOpen ? 'flex' : 'hidden'
      } top-32 left-1/2 z-100 shadow-md p-2 rounded-xl`}
    >
      {toolbarStore.items.map((item, idx) => {
        if (item.divider) {
          return <ToolbarDivider key={idx} />;
        }
        return <ToolBarItem toolbarItem={item} key={idx} />;
      })}
    </span>
  );
}

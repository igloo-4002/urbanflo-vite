import classNames from 'classnames';

import { ToolbarItem } from '~/types/Toolbar';
import { useToolbarStore } from '~/zustand/useToolbar';

interface Props {
  toolbarItem: ToolbarItem;
}

export function ToolBarItem({ toolbarItem }: Props) {
  const toolbarState = useToolbarStore();

  const isSelected = toolbarItem.label === toolbarState.selectedToolBarItem;

  const cls = classNames({
    'hover:bg-gray-300 p-1 rounded-md duration-200': true,
    'bg-gray-300': isSelected,
  });

  function selectOrDeselect() {
    if (isSelected) {
      toolbarState.setSelectedToolBarItem(null);
      return;
    } else if (toolbarItem.label) {
      toolbarState.setSelectedToolBarItem(toolbarItem.label);
    }
  }
  return (
    <button
      onClick={() => {
        selectOrDeselect();
        toolbarItem?.onClick?.();
      }}
      className={cls}
    >
      {toolbarItem.heroIcon ? (
        toolbarItem.heroIcon
      ) : (
        <img
          src={toolbarItem.icon}
          alt={toolbarItem.label}
          className="h-6 w-6"
        />
      )}
    </button>
  );
}

import classNames from 'classnames';

import { ToolbarItem } from '~/types/Toolbar';
import { useToolbarState } from '~/zustand/useToolbar';

interface Props {
  toolbarItem: ToolbarItem;
}

export function ToolBarItem({ toolbarItem }: Props) {
  const toolbarState = useToolbarState();

  const isSelected = toolbarItem.label === toolbarState.selectedToolBarItem;

  const cls = classNames({
    'hover:bg-gray-300 p-1 rounded-md duration-200': true,
    'bg-gray-300': isSelected,
  });

  function selectOrDeselect() {
    if (isSelected) {
      toolbarState.setSelectedToolBarItem(null);
      return;
    } else {
      toolbarState.setSelectedToolBarItem(toolbarItem.label);
    }
  }
  return (
    <button
      onClick={() => {
        selectOrDeselect();
        toolbarItem.onClick();
      }}
      className={cls}
    >
      <img
        src={toolbarItem.icon}
        alt={toolbarItem.label}
        style={{
          height: '24px',
          width: '24px',
        }}
      />
    </button>
  );
}

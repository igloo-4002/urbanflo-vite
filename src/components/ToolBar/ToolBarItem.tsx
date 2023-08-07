import classNames from 'classnames';

import { ToolBarItemOptions } from '~/context/types';
import { useAppState } from '~/hooks/useAppState';

export interface ToolBarItemProps {
  src: string;
  alt: string;
  optionName: ToolBarItemOptions;
  onClick: () => void;
}

export function ToolBarItem(props: ToolBarItemProps) {
  const { appState, setAppState } = useAppState();

  function handleClick() {
    props.onClick();
    setAppState(prev => {
      return {
        ...prev,
        toolBarState: {
          ...prev.toolBarState,
          selectedToolBarItem: props.optionName,
        },
      };
    });
  }

  const cls = classNames({
    'hover:bg-gray-300 p-1 rounded-md duration-200': true,
    'bg-gray-300':
      props.optionName === appState.toolBarState.selectedToolBarItem,
  });

  return (
    <button onClick={handleClick} className={cls}>
      <img
        src={props.src}
        alt={props.alt}
        style={{
          height: '24px',
          width: '24px',
        }}
      />
    </button>
  );
}

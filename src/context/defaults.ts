import { ToolBarItemProps as ToolBarItem } from '~/components/ToolBar/ToolBarItem';
import { TrafficGraph } from '~/graph';

import intersectionIcon from '../../public/intersection.png';
import roadIcon from '../../public/road-icon.png';
import { type AppState } from './types';

export const getDefaultAppState: () => AppState = () => {
  const toolBarItems: ToolBarItem[] = [
    {
      src: roadIcon,
      alt: 'Road',
      onClick: () => console.log('road icon clicked'),
    },
    {
      src: intersectionIcon,
      alt: 'Intersection',
      onClick: () => console.log('intersection icon clicked'),
    },
  ];

  return {
    projectInfo: {
      name: 'untitled',
    },
    canvasState: {
      canvasItems: [],
      graph: new TrafficGraph(),
      selectedCanvasItem: null,
      isPlaying: false,
    },
    projectState: {
      isSaved: true, // when a user creates a project, it is saved by default
    },
    leftSideBarState: {
      isOpen: false,
      viewName: null,
    },
    toolBarState: {
      isOpen: true,
      items: toolBarItems,
    },
  };
};

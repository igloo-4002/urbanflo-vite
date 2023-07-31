import { type Dispatch, type SetStateAction } from "react";

import IntersectionPropertiesEditor from "../../components/Modals/IntersectionPropertiesEditor";
import RoadPropertiesEditor from "../../components/Modals/RoadPropertiesEditor";
import { ModalViewNames, type AppState, type CanvasItemTypes } from "../types";

export function openSidebar(
  appState: AppState,
  setAppState: Dispatch<SetStateAction<AppState>>,
  viewName: string,
  selectedCanvasItem: CanvasItemTypes | null = null,
) {
  setAppState({
    ...appState,
    leftSideBarState: { isOpen: true, viewName },
    canvasState: {
      ...appState.canvasState,
      selectedCanvasItem: selectedCanvasItem,
    },
  });
}

export function closeSidebar(
  appState: AppState,
  setAppState: Dispatch<SetStateAction<AppState>>,
  setSelectedCanvasItemToNull = false,
) {
  setAppState({
    ...appState,
    canvasState: {
      ...appState.canvasState,
      selectedCanvasItem: setSelectedCanvasItemToNull
        ? null
        : appState.canvasState.selectedCanvasItem,
    },
    leftSideBarState: { isOpen: false, viewName: null },
  });
}

export function isSideBarOpen(appState: AppState) {
  return appState.leftSideBarState.isOpen;
}

export function getView(appState: AppState) {
  switch (appState.leftSideBarState.viewName) {
    case null:
      return (
        <p>
          appState.leftSideBarState.viewName is null but the sidebar is open -
          make sure you are setting the view name when you open the sidebar
        </p>
      );
    case ModalViewNames.ROAD_PROPERTIES_EDITOR:
      return <RoadPropertiesEditor />;
    case ModalViewNames.INTERSECTION_PROPERTIES_EDITOR:
      return <IntersectionPropertiesEditor />;
  }
}

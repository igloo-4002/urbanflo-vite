import { createContext, type Dispatch, type SetStateAction } from "react";

import { getDefaultAppState } from "./defaults";
import { type AppState } from "./types";

type AppStateContextType = {
  appState: AppState;
  setAppState: Dispatch<SetStateAction<AppState>>;
};

const AppStateContextState = {
  appState: getDefaultAppState(),
  setAppState: () => {
    console.warn("unitialized setAppState context!");
  },
};

const AppStateContext =
  createContext<AppStateContextType>(AppStateContextState);

export default AppStateContext;

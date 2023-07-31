import { useContext } from 'react';
import { AppStateContext, AppStateContextType } from "~/context/AppStateContext";

export function useAppState(): AppStateContextType {
  return useContext(AppStateContext);
}

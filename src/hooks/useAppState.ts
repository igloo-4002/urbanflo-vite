import { useContext } from 'react';
import { AppStateContext, AppStateContextType } from "~/context/AppStateContext";

export default function useAppState(): AppStateContextType {
  return useContext(AppStateContext);
}

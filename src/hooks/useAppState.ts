import { useContext } from 'react';
import { AppStateContext, AppStateContextType } from "~/context/AppStateContext";

export default function useAppContext(): AppStateContextType {
  return useContext(AppStateContext);
}

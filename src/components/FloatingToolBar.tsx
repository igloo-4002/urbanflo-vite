import { useContext } from 'react';
import AppStateContext from "~/context/AppStateContext";
import { isToolBarOpen } from '~/context/utils/modal';

export default function FloatingToolBar() {
    const { appState } = useContext(AppStateContext);

    return (
      <span
        style={{
          position: "fixed",
          display: isToolBarOpen(appState) ? "flex" : "none",
          top: 15,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          backgroundColor: "#FAF9F6",
          padding: "8px 18px",
          borderRadius: "10px",
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        }}
      >
        Tool bar items component - not yet implemented
      </span>
    );
  }
  
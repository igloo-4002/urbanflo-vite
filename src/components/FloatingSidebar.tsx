import { useContext } from "react";

import AppStateContext from "../context/AppStateContext";
import { closeSidebar, getView, isSideBarOpen } from "../context/utils/modal";

export default function FloatingSideBar() {
  const { appState, setAppState } = useContext(AppStateContext);

  return (
    <div
      style={{
        position: "fixed",
        top: 15,
        left: 15,
        zIndex: 1000,
        maxHeight: "min-content",
        width: "200px",
        display: isSideBarOpen(appState) ? "flex" : "none",
        justifyContent: "center",
        alignContent: "center",
        flexDirection: "column",
        backgroundColor: "#FAF9F6",
        padding: "12px",
        borderRadius: "10px",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        overflowWrap: "break-word",
      }}
    >
      <button
        style={{ width: "100%", marginBottom: "8px" }}
        onClick={() => closeSidebar(appState, setAppState, true)}
      >
        Close
      </button>
      {getView(appState)}
    </div>
  );
}

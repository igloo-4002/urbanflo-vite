import { RoadPropertiesEditor } from '~/components/Editors/RoadProperties';
import { ModalViewNames, useLeftSideBar } from '~/zustand/useLeftSideBar';

export function LeftSideBar() {
  const leftSideBar = useLeftSideBar();

  function getView() {
    switch (leftSideBar.viewName) {
      case null:
        return (
          <p>
            leftSideBar.viewName is null but the sidebar is open - make sure you
            are setting the view name when you open the sidebar
          </p>
        );
      case ModalViewNames.ROAD_PROPERTIES_EDITOR:
        return <RoadPropertiesEditor />;
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 115,
        left: 15,
        zIndex: 1000,
        maxHeight: 'min-content',
        width: '200px',
        display: leftSideBar.isOpen ? 'flex' : 'none',
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#FAF9F6',
        padding: '12px',
        borderRadius: '10px',
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        overflowWrap: 'break-word',
      }}
    >
      <button
        className="hover:bg-gray-300 duration-200 rounded-md"
        style={{ width: '100%', marginBottom: '8px' }}
        onClick={leftSideBar.close}
      >
        Close
      </button>
      {getView()}
    </div>
  );
}

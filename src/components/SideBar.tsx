import { XMarkIcon } from '@heroicons/react/24/outline';

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
        width: '250px',
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
        className="flex"
        onClick={leftSideBar.close}
        style={{ justifyContent: 'flex-end' }} // Align button contents to the right
      >
        <XMarkIcon className="h-6 w-6 mb-2 justify-end" aria-hidden="true" />
      </button>
      {getView()}
    </div>
  );
}

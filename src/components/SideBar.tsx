import { XMarkIcon } from '@heroicons/react/24/outline';

import { IntersectionPropertiesEditor } from '~/components/Editors/IntersectionProperties';
import { RoadPropertiesEditor } from '~/components/Editors/RoadProperties';
import { ModalViewNames, useLeftSideBar } from '~/zustand/useLeftSideBar';
import { useSelector } from '~/zustand/useSelector';

export function LeftSideBar() {
  const leftSideBar = useLeftSideBar();
  const selector = useSelector();

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
      case ModalViewNames.INTERSECTION_PROPERTIES_EDITOR:
        return <IntersectionPropertiesEditor />;
    }
  }

  function closeLeftBar() {
    leftSideBar.close();
    selector.deselect();
  }

  return (
    <div
      className={`fixed max-h-[min-content] z-100 flex-col bg-[#FAF9F6] shadow-md top-32 left-4 w-64 items-center justify-center p-3 rounded-xl ${
        leftSideBar.isOpen ? 'flex' : 'hidden'
      }`}
    >
      <button className="flex self-end" onClick={closeLeftBar}>
        <XMarkIcon className="h-6 w-6 mb-2 justify-end" aria-hidden="true" />
      </button>
      {getView()}
    </div>
  );
}

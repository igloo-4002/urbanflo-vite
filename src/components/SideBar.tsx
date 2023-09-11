import { XMarkIcon } from '@heroicons/react/24/outline';

import { RoadPropertiesEditor } from '~/components/Editors/RoadEditor';
import { useLeftSideBar } from '~/zustand/useLeftSideBar';
import { useSelector } from '~/zustand/useSelected';

import { TrafficLightEditor } from './Editors/TrafficLightEditor';

function NullModalView() {
  return (
    <p>
      leftSideBar.viewName is null but the sidebar is open - make sure you are
      setting the view name when you open the sidebar
    </p>
  );
}

export function LeftSideBar() {
  const leftSideBar = useLeftSideBar();
  const selector = useSelector();

  function Modal() {
    if (leftSideBar.view === null) {
      return <NullModalView />;
    } else if (leftSideBar.view === 'road-editor') {
      return <RoadPropertiesEditor />;
    } else if (leftSideBar.view === 'traffic-light-editor') {
      return <TrafficLightEditor />;
    } else {
      const never: never = leftSideBar.view;
      return never;
    }
  }

  function closeLeftBar() {
    leftSideBar.close();
    selector.deselect();
  }

  return (
    <div
      className={`fixed max-h-[min-content] z-100 flex-col bg-[#FAF9F6] shadow-md top-32 left-4 items-center justify-center p-3 rounded-xl ${
        leftSideBar.isOpen ? 'flex' : 'hidden'
      }`}
    >
      <button className="flex self-end" onClick={closeLeftBar}>
        <XMarkIcon className="h-6 w-6 mb-2 justify-end" aria-hidden="true" />
      </button>
      <Modal />
    </div>
  );
}

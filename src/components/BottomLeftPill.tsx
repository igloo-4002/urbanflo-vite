import { ToolbarDivider } from './Toolbar/ToolbarDivider';
import { UndoRedoSection } from './UndoRedoSection';
import { ZoomSection } from './ZoomSection';

export function BottomLeftPill() {
  return (
    <div className="fixed bottom-4 left-4 flex items-center bg-[#FAF9F6] p-2 rounded-xl shadow-lg">
      <UndoRedoSection />
      <ToolbarDivider />
      <ZoomSection />
    </div>
  );
}

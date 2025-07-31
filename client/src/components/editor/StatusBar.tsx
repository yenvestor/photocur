import { useEditorStore } from '@/store/editorStore';
import { useTools } from '@/hooks/useTools';

export default function StatusBar() {
  const { activeTool, documents, activeDocumentId } = useEditorStore();
  const { getToolById } = useTools();

  const currentTool = getToolById(activeTool);
  const activeDocument = documents.find(doc => doc.id === activeDocumentId);

  return (
    <div className="h-6 bg-secondary-dark border-t border-tertiary-dark flex items-center px-4 text-xs text-text-secondary">
      <div className="flex items-center space-x-4">
        <span>{currentTool?.name || 'No Tool'}</span>
        <span>X: 0, Y: 0</span>
        <span>RGB: 255, 255, 255</span>
      </div>
      <div className="ml-auto flex items-center space-x-2">
        <span>Memory: 45.2 MB</span>
        <div className="w-16 h-2 bg-tertiary-dark rounded-full overflow-hidden">
          <div className="h-full bg-accent-blue" style={{ width: '35%' }}></div>
        </div>
      </div>
    </div>
  );
}

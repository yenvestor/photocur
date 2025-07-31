import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useTools } from './useTools';

export function useKeyboard() {
  const { setActiveTool, undo, redo } = useEditorStore();
  const { getToolByShortcut } = useTools();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default for specific key combinations
      if (event.ctrlKey || event.metaKey) {
        switch (event.code) {
          case 'KeyN':
            event.preventDefault();
            // Handle new document
            break;
          case 'KeyO':
            event.preventDefault();
            // Handle open document
            break;
          case 'KeyS':
            event.preventDefault();
            // Handle save document
            break;
          case 'KeyZ':
            event.preventDefault();
            if (event.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'KeyY':
            event.preventDefault();
            redo();
            break;
        }
        return;
      }

      // Tool shortcuts
      const tool = getToolByShortcut(event.key.toUpperCase());
      if (tool) {
        setActiveTool(tool.id);
      }

      // Other shortcuts
      switch (event.code) {
        case 'Space':
          // Temporarily activate hand tool
          break;
        case 'BracketLeft':
          // Decrease brush size
          break;
        case 'BracketRight':
          // Increase brush size
          break;
        case 'KeyD':
          // Reset colors
          break;
        case 'KeyX':
          // Swap colors
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        // Restore previous tool
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setActiveTool, undo, redo, getToolByShortcut]);
}

import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { ToolId } from '@/types/editor';

const TOOL_SHORTCUTS: Record<string, ToolId> = {
  'v': 'move',
  'm': 'rectangle-select',
  'w': 'magic-wand',
  'c': 'crop',
  'i': 'eyedropper',
  'j': 'spot-healing',
  'b': 'brush',
  's': 'clone',
  'e': 'eraser',
  'g': 'paint-bucket',
  'r': 'blur',
  'o': 'dodge',
  't': 'type',
  'p': 'pen',
  'a': 'path-select',
  'u': 'rectangle',
  'h': 'hand',
  'z': 'zoom',
};

export function useKeyboardShortcuts() {
  const { setActiveTool, undo, redo } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = event.key.toLowerCase();
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      // Handle Ctrl/Cmd shortcuts
      if (isCtrlOrCmd) {
        switch (key) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            event.preventDefault();
            redo();
            break;
        }
        return;
      }

      // Handle tool shortcuts
      if (TOOL_SHORTCUTS[key]) {
        event.preventDefault();
        setActiveTool(TOOL_SHORTCUTS[key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTool, undo, redo]);
}
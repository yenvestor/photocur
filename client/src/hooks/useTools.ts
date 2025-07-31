import { Tool } from '@/types/editor';

export const TOOLS: Tool[] = [
  // Selection Tools
  { id: 'move', name: 'Move Tool', icon: 'fa-up-down-left-right', shortcut: 'V', category: 'selection' },
  { id: 'rectangle-select', name: 'Rectangle Select', icon: 'fa-square', shortcut: 'M', category: 'selection' },
  { id: 'ellipse-select', name: 'Ellipse Select', icon: 'fa-circle', shortcut: 'M', category: 'selection' },
  { id: 'lasso-select', name: 'Lasso Select', icon: 'fa-pencil', shortcut: 'L', category: 'selection' },
  { id: 'magic-wand', name: 'Magic Wand', icon: 'fa-wand-magic-sparkles', shortcut: 'W', category: 'selection' },
  { id: 'quick-select', name: 'Quick Selection', icon: 'fa-hand-pointer', shortcut: 'W', category: 'selection' },

  // Painting Tools
  { id: 'brush', name: 'Brush Tool', icon: 'fa-paintbrush', shortcut: 'B', category: 'painting' },
  { id: 'pencil', name: 'Pencil Tool', icon: 'fa-pencil', shortcut: 'B', category: 'painting' },
  { id: 'eraser', name: 'Eraser Tool', icon: 'fa-eraser', shortcut: 'E', category: 'painting' },
  { id: 'paint-bucket', name: 'Paint Bucket', icon: 'fa-fill-drip', shortcut: 'G', category: 'painting' },
  { id: 'gradient', name: 'Gradient Tool', icon: 'fa-palette', shortcut: 'G', category: 'painting' },

  // Retouching Tools
  { id: 'clone', name: 'Clone Stamp', icon: 'fa-stamp', shortcut: 'S', category: 'retouching' },
  { id: 'healing', name: 'Healing Brush', icon: 'fa-bandage', shortcut: 'J', category: 'retouching' },
  { id: 'blur', name: 'Blur Tool', icon: 'fa-circle-notch', shortcut: '', category: 'retouching' },
  { id: 'sharpen', name: 'Sharpen Tool', icon: 'fa-sliders', shortcut: '', category: 'retouching' },
  { id: 'smudge', name: 'Smudge Tool', icon: 'fa-hand', shortcut: '', category: 'retouching' },

  // Drawing Tools
  { id: 'pen', name: 'Pen Tool', icon: 'fa-pen-nib', shortcut: 'P', category: 'drawing' },
  { id: 'text', name: 'Text Tool', icon: 'fa-font', shortcut: 'T', category: 'drawing' },
  { id: 'shape', name: 'Shape Tool', icon: 'fa-shapes', shortcut: 'U', category: 'drawing' },

  // Navigation Tools
  { id: 'hand', name: 'Hand Tool', icon: 'fa-hand', shortcut: 'H', category: 'navigation' },
  { id: 'zoom', name: 'Zoom Tool', icon: 'fa-magnifying-glass-plus', shortcut: 'Z', category: 'navigation' },
  { id: 'crop', name: 'Crop Tool', icon: 'fa-crop', shortcut: 'C', category: 'navigation' },
  { id: 'eyedropper', name: 'Eyedropper', icon: 'fa-eye-dropper', shortcut: 'I', category: 'navigation' },
];

export function useTools() {
  const getToolsByCategory = (category: Tool['category']) => {
    return TOOLS.filter(tool => tool.category === category);
  };

  const getToolById = (id: string) => {
    return TOOLS.find(tool => tool.id === id);
  };

  const getToolByShortcut = (shortcut: string) => {
    return TOOLS.find(tool => tool.shortcut.toLowerCase() === shortcut.toLowerCase());
  };

  return {
    tools: TOOLS,
    getToolsByCategory,
    getToolById,
    getToolByShortcut,
  };
}

import { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { ToolId } from '@/types/editor';

export default function LeftToolbar() {
  const { activeTool, setActiveTool } = useEditorStore();
  const [showSubmenu, setShowSubmenu] = useState<string | null>(null);

  const tools = [
    { 
      id: 'move', 
      icon: 'fa-arrows-alt', 
      name: 'Move Tool',
      shortcut: 'V',
      submenu: []
    },
    { 
      id: 'rectangle-select', 
      icon: 'far fa-square', 
      name: 'Rectangle Select Tool',
      shortcut: 'M',
      submenu: [
        { id: 'rectangle-select', name: 'Rectangle Select Tool', icon: 'far fa-square', shortcut: 'M' },
        { id: 'ellipse-select', name: 'Ellipse Select Tool', icon: 'far fa-circle', shortcut: 'M' }
      ]
    },
    { 
      id: 'magic-wand', 
      icon: 'fa-magic', 
      name: 'Magic Wand Tool',
      shortcut: 'W',
      submenu: [
        { id: 'magic-wand', name: 'Magic Wand Tool', icon: 'fa-magic', shortcut: 'W' },
        { id: 'quick-selection', name: 'Quick Selection Tool', icon: 'fa-crosshairs' },
        { id: 'object-selection', name: 'Object Selection Tool', icon: 'fa-mouse-pointer' }
      ]
    },
    { 
      id: 'crop', 
      icon: 'fa-crop', 
      name: 'Crop Tool',
      shortcut: 'C',
      submenu: [
        { id: 'crop', name: 'Crop Tool', icon: 'fa-crop', shortcut: 'C' }
      ]
    },
    { 
      id: 'eyedropper', 
      icon: 'fa-eyedropper', 
      name: 'Eyedropper Tool',
      shortcut: 'I',
      submenu: [
        { id: 'eyedropper', name: 'Eyedropper Tool', icon: 'fa-eyedropper', shortcut: 'I' },
        { id: 'color-sampler', name: 'Color Sampler Tool', icon: 'fa-crosshairs' },
        { id: 'ruler', name: 'Ruler Tool', icon: 'fa-ruler' }
      ]
    },
    { 
      id: 'spot-healing', 
      icon: 'fa-band-aid', 
      name: 'Spot Healing Brush Tool',
      shortcut: 'J',
      submenu: [
        { id: 'spot-healing', name: 'Spot Healing Brush Tool', icon: 'fa-band-aid', shortcut: 'J' },
        { id: 'healing-brush', name: 'Healing Brush Tool', icon: 'fa-paint-brush' },
        { id: 'patch', name: 'Patch Tool', icon: 'fa-puzzle-piece' },
        { id: 'red-eye', name: 'Red Eye Tool', icon: 'fa-eye' }
      ]
    },
    { 
      id: 'brush', 
      icon: 'fa-paint-brush', 
      name: 'Brush Tool',
      shortcut: 'B',
      submenu: [
        { id: 'brush', name: 'Brush Tool', icon: 'fa-paint-brush', shortcut: 'B' },
        { id: 'pencil', name: 'Pencil Tool', icon: 'fa-pencil' },
        { id: 'color-replacement', name: 'Color Replacement Tool', icon: 'fa-tint' }
      ]
    },
    { 
      id: 'clone', 
      icon: 'fa-clone', 
      name: 'Clone Tool',
      shortcut: 'S',
      submenu: []
    },
    { 
      id: 'eraser', 
      icon: 'fa-eraser', 
      name: 'Eraser Tool',
      shortcut: 'E',
      submenu: [
        { id: 'eraser', name: 'Eraser Tool', icon: 'fa-eraser', shortcut: 'E' }
      ]
    },
    { 
      id: 'paint-bucket', 
      icon: 'fa-fill-drip', 
      name: 'Paint Bucket Tool',
      shortcut: 'G',
      submenu: [
        { id: 'paint-bucket', name: 'Paint Bucket Tool', icon: 'fa-fill-drip', shortcut: 'G' },
        { id: 'gradient', name: 'Gradient Tool', icon: 'fa-sliders' }
      ]
    },
    { 
      id: 'blur', 
      icon: 'fa-circle', 
      name: 'Blur Tool',
      shortcut: 'R',
      submenu: [
        { id: 'blur', name: 'Blur Tool', icon: 'fa-circle', shortcut: 'R' },
        { id: 'sharpen', name: 'Sharpen Tool', icon: 'fa-adjust' },
        { id: 'smudge', name: 'Smudge Tool', icon: 'fa-hand-paper' }
      ]
    },
    { 
      id: 'dodge', 
      icon: 'fa-sun', 
      name: 'Dodge Tool',
      shortcut: 'O',
      submenu: [
        { id: 'dodge', name: 'Dodge Tool', icon: 'fa-sun', shortcut: 'O' },
        { id: 'burn', name: 'Burn Tool', icon: 'fa-fire' },
        { id: 'sponge', name: 'Sponge Tool', icon: 'fa-circle' }
      ]
    },
    { 
      id: 'type', 
      icon: 'fa-font', 
      name: 'Type Tool',
      shortcut: 'T',
      submenu: [
        { id: 'type', name: 'Type Tool', icon: 'fa-font', shortcut: 'T' },
        { id: 'vertical-type', name: 'Vertical Type Tool', icon: 'fa-text-height' }
      ]
    },
    { 
      id: 'pen', 
      icon: 'fa-pen-nib', 
      name: 'Pen Tool',
      shortcut: 'P',
      submenu: [
        { id: 'pen', name: 'Pen Tool', icon: 'fa-pen-nib', shortcut: 'P' },
        { id: 'free-pen', name: 'Free Pen Tool', icon: 'fa-pencil-alt' },
        { id: 'add-anchor', name: 'Add Anchor Point Tool', icon: 'fa-plus' },
        { id: 'delete-anchor', name: 'Delete Anchor Point Tool', icon: 'fa-minus' },
        { id: 'convert-anchor', name: 'Convert Anchor Point Tool', icon: 'fa-sync' }
      ]
    },
    { 
      id: 'path-select', 
      icon: 'fa-mouse-pointer', 
      name: 'Path Select Tool',
      shortcut: 'A',
      submenu: [
        { id: 'path-select', name: 'Path Select Tool', icon: 'fa-mouse-pointer', shortcut: 'A' },
        { id: 'direct-select', name: 'Direct Select Tool', icon: 'fa-crosshairs' }
      ]
    },
    { 
      id: 'rectangle', 
      icon: 'fa-square', 
      name: 'Rectangle Tool',
      shortcut: 'U',
      submenu: [
        { id: 'rectangle', name: 'Rectangle Tool', icon: 'fa-square', shortcut: 'U' },
        { id: 'ellipse', name: 'Ellipse Tool', icon: 'fa-circle' },
        { id: 'line', name: 'Line Tool', icon: 'fa-minus' },
        { id: 'parametric-shape', name: 'Parametric Shape Tool', icon: 'fa-shapes' },
        { id: 'custom-shape', name: 'Custom Shape Tool', icon: 'fa-star' }
      ]
    },
    { 
      id: 'hand', 
      icon: 'fa-hand-paper', 
      name: 'Hand Tool',
      shortcut: 'H',
      submenu: [
        { id: 'hand', name: 'Hand Tool', icon: 'fa-hand-paper', shortcut: 'H' },
        { id: 'rotate-view', name: 'Rotate View Tool', icon: 'fa-redo' }
      ]
    },
    { 
      id: 'zoom', 
      icon: 'fa-search', 
      name: 'Zoom Tool',
      shortcut: 'Z',
      submenu: []
    }
  ];

  const handleToolClick = (toolId: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      setShowSubmenu(showSubmenu === toolId ? null : toolId);
    } else {
      setActiveTool(toolId as ToolId);
      setShowSubmenu(null);
    }
  };

  const handleSubmenuClick = (toolId: string) => {
    setActiveTool(toolId as ToolId);
    setShowSubmenu(null);
  };

  return (
    <div className="w-12 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
      {/* Tools */}
      <div className="flex-1 flex flex-col">
        {tools.map((tool) => (
          <div key={tool.id} className="relative">
            <button
              className={`w-12 h-8 flex items-center justify-center transition-colors text-sm hover:bg-gray-700 ${
                activeTool === tool.id ? 'bg-gray-600' : ''
              }`}
              title={`${tool.name} (${tool.shortcut})`}
              onClick={() => handleToolClick(tool.id, tool.submenu.length > 0)}
            >
              <i className={`${tool.icon.includes('far') ? '' : 'fas'} ${tool.icon} text-white`}></i>
              {tool.submenu.length > 0 && (
                <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-white"></div>
              )}
            </button>
            
            {/* Submenu */}
            {showSubmenu === tool.id && tool.submenu.length > 0 && (
              <div className="absolute left-full top-0 bg-gray-800 border border-gray-600 shadow-lg z-50 min-w-48">
                {tool.submenu.map((subTool) => (
                  <button
                    key={subTool.id}
                    className="w-full px-3 py-2 text-left hover:bg-gray-700 text-white text-sm flex items-center space-x-2"
                    onClick={() => handleSubmenuClick(subTool.id)}
                  >
                    <i className={`${subTool.icon.includes('far') ? '' : 'fas'} ${subTool.icon} text-white`}></i>
                    <span>{subTool.name}</span>
                    {subTool.shortcut && (
                      <span className="ml-auto text-gray-400 text-xs">{subTool.shortcut}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Color Picker - Fixed at bottom */}
      <div className="flex-shrink-0 w-12 h-16 bg-gray-800 border-t border-gray-600 flex flex-col items-center justify-center">
        <div className="relative w-7 h-7">
          {/* Background color (behind) */}
          <div 
            className="w-5 h-5 bg-black border border-gray-400 absolute top-1 left-1 cursor-pointer shadow-sm" 
            title="Background Color"
          />
          {/* Foreground color (in front) */}
          <div 
            className="foreground-color w-5 h-5 bg-white border border-gray-400 absolute top-0 left-0 cursor-pointer shadow-sm" 
            title="Foreground Color"
            style={{ backgroundColor: '#000000' }}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'color';
              input.value = '#000000';
              input.onchange = (e) => {
                const color = (e.target as HTMLInputElement).value;
                const foregroundElement = document.querySelector('.foreground-color') as HTMLElement;
                if (foregroundElement) {
                  foregroundElement.style.backgroundColor = color;
                }
              };
              input.click();
            }}
          />
        </div>
        
        {/* Small controls below */}
        <div className="flex mt-1 space-x-1">
          <div 
            className="w-2 h-2 bg-gray-600 cursor-pointer" 
            title="Swap Colors (X)"
          />
          <div 
            className="w-2 h-2 bg-gray-600 cursor-pointer" 
            title="Reset Colors (D)"
          />
        </div>
      </div>
    </div>
  );
}

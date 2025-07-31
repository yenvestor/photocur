import { useEditorStore } from '@/store/editorStore';
import { useTools } from '@/hooks/useTools';

export default function ToolOptionsBar() {
  const { activeTool, toolOptions, updateToolOptions } = useEditorStore();
  const { getToolById } = useTools();

  const currentTool = getToolById(activeTool);

  const handleOptionChange = (option: string, value: number | string) => {
    updateToolOptions({ [option]: value });
  };

  const renderToolOptions = () => {
    switch (activeTool) {
      case 'brush':
      case 'pencil':
      case 'eraser':
        return (
          <>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-text-secondary">Size:</label>
              <input
                type="range"
                min="1"
                max="300"
                value={toolOptions.brushSize}
                className="w-20 h-2 bg-tertiary-dark rounded-lg"
                onChange={(e) => handleOptionChange('brushSize', parseInt(e.target.value))}
              />
              <input
                type="number"
                value={toolOptions.brushSize}
                className="w-12 h-6 px-1 text-xs bg-tertiary-dark border border-quaternary-dark rounded"
                onChange={(e) => handleOptionChange('brushSize', parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-text-secondary">Opacity:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={toolOptions.opacity}
                className="w-20 h-2 bg-tertiary-dark rounded-lg"
                onChange={(e) => handleOptionChange('opacity', parseInt(e.target.value))}
              />
              <span className="text-sm w-8">{toolOptions.opacity}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-text-secondary">Flow:</label>
              <input
                type="range"
                min="1"
                max="100"
                value={toolOptions.flow}
                className="w-20 h-2 bg-tertiary-dark rounded-lg"
                onChange={(e) => handleOptionChange('flow', parseInt(e.target.value))}
              />
              <span className="text-sm w-8">{toolOptions.flow}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-text-secondary">Hardness:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={toolOptions.hardness}
                className="w-20 h-2 bg-tertiary-dark rounded-lg"
                onChange={(e) => handleOptionChange('hardness', parseInt(e.target.value))}
              />
              <span className="text-sm w-8">{toolOptions.hardness}%</span>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center px-2 text-xs">
      {/* Tool options based on Photopea layout */}
      <div className="flex items-center space-x-2">
        {/* Tool-specific icons and settings */}
        <button className="text-gray-400 hover:text-white">
          <i className="fas fa-mouse-pointer text-xs"></i>
        </button>
        <button className="text-gray-400 hover:text-white">
          <i className="fas fa-hand-paper text-xs"></i>
        </button>
        <button className="text-gray-400 hover:text-white">
          <i className="fas fa-crop text-xs"></i>
        </button>
        <button className="text-gray-400 hover:text-white">
          <i className="fas fa-eye-dropper text-xs"></i>
        </button>
        
        <span className="text-gray-500">|</span>
        
        {/* Feather setting */}
        <span className="text-gray-400">Feather:</span>
        <input 
          type="number" 
          value="0" 
          className="w-8 h-5 bg-gray-700 border border-gray-600 rounded text-xs text-white px-1"
        />
        <span className="text-gray-400">px</span>
        
        <span className="text-gray-500">|</span>
        
        {/* Refine Edge */}
        <span className="text-gray-400">Refine Edge</span>
        
        <span className="text-gray-500">|</span>
        
        {/* Mode dropdown */}
        <select
          className="bg-gray-700 border border-gray-600 rounded px-2 py-0.5 text-xs text-white"
          value={toolOptions.blendMode}
          onChange={(e) => handleOptionChange('blendMode', e.target.value)}
        >
          <option value="normal">Free</option>
          <option value="fixed-ratio">Fixed Ratio</option>
          <option value="fixed-size">Fixed Size</option>
        </select>
        
        <span className="text-gray-500">|</span>
        
        {/* Width and Height inputs */}
        <span className="text-gray-400">W:</span>
        <input 
          type="number" 
          value="800" 
          className="w-12 h-5 bg-gray-700 border border-gray-600 rounded text-xs text-white px-1"
        />
        
        <span className="text-gray-400">H:</span>
        <input 
          type="number" 
          value="600" 
          className="w-12 h-5 bg-gray-700 border border-gray-600 rounded text-xs text-white px-1"
        />
        
        {/* Additional tool options */}
        <span className="text-gray-500">|</span>
        
        <button className="text-gray-400 hover:text-white">
          <i className="fas fa-plus text-xs"></i>
        </button>
        <button className="text-gray-400 hover:text-white">
          <i className="fas fa-minus text-xs"></i>
        </button>
        <button className="text-gray-400 hover:text-white">
          <i className="fas fa-expand-arrows-alt text-xs"></i>
        </button>
      </div>
    </div>
  );
}

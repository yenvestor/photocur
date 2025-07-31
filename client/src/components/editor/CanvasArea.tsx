import { useCanvas } from '@/hooks/useCanvas';
import { useEditorStore } from '@/store/editorStore';

export default function CanvasArea() {
  const { canvasRef, handleMouseDown, handleMouseMove, handleMouseUp } = useCanvas();
  const { documents, activeDocumentId, setZoom } = useEditorStore();

  const activeDocument = documents.find(doc => doc.id === activeDocumentId);

  const handleZoomIn = () => {
    if (activeDocument) {
      const newZoom = Math.min(activeDocument.zoom * 1.2, 3200);
      setZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (activeDocument) {
      const newZoom = Math.max(activeDocument.zoom * 0.8, 1);
      setZoom(newZoom);
    }
  };

  const handleFitToScreen = () => {
    if (activeDocument) {
      // Calculate zoom to fit document in viewport
      setZoom(100);
    }
  };

  // Simple image upload function
  const openImageFromComputer = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.querySelector('canvas') as HTMLCanvasElement;
            if (canvas) {
              // Resize canvas to match image
              canvas.width = img.width;
              canvas.height = img.height;
              
              const ctx = canvas.getContext('2d');
              if (ctx) {
                // Clear canvas and draw image
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
              }
            }
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (!activeDocument) {
    return (
      <div className="flex-1 bg-primary-dark flex items-center justify-center">
        <div className="text-center text-text-secondary">
          <i className="fas fa-image text-4xl mb-4"></i>
          <p>No document open</p>
          <p className="text-sm">Create a new document or open an existing one</p>
          <button 
            onClick={openImageFromComputer}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Open Image from Computer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 canvas-area overflow-auto relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="relative bg-white shadow-2xl border-2 border-gray-300"
          style={{ 
            width: activeDocument.width, 
            height: activeDocument.height,
            transform: `scale(${activeDocument.zoom / 100})`
          }}
        >
          <canvas
            ref={canvasRef}
            width={activeDocument.width}
            height={activeDocument.height}
            className="w-full h-full cursor-crosshair bg-white"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={(e) => handleMouseUp(e)}
          />
        </div>
      </div>

      {/* Image Upload Button */}
      <div className="absolute top-4 left-4">
        <button 
          onClick={openImageFromComputer}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          title="Open Image from Computer"
        >
          <i className="fas fa-folder-open mr-2"></i>
          Open Image
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-secondary-dark rounded-lg px-3 py-2 shadow-lg">
        <button 
          className="w-8 h-8 hover:bg-tertiary-dark rounded flex items-center justify-center" 
          title="Zoom Out"
          onClick={handleZoomOut}
        >
          <i className="fas fa-minus text-sm"></i>
        </button>
        <span className="text-sm text-text-secondary w-12 text-center">
          {Math.round(activeDocument.zoom)}%
        </span>
        <button 
          className="w-8 h-8 hover:bg-tertiary-dark rounded flex items-center justify-center" 
          title="Zoom In"
          onClick={handleZoomIn}
        >
          <i className="fas fa-plus text-sm"></i>
        </button>
        <button 
          className="w-8 h-8 hover:bg-tertiary-dark rounded flex items-center justify-center" 
          title="Fit to Screen"
          onClick={handleFitToScreen}
        >
          <i className="fas fa-compress-arrows-alt text-sm"></i>
        </button>
      </div>

      {/* Document Info */}
      <div className="absolute bottom-4 right-4 bg-secondary-dark rounded-lg px-3 py-2 shadow-lg">
        <div className="text-xs text-text-secondary">
          {activeDocument.width} × {activeDocument.height} px • RGB/8
        </div>
      </div>
    </div>
  );
}

import { ToolId } from '@/types/editor';
import { floodFill, hexToRgb, gaussianBlur, sharpen } from './imageProcessing';
import { applyBrightnessContrast, convertToGrayscale, invertColors } from './imageAdjustments';
import { applyMotionBlur, applyEmboss } from './filterEffects';
import { rotateCanvas, scaleCanvas, flipHorizontal, flipVertical, skewCanvas } from './transformTools';
import { CanvasClipboard } from './clipboard';

export interface ToolHandler {
  onActivate?: (canvas: HTMLCanvasElement) => void;
  onDeactivate?: (canvas: HTMLCanvasElement) => void;
  onMouseDown?: (event: MouseEvent, canvas: HTMLCanvasElement, toolOptions?: any) => void;
  onMouseMove?: (event: MouseEvent, canvas: HTMLCanvasElement, toolOptions?: any) => void;
  onMouseUp?: (event: MouseEvent, canvas: HTMLCanvasElement, toolOptions?: any) => void;
}

export const toolHandlers: Record<ToolId, ToolHandler> = {
  // Selection tools
  'rectangle-select': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
    onMouseDown: (event, canvas) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const rect = canvas.getBoundingClientRect();
      const startX = event.clientX - rect.left;
      const startY = event.clientY - rect.top;
      
      let isDrawing = true;
      
      const onMouseMove = (e: MouseEvent) => {
        if (!isDrawing) return;
        
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        // Clear previous selection
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw selection rectangle
        ctx.strokeStyle = '#007ACC';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          Math.min(startX, currentX),
          Math.min(startY, currentY),
          Math.abs(currentX - startX),
          Math.abs(currentY - startY)
        );
      };
      
      const onMouseUp = () => {
        isDrawing = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
  },

  'ellipse-select': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'lasso-select': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'magic-wand': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  // Drawing tools
  'brush': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
    onMouseDown: (event, canvas, toolOptions) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      let isDrawing = true;
      let lastX = x;
      let lastY = y;
      
      // Set brush properties
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = toolOptions?.brushSize || 10;
      ctx.globalAlpha = (toolOptions?.opacity || 100) / 100;
      ctx.strokeStyle = toolOptions?.color || '#000000';
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      const onMouseMove = (e: MouseEvent) => {
        if (!isDrawing) return;
        
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        lastX = currentX;
        lastY = currentY;
      };
      
      const onMouseUp = () => {
        isDrawing = false;
        ctx.globalAlpha = 1;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
  },

  'pencil': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
    onMouseDown: (event, canvas, toolOptions) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      let isDrawing = true;
      
      ctx.lineCap = 'square';
      ctx.lineJoin = 'miter';
      ctx.lineWidth = (toolOptions?.brushSize || 2) * 0.5;
      ctx.globalAlpha = (toolOptions?.opacity || 100) / 100;
      ctx.strokeStyle = toolOptions?.color || '#000000';
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      const onMouseMove = (e: MouseEvent) => {
        if (!isDrawing) return;
        
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
      };
      
      const onMouseUp = () => {
        isDrawing = false;
        ctx.globalAlpha = 1;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
  },

  'eraser': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
    onMouseDown: (event, canvas, toolOptions) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      let isDrawing = true;
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = toolOptions?.brushSize || 20;
      ctx.globalAlpha = (toolOptions?.opacity || 100) / 100;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      const onMouseMove = (e: MouseEvent) => {
        if (!isDrawing) return;
        
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
      };
      
      const onMouseUp = () => {
        isDrawing = false;
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
  },

  'paint-bucket': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
    onMouseDown: (event, canvas, toolOptions) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const fillColor = hexToRgb(toolOptions?.color || '#000000');
      floodFill(ctx, x, y, fillColor, canvas.width, canvas.height);
    },
  },

  'clone': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'blur': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'sharpen': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'smudge': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'dodge': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'burn': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'sponge': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'gradient': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'type': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'text';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
    onMouseDown: (event, canvas) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const text = prompt('Enter text:');
      if (text) {
        ctx.font = '24px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText(text, x, y);
      }
    },
  },

  'move': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'move';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'hand': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'grab';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'zoom': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'zoom-in';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'eyedropper': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'pen': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'rectangle': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },

  'ellipse': {
    onActivate: (canvas) => {
      canvas.style.cursor = 'crosshair';
    },
    onDeactivate: (canvas) => {
      canvas.style.cursor = 'default';
    },
  },
};
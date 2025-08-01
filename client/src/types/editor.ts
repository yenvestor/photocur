export type ToolId = 
  | 'rectangle-select' | 'ellipse-select' | 'lasso-select' | 'magic-wand'
  | 'brush' | 'pencil' | 'eraser' | 'paint-bucket' | 'clone' 
  | 'blur' | 'sharpen' | 'smudge' | 'dodge' | 'burn' | 'sponge'
  | 'gradient' | 'type' | 'move' | 'hand' | 'zoom' | 'eyedropper'
  | 'pen' | 'rectangle' | 'ellipse';

export interface Tool {
  id: ToolId;
  name: string;
  icon: string;
  shortcut?: string;
  category: 'selection' | 'painting' | 'retouching' | 'vector' | 'text' | 'navigation' | 'shape';
}

export interface Document {
  id: string;
  name: string;
  width: number;
  height: number;
  layers: Layer[];
  activeLayerId: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  type: 'raster' | 'vector' | 'text' | 'adjustment';
  data?: any;
}

export type BlendMode = 
  | 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' 
  | 'hard-light' | 'color-dodge' | 'color-burn' | 'darken' 
  | 'lighten' | 'difference' | 'exclusion';

export interface ToolOptions {
  brushSize: number;
  opacity: number;
  flow: number;
  hardness: number;
  blendMode: BlendMode;
  color: string;
  backgroundColor: string;
}

export interface HistoryStep {
  id: string;
  action: string;
  before: string;
  after: string;
  timestamp: number;
}

export interface EditorState {
  documents: Document[];
  activeDocumentId: string | null;
  activeTool: ToolId;
  toolOptions: ToolOptions;
  history: HistoryStep[];
  historyIndex: number;
  canvasRef: HTMLCanvasElement | null;
  zoom: number;
  pan: { x: number; y: number };
  isDrawing: boolean;
}
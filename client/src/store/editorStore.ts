import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { toolHandlers } from '@/utils/toolHandlers';
import type { Document, Layer, ToolOptions, HistoryStep, EditorState, ToolId } from '@/types/editor';

interface EditorStore extends EditorState {
  // Document actions
  createDocument: (name: string, width: number, height: number) => void;
  closeDocument: (id: string) => void;
  setActiveDocument: (id: string) => void;
  
  // Layer actions
  addLayer: (documentId: string, layer: Partial<Layer>) => void;
  removeLayer: (documentId: string, layerId: string) => void;
  setActiveLayer: (documentId: string, layerId: string) => void;
  updateLayer: (documentId: string, layerId: string, updates: Partial<Layer>) => void;
  duplicateLayer: (documentId: string, layerId: string) => void;
  
  // Tool actions
  setActiveTool: (toolId: ToolId) => void;
  updateToolOptions: (options: Partial<ToolOptions>) => void;
  
  // Canvas actions
  setCanvasRef: (canvas: HTMLCanvasElement | null) => void;
  setIsDrawing: (drawing: boolean) => void;
  
  // History actions
  addHistoryStep: (step: Omit<HistoryStep, 'timestamp'>) => void;
  undo: () => void;
  redo: () => void;
  
  // View actions
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
}

const createDefaultDocument = (name: string, width: number, height: number): Document => ({
  id: crypto.randomUUID(),
  name,
  width,
  height,
  zoom: 1,
  pan: { x: 0, y: 0 },
  saved: false,
  layers: [
    {
      id: crypto.randomUUID(),
      name: 'Background',
      type: 'raster',
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: 'normal',
      data: null,
    }
  ],
  activeLayerId: '',
});

const initialDocument = createDefaultDocument('Untitled-1', 800, 600);
initialDocument.activeLayerId = initialDocument.layers[0].id;

export const useEditorStore = create<EditorStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    documents: [initialDocument],
    activeDocumentId: initialDocument.id,
    activeTool: 'brush',
    toolOptions: {
      brushSize: 10,
      opacity: 100,
      flow: 100,
      hardness: 100,
      blendMode: 'normal',
    },
    selection: {
      active: false,
      bounds: { x: 0, y: 0, width: 0, height: 0 },
      marching: false,
    },
    history: [],
    historyIndex: -1,
    isDrawing: false,
    canvasRef: null,
    zoom: 1,
    pan: { x: 0, y: 0 },

    // Document actions
    createDocument: (name, width, height) => {
      const newDoc = createDefaultDocument(name, width, height);
      newDoc.activeLayerId = newDoc.layers[0].id;
      
      set(state => ({
        documents: [...state.documents, newDoc],
        activeDocumentId: newDoc.id,
      }));
    },

    closeDocument: (id) => {
      set(state => {
        const newDocuments = state.documents.filter(doc => doc.id !== id);
        const newActiveId = newDocuments.length > 0 
          ? (state.activeDocumentId === id ? newDocuments[0].id : state.activeDocumentId)
          : null;

        return {
          documents: newDocuments,
          activeDocumentId: newActiveId,
        };
      });
    },

    setActiveDocument: (id) => {
      set({ activeDocumentId: id });
    },

    // Layer actions
    addLayer: (documentId, layerData) => {
      const newLayer: Layer = {
        id: crypto.randomUUID(),
        name: layerData.name || 'New Layer',
        type: layerData.type || 'raster',
        visible: layerData.visible ?? true,
        locked: layerData.locked ?? false,
        opacity: layerData.opacity ?? 100,
        blendMode: layerData.blendMode || 'normal',
        data: layerData.data || null,
      };

      set(state => ({
        documents: state.documents.map(doc =>
          doc.id === documentId
            ? { ...doc, layers: [...doc.layers, newLayer] }
            : doc
        ),
      }));
    },

    removeLayer: (documentId, layerId) => {
      set(state => ({
        documents: state.documents.map(doc =>
          doc.id === documentId
            ? { 
                ...doc, 
                layers: doc.layers.filter(layer => layer.id !== layerId),
                activeLayerId: doc.activeLayerId === layerId 
                  ? (doc.layers.find(l => l.id !== layerId)?.id || '')
                  : doc.activeLayerId
              }
            : doc
        ),
      }));
    },

    setActiveLayer: (documentId, layerId) => {
      set(state => ({
        documents: state.documents.map(doc =>
          doc.id === documentId
            ? { ...doc, activeLayerId: layerId }
            : doc
        ),
      }));
    },

    updateLayer: (documentId, layerId, updates) => {
      set(state => ({
        documents: state.documents.map(doc =>
          doc.id === documentId
            ? {
                ...doc,
                layers: doc.layers.map(layer =>
                  layer.id === layerId ? { ...layer, ...updates } : layer
                ),
              }
            : doc
        ),
      }));
    },

    duplicateLayer: (documentId, layerId) => {
      set(state => {
        const doc = state.documents.find(d => d.id === documentId);
        const layer = doc?.layers.find(l => l.id === layerId);
        
        if (!layer) return state;

        const duplicatedLayer: Layer = {
          ...layer,
          id: crypto.randomUUID(),
          name: `${layer.name} copy`,
        };

        return {
          documents: state.documents.map(doc =>
            doc.id === documentId
              ? { ...doc, layers: [...doc.layers, duplicatedLayer] }
              : doc
          ),
        };
      });
    },

    // Tool actions
    setActiveTool: (toolId) => {
      const { canvasRef } = get();
      
      // Deactivate current tool
      if (canvasRef) {
        const currentTool = get().activeTool;
        if (toolHandlers[currentTool as ToolId]?.onDeactivate) {
          toolHandlers[currentTool as ToolId].onDeactivate!(canvasRef);
        }
      }

      set({ activeTool: toolId });

      // Activate new tool
      if (canvasRef && toolHandlers[toolId]?.onActivate) {
        toolHandlers[toolId].onActivate(canvasRef);
      }
    },

    updateToolOptions: (options) => {
      set(state => ({
        toolOptions: { ...state.toolOptions, ...options },
      }));
    },

    // Canvas actions
    setCanvasRef: (canvas) => {
      set({ canvasRef: canvas });
    },

    setIsDrawing: (drawing) => {
      set({ isDrawing: drawing });
    },

    // History actions
    addHistoryStep: (step) => {
      const historyStep: HistoryStep = {
        ...step,
        timestamp: Date.now(),
      };
      
      set(state => {
        const history = state.history.slice(0, state.historyIndex + 1);
        history.push(historyStep);
        
        // Limit history to 50 steps
        if (history.length > 50) {
          history.shift();
        }
        
        return {
          history,
          historyIndex: history.length - 1,
        };
      });
    },

    undo: () => {
      set(state => {
        if (state.historyIndex >= 0) {
          const step = state.history[state.historyIndex];
          
          // Apply the undo operation
          if (step && state.canvasRef) {
            // Implementation would depend on step type
            console.log('Undoing:', step.action);
          }
          
          return {
            historyIndex: state.historyIndex - 1,
          };
        }
        return state;
      });
    },

    redo: () => {
      set(state => {
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1;
          const step = state.history[newIndex];
          
          // Apply the redo operation
          if (step && state.canvasRef) {
            // Implementation would depend on step type
            console.log('Redoing:', step.action);
          }
          
          return {
            historyIndex: newIndex,
          };
        }
        return state;
      });
    },

    // View actions
    setZoom: (zoom) => {
      set({ zoom });
    },

    setPan: (pan) => {
      set({ pan });
    },
  }))
);
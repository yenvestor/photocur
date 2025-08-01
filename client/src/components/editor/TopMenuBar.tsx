import { useState } from 'react';
import { openImageFilePicker, importImageFile, exportCanvasAsImage, saveDocumentAsProject, loadProjectFile, quickExport } from '@/utils/fileOperations';
import { useEditorStore } from '@/store/editorStore';
import {
  applyBrightnessContrast,
  applyLevels,
  applyHueSaturation,
  convertToGrayscale,
  invertColors,
  applyExposure,
  applyVibrance,
  applyPosterize,
  applyThreshold
} from '@/utils/imageAdjustments';
import {
  applyMotionBlur,
  applyOilPainting,
  applyWatercolor,
  applyEmboss,
  applyEdgeDetection,
  applyPinch,
  applySpherize
} from '@/utils/filterEffects';
import {
  rotateCanvas,
  scaleCanvas,
  flipHorizontal,
  flipVertical,
  skewCanvas,
  resizeCanvas,
  cropCanvas
} from '@/utils/transformTools';
import { CanvasClipboard } from '@/utils/clipboard';
import { MenuItem, MenuSeparator } from '@/types/editor';

// Helper function to create a separator
const separator = (): MenuSeparator => ({ type: 'separator' });

interface MenuGroup {
  id: string;
  label: string;
  items: (MenuItem | MenuSeparator)[];
}

export default function TopMenuBar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { createDocument, activeDocumentId, documents, undo, redo, addHistoryStep, closeDocument } = useEditorStore();
  const activeDocument = documents.find(doc => doc.id === activeDocumentId);

  // Helper function to get the active canvas
  const getActiveCanvas = (): HTMLCanvasElement | null => {
    return window.document.querySelector('canvas') as HTMLCanvasElement;
  };

  // Helper function to add history and get canvas
  const withHistoryAndCanvas = (operation: (canvas: HTMLCanvasElement) => void) => {
    const canvas = getActiveCanvas();
    if (!canvas) {
      alert('No active canvas found');
      return;
    }
    
    // Save state before operation
    const beforeState = canvas.toDataURL();
    
    // Perform operation
    operation(canvas);
    
    // Save state after operation
    const afterState = canvas.toDataURL();
    
    // Add to history
    addHistoryStep({
      action: 'transform',
      data: { before: beforeState, after: afterState }
    });
  };

  const handleNewDocument = () => {
    createDocument('Untitled', 800, 600);
    setOpenDropdown(null);
  };

  const handleCloseDocument = () => {
    if (activeDocumentId) {
      closeDocument(activeDocumentId);
      setOpenDropdown(null);
    }
  };

  const menuGroups: MenuGroup[] = [
    {
      id: 'file',
      label: 'File',
      items: [
        { 
          label: 'New...', 
          shortcut: 'Ctrl+N', 
          action: handleNewDocument 
        },
        { 
          label: 'Open...', 
          shortcut: 'Ctrl+O', 
          action: () => {
            openImageFilePicker((file) => {
              const canvas = getActiveCanvas();
              if (canvas) importImageFile(file, canvas);
            });
            setOpenDropdown(null);
          }
        },
        { 
          label: 'Open Recent', 
          action: () => {}, 
          submenu: [
            { label: 'image1.jpg', action: () => {} },
            { label: 'design.psd', action: () => {} },
            { label: 'Clear Recent', action: () => {} }
          ]
        },
        { 
          label: 'Close', 
          shortcut: 'Ctrl+W', 
          action: handleCloseDocument 
        },
        { 
          label: 'Close All', 
          shortcut: 'Ctrl+Alt+W', 
          action: () => {
            documents.forEach(doc => closeDocument(doc.id));
            setOpenDropdown(null);
          }
        },
        separator(),
        { 
          label: 'Save', 
          shortcut: 'Ctrl+S', 
          action: () => {
            if (activeDocument) {
              saveDocumentAsProject(activeDocument);
            }
            setOpenDropdown(null);
          }
        },
        { 
          label: 'Save As...', 
          shortcut: 'Ctrl+Shift+S', 
          action: () => {
            if (activeDocument) {
              saveDocumentAsProject(activeDocument);
            }
            setOpenDropdown(null);
          }
        },
        { 
          label: 'Save for Web...', 
          shortcut: 'Ctrl+Alt+Shift+S', 
          action: () => {
            const canvas = getActiveCanvas();
            if (canvas) quickExport(canvas, 'web');
            setOpenDropdown(null);
          }
        },
        separator(),
        { 
          label: 'Import', 
          action: () => {}, 
          submenu: [
            { 
              label: 'Image...', 
              action: () => {
                openImageFilePicker((file) => {
                  const canvas = getActiveCanvas();
                  if (canvas) importImageFile(file, canvas);
                });
              }
            },
            { label: 'Video Frames...', action: () => {} },
            { label: 'PDF...', action: () => {} }
          ]
        },
        { 
          label: 'Export', 
          action: () => {}, 
          submenu: [
            { 
              label: 'PNG...', 
              action: () => {
                const canvas = getActiveCanvas();
                if (canvas) exportCanvasAsImage(canvas, 'png');
              }
            },
            { 
              label: 'JPEG...', 
              action: () => {
                const canvas = getActiveCanvas();
                if (canvas) exportCanvasAsImage(canvas, 'jpeg');
              }
            },
            { 
              label: 'WebP...', 
              action: () => {
                const canvas = getActiveCanvas();
                if (canvas) exportCanvasAsImage(canvas, 'webp');
              }
            }
          ]
        },
        separator(),
        { 
          label: 'Print...', 
          shortcut: 'Ctrl+P', 
          action: () => {
            window.print();
            setOpenDropdown(null);
          }
        }
      ]
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { 
          label: 'Undo', 
          shortcut: 'Ctrl+Z', 
          action: () => {
            undo();
            setOpenDropdown(null);
          }
        },
        { 
          label: 'Redo', 
          shortcut: 'Ctrl+Y', 
          action: () => {
            redo();
            setOpenDropdown(null);
          }
        },
        separator(),
        { 
          label: 'Cut', 
          shortcut: 'Ctrl+X', 
          action: () => {
            const canvas = getActiveCanvas();
            if (canvas) CanvasClipboard.cut(canvas);
            setOpenDropdown(null);
          }
        },
        { 
          label: 'Copy', 
          shortcut: 'Ctrl+C', 
          action: () => {
            const canvas = getActiveCanvas();
            if (canvas) CanvasClipboard.copy(canvas);
            setOpenDropdown(null);
          }
        },
        { 
          label: 'Paste', 
          shortcut: 'Ctrl+V', 
          action: async () => {
            const canvas = getActiveCanvas();
            if (canvas) await CanvasClipboard.paste(canvas);
            setOpenDropdown(null);
          }
        },
        { 
          label: 'Clear', 
          shortcut: 'Delete', 
          action: () => {
            const canvas = getActiveCanvas();
            if (canvas) CanvasClipboard.clearCanvas(canvas);
            setOpenDropdown(null);
          }
        },
        separator(),
        { 
          label: 'Fill...', 
          shortcut: 'Shift+F5', 
          action: () => {
            const canvas = getActiveCanvas();
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
              }
            }
            setOpenDropdown(null);
          }
        },
        { 
          label: 'Stroke...', 
          action: () => {
            const canvas = getActiveCanvas();
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
              }
            }
            setOpenDropdown(null);
          }
        },
        separator(),
        { 
          label: 'Transform', 
          action: () => {}, 
          submenu: [
            { 
              label: 'Scale...', 
              action: () => withHistoryAndCanvas((canvas) => scaleCanvas(canvas, 1.2, 1.2))
            },
            { 
              label: 'Rotate...', 
              action: () => withHistoryAndCanvas((canvas) => rotateCanvas(canvas, 90))
            },
            { 
              label: 'Skew...', 
              action: () => withHistoryAndCanvas((canvas) => skewCanvas(canvas, 10, 0))
            },
            { 
              label: 'Flip Horizontal', 
              action: () => withHistoryAndCanvas((canvas) => flipHorizontal(canvas))
            },
            { 
              label: 'Flip Vertical', 
              action: () => withHistoryAndCanvas((canvas) => flipVertical(canvas))
            }
          ]
        }
      ]
    },
    {
      id: 'image',
      label: 'Image',
      items: [
        { 
          label: 'Image Size...', 
          shortcut: 'Ctrl+Alt+I', 
          action: () => {
            const canvas = getActiveCanvas();
            if (canvas) {
              const newWidth = prompt('New width:', canvas.width.toString());
              const newHeight = prompt('New height:', canvas.height.toString());
              if (newWidth && newHeight) {
                resizeCanvas(canvas, parseInt(newWidth), parseInt(newHeight));
              }
            }
            setOpenDropdown(null);
          }
        },
        { 
          label: 'Canvas Size...', 
          shortcut: 'Ctrl+Alt+C', 
          action: () => {
            const canvas = getActiveCanvas();
            if (canvas) {
              const newWidth = prompt('Canvas width:', canvas.width.toString());
              const newHeight = prompt('Canvas height:', canvas.height.toString());
              if (newWidth && newHeight) {
                resizeCanvas(canvas, parseInt(newWidth), parseInt(newHeight));
              }
            }
            setOpenDropdown(null);
          }
        },
        separator(),
        { 
          label: 'Crop', 
          action: () => {
            const canvas = getActiveCanvas();
            if (canvas) {
              cropCanvas(canvas, { x: 50, y: 50, width: canvas.width - 100, height: canvas.height - 100 });
            }
            setOpenDropdown(null);
          }
        },
        separator(),
        { 
          label: 'Adjustments', 
          action: () => {}, 
          submenu: [
            { 
              label: 'Brightness/Contrast...', 
              action: () => withHistoryAndCanvas((canvas) => 
                applyBrightnessContrast(canvas, { brightness: 10, contrast: 10 })
              )
            },
            { 
              label: 'Levels...', 
              action: () => withHistoryAndCanvas((canvas) => 
                applyLevels(canvas, { shadows: 0, midtones: 1, highlights: 255 })
              )
            },
            { 
              label: 'Hue/Saturation...', 
              action: () => withHistoryAndCanvas((canvas) => 
                applyHueSaturation(canvas, { hue: 0, saturation: 10, lightness: 0 })
              )
            },
            { 
              label: 'Exposure...', 
              action: () => withHistoryAndCanvas((canvas) => applyExposure(canvas, 0.5))
            },
            { 
              label: 'Vibrance...', 
              action: () => withHistoryAndCanvas((canvas) => applyVibrance(canvas, 20))
            },
            separator(),
            { 
              label: 'Desaturate', 
              action: () => withHistoryAndCanvas((canvas) => convertToGrayscale(canvas))
            },
            { 
              label: 'Invert', 
              action: () => withHistoryAndCanvas((canvas) => invertColors(canvas))
            },
            { 
              label: 'Posterize...', 
              action: () => withHistoryAndCanvas((canvas) => applyPosterize(canvas, 4))
            },
            { 
              label: 'Threshold...', 
              action: () => withHistoryAndCanvas((canvas) => applyThreshold(canvas, 128))
            }
          ]
        }
      ]
    },
    {
      id: 'filter',
      label: 'Filter',
      items: [
        { 
          label: 'Blur', 
          action: () => {}, 
          submenu: [
            { 
              label: 'Motion Blur...', 
              action: () => withHistoryAndCanvas((canvas) => 
                applyMotionBlur(canvas, { angle: 0, distance: 10 })
              )
            }
          ]
        },
        { 
          label: 'Artistic', 
          action: () => {}, 
          submenu: [
            { 
              label: 'Oil Painting...', 
              action: () => withHistoryAndCanvas((canvas) => applyOilPainting(canvas))
            },
            { 
              label: 'Watercolor...', 
              action: () => withHistoryAndCanvas((canvas) => applyWatercolor(canvas))
            }
          ]
        },
        { 
          label: 'Stylize', 
          action: () => {}, 
          submenu: [
            { 
              label: 'Emboss...', 
              action: () => withHistoryAndCanvas((canvas) => applyEmboss(canvas))
            },
            { 
              label: 'Find Edges', 
              action: () => withHistoryAndCanvas((canvas) => applyEdgeDetection(canvas))
            }
          ]
        },
        { 
          label: 'Distort', 
          action: () => {}, 
          submenu: [
            { 
              label: 'Pinch...', 
              action: () => withHistoryAndCanvas((canvas) => applyPinch(canvas))
            },
            { 
              label: 'Spherize...', 
              action: () => withHistoryAndCanvas((canvas) => applySpherize(canvas))
            }
          ]
        }
      ]
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { label: 'Zoom In', shortcut: 'Ctrl+=', action: () => {} },
        { label: 'Zoom Out', shortcut: 'Ctrl+-', action: () => {} },
        { label: 'Fit to Screen', shortcut: 'Ctrl+0', action: () => {} },
        { label: 'Actual Size', shortcut: 'Ctrl+1', action: () => {} },
        separator(),
        { label: 'Rulers', shortcut: 'Ctrl+R', action: () => {}, checked: false },
        { label: 'Grid', shortcut: 'Ctrl+;', action: () => {}, checked: false },
        { label: 'Guides', action: () => {}, checked: true },
        separator(),
        { label: 'Snap', action: () => {}, checked: true },
        { 
          label: 'Snap To', 
          action: () => {}, 
          submenu: [
            { label: 'Guides', action: () => {}, checked: true },
            { label: 'Grid', action: () => {}, checked: false },
            { label: 'Layers', action: () => {}, checked: false }
          ]
        }
      ]
    },
    {
      id: 'window',
      label: 'Window',
      items: [
        { label: 'Minimize', action: () => {} },
        { label: 'Zoom', action: () => {} },
        separator(),
        { label: 'Brush', action: () => {}, checked: true },
        { label: 'Channels', action: () => {}, checked: true },
        { label: 'Character', action: () => {}, checked: true },
        { label: 'Color', action: () => {}, checked: true },
        { label: 'Info', action: () => {}, checked: true },
        { label: 'Layers', action: () => {}, checked: true },
        { label: 'Navigator', action: () => {}, checked: true },
        { label: 'History', action: () => {}, checked: true },
        { label: 'Paragraph', action: () => {}, checked: true },
        { label: 'Paths', action: () => {}, checked: true },
        { label: 'Properties', action: () => {}, checked: true },
        { label: 'Styles', action: () => {}, checked: true },
        { label: 'Swatches', action: () => {}, checked: true },
        { label: 'Tool Presets', action: () => {}, checked: true },
        { label: 'Tools', action: () => {}, checked: true }
      ]
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        { label: 'PhotoStar Help...', shortcut: 'F1', action: () => {} },
        { label: 'Keyboard Shortcuts...', action: () => {} },
        separator(),
        { label: 'About PhotoStar...', action: () => {} }
      ]
    }
  ];

  return (
    <div className="bg-gray-900 border-b border-gray-700 px-2 py-1">
      <div className="flex items-center space-x-1">
        {menuGroups.map((menu) => (
          <div key={menu.id} className="relative">
            <button
              className="px-2 py-1 text-xs text-white hover:bg-gray-700 rounded"
              onClick={() => setOpenDropdown(openDropdown === menu.id ? null : menu.id)}
            >
              {menu.label}
            </button>
            {openDropdown === menu.id && (
              <div className="absolute top-full left-0 bg-gray-800 border border-gray-600 shadow-lg z-50 min-w-48">
                {menu.items.map((item, index) => {
                  if ('type' in item && item.type === 'separator') {
                    return <hr key={index} className="border-gray-600" />;
                  }
                  const menuItem = item as MenuItem;
                  return (
                    <div key={index} className="relative group">
                      <button
                        className="block w-full px-3 py-1 text-xs text-left hover:bg-gray-700 flex items-center justify-between text-white"
                        onClick={menuItem.action}
                      >
                        <span>{menuItem.label}</span>
                        <div className="flex items-center space-x-2">
                          {menuItem.shortcut && (
                            <span className="text-gray-400 text-xs">{menuItem.shortcut}</span>
                          )}
                          {menuItem.submenu && (
                            <i className="fas fa-chevron-right text-xs text-gray-400"></i>
                          )}
                        </div>
                      </button>
                      {menuItem.submenu && (
                        <div className="absolute left-full top-0 bg-gray-800 border border-gray-600 shadow-lg z-50 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          {menuItem.submenu.map((subItem, subIndex) => (
                            <button
                              key={subIndex}
                              className="block w-full px-3 py-1 text-xs text-left hover:bg-gray-700 text-white"
                              onClick={subItem.action}
                            >
                              <span>{subItem.label}</span>
                              {subItem.shortcut && (
                                <span className="float-right text-gray-400 text-xs">{subItem.shortcut}</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
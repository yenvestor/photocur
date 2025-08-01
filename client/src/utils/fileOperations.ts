/**
 * File operations for image import/export and project management
 */

export function openImageFilePicker(callback: (file: File) => void): void {
  const input = window.document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      callback(file);
    }
  };
  input.click();
}

export function importImageFile(file: File, canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
  img.src = URL.createObjectURL(file);
}

export function exportCanvasAsImage(canvas: HTMLCanvasElement, format: 'png' | 'jpeg' | 'webp' = 'png'): void {
  const link = window.document.createElement('a');
  link.download = `image.${format}`;
  link.href = canvas.toDataURL(`image/${format}`);
  link.click();
}

export function saveDocumentAsProject(document: any): void {
  const projectData = {
    name: document.name,
    width: document.width,
    height: document.height,
    layers: document.layers,
    version: '1.0'
  };

  const jsonString = JSON.stringify(projectData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = window.document.createElement('a');
  a.href = url;
  a.download = `${document.name}.json`;
  window.document.body.appendChild(a);
  a.click();
  window.document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function loadProjectFile(callback: (project: any) => void): void {
  const input = window.document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const project = JSON.parse(e.target?.result as string);
          callback(project);
        } catch (error) {
          console.error('Error loading project:', error);
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}

export function quickExport(canvas: HTMLCanvasElement, format: 'web' | 'print' = 'web'): void {
  if (format === 'web') {
    exportCanvasAsImage(canvas, 'png');
  } else {
    exportCanvasAsImage(canvas, 'jpeg');
  }
}
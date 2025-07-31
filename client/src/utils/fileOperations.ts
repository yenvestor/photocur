export class FileOperations {
  static async openFile(): Promise<File | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,.psd,.xcf';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        resolve(file || null);
      };
      
      input.click();
    });
  }

  static async loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }

  static downloadCanvas(canvas: HTMLCanvasElement, filename: string, format: string = 'png') {
    const link = document.createElement('a');
    link.download = filename;
    
    if (format === 'jpg' || format === 'jpeg') {
      link.href = canvas.toDataURL('image/jpeg', 0.9);
    } else {
      link.href = canvas.toDataURL('image/png');
    }
    
    link.click();
  }

  static async exportProject(project: any): Promise<Blob> {
    const projectData = JSON.stringify(project);
    return new Blob([projectData], { type: 'application/json' });
  }

  static async importProject(file: File): Promise<any> {
    const text = await file.text();
    return JSON.parse(text);
  }
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCheckerboard(size: number = 20) {
    const cols = Math.ceil(this.canvas.width / size);
    const rows = Math.ceil(this.canvas.height / size);

    // Draw checkerboard pattern only in transparent areas
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'destination-over';
    
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if ((x + y) % 2 === 0) {
          this.ctx.fillStyle = '#f0f0f0';
        } else {
          this.ctx.fillStyle = '#e0e0e0';
        }
        this.ctx.fillRect(x * size, y * size, size, size);
      }
    }
    
    this.ctx.restore();
  }

  drawLayer(layer: any, opacity: number = 1) {
    const previousAlpha = this.ctx.globalAlpha;
    this.ctx.globalAlpha = opacity / 100;
    
    // Layer rendering logic would go here
    // For now, just draw a placeholder
    
    this.ctx.globalAlpha = previousAlpha;
  }

  drawBrushStroke(
    points: { x: number; y: number }[],
    size: number,
    color: string,
    opacity: number = 1
  ) {
    if (points.length < 2) return;

    this.ctx.save();
    this.ctx.globalAlpha = opacity / 100;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = size;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      const cpx = (prevPoint.x + currentPoint.x) / 2;
      const cpy = (prevPoint.y + currentPoint.y) / 2;

      this.ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, cpx, cpy);
    }

    this.ctx.stroke();
    this.ctx.restore();
  }

  drawSelection(bounds: { x: number; y: number; width: number; height: number }) {
    this.ctx.save();
    this.ctx.strokeStyle = '#0078D4';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    this.ctx.restore();
  }

  getImageData() {
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  putImageData(imageData: ImageData, x: number = 0, y: number = 0) {
    this.ctx.putImageData(imageData, x, y);
  }
}

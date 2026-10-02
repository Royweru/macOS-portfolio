export interface PaintPoint97 {
  x: number;
  y: number;
}

export interface PaintRect97 {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Windows Paint left/right mouse buttons select the primary/secondary color. */
export function getPaintColorForButton97(button: number, primary: string, secondary: string) {
  return button === 2 ? secondary : primary;
}

export function getPaintColorForTool97(tool: string, button: number, primary: string, secondary: string) {
  return tool === 'eraser' ? secondary : getPaintColorForButton97(button, primary, secondary);
}

export function selectPaintSwatch97(button: number, swatch: string, primary: string, secondary: string) {
  return button === 2
    ? { primary, secondary: swatch }
    : { primary: swatch, secondary };
}

export function containedImageRect97(sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number): PaintRect97 {
  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  return { x: Math.floor((targetWidth - width) / 2), y: Math.floor((targetHeight - height) / 2), width, height };
}

export function boundsForPoints97(points: PaintPoint97[]): PaintRect97 {
  const xs = points.map(point => point.x);
  const ys = points.map(point => point.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(1, Math.max(...xs) - x + 1), height: Math.max(1, Math.max(...ys) - y + 1) };
}

export function shouldClosePaintPolygon97(points: PaintPoint97[], point: PaintPoint97, tolerance = 8) {
  if (points.length < 3) return false;
  const first = points[0];
  return Math.hypot(point.x - first.x, point.y - first.y) <= tolerance;
}

export function tracePaintPolygon97(context: CanvasRenderingContext2D, points: PaintPoint97[], close = true) {
  if (points.length < 2) return false;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach(point => context.lineTo(point.x, point.y));
  if (close) context.closePath();
  context.stroke();
  return true;
}

/** Fills only the 4-connected region whose pixels exactly match the seed color. */
export function floodFill97(pixels: Uint8ClampedArray, width: number, height: number, x: number, y: number, color: [number, number, number, number]) {
  if (x < 0 || y < 0 || x >= width || y >= height || width < 1 || height < 1) return 0;
  const seed = (y * width + x) * 4;
  const target: [number, number, number, number] = [pixels[seed], pixels[seed + 1], pixels[seed + 2], pixels[seed + 3]];
  if (target.every((channel, index) => channel === color[index])) return 0;
  const visited = new Uint8Array(width * height);
  const stack = [y * width + x];
  visited[stack[0]] = 1;
  let changed = 0;
  while (stack.length) {
    const pixel = stack.pop()!;
    const offset = pixel * 4;
    if (pixels[offset] !== target[0] || pixels[offset + 1] !== target[1] || pixels[offset + 2] !== target[2] || pixels[offset + 3] !== target[3]) continue;
    pixels[offset] = color[0];
    pixels[offset + 1] = color[1];
    pixels[offset + 2] = color[2];
    pixels[offset + 3] = color[3];
    changed += 1;
    const neighbors = [pixel % width > 0 ? pixel - 1 : -1, pixel % width < width - 1 ? pixel + 1 : -1, pixel >= width ? pixel - width : -1, pixel + width < width * height ? pixel + width : -1];
    for (const next of neighbors) {
      if (next < 0 || visited[next]) continue;
      const nextOffset = next * 4;
      if (pixels[nextOffset] === target[0] && pixels[nextOffset + 1] === target[1] && pixels[nextOffset + 2] === target[2] && pixels[nextOffset + 3] === target[3]) {
        visited[next] = 1;
        stack.push(next);
      }
    }
  }
  return changed;
}

export function drawShape97(context: CanvasRenderingContext2D, tool: string, start: PaintPoint97, end: PaintPoint97) {
  const left = Math.min(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);
  context.beginPath();
  if (tool === 'line') {
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
  } else if (tool === 'curve') {
    context.moveTo(start.x, start.y);
    context.quadraticCurveTo((start.x + end.x) / 2, Math.min(start.y, end.y) - height * 0.45, end.x, end.y);
  } else if (tool === 'ellipse') {
    context.ellipse(left + width / 2, top + height / 2, Math.max(width / 2, 0.5), Math.max(height / 2, 0.5), 0, 0, Math.PI * 2);
  } else if (tool === 'polygon') {
    context.moveTo(left + width / 2, top);
    context.lineTo(left + width, top + height);
    context.lineTo(left, top + height);
    context.closePath();
  } else if (tool === 'roundrect') {
    const rectWidth = Math.max(width, 1);
    const rectHeight = Math.max(height, 1);
    const radius = Math.min(7, rectWidth / 2, rectHeight / 2);
    if (typeof context.roundRect === 'function') {
      context.roundRect(left, top, rectWidth, rectHeight, radius);
    } else {
      // Older canvas implementations lack roundRect(); keep this tool rounded
      // instead of silently drawing a plain rectangle.
      context.moveTo(left + radius, top);
      context.lineTo(left + rectWidth - radius, top);
      context.quadraticCurveTo(left + rectWidth, top, left + rectWidth, top + radius);
      context.lineTo(left + rectWidth, top + rectHeight - radius);
      context.quadraticCurveTo(left + rectWidth, top + rectHeight, left + rectWidth - radius, top + rectHeight);
      context.lineTo(left + radius, top + rectHeight);
      context.quadraticCurveTo(left, top + rectHeight, left, top + rectHeight - radius);
      context.lineTo(left, top + radius);
      context.quadraticCurveTo(left, top, left + radius, top);
      context.closePath();
    }
  } else {
    context.rect(left, top, Math.max(width, 1), Math.max(height, 1));
  }
  context.stroke();
}

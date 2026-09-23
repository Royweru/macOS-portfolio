'use client';

import { useRef, useState } from 'react';
import Button95 from '../../components/win95/Button95';
import type { MediaAsset } from '../../features/media/media-types';

const PAINT_TOOLS = [
  ['select', '▧'], ['free', '⌁'], ['eraser', '▱'], ['fill', '▰'],
  ['picker', '◉'], ['zoom', '⌕'], ['pencil', '✎'], ['brush', '●'],
  ['airbrush', '░'], ['text', 'A'], ['line', '╱'], ['curve', '⌁'],
  ['rectangle', '□'], ['polygon', '△'], ['ellipse', '○'], ['roundrect', '▢'],
] as const;
const PALETTE = [
  '#000000', '#ffffff', '#808080', '#c0c0c0', '#800000', '#ff0000', '#808000', '#ffff00',
  '#008000', '#00ff00', '#008080', '#00ffff', '#000080', '#0000ff', '#800080', '#ff00ff',
  '#808040', '#ffff80', '#004040', '#00ff80', '#0080ff', '#80ffff', '#004080', '#8080ff',
  '#8000ff', '#ff0080', '#402000', '#ff8040',
];

function StitchPaintCanvas() {
  return <div className="win97-paint-stitch-art">
    <div className="win97-paint-art-header">
      <div><strong>CYBER-ENGINE 3D // WIREFRAME V1.0</strong><small>BITMAP BUFFER ARCHIVE: \\RELEASE_CANDIDATE\\PROJECT_01.BMP</small></div>
      <b>MODE: 256 COLOR</b>
    </div>
    <div className="win97-paint-art-body">
      <div className="win97-paint-wireframe">
        <svg viewBox="0 0 160 140" role="img" aria-label="Cyber engine wireframe cube" fill="none" strokeWidth="1.5">
          <polygon points="30,45 95,45 95,110 30,110" stroke="#53aefd" />
          <polygon points="65,20 130,20 130,85 65,85" stroke="#777eea" strokeDasharray="3 3" />
          <line stroke="#53aefd" x1="30" x2="65" y1="45" y2="20" /><line stroke="#53aefd" x1="95" x2="130" y1="45" y2="20" />
          <line stroke="#53aefd" x1="95" x2="130" y1="110" y2="85" /><line stroke="#777eea" strokeDasharray="3 3" x1="30" x2="65" y1="110" y2="85" />
          <circle cx="30" cy="45" fill="#7ec850" r="2.5" /><circle cx="95" cy="45" fill="#7ec850" r="2.5" />
          <circle cx="95" cy="110" fill="#7ec850" r="2.5" /><circle cx="30" cy="110" fill="#7ec850" r="2.5" /><circle cx="130" cy="20" fill="#ffff00" r="2.5" />
        </svg>
        <span>RENDER: 60 FPS</span>
      </div>
      <div className="win97-paint-specs">
        <strong>SYSTEM GEOMETRY METRICS</strong>
        <div><span>VERTICES:</span><b>8 NODES</b><span>POLYGONS:</span><b>6 QUADS</b><span>RASTER DEPTH:</span><b>8-BIT INDEXED</b><span>SHADING:</span><b>FLAT WIRE</b><span>LIGHT ANGLE:</span><b>[0.45, -0.8]</b></div>
        <p><b>NOTE:</b> Use pencil tool to touch up anti-aliasing on corner vertices before exporting to Web.</p>
      </div>
    </div>
    <div className="win97-paint-art-footer"><span>AUTHOR: DEV_LAB_1997</span><span>FILE RESOLUTION: 640 x 480 px</span><span>ORIGIN: (0, 0)</span></div>
  </div>;
}

export default function Paint97({ asset }: { asset?: MediaAsset }) {
  const [zoom, setZoom] = useState(100);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const context = canvas.getContext('2d');
    if (!context) return;
    const x = (event.clientX - bounds.left) * (canvas.width / bounds.width);
    const y = (event.clientY - bounds.top) * (canvas.height / bounds.height);
    if (tool === 'eraser') {
      context.clearRect(x - 5, y - 5, 10, 10);
      return;
    }
    if (!['pencil', 'brush', 'airbrush'].includes(tool)) return;
    context.fillStyle = color;
    const size = tool === 'brush' ? 4 : tool === 'airbrush' ? 8 : 2;
    context.fillRect(x, y, size, size);
  };
  const beginDraw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    if (tool === 'fill') {
      const context = canvasRef.current?.getContext('2d');
      if (context) { context.fillStyle = color; context.fillRect(0, 0, 580, 340); }
      drawingRef.current = false;
      event.currentTarget.releasePointerCapture(event.pointerId);
      return;
    }
    draw(event);
  };
  const endDraw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <div className="win97-app win97-paint">
    <div className="win95-menubar"><button type="button">File</button><button type="button">Edit</button><button type="button">View</button><button type="button">Image</button><button type="button">Options</button><button type="button">Help</button></div>
    <div className="win97-paint-toolbar"><div className="win97-paint-tools">{PAINT_TOOLS.map(([id, glyph]) => <Button95 key={id} size="sm" pressed={tool === id} title={id} onClick={() => setTool(id)}>{glyph}</Button95>)}</div><div className="win97-paint-current" style={{ background: color }} aria-label={`Current color ${color}`} /></div>
    <div className="win97-paint-workspace"><div className="win97-paint-toolbox-label">Tools</div><div className="win97-paint-canvas-viewport"><div className="win97-paint-sheet" style={{ width: 580 * zoom / 100, height: 340 * zoom / 100 }}>
      {asset ? <img src={asset.source} alt={asset.title} /> : <StitchPaintCanvas />}
      <canvas ref={canvasRef} width={580} height={340} onPointerDown={beginDraw} onPointerMove={draw} onPointerUp={endDraw} onPointerCancel={endDraw} aria-label="Paint canvas" />
    </div></div></div>
    <div className="win97-paint-palette" aria-label="Color palette"><div className="win97-paint-wells"><span style={{ background: '#c0c0c0' }} /><span style={{ background: color }} /></div><div className="win97-paint-swatches">{PALETTE.map(value => <button type="button" key={value} title={value} aria-label={`Use ${value}`} className={color === value ? 'selected' : ''} style={{ background: value }} onClick={() => setColor(value)} />)}</div><div className="win97-paint-zoom"><Button95 size="sm" onClick={() => setZoom(value => Math.max(25, value - 25))}>−</Button95><span>{zoom}%</span><Button95 size="sm" onClick={() => setZoom(value => Math.min(400, value + 25))}>+</Button95></div></div>
    <footer className="win97-paint-status"><span>For Help, click Help Topics on the Help Menu.</span><span>320, 240px</span><span>640 x 480</span></footer>
    {!asset && <aside className="win97-paint-memo"><b>▣ System Memo</b><small>pbrush.exe</small><p>Bitmap Viewer/Editor: <strong>screenshots.bmp</strong> opened in 256-color palette mode.</p></aside>}
  </div>;
}

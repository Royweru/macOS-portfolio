'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import Button95 from '../../components/win95/Button95';
import type { MediaAsset } from '../../features/media/media-types';
import PaintScrollbars97 from './PaintScrollbars97';
import { PAINT_MENU_ITEMS97, PAINT_MENU_NAMES97, isPaintMenuActionDisabled97, type PaintMenuAction97, type PaintMenuName97 } from './paint-menus97';
import { PAINT_PALETTE97 } from './paint-palette97';
import { boundsForPoints97, containedImageRect97, drawShape97, floodFill97, getPaintColorForTool97, selectPaintSwatch97, shouldClosePaintPolygon97, tracePaintPolygon97, type PaintPoint97 } from './paint-geometry97';

const PAINT_TOOLS = [
  ['free', '⌁', 'Free-Form Select'], ['select', '▧', 'Select'],
  ['eraser', '▱', 'Eraser/Color Eraser'], ['fill', '▰', 'Fill With Color'],
  ['picker', '◉', 'Pick Color'], ['zoom', '⌕', 'Magnifier'],
  ['pencil', '✎', 'Pencil'], ['brush', '●', 'Brush'],
  ['airbrush', '░', 'Airbrush'], ['text', 'A', 'Text'],
  ['line', '╱', 'Line'], ['curve', '⌁', 'Curve'],
  ['rectangle', '□', 'Rectangle'], ['polygon', '△', 'Polygon'],
  ['ellipse', '○', 'Ellipse'], ['roundrect', '▢', 'Rounded Rectangle'],
] as const;
const PAINT_SHAPE_TOOLS = new Set(['line', 'curve', 'rectangle', 'polygon', 'ellipse', 'roundrect']);
interface PaintRect97 { x: number; y: number; width: number; height: number }
interface FloatingSelection97 { bitmap: HTMLCanvasElement; base: ImageData; rect: PaintRect97; points?: PaintPoint97[] }
interface PaintPolygonDraft97 { base: ImageData; points: PaintPoint97[]; color: string; strokeSize: number }
type PaintPointerMode97 =
  | { kind: 'shape' | 'stroke' }
  | { kind: 'new-selection'; points: PaintPoint97[] }
  | { kind: 'move-selection'; offsetX: number; offsetY: number; originalRect: PaintRect97 };

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

export default function Paint97({ asset, onClose }: { asset?: MediaAsset; onClose?: () => void }) {
  const instanceId = `win97-paint-${useId().replace(/:/g, '')}`;
  const [zoom, setZoom] = useState(100);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [strokeSize, setStrokeSize] = useState(1);
  const [coordinates, setCoordinates] = useState<PaintPoint97>({ x: 320, y: 240 });
  const [selectionOutline, setSelectionOutline] = useState<{ rect: PaintRect97; points?: PaintPoint97[] } | null>(null);
  const [selectionMessage, setSelectionMessage] = useState('');
  const [textEditor, setTextEditor] = useState<{ point: PaintPoint97; value: string; color: string } | null>(null);
  const [assetPainted, setAssetPainted] = useState(false);
  const [activeMenu, setActiveMenu] = useState<PaintMenuName97 | null>(null);
  const [showPalette, setShowPalette] = useState(true);
  const [paintDialog, setPaintDialog] = useState<'help' | 'about' | null>(null);
  const [newDocument, setNewDocument] = useState(false);
  const [openedImageUrl, setOpenedImageUrl] = useState<string | null>(null);
  const [openedImageName, setOpenedImageName] = useState<string | null>(null);
  const [, setHistoryRevision] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paintViewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawingRef = useRef(false);
  const pointerModeRef = useRef<PaintPointerMode97 | null>(null);
  const polygonDraftRef = useRef<PaintPolygonDraft97 | null>(null);
  const floatingSelectionRef = useRef<FloatingSelection97 | null>(null);
  const selectionClipboardRef = useRef<HTMLCanvasElement | null>(null);
  const startPointRef = useRef<PaintPoint97 | null>(null);
  const lastPointRef = useRef<PaintPoint97 | null>(null);
  const shapeSnapshotRef = useRef<ImageData | null>(null);
  const activePaintColorRef = useRef('#000000');
  const undoStackRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);
  const imageSource = newDocument ? null : openedImageUrl ?? asset?.source ?? null;
  const imageTitle = openedImageName ?? asset?.title ?? 'Untitled.bmp';

  useEffect(() => () => {
    if (openedImageUrl) URL.revokeObjectURL(openedImageUrl);
  }, [openedImageUrl]);

  const snapshotCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return null;
    try { return context.getImageData(0, 0, canvas.width, canvas.height); }
    catch { return null; }
  };
  const pushUndo = (snapshot: ImageData | null = snapshotCanvas()) => {
    if (!snapshot) return;
    undoStackRef.current = [...undoStackRef.current.slice(-19), snapshot];
    redoStackRef.current = [];
    setHistoryRevision(revision => revision + 1);
  };
  const commitSelection = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const selection = floatingSelectionRef.current;
    if (!canvas || !context || !selection) return;
    context.putImageData(selection.base, 0, 0);
    context.drawImage(selection.bitmap, selection.rect.x, selection.rect.y);
    floatingSelectionRef.current = null;
    setSelectionOutline(null);
  };
  const renderFloatingSelection = (rect: PaintRect97) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const selection = floatingSelectionRef.current;
    if (!canvas || !context || !selection) return;
    context.putImageData(selection.base, 0, 0);
    context.drawImage(selection.bitmap, rect.x, rect.y);
    selection.rect = rect;
    setSelectionOutline({ rect, points: selection.points?.map(point => ({ x: point.x + rect.x, y: point.y + rect.y })) });
  };
  const removeFloatingSelection = () => {
    const context = canvasRef.current?.getContext('2d');
    const selection = floatingSelectionRef.current;
    if (selection) pushUndo();
    if (context && selection) context.putImageData(selection.base, 0, 0);
    floatingSelectionRef.current = null;
    setSelectionOutline(null);
    setSelectionMessage('Selection deleted');
  };
  const renderPolygonPreview = (draft: PaintPolygonDraft97, cursor: PaintPoint97) => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    context.putImageData(draft.base, 0, 0);
    context.strokeStyle = draft.color;
    context.lineWidth = draft.strokeSize;
    context.lineCap = 'square';
    context.lineJoin = 'miter';
    tracePaintPolygon97(context, [...draft.points, cursor], false);
  };
  const cancelPolygonDraft = () => {
    const draft = polygonDraftRef.current;
    const context = canvasRef.current?.getContext('2d');
    if (!draft) return;
    if (context) context.putImageData(draft.base, 0, 0);
    polygonDraftRef.current = null;
    setSelectionMessage('Polygon cancelled');
  };
  const finishPolygon = () => {
    const draft = polygonDraftRef.current;
    const context = canvasRef.current?.getContext('2d');
    if (!draft || !context) return;
    context.putImageData(draft.base, 0, 0);
    polygonDraftRef.current = null;
    if (draft.points.length < 2) {
      setSelectionMessage('Add at least two points to draw a polygon');
      return;
    }
    context.strokeStyle = draft.color;
    context.lineWidth = draft.strokeSize;
    context.lineCap = 'square';
    context.lineJoin = 'miter';
    tracePaintPolygon97(context, draft.points, true);
    pushUndo(draft.base);
    setSelectionMessage(`Polygon drawn with ${draft.points.length} points`);
  };
  const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const bounds = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(canvas.width - 1, Math.floor((event.clientX - bounds.left) * (canvas.width / Math.max(1, bounds.width))))),
      y: Math.max(0, Math.min(canvas.height - 1, Math.floor((event.clientY - bounds.top) * (canvas.height / Math.max(1, bounds.height))))),
    };
  };
  const draw = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const point = pointFromEvent(event);
    setCoordinates(point);
    const mode = pointerModeRef.current;
    if (drawingRef.current && mode?.kind === 'new-selection') {
      if (tool === 'free') mode.points.push(point);
      else mode.points[1] = point;
      const rect = tool === 'free' ? boundsForPoints97(mode.points) : boundsForPoints97(mode.points);
      setSelectionOutline({ rect, points: tool === 'free' ? mode.points.slice() : undefined });
      return;
    }
    if (drawingRef.current && mode?.kind === 'move-selection') {
      const selection = floatingSelectionRef.current;
      if (!selection) return;
      const canvasWidth = canvasRef.current?.width ?? 580;
      const canvasHeight = canvasRef.current?.height ?? 340;
      const rect = {
        ...selection!.rect,
        x: Math.max(0, Math.min(canvasWidth - selection!.rect.width, point.x - mode.offsetX)),
        y: Math.max(0, Math.min(canvasHeight - selection!.rect.height, point.y - mode.offsetY)),
      };
      renderFloatingSelection(rect);
      return;
    }
    const polygonDraft = polygonDraftRef.current;
    if (polygonDraft && tool === 'polygon') {
      renderPolygonPreview(polygonDraft, point);
      return;
    }
    if (!drawingRef.current) return;
    const context = canvas.getContext('2d');
    const previous = lastPointRef.current;
    if (!context || !previous) return;
    const activeColor = activePaintColorRef.current;
    if (PAINT_SHAPE_TOOLS.has(tool)) {
      const start = startPointRef.current;
      const snapshot = shapeSnapshotRef.current;
      if (!start || !snapshot) return;
      context.putImageData(snapshot, 0, 0);
      context.strokeStyle = activeColor;
      context.lineWidth = strokeSize;
      context.lineCap = 'square';
      context.lineJoin = 'miter';
      drawShape97(context, tool, start, point);
      return;
    }
    if (tool === 'eraser') {
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = activeColor;
      context.lineWidth = strokeSize * 6;
      context.lineCap = 'square';
      context.beginPath();
      context.moveTo(previous.x, previous.y);
      context.lineTo(point.x, point.y);
      context.stroke();
      context.globalCompositeOperation = 'source-over';
      lastPointRef.current = point;
      return;
    }
    if (!['pencil', 'brush', 'airbrush'].includes(tool)) return;
    context.fillStyle = activeColor;
    if (tool === 'airbrush') {
      const radius = strokeSize * 3;
      for (let dot = 0; dot < 12; dot += 1) {
        const angle = dot * 2.399;
        const distance = radius * ((dot % 4) + 1) / 4;
        context.fillRect(Math.round(point.x + Math.cos(angle) * distance), Math.round(point.y + Math.sin(angle) * distance), 1, 1);
      }
    } else {
      context.strokeStyle = activeColor;
      context.lineWidth = tool === 'brush' ? strokeSize * 3 : strokeSize;
      context.lineCap = tool === 'brush' ? 'round' : 'square';
      context.lineJoin = tool === 'brush' ? 'round' : 'miter';
      context.beginPath();
      context.moveTo(previous.x, previous.y);
      context.lineTo(point.x, point.y);
      context.stroke();
    }
    lastPointRef.current = point;
  };
  const restoreHistory = (direction: 'undo' | 'redo') => {
    commitSelection();
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const source = direction === 'undo' ? undoStackRef.current : redoStackRef.current;
    const target = direction === 'undo' ? redoStackRef.current : undoStackRef.current;
    const current = snapshotCanvas();
    const previous = source.pop();
    if (!canvas || !context || !current || !previous) return;
    target.push(current);
    context.putImageData(previous, 0, 0);
    floatingSelectionRef.current = null;
    setSelectionOutline(null);
    setSelectionMessage(direction === 'undo' ? 'Undo' : 'Redo');
    setHistoryRevision(revision => revision + 1);
  };
  const copySelection = () => {
    const source = floatingSelectionRef.current?.bitmap;
    if (!source) return false;
    const copy = document.createElement('canvas');
    copy.width = source.width;
    copy.height = source.height;
    copy.getContext('2d')?.drawImage(source, 0, 0);
    selectionClipboardRef.current = copy;
    setSelectionMessage('Selection copied');
    return true;
  };
  const pasteSelection = () => {
    const source = selectionClipboardRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !source) return false;
    try {
      commitSelection();
      const base = context.getImageData(0, 0, canvas.width, canvas.height);
      pushUndo(base);
      const rect = { x: 0, y: 0, width: Math.min(source.width, canvas.width), height: Math.min(source.height, canvas.height) };
      const bitmap = document.createElement('canvas');
      bitmap.width = rect.width;
      bitmap.height = rect.height;
      bitmap.getContext('2d')?.drawImage(source, 0, 0, rect.width, rect.height);
      floatingSelectionRef.current = { bitmap, base, rect };
      renderFloatingSelection(rect);
      setSelectionMessage('Selection pasted; drag to position it or press Escape to place it');
      return true;
    } catch {
      setSelectionMessage('The current image is protected by the browser and cannot accept a pasted selection.');
      return false;
    }
  };
  const selectAll = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const source = snapshotCanvas();
    if (!canvas || !context) return false;
    if (!source) {
      setSelectionMessage('Select All is unavailable while this image is protected by the browser.');
      return false;
    }
    commitSelection();
    const bitmap = document.createElement('canvas');
    bitmap.width = canvas.width;
    bitmap.height = canvas.height;
    bitmap.getContext('2d')?.putImageData(source, 0, 0);
    pushUndo(source);
    context.clearRect(0, 0, canvas.width, canvas.height);
    const rect = { x: 0, y: 0, width: canvas.width, height: canvas.height };
    floatingSelectionRef.current = { bitmap, base: context.getImageData(0, 0, canvas.width, canvas.height), rect };
    renderFloatingSelection(rect);
    setSelectionMessage('Entire canvas selected; drag to move or press Escape to place it');
    return true;
  };
  const transformCanvas = (action: 'flip-horizontal' | 'flip-vertical' | 'rotate-90') => {
    commitSelection();
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return false;
    pushUndo();
    const copy = document.createElement('canvas');
    copy.width = canvas.width;
    copy.height = canvas.height;
    copy.getContext('2d')?.drawImage(canvas, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    if (action === 'flip-horizontal') {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(copy, 0, 0);
    } else if (action === 'flip-vertical') {
      context.translate(0, canvas.height);
      context.scale(1, -1);
      context.drawImage(copy, 0, 0);
    } else {
      const fit = Math.min(canvas.width / canvas.height, canvas.height / canvas.width);
      context.translate(canvas.width / 2, canvas.height / 2);
      context.scale(fit, fit);
      context.rotate(Math.PI / 2);
      context.drawImage(copy, -canvas.width / 2, -canvas.height / 2);
    }
    context.restore();
    setSelectionOutline(null);
    setSelectionMessage(action === 'rotate-90' ? 'Image rotated 90° clockwise' : action === 'flip-horizontal' ? 'Image flipped horizontally' : 'Image flipped vertically');
    return true;
  };
  const createNewImage = () => {
    if (polygonDraftRef.current) cancelPolygonDraft();
    const canvas = canvasRef.current;
    if (!canvas) return;
    pushUndo();
    // Reassigning the bitmap also clears any cross-origin taint from a viewed image.
    canvas.width = 580;
    canvas.height = 340;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    floatingSelectionRef.current = null;
    setSelectionOutline(null);
    setOpenedImageUrl(null);
    setOpenedImageName(null);
    setNewDocument(true);
    setAssetPainted(false);
    setSelectionMessage('New 580 × 340 bitmap');
  };
  const saveAsPng = () => {
    finishPolygon();
    commitSelection();
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(blob => {
        if (!blob) {
          setSelectionMessage('This image could not be exported. Try opening a local image instead.');
          return;
        }
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${imageTitle.replace(/\.[^.]+$/, '') || 'Untitled'}.png`;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        setSelectionMessage('PNG image saved');
      }, 'image/png');
    } catch {
      setSelectionMessage('This image could not be exported. Try opening a local image instead.');
    }
  };
  const actionDisabled = (action: PaintMenuAction97) => isPaintMenuActionDisabled97(action, {
    canUndo: undoStackRef.current.length > 0,
    canRedo: redoStackRef.current.length > 0,
    hasSelection: floatingSelectionRef.current !== null,
    hasClipboard: selectionClipboardRef.current !== null,
  });
  const runMenuAction = (action: PaintMenuAction97) => {
    if (actionDisabled(action)) return false;
    if (action !== 'save' && polygonDraftRef.current) cancelPolygonDraft();
    switch (action) {
      case 'new': createNewImage(); break;
      case 'open': fileInputRef.current?.click(); break;
      case 'save': saveAsPng(); break;
      case 'exit':
        if (onClose) onClose();
        else setSelectionMessage('Close Paint from its title bar.');
        break;
      case 'undo': restoreHistory('undo'); break;
      case 'redo': restoreHistory('redo'); break;
      case 'cut': if (copySelection()) removeFloatingSelection(); break;
      case 'copy': copySelection(); break;
      case 'paste': pasteSelection(); break;
      case 'delete': removeFloatingSelection(); break;
      case 'select-all': selectAll(); break;
      case 'zoom-in': setZoom(value => Math.min(400, value + 25)); break;
      case 'zoom-out': setZoom(value => Math.max(25, value - 25)); break;
      case 'zoom-100': setZoom(100); break;
      case 'toggle-palette': setShowPalette(value => !value); break;
      case 'flip-horizontal': transformCanvas('flip-horizontal'); break;
      case 'flip-vertical': transformCanvas('flip-vertical'); break;
      case 'rotate-90': transformCanvas('rotate-90'); break;
      case 'brush-1': setStrokeSize(1); break;
      case 'brush-2': setStrokeSize(2); break;
      case 'brush-3': setStrokeSize(3); break;
      case 'brush-4': setStrokeSize(4); break;
      case 'help': setPaintDialog('help'); break;
      case 'about': setPaintDialog('about'); break;
    }
    setActiveMenu(null);
    return true;
  };
  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (polygonDraftRef.current) cancelPolygonDraft();
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file || !file.type.startsWith('image/')) {
      if (file) setSelectionMessage('Choose a supported image file.');
      return;
    }
    setOpenedImageName(file.name);
    setOpenedImageUrl(URL.createObjectURL(file));
    setNewDocument(false);
    setAssetPainted(false);
    floatingSelectionRef.current = null;
    setSelectionOutline(null);
  };
  const handleKeyboardCommand = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('input, textarea, select')) return;
    if (event.key === 'Escape') {
      if (paintDialog) setPaintDialog(null);
      else if (polygonDraftRef.current) cancelPolygonDraft();
      else if (activeMenu) setActiveMenu(null);
      else if (floatingSelectionRef.current) {
        commitSelection();
        setSelectionMessage('Selection placed');
      }
      return;
    }
    if (event.key === 'Enter' && polygonDraftRef.current) {
      event.preventDefault();
      finishPolygon();
      return;
    }
    if (event.altKey && !event.ctrlKey && !event.metaKey) {
      const menuForKey: Record<string, PaintMenuName97> = { f: 'File', e: 'Edit', v: 'View', i: 'Image', o: 'Options', h: 'Help' };
      const menu = menuForKey[event.key.toLowerCase()];
      if (menu) {
        event.preventDefault();
        setActiveMenu(menu);
        window.requestAnimationFrame(() => document.getElementById(`${instanceId}-menu-${menu}`)?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus());
        return;
      }
    }
    if ((event.key === 'Delete' || event.key === 'Backspace') && floatingSelectionRef.current) {
      event.preventDefault();
      removeFloatingSelection();
      return;
    }
    if (!(event.ctrlKey || event.metaKey)) return;
    const key = event.key.toLowerCase();
    const shortcut: Partial<Record<string, PaintMenuAction97>> = {
      n: 'new', o: 'open', s: 'save', z: 'undo', y: 'redo',
      x: 'cut', c: 'copy', v: 'paste', a: 'select-all',
      '+': 'zoom-in', '=': 'zoom-in', '-': 'zoom-out',
    };
    if (key === 's' && event.shiftKey) {
      event.preventDefault();
      saveAsPng();
      return;
    }
    const action = shortcut[key];
    if (action && !actionDisabled(action)) {
      event.preventDefault();
      runMenuAction(action);
    }
  };
  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>, menu: PaintMenuName97) => {
    const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')];
    const currentIndex = items.indexOf(event.target as HTMLButtonElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      setActiveMenu(null);
      document.getElementById(`${instanceId}-menu-trigger-${menu}`)?.focus();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
        : (currentIndex + (event.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length;
      items[nextIndex]?.focus();
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const index = PAINT_MENU_NAMES97.indexOf(menu);
      const next = PAINT_MENU_NAMES97[(index + (event.key === 'ArrowRight' ? 1 : PAINT_MENU_NAMES97.length - 1)) % PAINT_MENU_NAMES97.length];
      setActiveMenu(next);
      window.requestAnimationFrame(() => document.getElementById(`${instanceId}-menu-${next}`)?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus());
    }
  };
  const handleMenuTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, menu: PaintMenuName97) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const index = PAINT_MENU_NAMES97.indexOf(menu);
      const next = PAINT_MENU_NAMES97[(index + (event.key === 'ArrowRight' ? 1 : PAINT_MENU_NAMES97.length - 1)) % PAINT_MENU_NAMES97.length];
      document.getElementById(`${instanceId}-menu-trigger-${next}`)?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    setActiveMenu(menu);
    window.requestAnimationFrame(() => document.getElementById(`${instanceId}-menu-${menu}`)?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus());
  };
  const beginDraw = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const point = pointFromEvent(event);
    activePaintColorRef.current = getPaintColorForTool97(tool, event.button, color, backgroundColor);
    setCoordinates(point);
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    if (tool === 'text') {
      commitSelection();
      setTextEditor({ point, value: '', color: activePaintColorRef.current });
      return;
    }
    event.currentTarget.focus({ preventScroll: true });
    if (tool === 'free' || tool === 'select') {
      const selection = floatingSelectionRef.current;
      if (selection && point.x >= selection.rect.x && point.x <= selection.rect.x + selection.rect.width && point.y >= selection.rect.y && point.y <= selection.rect.y + selection.rect.height) {
        pointerModeRef.current = { kind: 'move-selection', offsetX: point.x - selection.rect.x, offsetY: point.y - selection.rect.y, originalRect: { ...selection.rect } };
      } else {
        commitSelection();
        const initial = [point, point];
        pointerModeRef.current = { kind: 'new-selection', points: initial };
        setSelectionOutline({ rect: { x: point.x, y: point.y, width: 1, height: 1 }, points: tool === 'free' ? initial : undefined });
      }
      drawingRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }
    if (floatingSelectionRef.current) commitSelection();
    if (tool === 'zoom') {
      setZoom(value => Math.min(400, value + 25));
      return;
    }
    if (tool === 'picker') {
      try {
        let pixel = context.getImageData(point.x, point.y, 1, 1).data;
        if (pixel[3] === 0) {
          const image = canvas.parentElement?.querySelector('img');
          if (image?.complete && image.naturalWidth > 0) {
            const sample = document.createElement('canvas');
            sample.width = canvas.width;
            sample.height = canvas.height;
            const sampleContext = sample.getContext('2d');
            sampleContext?.drawImage(image, 0, 0, sample.width, sample.height);
            if (sampleContext) pixel = sampleContext.getImageData(point.x, point.y, 1, 1).data;
          }
        }
        if (pixel[3] > 0) {
          const picked = `#${[pixel[0], pixel[1], pixel[2]].map(channel => channel.toString(16).padStart(2, '0')).join('')}`;
          if (event.button === 2) setBackgroundColor(picked);
          else setColor(picked);
        }
      } catch {
        // A cross-origin image cannot be sampled; keep the current color.
      }
      return;
    }
    if (tool === 'fill') {
      try {
        const before = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        const rgba = activePaintColorRef.current.match(/[\da-f]{2}/gi)?.map(channel => Number.parseInt(channel, 16)) ?? [0, 0, 0];
        const changed = floodFill97(pixels.data, pixels.width, pixels.height, point.x, point.y, [rgba[0], rgba[1], rgba[2], 255]);
        if (changed) {
          pushUndo(before);
          context.putImageData(pixels, 0, 0);
        }
        setSelectionMessage(changed ? `Filled ${changed.toLocaleString()} connected pixels` : 'No matching area to fill');
      } catch {
        setSelectionMessage('This image cannot be filled because the browser protects its pixel data.');
      }
      return;
    }
    if (tool === 'polygon') {
      const existing = polygonDraftRef.current;
      if (existing) {
        if (shouldClosePaintPolygon97(existing.points, point)) {
          finishPolygon();
          return;
        }
        existing.points.push(point);
        renderPolygonPreview(existing, point);
        setSelectionMessage(`${existing.points.length} polygon points — double-click or press Enter to finish; Esc cancels`);
        return;
      }
      const base = snapshotCanvas();
      if (!base) {
        setSelectionMessage('This image is protected by the browser and cannot be drawn on. Open a local image or choose File → New.');
        return;
      }
      polygonDraftRef.current = { base, points: [point], color: activePaintColorRef.current, strokeSize };
      setSelectionMessage('Click to add polygon corners; double-click or press Enter to finish; Esc cancels');
      return;
    }
    drawingRef.current = true;
    pointerModeRef.current = PAINT_SHAPE_TOOLS.has(tool) ? { kind: 'shape' } : { kind: 'stroke' };
    startPointRef.current = point;
    lastPointRef.current = point;
    try { shapeSnapshotRef.current = PAINT_SHAPE_TOOLS.has(tool) ? context.getImageData(0, 0, canvas.width, canvas.height) : null; }
    catch { shapeSnapshotRef.current = null; }
    pushUndo(shapeSnapshotRef.current ?? snapshotCanvas());
    event.currentTarget.setPointerCapture(event.pointerId);
    draw(event);
  };
  const endDraw = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (polygonDraftRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const mode = pointerModeRef.current;
    if (drawingRef.current && mode?.kind === 'shape' && PAINT_SHAPE_TOOLS.has(tool)) draw(event);
    if (drawingRef.current && (mode?.kind === 'new-selection' || mode?.kind === 'move-selection')) draw(event);
    if (drawingRef.current && mode?.kind === 'new-selection' && canvas && context) {
      const points = mode.points;
      const rect = tool === 'free' ? boundsForPoints97(points) : boundsForPoints97([points[0], points[1] ?? points[0]]);
      if (rect.width > 1 && rect.height > 1) {
        try {
          const source = context.getImageData(0, 0, canvas.width, canvas.height);
          const bitmap = document.createElement('canvas');
          bitmap.width = rect.width;
          bitmap.height = rect.height;
          const bitmapContext = bitmap.getContext('2d');
          if (!bitmapContext) throw new Error('Canvas unavailable');
          const sourceCanvas = document.createElement('canvas');
          sourceCanvas.width = canvas.width;
          sourceCanvas.height = canvas.height;
          sourceCanvas.getContext('2d')?.putImageData(source, 0, 0);
          if (tool === 'free' && points.length > 2) {
            bitmapContext.beginPath();
            bitmapContext.moveTo(points[0].x - rect.x, points[0].y - rect.y);
            points.slice(1).forEach(point => bitmapContext.lineTo(point.x - rect.x, point.y - rect.y));
            bitmapContext.closePath();
            bitmapContext.clip();
          }
          bitmapContext.drawImage(sourceCanvas, -rect.x, -rect.y);
          if (tool === 'free' && points.length > 2) {
            context.save();
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            points.slice(1).forEach(point => context.lineTo(point.x, point.y));
            context.closePath();
            context.clip();
            context.clearRect(rect.x, rect.y, rect.width, rect.height);
            context.restore();
          } else context.clearRect(rect.x, rect.y, rect.width, rect.height);
          pushUndo(source);
          const base = context.getImageData(0, 0, canvas.width, canvas.height);
          floatingSelectionRef.current = { bitmap, base, rect, points: tool === 'free' ? points.map(point => ({ x: point.x - rect.x, y: point.y - rect.y })) : undefined };
          renderFloatingSelection(rect);
          setSelectionMessage('Drag the selected area to move it; press Delete to clear or Escape to place it.');
        } catch {
          setSelectionOutline(null);
          setSelectionMessage('This image cannot be selected because the browser protects its pixel data.');
        }
      } else setSelectionOutline(null);
    }
    drawingRef.current = false;
    startPointRef.current = null;
    lastPointRef.current = null;
    shapeSnapshotRef.current = null;
    pointerModeRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const cancelDraw = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context && shapeSnapshotRef.current) context.putImageData(shapeSnapshotRef.current, 0, 0);
    const mode = pointerModeRef.current;
    if (mode?.kind === 'move-selection' && floatingSelectionRef.current) renderFloatingSelection(mode.originalRect);
    if (mode?.kind === 'new-selection') setSelectionOutline(null);
    drawingRef.current = false;
    startPointRef.current = null;
    lastPointRef.current = null;
    shapeSnapshotRef.current = null;
    pointerModeRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const finishText = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context && textEditor?.value.trim()) {
      pushUndo();
      context.fillStyle = textEditor.color;
      context.font = '14px Arial, sans-serif';
      context.textBaseline = 'top';
      textEditor.value.split('\n').forEach((line, index) => context.fillText(line, textEditor.point.x, textEditor.point.y + index * 17));
    }
    setTextEditor(null);
  };
  return <div className="win97-app win97-paint" onKeyDown={handleKeyboardCommand} onPointerDown={event => {
    if (!(event.target instanceof Element) || !event.target.closest('.win97-paint-menu-slot')) setActiveMenu(null);
  }}>
    <nav className="win97-paint-menubar" role="menubar" aria-label="Paint menus">
      {PAINT_MENU_NAMES97.map(menu => <div className="win97-paint-menu-slot" key={menu}>
        <button id={`${instanceId}-menu-trigger-${menu}`} type="button" role="menuitem" aria-haspopup="menu" aria-expanded={activeMenu === menu} aria-controls={`${instanceId}-menu-${menu}`} onClick={() => setActiveMenu(current => current === menu ? null : menu)} onKeyDown={event => handleMenuTriggerKeyDown(event, menu)}><u>{menu[0]}</u>{menu.slice(1)}</button>
        {activeMenu === menu && <div id={`${instanceId}-menu-${menu}`} className="win97-paint-menu-popup" role="menu" aria-label={`${menu} menu`} onKeyDown={event => handleMenuKeyDown(event, menu)}>
          {PAINT_MENU_ITEMS97[menu].map((entry, index) => 'separator' in entry
            ? <span className="win97-paint-menu-separator" role="separator" key={`${menu}-separator-${index}`} />
            : <button type="button" role="menuitem" key={entry.action} disabled={actionDisabled(entry.action)} onClick={() => runMenuAction(entry.action)}>
              <span>{entry.label}</span>{entry.shortcut && <small>{entry.shortcut}</small>}
            </button>)}
        </div>}
      </div>)}
    </nav>
    <input ref={fileInputRef} className="win97-paint-file-input" type="file" accept="image/*" aria-label="Open image file" onChange={handleImageFileChange} />
    <div className="win97-paint-workspace">
      <aside className="win97-paint-toolbox" aria-label="Paint toolbox">
        <div className="win97-paint-tools">{PAINT_TOOLS.map(([id, glyph, label]) => <Button95 key={id} size="sm" pressed={tool === id} title={label} aria-label={label} onClick={() => { if (polygonDraftRef.current) cancelPolygonDraft(); setTool(id); }}>{glyph}</Button95>)}</div>
        <div className="win97-paint-tool-options" role="group" aria-label="Brush size">
          {[1, 2, 3, 4].map(size => <button type="button" key={size} aria-label={`Brush size ${size} px`} aria-pressed={strokeSize === size} onClick={() => setStrokeSize(size)}><i style={{ height: size }} /></button>)}
        </div>
      </aside>
      <div className="win97-paint-canvas-panel"><div ref={paintViewportRef} className="win97-paint-canvas-viewport"><div className="win97-paint-sheet-frame" style={{ width: 580 * zoom / 100, height: 340 * zoom / 100 }}><div className="win97-paint-sheet" style={{ transform: `scale(${zoom / 100})` }}>
        {newDocument ? <div className="win97-paint-blank-sheet" aria-label="New blank bitmap" /> : imageSource ? <img className={assetPainted ? 'win97-paint-source-hidden' : ''} src={imageSource} alt={imageTitle} onLoad={event => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          pushUndo();
          canvas.width = 580;
          canvas.height = 340;
          const context = canvas.getContext('2d');
          if (!context) return;
          const image = event.currentTarget;
          const rect = containedImageRect97(image.naturalWidth, image.naturalHeight, canvas.width, canvas.height);
          context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
          setAssetPainted(true);
        }} onError={() => setSelectionMessage('The image could not be opened. Choose another image file.')} /> : <StitchPaintCanvas />}
        <canvas ref={canvasRef} width={580} height={340} onPointerDown={beginDraw} onPointerMove={draw} onPointerUp={endDraw} onPointerCancel={cancelDraw} onDoubleClick={event => { if (tool === 'polygon') { event.preventDefault(); finishPolygon(); } }} onContextMenu={event => event.preventDefault()} tabIndex={0} aria-label="Paint canvas" aria-description={`Primary color ${color}; background color ${backgroundColor}`} />
        {selectionOutline && <svg className="win97-paint-selection" viewBox="0 0 580 340" aria-hidden="true">{selectionOutline.points ? <><polygon points={selectionOutline.points.map(point => `${point.x},${point.y}`).join(' ')} fill="none" stroke="#fff" strokeDasharray="4 2" strokeDashoffset="4" /><polygon points={selectionOutline.points.map(point => `${point.x},${point.y}`).join(' ')} fill="none" stroke="#000" strokeDasharray="4 2" /></> : <><rect x={selectionOutline.rect.x} y={selectionOutline.rect.y} width={selectionOutline.rect.width} height={selectionOutline.rect.height} fill="none" stroke="#fff" strokeDasharray="4 2" strokeDashoffset="4" /><rect x={selectionOutline.rect.x} y={selectionOutline.rect.y} width={selectionOutline.rect.width} height={selectionOutline.rect.height} fill="none" stroke="#000" strokeDasharray="4 2" /></>}</svg>}
        {textEditor && <form className="win97-paint-text-editor" style={{ left: `${textEditor.point.x / 580 * 100}%`, top: `${textEditor.point.y / 340 * 100}%` }} onSubmit={event => { event.preventDefault(); finishText(); }} onPointerDown={event => event.stopPropagation()}><textarea autoFocus aria-label="Text to add to image" value={textEditor.value} onChange={event => setTextEditor(current => current ? { ...current, value: event.target.value } : current)} onKeyDown={event => { if (event.key === 'Escape') setTextEditor(null); }} /><div><Button95 size="sm" type="submit">OK</Button95><Button95 size="sm" type="button" onClick={() => setTextEditor(null)}>Cancel</Button95></div></form>}
      </div></div></div><PaintScrollbars97 viewportRef={paintViewportRef} /></div>
    </div>
    {showPalette && <div className="win97-paint-palette" aria-label="Color palette"><div className="win97-paint-wells" aria-label={`Foreground color ${color}; background color ${backgroundColor}`}><span style={{ background: backgroundColor }} /><span style={{ background: color }} /></div><div className="win97-paint-swatches">{PAINT_PALETTE97.map(value => {
      const select = (button: number) => {
        const colors = selectPaintSwatch97(button, value, color, backgroundColor);
        setColor(colors.primary);
        setBackgroundColor(colors.secondary);
      };
      return <button type="button" key={value} title={`${value} — left-click foreground, right-click background`} aria-label={`Set foreground to ${value}; right-click to set background`} aria-pressed={color === value} data-foreground-selected={color === value || undefined} data-background-selected={backgroundColor === value || undefined} className={color === value ? 'selected' : ''} style={{ background: value }} onClick={event => select(event.button)} onContextMenu={event => { event.preventDefault(); select(2); }} />;
    })}</div><div className="win97-paint-zoom"><Button95 size="sm" onClick={() => setZoom(value => Math.max(25, value - 25))}>−</Button95><span>{zoom}%</span><Button95 size="sm" onClick={() => setZoom(value => Math.min(400, value + 25))}>+</Button95></div></div>}
    {paintDialog && <div className="win97-paint-dialog-scrim" role="presentation"><section className="win97-paint-dialog" role="dialog" aria-modal="true" aria-labelledby={`${instanceId}-dialog-title`} onKeyDown={event => { if (event.key === 'Escape') setPaintDialog(null); }}>
      <header><strong id={`${instanceId}-dialog-title`}>{paintDialog === 'help' ? 'Paint Help Topics' : 'About Paint'}</strong><button type="button" aria-label="Close dialog" onClick={() => setPaintDialog(null)}>×</button></header>
      <div>{paintDialog === 'help'
        ? <><p>Choose a tool from the left toolbox and a foreground or background color, then draw on the bitmap. For Polygon, click each corner and press Enter or double-click to finish; Escape cancels.</p><p>Use Select to move an area. Press Escape to place it, Delete to remove it, or Ctrl+C / Ctrl+X / Ctrl+V to copy, cut, and paste.</p><p>File → Save As exports the canvas as a PNG image.</p></>
        : <><p><b>Weru Paint</b><br />Bitmap editor · 580 × 340 canvas</p><p>Classic Paint-style tools adapted for the Weru 97 portfolio desktop.</p></>}</div>
      <footer><Button95 size="sm" onClick={() => setPaintDialog(null)}>OK</Button95></footer>
    </section></div>}
    <footer className="win97-paint-status"><span aria-live="polite">{selectionMessage || 'For Help, click Help Topics on the Help Menu.'}</span><span aria-live="polite">⌖ {coordinates.x}, {coordinates.y}px</span><span>640 × 480</span></footer>
  </div>;
}

export const PAINT_MENU_NAMES97 = ['File', 'Edit', 'View', 'Image', 'Options', 'Help'] as const;
export type PaintMenuName97 = (typeof PAINT_MENU_NAMES97)[number];

export type PaintMenuAction97 =
  | 'new' | 'open' | 'save' | 'exit'
  | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'delete' | 'select-all'
  | 'zoom-in' | 'zoom-out' | 'zoom-100' | 'toggle-palette'
  | 'flip-horizontal' | 'flip-vertical' | 'rotate-90'
  | 'brush-1' | 'brush-2' | 'brush-3' | 'brush-4'
  | 'help' | 'about';

export type PaintMenuEntry97 = { label: string; action: PaintMenuAction97; shortcut?: string } | { separator: true };

export interface PaintMenuState97 {
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  hasClipboard: boolean;
}

export function isPaintMenuActionDisabled97(action: PaintMenuAction97, state: PaintMenuState97) {
  if (action === 'undo') return !state.canUndo;
  if (action === 'redo') return !state.canRedo;
  if (action === 'cut' || action === 'copy' || action === 'delete') return !state.hasSelection;
  if (action === 'paste') return !state.hasClipboard;
  return false;
}

export const PAINT_MENU_ITEMS97: Record<PaintMenuName97, readonly PaintMenuEntry97[]> = {
  File: [
    { label: 'New', action: 'new', shortcut: 'Ctrl+N' },
    { label: 'Open...', action: 'open', shortcut: 'Ctrl+O' },
    { label: 'Save As PNG...', action: 'save', shortcut: 'Ctrl+Shift+S' },
    { separator: true },
    { label: 'Exit', action: 'exit' },
  ],
  Edit: [
    { label: 'Undo', action: 'undo', shortcut: 'Ctrl+Z' },
    { label: 'Redo', action: 'redo', shortcut: 'Ctrl+Y' },
    { separator: true },
    { label: 'Cut', action: 'cut', shortcut: 'Ctrl+X' },
    { label: 'Copy', action: 'copy', shortcut: 'Ctrl+C' },
    { label: 'Paste', action: 'paste', shortcut: 'Ctrl+V' },
    { label: 'Delete', action: 'delete', shortcut: 'Del' },
    { separator: true },
    { label: 'Select All', action: 'select-all', shortcut: 'Ctrl+A' },
  ],
  View: [
    { label: 'Zoom In', action: 'zoom-in', shortcut: 'Ctrl+Plus' },
    { label: 'Zoom Out', action: 'zoom-out', shortcut: 'Ctrl+Minus' },
    { label: '100%', action: 'zoom-100' },
    { separator: true },
    { label: 'Color Palette', action: 'toggle-palette' },
  ],
  Image: [
    { label: 'Flip/Rotate 90°', action: 'rotate-90' },
    { separator: true },
    { label: 'Flip Horizontal', action: 'flip-horizontal' },
    { label: 'Flip Vertical', action: 'flip-vertical' },
  ],
  Options: [
    { label: 'Brush Size: 1 px', action: 'brush-1' },
    { label: 'Brush Size: 2 px', action: 'brush-2' },
    { label: 'Brush Size: 3 px', action: 'brush-3' },
    { label: 'Brush Size: 4 px', action: 'brush-4' },
    { separator: true },
    { label: 'Color Palette', action: 'toggle-palette' },
  ],
  Help: [
    { label: 'Help Topics', action: 'help' },
    { separator: true },
    { label: 'About Paint', action: 'about' },
  ],
};

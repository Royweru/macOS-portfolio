import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { WINDOW_CONFIGS } from '../../constants';
import { VIRTUAL_NODE_IDS } from '../filesystem/virtual-paths';
import {
  STITCH_DESKTOP_EXPLORER_RECT,
  STITCH_EXPLORER_COMPUTER_RECT,
  STITCH_EXPLORER_PROJECTS_RECT,
} from '../../wm/geometry97';
import { getStitchExplorerRect97 } from './explorer-window-geometry97';

const stitchHtml = (filename: string) => readFileSync(resolve(process.cwd(), 'Stitch Designs', 'html', filename), 'utf8');

describe('Explorer window geometry against retained Stitch sources', () => {
  it('keeps the main Explorer and Notepad sizes aligned with their source windows', () => {
    const source = stitchHtml('windows_97_project_explorer_and_notepad_view.html');
    expect(source).toMatch(/max-w-\[620px\] h-\[430px\][^>]*id="window-explorer"/);
    expect(source).toMatch(/max-w-\[580px\] h-\[450px\][^>]*id="window-notepad"/);
    expect(WINDOW_CONFIGS.explorer).toMatchObject({ w: 620, h: 430 });
    expect(WINDOW_CONFIGS.notepad).toMatchObject({ w: 580, h: 450 });
  });

  it('keeps the dedicated My Documents state at its separate Stitch size', () => {
    const source = stitchHtml('windows_97_project_explorer_and_notepad_view.html');
    expect(source).toMatch(/max-w-\[560px\] h-\[410px\][^>]*id="window-my-documents"/);
    expect(STITCH_DESKTOP_EXPLORER_RECT).toEqual({ x: 240, y: 60, width: 560, height: 410 });
  });

  it('records the dual-Explorer screen as two distinct source sizes', () => {
    const source = stitchHtml('windows_97_dual_explorer_windows.html');
    expect(source).toMatch(/w-\[440px\] h-\[320px\][^>]*id="window-b"/);
    expect(source).toMatch(/w-\[660px\] h-\[440px\][^>]*id="window-a"/);
    expect(STITCH_EXPLORER_COMPUTER_RECT).toEqual({ x: 60, y: 40, width: 440, height: 320 });
    expect(STITCH_EXPLORER_PROJECTS_RECT).toEqual({ x: 240, y: 90, width: 660, height: 440 });
    expect(getStitchExplorerRect97(VIRTUAL_NODE_IDS.root)).toEqual(STITCH_EXPLORER_COMPUTER_RECT);
    expect(getStitchExplorerRect97(VIRTUAL_NODE_IDS.projects)).toEqual(STITCH_EXPLORER_PROJECTS_RECT);
    expect(getStitchExplorerRect97(VIRTUAL_NODE_IDS.myDocuments)).toEqual(STITCH_DESKTOP_EXPLORER_RECT);
    expect(getStitchExplorerRect97(VIRTUAL_NODE_IDS.pictures)).toBeUndefined();
  });
});

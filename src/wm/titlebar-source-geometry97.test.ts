import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { WINDOW_CONFIGS } from '../constants';
import type { WindowId } from '../types';

const readStitch = (filename: string) => readFileSync(join(process.cwd(), 'Stitch Designs', 'html', filename), 'utf8');
const explorerNotepad = readStitch('windows_97_project_explorer_and_notepad_view.html');
const dualExplorer = readStitch('windows_97_dual_explorer_windows.html');
const dualExplorerVariant = readStitch('windows_97_dual_explorer_variant.html');
const paint = readStitch('windows_97_paint.html');
const calculatorGames = readStitch('windows_97_calculator_and_minesweeper.html');
const cdPlayer = readStitch('windows_97_cd_player.html');
const systemDialogs = readStitch('windows_97_system_dialogs_properties.html');
const ie = readStitch('windows_97_internet_explorer.html');
const mediaPlayer = readStitch('windows_97_media_player_6.4.html');
const appStyles = readFileSync(join(process.cwd(), 'src', 'styles', 'stitch97.css'), 'utf8');
const tokens = readFileSync(join(process.cwd(), 'src', 'styles', 'tokens97.css'), 'utf8');

const source18pxWindowApps: Array<[WindowId, string]> = [
  ['projects', explorerNotepad], ['project-detail', explorerNotepad], ['explorer', dualExplorer],
  ['notepad', explorerNotepad], ['about', explorerNotepad], ['skills', explorerNotepad], ['experience', explorerNotepad],
  ['paint', paint], ['photos', paint], ['calculator', calculatorGames], ['minesweeper', calculatorGames],
  ['cd-player', cdPlayer], ['cd-equalizer', cdPlayer], ['system-properties', systemDialogs],
  ['system-warning', systemDialogs], ['shutdown', systemDialogs], ['recycle-bin', systemDialogs],
];

describe('source-specific Win97 window titlebar geometry', () => {
  it.each(source18pxWindowApps)('keeps the %s titlebar at the 18px height in its Stitch reference', (appId, source) => {
    expect(WINDOW_CONFIGS[appId]).toBeDefined();
    expect(source).toMatch(/h-\[18px\]|height:\s*18px;/);
    expect(appStyles).toContain(`.window97[data-window-app-id='${appId}'] .win95-titlebar`);
  });

  it('preserves the 20px source geometry for Internet Explorer, Media Player, and the generic desktop window', () => {
    expect(ie).toContain('h-[20px]');
    expect(mediaPlayer).toContain('h-[20px]');
    expect(explorerNotepad).toContain('h-[20px]');
    expect(tokens).toContain('--w95-titlebar-h: 20px;');
    expect(appStyles).not.toContain("[data-window-app-id='ie4'] .win95-titlebar");
    expect(appStyles).not.toContain("[data-window-app-id='media-player'] .win95-titlebar");
  });

  it('retains Stitch’s 18px inactive Explorer gray gradient', () => {
    expect(dualExplorer).toContain('h-[18px] px-1 bg-gradient-to-r from-[#808080] to-[#B5B5B5]');
    expect(dualExplorerVariant).toContain('h-[18px] px-1 bg-gradient-to-r from-inactive-title-start to-inactive-title-end');
    expect(appStyles).toMatch(/\.window97\[data-window-app-id='explorer'\]\.inactive \.win95-titlebar\s*\{[^}]*#808080 0%, #b5b5b5 100%/);
  });
});

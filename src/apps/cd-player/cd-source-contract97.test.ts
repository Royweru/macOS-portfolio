import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync('Stitch Designs/html/windows_97_cd_player.html', 'utf8');
const legacyWindowStyles = readFileSync('src/styles/window97.css', 'utf8');

describe('CD Player Stitch source contract', () => {
  it('defines two sibling application windows with source-width and titlebar contracts', () => {
    expect(source).toMatch(/max-w-\[540px\][^>]*id="cd-player-window"/);
    expect(source).toMatch(/max-w-\[390px\][^>]*id="eq-window"/);
    expect(source).toContain('h-[18px]');
    expect(source).toContain('Now Playing - Graphic Equalizer');
    expect(source).toContain('lg:flex-nowrap');
    expect(source).toContain('id="tray-indicator"');
    expect(source).toContain('CD-ROM TRAY OPEN: DRIVE D:\\ READY FOR INSERTION');
    expect(source).toContain('Close Tray');
    expect(source).toContain('Total Play: 07:47 m:s');
  });

  it('records the player maximize button as disabled and the equalizer as having no maximize control', () => {
    const playerWindow = source.slice(source.indexOf('id="cd-player-window"'), source.indexOf('id="eq-window"'));
    const equalizerWindow = source.slice(source.indexOf('id="eq-window"'));
    expect(playerWindow).toContain('title="Maximize (Disabled)"');
    expect(equalizerWindow).not.toContain('title="Maximize');
  });

  it('does not retain the overridden navy legacy skin for the Stitch gray player surface', () => {
    expect(legacyWindowStyles).not.toMatch(/\.win97-cd-player\s*\{[^}]*background:\s*#000080/i);
  });
});

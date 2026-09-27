import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import CdPlayer97 from './CdPlayer97';
import { transitionCdTray97 } from './cd-tray97';
import { calculateCdTime97 } from './cd-time97';
import { toggleCdPlaybackMode97 } from './cd-playback-modes97';

describe('Stitch CD tray and status controls', () => {
  it('opens the tray on eject and reports no disc when the tray closes', () => {
    const open = transitionCdTray97({ open: false, status: 'No Disc' }, 'eject');
    expect(open).toEqual({ open: true, status: 'Tray Open' });
    expect(transitionCdTray97(open, 'close')).toEqual({ open: false, status: 'No Disc' });
  });

  it('keeps the current ready state when a close action is sent to an already-closed tray', () => {
    expect(transitionCdTray97({ open: false, status: 'Ready' }, 'close')).toEqual({ open: false, status: 'Ready' });
  });

  it('renders the source status compartments and keeps Eject available in the no-disc state', () => {
    const html = renderToStaticMarkup(createElement(CdPlayer97));
    expect(html).toContain('aria-label="CD Player status"');
    expect(html).toContain('Total Play:');
    expect(html).toContain('Track:');
    expect(html).toContain('CD-ROM (D:) No Disc');
    expect(html).toContain('aria-label="Eject"');
    expect(html).not.toMatch(/aria-label="Eject"[^>]*disabled/);
  });

  it('calculates disc remaining time across completed tracks, not just the selected track', () => {
    const input = {
      elapsedSeconds: 50,
      trackDurationSeconds: 200,
      trackDurationsSeconds: [100, 200, 300],
      selectedIndex: 1,
    } as const;

    expect(calculateCdTime97({ ...input, mode: 'elapsed' })).toEqual({ displayedSeconds: 50, totalSeconds: 600 });
    expect(calculateCdTime97({ ...input, mode: 'remain' })).toEqual({ displayedSeconds: 150, totalSeconds: 600 });
    expect(calculateCdTime97({ ...input, mode: 'disc' })).toEqual({ displayedSeconds: 450, totalSeconds: 600 });
  });

  it('uses loaded duration metadata and clamps invalid or overrun playback values', () => {
    expect(calculateCdTime97({
      mode: 'disc',
      elapsedSeconds: 500,
      trackDurationSeconds: 220,
      trackDurationsSeconds: [100, 200, 300],
      selectedIndex: 1,
    })).toEqual({ displayedSeconds: 300, totalSeconds: 620 });

    expect(calculateCdTime97({
      mode: 'remain',
      elapsedSeconds: -10,
      trackDurationSeconds: 30,
      trackDurationsSeconds: [30],
      selectedIndex: 0,
    })).toEqual({ displayedSeconds: 30, totalSeconds: 30 });
  });

  it('shares repeat, shuffle, and intro option state across the menu and transport toggles', () => {
    const defaults = { shuffle: false, repeat: true, intro: false };
    expect(toggleCdPlaybackMode97(defaults, 'shuffle')).toEqual({ shuffle: true, repeat: true, intro: false });
    expect(toggleCdPlaybackMode97(defaults, 'repeat')).toEqual({ shuffle: false, repeat: false, intro: false });
    expect(toggleCdPlaybackMode97(defaults, 'intro')).toEqual({ shuffle: false, repeat: true, intro: true });
  });

  it('exposes functional Disc, View, Options, and Help menu entry points', () => {
    const html = renderToStaticMarkup(createElement(CdPlayer97, { onOpenApp: () => undefined }));
    for (const label of ['Disc', 'View', 'Options', 'Help']) {
      expect(html).toContain(`aria-haspopup="menu" aria-expanded="false">${label}</button>`);
    }
    expect(html).toContain('aria-label="Eject"');
    expect(html).toContain('Rand</button>');
    expect(html).toContain('Cont</button>');
    expect(html).toContain('Intro</button>');
  });
});

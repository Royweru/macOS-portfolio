import { describe, expect, it } from 'vitest';
import { WINDOW_CONFIGS } from '../../constants';
import { APP_REGISTRY, getRegisteredApp, resolveAppForExtension } from './app-registry';

describe('Win97 application registry', () => {
  it('registers the core utility applications', () => {
    expect(getRegisteredApp('calculator')?.name).toBe('Calculator');
    expect(getRegisteredApp('msdos')?.name).toBe('MS-DOS Prompt');
    expect(getRegisteredApp('minesweeper')?.name).toBe('Minesweeper');
  });

  it('derives every descriptive app size from the active window configuration', () => {
    for (const app of APP_REGISTRY) {
      const config = WINDOW_CONFIGS[app.id];
      expect(app.defaultWindow).toEqual({ width: config.w, height: config.h });
    }
    expect(getRegisteredApp('media-player')?.defaultWindow).toEqual({ width: 640, height: 396 });
  });

  it('routes period-correct file extensions to their app', () => {
    expect(resolveAppForExtension('demo.bmp')?.id).toBe('paint');
    expect(resolveAppForExtension('demo.wav')?.id).toBe('media-player');
    expect(resolveAppForExtension('demo.mid')?.id).toBe('cd-player');
    expect(resolveAppForExtension('README.md')?.id).toBe('notepad');
  });
});

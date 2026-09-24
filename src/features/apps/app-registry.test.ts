import { describe, expect, it } from 'vitest';
import { getRegisteredApp, resolveAppForExtension } from './app-registry';

describe('Win97 application registry', () => {
  it('registers the core utility applications', () => {
    expect(getRegisteredApp('calculator')?.name).toBe('Calculator');
    expect(getRegisteredApp('msdos')?.name).toBe('MS-DOS Prompt');
    expect(getRegisteredApp('minesweeper')?.name).toBe('Minesweeper');
  });

  it('routes period-correct file extensions to their app', () => {
    expect(resolveAppForExtension('demo.bmp')?.id).toBe('paint');
    expect(resolveAppForExtension('demo.wav')?.id).toBe('media-player');
    expect(resolveAppForExtension('demo.mid')?.id).toBe('cd-player');
    expect(resolveAppForExtension('README.md')?.id).toBe('notepad');
  });
});

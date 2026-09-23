import { describe, expect, it } from 'vitest';
import { normalizeVirtualPath, VIRTUAL_PATHS } from './virtual-paths';

describe('virtual path normalization', () => {
  it('canonicalizes separators, drive casing, and dot segments', () => {
    expect(normalizeVirtualPath('c:/My Documents/./Projects/../Skills.txt')).toBe('C:\\My Documents\\Skills.txt');
    expect(normalizeVirtualPath('C:\\\\My Documents\\')).toBe('C:\\My Documents');
  });

  it('does not traverse above the virtual drive', () => {
    expect(normalizeVirtualPath('C:\\My Documents\\..\\Windows')).toBe('C:\\Windows');
    expect(normalizeVirtualPath('')).toBe(VIRTUAL_PATHS.drive);
  });

  it('keeps desktop and my documents paths distinct', () => {
    expect(VIRTUAL_PATHS.desktop).toBe('C:\\Desktop');
    expect(VIRTUAL_PATHS.myDocuments).toBe('C:\\My Documents');
    expect(VIRTUAL_PATHS.desktop).not.toBe(VIRTUAL_PATHS.myDocuments);
    expect(normalizeVirtualPath('c:/desktop/./projects.lnk')).toBe('C:\\Desktop\\projects.lnk');
  });

  it('keeps media libraries separate from My Documents', () => {
    expect(VIRTUAL_PATHS.videos).toBe('C:\\Videos');
    expect(VIRTUAL_PATHS.pictures).toBe('C:\\Pictures');
    expect(VIRTUAL_PATHS.music).toBe('C:\\Music');
    expect(normalizeVirtualPath('c:/Videos/demo.avi')).toBe('C:\\Videos\\demo.avi');
    expect(normalizeVirtualPath('c:/My Pictures/Screenshots/screen.bmp')).toBe('C:\\Pictures\\Screenshots\\screen.bmp');
    expect(normalizeVirtualPath('c:/Music/Track01.mp3')).toBe('C:\\Music\\Track01.mp3');
    expect(normalizeVirtualPath('c:/My Documents/..\\Videos')).toBe('C:\\Videos');
  });

  it('canonicalizes known folder casing without rewriting unknown user names', () => {
    expect(normalizeVirtualPath('c:/windows/media/MySong.MP3')).toBe('C:\\Windows\\Media\\MySong.MP3');
    expect(normalizeVirtualPath('c:/desktop/MyCustomFolder')).toBe('C:\\Desktop\\MyCustomFolder');
  });
});

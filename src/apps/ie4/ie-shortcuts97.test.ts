import { describe, expect, it } from 'vitest';
import { resolveIeShortcut97 } from './ie-shortcuts97';

describe('Internet Explorer advertised keyboard shortcuts', () => {
  it('routes Ctrl/Command shortcuts to the matching browser commands', () => {
    expect(resolveIeShortcut97({ key: 'n', ctrlKey: true })).toBe('new-window');
    expect(resolveIeShortcut97({ key: 'l', metaKey: true })).toBe('open-address');
    expect(resolveIeShortcut97({ key: 'p', ctrlKey: true })).toBe('print');
    expect(resolveIeShortcut97({ key: 'a', ctrlKey: true })).toBe('select-page');
    expect(resolveIeShortcut97({ key: 'c', ctrlKey: true })).toBe('copy-address');
  });

  it('routes Alt navigation/close shortcuts and F5 refresh', () => {
    expect(resolveIeShortcut97({ key: 'ArrowLeft', altKey: true })).toBe('back');
    expect(resolveIeShortcut97({ key: 'ArrowRight', altKey: true })).toBe('forward');
    expect(resolveIeShortcut97({ key: 'Home', altKey: true })).toBe('home');
    expect(resolveIeShortcut97({ key: 'F4', altKey: true })).toBe('close');
    expect(resolveIeShortcut97({ key: 'F5' })).toBe('refresh');
  });

  it('ignores modified combinations outside the menu contract', () => {
    expect(resolveIeShortcut97({ key: 'n', ctrlKey: true, shiftKey: true })).toBeNull();
    expect(resolveIeShortcut97({ key: 'ArrowLeft', altKey: true, ctrlKey: true })).toBeNull();
    expect(resolveIeShortcut97({ key: 'F5', shiftKey: true })).toBeNull();
    expect(resolveIeShortcut97({ key: 'x' })).toBeNull();
  });
});

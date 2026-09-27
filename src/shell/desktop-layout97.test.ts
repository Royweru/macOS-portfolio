import { describe, expect, it, vi } from 'vitest';
import { activateDesktopShortcutOnKey97, getDesktopPropertiesTarget97, getDesktopShortcutPosition97 } from './desktop-layout97';

describe('Stitch desktop shortcut flow', () => {
  it('keeps the Stitch column-first order and uses a second column when the viewport is short', () => {
    expect(getDesktopShortcutPosition97(6, 596)).toEqual({ left: 12, top: 492 });
    expect(getDesktopShortcutPosition97(7, 596)).toEqual({ left: 108, top: 12 });
    expect(getDesktopShortcutPosition97(8, 596)).toEqual({ left: 108, top: 92 });
    expect(getDesktopShortcutPosition97(9, 596)).toEqual({ left: 108, top: 172 });
  });

  it('keeps all nine icons in the first column when the available desktop height permits it', () => {
    expect(getDesktopShortcutPosition97(8, 912)).toEqual({ left: 12, top: 652 });
  });

  it('wraps earlier when the viewport is narrower or shorter without reordering shortcuts', () => {
    expect(getDesktopShortcutPosition97(5, 524)).toEqual({ left: 12, top: 412 });
    expect(getDesktopShortcutPosition97(6, 524)).toEqual({ left: 108, top: 12 });
  });

  it('routes source-backed Properties actions to the relevant app and disables unsupported shortcut properties', () => {
    expect(getDesktopPropertiesTarget97()).toEqual({ kind: 'application', appId: 'control-panel' });
    expect(getDesktopPropertiesTarget97('shortcut-my-computer')).toEqual({ kind: 'application', appId: 'system-properties' });
    expect(getDesktopPropertiesTarget97('shortcut-my-documents')).toBeUndefined();
  });

  it('opens the focused desktop shortcut with Enter and leaves other keys alone', () => {
    const open = vi.fn();
    const enter = { key: 'Enter', preventDefault: vi.fn(), stopPropagation: vi.fn() } as unknown as KeyboardEvent;
    expect(activateDesktopShortcutOnKey97(enter, open)).toBe(true);
    expect(enter.preventDefault).toHaveBeenCalledOnce();
    expect(enter.stopPropagation).toHaveBeenCalledOnce();
    expect(open).toHaveBeenCalledOnce();

    const arrow = { key: 'ArrowDown', preventDefault: vi.fn(), stopPropagation: vi.fn() } as unknown as KeyboardEvent;
    expect(activateDesktopShortcutOnKey97(arrow, open)).toBe(false);
    expect(arrow.preventDefault).not.toHaveBeenCalled();
    expect(open).toHaveBeenCalledOnce();
  });
});

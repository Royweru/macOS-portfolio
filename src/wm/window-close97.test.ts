import { describe, expect, it, vi } from 'vitest';
import { canRequestWindowClose97, dispatchWindowShortcut97, hasUnsavedChangesInWindow97, shouldHandleWindowCloseShortcut97 } from './window-close97';

const closeableWindow = { id: 'notepad-1', canClose: true, canMinimize: true };
const makeEvent = (overrides: Partial<KeyboardEvent> = {}) => ({
  key: 'w', ctrlKey: true, metaKey: false, altKey: false, shiftKey: false,
  preventDefault: vi.fn(),
  ...overrides,
}) as unknown as KeyboardEvent;

describe('shared Weru window close policy', () => {
  it('detects an unsaved editor nested inside the window content', () => {
    const editor = {} as Element;
    const content = { querySelector: vi.fn(() => editor) } as unknown as Pick<ParentNode, 'querySelector'>;

    expect(hasUnsavedChangesInWindow97(content)).toBe(true);
    expect(content.querySelector).toHaveBeenCalledWith('[data-window-dirty="true"]');
  });

  it('treats absent window content or dirty markers as clean', () => {
    const content = { querySelector: vi.fn(() => null) } as unknown as Pick<ParentNode, 'querySelector'>;

    expect(hasUnsavedChangesInWindow97(undefined)).toBe(false);
    expect(hasUnsavedChangesInWindow97(content)).toBe(false);
  });

  it('suppresses the per-window close capture when an overlay disables window shortcuts', () => {
    const event = makeEvent();
    expect(shouldHandleWindowCloseShortcut97(event, false)).toBe(false);
    expect(shouldHandleWindowCloseShortcut97(event, true)).toBe(true);
  });

  it('closes a clean, closeable window without prompting', () => {
    const confirmDiscard = vi.fn(() => true);
    expect(canRequestWindowClose97(true, false, confirmDiscard)).toBe(true);
    expect(confirmDiscard).not.toHaveBeenCalled();
  });

  it('requires confirmation for dirty documents and respects non-closeable windows', () => {
    expect(canRequestWindowClose97(true, true, () => false)).toBe(false);
    expect(canRequestWindowClose97(true, true, () => true)).toBe(true);
    const confirmDiscard = vi.fn(() => true);
    expect(canRequestWindowClose97(false, true, confirmDiscard)).toBe(false);
    expect(confirmDiscard).not.toHaveBeenCalled();
  });

  it('routes Ctrl/Cmd+W through dirty-state confirmation before closing', () => {
    const event = makeEvent();
    const close = vi.fn();
    const confirmDiscard = vi.fn(() => false);
    const handled = dispatchWindowShortcut97(event, closeableWindow, {
      hasUnsavedChanges: true,
      confirmDiscard,
      close,
      minimize: vi.fn(),
    });

    expect(handled).toBe(true);
    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(confirmDiscard).toHaveBeenCalledOnce();
    expect(close).not.toHaveBeenCalled();
  });

  it('does not close a window whose close action is disabled', () => {
    const close = vi.fn();
    const confirmDiscard = vi.fn(() => true);
    const event = makeEvent();
    dispatchWindowShortcut97(event, { ...closeableWindow, canClose: false }, {
      hasUnsavedChanges: false,
      confirmDiscard,
      close,
      minimize: vi.fn(),
    });

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(confirmDiscard).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
  });

  it('honors the per-window minimize flag for Ctrl/Cmd+M', () => {
    const minimize = vi.fn();
    const event = makeEvent({ key: 'm' });
    dispatchWindowShortcut97(event, { ...closeableWindow, canMinimize: false }, {
      hasUnsavedChanges: false,
      confirmDiscard: () => true,
      close: vi.fn(),
      minimize,
    });
    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(minimize).not.toHaveBeenCalled();
  });

  it('does not intercept close or minimize shortcuts while an overlay disables them', () => {
    for (const key of ['w', 'm']) {
      const event = makeEvent({ key });
      const close = vi.fn();
      const minimize = vi.fn();
      const confirmDiscard = vi.fn(() => true);

      expect(dispatchWindowShortcut97(event, closeableWindow, {
        hasUnsavedChanges: true,
        confirmDiscard,
        close,
        minimize,
        shortcutsEnabled: false,
      })).toBe(false);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(confirmDiscard).not.toHaveBeenCalled();
      expect(close).not.toHaveBeenCalled();
      expect(minimize).not.toHaveBeenCalled();
    }
  });
});

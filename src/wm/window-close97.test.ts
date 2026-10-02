import { describe, expect, it, vi } from 'vitest';
import { dispatchWindowShortcut97, getWindowCloseAction97, hasUnsavedChangesInWindow97, shouldHandleWindowCloseShortcut97 } from './window-close97';

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

  it('routes clean, dirty, and non-closeable windows to the proper close action', () => {
    expect(getWindowCloseAction97(true, false)).toBe('close');
    expect(getWindowCloseAction97(true, true)).toBe('confirm-discard');
    expect(getWindowCloseAction97(false, true)).toBe('blocked');
  });

  it('routes Ctrl/Cmd+W through the in-shell discard dialog before closing', () => {
    const event = makeEvent();
    const close = vi.fn();
    const requestDiscardConfirmation = vi.fn();
    const handled = dispatchWindowShortcut97(event, closeableWindow, {
      hasUnsavedChanges: true,
      requestDiscardConfirmation,
      close,
      minimize: vi.fn(),
    });

    expect(handled).toBe(true);
    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(requestDiscardConfirmation).toHaveBeenCalledWith(closeableWindow.id);
    expect(close).not.toHaveBeenCalled();
  });

  it('does not close a window whose close action is disabled', () => {
    const close = vi.fn();
    const requestDiscardConfirmation = vi.fn();
    const event = makeEvent();
    dispatchWindowShortcut97(event, { ...closeableWindow, canClose: false }, {
      hasUnsavedChanges: false,
      requestDiscardConfirmation,
      close,
      minimize: vi.fn(),
    });

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(requestDiscardConfirmation).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
  });

  it('honors the per-window minimize flag for Ctrl/Cmd+M', () => {
    const minimize = vi.fn();
    const event = makeEvent({ key: 'm' });
    dispatchWindowShortcut97(event, { ...closeableWindow, canMinimize: false }, {
      hasUnsavedChanges: false,
      requestDiscardConfirmation: vi.fn(),
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
      const requestDiscardConfirmation = vi.fn();

      expect(dispatchWindowShortcut97(event, closeableWindow, {
        hasUnsavedChanges: true,
        requestDiscardConfirmation,
        close,
        minimize,
        shortcutsEnabled: false,
      })).toBe(false);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(requestDiscardConfirmation).not.toHaveBeenCalled();
      expect(close).not.toHaveBeenCalled();
      expect(minimize).not.toHaveBeenCalled();
    }
  });
});

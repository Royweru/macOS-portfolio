import { afterEach, describe, expect, it, vi } from 'vitest';
import { attachScreensaverIdleTimer97 } from './screensaver-idle97';

describe('screensaver inactivity timer', () => {
  afterEach(() => vi.useRealTimers());

  it('activates once after the full idle interval', () => {
    vi.useFakeTimers();
    const target = new EventTarget();
    const onActivate = vi.fn();
    attachScreensaverIdleTimer97(target, 5000, onActivate);

    vi.advanceTimersByTime(4999);
    expect(onActivate).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    vi.advanceTimersByTime(5000);
    expect(onActivate).toHaveBeenCalledOnce();
  });

  it.each(['mousemove', 'keydown', 'pointerdown'])('restarts the idle interval after %s', (eventName) => {
    vi.useFakeTimers();
    const target = new EventTarget();
    const onActivate = vi.fn();
    const onActivity = vi.fn();
    attachScreensaverIdleTimer97(target, 5000, onActivate, onActivity);

    vi.advanceTimersByTime(4000);
    target.dispatchEvent(new Event(eventName));
    vi.advanceTimersByTime(4999);
    expect(onActivity).toHaveBeenCalledOnce();
    expect(onActivate).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onActivate).toHaveBeenCalledOnce();
  });

  it('cancels the timeout and ignores activity after cleanup', () => {
    vi.useFakeTimers();
    const target = new EventTarget();
    const onActivate = vi.fn();
    const onActivity = vi.fn();
    const cleanup = attachScreensaverIdleTimer97(target, 5000, onActivate, onActivity);
    cleanup();
    cleanup();

    target.dispatchEvent(new Event('keydown'));
    vi.advanceTimersByTime(5000);
    expect(onActivity).not.toHaveBeenCalled();
    expect(onActivate).not.toHaveBeenCalled();
  });
});

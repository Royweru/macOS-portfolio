import { afterEach, describe, expect, it, vi } from 'vitest';
import { getShellDialogLayer97, registerShellDialogLayer97, subscribeShellDialogLayer97 } from './dialog-layer97';

afterEach(() => registerShellDialogLayer97(null));

describe('shell dialog layer registration', () => {
  it('publishes the mounted overlay host to subscribers and clears it on unmount', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeShellDialogLayer97(listener);
    const host = {} as HTMLElement;

    registerShellDialogLayer97(host);
    expect(getShellDialogLayer97()).toBe(host);
    expect(listener).toHaveBeenCalledTimes(1);

    registerShellDialogLayer97(null);
    expect(getShellDialogLayer97()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
  });
});

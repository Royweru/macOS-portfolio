import { describe, expect, it, vi } from 'vitest';
import { executeShutdownAction97 } from './shutdown-actions97';

describe('Shutdown dialog confirmation actions', () => {
  it('plays the shutdown sound and shows the safe-power-off state', () => {
    const playShutdownSound = vi.fn();
    const reload = vi.fn();
    const setResult = vi.fn();

    executeShutdownAction97('shutdown', { playShutdownSound, reload, setResult });

    expect(playShutdownSound).toHaveBeenCalledOnce();
    expect(setResult).toHaveBeenCalledOnce();
    expect(setResult).toHaveBeenCalledWith('shutdown');
    expect(reload).not.toHaveBeenCalled();
  });

  it('plays the shutdown sound and reloads for Restart', () => {
    const playShutdownSound = vi.fn();
    const reload = vi.fn();
    const setResult = vi.fn();

    executeShutdownAction97('restart', { playShutdownSound, reload, setResult });

    expect(playShutdownSound).toHaveBeenCalledOnce();
    expect(reload).toHaveBeenCalledOnce();
    expect(setResult).not.toHaveBeenCalled();
  });

  it('plays the shutdown sound and displays the unsupported-user notice for Log on', () => {
    const playShutdownSound = vi.fn();
    const reload = vi.fn();
    const setResult = vi.fn();

    executeShutdownAction97('logon', { playShutdownSound, reload, setResult });

    expect(playShutdownSound).toHaveBeenCalledOnce();
    expect(setResult).toHaveBeenCalledWith('logon');
    expect(reload).not.toHaveBeenCalled();
  });
});

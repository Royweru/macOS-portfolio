import { describe, expect, it } from 'vitest';
import { executeTerminalCommand } from './terminal-commands';
import { parseCommand } from './terminal-parser';

const context = (effects: string[]) => ({
  cwd: 'C:\\Users\\Admin',
  emitEffect: (effect: { type: string }) => effects.push(effect.type),
});

describe('Weru 97 terminal commands', () => {
  it('reports the Weru version', async () => {
    const result = await executeTerminalCommand(parseCommand('ver'), context([]));
    expect(result.lines[0]?.text).toBe('Weru 97 [Version 4.0.0]');
  });

  it('dispatches the crash effect for the BSOD recovery flow', async () => {
    const effects: string[] = [];
    const result = await executeTerminalCommand(parseCommand('crash'), context(effects));
    expect(effects).toEqual(['show-bsod']);
    expect(result.exitCode).toBe(0);
  });
});

import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BootSequence97 from './BootSequence97';
import { getBootWaitingStage97, isBootSkipKey97, shouldFadeBootExit97 } from './boot-skip';

describe('BootSequence97 skip contract', () => {
  it('accepts the documented keyboard skip keys only', () => {
    expect(isBootSkipKey97('Escape')).toBe(true);
    expect(isBootSkipKey97('Enter')).toBe(true);
    expect(isBootSkipKey97(' ')).toBe(true);
    expect(isBootSkipKey97('Tab')).toBe(false);
  });
});

describe('BootSequence97 stage markup', () => {
  it('keeps the full-screen overlay stage class distinct from the BIOS panel class', () => {
    const markup = renderToStaticMarkup(createElement(BootSequence97, {
      onDone: () => undefined,
      onRevealDesktop: () => undefined,
    }));

    expect(markup).toContain('class="boot97 boot97-stage-bios "');
    expect(markup).toContain('class="boot97-bios"');
  });

  it('fades the logo splash on skip but immediately exits BIOS and starting stages', () => {
    expect(shouldFadeBootExit97('logo')).toBe(true);
    expect(shouldFadeBootExit97('bios')).toBe(false);
    expect(shouldFadeBootExit97('starting')).toBe(false);
  });

  it('keeps a completed animated logo splash visible while the filesystem is still bootstrapping', () => {
    expect(getBootWaitingStage97('logo', true)).toBe('logo');
    expect(getBootWaitingStage97('bios', false)).toBe('starting');
    expect(getBootWaitingStage97('starting', false)).toBe('starting');
  });
});

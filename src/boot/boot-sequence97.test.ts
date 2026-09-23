import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BootSequence97 from './BootSequence97';
import { isBootSkipKey97 } from './boot-skip';

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
});

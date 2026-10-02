import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import Calculator97 from '../calculator/Calculator97';
import Minesweeper97 from '../minesweeper/Minesweeper97';

const styles = readFileSync('src/styles/stitch97.css', 'utf8');

describe('classic game layout in resizable windows', () => {
  it('keeps calculator controls within a centered classic-width panel', () => {
    const markup = renderToStaticMarkup(createElement(Calculator97));

    expect(markup).toContain('class="win97-app win97-calculator"');
    expect(markup).toContain('class="win97-calculator-panel"');
    expect(styles).toMatch(/\.win97-calculator-panel\s*\{[^}]*width:\s*min\(100%,\s*320px\)/);
  });

  it('centers the bounded Minesweeper board while its gray app surface fills the window', () => {
    const markup = renderToStaticMarkup(createElement(Minesweeper97));

    expect(markup).toContain('class="win97-app win97-minesweeper"');
    expect(markup).toContain('class="win97-minesweeper-panel"');
    expect(styles).toMatch(/\.win97-minesweeper\s*\{[^}]*justify-content:\s*center/);
    expect(styles).toMatch(/\.win97-minesweeper-panel\s*\{[^}]*width:\s*min\(100%,\s*262px\)/);
  });
});

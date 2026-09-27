import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import MarkdownPreview97 from './MarkdownPreview97';
import { PROJECTS } from '../../data/portfolio-manifest';

describe('MarkdownPreview97', () => {
  it('renders README headings, GFM tables, and safe links into separate browser tabs', () => {
    const html = renderToStaticMarkup(createElement(MarkdownPreview97, {
      source: '# Project\n\n| Layer | Tool |\n| --- | --- |\n| UI | React |\n\n[Live site](https://example.com/demo)',
    }));

    expect(html).toContain('<h1>Project</h1>');
    expect(html).toContain('<table>');
    expect(html).toContain('<td>React</td>');
    expect(html).toContain('href="https://example.com/demo" target="_blank" rel="noopener noreferrer"');
  });

  it('does not render unsafe or non-local image URLs as active links', () => {
    const html = renderToStaticMarkup(createElement(MarkdownPreview97, {
      source: '[unsafe](javascript:alert(1))\n\n![remote](https://example.com/tracker.png)',
    }));

    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain('<img');
  });

  it('routes relative text-document links through the Notepad callback', () => {
    const html = renderToStaticMarkup(createElement(MarkdownPreview97, {
      source: '[Project notes](./notes.md#setup)',
      onOpenDocument: () => undefined,
    }));

    expect(html).toContain('<a href="./notes.md#setup">Project notes</a>');
  });

  it('does not activate relative document links when no OS file handler is provided', () => {
    const html = renderToStaticMarkup(createElement(MarkdownPreview97, {
      source: '[Project notes](./notes.md)',
    }));

    expect(html).toContain('<span>Project notes</span>');
    expect(html).not.toContain('href="./notes.md"');
  });

  it('renders each configured project live site from its linked README as a safe new-tab link', () => {
    for (const project of PROJECTS.filter(item => item.live && item.readme)) {
      const source = readFileSync(join(process.cwd(), 'public', project.readme!.slice(1)), 'utf8');
      expect(source).not.toMatch(/REPLACE_WITH_[A-Z0-9_]+/i);

      const html = renderToStaticMarkup(createElement(MarkdownPreview97, { source }));
      expect(html).toContain(`href="${project.live}" target="_blank" rel="noopener noreferrer"`);
    }
  });

  it('keeps Markdown preview and editable Notepad text at a readable 16px baseline', () => {
    const styles = readFileSync(join(process.cwd(), 'src', 'styles', 'stitch97.css'), 'utf8');

    expect(styles).toMatch(/\.win97-notepad textarea\s*\{[^}]*font-size:\s*16px\s*!important;/);
    expect(styles).toMatch(/\.win97-markdown-preview\s*\{[^}]*font:\s*16px\/1\.55\s+Arial/);
  });
});

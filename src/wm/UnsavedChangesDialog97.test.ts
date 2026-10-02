import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import UnsavedChangesDialog97 from './UnsavedChangesDialog97';

describe('UnsavedChangesDialog97', () => {
  it('renders an accessible classic discard confirmation with a safe Cancel default', () => {
    const html = renderToStaticMarkup(createElement(UnsavedChangesDialog97, {
      title: 'README.md',
      onDiscard: vi.fn(),
      onCancel: vi.fn(),
    }));

    expect(html).toContain('role="alertdialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('Confirm Close — README.md');
    expect(html).toContain('This document has unsaved changes.');
    expect(html).toContain('Close Without Saving');
    expect(html).toContain('autofocus=""');
    expect(html).toContain('>Cancel</button>');
  });
});

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RecycleBinEmptyAlert97 from './RecycleBinEmptyAlert97';
import { actionLeavesRecycleBinEmpty97 } from './recycle-bin-actions97';

describe('Stitch Recycle Bin empty alert', () => {
  it('renders the independent source-shaped alert and both dismissal controls', () => {
    const markup = renderToStaticMarkup(createElement(RecycleBinEmptyAlert97, { onDismiss: () => undefined }));
    expect(markup).toContain('role="alertdialog"');
    expect(markup).toContain('Recycle Bin</span>');
    expect(markup).toContain('aria-label="Close Recycle Bin empty alert"');
    expect(markup).toContain('The Recycle Bin is empty. Make better life choices.');
    expect(markup).toContain('>OK</button>');
    expect(markup).toContain('viewBox="0 0 32 32"');
  });

  it('announces an empty state only when an action actually removes the final entry', () => {
    expect(actionLeavesRecycleBinEmpty97('empty', 2)).toBe(true);
    expect(actionLeavesRecycleBinEmpty97('empty', 0)).toBe(false);
    expect(actionLeavesRecycleBinEmpty97('delete', 1)).toBe(true);
    expect(actionLeavesRecycleBinEmpty97('delete', 2)).toBe(false);
  });
});

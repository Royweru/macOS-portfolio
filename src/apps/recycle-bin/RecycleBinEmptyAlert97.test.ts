import { createElement } from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RecycleBinEmptyAlert97 from './RecycleBinEmptyAlert97';
import { actionLeavesRecycleBinEmpty97 } from './recycle-bin-actions97';

const stitchSource = readFileSync(join(process.cwd(), 'Stitch Designs', 'html', 'windows_97_system_dialogs_properties.html'), 'utf8');
const styles = readFileSync(join(process.cwd(), 'src', 'styles', 'stitch97.css'), 'utf8');

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

  it('maps the source bottom-right anchor into the taskbar-safe shell layer', () => {
    expect(stitchSource).toContain('right-16 bottom-16 w-72');
    expect(styles).toMatch(/\.win97-recycle-empty-alert\s*\{[^}]*right:\s*64px;[^}]*bottom:\s*18px;/);
    expect(styles).toMatch(/@media\s*\(max-width:\s*380px\)\s*\{\s*\.win97-recycle-empty-alert\s*\{\s*right:\s*12px;/);
    expect(styles).toMatch(/@media\s*\(max-height:\s*180px\)\s*\{\s*\.win97-recycle-empty-alert\s*\{\s*bottom:\s*0;/);
  });
});

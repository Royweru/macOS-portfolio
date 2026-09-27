import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import SystemProperties97 from './SystemProperties97';
import { getAdjacentPropertyTab97 } from './system-properties-tabs97';
import { WINDOW_CONFIGS } from '../../constants';

const stitchDialogs = readFileSync(join(process.cwd(), 'Stitch Designs', 'html', 'windows_97_system_dialogs_properties.html'), 'utf8');
const stitchStyles = readFileSync(join(process.cwd(), 'src', 'styles', 'stitch97.css'), 'utf8');
const propertyStyles = readFileSync(join(process.cwd(), 'src', 'styles', 'window97.css'), 'utf8');
const propertiesTitlebarIcon = readFileSync(join(process.cwd(), 'public', 'assets', 'win97', 'icons', 'system-properties.svg'), 'utf8');

const rectGeometry = (svg: string) => [...svg.matchAll(/<rect\b([^>]*)>/g)].map(([, sourceAttributes]) => {
  const attributes = [...sourceAttributes.matchAll(/([\w-]+)="([^"]*)"/g)]
    .map(([, name, value]) => [name, value.toLowerCase()] as const)
    .sort(([left], [right]) => left.localeCompare(right));
  return Object.fromEntries(attributes);
});

describe('System Properties Stitch surface', () => {
  it('renders the Weru-adapted source overview and segmented resource meters', () => {
    const markup = renderToStaticMarkup(createElement(SystemProperties97, {}));

    expect(markup).toContain('aria-label="Weru workstation"');
    expect(markup).toContain('role="tablist"');
    expect(markup).toContain('aria-controls="system-properties-panel"');
    expect(markup).toContain('aria-labelledby="system-properties-tab-general"');
    expect(markup).toContain('Weru 97');
    expect(markup).toContain('Roy Weru');
    expect(markup).not.toContain('Alex Weru');
    expect(markup).toContain('4.10.1997 Release C');
    expect(markup).toContain('Lead Portfolio Architect');
    expect(markup).toContain('GenuineIntel Pentium(r) II Processor');
    expect(markup.match(/class="win97-resource-cell"/g)).toHaveLength(39);
    expect(markup).toContain('aria-valuenow="84"');
    expect(markup).toContain('aria-valuenow="72"');
    expect(markup).not.toContain('Portfolio Operating System');
  });

  it('supports arrow, Home, and End keyboard navigation across the tabs', () => {
    expect(getAdjacentPropertyTab97('general', 'ArrowRight')).toBe('device');
    expect(getAdjacentPropertyTab97('general', 'ArrowLeft')).toBe('performance');
    expect(getAdjacentPropertyTab97('performance', 'ArrowDown')).toBe('general');
    expect(getAdjacentPropertyTab97('device', 'Home')).toBe('general');
    expect(getAdjacentPropertyTab97('general', 'End')).toBe('performance');
    expect(getAdjacentPropertyTab97('general', 'Escape')).toBeUndefined();
  });

  it('pins the extracted System Properties scope, geometry, tabs, meters, and bevels to Stitch', () => {
    const sourceStart = stitchDialogs.indexOf('data-purpose="dialog-system-properties"');
    const sourceEnd = stitchDialogs.indexOf('<!-- END: Modal Dialog 1', sourceStart);
    const source = stitchDialogs.slice(sourceStart, sourceEnd);
    const markup = renderToStaticMarkup(createElement(SystemProperties97, {}));

    expect(sourceStart).toBeGreaterThanOrEqual(0);
    expect(sourceEnd).toBeGreaterThan(sourceStart);
    expect(stitchDialogs).toContain('w-[460px]');
    expect(WINDOW_CONFIGS['system-properties']).toMatchObject({ w: 460, h: 420 });
    expect(WINDOW_CONFIGS['system-properties']).toMatchObject({ canMinimize: false, canMaximize: false, showMaximize: false });
    expect(source.match(/class="win-tab-active/g)).toHaveLength(1);
    expect(source.match(/class="win-tab-inactive/g)).toHaveLength(3);
    expect(source.match(/class="meter-block"/g)).toHaveLength(39);
    expect(stitchDialogs).toContain('height: 18px;');
    expect(stitchDialogs).toContain('padding: 3px 8px 4px 8px;');
    expect(markup).toContain('aria-label="System Properties tabs"');
    expect(markup).toContain('aria-label="Weru workstation"');
    expect(markup.match(/class="win97-resource-cell"/g)).toHaveLength(39);
    expect(propertyStyles).toMatch(/\.win97-property-tabs\s*\{[^}]*gap: 4px;[^}]*border-bottom: 1px solid #fff;/);
    expect(propertyStyles).toMatch(/\.win97-property-tab\s*\{[^}]*background: #b0b0b0;[^}]*font: 11px/);
    expect(propertyStyles).toMatch(/\.win97-property-tab\.active\s*\{[^}]*padding: 3px 8px 4px;[^}]*background: #c0c0c0;/);
    expect(stitchStyles).toMatch(/\.window97\[data-window-app-id='system-properties'\] \.win95-titlebar\s*\{[^}]*height: 18px;[^}]*padding: 1px 2px 1px 3px;/);
    expect(stitchStyles).toMatch(/\.window97\[data-window-app-id='system-properties'\] \.win95-titlebar\.active\s*\{[^}]*linear-gradient\(90deg, #000080 0%, #1084d0 100%\)/);
  });

  it('keeps the System Properties titlebar monitor pixel geometry matched to Stitch', () => {
    const sourceIconMatch = stitchDialogs.match(/<!-- Small 16x16 Titlebar Icon -->\s*(<svg\b[\s\S]*?<\/svg>)/);

    expect(sourceIconMatch).not.toBeNull();
    expect(sourceIconMatch?.[1]).toContain('w-3.5 h-3.5');
    expect(rectGeometry(propertiesTitlebarIcon)).toEqual(rectGeometry(sourceIconMatch?.[1] ?? ''));
  });
});

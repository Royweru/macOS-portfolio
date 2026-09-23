import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SystemProperties97 from './SystemProperties97';
import { getAdjacentPropertyTab97 } from './system-properties-tabs97';

describe('System Properties Stitch surface', () => {
  it('renders the Weru-adapted source overview and segmented resource meters', () => {
    const markup = renderToStaticMarkup(createElement(SystemProperties97, {}));

    expect(markup).toContain('aria-label="Weru workstation"');
    expect(markup).toContain('role="tablist"');
    expect(markup).toContain('aria-controls="system-properties-panel"');
    expect(markup).toContain('aria-labelledby="system-properties-tab-general"');
    expect(markup).toContain('Weru 97');
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
});

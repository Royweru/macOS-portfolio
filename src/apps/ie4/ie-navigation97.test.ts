import { describe, expect, it } from 'vitest';
import { appendIeHistory97, stepIeHistory97 } from './ie-navigation97';

describe('IE4 external handoff history', () => {
  it('records a typed destination and preserves bounded back/forward navigation', () => {
    const history = appendIeHistory97(['weru://home'], 0, 'https://example.com/one');
    expect(history).toEqual({ entries: ['weru://home', 'https://example.com/one'], index: 1 });
    expect(stepIeHistory97(history.entries, history.index, -1)).toEqual({ address: 'weru://home', index: 0 });
    expect(stepIeHistory97(history.entries, history.index, 1)).toBeNull();
  });

  it('drops the forward branch when navigating after Back', () => {
    expect(appendIeHistory97(['weru://home', 'https://example.com/one', 'https://example.com/two'], 0, 'https://example.com/three'))
      .toEqual({ entries: ['weru://home', 'https://example.com/three'], index: 1 });
  });

  it('does not step outside either history boundary', () => {
    expect(stepIeHistory97(['weru://home'], 0, -1)).toBeNull();
    expect(stepIeHistory97(['weru://home'], 0, 1)).toBeNull();
  });
});

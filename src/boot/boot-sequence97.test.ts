import { describe, expect, it } from 'vitest';
import { isBootSkipKey97 } from './boot-skip';

describe('BootSequence97 skip contract', () => {
  it('accepts the documented keyboard skip keys only', () => {
    expect(isBootSkipKey97('Escape')).toBe(true);
    expect(isBootSkipKey97('Enter')).toBe(true);
    expect(isBootSkipKey97(' ')).toBe(true);
    expect(isBootSkipKey97('Tab')).toBe(false);
  });
});

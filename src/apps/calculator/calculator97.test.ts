import { describe, expect, it } from 'vitest';
import { calculate97 } from './calculator-engine';

describe('Calculator97 arithmetic engine', () => {
  it('evaluates the supported operators', () => {
    expect(calculate97(7, '+', 5)).toBe(12);
    expect(calculate97(7, '-', 5)).toBe(2);
    expect(calculate97(7, '×', 5)).toBe(35);
    expect(calculate97(10, '÷', 4)).toBe(2.5);
  });

  it('returns an invalid numeric result for division by zero', () => {
    expect(Number.isNaN(calculate97(10, '÷', 0))).toBe(true);
  });
});

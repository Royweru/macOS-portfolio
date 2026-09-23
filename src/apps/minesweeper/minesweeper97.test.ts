import { describe, expect, it } from 'vitest';
import { countAdjacentMines97, generateMines97 } from './minesweeper-engine';

describe('Minesweeper97 board engine', () => {
  it('counts neighboring mines without wrapping across board edges', () => {
    expect(countAdjacentMines97(0, new Set([1, 9, 10]))).toBe(3);
    expect(countAdjacentMines97(0, new Set([8, 17]))).toBe(0);
  });

  it('generates ten mines while protecting the first reveal and its neighbors', () => {
    const safeIndex = 40;
    const mines = generateMines97(safeIndex);
    expect(mines.size).toBe(10);
    expect(mines.has(safeIndex)).toBe(false);
    expect([...mines].every(index => ![30, 31, 32, 39, 40, 41, 48, 49, 50].includes(index))).toBe(true);
  });
});

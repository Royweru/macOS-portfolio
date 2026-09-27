import { describe, expect, it } from 'vitest';
import { getNotepadCaret97 } from './notepad-caret97';

describe('getNotepadCaret97', () => {
  it('returns one-based line and column positions', () => {
    expect(getNotepadCaret97('hello\nworld', 0)).toEqual({ line: 1, column: 1 });
    expect(getNotepadCaret97('hello\nworld', 3)).toEqual({ line: 1, column: 4 });
    expect(getNotepadCaret97('hello\nworld', 6)).toEqual({ line: 2, column: 1 });
    expect(getNotepadCaret97('hello\nworld', 9)).toEqual({ line: 2, column: 4 });
  });

  it('handles CRLF and standalone CR line endings', () => {
    expect(getNotepadCaret97('one\r\ntwo\rthree', 5)).toEqual({ line: 2, column: 1 });
    expect(getNotepadCaret97('one\r\ntwo\rthree', 9)).toEqual({ line: 3, column: 1 });
  });

  it('clamps invalid offsets to the document bounds', () => {
    expect(getNotepadCaret97('abc', -5)).toEqual({ line: 1, column: 1 });
    expect(getNotepadCaret97('abc', 99)).toEqual({ line: 1, column: 4 });
    expect(getNotepadCaret97('abc', Number.NaN)).toEqual({ line: 1, column: 1 });
  });
});

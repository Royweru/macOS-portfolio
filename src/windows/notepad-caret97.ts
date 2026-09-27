export type NotepadCaret97 = {
  line: number;
  column: number;
};

export function getNotepadCaret97(text: string, selectionStart: number): NotepadCaret97 {
  const offset = Number.isFinite(selectionStart)
    ? Math.max(0, Math.min(text.length, Math.trunc(selectionStart)))
    : 0;
  let line = 1;
  let column = 1;

  for (let index = 0; index < offset; index += 1) {
    const character = text[index];
    if (character === '\r') {
      if (text[index + 1] === '\n') {
        if (index + 1 < offset) {
          line += 1;
          column = 1;
          index += 1;
        }
      } else {
        line += 1;
        column = 1;
      }
    } else if (character === '\n') {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }

  return { line, column };
}

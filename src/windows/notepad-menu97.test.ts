import { describe, expect, it } from 'vitest';
import { findNextTextMatch97, getNotepadMenuFocusIndex97, getNotepadMenuItems97, getSaveAsCopyName97, type NotepadMenu97 } from './notepad-menu97';

const context = { readOnly: false, dirty: true, canSaveAs: true, hasSelection: true, canEdit: true, hasFindTerm: true };

describe('Notepad classic menu commands', () => {
  it('puts save and Save As in File, and editing commands in Edit', () => {
    expect(getNotepadMenuItems97('File', context).map(item => item.label)).toEqual(['Save', 'Save As…']);
    expect(getNotepadMenuItems97('Edit', context).map(item => item.label)).toEqual(['Undo', 'Cut', 'Copy', 'Paste', 'Select All']);
    expect(getNotepadMenuItems97('Search', context).map(item => item.label)).toEqual(['Find…', 'Find Next']);
  });

  it('disables Save for clean/read-only documents and clipboard mutations for read-only text', () => {
    const items = (menu: NotepadMenu97, state: typeof context) => getNotepadMenuItems97(menu, state);
    expect(items('File', { ...context, dirty: false }).find(item => item.id === 'save')?.disabled).toBe(true);
    expect(items('File', { ...context, readOnly: true }).find(item => item.id === 'save')?.disabled).toBe(true);
    const readOnlyEdit = items('Edit', { ...context, readOnly: true });
    expect(readOnlyEdit.find(item => item.id === 'cut')?.disabled).toBe(true);
    expect(readOnlyEdit.find(item => item.id === 'paste')?.disabled).toBe(true);
    expect(readOnlyEdit.find(item => item.id === 'copy')?.disabled).toBe(false);
  });

  it('finds from the caret and wraps to the first match', () => {
    expect(findNextTextMatch97('Alpha beta ALPHA', 'alpha', 1)).toBe(11);
    expect(findNextTextMatch97('Alpha beta ALPHA', 'alpha', 12)).toBe(0);
    expect(findNextTextMatch97('anything', '  ')).toBe(-1);
  });

  it('preserves Markdown file type in the suggested Save As name', () => {
    expect(getSaveAsCopyName97('README.md', true)).toBe('README copy.md');
    expect(getSaveAsCopyName97('notes.txt', false)).toBe('notes copy.txt');
  });

  it('navigates enabled menu commands by arrows and Home/End with wrapping', () => {
    expect(getNotepadMenuFocusIndex97(4, -1, 'ArrowDown')).toBe(0);
    expect(getNotepadMenuFocusIndex97(4, -1, 'ArrowUp')).toBe(3);
    expect(getNotepadMenuFocusIndex97(4, 3, 'ArrowDown')).toBe(0);
    expect(getNotepadMenuFocusIndex97(4, 0, 'ArrowUp')).toBe(3);
    expect(getNotepadMenuFocusIndex97(4, 2, 'Home')).toBe(0);
    expect(getNotepadMenuFocusIndex97(4, 2, 'End')).toBe(3);
    expect(getNotepadMenuFocusIndex97(0, -1, 'ArrowDown')).toBe(-1);
  });
});

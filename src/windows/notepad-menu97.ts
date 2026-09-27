export type NotepadMenu97 = 'File' | 'Edit' | 'Search' | 'Help';
export type NotepadMenuCommand97 = 'save' | 'save-as' | 'undo' | 'cut' | 'copy' | 'paste' | 'select-all' | 'find' | 'find-next' | 'help-topics' | 'about';

export interface NotepadMenuContext97 {
  readOnly: boolean;
  dirty: boolean;
  canSaveAs: boolean;
  hasSelection: boolean;
  canEdit: boolean;
  hasFindTerm: boolean;
}

export interface NotepadMenuItem97 {
  id: NotepadMenuCommand97;
  label: string;
  disabled?: boolean;
  separatorBefore?: boolean;
}

export function getSaveAsCopyName97(filename: string, isMarkdown: boolean): string {
  const stem = filename.replace(/\.[^.]+$/, '');
  return `${stem} copy.${isMarkdown ? 'md' : 'txt'}`;
}

export function getNotepadMenuFocusIndex97(itemCount: number, currentIndex: number, key: string): number {
  if (itemCount < 1) return -1;
  if (key === 'Home') return 0;
  if (key === 'End') return itemCount - 1;
  if (key === 'ArrowDown') return currentIndex < 0 ? 0 : (currentIndex + 1) % itemCount;
  if (key === 'ArrowUp') return currentIndex < 0 ? itemCount - 1 : (currentIndex - 1 + itemCount) % itemCount;
  return currentIndex;
}

const MENU_ITEMS97: Record<NotepadMenu97, readonly NotepadMenuItem97[]> = {
  File: [
    { id: 'save', label: 'Save', separatorBefore: false },
    { id: 'save-as', label: 'Save As…', separatorBefore: true },
  ],
  Edit: [
    { id: 'undo', label: 'Undo', disabled: true },
    { id: 'cut', label: 'Cut', separatorBefore: true },
    { id: 'copy', label: 'Copy' },
    { id: 'paste', label: 'Paste' },
    { id: 'select-all', label: 'Select All', separatorBefore: true },
  ],
  Search: [
    { id: 'find', label: 'Find…' },
    { id: 'find-next', label: 'Find Next', separatorBefore: true },
  ],
  Help: [
    { id: 'help-topics', label: 'Help Topics' },
    { id: 'about', label: 'About Notepad', separatorBefore: true },
  ],
};

export function getNotepadMenuItems97(menu: NotepadMenu97, context: NotepadMenuContext97): NotepadMenuItem97[] {
  return MENU_ITEMS97[menu].map(item => {
    if (item.id === 'save') return { ...item, disabled: context.readOnly || !context.dirty };
    if (item.id === 'save-as') return { ...item, disabled: !context.canSaveAs };
    if (item.id === 'cut' || item.id === 'paste') return { ...item, disabled: context.readOnly || !context.canEdit || (item.id === 'cut' && !context.hasSelection) };
    if (item.id === 'copy') return { ...item, disabled: !context.canEdit || !context.hasSelection };
    if (item.id === 'select-all') return { ...item, disabled: !context.canEdit };
    if (item.id === 'find-next') return { ...item, disabled: !context.hasFindTerm };
    return { ...item };
  });
}

/** Search after the current caret/selection, wrapping once to the start. */
export function findNextTextMatch97(text: string, term: string, fromIndex = 0): number {
  const query = term.trim();
  if (!query) return -1;
  const start = Math.max(0, Math.min(text.length, fromIndex));
  const next = text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase(), start);
  return next >= 0 ? next : text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase(), 0);
}

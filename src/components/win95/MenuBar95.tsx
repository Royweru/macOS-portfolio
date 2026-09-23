export interface MenuBarItem95 {
  id: string;
  label: string;
  disabled?: boolean;
}

interface MenuBar95Props {
  items: MenuBarItem95[];
  onAction?: (item: MenuBarItem95) => void;
}

export default function MenuBar95({ items, onAction }: MenuBar95Props) {
  return <nav className="win95-menubar" aria-label="Application menu">{items.map((item) => <button type="button" key={item.id} disabled={item.disabled} onClick={() => onAction?.(item)}>{item.label}</button>)}</nav>;
}

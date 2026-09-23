export default function ContextMenu97({ x, y, items, onSelect }: { x: number; y: number; items: string[]; onSelect: (item: string) => void }) {
  return <div className="context97 raised" style={{ left: x, top: y }} role="menu">{items.map((item) => item === '—' ? <hr key={item} /> : <button type="button" key={item} onClick={() => onSelect(item)}>{item}</button>)}</div>;
}

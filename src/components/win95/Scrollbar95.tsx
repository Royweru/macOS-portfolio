export default function Scrollbar95({ orientation = 'vertical' }: { orientation?: 'vertical' | 'horizontal' }) {
  return <div aria-hidden="true" className={`win95-scrollbar win95-scrollbar-${orientation}`}><button type="button">{orientation === 'vertical' ? '▲' : '◀'}</button><span /><button type="button">{orientation === 'vertical' ? '▼' : '▶'}</button></div>;
}


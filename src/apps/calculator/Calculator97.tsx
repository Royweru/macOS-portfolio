'use client';

import { useState, type KeyboardEvent } from 'react';
import Button95 from '../../components/win95/Button95';
import { calculate97 } from './calculator-engine';

const keyRows = [['MC', 'MR', 'MS', 'M+'], ['Back', 'CE', 'C', 'sqrt'], ['7', '8', '9', '÷'], ['4', '5', '6', '×'], ['1', '2', '3', '-'], ['0', '+/-', '.', '+'], ['%', '1/x', '=', '']];
export default function Calculator97() {
  const [display, setDisplay] = useState('0'); const [stored, setStored] = useState<number | null>(null); const [operator, setOperator] = useState<string | null>(null); const [waiting, setWaiting] = useState(false); const [memory, setMemory] = useState(0); const number = Number(display);
  const reset = () => { setDisplay('0'); setStored(null); setOperator(null); setWaiting(false); };
  const press = (key: string) => {
    if (/^\d$/.test(key) || key === '.') { if (waiting) { setDisplay(key === '.' ? '0.' : key); setWaiting(false); return; } if (key === '.' && display.includes('.')) return; setDisplay(display === '0' && key !== '.' ? key : display + key); return; }
    if (key === 'C') { reset(); return; } if (key === 'CE') { setDisplay('0'); return; } if (key === 'Back') { setDisplay(display.length > 1 ? display.slice(0, -1) : '0'); return; } if (key === '+/-') { setDisplay(String(-number)); return; }
    if (key === 'MC') { setMemory(0); return; } if (key === 'MR') { setDisplay(String(memory)); setWaiting(true); return; } if (key === 'MS') { setMemory(number); return; } if (key === 'M+') { setMemory(memory + number); return; }
    if (key === 'sqrt') { setDisplay(number < 0 ? 'Error' : String(Math.sqrt(number)).slice(0, 12)); setWaiting(true); return; }
    if (key === '%') { setDisplay(String(number / 100)); setWaiting(true); return; }
    if (key === '1/x') { setDisplay(number === 0 ? 'Error' : String(1 / number).slice(0, 12)); setWaiting(true); return; }
    if (key === '=') { if (!operator || stored === null) return; const result = calculate97(stored, operator, number); setDisplay(Number.isFinite(result) ? String(result).slice(0, 12) : 'Error'); setStored(null); setOperator(null); setWaiting(true); return; }
    if (operator && stored !== null && !waiting) { const result = calculate97(stored, operator, number); setStored(result); setDisplay(String(result)); } else setStored(number); setOperator(key); setWaiting(true);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => { const key = event.key === 'Enter' ? '=' : event.key === 'Escape' ? 'C' : event.key === '/' ? '÷' : event.key === '*' ? '×' : event.key; if (/^\d$/.test(key) || ['.', '+', '-', '÷', '×', '=', 'C', 'Back'].includes(key)) { event.preventDefault(); press(key); } };
  return <div className="win97-app win97-calculator" aria-label="Calculator" tabIndex={0} onKeyDown={handleKeyDown}><div className="win95-menubar"><button type="button">Edit</button><button type="button">View</button><button type="button">Help</button></div><div className="win97-display sunken" role="status" aria-live="polite">{display}</div><div className="win97-toolbar"><span>Standard</span><span className="win97-muted">Memory: {memory || 0}</span></div><div className="win97-calc-grid">{keyRows.flat().map((key, index) => key ? <Button95 key={`${key}-${index}`} size="sm" onClick={() => press(key)}>{key}</Button95> : <span key={`blank-${index}`} aria-hidden="true" />)}</div></div>;
}

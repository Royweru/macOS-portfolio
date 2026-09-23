'use client';

import { useEffect, useState } from 'react';
import Button95 from '../../components/win95/Button95';
import { countAdjacentMines97, generateMines97, MINESWEEPER_CELLS as cells, MINESWEEPER_MINE_COUNT as mineCount, MINESWEEPER_WIDTH as width } from './minesweeper-engine';

export default function Minesweeper97() {
  const [mines, setMines] = useState<Set<number>>(() => new Set());
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [flags, setFlags] = useState<Set<number>>(new Set());
  const [started, setStarted] = useState(false);
  const [lost, setLost] = useState(false);
  const [won, setWon] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const reset = () => { setMines(new Set()); setRevealed(new Set()); setFlags(new Set()); setLost(false); setWon(false); setStarted(false); setElapsed(0); };
  useEffect(() => { if (!started || lost || won) return undefined; const timer = window.setInterval(() => setElapsed(value => Math.min(999, value + 1)), 1000); return () => window.clearInterval(timer); }, [started, lost, won]);
  const reveal = (index: number) => {
    if (flags.has(index) || lost || won) return;
    const board = mines.size ? new Set(mines) : generateMines97(index);
    if (!mines.size) setMines(board);
    setStarted(true);
    if (board.has(index)) { setLost(true); setRevealed(new Set(board)); return; }
    const next = new Set(revealed); const pending = [index];
    while (pending.length) { const current = pending.pop()!; if (next.has(current) || board.has(current)) continue; next.add(current); if (countAdjacentMines97(current, board) === 0) { const row = Math.floor(current / width); const col = current % width; for (let y = row - 1; y <= row + 1; y += 1) for (let x = col - 1; x <= col + 1; x += 1) if (x >= 0 && x < width && y >= 0 && y < width) pending.push(y * width + x); } }
    setRevealed(next); if (next.size >= width * width - mineCount) setWon(true);
  };
  const flag = (event: React.MouseEvent, index: number) => { event.preventDefault(); if (revealed.has(index) || lost || won) return; setFlags(current => { const next = new Set(current); if (next.has(index)) next.delete(index); else if (next.size < mineCount) next.add(index); return next; }); };
  const face = lost ? 'X' : won ? '★' : started ? 'O' : '☺';
  return <div className="win97-app win97-minesweeper"><div className="win97-scoreboard"><span>{String(mineCount - flags.size).padStart(3, '0')}</span><Button95 size="sm" onClick={reset} aria-label="New game">{face}</Button95><span>{String(elapsed).padStart(3, '0')}</span></div><div className="win97-mine-grid" role="grid">{cells.map(index => { const count = countAdjacentMines97(index, mines); return <button type="button" role="gridcell" key={index} className={`win97-mine-cell ${revealed.has(index) ? 'revealed' : ''} ${count ? `mine-count-${count}` : ''} ${lost && mines.has(index) ? 'mine-hit' : ''}`} onClick={() => reveal(index)} onContextMenu={event => flag(event, index)} aria-label={revealed.has(index) ? (mines.has(index) ? 'Mine' : `${count || 'Empty'} nearby mines`) : flags.has(index) ? 'Flagged' : 'Hidden'}>{revealed.has(index) ? (mines.has(index) ? '*' : (count || '')) : flags.has(index) ? '⚑' : ''}</button>; })}</div><p className="win97-muted">{lost ? 'Game over — press the face to try again.' : won ? 'Congratulations! You cleared the field.' : 'Left-click to reveal. Right-click to flag.'}</p></div>;
}

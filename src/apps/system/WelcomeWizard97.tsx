'use client';

import { useState } from 'react';
import Button95 from '../../components/win95/Button95';

const PAGES = [
  ['Welcome to Weru 97', 'A living portfolio presented as a classic Windows desktop. Double-click icons, open folders, and explore the applications.'],
  ['How to explore', 'Use My Computer and My Documents to browse the virtual drive. Double-click files to open them in their period-correct application.'],
  ['Have fun', 'Try Start > Run, the MS-DOS Prompt, Minesweeper, and the hidden system surprises. You can always restart the boot sequence from Shut Down.'],
] as const;

export default function WelcomeWizard97({ onFinish }: { onFinish: () => void }) {
  const [page, setPage] = useState(0);
  const [showAgain, setShowAgain] = useState(false);
  const finish = () => { if (!showAgain) window.localStorage.setItem('weru97-visited', '1'); onFinish(); };
  return <div className="welcome97-backdrop"><section className="welcome97 raised" role="dialog" aria-modal="true" aria-labelledby="welcome97-title">
    <header className="welcome97-titlebar"><span id="welcome97-title">{PAGES[page][0]}</span></header>
    <div className="welcome97-body"><div className="boot97-welcome-icon">W</div><p>{PAGES[page][1]}</p></div>
    <label className="welcome97-checkbox"><input type="checkbox" checked={showAgain} onChange={(event) => setShowAgain(event.target.checked)} /> Show this wizard next time</label>
    <footer className="welcome97-actions"><Button95 size="sm" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>Back</Button95>{page < PAGES.length - 1 ? <Button95 size="sm" onClick={() => setPage((value) => value + 1)}>Next</Button95> : <Button95 size="sm" onClick={finish}>Finish</Button95>}</footer>
  </section></div>;
}


'use client';

import { useEffect } from 'react';

export default function BlueScreen97({ onRecover }: { onRecover: () => void }) {
  useEffect(() => {
    // The BSOD is opened by a key event from the terminal. Defer installing
    // the recovery listener so that the triggering Enter key cannot dismiss
    // the recovery screen in the same event turn.
    let active = true;
    let recover: (() => void) | undefined;
    const timer = window.setTimeout(() => {
      if (!active) return;
      recover = () => onRecover();
      window.addEventListener('keydown', recover, { once: true });
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timer);
      if (recover) window.removeEventListener('keydown', recover);
    };
  }, [onRecover]);
  return <div className="bsod97" role="alert" tabIndex={0}><strong>Weru 97</strong><p>An exception 0E has occurred at 0028:C004B0A3 in VxD WERU97(01) + 000010A3. This was called from 0028:C004AED5 in VxD PORTFOLIO(03) + 0000AED5.</p><p>* Press any key to attempt to continue.<br />* Press CTRL+ALT+DEL to restart your computer. You will lose any unsaved information in all applications.</p><p>Press any key to continue _</p></div>;
}

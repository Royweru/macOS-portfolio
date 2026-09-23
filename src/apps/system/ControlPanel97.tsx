'use client';

import Button95 from '../../components/win95/Button95';
import AppIcon from '../../components/AppIcon';
import { useOsStore } from '../../features/os/os-store';

export default function ControlPanel97({ onClose }: { onClose?: () => void }) {
  const settings = useOsStore(state => state.settings);
  const setSettings = useOsStore(state => state.setSettings);
  return <div className="win97-app win97-control-panel">
    <header className="win97-control-panel-header"><AppIcon appId="settings" size={32} /><div><b>Control Panel</b><span>Adjust the Weru 97 desktop for this browser profile.</span></div></header>
    <div className="win97-settings-grid">
      <button type="button" className="win97-control-tile" onClick={() => setSettings({ wallpaperId: settings.wallpaperId === 'bliss' ? 'clouds' : 'bliss' })}><AppIcon appId="paint" size={30} /><b>Display</b><small>Wallpaper: {settings.wallpaperId}</small></button>
      <button type="button" className="win97-control-tile" onClick={() => setSettings({ soundEnabled: !settings.soundEnabled })}><AppIcon appId="cd-player" size={30} /><b>Sounds</b><small>{settings.soundEnabled ? 'Enabled' : 'Muted'}</small></button>
      <button type="button" className="win97-control-tile" onClick={() => setSettings({ reducedMotion: !settings.reducedMotion })}><AppIcon appId="system-properties" size={30} /><b>Accessibility</b><small>{settings.reducedMotion ? 'Reduced motion' : 'Full motion'}</small></button>
      <button type="button" className="win97-control-tile" onClick={() => setSettings({ screensaverEnabled: !settings.screensaverEnabled })}><AppIcon appId="computer" size={30} /><b>Screen Saver</b><small>{settings.screensaverEnabled ? 'Enabled' : 'Disabled'}</small></button>
    </div>
    <div className="win97-dialog-actions"><Button95 size="sm" onClick={onClose}>Close</Button95></div>
  </div>;
}

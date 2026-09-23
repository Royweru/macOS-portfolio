'use client';

import { useState, type ReactNode } from 'react';
import {
  Accessibility,
  Bluetooth,
  Check,
  Focus,
  MonitorUp,
  Moon,
  Settings2,
  SunMedium,
  Volume2,
  Wifi,
} from 'lucide-react';

interface QuickSettingsProps {
  onClose: () => void;
}

interface ToggleProps {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}

function Toggle({ label, icon, active, onClick }: ToggleProps) {
  return (
    <button type="button" className={`quick-settings-toggle ${active ? 'active' : ''}`} onClick={onClick} aria-pressed={active}>
      <span className="quick-settings-toggle-icon">{icon}</span>
      <span className="quick-settings-toggle-label">{label}</span>
      {active && <Check size={13} aria-hidden="true" />}
    </button>
  );
}

export default function QuickSettings({ onClose }: QuickSettingsProps) {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [focus, setFocus] = useState(false);
  const [nightLight, setNightLight] = useState(false);
  const [brightness, setBrightness] = useState(78);
  const [volume, setVolume] = useState(64);

  return (
    <section className="quick-settings-flyout" role="dialog" aria-label="Quick settings">
      <div className="quick-settings-header">
        <div><strong>Quick settings</strong><span>Weru OS controls</span></div>
        <button type="button" className="quick-settings-settings" onClick={onClose} aria-label="Open settings" title="Settings"><Settings2 size={16} /></button>
      </div>
      <div className="quick-settings-grid">
        <Toggle label="Wi-Fi" icon={<Wifi size={17} />} active={wifi} onClick={() => setWifi(value => !value)} />
        <Toggle label="Bluetooth" icon={<Bluetooth size={17} />} active={bluetooth} onClick={() => setBluetooth(value => !value)} />
        <Toggle label="Focus" icon={<Focus size={17} />} active={focus} onClick={() => setFocus(value => !value)} />
        <Toggle label="Night light" icon={<Moon size={17} />} active={nightLight} onClick={() => setNightLight(value => !value)} />
      </div>
      <div className="quick-settings-slider-row">
        <SunMedium size={16} aria-hidden="true" />
        <input type="range" min="10" max="100" value={brightness} onChange={event => setBrightness(Number(event.target.value))} aria-label="Brightness" />
        <span>{brightness}%</span>
      </div>
      <div className="quick-settings-slider-row">
        <Volume2 size={16} aria-hidden="true" />
        <input type="range" min="0" max="100" value={volume} onChange={event => setVolume(Number(event.target.value))} aria-label="Volume" />
        <span>{volume}%</span>
      </div>
      <div className="quick-settings-secondary">
        <button type="button" onClick={() => setBluetooth(value => !value)}><MonitorUp size={15} /> Display</button>
        <button type="button" onClick={onClose}><Accessibility size={15} /> Accessibility</button>
      </div>
      <div className="quick-settings-footer"><span>{wifi ? 'Connected' : 'Offline'} · {bluetooth ? 'Bluetooth on' : 'Bluetooth off'}</span><button type="button" onClick={onClose}>All settings</button></div>
    </section>
  );
}

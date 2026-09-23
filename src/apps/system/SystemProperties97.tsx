'use client';

import { useState, type KeyboardEvent as KeyboardEvent97 } from 'react';
import Button95 from '../../components/win95/Button95';
import { getAdjacentPropertyTab97, PROPERTY_TABS97, type PropertyTab97 } from './system-properties-tabs97';

function SystemComputerArt97() {
  return <svg viewBox="0 0 64 64" role="img" aria-label="Weru workstation" shapeRendering="crispEdges">
    <rect x="8" y="6" width="36" height="28" fill="#c0c0c0" stroke="#404040" strokeWidth="2" />
    <rect x="12" y="9" width="28" height="20" fill="#000" />
    <rect x="14" y="11" width="24" height="16" fill="#008080" />
    <path d="M18 15 23 14 23 18 18 19Z" fill="#ef4444" />
    <path d="m24 13.8 7-1 0 4.7-7 .5Z" fill="#22c55e" />
    <path d="m18 20 5-1 0 4-5 1Z" fill="#3b82f6" />
    <path d="m24 19 7-.5v5l-7 .5Z" fill="#facc15" />
    <path d="M22 34h8l2 4H20Z" fill="#808080" stroke="#404040" strokeWidth="1.5" />
    <rect x="16" y="38" width="20" height="3" fill="#c0c0c0" stroke="#404040" strokeWidth="1.5" />
    <rect x="46" y="12" width="14" height="42" fill="#c0c0c0" stroke="#404040" strokeWidth="2" />
    <rect x="48" y="16" width="10" height="2" fill="#404040" />
    <rect x="48" y="22" width="10" height="4" fill="#808080" stroke="#404040" />
    <circle cx="56" cy="24" r="1" fill="#22c55e" />
    <rect x="52" y="32" width="3" height="3" fill="#404040" />
  </svg>;
}

function ResourceMeter97({ label, value, cells }: { label: string; value: number; cells: number }) {
  return <div className="win97-resource-row">
    <div className="win97-resource-label"><b>{label}</b><span>{value}% Free</span></div>
    <div className="win97-resource-meter" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      {Array.from({ length: cells }, (_, index) => <i key={index} className="win97-resource-cell" aria-hidden="true" />)}
    </div>
  </div>;
}

export default function SystemProperties97({ onClose }: { onClose?: () => void }) {
  const [tab, setTab] = useState<PropertyTab97>('general');
  const handleTabKeyDown = (event: KeyboardEvent97<HTMLButtonElement>, current: PropertyTab97) => {
    const next = getAdjacentPropertyTab97(current, event.key);
    if (!next) return;
    event.preventDefault();
    setTab(next);
    document.getElementById(`system-properties-tab-${next}`)?.focus();
  };

  return <div className="win97-app win97-system-properties-app">
    <div className="win97-system-properties">
      <div className="win97-property-tabs" role="tablist" aria-label="System Properties tabs">
        {PROPERTY_TABS97.map(([id, label]) => <button key={id} id={`system-properties-tab-${id}`} type="button" role="tab" aria-controls="system-properties-panel" aria-selected={tab === id} tabIndex={tab === id ? 0 : -1} className={`win97-property-tab${tab === id ? ' active' : ''}`} onClick={() => setTab(id)} onKeyDown={(event) => handleTabKeyDown(event, id)}>{label}</button>)}
      </div>

      {tab === 'general' && <section id="system-properties-panel" className="win97-property-panel win97-property-panel-general" role="tabpanel" tabIndex={0} aria-labelledby={`system-properties-tab-${tab}`}>
        <div className="win97-property-overview">
          <div className="win97-property-computer"><SystemComputerArt97 /></div>
          <div className="win97-property-copy">
            <section><b>System:</b><div className="win97-property-indent"><p>Weru 97</p><p className="win97-release">4.10.1997 Release C</p></div></section>
            <section><b>Registered to:</b><div className="win97-property-indent"><p className="win97-owner">Alex Weru</p><p>Lead Portfolio Architect</p><p className="win97-hardware-text">Workstation ID: 9742-OEM-0021481</p></div></section>
            <section><b>Computer:</b><div className="win97-property-indent win97-hardware-text"><p>GenuineIntel Pentium(r) II Processor</p><p>233 MHz</p><p>64.0 MB RAM</p></div></section>
          </div>
        </div>
        <fieldset className="win97-resource-group"><legend>System Performance Status</legend><div className="win97-resource-gauges"><ResourceMeter97 label="System Resources" value={84} cells={21} /><ResourceMeter97 label="User Interface Heap" value={72} cells={18} /></div></fieldset>
      </section>}

      {tab === 'device' && <section id="system-properties-panel" className="win97-property-panel" role="tabpanel" tabIndex={0} aria-labelledby={`system-properties-tab-${tab}`}><h2>Device Manager</h2><div className="sunken win97-device-tree" role="list"><div>⊞ Computer</div><div>⊟ Display adapters</div><div className="indent">▣ Weru 97 Pixel Display</div><div>⊟ Sound, video and game controllers</div><div className="indent">♫ Weru 97 Wave Device</div><div>⊟ System devices</div><div className="indent">▣ Browser Hardware Abstraction Layer</div></div></section>}

      {tab === 'hardware' && <section id="system-properties-panel" className="win97-property-panel" role="tabpanel" tabIndex={0} aria-labelledby={`system-properties-tab-${tab}`}><h2>Hardware Profiles</h2><p>Select a hardware profile for this Weru 97 session.</p><label className="win97-profile-option"><input type="radio" name="profile" defaultChecked /> Original Weru Workstation</label><label className="win97-profile-option"><input type="radio" name="profile" /> Safe display mode</label><div className="sunken win97-profile-details"><b>Current profile</b><span>All standard portfolio devices are available.</span></div></section>}

      {tab === 'performance' && <section id="system-properties-panel" className="win97-property-panel" role="tabpanel" tabIndex={0} aria-labelledby={`system-properties-tab-${tab}`}><h2>Performance</h2><p>Resource gauges for the current browser session.</p><div className="win97-resource-gauges win97-resource-gauges-large"><div><span>System Resources: 84% Free</span><i><b style={{ width: '84%' }} /></i></div><div><span>User Interface Heap: 72% Free</span><i><b style={{ width: '72%' }} /></i></div><div><span>Virtual filesystem: Ready</span><i><b style={{ width: '100%' }} /></i></div></div><p className="win97-muted">Performance is simulated safely inside the browser sandbox.</p></section>}
    </div>
    <div className="win97-dialog-actions"><Button95 size="sm" onClick={onClose}>OK</Button95><Button95 size="sm" onClick={onClose}>Cancel</Button95></div>
  </div>;
}

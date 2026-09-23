'use client';

import { useOsStore } from '../features/os/os-store';
import { Check, MonitorCog, Moon, Palette, RotateCcw, Sun } from 'lucide-react';
import { resetFilesystem } from '../features/filesystem/filesystem-service';
import { getBrowserProfileId } from '../features/os/profile-storage';

const wallpapers = [
  { id: 'bloom-light', label: 'Bloom light' },
  { id: 'bloom-dark', label: 'Bloom dark' },
];

export default function SettingsContent() {
  const settings = useOsStore(state => state.settings);
  const setSettings = useOsStore(state => state.setSettings);
  const reset = async () => {
    await resetFilesystem();
    window.localStorage.removeItem(`weru-os-state-${getBrowserProfileId()}`);
    window.location.reload();
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f7f8fa] text-slate-900">
      <header className="border-b border-slate-200 bg-white px-5 py-4"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0067c0]">Weru OS</p><h2 className="mt-1 text-xl font-semibold">Settings</h2><p className="mt-1 text-sm text-slate-500">Personalize this browser-local desktop.</p></header>
      <div className="min-h-0 flex-1 overflow-auto p-5">
        <section className="border border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3"><Palette size={18} className="text-[#0067c0]" /><div><h3 className="font-medium">Personalization</h3><p className="text-xs text-slate-500">Changes are saved to this browser profile.</p></div></div>
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <label className="text-sm">Theme<select value={settings.themeId} onChange={event => setSettings({ themeId: event.target.value })} className="mt-1 block w-full border border-slate-300 bg-white px-3 py-2 text-sm"><option value="bloom-light">Light</option><option value="bloom-dark">Dark</option></select></label>
            <label className="text-sm">Wallpaper<select value={settings.wallpaperId} onChange={event => setSettings({ wallpaperId: event.target.value })} className="mt-1 block w-full border border-slate-300 bg-white px-3 py-2 text-sm">{wallpapers.map(wallpaper => <option key={wallpaper.id} value={wallpaper.id}>{wallpaper.label}</option>)}</select></label>
          </div>
          <div className="divide-y divide-slate-100 border-t border-slate-200">
            <button type="button" onClick={() => setSettings({ reducedMotion: !settings.reducedMotion })} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50"><span className="flex items-center gap-3"><Moon size={17} /><span><strong className="block text-sm">Reduced motion</strong><small className="text-xs text-slate-500">Reduce window and shell animation.</small></span></span>{settings.reducedMotion && <Check size={17} className="text-[#0067c0]" />}</button>
            <button type="button" onClick={() => setSettings({ taskbarAlignment: settings.taskbarAlignment === 'center' ? 'left' : 'center' })} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50"><span className="flex items-center gap-3"><MonitorCog size={17} /><span><strong className="block text-sm">Taskbar alignment</strong><small className="text-xs text-slate-500">Current: {settings.taskbarAlignment}</small></span></span></button>
            <button type="button" onClick={() => setSettings({ startupSequenceEnabled: !settings.startupSequenceEnabled })} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50"><span className="flex items-center gap-3"><Sun size={17} /><span><strong className="block text-sm">Startup sequence</strong><small className="text-xs text-slate-500">Show the Weru OS boot experience.</small></span></span>{settings.startupSequenceEnabled && <Check size={17} className="text-[#0067c0]" />}</button>
          </div>
        </section>
        <section className="mt-4 border border-red-200 bg-white p-4"><div className="flex items-start gap-3"><RotateCcw size={18} className="mt-0.5 text-red-700" /><div><h3 className="font-medium">Reset Weru OS</h3><p className="mt-1 text-xs text-slate-500">Clears this browser profile's virtual files, settings, and layout.</p><button type="button" onClick={() => void reset()} className="mt-3 border border-red-300 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50">Reset profile</button></div></div></section>
      </div>
    </div>
  );
}

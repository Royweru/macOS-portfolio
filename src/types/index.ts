// ─── types/index.ts ───────────────────────────────────────────────────────────
// All shared TypeScript interfaces and types used across the app.
// Import from here — never redeclare inline in components.
// ─────────────────────────────────────────────────────────────────────────────

export type WindowId = 'about' | 'projects' | 'project-detail' | 'media-player' | 'experience' | 'skills' | 'contact' | 'explorer' | 'recycle-bin' | 'terminal' | 'notepad' | 'settings' | 'photos' | 'mail' | 'ie4' | 'paint' | 'cd-player' | 'cd-equalizer' | 'calculator' | 'minesweeper' | 'msdos' | 'system-properties' | 'control-panel' | 'run' | 'find' | 'shutdown' | 'system-warning';
// ── Window config ─────────────────────────────────────────────────────────────
export interface WindowConfig {
  title: string;
  icon: string;
  w: number;
  h: number;
  ox?: number;   // x offset from center
  oy?: number;   // y offset from center
  centered?: boolean;
  verticalBias?: number;
  /** Source-defined window controls; omitted means enabled by the shared shell. */
  canMinimize?: boolean;
  canMaximize?: boolean;
  showMaximize?: boolean;
}

// ── Project ───────────────────────────────────────────────────────────────────
export interface Project {
  id: number;
  title: string;
  description: string;
  tag: string;
  color: string;
  accent: string;
  icon: string;
  github: string | null;
  live: string | null;
  tech: string[];
}

// ── Skill ─────────────────────────────────────────────────────────────────────
export interface Skill {
  name: string;
  color: string;
  proof: string;
}

export interface SkillGroup {
  category: string;
  icon: string;
  skills: Skill[];
}

// ── Job ───────────────────────────────────────────────────────────────────────
export interface Job {
  company: string;
  role: string;
  period: string;
  location: string;
  color: string;
  icon: string;
  bullets: string[];
  current?: boolean;
}

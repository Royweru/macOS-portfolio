// ─── types/index.ts ───────────────────────────────────────────────────────────
// All shared TypeScript interfaces and types used across the app.
// Import from here — never redeclare inline in components.
// ─────────────────────────────────────────────────────────────────────────────

export type WindowId = 'about' | 'projects' | 'experience' | 'skills' | 'contact';
export type ViewMode  = 'grid' | 'list';
export type TagFilter = 'main' | 'recent' | 'starred' | 'design' | 'dev' | 'ai' | 'archived';

// ── Window config ─────────────────────────────────────────────────────────────
export interface WindowConfig {
  title: string;
  icon: string;
  w: number;
  h: number;
  ox?: number;   // x offset from center
  oy?: number;   // y offset from center
  hasSidebar?: boolean;
  hasViewControls?: boolean;
}

// ── Window manager state ──────────────────────────────────────────────────────
export interface WindowState {
  openWindows:  WindowId[];
  minimized:    WindowId[];
  focused:      WindowId | null;
  sections:     Partial<Record<WindowId, TagFilter>>;
  views:        Partial<Record<WindowId, ViewMode>>;
}

// ── Dock item ─────────────────────────────────────────────────────────────────
export interface DockItem {
  id: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  isDivider?: boolean;
  external?: string;
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

// ── Sidebar item ──────────────────────────────────────────────────────────────
export interface SidebarFavorite {
  id: string;
  label: string;
  icon: string;
}

export interface SidebarTag {
  id: string;
  label: string;
  color: string;
}

// ── Menu bar ───────────────────────────────────────────────────────────────
export type MenuActionType = 'openWindow' | 'externalLink' | 'command' | 'none';

export interface MenuAction {
  type: MenuActionType;
  target?: string;
}

export interface MenuEntry {
  id: string;
  label: string;
  enabled: boolean;
  shortcut?: string;
  action: MenuAction;
  disabledReason?: string;
}

// ─── constants/index.ts ───────────────────────────────────────────────────────
// Single source of truth for window configs, dock items, sidebar items,
// menu bar menus, and skill/experience data.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  WindowConfig,
  WindowId,
  SkillGroup,
  Job,
  SidebarFavorite,
  SidebarTag,
  MenuEntry,
} from '../types';

// ── Window registry ───────────────────────────────────────────────────────────
export const WINDOW_CONFIGS: Record<WindowId, WindowConfig> = {
  about:      { title: 'About Me',   icon: '👤', w: 700,  h: 500,  hasSidebar: false, hasViewControls: false },
  projects:   { title: 'Projects',   icon: '📁', w: 880,  h: 580,  ox: 60,  oy: 30,  hasSidebar: true,  hasViewControls: true  },
  experience: { title: 'Experience', icon: '💼', w: 740,  h: 540,  ox: 30,  oy: 40,  hasSidebar: true,  hasViewControls: false },
  skills:     { title: 'Skills',     icon: '🛠️', w: 720,  h: 520,  ox: 90,  oy: 50,  hasSidebar: true,  hasViewControls: false },
  contact:    { title: 'Contact',    icon: '✉️', w: 640,  h: 480,  ox: 50,  oy: 60,  hasSidebar: false, hasViewControls: false },
};

// ── Menu bar dropdown content ─────────────────────────────────────────────────
export const MENU_BAR_ITEMS: Record<string, MenuEntry[]> = {
  '': [
    { id: 'apple-about', label: 'About This Portfolio', enabled: true, action: { type: 'openWindow', target: 'about' } },
    { id: 'apple-system-preferences', label: 'System Preferences…', enabled: false, action: { type: 'none' }, disabledReason: 'Demo only' },
    { id: 'apple-app-store', label: 'App Store…', enabled: false, action: { type: 'none' }, disabledReason: 'Demo only' },
    { id: 'apple-sleep', label: 'Sleep', enabled: false, action: { type: 'none' }, disabledReason: 'Demo only' },
    { id: 'apple-restart', label: 'Restart…', enabled: false, action: { type: 'none' }, disabledReason: 'Demo only' },
    { id: 'apple-shutdown', label: 'Shut Down…', enabled: false, action: { type: 'none' }, disabledReason: 'Demo only' },
  ],
  File: [
    { id: 'file-new-window', label: 'New Window', enabled: true, shortcut: '⌘N', action: { type: 'openWindow', target: 'projects' } },
    { id: 'file-new-tab', label: 'New Tab', enabled: false, shortcut: '⌘T', action: { type: 'none' }, disabledReason: 'Not implemented' },
    { id: 'file-close-window', label: 'Close Window', enabled: true, shortcut: '⌘W', action: { type: 'command', target: 'close-focused' } },
    { id: 'file-get-info', label: 'Get Info', enabled: true, shortcut: '⌘I', action: { type: 'openWindow', target: 'about' } },
    { id: 'file-print', label: 'Print…', enabled: false, shortcut: '⌘P', action: { type: 'none' }, disabledReason: 'Demo only' },
  ],
  Edit: [
    { id: 'edit-undo', label: 'Undo', enabled: false, shortcut: '⌘Z', action: { type: 'none' }, disabledReason: 'Context dependent' },
    { id: 'edit-redo', label: 'Redo', enabled: false, shortcut: '⇧⌘Z', action: { type: 'none' }, disabledReason: 'Context dependent' },
    { id: 'edit-cut', label: 'Cut', enabled: false, shortcut: '⌘X', action: { type: 'none' }, disabledReason: 'Context dependent' },
    { id: 'edit-copy', label: 'Copy', enabled: false, shortcut: '⌘C', action: { type: 'none' }, disabledReason: 'Context dependent' },
    { id: 'edit-paste', label: 'Paste', enabled: false, shortcut: '⌘V', action: { type: 'none' }, disabledReason: 'Context dependent' },
    { id: 'edit-select-all', label: 'Select All', enabled: false, shortcut: '⌘A', action: { type: 'none' }, disabledReason: 'Context dependent' },
    { id: 'edit-find', label: 'Find…', enabled: false, shortcut: '⌘F', action: { type: 'none' }, disabledReason: 'Phase 6' },
  ],
  View: [
    { id: 'view-icons', label: 'as Icons', enabled: false, action: { type: 'command', target: 'view-grid' }, disabledReason: 'Phase 4' },
    { id: 'view-list', label: 'as List', enabled: false, action: { type: 'command', target: 'view-list' }, disabledReason: 'Phase 4' },
    { id: 'view-columns', label: 'as Columns', enabled: false, action: { type: 'none' }, disabledReason: 'Not used' },
    { id: 'view-toolbar', label: 'Show Toolbar', enabled: false, shortcut: '⌥⌘T', action: { type: 'none' }, disabledReason: 'Not implemented' },
    { id: 'view-sidebar', label: 'Show Sidebar', enabled: false, shortcut: '⌥⌘S', action: { type: 'none' }, disabledReason: 'Not implemented' },
    { id: 'view-statusbar', label: 'Show Status Bar', enabled: false, action: { type: 'none' }, disabledReason: 'Not implemented' },
  ],
  Window: [
    { id: 'window-minimize', label: 'Minimize', enabled: true, shortcut: '⌘M', action: { type: 'command', target: 'minimize-focused' } },
    { id: 'window-zoom', label: 'Zoom', enabled: false, action: { type: 'command', target: 'zoom-focused' }, disabledReason: 'Not implemented' },
    { id: 'window-bring-front', label: 'Bring All to Front', enabled: true, action: { type: 'command', target: 'bring-front' } },
    { id: 'window-portfolio', label: 'Portfolio', enabled: true, action: { type: 'openWindow', target: 'projects' } },
  ],
  Help: [
    { id: 'help-search', label: 'Search', enabled: true, shortcut: '⌘Space', action: { type: 'command', target: 'open-spotlight' } },
    { id: 'help-view-github', label: 'View GitHub', enabled: true, action: { type: 'externalLink', target: 'https://github.com/Royweru' } },
    { id: 'help-view-linkedin', label: 'View LinkedIn', enabled: true, action: { type: 'externalLink', target: 'https://www.linkedin.com/in/roy-matheri-59b8a5245' } },
    { id: 'help-portfolio-help', label: 'Portfolio Help', enabled: true, action: { type: 'openWindow', target: 'about' } },
    { id: 'help-send-feedback', label: 'Send Feedback…', enabled: true, action: { type: 'openWindow', target: 'contact' } },
    { id: 'help-about', label: 'About', enabled: true, action: { type: 'openWindow', target: 'about' } },
  ],
};

export const MENU_BAR_SEPARATORS: Record<string, string[]> = {
  '': ['apple-about', 'apple-app-store'],
  File: ['file-new-tab', 'file-close-window', 'file-get-info'],
  Edit: ['edit-redo', 'edit-paste'],
  View: ['view-columns', 'view-sidebar'],
  Window: ['window-zoom', 'window-bring-front'],
  Help: ['help-search', 'help-view-linkedin', 'help-send-feedback'],
};

export const MENU_BAR_MENUS: Record<string, string[]> = Object.fromEntries(
  Object.entries(MENU_BAR_ITEMS).map(([menu, items]) => {
    const separators = new Set(MENU_BAR_SEPARATORS[menu] ?? []);
    const rows: string[] = [];

    items.forEach((item) => {
      rows.push(item.label);
      if (separators.has(item.id)) rows.push('—');
    });

    return [menu, rows];
  })
);

// ── Desktop folder icons ──────────────────────────────────────────────────────
export const DESKTOP_ITEMS = [
  { id: 'projects'   as WindowId, label: 'Projects',   color: '#1A73E8' },
  { id: 'skills'     as WindowId, label: 'Skills',     color: '#2E7D32' },
  { id: 'experience' as WindowId, label: 'Experience', color: '#E65100' },
];

// ── Sidebar favorites (per window) ────────────────────────────────────────────
export const SIDEBAR_FAVORITES: SidebarFavorite[] = [
  { id: 'main',    label: 'All',     icon: '📁' },
  { id: 'recent',  label: 'Recent',  icon: '🕐' },
  { id: 'starred', label: 'Starred', icon: '⭐' },
];

export const SIDEBAR_TAGS: SidebarTag[] = [
  { id: 'design',   label: 'Design',      color: '#0066cc' },
  { id: 'dev',      label: 'Development',  color: '#c0560a' },
  { id: 'ai',       label: 'AI',           color: '#7c3aed' },
  { id: 'archived', label: 'Archived',     color: '#888888' },
];

// ── Desktop context menu items ────────────────────────────────────────────────
export const DESKTOP_CONTEXT_ITEMS = [
  'New Folder',
  'New Folder with Selection',
  '—',
  'Get Info',
  'Change Desktop Background…',
  '—',
  'Use Stacks',
  'Sort By',
  'Clean Up',
  '—',
  'Import from iPhone…',
];

// ── Skills data ───────────────────────────────────────────────────────────────
export const SKILLS: SkillGroup[] = [
  {
    category: 'AI & Agents', icon: '🤖',
    skills: [
      { name: 'LangGraph / LangChain', color: '#7C3AED', proof: 'Shipped in client workflows' },
      { name: 'Claude / OpenAI APIs',  color: '#D97706', proof: 'Used across production features' },
      { name: 'RAG & Embeddings',      color: '#9333EA', proof: 'Applied in document Q&A systems' },
      { name: 'Prompt Engineering',    color: '#6D28D9', proof: 'Used for agent task reliability' },
    ],
  },
  {
    category: 'Frontend', icon: '🎨',
    skills: [
      { name: 'React / Next.js', color: '#0ea5e9', proof: 'Core stack for shipped web apps' },
      { name: 'TypeScript',      color: '#3178C6', proof: 'Default language for frontend work' },
      { name: 'Tailwind CSS',    color: '#06B6D4', proof: 'Used in production UI systems' },
      { name: 'Framer Motion',   color: '#FF0055', proof: 'Applied to interaction-heavy UIs' },
    ],
  },
  {
    category: 'Backend', icon: '⚙️',
    skills: [
      { name: 'Python / FastAPI', color: '#3776AB', proof: 'Backbone for API and agent services' },
      { name: 'Node.js',          color: '#339933', proof: 'Used for integrations and APIs' },
      { name: 'PostgreSQL',       color: '#336791', proof: 'Primary datastore in live projects' },
      { name: 'Docker',           color: '#2496ED', proof: 'Used for consistent deployments' },
    ],
  },
  {
    category: 'Tools & Workflow', icon: '🛠️',
    skills: [
      { name: 'Git / GitHub', color: '#F05032', proof: 'Daily workflow and collaboration tool' },
      { name: 'Supabase',     color: '#3ECF8E', proof: 'Used in rapid product delivery' },
      { name: 'Figma',        color: '#F24E1E', proof: 'Used for handoff and UI planning' },
      { name: 'VS Code',      color: '#007ACC', proof: 'Primary development environment' },
    ],
  },
];

// ── Experience data ───────────────────────────────────────────────────────────
export const JOBS: Job[] = [
  {
    company: 'Freelance / Independent',
    role: 'Automation Systems Developer',
    period: '2023 — Present',
    location: 'Nairobi, Kenya (Remote)',
    color: '#7C3AED',
    icon: '🤖',
    current: true,
    bullets: [
      'Designed and shipped multi-agent systems using LangGraph, Claude API, and FastAPI for clients across fintech and logistics.',
      'Built RAG pipelines with Pinecone + Claude, enabling conversational document querying at scale.',
      'Delivered end-to-end web products with React + Next.js frontends and Python backends.',
    ],
  },
  {
    company: 'Tech Startup (NDA)',
    role: 'Full-Stack Engineer',
    period: '2021 — 2023',
    location: 'Nairobi, Kenya',
    color: '#0066CC',
    icon: '🚀',
    bullets: [
      'Led frontend rebuild of core product using Next.js and TypeScript, reducing load time by 40%.',
      'Integrated third-party APIs (payments, notifications, mapping) and owned the backend with Node.js + PostgreSQL.',
      'Collaborated cross-functionally with design and product to ship 4 major feature releases.',
    ],
  },
  {
    company: 'Agency',
    role: 'Junior Software Developer',
    period: '2019 — 2021',
    location: 'Nairobi, Kenya',
    color: '#059669',
    icon: '💻',
    bullets: [
      'Built responsive web apps for 10+ clients using React, WordPress, and vanilla JS.',
      'Handled deployments, performance optimisation, and post-launch maintenance.',
      'First exposure to API design and database modelling — sparked a deep interest in backend systems.',
    ],
  },
];

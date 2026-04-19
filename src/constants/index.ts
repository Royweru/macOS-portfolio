// ─── constants/index.ts ───────────────────────────────────────────────────────
// Single source of truth for window configs, dock items, sidebar items,
// menu bar menus, and skill/experience data.
// ─────────────────────────────────────────────────────────────────────────────

import type { WindowConfig, WindowId, SkillGroup, Job, SidebarFavorite, SidebarTag } from '../types';

// ── Window registry ───────────────────────────────────────────────────────────
export const WINDOW_CONFIGS: Record<WindowId, WindowConfig> = {
  about:      { title: 'About Me',   icon: '👤', w: 700,  h: 500,  hasSidebar: false, hasViewControls: false },
  projects:   { title: 'Projects',   icon: '📁', w: 880,  h: 580,  ox: 60,  oy: 30,  hasSidebar: true,  hasViewControls: true  },
  experience: { title: 'Experience', icon: '💼', w: 740,  h: 540,  ox: 30,  oy: 40,  hasSidebar: true,  hasViewControls: false },
  skills:     { title: 'Skills',     icon: '🛠️', w: 720,  h: 520,  ox: 90,  oy: 50,  hasSidebar: true,  hasViewControls: false },
  contact:    { title: 'Contact',    icon: '✉️', w: 640,  h: 480,  ox: 50,  oy: 60,  hasSidebar: false, hasViewControls: false },
};

// ── Menu bar dropdown content ─────────────────────────────────────────────────
export const MENU_BAR_MENUS: Record<string, string[]> = {
  '':       ['About This Portfolio', '—', 'System Preferences…', 'App Store…', '—', 'Sleep', 'Restart…', 'Shut Down…'],
  File:     ['New Window', 'New Tab', '—', 'Close Window', '—', 'Get Info', '—', 'Print…'],
  Edit:     ['Undo', 'Redo', '—', 'Cut', 'Copy', 'Paste', '—', 'Select All', 'Find…'],
  View:     ['as Icons', 'as List', 'as Columns', '—', 'Show Toolbar', 'Show Sidebar', '—', 'Show Status Bar'],
  Window:   ['Minimize', 'Zoom', '—', 'Bring All to Front', '—', 'Portfolio'],
  Help:     ['Search', '—', 'Portfolio Help', 'Send Feedback…', '—', 'About'],
};

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
      { name: 'LangGraph / LangChain', level: 92, color: '#7C3AED' },
      { name: 'Claude / OpenAI APIs',  level: 95, color: '#D97706' },
      { name: 'RAG & Embeddings',      level: 88, color: '#9333EA' },
      { name: 'Prompt Engineering',    level: 90, color: '#6D28D9' },
    ],
  },
  {
    category: 'Frontend', icon: '🎨',
    skills: [
      { name: 'React / Next.js', level: 93, color: '#0ea5e9' },
      { name: 'TypeScript',      level: 88, color: '#3178C6' },
      { name: 'Tailwind CSS',    level: 91, color: '#06B6D4' },
      { name: 'Framer Motion',   level: 80, color: '#FF0055' },
    ],
  },
  {
    category: 'Backend', icon: '⚙️',
    skills: [
      { name: 'Python / FastAPI', level: 91, color: '#3776AB' },
      { name: 'Node.js',          level: 85, color: '#339933' },
      { name: 'PostgreSQL',       level: 84, color: '#336791' },
      { name: 'Docker',           level: 78, color: '#2496ED' },
    ],
  },
  {
    category: 'Tools & Workflow', icon: '🛠️',
    skills: [
      { name: 'Git / GitHub', level: 94, color: '#F05032' },
      { name: 'Supabase',     level: 86, color: '#3ECF8E' },
      { name: 'Figma',        level: 75, color: '#F24E1E' },
      { name: 'VS Code',      level: 96, color: '#007ACC' },
    ],
  },
];

// ── Experience data ───────────────────────────────────────────────────────────
export const JOBS: Job[] = [
  {
    company: 'Freelance / Independent',
    role: 'AI Agentic Developer',
    period: '2023 — Present',
    location: 'Nairobi, Kenya (Remote)',
    color: '#7C3AED',
    icon: '🤖',
    current: true,
    bullets: [
      'Designed and shipped multi-agent systems using LangGraph, Claude API, and FastAPI for clients across fintech and logistics.',
      'Built RAG pipelines with Pinecone + Claude, enabling conversational document querying at scale.',
      'Delivered end-to-end AI-powered web apps with React + Next.js frontends and Python backends.',
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

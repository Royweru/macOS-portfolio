// ─── constants/index.ts ───────────────────────────────────────────────────────
// Default logical window geometry plus canonical portfolio data exports.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  WindowConfig,
  WindowId,
  SkillGroup,
  Job,
} from '../types';
import { MEDIA_PLAYER_STITCH_WINDOW_SIZE97 } from '../apps/media-player/media-player-geometry97';

// ── Window registry ───────────────────────────────────────────────────────────
export const WINDOW_CONFIGS: Record<WindowId, WindowConfig> = {
  about:      { title: 'About Me', icon: '👤', w: 700, h: 500 },
  projects:   { title: 'Projects', icon: '📁', w: 980, h: 640, ox: 20, oy: 18 },
  'project-detail': { title: 'Project details', icon: '📄', w: 900, h: 620, ox: 40, oy: 30 },
  'media-player': { title: 'Weru Media Player 6.4', icon: '▶', w: MEDIA_PLAYER_STITCH_WINDOW_SIZE97.width, h: MEDIA_PLAYER_STITCH_WINDOW_SIZE97.height },
  experience: { title: 'Experience', icon: '💼', w: 740, h: 540, ox: 30, oy: 40 },
  skills:     { title: 'Skills', icon: '🛠️', w: 720, h: 520, ox: 90, oy: 50 },
  contact:    { title: 'Contact', icon: '✉️', w: 640, h: 480, ox: 50, oy: 60 },
  explorer:   { title: 'File Explorer', icon: '📂', w: 620, h: 430 },
  'recycle-bin': { title: 'Recycle Bin', icon: '🗑️', w: 760, h: 520, ox: 30, oy: 20 },
  terminal:   { title: 'Terminal', icon: '▣', w: 760, h: 500, oy: 20 },
  notepad:    { title: 'Notepad', icon: '📝', w: 580, h: 450, ox: 20, oy: 20 },
  settings:   { title: 'Settings', icon: '⚙', w: 820, h: 580 },
  photos:     { title: 'Photos', icon: '▧', w: 820, h: 560, ox: 20, oy: 20 },
  mail:       { title: 'Outlook Express - New Message', icon: 'mail', w: 680, h: 520, ox: 20, oy: 30 },
  ie4:        { title: 'case-study.url - Internet Explorer', icon: '🌐', w: 940, h: 680 },
  paint:      { title: 'Paint', icon: '🎨', w: 840, h: 478, ox: 20, oy: 20 },
  'cd-player': { title: 'CD Player', icon: 'cd-player', w: 540, h: 420, ox: 24, oy: 40 },
  'cd-equalizer': { title: 'Now Playing - Graphic Equalizer', icon: 'cd-equalizer', w: 390, h: 360, ox: 580, oy: 40 },
  calculator: { title: 'Calculator', icon: '🧮', w: 278, h: 265, ox: -279, oy: -114 },
  minesweeper: { title: 'Minesweeper', icon: '💣', w: 242, h: 276, ox: -35, oy: -102 },
  msdos:      { title: 'MS-DOS Prompt', icon: '▣', w: 720, h: 460, oy: 20 },
  'system-properties': { title: 'About Me — System Properties', icon: '▣', w: 460, h: 420, centered: true, verticalBias: -21, canMinimize: false, canMaximize: false, showMaximize: false },
  'control-panel': { title: 'Control Panel', icon: '⚙', w: 640, h: 480, ox: 40, oy: 30 },
  run:        { title: 'Run', icon: '▶', w: 430, h: 230, ox: 80, oy: 80 },
  find:       { title: 'Find: All Files', icon: '🔎', w: 680, h: 460, ox: 50, oy: 50 },
  shutdown:   { title: 'Shut Down Weru 97', icon: '⏻', w: 320, h: 196, ox: 56, oy: 64 },
  'system-warning': { title: 'System Warning', icon: '▣', w: 340, h: 180, ox: 120, oy: 100 },
};

// ── Skills data ───────────────────────────────────────────────────────────────
const LEGACY_SKILLS: SkillGroup[] = [
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
const LEGACY_JOBS: Job[] = [
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

void LEGACY_SKILLS;
void LEGACY_JOBS;

// Compatibility exports for legacy content surfaces. The canonical portfolio
// data now lives in the Weru 97 manifest.
export { SKILLS, JOBS } from '../data/portfolio-manifest';

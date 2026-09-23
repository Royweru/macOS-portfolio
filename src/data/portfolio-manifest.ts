import type { Job, SkillGroup } from '../types';

export interface ProjectMediaDemo {
  src: string;
  mimeType?: string;
  poster?: string;
  title?: string;
  durationSeconds?: number;
}

export interface ProjectMediaAudio {
  src: string;
  title: string;
  artist?: string;
  duration?: number;
}

export interface ProjectTechStack {
  language?: string;
  framework?: string;
  database?: string;
  hosting?: string;
  other?: string[];
}

export interface ProjectFiles {
  demo?: ProjectMediaDemo;
  screenshots?: string[];
  audio?: ProjectMediaAudio;
  liveSite?: string;
  sourceCode?: string;
}

export interface ProjectDefinition {
  id: string;
  legacyId?: number;
  folderName: string;
  title: string;
  description: string;
  tag?: 'AI' | 'Dev' | 'Design' | string;
  color?: string;
  accent?: string;
  icon?: string;
  github?: string | null;
  live?: string | null;
  readme?: string;
  skillsUsed?: string[];
  techStack?: ProjectTechStack;
  files?: ProjectFiles;
}

export interface ProjectInput {
  id?: string;
  legacyId?: number;
  title: string;
  description?: string;
  folderName?: string;
  tag?: 'AI' | 'Dev' | 'Design' | string;
  color?: string;
  accent?: string;
  icon?: string;
  github?: string | null;
  live?: string | null;
  tech?: string[];
  readme?: string;
  skillsUsed?: string[];
  techStack?: ProjectTechStack;
  demo?: ProjectMediaDemo;
  screenshots?: string[];
  audio?: ProjectMediaAudio;
  files?: ProjectFiles;
}

export interface DocumentDefinition {
  id: string;
  filename: string;
  content: string;
  readOnly: boolean;
}

export interface AudioTrack {
  id: string;
  filename: string;
  title: string;
  artist: string;
  src: string;
  duration?: number;
}

export interface PortfolioProfile {
  name: string;
  displayName: string;
  title: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  website: string;
}

export const PROFILE: PortfolioProfile = {
  name: 'Roy Weru Matheri',
  displayName: 'Weru',
  title: 'Full-Stack Developer & AI Engineer',
  location: 'Nairobi, Kenya',
  email: 'weruroy347@gmail.com',
  github: 'https://github.com/Royweru',
  linkedin: 'https://www.linkedin.com/in/roy-matheri',
  website: 'https://github.com/Royweru',
};

const project = (definition: ProjectInput): ProjectDefinition => {
  const title = definition.title;
  const id = definition.id ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const techStack: ProjectTechStack | undefined = definition.techStack ?? (
    definition.tech && definition.tech.length > 0
      ? {
          language: definition.tech[0],
          framework: definition.tech[1],
          other: definition.tech.slice(2),
        }
      : undefined
  );
  const skillsUsed = definition.skillsUsed ?? (definition.tech ? definition.tech.slice(0, 4) : undefined);
  const files: ProjectFiles = {
    demo: definition.demo ?? definition.files?.demo,
    screenshots: definition.screenshots ?? definition.files?.screenshots,
    audio: definition.audio ?? definition.files?.audio,
    liveSite: definition.live ?? definition.files?.liveSite,
    sourceCode: definition.github ?? definition.files?.sourceCode,
  };

  return {
    id,
    legacyId: definition.legacyId,
    title,
    description: definition.description ?? '',
    folderName: definition.folderName ?? title,
    tag: definition.tag ?? 'Dev',
    color: definition.color ?? '#1a1a2e',
    accent: definition.accent ?? '#0066cc',
    icon: definition.icon ?? '📁',
    github: definition.github ?? null,
    live: definition.live ?? null,
    readme: definition.readme ?? definition.description,
    skillsUsed,
    techStack,
    files,
  };
};

export const PROJECTS: ProjectDefinition[] = [
  project({
    legacyId: 1,
    title: 'MoniePal',
    description: ' Visa premium POSERP system Used in high end regions Designed to be used in very scalable operations and businesses and even small businesses It is basically POS system that is so smooth and is meant to replace the old clunky systems operations the user experience the user design have been really put in mind when developing this great project',
    tag: 'AI',
    color: '#1a1a2e',
    accent: '#7c3aed',
    icon: '🤖',
    github: 'https://github.com/weruroy/m_afya',
    live: null,
    tech: ['Python', 'LangGraph', 'FastAPI', 'Chroma', 'Twilio'],
  }),
  project({
    legacyId: 2,
    title: 'AfyaTrack',
    description: 'A multi-agent orchestration platform built with LangGraph and FastAPI. Supports parallel tool calling, memory persistence, and real-time streaming.',
    tag: 'AI',
    color: '#1a1a2e',
    accent: '#7c3aed',
    icon: '🤖',
    github: 'https://github.com/weruroy/m_afya',
    live: null,
    tech: ['Python', 'LangGraph', 'FastAPI', 'Chroma', 'Twilio'],
  }),
   project({
    legacyId: 2,
    title: 'Kontent Pyper',
    description: 'Automated content operations pipeline for social teams. It gathers topic signals, drafts channel-specific posts, and schedules delivery from one workflow. The system includes review controls, campaign-level analytics, and queue-based workers for reliable publishing.',
    tag: 'Dev',
    color: '#0d1117',
    accent: '#0066cc',
    icon: '📱',
    github: 'https://github.com/Royweru/kontent_pyper',
    live: null,
    tech: ['React', 'LangGraph', 'LangChain', 'FastAPI', 'PostgreSQL', 'ffmpeg', 'celery', 'Redis'],
  }),
  project({
    legacyId: 3,
    title: 'eStore redesign',
    description: 'Full UX/UI redesign and frontend rebuild of an e-commerce platform. Improved conversion rate by 34% through A/B tested component improvements.',
    tag: 'Design',
    color: '#c8a882',
    accent: '#8b5e3c',
    icon: '🛍️',
    github: 'https://github.com/Royweru/Ecommerce-next-JS',
    live: 'https://estore-ivory.vercel.app',
    tech: ['Figma', 'Next.js', 'Tailwind', 'Stripe(Paystack)', 'Google Stitch', 'FastAPI', 'REST API'],
  }),
  project({
    legacyId: 5,
    title: 'Leos spa booking system',
    description: 'A high end hotel management booking system that tops it class, allows users and regular clients to book their sessions and have their services tracked.',
    tag: 'Dev',
    color: '#0a1628',
    accent: '#0284c7',
    icon: '🏢',
    github: null,
    live: 'https://leos-spa-barbershop.vercel.app',
    tech: ['Next.js', 'Prisma', 'tRPC', 'PostgreSQL'],
  }),
  project({
    legacyId: 6,
    title: 'Adventures',
    description: 'A tourism traveling agency website, designed to have the best feel and touch.',
    tag: 'Dev',
    color: '#0a1628',
    accent: '#0284c7',
    icon: '🏢',
    github: 'https://github.com/Royweru/adventures-travel-luxury',
    live: null,
    tech: ['Next.js', 'Prisma', 'tRPC', 'PostgreSQL'],
  }),
  // project({
  //   legacyId: 7,
  //   title: 'Thika sports golf club',
  //   description: 'A tourism traveling agency website, designed to have the best feel and touch.',
  //   tag: 'Dev',
  //   color: '#0a1628',
  //   accent: '#0284c7',
  //   icon: '🏢',
  //   github: 'https://github.com/Royweru/thika-sports-club-NextJS-15',
  //   live: 'https://thika-sports-club.vercel.app',
  //   tech: ['Next.js', 'Prisma', 'tRPC', 'PostgreSQL'],
  // }),
];

export const DOCUMENTS: DocumentDefinition[] = [
  {
    id: 'about',
    filename: 'about_me.txt',
    content: 'Weru is a software engineer focused on automation systems, backend services, and product-quality frontends.\n\nBased in Nairobi, Kenya.',
    readOnly: true,
  },
  {
    id: 'skills',
    filename: 'skills.txt',
    content: 'Skills\n======\n\nAI & Agents\n- LangGraph / LangChain\n- Claude / OpenAI APIs\n- RAG & Embeddings\n\nFrontend\n- React / Next.js\n- TypeScript\n- Tailwind CSS',
    readOnly: true,
  },
  {
    id: 'experience',
    filename: 'experience.txt',
    content: 'Experience\n==========\n\nFreelance / Independent — Automation Systems Developer\n2023 — Present · Nairobi, Kenya\n\nTech Startup — Full-Stack Engineer\n2021 — 2023 · Nairobi, Kenya',
    readOnly: true,
  },
  {
    id: 'resume',
    filename: 'Resume.txt',
    content: 'Weru\nSoftware Engineer · Automation Systems Developer\n\nAI & Agents · React · Next.js · Python · FastAPI · PostgreSQL',
    readOnly: true,
  },
];

export const SKILLS: SkillGroup[] = [
  { category: 'AI & Agents', icon: '🤖', skills: [
    { name: 'LangGraph / LangChain', color: '#7C3AED', proof: 'Shipped in client workflows' },
    { name: 'Claude / OpenAI APIs', color: '#D97706', proof: 'Used across production features' },
    { name: 'RAG & Embeddings', color: '#9333EA', proof: 'Applied in document Q&A systems' },
    { name: 'Prompt Engineering', color: '#6D28D9', proof: 'Used for agent task reliability' },
  ] },
  { category: 'Frontend', icon: '🎨', skills: [
    { name: 'React / Next.js', color: '#0ea5e9', proof: 'Core stack for shipped web apps' },
    { name: 'TypeScript', color: '#3178C6', proof: 'Default language for frontend work' },
    { name: 'Tailwind CSS', color: '#06B6D4', proof: 'Used in production UI systems' },
    { name: 'Framer Motion', color: '#FF0055', proof: 'Applied to interaction-heavy UIs' },
  ] },
  { category: 'Backend', icon: '⚙️', skills: [
    { name: 'Python / FastAPI', color: '#3776AB', proof: 'Backbone for API and agent services' },
    { name: 'Node.js', color: '#339933', proof: 'Used for integrations and APIs' },
    { name: 'PostgreSQL', color: '#336791', proof: 'Primary datastore in live projects' },
    { name: 'Docker', color: '#2496ED', proof: 'Used for consistent deployments' },
  ] },
  { category: 'Tools & Workflow', icon: '🛠️', skills: [
    { name: 'Git / GitHub', color: '#F05032', proof: 'Daily workflow and collaboration tool' },
    { name: 'Supabase', color: '#3ECF8E', proof: 'Used in rapid product delivery' },
    { name: 'Figma', color: '#F24E1E', proof: 'Used for handoff and UI planning' },
    { name: 'VS Code', color: '#007ACC', proof: 'Primary development environment' },
  ] },
];

export const JOBS: Job[] = [
  {
    company: 'Freelance / Independent', role: 'Automation Systems Developer', period: '2023 — Present', location: 'Nairobi, Kenya (Remote)', color: '#7C3AED', icon: '🤖', current: true,
    bullets: ['Designed and shipped multi-agent systems using LangGraph, Claude API, and FastAPI for clients across fintech and logistics.', 'Built RAG pipelines with Pinecone + Claude, enabling conversational document querying at scale.', 'Delivered end-to-end web products with React + Next.js frontends and Python backends.'],
  },
  {
    company: 'Tech Startup (NDA)', role: 'Full-Stack Engineer', period: '2021 — 2023', location: 'Nairobi, Kenya', color: '#0066CC', icon: '🚀',
    bullets: ['Led frontend rebuild of core product using Next.js and TypeScript, reducing load time by 40%.', 'Integrated third-party APIs (payments, notifications, mapping) and owned the backend with Node.js + PostgreSQL.', 'Collaborated cross-functionally with design and product to ship 4 major feature releases.'],
  },
  {
    company: 'Agency', role: 'Junior Software Developer', period: '2019 — 2021', location: 'Nairobi, Kenya', color: '#059669', icon: '💻',
    bullets: ['Built responsive web apps for 10+ clients using React, WordPress, and vanilla JS.', 'Handled deployments, performance optimisation, and post-launch maintenance.', 'First exposure to API design and database modelling — sparked a deep interest in backend systems.'],
  },
];

export const AUDIO_TRACKS: AudioTrack[] = [];

export const getProjectById = (id: string) => PROJECTS.find((item) => item.id === id);
export const getProjectByLegacyId = (id: number) => PROJECTS.find((item) => item.legacyId === id);

export interface PortfolioDocumentDefinition {
  id: string;
  name: string;
  content: string;
}

export const PORTFOLIO_DOCUMENTS: PortfolioDocumentDefinition[] = [
  {
    id: 'file-about-me',
    name: 'About Me.txt',
    content: 'Weru is a software engineer focused on automation systems, backend services, and product-quality frontends.\n\nBased in Nairobi, Kenya.',
  },
  {
    id: 'file-skills',
    name: 'Skills.txt',
    content: 'Skills\n======\n\nAI & Agents\n- LangGraph / LangChain\n- Claude / OpenAI APIs\n- RAG & Embeddings\n\nFrontend\n- React / Next.js\n- TypeScript\n- Tailwind CSS',
  },
  {
    id: 'file-experience',
    name: 'Experience.txt',
    content: 'Experience\n==========\n\nFreelance / Independent — Automation Systems Developer\n2023 — Present · Nairobi, Kenya\n\nTech Startup — Full-Stack Engineer\n2021 — 2023 · Nairobi, Kenya',
  },
  {
    id: 'file-resume',
    name: 'Resume.txt',
    content: 'Weru\nSoftware Engineer · Automation Systems Developer\n\nAI & Agents · React · Next.js · Python · FastAPI · PostgreSQL',
  },
];

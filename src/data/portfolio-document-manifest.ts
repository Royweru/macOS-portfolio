import { DOCUMENTS } from './portfolio-manifest';

export interface PortfolioDocumentDefinition {
  id: string;
  name: string;
  contentUrl: string;
}

const legacyNodeIds: Record<string, string> = {
  about: 'file-about-me',
  skills: 'file-skills',
  experience: 'file-experience',
  resume: 'file-resume',
};

/** Compatibility projection for the legacy filesystem migration. Content lives in public/text. */
export const PORTFOLIO_DOCUMENTS: PortfolioDocumentDefinition[] = DOCUMENTS.map(document => ({
  id: legacyNodeIds[document.id] ?? `file-${document.id}`,
  name: document.filename,
  contentUrl: document.src,
}));

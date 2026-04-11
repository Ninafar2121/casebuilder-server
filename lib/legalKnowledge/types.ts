export interface SourceEntry {
  id: string;
  title: string;
  url: string;
  section?: string;
  jurisdiction: string;
  dateVerified: string;
}

export interface LegalKnowledgeEntry {
  overview: string;
  keyConcepts: string[];
  riskFactors: string[];
  helpfulFactors: string[];
  retrievalSources: string[];
  sources?: SourceEntry[];
  lastVerified?: string;
}

export type JurisdictionLegalKnowledge = Record<string, LegalKnowledgeEntry>;

export interface ResolvedLegalKnowledge {
  entry: LegalKnowledgeEntry;
  isExact: boolean;
  isFallback: boolean;
  jurisdiction: string;
  topicKey: string;
  sources: SourceEntry[];
  isStale: boolean;
  lastVerified?: string;
}

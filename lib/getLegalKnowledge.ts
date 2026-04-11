import type { SourceEntry, LegalKnowledgeEntry, JurisdictionLegalKnowledge, ResolvedLegalKnowledge } from "./legalKnowledge/types";
import { CANADA_QUEBEC_KNOWLEDGE } from "./legalKnowledge/canada_quebec";
import { CANADA_ONTARIO_KNOWLEDGE } from "./legalKnowledge/canada_ontario";
import { US_CALIFORNIA_KNOWLEDGE } from "./legalKnowledge/us_california";
import { US_NEW_YORK_KNOWLEDGE } from "./legalKnowledge/us_new_york";

const STALE_THRESHOLD_DAYS = 180;

const KNOWLEDGE_MAP: Record<string, JurisdictionLegalKnowledge> = {
  canada_quebec: CANADA_QUEBEC_KNOWLEDGE,
  canada_ontario: CANADA_ONTARIO_KNOWLEDGE,
  us_california: US_CALIFORNIA_KNOWLEDGE,
  us_new_york: US_NEW_YORK_KNOWLEDGE,
};

const GENERAL_FALLBACK: LegalKnowledgeEntry = {
  overview: "This analysis is guided by the jurisdiction you selected. The AI will apply general principles relevant to consumer, contract, employment, and civil law in your region. For detailed jurisdiction-specific information, consult a licensed legal professional.",
  keyConcepts: [
    "Document all facts and interactions in writing",
    "Keep all receipts, contracts, and correspondence",
    "Note key dates — limitation periods vary by jurisdiction and claim type",
    "Consult the relevant government agency or tribunal for your type of dispute",
    "Consider a legal consultation before taking formal action",
  ],
  riskFactors: [
    "Missing documentation of the core dispute",
    "Unknown or lapsed limitation period",
    "No written contract or agreement",
    "Delayed action — time is critical in most legal disputes",
  ],
  helpfulFactors: [
    "Written evidence of the dispute (contracts, receipts, emails)",
    "Clear timeline of events with specific dates",
    "Prior written demand to the other party",
    "Records showing the other party's position",
  ],
  retrievalSources: ["general_legal_principles", "federal_consumer_protection"],
  sources: [],
  lastVerified: undefined,
};

function buildRetrievalKey(country: string, region: string): string {
  return `${country.toLowerCase().replace(/\s+/g, "_")}_${region.toLowerCase().replace(/\s+/g, "_")}`;
}

function normalizeTopicKey(topicKey: string): string {
  return topicKey.toLowerCase().replace(/[\s-]+/g, "_");
}

function isStale(lastVerified?: string): boolean {
  if (!lastVerified) return true;
  const verified = new Date(lastVerified);
  const now = new Date();
  const diffDays = (now.getTime() - verified.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > STALE_THRESHOLD_DAYS;
}

export function getLegalKnowledge(
  country: string,
  region: string,
  topicKey: string | null | undefined
): ResolvedLegalKnowledge {
  const retrievalKey = buildRetrievalKey(country, region);
  const jurisdictionKnowledge = KNOWLEDGE_MAP[retrievalKey];
  const normalizedTopic = normalizeTopicKey(topicKey || "other");

  if (!jurisdictionKnowledge) {
    return {
      entry: GENERAL_FALLBACK,
      isExact: false,
      isFallback: true,
      jurisdiction: `${region}, ${country}`,
      topicKey: normalizedTopic,
      sources: [],
      isStale: true,
      lastVerified: undefined,
    };
  }

  const exactEntry = jurisdictionKnowledge[normalizedTopic];
  if (exactEntry) {
    return {
      entry: exactEntry,
      isExact: true,
      isFallback: false,
      jurisdiction: `${region}, ${country}`,
      topicKey: normalizedTopic,
      sources: exactEntry.sources || [],
      isStale: isStale(exactEntry.lastVerified),
      lastVerified: exactEntry.lastVerified,
    };
  }

  const fallbackEntry = jurisdictionKnowledge["other"];
  if (fallbackEntry) {
    return {
      entry: fallbackEntry,
      isExact: false,
      isFallback: false,
      jurisdiction: `${region}, ${country}`,
      topicKey: "other",
      sources: fallbackEntry.sources || [],
      isStale: isStale(fallbackEntry.lastVerified),
      lastVerified: fallbackEntry.lastVerified,
    };
  }

  return {
    entry: GENERAL_FALLBACK,
    isExact: false,
    isFallback: true,
    jurisdiction: `${region}, ${country}`,
    topicKey: normalizedTopic,
    sources: [],
    isStale: true,
    lastVerified: undefined,
  };
}

export function hasDetailedKnowledge(country: string, region: string): boolean {
  const key = buildRetrievalKey(country, region);
  return key in KNOWLEDGE_MAP;
}

export function buildKnowledgePromptBlock(resolved: ResolvedLegalKnowledge): string {
  const { entry, isExact, isFallback, jurisdiction, topicKey, sources, isStale: stale, lastVerified } = resolved;

  const sourceNote = isFallback
    ? `Note: Detailed jurisdiction-specific knowledge for ${jurisdiction} is not yet available. Applying general legal principles. Use extra caution and hedging language — all points are general guidance only.`
    : isExact
      ? `Jurisdiction-specific knowledge for ${jurisdiction} — topic: ${topicKey.replace(/_/g, " ")}`
      : `General knowledge for ${jurisdiction} (no exact topic match for '${topicKey}' — using general topic context)`;

  const staleNote = stale && !isFallback
    ? `\n⚠ SOURCE FRESHNESS WARNING: This knowledge was last verified ${lastVerified || "at an unknown date"} and may be outdated. Use additional hedging in your response — always recommend the user verify with a current source.`
    : lastVerified
      ? `\n✓ Source last verified: ${lastVerified}`
      : "";

  const sourcesBlock = sources.length > 0
    ? `\nSOURCE REFERENCES (cite only these — do NOT invent other references):
${sources.map(s => `• [${s.id}] ${s.title}${s.section ? ` — ${s.section}` : ""} (${s.jurisdiction}, verified ${s.dateVerified})`).join("\n")}`
    : `\nSOURCE REFERENCES: No verified sources are available for this topic. Describe legal concepts in plain general terms only — do NOT cite statute numbers or case names.`;

  return `STRUCTURED LEGAL KNOWLEDGE FOR THIS ANALYSIS:
You MUST use this knowledge to guide your reasoning. Do not ignore it. Reference these concepts explicitly when they are relevant to the user's facts.

[Source: ${sourceNote}]${staleNote}

OVERVIEW:
${entry.overview}

KEY LEGAL CONCEPTS:
${entry.keyConcepts.map(c => `• ${c}`).join("\n")}

RISK FACTORS IN THIS JURISDICTION/TOPIC:
${entry.riskFactors.map(r => `• ${r}`).join("\n")}

HELPFUL FACTORS:
${entry.helpfulFactors.map(h => `• ${h}`).join("\n")}
${sourcesBlock}

IMPORTANT INSTRUCTIONS:
- Connect the user's specific facts to the above concepts. Do not give a generic answer.
- Reference which key concepts apply and why.
- Only cite sources listed above. If a concept is not in the source list, describe it in plain general terms.
- Use hedging language throughout: "In many cases…", "Typically…", "This may depend on your jurisdiction…"`;
}

export type { SourceEntry, LegalKnowledgeEntry, JurisdictionLegalKnowledge, ResolvedLegalKnowledge };

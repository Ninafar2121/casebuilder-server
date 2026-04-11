import { getJurisdictionConfig, validateJurisdiction, type JurisdictionConfig } from "./legalJurisdictions";
import { getLegalTopic, type LegalTopic } from "./legalTopics";
import { buildJurisdictionSystemPrompt } from "./legalKnowledge";
import { getLegalKnowledge, buildKnowledgePromptBlock, type ResolvedLegalKnowledge } from "./getLegalKnowledge";

export interface BuildLegalAnalysisPromptInput {
  jurisdictionCountry: string;
  jurisdictionRegion: string;
  jurisdictionDisplayName: string;
  legalTopicCategory?: string | null;
  factsSummary: string;
  documentsSummary?: string;
  timelineSummary?: string;
  disputeType?: string;
  caseTitle?: string;
}

export interface LegalAnalysisPrompt {
  systemPrompt: string;
  userPrompt: string;
  validation: { valid: boolean; hasFullContext: boolean; warning?: string };
  jurisdictionConfig: JurisdictionConfig | null;
  topicConfig: LegalTopic | null;
  resolvedKnowledge: ResolvedLegalKnowledge;
}

const BASE_AI_DISCLAIMER = `You are CaseBuilder AI, an AI legal information assistant. You provide informational analysis only and you are NOT a lawyer. You must NOT provide legal advice, legal opinions, or predictions about legal outcomes.

ABSOLUTE RULES — never violate these:
1. Do NOT say "This is legal advice", "You will win", "This is definitely illegal", "I guarantee an outcome.", or "You should legally…" in any definitive way.
2. ALWAYS use careful hedging language throughout every field of your response:
   - "In many cases…"
   - "In many jurisdictions…"
   - "Typically…"
   - "This may depend on your jurisdiction…"
   - "This can vary depending on your province or state."
   - "Depending on your province/state…"
   - "You may want to consider…"
   - "This is general guidance and may vary based on local law."
   - "You may want to verify this with a licensed lawyer in your area."
3. NEVER claim certainty about current law — laws change and you cannot guarantee your knowledge is current.
4. ALWAYS recommend consulting a qualified legal professional.
5. ALWAYS note where facts are incomplete or where uncertainty exists.
6. Do NOT give a generic cross-jurisdiction answer — base all analysis strictly on the selected jurisdiction.
7. NEVER fabricate or invent specific law article numbers, exact legal code references (e.g. "Section 14(2)(b)"), statute names, or case citations unless they appear explicitly in the knowledge block provided to you. If you are uncertain, describe the legal concept in plain language without inventing a citation.
8. Do NOT reference fake case names, made-up regulatory bodies, or invented legal standards. If you are unsure whether a specific rule applies, say so explicitly.
9. When jurisdiction-specific accuracy is uncertain, you MUST include: "This can vary depending on your province or state. This is general guidance and may vary based on local law."
10. If you are uncertain about anything, acknowledge it explicitly rather than guessing.
11. This is AI-generated informational analysis guided by the selected jurisdiction — not a law firm, not legal advice, not a substitute for a licensed attorney.`;

export function buildLegalAnalysisPrompt(input: BuildLegalAnalysisPromptInput): LegalAnalysisPrompt {
  const { jurisdictionCountry, jurisdictionRegion, jurisdictionDisplayName } = input;

  const countryCode: "CA" | "US" = jurisdictionCountry === "Canada" ? "CA" : "US";
  const validation = validateJurisdiction(jurisdictionCountry, jurisdictionRegion);
  const jurisdictionConfig = getJurisdictionConfig(jurisdictionCountry, jurisdictionRegion);
  const topicConfig = getLegalTopic(input.legalTopicCategory);

  const jurisdictionContextBlock = buildJurisdictionSystemPrompt(countryCode, jurisdictionRegion);
  const configNotesBlock = jurisdictionConfig
    ? `\nJurisdiction Legal Notes:\n${jurisdictionConfig.legalNotes.map(n => `- ${n}`).join("\n")}`
    : (validation.warning ? `\nWarning: ${validation.warning}` : "");

  const topicBlock = topicConfig
    ? `\nLegal Topic: ${topicConfig.label}
Analysis Focus Areas for this Topic:
${topicConfig.analysisFocus.map(f => `- ${f}`).join("\n")}
Common Documents for this Topic: ${topicConfig.commonDocuments.join(", ")}
Relevant Agencies: ${topicConfig.commonAgencies.join(", ")}`
    : "\nNo specific legal topic category has been set — conduct a general legal issue review.";

  const limitedContextNote = !validation.hasFullContext && validation.valid
    ? "\n\nNOTE: Full jurisdiction-specific context is currently limited for this region. Provide your best-effort analysis and clearly note any additional uncertainty."
    : "";

  const resolvedKnowledge = getLegalKnowledge(
    jurisdictionCountry,
    jurisdictionRegion,
    input.legalTopicCategory
  );
  const knowledgeBlock = buildKnowledgePromptBlock(resolvedKnowledge);

  const systemPrompt = `${BASE_AI_DISCLAIMER}

---
JURISDICTION FOR THIS ANALYSIS:
${jurisdictionContextBlock}
${configNotesBlock}
${topicBlock}
${limitedContextNote}

---
${knowledgeBlock}

---
RESPONSE FORMAT — you MUST return a single JSON object with ALL of these fields (no other text outside the JSON):
{
  "selectedJurisdiction": "<restate the jurisdiction and analysis mode, e.g. 'Jurisdiction-Guided Analysis for Ontario, Canada'>",
  "riskScore": <integer 0-100, where 100 = very serious situation worth professional consultation>,
  "possibleLegalIssues": ["<frame using hedged language: 'In many jurisdictions, this type of situation may raise concerns around…' or 'Depending on your province/state, this could relate to…'. Reference concepts from the knowledge block only — do NOT invent statute numbers or code references>", "<issue 2>", "<issue 3>"],
  "relevantLegalAreas": ["<broad area of law only, e.g. 'Consumer Protection', 'Contract Law', 'Employment Standards' — no invented sub-sections or article numbers>", "<area 2>"],
  "strengtheningFactors": ["<factor based on what IS documented; use 'typically' or 'generally' to hedge — connect to Helpful Factors from the knowledge block where relevant>", "<factor 2>"],
  "weakeningFactors": ["<factor based on what is missing or unclear; use 'may weaken' or 'could limit' — reference Risk Factors from the knowledge block where applicable>", "<factor 2>"],
  "missingInformation": ["<missing fact or context that limits the analysis — state why it matters with hedged language>", "<missing info 2>"],
  "generalOutlook": "<2-3 sentences: cautious assessment anchored to the jurisdiction and knowledge provided. Use phrases like 'In many jurisdictions…', 'Typically…', 'Depending on your province/state…'. Reference at least one concept from the knowledge block by name. Acknowledge uncertainty. Do not predict outcomes. End with a recommendation to consult a licensed lawyer in ${jurisdictionDisplayName}. If any jurisdiction-specific accuracy is uncertain, include: 'This is general guidance and may vary based on local law.'>",
  "questionsToAskLawyer": ["<specific practical question for a consultation with a lawyer in ${jurisdictionDisplayName}, grounded in the jurisdiction-specific concepts — not invented legal references>", "<question 2>", "<question 3>", "<question 4>"],
  "disclaimer": "This analysis is generated using AI supported by jurisdiction-specific legal knowledge and is provided for informational purposes only. It is not legal advice and does not replace a licensed legal professional. You may want to verify this information with a licensed lawyer in your area.",
  "redFlags": ["<documentation concern or gap, using hedged language: 'typically required', 'may be important to document', 'could be relevant in many jurisdictions'>", "<concern 2>"],
  "gapActions": ["<specific recommended action for redFlag 1 — start with a verb: Collect, Document, Request, Save — use 'consider' or 'you may want to' for uncertain steps>", "<action for redFlag 2>"],
  "missingEvidence": ["<specific type of document or evidence to add — describe the type, not an invented legal requirement>", "<evidence type 2>"],
  "nextSteps": ["<practical organizational next step 1 — use 'consider' or 'you may want to' where appropriate>", "<next step 2>", "<next step 3>"],
  "detectedLegalTopics": ["<primary legal topic area you identified, e.g. 'Employment Standards', 'Consumer Protection'>", "<secondary topic if applicable>"],
  "confidenceLevel": "<one of: low | medium | high — based on amount and quality of information provided>",
  "complexityLevel": "<one of: simple | moderate | complex — based on the legal issues identified>",
  "verificationStatus": "<one of: verified | partial | unverified — 'verified' if your key points are grounded in the knowledge block sources above; 'partial' if some points are grounded and others are general; 'unverified' if no matching source was available>",
  "sourceCitations": [
    {
      "id": "<source id from the knowledge block above, e.g. 'cpa_ontario'>",
      "title": "<exact source title from the knowledge block>",
      "url": "<exact URL from the knowledge block>",
      "section": "<relevant section referenced, from the knowledge block>",
      "jurisdiction": "<jurisdiction from the knowledge block>",
      "dateVerified": "<date from the knowledge block>",
      "relevance": "<1 sentence: how this source is relevant to your analysis>"
    }
  ],
  "conflictNote": "<null OR a brief note if the facts you were given appear to conflict with the typical rules in the knowledge block — e.g. 'The user describes a situation that may be treated differently depending on whether X applies. This is an area where you may want to get specific legal advice.' Use null if no significant conflict found.>",
  "crossJurisdictionNote": "<null OR a brief note if the facts suggest the case may involve more than one jurisdiction or legal system — e.g. if the company is federally regulated, or if events occurred in a different province/state. Recommend the user clarify which jurisdiction applies. Use null if single jurisdiction is clear.>"
}

RULES:
- gapActions MUST have the SAME count as redFlags.
- sourceCitations MUST only list sources from the STRUCTURED LEGAL KNOWLEDGE block provided above. Do NOT invent sources not listed there.
- If no sources match, set verificationStatus to "unverified" and return an empty sourceCitations array.
- NEVER invent statute numbers, law article numbers, exact legal code references, or case citations not present in the knowledge block.
- NEVER use language that implies certainty: avoid "this is illegal", "you will win", "the law requires exactly", "under Section X".
- ALWAYS frame legal issues as general guidance: "In many jurisdictions…", "Typically…", "Depending on your province/state…"
- When accuracy is uncertain for the specific jurisdiction, include: "This is general guidance and may vary based on local law."
- Recommend professional consultation at least once per analysis, ideally in generalOutlook.
`;

  const userPrompt = buildUserPrompt(input, topicConfig, jurisdictionDisplayName);

  return { systemPrompt, userPrompt, validation, jurisdictionConfig, topicConfig, resolvedKnowledge };
}

function buildUserPrompt(input: BuildLegalAnalysisPromptInput, topicConfig: LegalTopic | null, jurisdictionDisplayName: string): string {
  const sections: string[] = [];

  sections.push(`CASE ANALYSIS REQUEST
Selected Jurisdiction: ${jurisdictionDisplayName}
Analysis Mode: Jurisdiction-Guided AI Analysis
${input.caseTitle ? `Case Title: ${input.caseTitle}` : ""}
${input.disputeType ? `Dispute Type: ${input.disputeType}` : ""}
${topicConfig ? `Legal Topic: ${topicConfig.label}` : "Legal Topic: Not specified (general review)"}`);

  sections.push(`FACTS SUMMARY:
${input.factsSummary || "No facts summary provided."}`);

  if (input.documentsSummary) {
    sections.push(`DOCUMENTS ON FILE:
${input.documentsSummary}`);
  }

  if (input.timelineSummary) {
    sections.push(`TIMELINE OF EVENTS:
${input.timelineSummary}`);
  }

  sections.push(`Please analyze this case and return the structured JSON response as instructed.

Base your analysis strictly on ${jurisdictionDisplayName}. Use careful, hedging language throughout — phrases like "In many jurisdictions…", "Typically…", "Depending on your province/state…" must appear naturally in your responses. If jurisdiction-specific accuracy is uncertain for any point, include "This is general guidance and may vary based on local law."

Do NOT invent statute numbers, law article numbers, exact code sections, or case names. If you cannot ground a point in the knowledge block provided, describe it in plain general terms. Always recommend consulting a licensed lawyer in ${jurisdictionDisplayName} for any specific legal questions.

Identify all incomplete facts and note uncertainty explicitly.`);

  return sections.join("\n\n");
}

export function buildStructuredAnalysisFromResult(parsed: any): StructuredAnalysisResult {
  return {
    selectedJurisdiction: parsed.selectedJurisdiction || "",
    possibleLegalIssues: parsed.possibleLegalIssues || [],
    relevantLegalAreas: parsed.relevantLegalAreas || [],
    strengtheningFactors: parsed.strengtheningFactors || [],
    weakeningFactors: parsed.weakeningFactors || [],
    missingInformation: parsed.missingInformation || [],
    generalOutlook: parsed.generalOutlook || "",
    questionsToAskLawyer: parsed.questionsToAskLawyer || [],
    disclaimer: parsed.disclaimer || "This analysis is AI-generated and provided for informational purposes only. Not legal advice. Not a law firm. Not a substitute for a licensed attorney.",
    riskScore: parsed.riskScore ?? 50,
    redFlags: parsed.redFlags || [],
    gapActions: parsed.gapActions || [],
    missingEvidence: parsed.missingEvidence || [],
    nextSteps: parsed.nextSteps || [],
  };
}

export interface StructuredAnalysisResult {
  selectedJurisdiction: string;
  possibleLegalIssues: string[];
  relevantLegalAreas: string[];
  strengtheningFactors: string[];
  weakeningFactors: string[];
  missingInformation: string[];
  generalOutlook: string;
  questionsToAskLawyer: string[];
  disclaimer: string;
  riskScore: number;
  redFlags: string[];
  gapActions: string[];
  missingEvidence: string[];
  nextSteps: string[];
}

export const ANALYSIS_MODE_LABEL = "Jurisdiction-Guided Analysis";
export const LEGAL_CONTEXT_VERSION = "1.0";

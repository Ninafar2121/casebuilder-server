import type { Case, Evidence, TimelineEvent, AnalysisSourceCitation } from "./storage";
import { buildJurisdictionSystemPrompt, getJurisdictionDisplayName } from "./legalKnowledge";
import { buildLegalAnalysisPrompt } from "./buildLegalAnalysisPrompt";
import { countryCodeToName } from "./legalJurisdictions";
import { getLegalKnowledge } from "./getLegalKnowledge";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "https://casebuilder-server.onrender.com";

async function logAnalysis(payload: {
  jurisdiction: string;
  topicKey: string | null | undefined;
  sourcesUsed: string[];
  confidence: string;
  verificationStatus: string;
  timestamp: string;
  isStale: boolean;
  isFallback: boolean;
}): Promise<void> {
  if (!API_BASE_URL) return;
  try {
    await fetch(`${API_BASE_URL}/api/analysis-log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Logging is best-effort — never block the analysis
  }
}

const BASE_LEGAL_SYSTEM_PROMPT = `You are CaseBuilder AI, an intelligent case organization assistant that provides AI-powered informational analysis guided by the user's selected Canadian province or U.S. state.

CORE RULES — always follow these:
1. You provide INFORMATIONAL and ORGANIZATIONAL support only — never legal advice.
2. NEVER say "This is definitely illegal", "You will win", "This is legal advice", or "I know every current law."
3. Use careful hedging language throughout every response:
   - "In many cases…"
   - "In many jurisdictions…"
   - "Typically…"
   - "This may depend on your jurisdiction…"
   - "This can vary depending on your province or state."
   - "Depending on your province/state…"
   - "This is general guidance and may vary based on local law."
   - "You may want to consider…"
   - "You may want to verify this with a licensed lawyer in your area."
4. NEVER say "you should legally…" in a definitive way. Avoid any language that implies a guaranteed legal obligation or outcome.
5. ALWAYS tie your analysis to the specific jurisdiction provided — never give a generic answer without anchoring to jurisdiction.
6. Laws change frequently. Note uncertainty where it exists. Never claim complete accuracy about current statutes or legal standards.
7. NEVER fabricate or invent specific law article numbers, exact legal code references (e.g. "Section 14(2)(b)"), statute names, or case citations. If you are unsure of an exact rule, describe the legal concept in plain general language instead. Do not guess at specific codes.
8. Do NOT reference made-up regulatory bodies, invented case names, or unverifiable legal standards. If a specific rule is uncertain, say so explicitly.
9. When jurisdiction-specific accuracy is uncertain, include: "This can vary depending on your province or state. This is general guidance and may vary based on local law."
10. If you are uncertain about something, acknowledge it explicitly rather than guessing.
11. This is AI-generated analysis guided by your selected jurisdiction — not a law firm, not legal advice, not a guarantee of legal outcome.
12. Be calm, supportive, and clear. Help overwhelmed people organize their situation. End every substantive response with: "This is general information, not legal advice." Recommend consulting a licensed lawyer for any specific legal questions.`;

function buildSystemPrompt(country: "CA" | "US", region: string): string {
  const jurisdictionContext = buildJurisdictionSystemPrompt(country, region);
  return `${BASE_LEGAL_SYSTEM_PROMPT}

---
${jurisdictionContext}`;
}

function getJurisdictionLabel(caseData: Case): string {
  return caseData.jurisdictionDisplayName
    || getJurisdictionDisplayName(caseData.country, caseData.country === "CA" ? (caseData.province || "") : (caseData.state || ""));
}

async function callAnthropic(prompt: string, systemPrompt: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/ai/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, systemPrompt }),
  });

  if (!response.ok) {
    throw new Error(`AI service error: ${response.status}`);
  }

  const data = await response.json();
  return data.text || "";
}

export async function classifyDisputeType(description: string, country: "CA" | "US", jurisdiction: string): Promise<string> {
  const systemPrompt = buildSystemPrompt(country, jurisdiction);
  return callAnthropic(
    `A user in ${country === "CA" ? "Canada" : "United States"} (${jurisdiction}) describes their situation: "${description}"
    
Identify the dispute type in 2-3 words (e.g., "Consumer Dispute", "Employment Issue", "Landlord-Tenant", "Insurance Claim", "Contract Dispute", "Product Liability", "Service Failure", etc.).

Respond with ONLY the dispute type label, nothing else.`,
    systemPrompt
  );
}

export async function generateCaseSummary(caseData: Case, evidence: Evidence[], events: TimelineEvent[]): Promise<{ plain: string; professional: string }> {
  const evidenceSummary = evidence.slice(0, 10).map(e => `- ${e.type}: ${e.name} (${e.date || "undated"})`).join("\n");
  const timelineSummary = events.slice(0, 10).map(e => `- ${e.date}: ${e.title}`).join("\n");
  const jurisdiction = getJurisdictionLabel(caseData);
  const systemPrompt = buildSystemPrompt(caseData.country, caseData.country === "CA" ? (caseData.province || "") : (caseData.state || ""));

  const plainText = await callAnthropic(
    `Generate a plain-language summary of this case. This is AI-generated analysis guided by the legal framework of ${jurisdiction}.
    
Case: ${caseData.title}
Dispute Type: ${caseData.disputeType}
Jurisdiction: ${jurisdiction}
Description: ${caseData.description}

Evidence collected:
${evidenceSummary || "None yet"}

Key timeline events:
${timelineSummary || "None recorded"}

Write a clear, plain-language summary (3-4 paragraphs) that:
1. Explains what happened
2. Notes what evidence exists
3. References relevant legal frameworks or consumer protection agencies applicable in ${jurisdiction} where appropriate
4. Describes what the person might want to consider next

Start your response with: "Based on your selected jurisdiction (${jurisdiction}), here is an informational summary of your case:"
End with: "This analysis is AI-generated and guided by the legal framework of ${jurisdiction}. Laws vary and may have changed. CaseBuilder AI provides informational analysis only — not legal advice, not a law firm, not a substitute for a licensed attorney."`,
    systemPrompt
  );

  const professional = await callAnthropic(
    `Generate a professional case summary. This is AI-generated analysis guided by the legal framework of ${jurisdiction}.
    
Case: ${caseData.title}
Dispute Type: ${caseData.disputeType}
Jurisdiction: ${jurisdiction}
Description: ${caseData.description}

Evidence: ${evidenceSummary || "None"}
Timeline: ${timelineSummary || "None"}

Write a concise professional summary suitable for sharing with a lawyer or consumer protection agency in ${jurisdiction}. Include:
- A clear factual summary of the dispute
- Relevant legal frameworks or agencies that may apply in ${jurisdiction}
- Documentation gaps (if any)
- Suggested next steps

Use formal language. End with: "DISCLAIMER: This document was generated by CaseBuilder AI and provides AI-generated informational analysis guided by the selected jurisdiction (${jurisdiction}). It is not legal advice, does not create a lawyer-client relationship, and is not a substitute for a licensed attorney. Laws may have changed; always verify with a qualified legal professional."`,
    systemPrompt
  );

  return { plain: plainText, professional };
}

export async function analyzeRedFlags(caseData: Case, evidence: Evidence[]): Promise<{
  riskScore: number;
  redFlags: string[];
  gapActions: string[];
  missingEvidence: string[];
  nextSteps: string[];
  possibleLegalIssues: string[];
  relevantLegalAreas: string[];
  strengtheningFactors: string[];
  weakeningFactors: string[];
  missingInformation: string[];
  generalOutlook: string;
  questionsToAskLawyer: string[];
  disclaimer: string;
  detectedLegalTopics: string[];
  confidenceLevel: "low" | "medium" | "high";
  complexityLevel: "simple" | "moderate" | "complex";
  sourceCitations: AnalysisSourceCitation[];
  verificationStatus: "verified" | "partial" | "unverified";
  knowledgeLastVerified?: string;
  knowledgeIsStale: boolean;
  conflictNote?: string | null;
  crossJurisdictionNote?: string | null;
  analysisTimestamp: string;
}> {
  const region = caseData.country === "CA" ? (caseData.province || "") : (caseData.state || "");
  const jurisdictionCountry = caseData.jurisdictionCountry || countryCodeToName(caseData.country);
  const jurisdictionRegion = caseData.jurisdictionRegion || region;
  const jurisdictionDisplayName = caseData.jurisdictionDisplayName || getJurisdictionDisplayName(caseData.country, region);
  const timestamp = new Date().toISOString();

  const resolvedKnowledge = getLegalKnowledge(jurisdictionCountry, jurisdictionRegion, caseData.legalTopicCategory);

  const evidenceSummary = evidence.length
    ? evidence.map(e => `- ${e.type.toUpperCase()}: ${e.name}${e.date ? ` (${e.date})` : ""}`).join("\n")
    : "No evidence collected yet";

  const { systemPrompt, userPrompt } = buildLegalAnalysisPrompt({
    jurisdictionCountry,
    jurisdictionRegion,
    jurisdictionDisplayName,
    legalTopicCategory: caseData.legalTopicCategory,
    factsSummary: caseData.description || "No description provided.",
    documentsSummary: evidenceSummary,
    disputeType: caseData.disputeType,
    caseTitle: caseData.title,
  });

  const response = await callAnthropic(userPrompt, systemPrompt);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.gapActions || parsed.gapActions.length !== parsed.redFlags?.length) {
        parsed.gapActions = (parsed.redFlags || []).map(() => "Document this concern and seek professional guidance.");
      }
      const sourceCitations: AnalysisSourceCitation[] = Array.isArray(parsed.sourceCitations)
        ? parsed.sourceCitations.filter((s: any) => s.id && s.title && s.url)
        : [];
      const verificationStatus = (["verified", "partial", "unverified"].includes(parsed.verificationStatus)
        ? parsed.verificationStatus : "partial") as "verified" | "partial" | "unverified";

      logAnalysis({
        jurisdiction: jurisdictionDisplayName,
        topicKey: caseData.legalTopicCategory,
        sourcesUsed: sourceCitations.map((s) => s.id),
        confidence: parsed.confidenceLevel || "medium",
        verificationStatus,
        timestamp,
        isStale: resolvedKnowledge.isStale,
        isFallback: resolvedKnowledge.isFallback,
      });

      return {
        riskScore: parsed.riskScore ?? 50,
        redFlags: parsed.redFlags || [],
        gapActions: parsed.gapActions || [],
        missingEvidence: parsed.missingEvidence || [],
        nextSteps: parsed.nextSteps || [],
        possibleLegalIssues: parsed.possibleLegalIssues || [],
        relevantLegalAreas: parsed.relevantLegalAreas || [],
        strengtheningFactors: parsed.strengtheningFactors || [],
        weakeningFactors: parsed.weakeningFactors || [],
        missingInformation: parsed.missingInformation || [],
        generalOutlook: parsed.generalOutlook || "",
        questionsToAskLawyer: parsed.questionsToAskLawyer || [],
        disclaimer: parsed.disclaimer || "This analysis is generated using AI supported by jurisdiction-specific legal knowledge and is provided for informational purposes only. This is general information, not legal advice. It does not replace a licensed legal professional. You may want to verify this information with a licensed lawyer in your area.",
        detectedLegalTopics: Array.isArray(parsed.detectedLegalTopics) ? parsed.detectedLegalTopics : [],
        confidenceLevel: (["low", "medium", "high"].includes(parsed.confidenceLevel) ? parsed.confidenceLevel : "medium") as "low" | "medium" | "high",
        complexityLevel: (["simple", "moderate", "complex"].includes(parsed.complexityLevel) ? parsed.complexityLevel : "moderate") as "simple" | "moderate" | "complex",
        sourceCitations,
        verificationStatus,
        knowledgeLastVerified: resolvedKnowledge.lastVerified,
        knowledgeIsStale: resolvedKnowledge.isStale,
        conflictNote: parsed.conflictNote || null,
        crossJurisdictionNote: parsed.crossJurisdictionNote || null,
        analysisTimestamp: timestamp,
      };
    }
  } catch {
    // fallback below
  }

  return {
    riskScore: 50,
    redFlags: ["Could not analyze — please add more details to your case"],
    gapActions: ["Add a detailed case description and try again"],
    missingEvidence: ["Case description", "Key dates", "Communication records"],
    nextSteps: ["Add more details to your case", "Upload any relevant documents", "Record key dates on your timeline"],
    possibleLegalIssues: [],
    relevantLegalAreas: [],
    strengtheningFactors: [],
    weakeningFactors: [],
    missingInformation: [],
    generalOutlook: "",
    questionsToAskLawyer: [],
    disclaimer: "This analysis is generated using AI supported by jurisdiction-specific legal knowledge and is provided for informational purposes only. This is general information, not legal advice. It does not replace a licensed legal professional. You may want to verify this information with a licensed lawyer in your area.",
    sourceCitations: [],
    verificationStatus: "unverified",
    knowledgeLastVerified: resolvedKnowledge.lastVerified,
    knowledgeIsStale: resolvedKnowledge.isStale,
    conflictNote: null,
    crossJurisdictionNote: null,
    analysisTimestamp: timestamp,
    detectedLegalTopics: [],
    confidenceLevel: "medium",
    complexityLevel: "moderate",
  };
}

export function computeNextSteps(
  caseData: Case,
  evidenceCount: number,
  timelineCount: number,
): string[] {
  const steps: string[] = [];

  if (evidenceCount === 0) {
    steps.push("Add evidence to support your case — photos, documents, emails, or receipts.");
  } else if (evidenceCount < 3) {
    steps.push(`You have ${evidenceCount} piece${evidenceCount === 1 ? "" : "s"} of evidence. Add more to strengthen your documentation.`);
  }

  if (timelineCount === 0) {
    steps.push("Build your timeline — record key dates and events in order.");
  } else if (timelineCount < 3) {
    steps.push("Add more timeline events to create a complete picture of what happened.");
  }

  if (!caseData.riskScore) {
    steps.push("Run a Gap Analysis to identify potential gaps in your documentation.");
  } else if ((caseData.redFlags?.length ?? 0) > 0) {
    steps.push("Review the gaps identified in your analysis and address the recommended actions.");
  }

  if (!caseData.aiSummary) {
    steps.push("Generate an AI summary to organize your case details into a clear overview.");
  }

  if (!caseData.lawyerQuestions || caseData.lawyerQuestions.length === 0) {
    steps.push("Generate questions to ask a lawyer — found in the AI Analysis tab.");
  }

  if (evidenceCount >= 3 && timelineCount >= 3 && caseData.aiSummary && caseData.riskScore !== undefined) {
    steps.push("Your case file looks well-organized. Consider exporting it to share with a professional.");
  }

  return steps.slice(0, 5);
}

export async function suggestEvidenceTags(evidenceName: string, extractedText: string, caseType: string): Promise<string[]> {
  const systemPrompt = BASE_LEGAL_SYSTEM_PROMPT;
  const response = await callAnthropic(
    `For a ${caseType} case, suggest 3-5 relevant tags for this piece of evidence:
Name: ${evidenceName}
Extracted text: ${extractedText.slice(0, 500)}

Respond with ONLY a JSON array of tag strings, e.g. ["date", "amount", "communication"]`,
    systemPrompt
  );

  try {
    const match = response.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
  } catch {}

  return ["document", caseType.toLowerCase()];
}

export async function generateTimelineFromEvidence(evidence: Evidence[], existingEvents: TimelineEvent[]): Promise<TimelineEvent[]> {
  const evidenceWithDates = evidence.filter(e => e.date).map(e => ({
    date: e.date,
    name: e.name,
    type: e.type,
    text: e.extractedText?.slice(0, 200) || "",
  }));

  if (evidenceWithDates.length === 0) return [];

  const response = await callAnthropic(
    `Based on this evidence, suggest timeline events:
${JSON.stringify(evidenceWithDates.slice(0, 10), null, 2)}

Respond ONLY with a JSON array of events:
[{"date": "YYYY-MM-DD", "title": "Brief title", "description": "1-2 sentences", "importance": "low|medium|high|critical"}]`,
    BASE_LEGAL_SYSTEM_PROMPT
  );

  try {
    const match = response.match(/\[[\s\S]*\]/);
    if (match) {
      const suggestions = JSON.parse(match[0]);
      return suggestions.map((s: any, i: number) => ({
        id: `ai_${Date.now()}_${i}`,
        caseId: evidence[0]?.caseId || "",
        date: s.date,
        title: s.title,
        description: s.description,
        evidenceIds: [],
        isAiGenerated: true,
        importance: s.importance || "medium",
        createdAt: new Date().toISOString(),
      }));
    }
  } catch {}

  return [];
}

export async function generateLawyerQuestions(caseData: Case, evidence: Evidence[]): Promise<string[]> {
  const evidenceSummary = evidence.slice(0, 8).map(e => `- ${e.type}: ${e.name}`).join("\n");
  const jurisdiction = getJurisdictionLabel(caseData);
  const systemPrompt = buildSystemPrompt(caseData.country, caseData.country === "CA" ? (caseData.province || "") : (caseData.state || ""));

  const response = await callAnthropic(
    `Based on this case, generate 6-8 practical questions a person could ask when consulting a lawyer or legal professional in ${jurisdiction}.

Case: ${caseData.title}
Dispute Type: ${caseData.disputeType}
Jurisdiction: ${jurisdiction}
Description: ${caseData.description || "No description provided"}
Evidence: ${evidenceSummary || "None collected yet"}

Generate questions that are specific and relevant to ${jurisdiction}, including questions about:
- Applicable consumer protection laws or frameworks in ${jurisdiction}
- Limitation periods or deadlines that may apply in ${jurisdiction}
- Available dispute resolution bodies or agencies in ${jurisdiction}
- What documentation to bring
- What realistic next steps look like

Keep them practical and clear. Do NOT suggest outcomes or imply any specific legal result.

Respond ONLY with a JSON array of question strings, e.g. ["What are my options under consumer protection law in ${jurisdiction}?", "What limitation periods apply to this type of dispute in ${jurisdiction}?"]`,
    systemPrompt
  );

  try {
    const match = response.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
  } catch {}

  return [
    "What are my options in this type of case?",
    "What documentation should I bring to our meeting?",
    "What is a realistic timeline for resolving this?",
    "Are there any deadlines or limitation periods I should know about?",
    "What would the next steps look like if I decide to proceed?",
    "Are there any alternative dispute resolution options available?",
  ];
}

export async function getJurisdictionGuidance(disputeType: string, country: "CA" | "US", jurisdiction: string): Promise<string> {
  const systemPrompt = buildSystemPrompt(country, jurisdiction);
  return callAnthropic(
    `Provide brief, careful informational guidance for a ${disputeType} dispute in ${country === "CA" ? "Canada" : "United States"} (${jurisdiction}).
    
Include:
1. Relevant consumer protection frameworks or agencies that may apply in ${jurisdiction} (be cautious — note you cannot guarantee knowledge of all current laws)
2. Common documentation that tends to be important in these types of disputes
3. General steps someone might consider

Keep it to 3-4 bullet points. Use careful language throughout. End with: "This is AI-generated informational analysis guided by ${jurisdiction}. Not legal advice. Not a law firm. Not a substitute for a licensed attorney."`,
    systemPrompt
  );
}

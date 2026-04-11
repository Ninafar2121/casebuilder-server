import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Evidence {
  id: string;
  caseId: string;
  type: "image" | "pdf" | "note" | "email" | "receipt" | "voice";
  name: string;
  uri?: string;
  text?: string;
  tags: string[];
  date?: string;
  extractedText?: string;
  aiSuggestion?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  date: string;
  title: string;
  description: string;
  evidenceIds: string[];
  isAiGenerated?: boolean;
  importance: "low" | "medium" | "high" | "critical";
  createdAt: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  disputeType: string;
  status: "active" | "archived" | "exported";
  country: "CA" | "US";
  province?: string;
  state?: string;
  jurisdictionDisplayName?: string;
  parties: string[];
  createdAt: string;
  updatedAt: string;
  aiSummary?: string;
  professionalSummary?: string;
  riskScore?: number;
  redFlags?: string[];
  gapActions?: string[];
  missingEvidence?: string[];
  nextSteps?: string[];
  lawyerQuestions?: string[];
  possibleLegalIssues?: string[];
  relevantLegalAreas?: string[];
  strengtheningFactors?: string[];
  weakeningFactors?: string[];
  missingInformation?: string[];
  generalOutlook?: string;
  questionsToAskLawyer?: string[];
  jurisdictionCountry?: string;
  jurisdictionRegion?: string;
  legalTopicCategory?: string | null;
  legalContextVersion?: string;
  analysisMode?: string;
  detectedLegalTopics?: string[];
  confidenceLevel?: "low" | "medium" | "high";
  complexityLevel?: "simple" | "moderate" | "complex";
  legalContextUsed?: {
    jurisdiction: string;
    topicKey: string;
    hasDetailedContext: boolean;
  };
  hasSubscription?: boolean;
  sourceCitations?: AnalysisSourceCitation[];
  verificationStatus?: "verified" | "partial" | "unverified";
  knowledgeLastVerified?: string;
  knowledgeIsStale?: boolean;
  conflictNote?: string | null;
  crossJurisdictionNote?: string | null;
  analysisTimestamp?: string;
}

export interface AnalysisSourceCitation {
  id: string;
  title: string;
  url: string;
  section?: string;
  jurisdiction: string;
  dateVerified: string;
  relevance?: string;
}

export interface UserProfile {
  onboardingComplete: boolean;
  disclaimerAccepted: boolean;
  language: "en" | "fr";
  theme: "light" | "dark" | "system";
  textSize: "small" | "medium" | "large";
  highContrast: boolean;
  readAloud: boolean;
  stepByStep: boolean;
  country?: "CA" | "US";
  province?: string;
  state?: string;
  trialStartDate?: string;
  tier?: "free" | "basic" | "plus" | "pro";
}

const KEYS = {
  cases: "casebuilder_cases",
  evidence: "casebuilder_evidence",
  timeline: "casebuilder_timeline",
  profile: "casebuilder_profile",
};

export async function loadCases(): Promise<Case[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.cases);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveCases(cases: Case[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.cases, JSON.stringify(cases));
}

export async function loadEvidence(): Promise<Evidence[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.evidence);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveEvidence(evidence: Evidence[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.evidence, JSON.stringify(evidence));
}

export async function loadTimeline(): Promise<TimelineEvent[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.timeline);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveTimeline(events: TimelineEvent[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.timeline, JSON.stringify(events));
}

export async function loadProfile(): Promise<UserProfile> {
  try {
    const data = await AsyncStorage.getItem(KEYS.profile);
    return data
      ? {
          onboardingComplete: false,
          disclaimerAccepted: false,
          language: "en" as const,
          theme: "system" as const,
          textSize: "medium" as const,
          highContrast: false,
          readAloud: false,
          stepByStep: false,
          ...JSON.parse(data),
        }
      : {
          onboardingComplete: false,
          disclaimerAccepted: false,
          language: "en",
          theme: "system",
          textSize: "medium",
          highContrast: false,
          readAloud: false,
          stepByStep: false,
        };
  } catch {
    return {
      onboardingComplete: false,
      disclaimerAccepted: false,
      language: "en",
      theme: "system",
      textSize: "medium",
      highContrast: false,
      readAloud: false,
      stepByStep: false,
    };
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export interface LegalTopic {
  key: string;
  label: string;
  shortLabel: string;
  analysisFocus: string[];
  commonDocuments: string[];
  commonAgencies: string[];
  disputeTypeHint: string;
}

export const LEGAL_TOPICS: Record<string, LegalTopic> = {
  consumer: {
    key: "consumer",
    label: "Consumer Dispute",
    shortLabel: "Consumer",
    analysisFocus: [
      "deceptive or misleading business practices",
      "unfair contract terms",
      "product defects or misrepresentation",
      "refund or cancellation rights",
      "warranty violations",
      "unauthorized charges or billing errors",
    ],
    commonDocuments: ["receipts", "contracts or terms of service", "screenshots", "correspondence", "warranty documentation"],
    commonAgencies: ["provincial/state consumer protection office", "federal trade commission or competition bureau", "attorney general consumer protection division"],
    disputeTypeHint: "Consumer Dispute",
  },
  employment: {
    key: "employment",
    label: "Employment Issue",
    shortLabel: "Employment",
    analysisFocus: [
      "wrongful or constructive dismissal",
      "workplace harassment or bullying",
      "discrimination (protected characteristics)",
      "wage theft or unpaid wages",
      "leave entitlements",
      "accommodation obligations",
      "retaliation",
    ],
    commonDocuments: ["employment contract", "pay stubs", "performance reviews", "emails or messages", "termination letter", "HR correspondence"],
    commonAgencies: ["provincial/state employment standards board", "human rights tribunal or commission", "labour relations board"],
    disputeTypeHint: "Employment Issue",
  },
  landlord_tenant: {
    key: "landlord_tenant",
    label: "Landlord / Tenant",
    shortLabel: "Landlord-Tenant",
    analysisFocus: [
      "unlawful eviction or notice issues",
      "rent increases and rent control",
      "maintenance and repair obligations",
      "deposit disputes",
      "harassment by landlord",
      "tenant rights violations",
    ],
    commonDocuments: ["lease agreement", "rent receipts", "maintenance requests", "notices", "photographs of property condition", "correspondence with landlord"],
    commonAgencies: ["residential tenancies board", "landlord and tenant board", "housing tribunal or rental office"],
    disputeTypeHint: "Landlord-Tenant",
  },
  small_claims: {
    key: "small_claims",
    label: "Small Claims",
    shortLabel: "Small Claims",
    analysisFocus: [
      "debt recovery",
      "breach of contract",
      "property damage",
      "unpaid services",
      "goods not delivered",
      "minor personal injury",
    ],
    commonDocuments: ["invoice or agreement", "proof of payment", "photos of damage", "written demands", "correspondence"],
    commonAgencies: ["small claims court (provincial/state)", "civil resolution tribunal"],
    disputeTypeHint: "Contract Dispute",
  },
  personal_injury: {
    key: "personal_injury",
    label: "Personal Injury",
    shortLabel: "Personal Injury",
    analysisFocus: [
      "negligence",
      "duty of care",
      "causation and injury link",
      "damages (medical, economic, pain and suffering)",
      "occupier's liability",
      "product liability injury",
    ],
    commonDocuments: ["medical records", "incident report", "photos of scene and injuries", "witness statements", "insurance correspondence"],
    commonAgencies: ["insurance company", "civil court system"],
    disputeTypeHint: "Product Liability",
  },
  contract: {
    key: "contract",
    label: "Contract Dispute",
    shortLabel: "Contract",
    analysisFocus: [
      "breach of contract",
      "misrepresentation",
      "contract formation issues",
      "enforceability of terms",
      "damages for breach",
      "cancellation rights",
    ],
    commonDocuments: ["signed contract or agreement", "correspondence", "invoices", "proof of performance or non-performance"],
    commonAgencies: ["civil court", "arbitration (if contract requires)", "small claims court (for smaller amounts)"],
    disputeTypeHint: "Contract Dispute",
  },
  human_rights: {
    key: "human_rights",
    label: "Human Rights",
    shortLabel: "Human Rights",
    analysisFocus: [
      "discrimination based on protected characteristics",
      "accommodation to the point of undue hardship",
      "harassment based on protected grounds",
      "systemic or direct discrimination",
    ],
    commonDocuments: ["employment records or lease agreements", "emails or messages showing conduct", "witness statements", "records of accommodation requests"],
    commonAgencies: ["human rights tribunal or commission", "employment equity office"],
    disputeTypeHint: "Employment Issue",
  },
  insurance: {
    key: "insurance",
    label: "Insurance Claim",
    shortLabel: "Insurance",
    analysisFocus: [
      "denied or delayed insurance claim",
      "unfair claim settlement",
      "bad faith insurance practices",
      "policy interpretation disputes",
      "coverage disputes",
    ],
    commonDocuments: ["insurance policy", "claim submission and denial letters", "correspondence with insurer", "supporting evidence for the claim"],
    commonAgencies: ["provincial/state insurance regulator", "insurance ombudsman", "attorney general consumer protection"],
    disputeTypeHint: "Insurance Claim",
  },
  financial: {
    key: "financial",
    label: "Financial Dispute",
    shortLabel: "Financial",
    analysisFocus: [
      "unauthorized account charges",
      "predatory lending",
      "credit reporting errors",
      "debt collection violations",
      "investment loss",
      "fraud or misrepresentation by financial institution",
    ],
    commonDocuments: ["account statements", "loan agreement", "credit report", "correspondence with institution", "transaction records"],
    commonAgencies: ["financial consumer agency (FCAC / CFPB)", "provincial/state securities regulator", "banking ombudsman"],
    disputeTypeHint: "Financial Dispute",
  },
  privacy_data: {
    key: "privacy_data",
    label: "Privacy / Data",
    shortLabel: "Privacy",
    analysisFocus: [
      "unauthorized data collection or sharing",
      "data breach or security failure",
      "violation of privacy legislation",
      "failure to honor deletion or access requests",
    ],
    commonDocuments: ["terms of service or privacy policy", "breach notification", "screenshots of data use", "access request correspondence"],
    commonAgencies: ["federal/provincial privacy commissioner", "data protection authority"],
    disputeTypeHint: "Privacy / Data",
  },
  other: {
    key: "other",
    label: "Other / General",
    shortLabel: "General",
    analysisFocus: [
      "general legal issue review",
      "documentation gaps",
      "applicable legal frameworks",
      "recommended next steps",
    ],
    commonDocuments: ["any relevant contracts or agreements", "correspondence", "receipts or invoices", "photos or screenshots"],
    commonAgencies: ["relevant government agency", "consumer protection office", "legal aid (if eligible)"],
    disputeTypeHint: "General Dispute",
  },
};

export const LEGAL_TOPIC_KEYS = Object.keys(LEGAL_TOPICS);

export const LEGAL_TOPIC_OPTIONS = LEGAL_TOPIC_KEYS.map(key => ({
  key,
  label: LEGAL_TOPICS[key].label,
  shortLabel: LEGAL_TOPICS[key].shortLabel,
}));

export function getLegalTopic(key: string | null | undefined): LegalTopic | null {
  if (!key) return null;
  return LEGAL_TOPICS[key] ?? null;
}

export function getLegalTopicLabel(key: string | null | undefined): string {
  const topic = getLegalTopic(key);
  return topic ? topic.label : "General";
}

export function disputeTypeToTopicKey(disputeType: string): string | null {
  const mapping: Record<string, string> = {
    "Consumer Dispute": "consumer",
    "Employment Issue": "employment",
    "Landlord-Tenant": "landlord_tenant",
    "Insurance Claim": "insurance",
    "Contract Dispute": "contract",
    "Product Liability": "personal_injury",
    "Service Failure": "consumer",
    "Privacy / Data": "privacy_data",
    "Financial Dispute": "financial",
    "Medical / Healthcare": "personal_injury",
  };
  return mapping[disputeType] ?? null;
}

export interface JurisdictionConfig {
  displayName: string;
  legalSystemType: string;
  legalNotes: string[];
  retrievalKey: string;
}

export interface JurisdictionValidationResult {
  valid: boolean;
  hasFullContext: boolean;
  warning?: string;
}

type RegionMap = Record<string, JurisdictionConfig>;

const CA_STANDARD_NOTES = (province: string): string[] => [
  `Apply ${province} provincial consumer protection legislation and applicable Canadian federal law (Competition Act, Consumer Product Safety Act).`,
  "Flag where federal Canadian law may also apply alongside the provincial framework.",
  "Standard limitation period for civil claims in most Canadian provinces is 2 years — note any exceptions.",
];

const CA_TERRITORY_NOTES = (territory: string): string[] => [
  `Apply ${territory} territorial consumer protection legislation and applicable Canadian federal law.`,
  "Territorial legal infrastructure may be more limited than provinces — consider federal remedies and mediation.",
  "Limitation period is generally 2 years; verify current territorial rules.",
];

const US_STANDARD_NOTES = (state: string): string[] => [
  `Apply ${state}'s state consumer protection (UDAP) statute and applicable federal law (FTC Act, Magnuson-Moss Warranty Act, CFPB jurisdiction).`,
  "Flag where federal U.S. law creates additional or parallel protections.",
  "Verify current state limitation period before assessing timeliness of claims.",
];

const US_SHORT_LIMITATION_NOTES = (state: string, years: number): string[] => [
  `Apply ${state}'s state consumer protection statute and applicable federal law.`,
  `Note: ${state} has a ${years}-year limitation period under its consumer protection law — one of the shorter periods in the U.S. Timely action is particularly important.`,
  "Flag where federal U.S. law creates additional or parallel protections.",
];

const US_LONG_LIMITATION_NOTES = (state: string, years: number): string[] => [
  `Apply ${state}'s state consumer protection statute and applicable federal law.`,
  `${state} has a relatively generous ${years}-year limitation period under its consumer protection law.`,
  "Flag where federal U.S. law also applies. Verify current statutes.",
];

function slug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

const CANADA_REGIONS: RegionMap = {
  "Alberta": {
    displayName: "Alberta, Canada",
    legalSystemType: "provincial + federal",
    legalNotes: CA_STANDARD_NOTES("Alberta"),
    retrievalKey: "canada_alberta",
  },
  "British Columbia": {
    displayName: "British Columbia, Canada",
    legalSystemType: "provincial + federal",
    legalNotes: [
      "Apply BC's Business Practices and Consumer Protection Act (BPCPA, SBC 2004) and applicable federal law.",
      "The BC Civil Resolution Tribunal (CRT) is available for eligible disputes up to $5,000 and provides online dispute resolution.",
      "Limitation period is 2 years under BC's Limitation Act (SBC 2012).",
    ],
    retrievalKey: "canada_british_columbia",
  },
  "Manitoba": {
    displayName: "Manitoba, Canada",
    legalSystemType: "provincial + federal",
    legalNotes: CA_STANDARD_NOTES("Manitoba"),
    retrievalKey: "canada_manitoba",
  },
  "New Brunswick": {
    displayName: "New Brunswick, Canada",
    legalSystemType: "provincial + federal",
    legalNotes: CA_STANDARD_NOTES("New Brunswick"),
    retrievalKey: "canada_new_brunswick",
  },
  "Newfoundland and Labrador": {
    displayName: "Newfoundland and Labrador, Canada",
    legalSystemType: "provincial + federal",
    legalNotes: CA_STANDARD_NOTES("Newfoundland and Labrador"),
    retrievalKey: "canada_newfoundland_and_labrador",
  },
  "Northwest Territories": {
    displayName: "Northwest Territories, Canada",
    legalSystemType: "territorial + federal",
    legalNotes: CA_TERRITORY_NOTES("Northwest Territories"),
    retrievalKey: "canada_northwest_territories",
  },
  "Nova Scotia": {
    displayName: "Nova Scotia, Canada",
    legalSystemType: "provincial + federal",
    legalNotes: CA_STANDARD_NOTES("Nova Scotia"),
    retrievalKey: "canada_nova_scotia",
  },
  "Nunavut": {
    displayName: "Nunavut, Canada",
    legalSystemType: "territorial + federal",
    legalNotes: CA_TERRITORY_NOTES("Nunavut"),
    retrievalKey: "canada_nunavut",
  },
  "Ontario": {
    displayName: "Ontario, Canada",
    legalSystemType: "provincial + federal",
    legalNotes: [
      "Apply Ontario's Consumer Protection Act, 2002 (CPA) and applicable federal law. Consumer Protection Ontario (CPCO) is the primary enforcement body.",
      "Small Claims Court handles disputes up to $35,000. Financial Services Regulatory Authority of Ontario (FSRA) covers financial sector disputes.",
      "Limitation period is 2 years under Ontario's Limitations Act, 2002 — strictly enforced.",
    ],
    retrievalKey: "canada_ontario",
  },
  "Prince Edward Island": {
    displayName: "Prince Edward Island, Canada",
    legalSystemType: "provincial + federal",
    legalNotes: CA_STANDARD_NOTES("Prince Edward Island"),
    retrievalKey: "canada_prince_edward_island",
  },
  "Quebec": {
    displayName: "Quebec, Canada",
    legalSystemType: "provincial + federal (civil law system)",
    legalNotes: [
      "Quebec operates under the Civil Code of Quebec (civil law tradition), not common law — this affects how contracts, obligations, and remedies are interpreted.",
      "Apply Quebec's Loi sur la protection du consommateur (LPC) and Office de la protection du consommateur (OPC) guidance.",
      "Limitation (prescription) period is 3 years under the Civil Code of Quebec (art. 2925), longer than most Canadian provinces.",
    ],
    retrievalKey: "canada_quebec",
  },
  "Saskatchewan": {
    displayName: "Saskatchewan, Canada",
    legalSystemType: "provincial + federal",
    legalNotes: CA_STANDARD_NOTES("Saskatchewan"),
    retrievalKey: "canada_saskatchewan",
  },
  "Yukon": {
    displayName: "Yukon, Canada",
    legalSystemType: "territorial + federal",
    legalNotes: CA_TERRITORY_NOTES("Yukon"),
    retrievalKey: "canada_yukon",
  },
};

const US_REGIONS: RegionMap = {
  "Alabama": {
    displayName: "Alabama, United States",
    legalSystemType: "state + federal",
    legalNotes: US_SHORT_LIMITATION_NOTES("Alabama", 1),
    retrievalKey: "us_alabama",
  },
  "Alaska": {
    displayName: "Alaska, United States",
    legalSystemType: "state + federal",
    legalNotes: US_STANDARD_NOTES("Alaska"),
    retrievalKey: "us_alaska",
  },
  "Arizona": {
    displayName: "Arizona, United States",
    legalSystemType: "state + federal",
    legalNotes: US_SHORT_LIMITATION_NOTES("Arizona", 1),
    retrievalKey: "us_arizona",
  },
  "Arkansas": {
    displayName: "Arkansas, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("Arkansas", 5),
    retrievalKey: "us_arkansas",
  },
  "California": {
    displayName: "California, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply California's Consumers Legal Remedies Act (CLRA), Unfair Competition Law (UCL), and False Advertising Law (FAL) — considered among the strongest consumer protection frameworks in the U.S.",
      "UCL has a 4-year limitation period; CLRA has 3 years. The CA Department of Consumer Affairs (DCA) and DFPI cover sector-specific disputes.",
      "Small Claims Court handles up to $12,500 for individuals. Class action and private attorney general (PAGA) mechanisms may also be relevant.",
    ],
    retrievalKey: "us_california",
  },
  "Colorado": {
    displayName: "Colorado, United States",
    legalSystemType: "state + federal",
    legalNotes: US_STANDARD_NOTES("Colorado"),
    retrievalKey: "us_colorado",
  },
  "Connecticut": {
    displayName: "Connecticut, United States",
    legalSystemType: "state + federal",
    legalNotes: US_STANDARD_NOTES("Connecticut"),
    retrievalKey: "us_connecticut",
  },
  "Delaware": {
    displayName: "Delaware, United States",
    legalSystemType: "state + federal",
    legalNotes: US_STANDARD_NOTES("Delaware"),
    retrievalKey: "us_delaware",
  },
  "District of Columbia": {
    displayName: "District of Columbia, United States",
    legalSystemType: "district + federal",
    legalNotes: [
      "Apply the DC Consumer Protection Procedures Act (CPPA, D.C. Code § 28-3901) — one of the broadest consumer protection statutes in the U.S.",
      "The DC Attorney General's Consumer Protection Section has broad enforcement authority. Limitation period is 3 years.",
      "Flag where federal U.S. law also applies — as a federal district, some federal protections are directly accessible.",
    ],
    retrievalKey: "us_district_of_columbia",
  },
  "Florida": {
    displayName: "Florida, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("Florida", 4),
    retrievalKey: "us_florida",
  },
  "Georgia": {
    displayName: "Georgia, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply Georgia's Fair Business Practices Act (FBPA, OCGA § 10-1-390) — limitation period is 2 years.",
      "The Georgia Governor's Office of Consumer Protection accepts complaints and can mediate disputes.",
      "Flag where federal U.S. law also applies. Magistrate Court handles small claims up to $15,000.",
    ],
    retrievalKey: "us_georgia",
  },
  "Hawaii": {
    displayName: "Hawaii, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("Hawaii", 4),
    retrievalKey: "us_hawaii",
  },
  "Idaho": {
    displayName: "Idaho, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply Idaho's Consumer Protection Act (Idaho Code § 48-601) — limitation period is 2 years.",
      ...US_STANDARD_NOTES("Idaho").slice(1),
    ],
    retrievalKey: "us_idaho",
  },
  "Illinois": {
    displayName: "Illinois, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply Illinois's Consumer Fraud and Deceptive Business Practices Act (815 ILCS 505) — limitation period is 3 years.",
      "The Illinois AG's Consumer Protection Division is active in enforcement. Small Claims Court up to $10,000.",
      "Flag where federal U.S. law also applies.",
    ],
    retrievalKey: "us_illinois",
  },
  "Indiana": {
    displayName: "Indiana, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply Indiana's Deceptive Consumer Sales Act (DCSA, IC 24-5-0.5) — limitation period is 2 years.",
      ...US_STANDARD_NOTES("Indiana").slice(1),
    ],
    retrievalKey: "us_indiana",
  },
  "Iowa": {
    displayName: "Iowa, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("Iowa", 5),
    retrievalKey: "us_iowa",
  },
  "Kansas": {
    displayName: "Kansas, United States",
    legalSystemType: "state + federal",
    legalNotes: US_STANDARD_NOTES("Kansas"),
    retrievalKey: "us_kansas",
  },
  "Kentucky": {
    displayName: "Kentucky, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("Kentucky", 5),
    retrievalKey: "us_kentucky",
  },
  "Louisiana": {
    displayName: "Louisiana, United States",
    legalSystemType: "state + federal (civil law tradition)",
    legalNotes: [
      "Louisiana operates under a civil law tradition (derived from French/Spanish law), unlike most U.S. states. Apply the Louisiana Unfair Trade Practices Act (LUTPA).",
      "LUTPA has a 1-year limitation period — one of the shortest in the U.S. Timely action is critical.",
      "The Civil Code of Louisiana affects contract interpretation differently than common law states.",
    ],
    retrievalKey: "us_louisiana",
  },
  "Maine": {
    displayName: "Maine, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("Maine", 6),
    retrievalKey: "us_maine",
  },
  "Maryland": {
    displayName: "Maryland, United States",
    legalSystemType: "state + federal",
    legalNotes: US_STANDARD_NOTES("Maryland"),
    retrievalKey: "us_maryland",
  },
  "Massachusetts": {
    displayName: "Massachusetts, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply Massachusetts G.L. c. 93A (Consumer Protection Act) — limitation period is 4 years. Chapter 93A allows multiple damages for willful violations.",
      "Important: Massachusetts requires a written demand letter to the business at least 30 days before filing suit under c. 93A.",
      "The MA AG's Consumer Protection Division is active. Small Claims Court up to $7,000.",
    ],
    retrievalKey: "us_massachusetts",
  },
  "Michigan": {
    displayName: "Michigan, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("Michigan", 6),
    retrievalKey: "us_michigan",
  },
  "Minnesota": {
    displayName: "Minnesota, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("Minnesota", 6),
    retrievalKey: "us_minnesota",
  },
  "Mississippi": {
    displayName: "Mississippi, United States",
    legalSystemType: "state + federal",
    legalNotes: US_STANDARD_NOTES("Mississippi"),
    retrievalKey: "us_mississippi",
  },
  "Missouri": {
    displayName: "Missouri, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("Missouri", 5),
    retrievalKey: "us_missouri",
  },
  "Montana": {
    displayName: "Montana, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply Montana's Consumer Protection Act (MCA § 30-14-101) — limitation period is 2 years.",
      ...US_STANDARD_NOTES("Montana").slice(1),
    ],
    retrievalKey: "us_montana",
  },
  "Nebraska": {
    displayName: "Nebraska, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("Nebraska", 4),
    retrievalKey: "us_nebraska",
  },
  "Nevada": {
    displayName: "Nevada, United States",
    legalSystemType: "state + federal",
    legalNotes: US_STANDARD_NOTES("Nevada"),
    retrievalKey: "us_nevada",
  },
  "New Hampshire": {
    displayName: "New Hampshire, United States",
    legalSystemType: "state + federal",
    legalNotes: US_STANDARD_NOTES("New Hampshire"),
    retrievalKey: "us_new_hampshire",
  },
  "New Jersey": {
    displayName: "New Jersey, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply New Jersey's Consumer Fraud Act (CFA, N.J.S.A. § 56:8-1) — considered one of the strongest consumer protection statutes in the U.S. Limitation period is 6 years.",
      "CFA can provide treble damages and attorney's fees for successful plaintiffs.",
      "NJ Division of Consumer Affairs is active in enforcement.",
    ],
    retrievalKey: "us_new_jersey",
  },
  "New Mexico": {
    displayName: "New Mexico, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("New Mexico", 4),
    retrievalKey: "us_new_mexico",
  },
  "New York": {
    displayName: "New York, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply New York General Business Law (GBL) §§ 349-350 — limitation period is 3 years. GBL § 349 allows minimum $50 damages and attorney's fees; courts may award up to treble damages for willful violations.",
      "The NY Attorney General's Consumer Frauds Bureau and the NY Department of Financial Services (DFS) are key enforcement bodies.",
      "NYC adds local protections through the NYC Department of Consumer and Worker Protection (if the dispute occurred in New York City).",
    ],
    retrievalKey: "us_new_york",
  },
  "North Carolina": {
    displayName: "North Carolina, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply North Carolina's Unfair and Deceptive Trade Practices Act (UDTPA, N.C.G.S. § 75-1.1) — limitation period is 4 years. Treble damages available for willful violations.",
      ...US_STANDARD_NOTES("North Carolina").slice(1),
    ],
    retrievalKey: "us_north_carolina",
  },
  "North Dakota": {
    displayName: "North Dakota, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("North Dakota", 6),
    retrievalKey: "us_north_dakota",
  },
  "Ohio": {
    displayName: "Ohio, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply Ohio's Consumer Sales Practices Act (CSPA, ORC § 1345.01) — limitation period is 2 years.",
      "The Ohio AG maintains a public database of prior enforcement actions that can support private CSPA lawsuits.",
      "Flag where federal U.S. law also applies.",
    ],
    retrievalKey: "us_ohio",
  },
  "Oklahoma": {
    displayName: "Oklahoma, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply Oklahoma's Consumer Protection Act (15 O.S. § 751) — limitation period is 2 years.",
      ...US_STANDARD_NOTES("Oklahoma").slice(1),
    ],
    retrievalKey: "us_oklahoma",
  },
  "Oregon": {
    displayName: "Oregon, United States",
    legalSystemType: "state + federal",
    legalNotes: US_SHORT_LIMITATION_NOTES("Oregon", 1),
    retrievalKey: "us_oregon",
  },
  "Pennsylvania": {
    displayName: "Pennsylvania, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("Pennsylvania", 6),
    retrievalKey: "us_pennsylvania",
  },
  "Rhode Island": {
    displayName: "Rhode Island, United States",
    legalSystemType: "state + federal",
    legalNotes: US_STANDARD_NOTES("Rhode Island"),
    retrievalKey: "us_rhode_island",
  },
  "South Carolina": {
    displayName: "South Carolina, United States",
    legalSystemType: "state + federal",
    legalNotes: US_STANDARD_NOTES("South Carolina"),
    retrievalKey: "us_south_carolina",
  },
  "South Dakota": {
    displayName: "South Dakota, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply South Dakota's Deceptive Trade Practices and Consumer Protection Act (SDCL § 37-24-1) — limitation period is 2 years.",
      ...US_STANDARD_NOTES("South Dakota").slice(1),
    ],
    retrievalKey: "us_south_dakota",
  },
  "Tennessee": {
    displayName: "Tennessee, United States",
    legalSystemType: "state + federal",
    legalNotes: US_SHORT_LIMITATION_NOTES("Tennessee", 1),
    retrievalKey: "us_tennessee",
  },
  "Texas": {
    displayName: "Texas, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply Texas's Deceptive Trade Practices–Consumer Protection Act (DTPA, Tex. Bus. & Com. Code § 17.41) — limitation period is 2 years. Treble damages available for knowing violations.",
      "Important: Texas DTPA requires a written pre-suit notice to the defendant at least 60 days before filing. Missing this step may bar the claim.",
      "The Texas AG's Consumer Protection Division accepts complaints. Small Claims Court (Justice of the Peace) up to $20,000.",
    ],
    retrievalKey: "us_texas",
  },
  "Utah": {
    displayName: "Utah, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply Utah's Consumer Sales Practices Act (UCSPA, Utah Code § 13-11-1) — limitation period is 2 years.",
      ...US_STANDARD_NOTES("Utah").slice(1),
    ],
    retrievalKey: "us_utah",
  },
  "Vermont": {
    displayName: "Vermont, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("Vermont", 6),
    retrievalKey: "us_vermont",
  },
  "Virginia": {
    displayName: "Virginia, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply Virginia's Consumer Protection Act (VCPA, Va. Code § 59.1-196) — limitation period is 2 years.",
      ...US_STANDARD_NOTES("Virginia").slice(1),
    ],
    retrievalKey: "us_virginia",
  },
  "Washington": {
    displayName: "Washington, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply Washington's Consumer Protection Act (CPA, RCW § 19.86.010) — limitation period is 4 years. The Washington AG's Consumer Protection Division is among the most active in the country.",
      ...US_STANDARD_NOTES("Washington").slice(1),
    ],
    retrievalKey: "us_washington",
  },
  "West Virginia": {
    displayName: "West Virginia, United States",
    legalSystemType: "state + federal",
    legalNotes: [
      "Apply West Virginia's Consumer Credit and Protection Act (WVCCPA, W. Va. Code § 46A-1-101) — limitation period is 2 years.",
      ...US_STANDARD_NOTES("West Virginia").slice(1),
    ],
    retrievalKey: "us_west_virginia",
  },
  "Wisconsin": {
    displayName: "Wisconsin, United States",
    legalSystemType: "state + federal",
    legalNotes: US_STANDARD_NOTES("Wisconsin"),
    retrievalKey: "us_wisconsin",
  },
  "Wyoming": {
    displayName: "Wyoming, United States",
    legalSystemType: "state + federal",
    legalNotes: US_LONG_LIMITATION_NOTES("Wyoming", 4),
    retrievalKey: "us_wyoming",
  },
};

export const LEGAL_JURISDICTIONS = {
  Canada: { regions: CANADA_REGIONS },
  "United States": { regions: US_REGIONS },
};

export const SUPPORTED_COUNTRIES = Object.keys(LEGAL_JURISDICTIONS);

export function getJurisdictionConfig(country: string, region: string): JurisdictionConfig | null {
  const countryData = LEGAL_JURISDICTIONS[country as keyof typeof LEGAL_JURISDICTIONS];
  if (!countryData) return null;
  return countryData.regions[region] ?? null;
}

export function getJurisdictionDisplayName(country: string, region: string): string {
  const config = getJurisdictionConfig(country, region);
  if (config) return config.displayName;
  if (!region) return country;
  return `${region}, ${country}`;
}

export function validateJurisdiction(country: string, region: string): JurisdictionValidationResult {
  if (!country || !region) {
    return {
      valid: false,
      hasFullContext: false,
      warning: "Please select a valid province, territory, or state before generating analysis.",
    };
  }
  const countryData = LEGAL_JURISDICTIONS[country as keyof typeof LEGAL_JURISDICTIONS];
  if (!countryData) {
    return {
      valid: false,
      hasFullContext: false,
      warning: `"${country}" is not a supported country. Please select Canada or United States.`,
    };
  }
  const config = countryData.regions[region];
  if (!config) {
    return {
      valid: true,
      hasFullContext: false,
      warning: `Jurisdiction-specific analysis context for "${region}, ${country}" is currently limited. Results may be incomplete — always verify with a qualified legal professional.`,
    };
  }
  return { valid: true, hasFullContext: true };
}

export function countryCodeToName(code: "CA" | "US"): string {
  return code === "CA" ? "Canada" : "United States";
}

export function countryNameToCode(name: string): "CA" | "US" | null {
  if (name === "Canada") return "CA";
  if (name === "United States") return "US";
  return null;
}

export const CANADA_REGIONS_LIST = Object.keys(CANADA_REGIONS);
export const US_REGIONS_LIST = Object.keys(US_REGIONS);

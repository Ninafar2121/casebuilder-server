import type { JurisdictionLegalKnowledge } from "./types";

export const US_NEW_YORK_KNOWLEDGE: JurisdictionLegalKnowledge = {
  consumer: {
    overview: "Consumer protection in New York is primarily governed by General Business Law (GBL) §§ 349 and 350. GBL § 349 prohibits deceptive acts or practices in the conduct of any business — it has a broad consumer-plaintiff standing rule and provides for minimum damages of $50, up to treble damages (maximum $1,000) for willful violations, plus attorney's fees. GBL § 350 targets false advertising. The NY Attorney General's Consumer Frauds Bureau is a key enforcement body. For NYC consumers, the NYC Department of Consumer and Worker Protection (DCWP) provides additional protection. Small Claims Court in New York City handles up to $10,000; outside NYC, up to $5,000 (some localities $3,000). The statute of limitations for GBL § 349 is 3 years.",
    keyConcepts: [
      "GBL § 349 — deceptive acts and practices; minimum $50 damages; treble up to $1,000; attorney's fees",
      "GBL § 350 — false advertising",
      "NY Attorney General Consumer Frauds Bureau — complaint intake and enforcement",
      "NYC Department of Consumer and Worker Protection (DCWP) — NYC complaints",
      "3-year statute of limitations for GBL §§ 349-350",
      "Small Claims Court: up to $10,000 (NYC); $5,000 (most other NY localities)",
      "Consumer protection applies to goods AND services",
      "UCC Article 2 — sale of goods in New York",
    ],
    riskFactors: [
      "No written contract or receipt",
      "Claim past 3-year limitation period",
      "Business claims full disclosure was made",
      "Arbitration clause in terms of service",
      "Small damages amount relative to cost of litigation",
    ],
    helpfulFactors: [
      "Written contract, invoice, or receipt",
      "Screenshots of advertising or website representations",
      "Email or text showing misrepresentations",
      "NY AG or DCWP complaint filed",
      "Photos of defective product or service failure documentation",
      "Written demand letter before legal action",
    ],
    retrievalSources: ["gbl_349_350_guide", "nyag_consumer_bureau", "dcwp_nyc", "ny_small_claims_guide"],
    lastVerified: "2025-04-01",
    sources: [
      { id: "gbl_349_ny", title: "New York General Business Law § 349 — Deceptive Acts and Practices", url: "https://www.nysenate.gov/legislation/laws/GBS/349", section: "Consumer protection — deceptive acts, minimum $50 damages, attorney's fees", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
      { id: "gbl_350_ny", title: "New York General Business Law § 350 — False Advertising", url: "https://www.nysenate.gov/legislation/laws/GBS/350", section: "False advertising protections", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
      { id: "nyag_consumer_ny", title: "NY Attorney General — Consumer Frauds Bureau", url: "https://ag.ny.gov/consumer-frauds-and-protection", section: "Consumer complaint intake and enforcement", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
      { id: "dcwp_ny", title: "NYC Department of Consumer and Worker Protection (DCWP)", url: "https://www.nyc.gov/site/dca/consumers/file-complaint.page", section: "NYC consumer protection complaints", jurisdiction: "New York City, NY, USA", dateVerified: "2025-04-01" },
    ],
  },

  employment: {
    overview: "New York has strong employment protections at both the state and city level. The New York Labor Law governs wages, hours, and termination. The New York State Human Rights Law (NYSHRL, Executive Law § 290) prohibits workplace discrimination and harassment, and was significantly strengthened by 2019 amendments. The New York City Human Rights Law (NYCHRL) offers even broader protections within NYC. The NY Department of Labor (NYSDOL) handles wage claims. The New York State Division of Human Rights (NYSDHR) and NYC Commission on Human Rights (CCHR) handle discrimination complaints. The NYSHRL applies to employers with 4+ employees; NYCHRL applies to NYC employers with 4+ employees (and in some cases fewer).",
    keyConcepts: [
      "New York Labor Law — minimum wage, overtime, wage theft, notice requirements",
      "NY Department of Labor (NYSDOL) — wage claims",
      "NY State Human Rights Law (NYSHRL, Exec. Law § 290) — discrimination/harassment (4+ employees)",
      "NYC Human Rights Law (NYCHRL, Admin. Code § 8-101) — broader protection; applies in NYC",
      "NY Division of Human Rights (NYSDHR) — state discrimination complaints",
      "NYC Commission on Human Rights (CCHR) — NYC complaints",
      "At-will employment — with important public policy exceptions",
      "Statute of limitations: NYSDOL wage claim 6 years; NYSDHR complaint 1 year (3 years if also court action)",
    ],
    riskFactors: [
      "Claim past applicable limitation period (1 year to NYSDHR; 6 years NYSDOL wage)",
      "Employer classified worker as independent contractor",
      "Employer claims legitimate non-discriminatory reason for adverse action",
      "No documented workplace incidents",
      "Arbitration agreement signed",
    ],
    helpfulFactors: [
      "Written employment agreement",
      "Pay stubs or payroll records",
      "Termination letter or documentation",
      "Performance reviews showing positive history",
      "Emails or texts documenting harassment or discrimination",
      "Witness statements from co-workers",
    ],
    retrievalSources: ["ny_labor_law_guide", "nysdol_wage_claims", "nyshrl_guide", "nychrl_guide", "nysdhr_process"],
    lastVerified: "2025-04-01",
    sources: [
      { id: "nysdol_wage_ny", title: "NY Department of Labor — File a Wage Claim", url: "https://dol.ny.gov/file-complaint", section: "Wage theft and unpaid overtime claims", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
      { id: "nyshrl_ny", title: "New York State Human Rights Law (NYSHRL)", url: "https://www.nysenate.gov/legislation/laws/EXC/A15", section: "Executive Law § 290 — workplace discrimination and harassment", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
      { id: "nysdhr_ny", title: "NY Division of Human Rights — File a Complaint", url: "https://dhr.ny.gov/file-complaint", section: "State discrimination complaint process and timelines", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
      { id: "nychrl_ny", title: "NYC Commission on Human Rights — File a Complaint", url: "https://www.nyc.gov/site/cchr/about/report-discrimination.page", section: "NYC Human Rights Law — broader protections within NYC", jurisdiction: "New York City, NY, USA", dateVerified: "2025-04-01" },
    ],
  },

  landlord_tenant: {
    overview: "New York residential tenancy law is among the most tenant-protective in the U.S. The Housing Stability and Tenant Protection Act of 2019 (HSTPA) significantly strengthened tenant rights. NYC rent-regulated (rent-stabilized and rent-controlled) apartments have specific rules governed by the NY Homes and Community Renewal (HCR) agency. NYC Housing Court handles most residential eviction disputes. For non-NYC tenants, New York State Real Property Law (RPL) and Housing Court apply. Security deposits are limited to 1 month's rent. Eviction requires proper notice and court proceedings — self-help eviction is prohibited.",
    keyConcepts: [
      "Housing Stability and Tenant Protection Act of 2019 (HSTPA) — strengthened tenant rights",
      "NY Rent Stabilization Law / Rent Control — NYC rent-regulated apartments",
      "NY Homes and Community Renewal (HCR) — rent regulation complaints",
      "NYC Housing Court — residential evictions and tenant petitions",
      "Real Property Law (RPL) — New York State rental law",
      "Security deposit — maximum 1 month's rent (all units, HSTPA)",
      "Notice requirements: 30-day (under 1 yr tenancy); 60 days (1-2 years); 90 days (2+ years)",
      "Illegal lockout — prohibited; Housing Court can order restoration",
    ],
    riskFactors: [
      "Rent unpaid — significantly weakens tenant's position in housing court",
      "Non-payment of rent: landlord can initiate eviction in as few as 14 days",
      "No written lease — harder to prove terms",
      "Unit not rent-stabilized — fewer protections outside NYC",
      "Notice defects may be cured by landlord",
    ],
    helpfulFactors: [
      "Signed lease agreement",
      "Rent payment records (receipts, e-transfer, check records)",
      "Written maintenance requests and landlord responses",
      "Photos of habitability issues",
      "Text or email correspondence with landlord",
      "HCR complaint filed (for rent-regulated units)",
    ],
    retrievalSources: ["hstpa_guide", "hcr_rent_regulation", "nyc_housing_court_guide", "rpl_tenancy"],
    lastVerified: "2025-04-01",
    sources: [
      { id: "hcr_ny", title: "NY Homes and Community Renewal (HCR) — Rent Regulation", url: "https://hcr.ny.gov/rent-regulated-apartments", section: "Rent stabilization and rent control information", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
      { id: "nyc_housing_court", title: "NYC Housing Court — Landlord-Tenant Matters", url: "https://www.nycourts.gov/courts/nyc/housing/", section: "Eviction proceedings and tenant defenses in NYC", jurisdiction: "New York City, NY, USA", dateVerified: "2025-04-01" },
    ],
  },

  contract: {
    overview: "Contract disputes in New York are governed by New York common law, the UCC (for goods), and applicable statutes. New York courts apply the 'four corners' doctrine — looking primarily at the written contract terms. Parol evidence is generally excluded for unambiguous contracts. The statute of limitations for written contracts is 6 years; for oral contracts, 6 years as well (CPLR § 213). Small Claims Court handles up to $10,000 (NYC) or $5,000 (upstate). New York is a common choice-of-law jurisdiction for commercial contracts nationwide.",
    keyConcepts: [
      "Common law contract principles — offer, acceptance, consideration, breach",
      "New York UCC (Article 2) — sale of goods",
      "CPLR § 213 — 6-year statute of limitations for contract claims",
      "Four corners rule — unambiguous contracts interpreted on their face",
      "Damages — expectation, reliance, restitution",
      "Small Claims Court — $10,000 (NYC); $5,000 (upstate NY)",
      "Demand letter — strongly recommended before legal action",
    ],
    riskFactors: [
      "Claim past 6-year limitation period",
      "Ambiguous contract language",
      "No written contract — reliance on oral agreement",
      "Other party claims full performance or excuse",
    ],
    helpfulFactors: [
      "Signed written contract",
      "Invoices, purchase orders, emails confirming agreement",
      "Evidence of the breach",
      "Written demand letter before action",
      "Calculation of damages",
    ],
    retrievalSources: ["ny_contract_law_guide", "ny_ucc_article2", "ny_small_claims_guide"],
    lastVerified: "2025-04-01",
    sources: [
      { id: "ny_small_claims_contract", title: "New York Courts — Small Claims", url: "https://www.nycourts.gov/courts/nyc/smallclaims/", section: "Contract disputes up to $10,000 in NYC", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
    ],
  },

  human_rights: {
    overview: "New York prohibits discrimination through the NY State Human Rights Law (NYSHRL) and, within New York City, the NYC Human Rights Law (NYCHRL). The NYCHRL is considered the most protective local anti-discrimination law in the country — it uses a 'uniquely broad and remedial' standard. Protected characteristics under NYCHRL include all NYSHRL categories plus additional ones like status as a victim of domestic violence, unemployment status, and caregiver status. NYSDHR complaints must be filed within 1 year; CCHR complaints within 3 years (NYC); NYSHRL court actions within 3 years.",
    keyConcepts: [
      "NY State Human Rights Law (NYSHRL, Exec. Law § 290) — applies statewide",
      "NYC Human Rights Law (NYCHRL, Admin. Code § 8-101) — strongest local law in U.S.",
      "NY Division of Human Rights (NYSDHR) — state agency complaint (1 year deadline)",
      "NYC Commission on Human Rights (CCHR) — NYC complaint (3 year deadline)",
      "Protected categories — broader than federal under both NYSHRL and NYCHRL",
      "Disability accommodation — duty to engage in cooperative dialogue",
      "Court action under NYSHRL — 3-year statute of limitations",
    ],
    riskFactors: [
      "NYSDHR complaint past 1-year deadline",
      "Employer has documented legitimate reason for adverse action",
      "No direct evidence of discriminatory motive",
    ],
    helpfulFactors: [
      "Evidence of differential treatment on a protected ground",
      "Accommodation requests and employer responses in writing",
      "Medical or expert documentation",
      "Witnesses to discriminatory conduct",
      "Written or electronic communications showing bias",
    ],
    retrievalSources: ["nyshrl_guide", "nychrl_guide", "nysdhr_process", "cchr_nyc_process"],
    lastVerified: "2025-04-01",
    sources: [
      { id: "nyshrl_hr_ny", title: "New York State Human Rights Law (NYSHRL) — Executive Law § 290", url: "https://www.nysenate.gov/legislation/laws/EXC/A15", section: "Protected characteristics and prohibited conduct", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
      { id: "nysdhr_complaint_ny", title: "NY Division of Human Rights — File a Complaint", url: "https://dhr.ny.gov/file-complaint", section: "State human rights complaint process", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
      { id: "cchr_ny", title: "NYC Commission on Human Rights", url: "https://www.nyc.gov/site/cchr/about/report-discrimination.page", section: "NYC Human Rights Law — broader protections", jurisdiction: "New York City, NY, USA", dateVerified: "2025-04-01" },
    ],
  },

  small_claims: {
    overview: "New York's Small Claims Court handles disputes up to $10,000 (NYC, Yonkers, and some cities) or $5,000 (most other localities). Parties can represent themselves, and hearings are held in the evening for accessibility. The process is informal. For commercial claims (business vs. business), Commercial Small Claims applies with a $5,000 limit. CPLR § 213 provides a 6-year limitation for contract claims; personal injury is 3 years. A written demand is strongly recommended before filing.",
    keyConcepts: [
      "Small Claims Court — up to $10,000 (NYC); $5,000 (most other NY localities)",
      "Evening hearings — accessible for working individuals",
      "Informal process — judge actively guides proceedings",
      "Commercial Small Claims — $5,000 for business claims",
      "Limitation period depends on claim type (6 years contract; 3 years personal injury)",
    ],
    riskFactors: [
      "Claim over jurisdictional limit",
      "Claim past applicable limitation period",
      "Defendant located out of state",
      "Weak documentation of the claim",
    ],
    helpfulFactors: [
      "Organized documentation of the claim",
      "Written demand letter sent",
      "Photos, contracts, receipts to support claim",
      "Clear damages calculation",
    ],
    retrievalSources: ["ny_small_claims_guide", "ny_courts_self_help"],
    lastVerified: "2025-04-01",
    sources: [
      { id: "ny_small_claims_general", title: "New York Courts — Small Claims", url: "https://www.nycourts.gov/courts/nyc/smallclaims/", section: "Process, fees, and limits for small claims", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
    ],
  },

  insurance: {
    overview: "Insurance disputes in New York are regulated by the NY Department of Financial Services (DFS), which has broad jurisdiction over both insurance companies and banks. New York has the Insurance Law (NY Ins. Law) governing insurer conduct and policy requirements. Consumers can file complaints with DFS. The DFS also provides a free mediation program for certain property insurance claims. Bad faith insurance practices can give rise to claims under NY Ins. Law § 2601 (unfair claims practices). The limitation period is often specified in the policy (usually 1-2 years).",
    keyConcepts: [
      "NY Department of Financial Services (DFS) — insurance regulation and complaints",
      "Insurance Law (NY Ins. Law) — governing statute for insurance in New York",
      "NY Ins. Law § 2601 — prohibited unfair claims practices",
      "DFS mediation program — free for eligible property insurance disputes",
      "Standard Fire Policy — mandatory provisions in property insurance",
      "Limitation period — often 1-2 years specified in policy",
    ],
    riskFactors: [
      "Claim past policy limitation period",
      "Exclusion clause clearly applies",
      "Misrepresentation at time of application",
      "Insufficient documentation of loss",
    ],
    helpfulFactors: [
      "Insurance policy with all endorsements",
      "Denial letter citing specific policy language",
      "Documentation of loss",
      "DFS complaint filed",
      "Correspondence history with insurer",
    ],
    retrievalSources: ["nydfs_insurance_guide", "ny_insurance_law_overview", "dfs_complaint_process"],
    lastVerified: "2025-04-01",
    sources: [
      { id: "nydfs_insurance_ny", title: "NY Department of Financial Services (DFS) — Insurance Complaints", url: "https://www.dfs.ny.gov/consumers/insurance", section: "Filing an insurance complaint with NYDFS", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
    ],
  },

  financial: {
    overview: "Financial disputes in New York are regulated by the NY Department of Financial Services (DFS) for state-chartered banks and financial companies, and CFPB for federally chartered banks. The DFS has broad authority including the Financial Services Law and Banking Law. New York also has strong anti-predatory lending laws. The NY Attorney General can investigate financial fraud. The Dodd-Frank Act and various federal laws provide additional federal protections.",
    keyConcepts: [
      "NY Department of Financial Services (DFS) — state banking and financial regulation",
      "Consumer Financial Protection Bureau (CFPB) — federal banking complaints",
      "NY Banking Law — governs state-chartered banks",
      "NY Financial Services Law — DFS enforcement authority",
      "Statute of limitations: 6 years for contract claims (CPLR § 213)",
    ],
    riskFactors: [
      "No written documentation of representations",
      "Claim past limitation period",
      "Complex financial product with extensive disclosures signed",
    ],
    helpfulFactors: [
      "Account statements showing disputed transactions",
      "Signed agreements",
      "DFS or CFPB complaint filed",
      "Correspondence showing representations made",
    ],
    retrievalSources: ["nydfs_banking_guide", "cfpb_complaint_guide", "ny_banking_law"],
    lastVerified: "2025-04-01",
    sources: [
      { id: "nydfs_banking_ny", title: "NY Department of Financial Services (DFS) — Banking", url: "https://www.dfs.ny.gov/consumers/banking", section: "Banking complaints and regulated institution oversight", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
      { id: "cfpb_ny", title: "Consumer Financial Protection Bureau (CFPB)", url: "https://www.consumerfinance.gov/complaint/", section: "Federal financial institution complaints", jurisdiction: "USA (Federal)", dateVerified: "2025-04-01" },
    ],
  },

  personal_injury: {
    overview: "Personal injury claims in New York are governed by tort law. New York uses a 'pure comparative negligence' system — plaintiff's recovery is reduced by their percentage of fault. The statute of limitations for personal injury is 3 years (CPLR § 214). Claims against New York City require filing a Notice of Claim within 90 days of the incident before suing. Product liability (strict liability) claims also carry a 3-year limitation. New York courts apply the 'serious injury' threshold for automobile accident tort claims.",
    keyConcepts: [
      "Negligence — duty, breach, causation, damages",
      "Pure comparative negligence — reduces recovery proportionally",
      "CPLR § 214 — 3-year statute of limitations for personal injury",
      "Notice of Claim — 90 days to file against NYC/government before suing",
      "Automobile accidents — 'serious injury' threshold under No-Fault Law (Ins. Law § 5102)",
      "No-Fault auto insurance — basic accident benefits regardless of fault",
      "Product liability — strict liability for defective products (3-year SOL)",
    ],
    riskFactors: [
      "Claim past 3-year limitation",
      "Plaintiff partially at fault (reduces recovery)",
      "Government entity — missed 90-day Notice of Claim deadline",
      "Auto accident — injury may not meet serious injury threshold",
      "Limited or delayed medical treatment",
    ],
    helpfulFactors: [
      "Immediate medical documentation",
      "Incident report filed at time of event",
      "Photos of scene and injury",
      "Independent witness statements",
      "Documentation of expenses and lost income",
    ],
    retrievalSources: ["ny_negligence_guide", "ny_no_fault_auto", "notice_of_claim_nyc", "product_liability_ny"],
    lastVerified: "2025-04-01",
    sources: [
      { id: "ny_courts_civil", title: "New York Courts — Civil Court Self-Help", url: "https://www.nycourts.gov/courthelp/civil/index.shtml", section: "General civil claims and personal injury procedures", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
    ],
  },

  privacy_data: {
    overview: "New York does not yet have a comprehensive consumer privacy law equivalent to California's CCPA, but significant legislation is pending. The SHIELD Act (2019) strengthened New York's data breach notification requirements — businesses must notify affected NY residents of breaches affecting their private information. Federal PIPEDA-equivalent protections apply. The DFS Cybersecurity Regulation (23 NYCRR 500) applies to financial services companies. The NY AG enforces SHIELD Act violations.",
    keyConcepts: [
      "SHIELD Act (2019) — NY data breach notification requirements",
      "NY General Business Law § 899-aa — breach notification law",
      "DFS Cybersecurity Regulation (23 NYCRR 500) — for financial entities",
      "NY AG enforcement — SHIELD Act violations",
      "Federal PIPEDA / CFPB rules apply to federal entities",
      "Statute of limitations: 3 years for personal injury (CPLR § 214); check specific claim",
    ],
    riskFactors: [
      "No documented harm from the breach",
      "Organization qualifies for small business exemption",
      "Data breach covered only trivially regulated data types",
    ],
    helpfulFactors: [
      "Breach notification letter received",
      "Evidence of actual harm from the breach",
      "Privacy policy or terms showing data collection practices",
      "NY AG complaint filed",
    ],
    retrievalSources: ["shield_act_guide", "ny_ag_privacy", "dfs_cybersecurity_regulation"],
    lastVerified: "2025-04-01",
    sources: [
      { id: "ny_ag_privacy", title: "NY Attorney General — Privacy and Data Security", url: "https://ag.ny.gov/privacy", section: "Data breach reporting and consumer privacy rights", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
      { id: "shield_act_ny", title: "NY SHIELD Act — General Business Law § 899-bb", url: "https://www.nysenate.gov/legislation/laws/GBS/899-BB", section: "Data breach notification requirements", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
    ],
  },

  other: {
    overview: "New York provides a range of civil remedies. Small Claims Court handles up to $10,000 (NYC) or $5,000 (most localities). The Supreme Court (NY's general trial court) handles larger civil matters. The 6-year limitation under CPLR § 213 applies to contract claims; 3 years for personal injury. Mediation and arbitration are widely used in New York, especially for commercial matters.",
    keyConcepts: [
      "Small Claims Court — $10,000 NYC; $5,000 most localities",
      "NY Supreme Court — general trial court for larger civil matters",
      "CPLR § 213 — 6-year limitation for contract claims",
      "ADR — mediation widely used",
    ],
    riskFactors: [
      "Unclear legal basis",
      "Claim past limitation period",
      "Damages difficult to prove",
    ],
    helpfulFactors: [
      "Written documentation of the dispute",
      "Clear timeline of events",
      "Written demand letter before proceeding",
    ],
    retrievalSources: ["ny_courts_guide", "ny_mediation_resources"],
    lastVerified: "2025-04-01",
    sources: [
      { id: "ny_courts_general", title: "New York Courts — Self-Help Center", url: "https://www.nycourts.gov/courthelp/", section: "General court navigation and legal resources", jurisdiction: "New York, USA", dateVerified: "2025-04-01" },
    ],
  },
};

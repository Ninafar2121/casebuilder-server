export interface JurisdictionContext {
  country: "Canada" | "United States";
  region: string;
  displayName: string;
  legalSystem: string;
  consumerProtectionFrameworks: string[];
  relevantAgencies: string[];
  commonLimitationPeriods: string[];
  relevantLegalCategories: string[];
  promptContext: string;
  futureDataSources: string[];
}

type JurisdictionEntry = Omit<JurisdictionContext, "country" | "region" | "displayName">;

const CANADA_ENTRIES: Record<string, JurisdictionEntry> = {
  "Alberta": {
    legalSystem: "Canadian federal/provincial law",
    consumerProtectionFrameworks: [
      "Consumer Protection Act (RSA 2000, c C-26.3)",
      "Fair Trading Act (RSA 2000, c F-2)",
      "Residential Tenancies Act, 2004 (SA 2004, c R-17.1)",
      "Alberta Employment Standards Code",
    ],
    relevantAgencies: [
      "Service Alberta – Consumer Investigations Unit",
      "Alberta Superintendent of Insurance",
      "Alberta Civil Claims Tribunal",
      "Court of King's Bench (civil claims over $50,000)",
    ],
    commonLimitationPeriods: [
      "2 years for most civil claims (Limitations Act, RSA 2000, c L-12)",
      "1 year for some Fair Trading Act claims",
    ],
    relevantLegalCategories: [
      "Consumer Protection", "Fair Trading", "Contract Law",
      "Residential Tenancies", "Employment Standards", "Insurance",
    ],
    promptContext:
      "This case is subject to Alberta provincial law and applicable Canadian federal legislation. The key consumer protection statutes are the Consumer Protection Act (RSA 2000) and the Fair Trading Act (RSA 2000), enforced by Service Alberta's Consumer Investigations Unit. The standard limitation period for civil claims in Alberta is 2 years under the Limitations Act. Unfair business practices, misleading representations, and unconscionable transactions may trigger protections under these acts.",
    futureDataSources: ["Alberta legislation database", "Service Alberta consumer guidance", "ABlawg commentary"],
  },

  "British Columbia": {
    legalSystem: "Canadian federal/provincial law",
    consumerProtectionFrameworks: [
      "Business Practices and Consumer Protection Act (BPCPA), SBC 2004, c 2",
      "Consumer Protection BC regulatory framework",
      "Residential Tenancy Act, SBC 2002, c 78",
      "BC Human Rights Code, RSBC 1996, c 210",
      "Employment Standards Act, RSBC 1996, c 113",
    ],
    relevantAgencies: [
      "Consumer Protection BC",
      "BC Civil Resolution Tribunal (CRT) – disputes up to $5,000; strata, ICBC",
      "BC Small Claims Court – up to $35,000",
      "Residential Tenancy Branch",
      "BC Human Rights Tribunal",
    ],
    commonLimitationPeriods: [
      "2 years for most civil claims (Limitation Act, SBC 2012, c 13)",
      "CRT claims should generally be filed promptly",
    ],
    relevantLegalCategories: [
      "Consumer Protection", "Unfair Business Practices", "Contract Law",
      "Residential Tenancies", "Employment Standards", "Human Rights",
    ],
    promptContext:
      "This case falls under British Columbia's Business Practices and Consumer Protection Act (BPCPA, SBC 2004), administered by Consumer Protection BC, which prohibits deceptive and unconscionable acts by suppliers. The BC Civil Resolution Tribunal (CRT) offers an accessible online dispute resolution process for eligible disputes, and the BC Small Claims Court handles civil claims up to $35,000. The limitation period for most civil claims in BC is 2 years under the Limitation Act (SBC 2012). The BPCPA provides both public enforcement and private rights of action for consumers.",
    futureDataSources: ["BC Laws database", "Consumer Protection BC guidance", "CRT decision database"],
  },

  "Manitoba": {
    legalSystem: "Canadian federal/provincial law",
    consumerProtectionFrameworks: [
      "Consumer Protection Act, CCSM c C200",
      "Business Practices Act, CCSM c B120",
      "Residential Tenancies Act, CCSM c R119",
      "Employment Standards Code, CCSM c E110",
    ],
    relevantAgencies: [
      "Consumer Protection Office (Province of Manitoba)",
      "Residential Tenancies Commission",
      "Manitoba Civil Claims Court – up to $10,000",
      "Manitoba Human Rights Commission",
    ],
    commonLimitationPeriods: [
      "2 years for most civil claims (Limitation of Actions Act, SM 2013, c 40)",
    ],
    relevantLegalCategories: [
      "Consumer Protection", "Business Practices", "Contract Law",
      "Residential Tenancies", "Employment Standards",
    ],
    promptContext:
      "This case is governed by Manitoba's Consumer Protection Act (CCSM c C200) and the Business Practices Act (CCSM c B120), which protect consumers from unfair, deceptive, or unconscionable business conduct. The Consumer Protection Office of Manitoba investigates complaints and can take enforcement action. The standard limitation period in Manitoba is 2 years. Small claims up to $10,000 may be filed in Manitoba's Civil Claims Court.",
    futureDataSources: ["Manitoba Laws online", "Consumer Protection Office resources"],
  },

  "New Brunswick": {
    legalSystem: "Canadian federal/provincial law",
    consumerProtectionFrameworks: [
      "Consumer Product Safety Act (federal)",
      "Cost of Credit Disclosure Act, SNB 2002, c C-28.3",
      "Residential Tenancies Act, SNB 1975, c R-10.2",
      "Employment Standards Act, RSNB 1973, c E-7.2",
    ],
    relevantAgencies: [
      "Consumer Affairs Office (Province of New Brunswick)",
      "New Brunswick Financial and Consumer Services Commission (FCNB)",
      "Small Claims Court – up to $20,000",
    ],
    commonLimitationPeriods: [
      "2 years for most civil claims (Limitation of Actions Act, SNB 2009, c L-8.5)",
    ],
    relevantLegalCategories: [
      "Consumer Protection", "Financial Services", "Contract Law",
      "Residential Tenancies", "Employment Standards",
    ],
    promptContext:
      "This case is subject to New Brunswick provincial law and applicable Canadian federal consumer protection legislation, including federal product safety requirements. The Financial and Consumer Services Commission (FCNB) regulates financial services, and the Consumer Affairs Office handles general consumer complaints. The limitation period for most civil claims in New Brunswick is 2 years. Small claims up to $20,000 may be pursued in the New Brunswick Small Claims Court.",
    futureDataSources: ["New Brunswick Acts and Regulations online", "FCNB guidance"],
  },

  "Newfoundland and Labrador": {
    legalSystem: "Canadian federal/provincial law",
    consumerProtectionFrameworks: [
      "Consumer Protection and Business Practices Act, SNL 2009, c C-31.1",
      "Residential Tenancies Act, RSNL 1990, c R-14",
      "Labour Standards Act, RSNL 1990, c L-2",
    ],
    relevantAgencies: [
      "Consumer Affairs Division (Service NL)",
      "Commercial Registrations, Consumer and Financial Services",
      "Small Claims Court – up to $25,000",
    ],
    commonLimitationPeriods: [
      "2 years for most civil claims (Limitations Act, SNL 1995, c L-16.1)",
    ],
    relevantLegalCategories: [
      "Consumer Protection", "Business Practices", "Contract Law",
      "Residential Tenancies", "Employment Standards",
    ],
    promptContext:
      "This case is governed by Newfoundland and Labrador's Consumer Protection and Business Practices Act (SNL 2009), which prohibits unfair practices and unconscionable representations by suppliers. Service NL's Consumer Affairs Division handles consumer complaints and investigations. The limitation period for most civil claims is 2 years, and Small Claims Court accepts claims up to $25,000.",
    futureDataSources: ["Assembly of Newfoundland and Labrador legislation", "Service NL consumer guidance"],
  },

  "Northwest Territories": {
    legalSystem: "Canadian federal/territorial law",
    consumerProtectionFrameworks: [
      "Consumer Protection Act, RSNWT 1988, c C-17",
      "Residential Tenancies Act, RSNWT 1988, c R-5",
      "Employment Standards Act, RSNWT 2007, c 13",
    ],
    relevantAgencies: [
      "Consumer Affairs (Government of Northwest Territories)",
      "Superintendent of Securities",
      "Small Claims Court",
    ],
    commonLimitationPeriods: [
      "2 years for most civil claims (Limitation of Actions Act, RSNWT 1988)",
    ],
    relevantLegalCategories: [
      "Consumer Protection", "Contract Law", "Residential Tenancies", "Employment Standards",
    ],
    promptContext:
      "This case is subject to the Northwest Territories Consumer Protection Act (RSNWT 1988) and applicable federal Canadian legislation. Consumer Affairs within the GNWT handles consumer complaints. Note that the NWT has a smaller judicial infrastructure; many disputes may be resolved through negotiation, mediation, or the territorial Small Claims Court. The standard limitation period is 2 years.",
    futureDataSources: ["NWT Legislation online", "GNWT Consumer Affairs guidance"],
  },

  "Nova Scotia": {
    legalSystem: "Canadian federal/provincial law",
    consumerProtectionFrameworks: [
      "Consumer Protection Act, RSNS 1989, c 92",
      "Residential Tenancies Act, RSNS 1989, c 401",
      "Labour Standards Code, RSNS 1989, c 246",
    ],
    relevantAgencies: [
      "Consumer Affairs Division (Nova Scotia Department of Service Nova Scotia and Internal Services)",
      "Nova Scotia Utility and Review Board",
      "Small Claims Court – up to $25,000",
    ],
    commonLimitationPeriods: [
      "2 years for most civil claims (Limitation of Actions Act, SNS 2014, c 35)",
    ],
    relevantLegalCategories: [
      "Consumer Protection", "Contract Law", "Residential Tenancies", "Employment Standards",
    ],
    promptContext:
      "This case is governed by Nova Scotia's Consumer Protection Act (RSNS 1989), which addresses unfair trade practices, misleading advertising, and unconscionable transactions. The Consumer Affairs Division investigates complaints, and the Nova Scotia Small Claims Court handles civil disputes up to $25,000. The limitation period for most claims is 2 years under the Limitation of Actions Act (SNS 2014).",
    futureDataSources: ["Nova Scotia Legislature online", "Consumer Affairs NS guidance"],
  },

  "Nunavut": {
    legalSystem: "Canadian federal/territorial law",
    consumerProtectionFrameworks: [
      "Consumer Protection Act (as adopted for Nunavut)",
      "Residential Tenancies Act",
      "Employment Standards Act",
    ],
    relevantAgencies: [
      "Department of Justice – Consumer Affairs (Government of Nunavut)",
      "Nunavut Court of Justice (Small Claims division)",
    ],
    commonLimitationPeriods: [
      "2 years for most civil claims",
    ],
    relevantLegalCategories: [
      "Consumer Protection", "Contract Law", "Residential Tenancies", "Employment Standards",
    ],
    promptContext:
      "This case is subject to Nunavut territorial law and applicable Canadian federal consumer protection legislation. Consumer protection matters in Nunavut are handled by the Government of Nunavut Department of Justice. Nunavut has limited local legal infrastructure; many residents may find it most practical to pursue complaints through federal mechanisms (e.g., Competition Bureau, CRTC) or territorial mediation. The standard limitation period is 2 years.",
    futureDataSources: ["Government of Nunavut legislation", "Department of Justice Nunavut guidance"],
  },

  "Ontario": {
    legalSystem: "Canadian federal/provincial law",
    consumerProtectionFrameworks: [
      "Consumer Protection Act, 2002, SO 2002, c 30, Sch A",
      "Real Estate and Business Brokers Act, 2002",
      "Residential Tenancies Act, 2006, SO 2006, c 17",
      "Ontario Human Rights Code, RSO 1990, c H.19",
      "Employment Standards Act, 2000, SO 2000, c 41",
    ],
    relevantAgencies: [
      "Consumer Protection Ontario (CPCO)",
      "Financial Services Regulatory Authority of Ontario (FSRA)",
      "Landlord and Tenant Board (LTB)",
      "Ontario Human Rights Tribunal",
      "Small Claims Court – up to $35,000",
      "Ontario Superior Court of Justice (larger claims)",
    ],
    commonLimitationPeriods: [
      "2 years for most civil claims (Limitations Act, 2002, SO 2002, c 24, Sch B)",
      "Some regulatory complaints may have shorter internal deadlines",
    ],
    relevantLegalCategories: [
      "Consumer Protection", "Contract Law", "Unfair Practices",
      "Residential Tenancies", "Employment Standards", "Human Rights", "Financial Services",
    ],
    promptContext:
      "This case falls under Ontario's Consumer Protection Act, 2002 (CPA), which prohibits unfair practices, false representations, and unconscionable representations by suppliers of goods or services. Consumer Protection Ontario (CPCO) administers the CPA and handles consumer complaints. The standard limitation period in Ontario is 2 years under the Limitations Act, 2002. Small Claims Court handles disputes up to $35,000, while larger matters go to the Ontario Superior Court of Justice. Ontario also has sector-specific agencies including FSRA (financial services) and the Landlord and Tenant Board (residential tenancies).",
    futureDataSources: ["Ontario e-Laws database", "Consumer Protection Ontario guidance", "Landlord and Tenant Board"],
  },

  "Prince Edward Island": {
    legalSystem: "Canadian federal/provincial law",
    consumerProtectionFrameworks: [
      "Consumer Protection Act, RSPEI 1988, c C-19",
      "Residential Tenancies Act, RSPEI 1988, c R-13.1",
      "Employment Standards Act, RSPEI 1988, c E-6.2",
    ],
    relevantAgencies: [
      "Consumer, Labour and Financial Services Division (PEI)",
      "PEI Supreme Court – Small Claims Section (up to $8,000)",
    ],
    commonLimitationPeriods: [
      "2 years for most civil claims (Statute of Limitations, RSPEI 1988)",
    ],
    relevantLegalCategories: [
      "Consumer Protection", "Contract Law", "Residential Tenancies", "Employment Standards",
    ],
    promptContext:
      "This case is governed by Prince Edward Island's Consumer Protection Act (RSPEI 1988), which provides protections against unfair and deceptive business practices. The Consumer, Labour and Financial Services Division handles consumer complaints. PEI's Small Claims Court handles disputes up to $8,000. The limitation period for most civil claims in PEI is 2 years.",
    futureDataSources: ["PEI Legislative Assembly", "Consumer Protection PEI guidance"],
  },

  "Quebec": {
    legalSystem: "Quebec civil law system (Civil Code of Quebec) and Canadian federal law",
    consumerProtectionFrameworks: [
      "Loi sur la protection du consommateur (LPC), CQLR c P-40.1",
      "Civil Code of Quebec, CQLR c CCQ-1991",
      "Charte des droits et libertés de la personne du Québec (Quebec Charter)",
      "Act Respecting Labour Standards (LSA), CQLR c N-1.1",
      "Act Respecting the Régie du logement (now TAL)",
    ],
    relevantAgencies: [
      "Office de la protection du consommateur (OPC) – primary consumer protection body",
      "Tribunal administratif du logement (TAL) – residential housing disputes",
      "Commission des droits de la personne et des droits de la jeunesse (CDPDJ) – human rights",
      "Small Claims Court (Cour des petites créances) – up to $15,000 for individuals",
      "Commission des normes, de l'équité, de la santé et de la sécurité du travail (CNESST) – labour",
    ],
    commonLimitationPeriods: [
      "3 years for most civil claims (Civil Code of Quebec, art. 2925)",
      "1 year for some labour standards claims",
      "Reduced periods may apply for specific consumer matters under LPC",
    ],
    relevantLegalCategories: [
      "Consumer Protection (LPC)", "Civil Law Obligations", "Residential Tenancies",
      "Employment and Labour Standards", "Human Rights", "Financial Services",
    ],
    promptContext:
      "This case is subject to Quebec's Loi sur la protection du consommateur (LPC), one of the strongest consumer protection statutes in Canada, administered by the Office de la protection du consommateur (OPC). Quebec operates under a civil law system based on the Civil Code of Quebec rather than common law, which affects how contracts, obligations, and remedies are interpreted. The general prescription period (limitation period) under the Civil Code of Quebec is 3 years (art. 2925). The OPC has broad powers to investigate, receive complaints, and take action against merchants who violate consumer protections. Consumers may also pursue claims in the Small Claims Court (Cour des petites créances) for amounts up to $15,000.",
    futureDataSources: ["LégisQuébec (official Quebec legislation)", "OPC consumer guidance", "TAL resources"],
  },

  "Saskatchewan": {
    legalSystem: "Canadian federal/provincial law",
    consumerProtectionFrameworks: [
      "Consumer Protection Act, SS 1996, c C-30.1",
      "Business Practices Act, RSS 1978, c B-8",
      "Residential Tenancies Act, 2006, SS 2006, c R-22.0001",
      "Employment Act, SS 2014, c E-9.12",
    ],
    relevantAgencies: [
      "Financial and Consumer Affairs Authority (FCAA) of Saskatchewan",
      "Consumer Protection Division – FCAA",
      "Office of Residential Tenancies",
      "Saskatchewan Human Rights Commission",
      "Small Claims Court – up to $20,000",
    ],
    commonLimitationPeriods: [
      "2 years for most civil claims (Limitations Act, SS 2004, c L-16.1)",
    ],
    relevantLegalCategories: [
      "Consumer Protection", "Business Practices", "Contract Law",
      "Residential Tenancies", "Employment Standards", "Financial Services",
    ],
    promptContext:
      "This case is governed by Saskatchewan's Consumer Protection Act (SS 1996) and the Business Practices Act, which prohibit unfair, deceptive, or unconscionable business conduct. The Financial and Consumer Affairs Authority (FCAA) of Saskatchewan oversees consumer protection enforcement. The limitation period for most civil claims in Saskatchewan is 2 years. Small Claims Court handles disputes up to $20,000.",
    futureDataSources: ["Saskatchewan Legislation online", "FCAA consumer resources"],
  },

  "Yukon": {
    legalSystem: "Canadian federal/territorial law",
    consumerProtectionFrameworks: [
      "Consumer Protection Act, RSY 2002, c 40",
      "Residential Landlord and Tenant Act, RSY 2002, c 193",
      "Employment Standards Act, SY 2002, c 72",
    ],
    relevantAgencies: [
      "Consumer Services Unit (Consumer Affairs Branch, Yukon Government)",
      "Residential Tenancies Office",
      "Small Claims Court – up to $25,000",
    ],
    commonLimitationPeriods: [
      "2 years for most civil claims (Limitation of Actions Act, RSY 2002, c 139)",
    ],
    relevantLegalCategories: [
      "Consumer Protection", "Contract Law", "Residential Tenancies", "Employment Standards",
    ],
    promptContext:
      "This case is subject to Yukon's Consumer Protection Act (RSY 2002), which prohibits misleading advertising, unfair practices, and unconscionable transactions by suppliers. The Yukon Consumer Services Unit handles consumer complaints and enforcement. The limitation period for most civil claims in Yukon is 2 years. Small Claims Court handles disputes up to $25,000.",
    futureDataSources: ["Yukon Legislation online", "Yukon Consumer Services Unit guidance"],
  },
};

const US_ENTRIES: Record<string, JurisdictionEntry> = {
  "Alabama": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Alabama Deceptive Trade Practices Act (ADTPA), Ala. Code § 8-19-1 et seq.",
      "FTC Act (federal), 15 U.S.C. § 45",
      "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Alabama Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)",
      "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $6,000",
    ],
    commonLimitationPeriods: ["1 year under ADTPA; 6 years for written contract claims"],
    relevantLegalCategories: ["Consumer Protection", "Contract Law", "Warranty Law", "Fraud"],
    promptContext:
      "This case is subject to Alabama's Deceptive Trade Practices Act (ADTPA, Ala. Code § 8-19-1), which prohibits deceptive acts and unfair or unconscionable practices in consumer transactions. Note that Alabama's limitation period under the ADTPA is 1 year, which is shorter than many other states. The Alabama Attorney General's Consumer Protection Division accepts complaints, as does the federal FTC. Federal protections including the Magnuson-Moss Warranty Act and CFPB jurisdiction may also apply.",
    futureDataSources: ["Alabama Legislature online", "AG Consumer Protection guidance"],
  },

  "Alaska": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Alaska Unfair Trade Practices and Consumer Protection Act (UTPA), AS 45.50.471 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Alaska Attorney General – Consumer Protection Unit",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $10,000",
    ],
    commonLimitationPeriods: ["3 years under UTPA; 3 years for most civil claims"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Trade Practices", "Contract Law", "Warranty Law"],
    promptContext:
      "This case is governed by Alaska's Unfair Trade Practices and Consumer Protection Act (UTPA, AS 45.50.471), which prohibits unfair methods of competition and unfair or deceptive acts in trade or commerce. The Alaska Attorney General's Consumer Protection Unit handles complaints. The limitation period is 3 years under the UTPA. Small claims may be filed for amounts up to $10,000.",
    futureDataSources: ["Alaska Statutes online", "Alaska AG Consumer Protection guidance"],
  },

  "Arizona": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Arizona Consumer Fraud Act, ARS § 44-1521 et seq.",
      "Arizona Unfair Practices Act, ARS § 44-1401 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Arizona Attorney General – Consumer Information and Complaints",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $3,500",
    ],
    commonLimitationPeriods: ["1 year under Consumer Fraud Act; 6 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Consumer Fraud", "Contract Law", "Warranty Law"],
    promptContext:
      "This case falls under Arizona's Consumer Fraud Act (ARS § 44-1521), which prohibits deceptive and unfair practices in consumer transactions. Note that the Consumer Fraud Act has a 1-year limitation period, which is relatively short — timely action is important. The Arizona Attorney General's office accepts consumer complaints. Small claims up to $3,500 may be pursued in Justice Court. Federal consumer protection frameworks (FTC Act, CFPB) also apply.",
    futureDataSources: ["Arizona Legislature online", "Arizona AG Consumer Protection guidance"],
  },

  "Arkansas": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Arkansas Deceptive Trade Practices Act (ADTPA), Ark. Code Ann. § 4-88-101 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Arkansas Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $5,000",
    ],
    commonLimitationPeriods: ["5 years for most consumer protection claims"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Trade Practices", "Contract Law"],
    promptContext:
      "This case is governed by Arkansas's Deceptive Trade Practices Act (ADTPA, Ark. Code § 4-88-101), which prohibits deceptive and unconscionable conduct in consumer transactions. The Arkansas Attorney General's Consumer Protection Division accepts complaints and may take action. The limitation period for ADTPA claims is 5 years. Small claims may be filed for amounts up to $5,000.",
    futureDataSources: ["Arkansas Code online", "Arkansas AG Consumer Protection guidance"],
  },

  "California": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Consumers Legal Remedies Act (CLRA), Civil Code § 1750 et seq.",
      "Unfair Competition Law (UCL), Bus. & Prof. Code § 17200 et seq.",
      "False Advertising Law (FAL), Bus. & Prof. Code § 17500 et seq.",
      "Song-Beverly Consumer Warranty Act (California Lemon Law)",
      "California Consumer Privacy Act (CCPA)",
      "Tenant Protection Act of 2019 (AB 1482) for rental disputes",
    ],
    relevantAgencies: [
      "California Department of Consumer Affairs (DCA)",
      "California Department of Financial Protection and Innovation (DFPI)",
      "California Civil Rights Department (CRD)",
      "California Attorney General – Consumer Protection Section",
      "Small Claims Court – up to $12,500 (individuals)",
    ],
    commonLimitationPeriods: [
      "3 years for written contracts; 2 years for fraud/personal injury",
      "4 years under UCL; 3 years under CLRA",
    ],
    relevantLegalCategories: [
      "Consumer Protection", "Unfair Business Practices", "False Advertising",
      "Contract Law", "Warranty Law", "Privacy", "Residential Tenancies",
    ],
    promptContext:
      "This case is subject to California's robust consumer protection framework, including the Consumers Legal Remedies Act (CLRA, Civil Code § 1750), the Unfair Competition Law (UCL, Bus. & Prof. Code § 17200), and the False Advertising Law (FAL). California law is generally considered one of the strongest consumer protection regimes in the U.S. The UCL allows a 4-year lookback period; the CLRA allows 3 years. The California Department of Consumer Affairs (DCA) and the Department of Financial Protection and Innovation (DFPI) oversee various industries. Small Claims Court handles disputes up to $12,500 for individuals. Consumers may also pursue class action relief under CLRA and UCL with appropriate standing.",
    futureDataSources: ["California Legislative Information", "DCA guidance", "DFPI resources", "CLRA/UCL case law"],
  },

  "Colorado": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Colorado Consumer Protection Act (CCPA), CRS § 6-1-101 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Colorado Attorney General – Consumer Protection Section",
      "Colorado Division of Insurance (if insurance-related)",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $7,500",
    ],
    commonLimitationPeriods: ["3 years under CCPA; 3 years for most civil claims"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Trade Practices", "Contract Law", "Insurance"],
    promptContext:
      "This case is governed by Colorado's Consumer Protection Act (CCPA, CRS § 6-1-101), which broadly prohibits deceptive trade practices, false advertising, and unconscionable conduct affecting consumers. The Colorado Attorney General's Consumer Protection Section accepts complaints and may investigate. The limitation period is 3 years. Small Claims Court handles disputes up to $7,500.",
    futureDataSources: ["Colorado Legislature online", "Colorado AG Consumer Protection guidance"],
  },

  "Connecticut": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Connecticut Unfair Trade Practices Act (CUTPA), CGS § 42-110a et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Connecticut Department of Consumer Protection",
      "Connecticut Attorney General – Consumer Protection",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $5,000",
    ],
    commonLimitationPeriods: ["3 years under CUTPA"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Trade Practices", "Contract Law", "Warranty Law"],
    promptContext:
      "This case falls under Connecticut's Unfair Trade Practices Act (CUTPA, CGS § 42-110a), which adopts the FTC standard and prohibits unfair or deceptive acts in the conduct of trade or commerce. Connecticut has a dedicated Department of Consumer Protection with broad investigative authority. The limitation period under CUTPA is 3 years. Small Claims Court handles disputes up to $5,000.",
    futureDataSources: ["Connecticut General Statutes online", "CT Department of Consumer Protection guidance"],
  },

  "Delaware": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Delaware Consumer Fraud Act, 6 Del. C. § 2511 et seq.",
      "Delaware Uniform Deceptive Trade Practices Act, 6 Del. C. § 2531 et seq.",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Delaware Attorney General – Consumer Protection Unit",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Court of Common Pleas – Small Claims (up to $15,000)",
    ],
    commonLimitationPeriods: ["3 years for most consumer fraud claims"],
    relevantLegalCategories: ["Consumer Protection", "Consumer Fraud", "Deceptive Trade Practices", "Contract Law"],
    promptContext:
      "This case is governed by Delaware's Consumer Fraud Act (6 Del. C. § 2511), which prohibits fraud, deception, false pretense, and misrepresentation in consumer transactions. The Delaware Attorney General's Consumer Protection Unit investigates complaints and may bring enforcement actions. The limitation period is 3 years. Small claims up to $15,000 may be filed in the Court of Common Pleas.",
    futureDataSources: ["Delaware Code online", "Delaware AG Consumer Protection guidance"],
  },

  "Florida": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Florida Deceptive and Unfair Trade Practices Act (FDUTPA), Fla. Stat. § 501.201 et seq.",
      "Florida Lemon Law, Fla. Stat. § 681.10 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Florida Department of Agriculture and Consumer Services – Consumer Protection",
      "Florida Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $8,000",
    ],
    commonLimitationPeriods: ["4 years under FDUTPA; 4 years for most civil claims"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Trade Practices", "Contract Law", "Warranty Law", "Product Liability"],
    promptContext:
      "This case is subject to Florida's Deceptive and Unfair Trade Practices Act (FDUTPA, Fla. Stat. § 501.201), which broadly prohibits deceptive and unfair methods of competition and practices in the conduct of trade or commerce. FDUTPA provides both a public enforcement mechanism (through the AG and FDACS) and a private right of action for consumers. The limitation period under FDUTPA is 4 years. Small Claims Court handles disputes up to $8,000.",
    futureDataSources: ["Florida Legislature online", "FDACS Consumer Protection guidance", "Florida AG resources"],
  },

  "Georgia": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Georgia Fair Business Practices Act, OCGA § 10-1-390 et seq.",
      "Georgia Uniform Deceptive Trade Practices Act, OCGA § 10-1-370 et seq.",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Georgia Governor's Office of Consumer Protection",
      "Georgia Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (Magistrate Court) – up to $15,000",
    ],
    commonLimitationPeriods: ["2 years under Fair Business Practices Act; 6 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Fair Business Practices", "Contract Law", "Warranty Law"],
    promptContext:
      "This case falls under Georgia's Fair Business Practices Act (OCGA § 10-1-390), which prohibits unfair or deceptive acts or practices in consumer transactions. The Georgia Governor's Office of Consumer Protection accepts complaints and can investigate and mediate disputes. The limitation period under the Fair Business Practices Act is 2 years. Magistrate Court small claims handle disputes up to $15,000.",
    futureDataSources: ["Georgia Code online", "Georgia Consumer Protection guidance"],
  },

  "Hawaii": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Hawaii Unfair Practices Act, HRS § 480-1 et seq.",
      "Hawaii Unfair and Deceptive Practices in Trade, HRS § 481A",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Hawaii Office of Consumer Protection",
      "Hawaii Attorney General",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (District Court) – up to $5,000",
    ],
    commonLimitationPeriods: ["4 years under HRS § 480; 6 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Practices", "Contract Law", "Warranty Law"],
    promptContext:
      "This case is governed by Hawaii's Unfair Practices Act (HRS § 480), which prohibits unfair methods of competition and unfair or deceptive acts in trade or commerce. The Hawaii Office of Consumer Protection investigates complaints. The limitation period is 4 years. Small Claims Court (District Court) handles disputes up to $5,000.",
    futureDataSources: ["Hawaii Revised Statutes online", "Hawaii Office of Consumer Protection guidance"],
  },

  "Idaho": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Idaho Consumer Protection Act, Idaho Code § 48-601 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Idaho Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $5,000",
    ],
    commonLimitationPeriods: ["2 years under Idaho Consumer Protection Act"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Business Practices", "Contract Law"],
    promptContext:
      "This case is subject to Idaho's Consumer Protection Act (Idaho Code § 48-601), which prohibits unfair methods of competition and unfair or deceptive acts or practices in the conduct of trade or commerce. The Idaho Attorney General's Consumer Protection Division handles complaints. The limitation period is 2 years. Small Claims Court handles disputes up to $5,000.",
    futureDataSources: ["Idaho Legislature online", "Idaho AG Consumer Protection guidance"],
  },

  "Illinois": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Illinois Consumer Fraud and Deceptive Business Practices Act, 815 ILCS 505",
      "Illinois Uniform Deceptive Trade Practices Act, 815 ILCS 510",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Illinois Attorney General – Consumer Protection Division",
      "Illinois Department of Financial and Professional Regulation (IDFPR)",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $10,000",
    ],
    commonLimitationPeriods: ["3 years under Consumer Fraud Act; 5 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Consumer Fraud", "Deceptive Business Practices", "Contract Law"],
    promptContext:
      "This case is governed by Illinois's Consumer Fraud and Deceptive Business Practices Act (815 ILCS 505), which broadly prohibits deceptive acts, false representations, and unfair practices in consumer transactions. The Illinois Attorney General's Consumer Protection Division is active in investigating complaints and taking enforcement action. The limitation period is 3 years. Small Claims Court handles disputes up to $10,000.",
    futureDataSources: ["Illinois Compiled Statutes online", "Illinois AG Consumer Protection guidance"],
  },

  "Indiana": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Indiana Deceptive Consumer Sales Act (DCSA), IC 24-5-0.5-1 et seq.",
      "Indiana Home Improvement Contracts Act",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Indiana Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $10,000",
    ],
    commonLimitationPeriods: ["2 years under DCSA; 6 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Sales Practices", "Contract Law", "Warranty Law"],
    promptContext:
      "This case falls under Indiana's Deceptive Consumer Sales Act (DCSA, IC 24-5-0.5), which prohibits deceptive and unconscionable consumer sales acts. The Indiana Attorney General's Consumer Protection Division accepts complaints. The limitation period under DCSA is 2 years. Small Claims Court handles disputes up to $10,000.",
    futureDataSources: ["Indiana Code online", "Indiana AG Consumer Protection guidance"],
  },

  "Iowa": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Iowa Consumer Fraud Act, Iowa Code § 714H",
      "Iowa Uniform Deceptive Trade Practices Act, Iowa Code § 714",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Iowa Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $6,500",
    ],
    commonLimitationPeriods: ["5 years under Iowa Consumer Fraud Act"],
    relevantLegalCategories: ["Consumer Protection", "Consumer Fraud", "Contract Law"],
    promptContext:
      "This case is governed by Iowa's Consumer Fraud Act (Iowa Code § 714H), which prohibits fraud, deception, and misrepresentation in consumer transactions. Iowa's limitation period for consumer fraud claims is 5 years, which is relatively generous. The Iowa Attorney General's Consumer Protection Division handles complaints and investigates. Small Claims Court handles disputes up to $6,500.",
    futureDataSources: ["Iowa Legislature online", "Iowa AG Consumer Protection guidance"],
  },

  "Kansas": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Kansas Consumer Protection Act (KCPA), KSA § 50-623 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Kansas Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $4,000",
    ],
    commonLimitationPeriods: ["3 years under KCPA"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Practices", "Contract Law"],
    promptContext:
      "This case is subject to Kansas's Consumer Protection Act (KCPA, KSA § 50-623), which prohibits deceptive and unconscionable acts in consumer transactions. The Kansas Attorney General's Consumer Protection Division accepts complaints. The limitation period is 3 years. Small Claims Court handles disputes up to $4,000.",
    futureDataSources: ["Kansas Legislature online", "Kansas AG Consumer Protection guidance"],
  },

  "Kentucky": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Kentucky Consumer Protection Act (KCPA), KRS § 367.110 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Kentucky Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $2,500",
    ],
    commonLimitationPeriods: ["5 years under KCPA; 5 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Trade Practices", "Contract Law"],
    promptContext:
      "This case falls under Kentucky's Consumer Protection Act (KCPA, KRS § 367.110), which broadly prohibits unfair, false, misleading, or deceptive acts in the conduct of trade or commerce. The Kentucky Attorney General's Consumer Protection Division accepts complaints and investigates. The limitation period is 5 years. Note that Kentucky's small claims limit is relatively low ($2,500).",
    futureDataSources: ["Kentucky Legislature online", "Kentucky AG Consumer Protection guidance"],
  },

  "Louisiana": {
    legalSystem: "U.S. federal/state law (civil law tradition, derived from French/Spanish law)",
    consumerProtectionFrameworks: [
      "Louisiana Unfair Trade Practices and Consumer Protection Law (LUTPA), La. R.S. § 51:1401 et seq.",
      "Louisiana Civil Code",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Louisiana Attorney General – Consumer Protection Section",
      "Louisiana Office of Financial Institutions",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $5,000",
    ],
    commonLimitationPeriods: ["1 year under LUTPA – very short, timely action is critical"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Trade Practices", "Civil Law Obligations", "Contract Law"],
    promptContext:
      "This case is governed by Louisiana's Unfair Trade Practices and Consumer Protection Law (LUTPA, La. R.S. § 51:1401), which prohibits unfair methods of competition and unfair or deceptive acts in trade. Critically, Louisiana has a 1-year limitation period under LUTPA — one of the shortest in the U.S. — so timely action is essential. Louisiana also operates under a civil law tradition (unlike most U.S. states) based on the Civil Code, which affects contractual interpretation. The Louisiana AG's Consumer Protection Section accepts complaints.",
    futureDataSources: ["Louisiana Legislature online", "Louisiana AG Consumer Protection guidance"],
  },

  "Maine": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Maine Unfair Trade Practices Act, 5 M.R.S. §§ 205-A to 214",
      "Maine Consumer Credit Code",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Maine Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $6,000",
    ],
    commonLimitationPeriods: ["6 years under Maine UTPA"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Trade Practices", "Contract Law", "Credit"],
    promptContext:
      "This case is subject to Maine's Unfair Trade Practices Act (5 M.R.S. § 205-A), which prohibits unfair methods of competition and unfair or deceptive acts in trade or commerce. Maine has a relatively long 6-year limitation period for UTPA claims. The Maine Attorney General's Consumer Protection Division handles complaints. Small Claims Court handles disputes up to $6,000.",
    futureDataSources: ["Maine Legislature online", "Maine AG Consumer Protection guidance"],
  },

  "Maryland": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Maryland Consumer Protection Act (MCPA), Md. Code, Com. Law § 13-101 et seq.",
      "Maryland Consumer Debt Collection Act",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Maryland Attorney General – Consumer Protection Division",
      "Maryland Department of Labor – Financial Regulation Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (District Court) – up to $5,000",
    ],
    commonLimitationPeriods: ["3 years under MCPA; 3 years for most civil claims"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Practices", "Contract Law", "Debt Collection"],
    promptContext:
      "This case falls under Maryland's Consumer Protection Act (MCPA, Md. Code, Com. Law § 13-101), which broadly prohibits unfair, abusive, and deceptive trade practices. The Maryland AG's Consumer Protection Division is one of the more active in the country. The limitation period is 3 years. Small Claims Court (District Court) handles disputes up to $5,000.",
    futureDataSources: ["Maryland Code online", "Maryland AG Consumer Protection guidance"],
  },

  "Massachusetts": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Massachusetts Consumer Protection Act, G.L. c. 93A",
      "Massachusetts Debt Collection Regulations, 940 CMR 7.00",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Massachusetts Attorney General – Consumer Protection Division",
      "Massachusetts Division of Banks",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $7,000",
    ],
    commonLimitationPeriods: ["4 years under G.L. c. 93A; 6 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Business Practices", "Contract Law", "Warranty Law"],
    promptContext:
      "This case is governed by Massachusetts's Consumer Protection Act (G.L. c. 93A), which prohibits unfair or deceptive acts or practices in the conduct of trade or commerce. Chapter 93A is considered one of the stronger state consumer protection statutes and allows private rights of action with the possibility of multiple damages. The limitation period is 4 years. Consumers must send a demand letter to the business at least 30 days before filing suit under c. 93A. Small Claims Court handles disputes up to $7,000.",
    futureDataSources: ["Massachusetts General Laws online", "Massachusetts AG Consumer Protection guidance"],
  },

  "Michigan": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Michigan Consumer Protection Act (MCPA), MCL § 445.901 et seq.",
      "Michigan Regulation of Collection Practices Act",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Michigan Attorney General – Consumer Protection Team",
      "Michigan Department of Insurance and Financial Services (DIFS)",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (District Court) – up to $6,500",
    ],
    commonLimitationPeriods: ["6 years under MCPA; 6 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Business Practices", "Contract Law", "Insurance"],
    promptContext:
      "This case falls under Michigan's Consumer Protection Act (MCPA, MCL § 445.901), which prohibits unfair, unconscionable, or deceptive methods and practices in trade or commerce. The limitation period under MCPA is 6 years. The Michigan AG's Consumer Protection Team and the Department of Insurance and Financial Services (DIFS) handle sector-specific complaints. Small Claims Court handles disputes up to $6,500.",
    futureDataSources: ["Michigan Legislature online", "Michigan AG Consumer Protection guidance"],
  },

  "Minnesota": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Minnesota Consumer Fraud Act, Minn. Stat. § 325F.68 et seq.",
      "Minnesota Deceptive Trade Practices Act, Minn. Stat. § 325D.43 et seq.",
      "Minnesota False Advertising Act",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Minnesota Attorney General – Consumer Protection Division",
      "Minnesota Department of Commerce",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (Conciliation Court) – up to $15,000",
    ],
    commonLimitationPeriods: ["6 years under Consumer Fraud Act; 6 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Consumer Fraud", "Deceptive Practices", "Contract Law"],
    promptContext:
      "This case is subject to Minnesota's Consumer Fraud Act (Minn. Stat. § 325F.68) and related consumer protection statutes. Minnesota has a generous 6-year limitation period for consumer fraud claims. The Minnesota AG's Consumer Protection Division is active in enforcement. Conciliation Court (small claims) handles disputes up to $15,000.",
    futureDataSources: ["Minnesota Legislature online", "Minnesota AG Consumer Protection guidance"],
  },

  "Mississippi": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Mississippi Consumer Protection Act, Miss. Code Ann. § 75-24-1 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Mississippi Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (Justice Court) – up to $3,500",
    ],
    commonLimitationPeriods: ["3 years under Consumer Protection Act"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Practices", "Contract Law"],
    promptContext:
      "This case is governed by Mississippi's Consumer Protection Act (Miss. Code Ann. § 75-24-1), which prohibits unfair or deceptive trade practices. The Mississippi Attorney General's Consumer Protection Division accepts complaints. The limitation period is 3 years. Justice Court (small claims) handles disputes up to $3,500.",
    futureDataSources: ["Mississippi Code online", "Mississippi AG Consumer Protection guidance"],
  },

  "Missouri": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Missouri Merchandising Practices Act (MMPA), RSMo § 407.010 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Missouri Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $5,000",
    ],
    commonLimitationPeriods: ["5 years under MMPA; 5 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Merchandising Practices", "Contract Law", "Warranty Law"],
    promptContext:
      "This case falls under Missouri's Merchandising Practices Act (MMPA, RSMo § 407.010), which prohibits deception, fraud, false pretense, and other unfair practices in merchandise sales and services. The MMPA has been interpreted broadly by Missouri courts. The limitation period is 5 years. Small Claims Court handles disputes up to $5,000.",
    futureDataSources: ["Missouri Revisor of Statutes online", "Missouri AG Consumer Protection guidance"],
  },

  "Montana": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Montana Consumer Protection Act (MCPA), MCA § 30-14-101 et seq.",
      "Montana Unfair Trade Practices Act",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Montana Attorney General – Consumer Protection Office",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (Justice Court) – up to $7,000",
    ],
    commonLimitationPeriods: ["2 years under MCPA"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Trade Practices", "Contract Law"],
    promptContext:
      "This case is governed by Montana's Consumer Protection Act (MCA § 30-14-101), which prohibits unfair methods of competition and unfair or deceptive acts in trade or commerce. The Montana AG's Consumer Protection Office accepts complaints. The limitation period is 2 years. Small Claims Court handles disputes up to $7,000.",
    futureDataSources: ["Montana Code Annotated online", "Montana AG Consumer Protection guidance"],
  },

  "Nebraska": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Nebraska Consumer Protection Act, Neb. Rev. Stat. § 59-1601 et seq.",
      "Nebraska Uniform Deceptive Trade Practices Act",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Nebraska Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $3,600",
    ],
    commonLimitationPeriods: ["4 years under Consumer Protection Act"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Trade Practices", "Contract Law"],
    promptContext:
      "This case is subject to Nebraska's Consumer Protection Act (Neb. Rev. Stat. § 59-1601), which prohibits unfair methods of competition and deceptive acts or practices in trade or commerce. The Nebraska AG's Consumer Protection Division accepts complaints. The limitation period is 4 years. Note that Nebraska's small claims limit is relatively low ($3,600).",
    futureDataSources: ["Nebraska Legislature online", "Nebraska AG Consumer Protection guidance"],
  },

  "Nevada": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Nevada Deceptive Trade Practices Act, NRS § 598.0903 et seq.",
      "Nevada Consumer Protection Laws, NRS ch. 598",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Nevada Attorney General – Consumer Protection Division",
      "Nevada Division of Financial Institutions",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $10,000",
    ],
    commonLimitationPeriods: ["3 years for most consumer protection claims"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Trade Practices", "Contract Law", "Financial Services"],
    promptContext:
      "This case falls under Nevada's Deceptive Trade Practices Act (NRS § 598.0903), which prohibits a broad range of deceptive and unfair acts in consumer transactions. The Nevada AG's Consumer Protection Division accepts complaints. The limitation period is 3 years. Small Claims Court handles disputes up to $10,000.",
    futureDataSources: ["Nevada Revised Statutes online", "Nevada AG Consumer Protection guidance"],
  },

  "New Hampshire": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "New Hampshire Consumer Protection Act, RSA 358-A",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "New Hampshire Attorney General – Consumer Protection Bureau",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (District Court) – up to $7,500",
    ],
    commonLimitationPeriods: ["3 years under RSA 358-A"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Practices", "Contract Law"],
    promptContext:
      "This case is governed by New Hampshire's Consumer Protection Act (RSA 358-A), which prohibits unfair or deceptive acts or practices in trade or commerce. The New Hampshire AG's Consumer Protection Bureau investigates complaints. The limitation period is 3 years. Small Claims Court (District Court) handles disputes up to $7,500.",
    futureDataSources: ["New Hampshire Legislature online", "New Hampshire AG Consumer Protection guidance"],
  },

  "New Jersey": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "New Jersey Consumer Fraud Act (CFA), N.J.S.A. § 56:8-1 et seq.",
      "New Jersey Truth in Consumer Contract, Warranty and Notice Act (TCCWNA)",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "New Jersey Division of Consumer Affairs",
      "New Jersey Attorney General",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (Special Civil Part) – up to $5,000",
    ],
    commonLimitationPeriods: ["6 years under CFA; 6 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Consumer Fraud", "Warranty Law", "Contract Law"],
    promptContext:
      "This case is subject to New Jersey's Consumer Fraud Act (CFA, N.J.S.A. § 56:8-1), which is considered one of the strongest consumer protection statutes in the U.S. The CFA prohibits unconscionable commercial practices, deception, fraud, and misrepresentation, and provides for treble damages and attorney's fees in successful private actions. The limitation period is 6 years. New Jersey's Division of Consumer Affairs accepts complaints and conducts investigations.",
    futureDataSources: ["New Jersey Statutes online", "NJ Division of Consumer Affairs guidance"],
  },

  "New Mexico": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "New Mexico Unfair Practices Act (UPA), NMSA 1978 § 57-12-1 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "New Mexico Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (Magistrate Court) – up to $10,000",
    ],
    commonLimitationPeriods: ["4 years under UPA"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Practices", "Contract Law"],
    promptContext:
      "This case falls under New Mexico's Unfair Practices Act (UPA, NMSA § 57-12-1), which prohibits unfair or deceptive trade practices and unconscionable trade practices. The New Mexico AG's Consumer Protection Division accepts complaints. The limitation period is 4 years. Magistrate Court handles small claims up to $10,000.",
    futureDataSources: ["New Mexico Statutes online", "New Mexico AG Consumer Protection guidance"],
  },

  "New York": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "New York General Business Law (GBL) §§ 349-350 (Consumer Protection from Deceptive Acts and Practices)",
      "New York Lemon Law, GBL § 198-a",
      "New York Predatory Lending Law",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "New York Attorney General – Consumer Frauds and Protection Bureau",
      "New York Department of Financial Services (DFS)",
      "New York City Department of Consumer and Worker Protection (if applicable)",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $10,000",
    ],
    commonLimitationPeriods: ["3 years under GBL § 349; 6 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Consumer Fraud", "Deceptive Practices", "Financial Services", "Warranty Law"],
    promptContext:
      "This case is governed by New York General Business Law §§ 349-350, which prohibit deceptive acts or practices and false advertising in the conduct of any business, trade, or commerce in New York. GBL § 349 provides a private right of action and allows recovery of actual damages (minimum $50) plus attorney's fees; courts may award up to three times actual damages for willful violations. The limitation period under GBL § 349 is 3 years. The New York AG's Consumer Frauds and Protection Bureau is active in enforcement. Small Claims Court handles disputes up to $10,000.",
    futureDataSources: ["New York State Legislature online", "New York AG Consumer Protection guidance", "DFS resources"],
  },

  "North Carolina": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "North Carolina Unfair and Deceptive Trade Practices Act (UDTPA), N.C.G.S. § 75-1.1 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "North Carolina Attorney General – Consumer Protection Division",
      "North Carolina Department of Insurance",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (Magistrate Court) – up to $10,000",
    ],
    commonLimitationPeriods: ["4 years under UDTPA; 3 years for most civil claims"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Trade Practices", "Contract Law", "Insurance"],
    promptContext:
      "This case is subject to North Carolina's Unfair and Deceptive Trade Practices Act (UDTPA, N.C.G.S. § 75-1.1), which broadly prohibits unfair or deceptive acts or practices in commerce. UDTPA allows treble damages for willful violations, making it a powerful consumer protection tool. The limitation period under UDTPA is 4 years. The North Carolina AG's Consumer Protection Division accepts complaints. Magistrate Court handles small claims up to $10,000.",
    futureDataSources: ["North Carolina General Statutes online", "NC AG Consumer Protection guidance"],
  },

  "North Dakota": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "North Dakota Consumer Fraud Act, NDCC § 51-15-01 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "North Dakota Attorney General – Consumer Protection and Antitrust Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $15,000",
    ],
    commonLimitationPeriods: ["6 years under Consumer Fraud Act"],
    relevantLegalCategories: ["Consumer Protection", "Consumer Fraud", "Contract Law"],
    promptContext:
      "This case falls under North Dakota's Consumer Fraud Act (NDCC § 51-15-01), which prohibits fraudulent, deceptive, and misleading acts in connection with the sale of goods or services. North Dakota has a 6-year limitation period. The AG's Consumer Protection Division accepts complaints. Small Claims Court handles disputes up to $15,000.",
    futureDataSources: ["North Dakota Legislative Branch online", "North Dakota AG Consumer Protection guidance"],
  },

  "Ohio": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Ohio Consumer Sales Practices Act (CSPA), ORC § 1345.01 et seq.",
      "Ohio Home Solicitation Sales Act",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Ohio Attorney General – Consumer Protection Section",
      "Ohio Department of Commerce – Division of Financial Institutions",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (Municipal/County Court) – up to $6,000",
    ],
    commonLimitationPeriods: ["2 years under CSPA; 6 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Consumer Sales Practices", "Contract Law", "Financial Services"],
    promptContext:
      "This case is governed by Ohio's Consumer Sales Practices Act (CSPA, ORC § 1345.01), which prohibits unfair or deceptive acts or practices in consumer transactions. The Ohio AG's Consumer Protection Section actively investigates complaints and maintains a database of prior enforcement actions that can support private lawsuits. The limitation period under CSPA is 2 years. Small Claims Court handles disputes up to $6,000.",
    futureDataSources: ["Ohio Revised Code online", "Ohio AG Consumer Protection guidance"],
  },

  "Oklahoma": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Oklahoma Consumer Protection Act, 15 O.S. § 751 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Oklahoma Attorney General – Consumer Protection Unit",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $10,000",
    ],
    commonLimitationPeriods: ["2 years under Consumer Protection Act"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Practices", "Contract Law"],
    promptContext:
      "This case falls under Oklahoma's Consumer Protection Act (15 O.S. § 751), which prohibits deceptive trade practices and unfair or unconscionable acts in consumer transactions. The Oklahoma AG's Consumer Protection Unit accepts complaints. The limitation period is 2 years. Small Claims Court handles disputes up to $10,000.",
    futureDataSources: ["Oklahoma Statutes online", "Oklahoma AG Consumer Protection guidance"],
  },

  "Oregon": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Oregon Unlawful Trade Practices Act (UTPA), ORS § 646.605 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Oregon Attorney General – Consumer Protection",
      "Oregon Division of Financial Regulation",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $10,000",
    ],
    commonLimitationPeriods: ["1 year under UTPA (short — timely action is critical)"],
    relevantLegalCategories: ["Consumer Protection", "Unlawful Trade Practices", "Contract Law"],
    promptContext:
      "This case is subject to Oregon's Unlawful Trade Practices Act (UTPA, ORS § 646.605), which prohibits a broad range of deceptive and unfair acts in consumer transactions. Important note: Oregon's UTPA has a 1-year limitation period, which is among the shortest in the country — taking timely action is critical. The Oregon AG's Consumer Protection Section accepts complaints. Small Claims Court handles disputes up to $10,000.",
    futureDataSources: ["Oregon Revised Statutes online", "Oregon AG Consumer Protection guidance"],
  },

  "Pennsylvania": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Pennsylvania Unfair Trade Practices and Consumer Protection Law (UTPCPL), 73 P.S. § 201-1 et seq.",
      "Pennsylvania Fair Credit Extension Uniformity Act",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Pennsylvania Attorney General – Bureau of Consumer Protection",
      "Pennsylvania Department of Banking and Securities",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (Magisterial District Courts) – up to $12,000",
    ],
    commonLimitationPeriods: ["6 years under UTPCPL; 4 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Trade Practices", "Contract Law", "Financial Services"],
    promptContext:
      "This case is governed by Pennsylvania's Unfair Trade Practices and Consumer Protection Law (UTPCPL, 73 P.S. § 201-1), which prohibits unfair or deceptive acts or practices in commerce. Pennsylvania has a generous 6-year limitation period under the UTPCPL. The PA AG's Bureau of Consumer Protection is active in enforcement and accepts complaints. Small Claims Court (Magisterial District Courts) handles disputes up to $12,000.",
    futureDataSources: ["Pennsylvania Consolidated Statutes online", "Pennsylvania AG Consumer Protection guidance"],
  },

  "Rhode Island": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Rhode Island Deceptive Trade Practices Act, R.I. Gen. Laws § 6-13.1-1 et seq.",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Rhode Island Attorney General – Consumer Protection Unit",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $2,500",
    ],
    commonLimitationPeriods: ["10 years under Deceptive Trade Practices Act; however, verify current statutes"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Trade Practices", "Contract Law"],
    promptContext:
      "This case falls under Rhode Island's Deceptive Trade Practices Act (R.I. Gen. Laws § 6-13.1-1), which prohibits unfair or deceptive acts or practices in commerce. The Rhode Island AG's Consumer Protection Unit accepts complaints. Note that Rhode Island's Small Claims Court limit is relatively low ($2,500). Federal protections via FTC and CFPB also apply.",
    futureDataSources: ["Rhode Island General Laws online", "Rhode Island AG Consumer Protection guidance"],
  },

  "South Carolina": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "South Carolina Unfair Trade Practices Act (SCUTPA), S.C. Code § 39-5-10 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "South Carolina Attorney General – Consumer Protection Division",
      "South Carolina Department of Consumer Affairs (SCDCA)",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (Magistrate Court) – up to $7,500",
    ],
    commonLimitationPeriods: ["3 years under SCUTPA"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Trade Practices", "Contract Law"],
    promptContext:
      "This case is subject to South Carolina's Unfair Trade Practices Act (SCUTPA, S.C. Code § 39-5-10), which prohibits unfair or deceptive acts or practices in trade or commerce. Both the AG's Consumer Protection Division and the SC Department of Consumer Affairs (SCDCA) handle consumer complaints. The limitation period is 3 years. Magistrate Court handles small claims up to $7,500.",
    futureDataSources: ["South Carolina Legislature online", "South Carolina AG Consumer Protection guidance"],
  },

  "South Dakota": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "South Dakota Deceptive Trade Practices and Consumer Protection Act, SDCL § 37-24-1 et seq.",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "South Dakota Attorney General – Consumer Protection",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $12,000",
    ],
    commonLimitationPeriods: ["2 years under Consumer Protection Act"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Trade Practices", "Contract Law"],
    promptContext:
      "This case is governed by South Dakota's Deceptive Trade Practices and Consumer Protection Act (SDCL § 37-24-1), which prohibits deceptive and fraudulent acts in consumer transactions. The South Dakota AG's Consumer Protection division accepts complaints. The limitation period is 2 years. Small Claims Court handles disputes up to $12,000.",
    futureDataSources: ["South Dakota Codified Laws online", "South Dakota AG Consumer Protection guidance"],
  },

  "Tennessee": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Tennessee Consumer Protection Act (TCPA), T.C.A. § 47-18-101 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Tennessee Attorney General – Consumer Affairs Division",
      "Tennessee Department of Commerce and Insurance",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (General Sessions) – up to $25,000",
    ],
    commonLimitationPeriods: ["1 year under TCPA — timely action is important"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Practices", "Contract Law", "Insurance"],
    promptContext:
      "This case falls under Tennessee's Consumer Protection Act (TCPA, T.C.A. § 47-18-101), which broadly prohibits unfair or deceptive acts or practices affecting consumers. Important: Tennessee has a 1-year limitation period under the TCPA, which is short — timely action is critical. The Tennessee AG's Consumer Affairs Division accepts complaints. General Sessions Court (small claims) handles disputes up to $25,000.",
    futureDataSources: ["Tennessee Code Annotated online", "Tennessee AG Consumer Protection guidance"],
  },

  "Texas": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Texas Deceptive Trade Practices–Consumer Protection Act (DTPA), Tex. Bus. & Com. Code § 17.41 et seq.",
      "Texas Insurance Code (for insurance disputes)",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Texas Attorney General – Consumer Protection Division",
      "Texas Department of Insurance (TDI)",
      "Texas Office of Public Insurance Counsel (OPIC)",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (Justice of the Peace) – up to $20,000",
    ],
    commonLimitationPeriods: ["2 years under DTPA (with pre-suit notice requirements)"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Trade Practices", "Contract Law", "Insurance", "Warranty Law"],
    promptContext:
      "This case is governed by Texas's Deceptive Trade Practices–Consumer Protection Act (DTPA, Tex. Bus. & Com. Code § 17.41), which prohibits deceptive trade practices and false representations in consumer transactions. The DTPA provides for treble damages for knowing violations and attorney's fees. The limitation period is 2 years, but importantly DTPA requires a pre-suit written notice to the defendant at least 60 days before filing suit. The Texas AG's Consumer Protection Division accepts complaints. Small Claims Court (Justice of the Peace) handles disputes up to $20,000.",
    futureDataSources: ["Texas Statutes online", "Texas AG Consumer Protection guidance"],
  },

  "Utah": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Utah Consumer Sales Practices Act (UCSPA), Utah Code § 13-11-1 et seq.",
      "Utah Truth in Advertising Act",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Utah Attorney General – Consumer Protection Division",
      "Utah Division of Consumer Protection",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $11,000",
    ],
    commonLimitationPeriods: ["2 years under UCSPA"],
    relevantLegalCategories: ["Consumer Protection", "Consumer Sales Practices", "Contract Law"],
    promptContext:
      "This case is subject to Utah's Consumer Sales Practices Act (UCSPA, Utah Code § 13-11-1), which prohibits deceptive and unconscionable acts in consumer sales transactions. Utah also has a dedicated Division of Consumer Protection that accepts complaints and investigates. The limitation period is 2 years. Small Claims Court handles disputes up to $11,000.",
    futureDataSources: ["Utah Code online", "Utah Division of Consumer Protection guidance"],
  },

  "Vermont": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Vermont Consumer Fraud Act, 9 V.S.A. § 2451 et seq.",
      "Vermont Lemon Law",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Vermont Attorney General – Consumer Assistance Program (CAP)",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $5,000",
    ],
    commonLimitationPeriods: ["6 years under Consumer Fraud Act"],
    relevantLegalCategories: ["Consumer Protection", "Consumer Fraud", "Contract Law", "Warranty Law"],
    promptContext:
      "This case falls under Vermont's Consumer Fraud Act (9 V.S.A. § 2451), which prohibits unfair or deceptive acts in commerce. Vermont has a generous 6-year limitation period. The Vermont AG's Consumer Assistance Program (CAP) is a particularly accessible resource for mediating consumer-business disputes before formal litigation. Small Claims Court handles disputes up to $5,000.",
    futureDataSources: ["Vermont Legislature online", "Vermont AG Consumer Assistance Program guidance"],
  },

  "Virginia": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Virginia Consumer Protection Act (VCPA), Va. Code § 59.1-196 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Virginia Attorney General – Consumer Protection Section",
      "Virginia State Corporation Commission (SCC) for financial/utility issues",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (General District Court) – up to $5,000",
    ],
    commonLimitationPeriods: ["2 years under VCPA; 5 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Fraud", "Contract Law", "Financial Services"],
    promptContext:
      "This case is governed by Virginia's Consumer Protection Act (VCPA, Va. Code § 59.1-196), which prohibits fraudulent acts or practices, false representations, and deceptive advertising in consumer transactions. The Virginia AG's Consumer Protection Section accepts complaints and investigates. The limitation period under VCPA is 2 years. Small Claims Court (General District Court) handles disputes up to $5,000.",
    futureDataSources: ["Virginia Law online", "Virginia AG Consumer Protection guidance"],
  },

  "Washington": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Washington Consumer Protection Act (CPA), RCW § 19.86.010 et seq.",
      "Washington Residential Landlord-Tenant Act",
      "Washington Lemon Law",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Washington Attorney General – Consumer Protection Division",
      "Washington Department of Financial Institutions (DFI)",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $10,000",
    ],
    commonLimitationPeriods: ["4 years under CPA; 6 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Unfair Business Practices", "Contract Law", "Residential Tenancies", "Financial Services"],
    promptContext:
      "This case is subject to Washington's Consumer Protection Act (CPA, RCW § 19.86.010), which prohibits unfair methods of competition and unfair or deceptive acts in trade or commerce. The Washington AG's Consumer Protection Division is among the most active in the country and accepts complaints. The limitation period under CPA is 4 years. Small Claims Court handles disputes up to $10,000.",
    futureDataSources: ["Washington State Legislature online", "Washington AG Consumer Protection guidance"],
  },

  "West Virginia": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "West Virginia Consumer Credit and Protection Act (WVCCPA), W. Va. Code § 46A-1-101 et seq.",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "West Virginia Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (Magistrate Court) – up to $10,000",
    ],
    commonLimitationPeriods: ["2 years under WVCCPA; 6 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Credit and Finance", "Deceptive Practices", "Contract Law"],
    promptContext:
      "This case is governed by West Virginia's Consumer Credit and Protection Act (WVCCPA, W. Va. Code § 46A-1-101), which is one of the broader state consumer protection statutes and covers credit, collection, and general consumer protection. The West Virginia AG's Consumer Protection Division accepts complaints. The limitation period is 2 years. Magistrate Court handles small claims up to $10,000.",
    futureDataSources: ["West Virginia Code online", "West Virginia AG Consumer Protection guidance"],
  },

  "Wisconsin": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Wisconsin Deceptive Trade Practices Act (DTPA), Wis. Stat. § 100.18",
      "Wisconsin Consumer Act",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "Wisconsin Attorney General – Consumer Protection",
      "Wisconsin Department of Agriculture, Trade and Consumer Protection (DATCP)",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $10,000",
    ],
    commonLimitationPeriods: ["3 years under DTPA § 100.18; 6 years for written contracts"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Trade Practices", "Contract Law", "Agricultural Trade"],
    promptContext:
      "This case falls under Wisconsin's Deceptive Trade Practices Act (Wis. Stat. § 100.18), which prohibits untrue, deceptive, and misleading representations to induce consumer transactions. Wisconsin's Department of Agriculture, Trade and Consumer Protection (DATCP) also handles consumer complaints alongside the AG's office. The limitation period is 3 years. Small Claims Court handles disputes up to $10,000.",
    futureDataSources: ["Wisconsin Legislature online", "Wisconsin DATCP and AG Consumer Protection guidance"],
  },

  "Wyoming": {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "Wyoming Consumer Protection Act, Wyo. Stat. § 40-12-101 et seq.",
      "FTC Act (federal)", "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "Wyoming Attorney General – Consumer Protection Unit",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court – up to $6,000",
    ],
    commonLimitationPeriods: ["4 years under Consumer Protection Act"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Practices", "Contract Law"],
    promptContext:
      "This case is subject to Wyoming's Consumer Protection Act (Wyo. Stat. § 40-12-101), which prohibits deceptive acts or practices in consumer transactions. The Wyoming AG's Consumer Protection Unit accepts complaints. The limitation period is 4 years. Small Claims Court handles disputes up to $6,000.",
    futureDataSources: ["Wyoming Legislature online", "Wyoming AG Consumer Protection guidance"],
  },

  "District of Columbia": {
    legalSystem: "U.S. federal/district law",
    consumerProtectionFrameworks: [
      "DC Consumer Protection Procedures Act (CPPA), D.C. Code § 28-3901 et seq.",
      "DC Human Rights Act (for discrimination-related consumer matters)",
      "FTC Act (federal)",
    ],
    relevantAgencies: [
      "DC Attorney General – Consumer Protection Section",
      "DC Department of Insurance, Securities and Banking (DISB)",
      "Federal Trade Commission (FTC)", "Consumer Financial Protection Bureau (CFPB)",
      "Small Claims Court (DC Superior Court) – up to $10,000",
    ],
    commonLimitationPeriods: ["3 years under CPPA"],
    relevantLegalCategories: ["Consumer Protection", "Deceptive Practices", "Contract Law", "Financial Services", "Human Rights"],
    promptContext:
      "This case is governed by the District of Columbia's Consumer Protection Procedures Act (CPPA, D.C. Code § 28-3901), which is one of the broadest consumer protection statutes in the U.S. and applies to a wide range of consumer transactions. The DC AG's Consumer Protection Section accepts complaints and has broad enforcement authority. The limitation period is 3 years. Small Claims Court (DC Superior Court) handles disputes up to $10,000.",
    futureDataSources: ["DC Official Code online", "DC AG Consumer Protection guidance"],
  },
};

function getFallbackEntry(country: "CA" | "US", region: string): JurisdictionEntry {
  if (country === "CA") {
    return {
      legalSystem: "Canadian federal/provincial law",
      consumerProtectionFrameworks: [
        "Federal Consumer Product Safety Act",
        "Competition Act (federal)",
        "Provincial consumer protection legislation",
      ],
      relevantAgencies: [
        "Provincial consumer affairs office",
        "Competition Bureau Canada (federal)",
        "Financial Consumer Agency of Canada (FCAC)",
      ],
      commonLimitationPeriods: ["2 years for most civil claims (verify current provincial rules)"],
      relevantLegalCategories: ["Consumer Protection", "Contract Law", "Residential Tenancies", "Employment Standards"],
      promptContext: `This case is subject to the laws of ${region}, Canada, and applicable Canadian federal consumer protection legislation. Consumer protection in Canada is governed at both the federal level (Competition Act, Consumer Product Safety Act) and the provincial/territorial level. The provincial consumer affairs office and the federal Competition Bureau are key resources. The standard limitation period in most Canadian provinces is 2 years. Always verify current provincial legislation as it may have been updated.`,
      futureDataSources: ["CanLII (Canadian Legal Information Institute)", "Provincial government legislation databases"],
    };
  }
  return {
    legalSystem: "U.S. federal/state law",
    consumerProtectionFrameworks: [
      "State Consumer Protection/UDAP statute",
      "FTC Act (federal), 15 U.S.C. § 45",
      "Magnuson-Moss Warranty Act (federal)",
    ],
    relevantAgencies: [
      "State Attorney General – Consumer Protection Division",
      "Federal Trade Commission (FTC)",
      "Consumer Financial Protection Bureau (CFPB)",
    ],
    commonLimitationPeriods: ["Varies by state — typically 2-6 years; verify current state rules"],
    relevantLegalCategories: ["Consumer Protection", "Contract Law", "Warranty Law", "Unfair Business Practices"],
    promptContext: `This case is subject to the laws of ${region}, United States, and applicable federal consumer protection legislation. Most U.S. states have a consumer protection or Unfair and Deceptive Acts and Practices (UDAP) statute, and the federal FTC Act and CFPB jurisdiction also apply. The state Attorney General's Consumer Protection Division is the primary enforcement agency. Always verify the current state statute and limitation period, as these vary by state.`,
    futureDataSources: ["State legislature website", "State AG consumer protection resources", "FTC and CFPB resources"],
  };
}

export function getJurisdictionDisplayName(country: "CA" | "US", region: string): string {
  const countryName = country === "CA" ? "Canada" : "United States";
  if (!region) return countryName;
  return `${region}, ${countryName}`;
}

export function getLegalContext(country: "CA" | "US", region: string): JurisdictionContext {
  const countryName = country === "CA" ? "Canada" : "United States";
  const displayName = getJurisdictionDisplayName(country, region);
  const entry = country === "CA"
    ? (CANADA_ENTRIES[region] ?? getFallbackEntry(country, region))
    : (US_ENTRIES[region] ?? getFallbackEntry(country, region));
  return {
    country: countryName,
    region,
    displayName,
    ...entry,
  };
}

export function buildJurisdictionSystemPrompt(country: "CA" | "US", region: string): string {
  if (!region) {
    return "Jurisdiction has not been selected. Please note that laws vary significantly by province and state. Prompt the user to select their province or state before generating analysis.";
  }
  const ctx = getLegalContext(country, region);
  return `JURISDICTION CONTEXT FOR THIS CASE:
Selected Jurisdiction: ${ctx.displayName}
Legal System: ${ctx.legalSystem}

Relevant Consumer Protection Frameworks:
${ctx.consumerProtectionFrameworks.map(f => `- ${f}`).join("\n")}

Relevant Agencies the User May Contact:
${ctx.relevantAgencies.map(a => `- ${a}`).join("\n")}

Common Limitation Periods (time limits to be aware of):
${ctx.commonLimitationPeriods.map(l => `- ${l}`).join("\n")}

Broad Legal Categories to Consider:
${ctx.relevantLegalCategories.map(c => `- ${c}`).join("\n")}

Jurisdiction-Specific Context:
${ctx.promptContext}

IMPORTANT: Base all analysis on this jurisdiction (${ctx.displayName}). Do not provide generic cross-jurisdiction answers. Note where facts are incomplete or where the analysis may be limited. This is AI-generated informational analysis guided by the selected jurisdiction — not legal advice, not a law firm, not a guarantee of legal outcome. Laws change frequently; always recommend verifying with a qualified legal professional.`;
}

export const CANADA_PROVINCES_TERRITORIES = Object.keys(CANADA_ENTRIES);
export const US_STATES_DC = Object.keys(US_ENTRIES);

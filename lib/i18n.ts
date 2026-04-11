export type Language = "en" | "fr";

const translations = {
  en: {
    // ── Common ──
    cancel: "Cancel",
    delete: "Delete",
    ok: "OK",
    error: "Error",
    save: "Save",
    back: "Back",
    next: "Next",
    skip: "Skip",
    done: "Done",
    retry: "Try Again",
    close: "Close",
    confirm: "Confirm",
    loading: "Loading...",
    generating: "Generating...",
    analyzing: "Analyzing...",
    viewAll: "View All",
    review: "Review",
    add: "Add",
    edit: "Edit",
    score: "Score",
    noCase: "No Case",
    noCaseMsg: "Create a case first before generating an AI summary.",
    jurisdictionRequired: "Jurisdiction Required",
    jurisdictionRequiredMsg:
      "Please set your province or state so the AI can generate analysis based on your local laws. Go to Settings → Jurisdiction to set it.",
    setJurisdiction: "Set Jurisdiction",
    notLegalAdvice:
      "Not legal advice. Not a law firm. Not a substitute for a licensed attorney.",
    aiDisclaimer:
      "Built to analyze cases using the legal framework of your selected Canadian province or U.S. state.",
    aiDisclaimerSub:
      "Results are based on jurisdiction-specific laws and patterns, but are provided for informational purposes only. Not legal advice. Not a law firm. Not a substitute for a licensed attorney.",
    aiAnalysisBasedOn: "AI analysis based on:",
    jurisdictionWarningTitle: "Jurisdiction required",
    jurisdictionWarningMsg:
      "Select your province or state to generate jurisdiction-specific AI analysis.",
    aiGenerated: "AI-generated",
    gotIt: "Got it",

    // ── Tab labels ──
    tabHome: "Home",
    tabEvidence: "Evidence",
    tabTimeline: "Timeline",
    tabAI: "AI",
    tabRisk: "Analysis",
    tabSettings: "Settings",

    // ── Home screen ──
    greeting: "Hello",
    headerSub:
      "Find out where you stand before you spend money, miss evidence, or take the wrong next step.",
    statTotalCases: "Total Cases",
    statActive: "Active",
    statExported: "Exported",
    trustPrivate: "Private",
    trustOnDevice: "On your device",
    trustControl: "Under your control",
    ctaTitle: "Analyze My Situation",
    ctaTitleEmpty: "Start My First Case",
    ctaSub: "Start your case, organize your evidence, and see where you stand.",
    ctaSubEmpty: "Describe what happened and let AI help you see where you stand.",
    ctaSupport: "Built around the legal framework of your province or state.",
    casesEmptyEyebrow: "YOUR FIRST CASE",
    casesEmptyTitle: "Ready when you are",
    casesEmptySub: "Describe what happened and the app will help you organize your evidence, spot gaps, and see where you stand — before you spend a dollar.",
    sectionYourCases: "Your Cases",
    sectionTools: "Tools",
    nextSteps: "Next Steps",
    gapDetected: "Gap Detected",
    gapsDetected: "Gaps Detected",
    moreInAIOrganizer: "more in AI Organizer",
    moreInGapAnalysis: "more in Gap Analysis",
    exportCaseFile: "Export Case File",
    exportCaseSub: "Share a structured documentation file",
    howItWorksTitle: "Understand your situation. Build your file.",
    howItWorksSub: "Go from scattered facts to a clear, organized case.",
    step1Title: "Describe what happened",
    step1Desc:
      "Tell the app what happened, who's involved, and what you're trying to resolve.",
    step2Title: "Add evidence and timeline",
    step2Desc:
      "Upload screenshots, emails, photos, documents, receipts, notes, or voice recordings.",
    step3Title: "Review AI analysis",
    step3Desc:
      "See possible gaps, strengths, and helpful next steps based on your details.",
    step4Title: "Prepare for consultation",
    step4Desc:
      "Export a clean summary and bring a more organized file to a lawyer.",
    benefitsLabel: "Once your case is created, the app can help you:",
    benefit1: "Suggest useful next steps",
    benefit2: "Generate smart questions to ask a lawyer",
    benefit3: "Detect missing evidence and documentation",
    benefit4: "Organize your facts into a clear sequence",
    statusActive: "Active",
    statusArchived: "Archived",
    statusExported: "Exported",

    // ── Quick Actions ──
    qaEvidenceLabel: "Evidence Vault",
    qaEvidenceSub: "Store screenshots, emails, receipts, notes, and files.",
    qaTimelineLabel: "Timeline",
    qaTimelineSub: "Map events in order and build a clearer story.",
    qaAILabel: "AI Organizer",
    qaAISub:
      "Turn your details into a clean summary and smart next steps.",
    qaRiskLabel: "Gap Analysis",
    qaRiskSub: "Spot missing proof, weak points, and where to focus next.",
    evidenceToolSub: "Store screenshots, emails, receipts, notes, and files.",
    timelineToolSub: "Map events in order and build a clearer story.",
    aiOrganizerToolSub: "Turn your details into a clean summary and smart next steps.",
    gapAnalysisTitle: "Gap Analysis",
    gapAnalysisToolSub: "Spot missing proof, weak points, and where to focus next.",
    chatQuick1: "What evidence should I collect?",
    chatQuick2: "How do I organize my timeline?",
    chatQuick3: "What are my next steps?",
    chatQuick4: "What are my options?",

    // ── Settings screen ──
    settingsTitle: "Settings",
    sectionLanguage: "LANGUAGE",
    appLanguage: "App Language",
    sectionAppearance: "APPEARANCE",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    textSize: "Text Size",
    textSizeSmall: "Small",
    textSizeMedium: "Medium",
    textSizeLarge: "Large",
    sectionAccessibility: "ACCESSIBILITY",
    highContrast: "High Contrast Mode",
    highContrastSub: "Enhanced visual contrast for better readability",
    readAloud: "Read Aloud",
    readAloudSub: "Narrate summaries and case information",
    stepByStep: "Step-by-Step Mode",
    stepByStepSub: "Break complex tasks into guided steps",
    sectionJurisdiction: "JURISDICTION",
    changeJurisdiction: "Change Country / Province / State",
    notConfigured: "Not configured",
    sectionSubscription: "SUBSCRIPTION",
    upgradePlan: "Upgrade Plan",
    upgradePlanSub: "Basic $12/mo · Plus $24/mo · Pro $49/mo",
    currentPlan: "Current Plan:",
    managePlanSub: "Tap to manage or change your plan",
    restorePurchases: "Restore Purchases",
    restorePurchasesMsg:
      "If you have an active subscription, sign in with the same account you used to subscribe and your plan will be restored automatically.",
    sectionSecurity: "SECURITY",
    appLock: "App Lock",
    appLockDisabledSub: "Set up Face ID or Touch ID on your device to enable",
    appLockEnabledSub: "Face ID / Touch ID required to open",
    appLockOffSub: "Require biometrics to open CaseBuilder AI",
    enableAppLock: "Enable App Lock",
    enableAppLockMsg:
      "CaseBuilder AI will require Face ID or Touch ID every time you open it. Even if someone picks up your phone, they can't access your cases.",
    enable: "Enable",
    autoLock: "Auto-Lock After",
    autoLockSub: "Locks after {n} minute{s} of inactivity",
    autoLockTitle: "Auto-Lock Timeout",
    autoLockQuestion: "How long before the app locks itself?",
    min1: "1 minute",
    min5: "5 minutes",
    min15: "15 minutes",
    min30: "30 minutes",
    privacyScreen: "Privacy Screen",
    privacyScreenSub: "Case data is hidden when you switch apps",
    alwaysOn: "ALWAYS ON",
    dataStorage: "Data Storage",
    dataStorageSub: "All your information stays on your device only",
    dataStorageTitle: "Your Data Stays Private",
    dataStorageMsg:
      "CaseBuilder AI stores all your case information locally on your device. Nothing is shared without your explicit action (such as exporting).",
    sectionLegal: "LEGAL & PRIVACY",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    importantDisclaimer: "Important Disclaimer",
    importantDisclaimerSub: "CaseBuilder AI does not provide legal advice",
    legalDisclaimer: "Legal Disclaimer",
    legalDisclaimerMsg:
      "CaseBuilder AI helps you organize case information. It does not provide legal advice.\n\nAI-generated outputs may contain errors or omissions.\n\nAlways consult a qualified legal professional for legal guidance.",
    contactSupport: "Contact Support",
    contactSupportSub: "support@casebuilder.ai — tap to open",
    contactSupportTitle: "Contact Support",
    contactSupportQuestion: "How can we help you?",
    reportBug: "Report a Bug",
    accountBilling: "Account or Billing Issue",
    subscriptionHelp: "Subscription Help",
    generalQuestion: "General Question",
    marketNote:
      "CaseBuilder AI currently supports users in Canada and the United States. Information and issue-spotting are tailored by province or state.",
    versionLabel: "CaseBuilder AI v1.0.0",

    // ── AI Organizer screen ──
    aiOrganizerTitle: "AI Organizer",
    aiEmptyTitle: "Your AI assistant is ready",
    aiEmptyText:
      "Create your first case and we'll turn your details into a plain-language summary, action steps, and smarter questions to bring to a lawyer.",
    aiEmptyEyebrow: "WAITING FOR YOUR CASE",
    aiFeature1: "Plain-language case summary",
    aiFeature2: "Suggested next steps",
    aiFeature3: "Questions to bring to a lawyer",
    plainLanguage: "Plain Language",
    professional: "Professional",
    generateSummary: "Generate AI Summary",
    regenerateSummary: "Regenerate Summary",
    unlockSummary: "Unlock AI Summary — Upgrade",
    summaryLabelPlain: "AI-Generated Summary (Plain Language)",
    summaryLabelPro: "AI-Generated Summary (Professional)",
    summaryPrompt:
      'Tap "Generate AI Summary" to create an AI-organized summary of your case details. The more evidence and timeline events you add, the better the output.',
    nextStepsAISub:
      "Based on your gap analysis. Organizational suggestions only — not legal advice.",
    nextStepsBasicSub:
      "Based on your current case data. Add more details to get deeper AI-generated guidance.",
    lawyerQuestionsTitle: "Questions to Ask a Lawyer",
    lawyerQuestionsSub:
      "AI-suggested questions to bring to a legal consultation. Not legal advice.",
    generateQuestions: "Generate Questions",
    regenerateQuestions: "Regenerate Questions",
    lawyerQuestionsPrompt:
      "Generate a list of practical questions you could ask when consulting a legal professional.",
    howAIWorksTitle: "How AI analysis works",
    howAIWorksBullet1:
      "Built to analyze cases using the legal framework of your selected province or state",
    howAIWorksBullet2:
      "References relevant consumer protection laws and agencies for your jurisdiction",
    howAIWorksBullet3:
      "Results are based on jurisdiction-specific laws and patterns",
    howAIWorksBullet4:
      "Professional format ready to share with a lawyer or agency",
    howAIWorksVariance:
      "Not legal advice. Not a law firm. Not a substitute for a licensed attorney. Laws vary by province and state.",
    exportPDF: "Export Case File (PDF)",
    exportPDFSub: "Timeline, evidence, summary, gaps & questions",
    errorSummary: "Could not generate summary. Please try again.",
    errorQuestions: "Could not generate questions. Please try again.",

    // ── Risk / Gap Analysis screen ──
    riskTitle: "Gap & Risk Analysis",
    riskHeaderSub: "Turn your experience into a clear legal picture.",
    riskEmptyTitle: "We'll tell you where you stand",
    riskEmptyText:
      "Create a case, add your evidence and timeline, then run this analysis to get a clear picture of where you stand — before you take your next step.",
    riskEmptyEyebrow: "READY WHEN YOU ARE",
    riskFeature1: "Gaps in your evidence or documentation",
    riskFeature2: "Suggested actions to take before escalating",
    riskFeature3: "Overall case strength picture",
    analyzingCase: "Analyzing Case",
    analyzeBtn: "Analyze My Case",
    reanalyzeBtn: "Re-Analyze Case",
    unlockAnalysis: "Unlock Gap Analysis — Upgrade",
    riskScoreLabel: "Risk Score",
    riskScoreCaption: "Based on your evidence, timeline, and case details",
    caseOutlookLabel: "CASE OUTLOOK",
    caseOutlookSub: "This gives you a clearer starting point before speaking to a lawyer.",
    basedOnJurisdiction: "Based on your selected jurisdiction",
    aiGuidedNotLegal: "AI-guided, not legal advice",
    redFlagsTitle: "Red Flags",
    evidenceGapsTitle: "Evidence Gaps",
    docGapsTitle: "Documentation Gaps",
    jurisdictionIssuesTitle: "Jurisdiction Issues",
    sourcesTitle: "Legal Sources",
    sourcesTrustStrip: "Analysis grounded in real law",
    crossJurisdictionNote: "Cross-jurisdiction note:",
    errorAnalysis: "Could not complete analysis. Please try again.",

    // ── Evidence screen ──
    evidenceTitle: "Evidence Vault",
    searchEvidence: "Search evidence...",
    deleteEvidence: "Delete Evidence",
    deleteEvidenceMsg: 'Remove "{name}"?',
    noEvidence: "Your case file starts here",
    noEvidenceSub: "Add screenshots, emails, receipts, and notes. Every piece of evidence strengthens your record.",
    noEvidenceEyebrow: "BUILD YOUR RECORD",
    addEvidence: "Add Evidence",
    filterAll: "All",
    filterImage: "Image",
    filterPdf: "PDF",
    filterNote: "Note",
    filterEmail: "Email",
    filterReceipt: "Receipt",
    filterVoice: "Voice",

    // ── Timeline screen ──
    timelineTitle: "Timeline",
    noTimeline: "Every story has a beginning",
    noTimelineSub: "Add the first event — even just a date and a few words — and we'll help you build the full sequence from there.",
    noTimelineEyebrow: "MAP YOUR STORY",
    addEvent: "Add Event",
    generateAITimeline: "Generate AI Events",
    generatingTimeline: "Generating...",
    selectCaseFirst: "Select a Case",
    selectCaseFirstMsg:
      "Please open a case first to generate timeline events.",
    timelineUpdated: "Timeline Updated",
    timelineUpdatedMsg: "Added {n} AI-suggested event{s} to your timeline.",
    noSuggestions: "No Suggestions",
    noSuggestionsSub:
      "Add evidence with dates to generate AI timeline suggestions.",
    errorTimeline: "Could not generate timeline. Please try again.",
    importanceLow: "LOW",
    importanceMedium: "MEDIUM",
    importanceHigh: "HIGH",
    importanceCritical: "CRITICAL",
    deleteEventTitle: "Delete Event",
    deleteEventMsg: "Remove this event from the timeline?",

    // ── Chat screen ──
    chatTitle: "AI Chat",
    chatPlaceholder: "Ask about your case...",
    chatEmptyTitle: "Ask the AI anything about your case",
    chatEmptySub:
      "Ask about your rights, what to do next, what evidence to gather, or how to prepare for a consultation.",
    chatSend: "Send",
    chatError: "Could not send message. Please try again.",
    chatDisclaimer:
      "AI responses are for informational purposes only, not legal advice.",

    // ── Export screen ──
    exportTitle: "Export Case File",
    exportSub: "Generate a structured summary of your case",
    exportBtn: "Export as PDF",
    exportShare: "Share",
    exportSuccess: "Case file exported successfully.",
    exportError: "Could not export case file. Please try again.",

    // ── New Case screen ──
    newCaseTitle: "New Case",
    caseTitleLabel: "Case Title",
    caseTitlePlaceholder: "e.g. Landlord deposit dispute",
    caseDescLabel: "What happened?",
    caseDescPlaceholder:
      "Briefly describe the situation, who's involved, and what you're trying to resolve...",
    disputeTypeLabel: "Dispute Type",
    countryLabel: "Country",
    canada: "Canada",
    unitedStates: "United States",
    provinceLabel: "Province / Territory",
    stateLabel: "State",
    partiesLabel: "Other Parties Involved",
    partiesPlaceholder: "e.g. ABC Corp, John Smith",
    createCase: "Create Case",
    classifyBtn: "Classify with AI",
    selectDisputeType: "Select dispute type",
    selectProvince: "Select province",
    selectState: "Select state",
    caseCreated: "Case Created",
    caseCreatedMsg:
      "Your case has been created. Add evidence and timeline events to strengthen your analysis.",
    missingFields: "Required Fields",
    missingFieldsMsg: "Please add a title and description before creating a case.",

    // ── Case Detail screen ──
    caseDetailStatus: "Status",
    caseDetailType: "Dispute Type",
    caseDetailJurisdiction: "Jurisdiction",
    caseDetailParties: "Other Parties",
    caseDetailCreated: "Created",
    caseDetailUpdated: "Last Updated",
    setActive: "Set as Active Case",
    archiveCase: "Archive Case",
    deleteCase: "Delete Case",
    deleteCaseConfirm: "Are you sure you want to delete this case? This cannot be undone.",
    archiveCaseConfirm: "Archive this case? You can restore it later.",

    // ── Onboarding ──
    onboarding1Title: "Organize your case clearly",
    onboarding1Body:
      "Structure your case, track evidence, and prepare with clarity — all in one private, organized place.",
    onboarding2Title: "AI analysis tailored to your province or state",
    onboarding2Body:
      "Built to analyze cases using the legal framework of your selected Canadian province or U.S. state. Results are based on jurisdiction-specific laws and patterns.",
    onboarding3Title: "Organized support, not legal advice",
    onboarding3Body:
      "Generate summaries, identify documentation gaps, and get suggested questions for a legal consultation — all based on your jurisdiction's laws and legal patterns.",
    onboarding3Note:
      "Not legal advice. Not a law firm. Not a substitute for a licensed attorney.",
    onboardingJurisdictionTitle: "Where did this happen?",
    onboardingJurisdictionBody:
      "We tailor AI analysis, laws, and your rights to your specific province or state.",
    onboardingSelectCountry: "Your country",
    onboardingSelectRegion: "Your province or state",
    onboardingSetLater: "I'll set this in Settings later",
    getStarted: "Get Started",
    stepOf: "of",

    // ── Upgrade Card ──
    upgradeEyebrow: "PREMIUM AI FEATURES",
    upgradeTrial: "30-day free trial",
    upgradeHeadline: "Unlock deeper case insight",
    upgradeSub:
      "Get stronger AI summaries, evidence gap detection, guided analysis, and export tools.",
    upgradeFeature1: "AI Case Summary & Analysis",
    upgradeFeature2: "Gap & Risk Detection",
    upgradeFeature3: "AI Chat Assistant",
    upgradeFeature4: "PDF Export Package",
    upgradeCTA: "View Plans — from $12/mo",

    // ── Jurisdiction screen ──
    jurisdictionTitle: "Set Jurisdiction",
    jurisdictionSub:
      "Select your country and region so the AI can provide jurisdiction-specific analysis.",
    saveJurisdiction: "Save Jurisdiction",
  },

  fr: {
    // ── Common ──
    cancel: "Annuler",
    delete: "Supprimer",
    ok: "OK",
    error: "Erreur",
    save: "Enregistrer",
    back: "Retour",
    next: "Suivant",
    skip: "Passer",
    done: "Terminé",
    retry: "Réessayer",
    close: "Fermer",
    confirm: "Confirmer",
    loading: "Chargement...",
    generating: "Génération en cours...",
    analyzing: "Analyse en cours...",
    viewAll: "Voir tout",
    review: "Réviser",
    add: "Ajouter",
    edit: "Modifier",
    score: "Score",
    noCase: "Aucun dossier",
    noCaseMsg:
      "Créez d'abord un dossier avant de générer un résumé IA.",
    jurisdictionRequired: "Compétence requise",
    jurisdictionRequiredMsg:
      "Veuillez sélectionner votre province ou état pour que l'IA génère une analyse basée sur vos lois locales. Allez dans Paramètres → Compétence.",
    setJurisdiction: "Définir la compétence",
    notLegalAdvice:
      "Ce n'est pas un avis juridique. Ce n'est pas un cabinet d'avocats. Ce n'est pas un substitut à un avocat agréé.",
    aiDisclaimer:
      "Conçu pour analyser les dossiers selon le cadre juridique de votre province canadienne ou état américain.",
    aiDisclaimerSub:
      "Les résultats sont basés sur les lois et tendances propres à votre juridiction, mais sont fournis à titre informatif seulement. Ce n'est pas un avis juridique. Ce n'est pas un cabinet d'avocats. Ce n'est pas un substitut à un avocat agréé.",
    aiAnalysisBasedOn: "Analyse IA basée sur :",
    jurisdictionWarningTitle: "Compétence requise",
    jurisdictionWarningMsg:
      "Sélectionnez votre province ou état pour générer une analyse IA propre à votre juridiction.",
    aiGenerated: "Généré par IA",
    gotIt: "Compris",

    // ── Tab labels ──
    tabHome: "Accueil",
    tabEvidence: "Preuves",
    tabTimeline: "Chronologie",
    tabAI: "IA",
    tabRisk: "Analyse",
    tabSettings: "Paramètres",

    // ── Home screen ──
    greeting: "Bonjour",
    headerSub:
      "Connaissez votre situation avant de dépenser de l'argent, manquer des preuves ou faire le mauvais choix.",
    statTotalCases: "Dossiers au total",
    statActive: "Actifs",
    statExported: "Exportés",
    trustPrivate: "Privé",
    trustOnDevice: "Sur votre appareil",
    trustControl: "Sous votre contrôle",
    ctaTitle: "Analyser ma situation",
    ctaTitleEmpty: "Commencer mon premier dossier",
    ctaSub:
      "Démarrez votre dossier, organisez vos preuves et voyez où vous en êtes.",
    ctaSubEmpty:
      "Décrivez ce qui s'est passé et laissez l'IA vous aider à comprendre où vous en êtes.",
    ctaSupport:
      "Basé sur le cadre juridique de votre province ou état.",
    casesEmptyEyebrow: "VOTRE PREMIER DOSSIER",
    casesEmptyTitle: "Prêt quand vous l'êtes",
    casesEmptySub: "Décrivez ce qui s'est passé et l'application vous aidera à organiser vos preuves, détecter les lacunes et voir où vous en êtes — avant de dépenser un sou.",
    sectionYourCases: "Vos dossiers",
    sectionTools: "Outils",
    nextSteps: "Prochaines étapes",
    gapDetected: "Lacune détectée",
    gapsDetected: "Lacunes détectées",
    moreInAIOrganizer: "de plus dans l'Organisateur IA",
    moreInGapAnalysis: "de plus dans l'Analyse des lacunes",
    exportCaseFile: "Exporter le dossier",
    exportCaseSub: "Partagez un fichier de documentation structuré",
    howItWorksTitle:
      "Comprenez votre situation. Constituez votre dossier.",
    howItWorksSub:
      "Passez des faits épars à un dossier clair et organisé.",
    step1Title: "Décrivez ce qui s'est passé",
    step1Desc:
      "Dites à l'application ce qui s'est passé, qui est impliqué et ce que vous cherchez à résoudre.",
    step2Title: "Ajoutez des preuves et une chronologie",
    step2Desc:
      "Téléversez captures d'écran, courriels, photos, documents, reçus, notes ou enregistrements vocaux.",
    step3Title: "Examinez l'analyse IA",
    step3Desc:
      "Consultez les lacunes possibles, les points forts et les prochaines étapes utiles basées sur vos détails.",
    step4Title: "Préparez votre consultation",
    step4Desc:
      "Exportez un résumé clair et apportez un dossier mieux organisé à un avocat.",
    benefitsLabel: "Une fois votre dossier créé, l'application peut vous aider à :",
    benefit1: "Suggérer des prochaines étapes utiles",
    benefit2: "Générer des questions intelligentes à poser à un avocat",
    benefit3: "Détecter les preuves et documents manquants",
    benefit4: "Organiser vos faits en une séquence claire",
    statusActive: "Actif",
    statusArchived: "Archivé",
    statusExported: "Exporté",

    // ── Quick Actions ──
    qaEvidenceLabel: "Coffre à preuves",
    qaEvidenceSub:
      "Stockez captures d'écran, courriels, reçus, notes et fichiers.",
    qaTimelineLabel: "Chronologie",
    qaTimelineSub:
      "Ordonnez les événements pour raconter une histoire plus claire.",
    qaAILabel: "Organisateur IA",
    qaAISub:
      "Transformez vos détails en résumé clair et prochaines étapes intelligentes.",
    qaRiskLabel: "Analyse des lacunes",
    qaRiskSub:
      "Repérez les preuves manquantes, les failles et où concentrer vos efforts.",
    evidenceToolSub: "Stockez captures d'écran, courriels, reçus, notes et fichiers.",
    timelineToolSub: "Ordonnez les événements pour raconter une histoire plus claire.",
    aiOrganizerToolSub: "Transformez vos détails en résumé clair et prochaines étapes intelligentes.",
    gapAnalysisTitle: "Analyse des lacunes",
    gapAnalysisToolSub: "Repérez les preuves manquantes, les failles et où concentrer vos efforts.",
    chatQuick1: "Quelles preuves devrais-je recueillir ?",
    chatQuick2: "Comment organiser ma chronologie ?",
    chatQuick3: "Quelles sont mes prochaines étapes ?",
    chatQuick4: "Quelles sont mes options ?",

    // ── Settings screen ──
    settingsTitle: "Paramètres",
    sectionLanguage: "LANGUE",
    appLanguage: "Langue de l'application",
    sectionAppearance: "APPARENCE",
    theme: "Thème",
    themeLight: "Clair",
    themeDark: "Sombre",
    themeSystem: "Système",
    textSize: "Taille du texte",
    textSizeSmall: "Petit",
    textSizeMedium: "Moyen",
    textSizeLarge: "Grand",
    sectionAccessibility: "ACCESSIBILITÉ",
    highContrast: "Mode contraste élevé",
    highContrastSub: "Contraste visuel amélioré pour une meilleure lisibilité",
    readAloud: "Lire à voix haute",
    readAloudSub: "Narrer les résumés et les informations du dossier",
    stepByStep: "Mode étape par étape",
    stepByStepSub: "Décomposer les tâches complexes en étapes guidées",
    sectionJurisdiction: "COMPÉTENCE",
    changeJurisdiction: "Changer pays / province / état",
    notConfigured: "Non configuré",
    sectionSubscription: "ABONNEMENT",
    upgradePlan: "Améliorer le plan",
    upgradePlanSub: "Basic 12$/mois · Plus 24$/mois · Pro 49$/mois",
    currentPlan: "Plan actuel :",
    managePlanSub: "Appuyez pour gérer ou changer votre plan",
    restorePurchases: "Restaurer les achats",
    restorePurchasesMsg:
      "Si vous avez un abonnement actif, connectez-vous avec le même compte utilisé lors de la souscription et votre plan sera restauré automatiquement.",
    sectionSecurity: "SÉCURITÉ",
    appLock: "Verrouillage de l'app",
    appLockDisabledSub:
      "Configurez Face ID ou Touch ID sur votre appareil pour activer",
    appLockEnabledSub: "Face ID / Touch ID requis à l'ouverture",
    appLockOffSub: "Biométrie requise pour ouvrir CaseBuilder AI",
    enableAppLock: "Activer le verrouillage",
    enableAppLockMsg:
      "CaseBuilder AI exigera Face ID ou Touch ID à chaque ouverture. Même si quelqu'un prend votre téléphone, il ne pourra pas accéder à vos dossiers.",
    enable: "Activer",
    autoLock: "Verrouillage automatique",
    autoLockSub: "Verrouille après {n} minute{s} d'inactivité",
    autoLockTitle: "Délai de verrouillage automatique",
    autoLockQuestion: "Combien de temps avant que l'app se verrouille ?",
    min1: "1 minute",
    min5: "5 minutes",
    min15: "15 minutes",
    min30: "30 minutes",
    privacyScreen: "Écran de confidentialité",
    privacyScreenSub:
      "Les données du dossier sont cachées lors du changement d'application",
    alwaysOn: "TOUJOURS ACTIF",
    dataStorage: "Stockage des données",
    dataStorageSub: "Toutes vos informations restent sur votre appareil uniquement",
    dataStorageTitle: "Vos données restent privées",
    dataStorageMsg:
      "CaseBuilder AI stocke toutes vos informations localement sur votre appareil. Rien n'est partagé sans votre action explicite (comme l'exportation).",
    sectionLegal: "LÉGAL ET CONFIDENTIALITÉ",
    privacyPolicy: "Politique de confidentialité",
    termsOfService: "Conditions d'utilisation",
    importantDisclaimer: "Avertissement important",
    importantDisclaimerSub:
      "CaseBuilder AI ne fournit pas de conseils juridiques",
    legalDisclaimer: "Avertissement juridique",
    legalDisclaimerMsg:
      "CaseBuilder AI vous aide à organiser les informations de votre dossier. Il ne fournit pas de conseils juridiques.\n\nLes résultats générés par l'IA peuvent contenir des erreurs ou des omissions.\n\nConsultez toujours un professionnel juridique qualifié.",
    contactSupport: "Contacter le support",
    contactSupportSub: "support@casebuilder.ai — appuyez pour ouvrir",
    contactSupportTitle: "Contacter le support",
    contactSupportQuestion: "Comment pouvons-nous vous aider ?",
    reportBug: "Signaler un bogue",
    accountBilling: "Problème de compte ou de facturation",
    subscriptionHelp: "Aide pour l'abonnement",
    generalQuestion: "Question générale",
    marketNote:
      "CaseBuilder AI supporte actuellement les utilisateurs au Canada et aux États-Unis. Les informations et la détection de problèmes sont adaptées par province ou état.",
    versionLabel: "CaseBuilder AI v1.0.0",

    // ── AI Organizer screen ──
    aiOrganizerTitle: "Organisateur IA",
    aiEmptyTitle: "Votre assistant IA est prêt",
    aiEmptyText:
      "Créez votre premier dossier et nous transformerons vos détails en un résumé clair, des étapes concrètes et des questions à poser à un avocat.",
    aiEmptyEyebrow: "EN ATTENTE DE VOTRE DOSSIER",
    aiFeature1: "Résumé du dossier en langage simple",
    aiFeature2: "Prochaines étapes suggérées",
    aiFeature3: "Questions à apporter à un avocat",
    plainLanguage: "Langage simple",
    professional: "Professionnel",
    generateSummary: "Générer un résumé IA",
    regenerateSummary: "Régénérer le résumé",
    unlockSummary: "Débloquer le résumé IA — Mettre à niveau",
    summaryLabelPlain: "Résumé généré par IA (Langage simple)",
    summaryLabelPro: "Résumé généré par IA (Professionnel)",
    summaryPrompt:
      'Appuyez sur "Générer un résumé IA" pour créer un résumé organisé de votre dossier. Plus vous ajoutez de preuves et d\'événements, meilleur sera le résultat.',
    nextStepsAISub:
      "Basé sur votre analyse des lacunes. Suggestions organisationnelles seulement — pas un avis juridique.",
    nextStepsBasicSub:
      "Basé sur les données actuelles de votre dossier. Ajoutez plus de détails pour obtenir des conseils IA approfondis.",
    lawyerQuestionsTitle: "Questions à poser à un avocat",
    lawyerQuestionsSub:
      "Questions suggérées par l'IA pour une consultation juridique. Pas un avis juridique.",
    generateQuestions: "Générer des questions",
    regenerateQuestions: "Régénérer les questions",
    lawyerQuestionsPrompt:
      "Générez une liste de questions pratiques à poser lors d'une consultation avec un professionnel juridique.",
    howAIWorksTitle: "Comment fonctionne l'analyse IA",
    howAIWorksBullet1:
      "Conçu pour analyser les dossiers selon le cadre juridique de votre province ou état",
    howAIWorksBullet2:
      "Référence les lois de protection du consommateur et agences pertinentes pour votre juridiction",
    howAIWorksBullet3:
      "Les résultats sont basés sur les lois et tendances propres à votre juridiction",
    howAIWorksBullet4:
      "Format professionnel prêt à partager avec un avocat ou une agence",
    howAIWorksVariance:
      "Pas un avis juridique. Pas un cabinet d'avocats. Pas un substitut à un avocat agréé. Les lois varient selon la province et l'état.",
    exportPDF: "Exporter le dossier (PDF)",
    exportPDFSub: "Chronologie, preuves, résumé, lacunes et questions",
    errorSummary: "Impossible de générer le résumé. Veuillez réessayer.",
    errorQuestions: "Impossible de générer les questions. Veuillez réessayer.",

    // ── Risk / Gap Analysis screen ──
    riskTitle: "Analyse des lacunes et risques",
    riskHeaderSub: "Transformez votre expérience en une image juridique claire.",
    riskEmptyTitle: "Nous vous dirons où vous en êtes",
    riskEmptyText:
      "Créez un dossier, ajoutez vos preuves et votre chronologie, puis lancez cette analyse pour avoir une image claire de votre situation — avant votre prochaine étape.",
    riskEmptyEyebrow: "PRÊT QUAND VOUS L'ÊTES",
    riskFeature1: "Lacunes dans vos preuves ou documents",
    riskFeature2: "Actions suggérées avant d'escalader",
    riskFeature3: "Vue d'ensemble de la force de votre dossier",
    analyzingCase: "Dossier en cours d'analyse",
    analyzeBtn: "Analyser mon dossier",
    reanalyzeBtn: "Relancer l'analyse",
    unlockAnalysis: "Débloquer l'analyse — Passer à Plus",
    riskScoreLabel: "Score de risque",
    riskScoreCaption:
      "Basé sur vos preuves, chronologie et détails du dossier",
    caseOutlookLabel: "PERSPECTIVE DU DOSSIER",
    caseOutlookSub: "Cela vous donne un point de départ plus clair avant de consulter un avocat.",
    basedOnJurisdiction: "Basé sur votre juridiction sélectionnée",
    aiGuidedNotLegal: "Guidé par l'IA, pas un avis juridique",
    redFlagsTitle: "Points d'alerte",
    evidenceGapsTitle: "Lacunes de preuves",
    docGapsTitle: "Lacunes de documentation",
    jurisdictionIssuesTitle: "Problèmes de juridiction",
    sourcesTitle: "Sources juridiques",
    sourcesTrustStrip: "Analyse fondée sur des lois réelles",
    crossJurisdictionNote: "Note inter-juridictions :",
    errorAnalysis: "Impossible de terminer l'analyse. Veuillez réessayer.",

    // ── Evidence screen ──
    evidenceTitle: "Coffre à preuves",
    searchEvidence: "Rechercher des preuves...",
    deleteEvidence: "Supprimer la preuve",
    deleteEvidenceMsg: 'Supprimer "{name}" ?',
    noEvidence: "Votre dossier commence ici",
    noEvidenceSub:
      "Ajoutez captures d'écran, courriels, reçus et notes. Chaque preuve renforce votre dossier.",
    noEvidenceEyebrow: "CONSTITUEZ VOTRE DOSSIER",
    addEvidence: "Ajouter une preuve",
    filterAll: "Tout",
    filterImage: "Image",
    filterPdf: "PDF",
    filterNote: "Note",
    filterEmail: "Courriel",
    filterReceipt: "Reçu",
    filterVoice: "Vocal",

    // ── Timeline screen ──
    timelineTitle: "Chronologie",
    noTimeline: "Toute histoire a un début",
    noTimelineSub:
      "Ajoutez le premier événement — même juste une date et quelques mots — et nous vous aiderons à construire la séquence complète.",
    noTimelineEyebrow: "RACONTEZ VOTRE HISTOIRE",
    addEvent: "Ajouter un événement",
    generateAITimeline: "Générer des événements IA",
    generatingTimeline: "Génération en cours...",
    selectCaseFirst: "Sélectionner un dossier",
    selectCaseFirstMsg:
      "Veuillez d'abord ouvrir un dossier pour générer des événements de chronologie.",
    timelineUpdated: "Chronologie mise à jour",
    timelineUpdatedMsg:
      "{n} événement{s} suggéré{s} par l'IA ajouté{s} à votre chronologie.",
    noSuggestions: "Aucune suggestion",
    noSuggestionsSub:
      "Ajoutez des preuves avec des dates pour générer des suggestions de chronologie IA.",
    errorTimeline:
      "Impossible de générer la chronologie. Veuillez réessayer.",
    importanceLow: "BAS",
    importanceMedium: "MOYEN",
    importanceHigh: "ÉLEVÉ",
    importanceCritical: "CRITIQUE",
    deleteEventTitle: "Supprimer l'événement",
    deleteEventMsg: "Retirer cet événement de la chronologie ?",

    // ── Chat screen ──
    chatTitle: "Chat IA",
    chatPlaceholder: "Posez une question sur votre dossier...",
    chatEmptyTitle: "Posez n'importe quelle question à l'IA sur votre dossier",
    chatEmptySub:
      "Renseignez-vous sur vos droits, les prochaines étapes, les preuves à rassembler ou comment préparer une consultation.",
    chatSend: "Envoyer",
    chatError: "Impossible d'envoyer le message. Veuillez réessayer.",
    chatDisclaimer:
      "Les réponses de l'IA sont à titre informatif seulement, pas un avis juridique.",

    // ── Export screen ──
    exportTitle: "Exporter le dossier",
    exportSub: "Générez un résumé structuré de votre dossier",
    exportBtn: "Exporter en PDF",
    exportShare: "Partager",
    exportSuccess: "Dossier exporté avec succès.",
    exportError: "Impossible d'exporter le dossier. Veuillez réessayer.",

    // ── New Case screen ──
    newCaseTitle: "Nouveau dossier",
    caseTitleLabel: "Titre du dossier",
    caseTitlePlaceholder: "ex. Litige de dépôt de garantie",
    caseDescLabel: "Que s'est-il passé ?",
    caseDescPlaceholder:
      "Décrivez brièvement la situation, les personnes impliquées et ce que vous cherchez à résoudre...",
    disputeTypeLabel: "Type de litige",
    countryLabel: "Pays",
    canada: "Canada",
    unitedStates: "États-Unis",
    provinceLabel: "Province / Territoire",
    stateLabel: "État",
    partiesLabel: "Autres parties impliquées",
    partiesPlaceholder: "ex. ABC Corp, Jean Tremblay",
    createCase: "Créer le dossier",
    classifyBtn: "Classer avec l'IA",
    selectDisputeType: "Sélectionnez le type de litige",
    selectProvince: "Sélectionnez une province",
    selectState: "Sélectionnez un état",
    caseCreated: "Dossier créé",
    caseCreatedMsg:
      "Votre dossier a été créé. Ajoutez des preuves et des événements de chronologie pour renforcer votre analyse.",
    missingFields: "Champs requis",
    missingFieldsMsg:
      "Veuillez ajouter un titre et une description avant de créer un dossier.",

    // ── Case Detail screen ──
    caseDetailStatus: "Statut",
    caseDetailType: "Type de litige",
    caseDetailJurisdiction: "Compétence",
    caseDetailParties: "Autres parties",
    caseDetailCreated: "Créé le",
    caseDetailUpdated: "Dernière mise à jour",
    setActive: "Définir comme dossier actif",
    archiveCase: "Archiver le dossier",
    deleteCase: "Supprimer le dossier",
    deleteCaseConfirm:
      "Voulez-vous vraiment supprimer ce dossier ? Cette action est irréversible.",
    archiveCaseConfirm:
      "Archiver ce dossier ? Vous pourrez le restaurer plus tard.",

    // ── Onboarding ──
    onboarding1Title: "Organisez clairement votre dossier",
    onboarding1Body:
      "Structurez votre dossier, suivez vos preuves et préparez-vous avec clarté — le tout dans un endroit privé et organisé.",
    onboarding2Title: "Analyse IA adaptée à votre province ou état",
    onboarding2Body:
      "Conçu pour analyser les dossiers selon le cadre juridique de votre province canadienne ou état américain. Les résultats sont basés sur les lois et tendances propres à votre juridiction.",
    onboarding3Title: "Soutien organisationnel, pas de conseils juridiques",
    onboarding3Body:
      "Générez des résumés, identifiez les lacunes de documentation et obtenez des questions suggérées pour une consultation juridique — le tout basé sur les lois de votre juridiction.",
    onboarding3Note:
      "Ce n'est pas un avis juridique. Ce n'est pas un cabinet d'avocats. Ce n'est pas un substitut à un avocat agréé.",
    onboardingJurisdictionTitle: "Où cela s'est-il passé ?",
    onboardingJurisdictionBody:
      "Nous adaptons l'analyse IA, les lois et vos droits à votre province ou état spécifique.",
    onboardingSelectCountry: "Votre pays",
    onboardingSelectRegion: "Votre province ou état",
    onboardingSetLater: "Je le définirai dans les paramètres plus tard",
    getStarted: "Commencer",
    stepOf: "sur",

    // ── Upgrade Card ──
    upgradeEyebrow: "FONCTIONNALITÉS IA PREMIUM",
    upgradeTrial: "Essai gratuit 30 jours",
    upgradeHeadline: "Débloquez une analyse approfondie",
    upgradeSub:
      "Obtenez de meilleurs résumés IA, détection des lacunes de preuves, analyse guidée et outils d'exportation.",
    upgradeFeature1: "Résumé et analyse de dossier IA",
    upgradeFeature2: "Détection des lacunes et risques",
    upgradeFeature3: "Assistant de chat IA",
    upgradeFeature4: "Package d'export PDF",
    upgradeCTA: "Voir les plans — à partir de 12$/mois",

    // ── Jurisdiction screen ──
    jurisdictionTitle: "Définir la compétence",
    jurisdictionSub:
      "Sélectionnez votre pays et votre région pour que l'IA fournisse une analyse propre à votre juridiction.",
    saveJurisdiction: "Enregistrer la compétence",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslations(lang: Language) {
  return translations[lang] ?? translations.en;
}

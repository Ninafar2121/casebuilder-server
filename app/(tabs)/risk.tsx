import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Linking } from "react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { EmptyStateCard } from "@/components/EmptyStateCard";
import { RiskMeter } from "@/components/RiskMeter";
import { useCases } from "@/context/CaseContext";
import { useColors } from "@/hooks/useColors";
import { useSubscription } from "@/lib/revenuecat";
import { useTranslation } from "@/hooks/useTranslation";
import { analyzeRedFlags } from "@/lib/ai";
import { openSupportEmail } from "@/lib/support";
import { getLegalTopicLabel } from "@/lib/legalTopics";
import { validateJurisdiction, countryCodeToName } from "@/lib/legalJurisdictions";
import { ANALYSIS_MODE_LABEL } from "@/lib/buildLegalAnalysisPrompt";
import { getLegalKnowledge, hasDetailedKnowledge } from "@/lib/getLegalKnowledge";

export default function RiskCheckerScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { activeCase, cases, updateCase, getCaseEvidence } = useCases();
  const { hasAccessTo } = useSubscription();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contextExpanded, setContextExpanded] = useState(false);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;
  const currentCase = activeCase || cases[0];
  const isPremium = hasAccessTo("plus");

  const jurisdictionLabel = currentCase
    ? (currentCase.jurisdictionDisplayName || (currentCase.country === "CA"
      ? `${currentCase.province || "Canada"}, Canada`
      : `${currentCase.state || "United States"}, USA`))
    : null;

  const hasJurisdiction = !!(currentCase?.province || currentCase?.state);

  const handleAnalyze = async () => {
    if (!isPremium) {
      router.push("/paywall");
      return;
    }
    if (!currentCase) {
      Alert.alert(t("noCase"), t("noCaseMsg"));
      return;
    }
    if (!hasJurisdiction) {
      Alert.alert(
        t("jurisdictionRequired"),
        t("jurisdictionRequiredMsg"),
        [
          { text: t("cancel"), style: "cancel" },
          { text: t("setJurisdiction"), onPress: () => router.push("/jurisdiction") },
        ]
      );
      return;
    }
    const jCountry = currentCase.jurisdictionCountry || countryCodeToName(currentCase.country);
    const jRegion = currentCase.jurisdictionRegion || (currentCase.country === "CA" ? (currentCase.province || "") : (currentCase.state || ""));
    const jValidation = validateJurisdiction(jCountry, jRegion);
    if (!jValidation.valid) {
      Alert.alert("Invalid Jurisdiction", jValidation.warning || "Please select a valid province, territory, or state before generating analysis.");
      return;
    }
    setIsAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const caseEvidence = getCaseEvidence(currentCase.id);
      const result = await analyzeRedFlags(currentCase, caseEvidence);
      const jCountryForUpdate = currentCase.jurisdictionCountry || countryCodeToName(currentCase.country);
      const jRegionForUpdate = currentCase.jurisdictionRegion || (currentCase.country === "CA" ? (currentCase.province || "") : (currentCase.state || ""));
      updateCase(currentCase.id, {
        riskScore: result.riskScore,
        redFlags: result.redFlags,
        gapActions: result.gapActions,
        missingEvidence: result.missingEvidence,
        nextSteps: result.nextSteps,
        possibleLegalIssues: result.possibleLegalIssues,
        relevantLegalAreas: result.relevantLegalAreas,
        strengtheningFactors: result.strengtheningFactors,
        weakeningFactors: result.weakeningFactors,
        missingInformation: result.missingInformation,
        generalOutlook: result.generalOutlook,
        questionsToAskLawyer: result.questionsToAskLawyer,
        detectedLegalTopics: result.detectedLegalTopics,
        confidenceLevel: result.confidenceLevel,
        complexityLevel: result.complexityLevel,
        sourceCitations: result.sourceCitations,
        verificationStatus: result.verificationStatus,
        knowledgeLastVerified: result.knowledgeLastVerified,
        knowledgeIsStale: result.knowledgeIsStale,
        conflictNote: result.conflictNote,
        crossJurisdictionNote: result.crossJurisdictionNote,
        analysisTimestamp: result.analysisTimestamp,
        legalContextUsed: {
          jurisdiction: `${jRegionForUpdate}, ${jCountryForUpdate}`,
          topicKey: currentCase.legalTopicCategory || "other",
          hasDetailedContext: hasDetailedKnowledge(jCountryForUpdate, jRegionForUpdate),
        },
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert(t("error"), t("errorAnalysis"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.navy }]}>
        <View style={{ flex: 1 }}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>{t("riskTitle")}</Text>
            {!isPremium && (
              <View style={[styles.premiumBadge, { backgroundColor: "rgba(201,162,39,0.18)", borderColor: "rgba(201,162,39,0.4)" }]}>
                <Feather name="award" size={9} color="#C9A227" />
                <Text style={styles.premiumBadgeText}>PLUS+</Text>
              </View>
            )}
          </View>
          <Text style={styles.headerSub}>{t("riskHeaderSub")}</Text>
          {jurisdictionLabel && (
            <View style={styles.jurisdictionChip}>
              <Feather name="map-pin" size={10} color="rgba(255,255,255,0.7)" />
              <Text style={styles.jurisdictionChipText}>{jurisdictionLabel}</Text>
            </View>
          )}
        </View>
        <Pressable
          onPress={() => openSupportEmail("question", "I have a question about Gap & Risk Analysis:")}
          style={({ pressed }) => [styles.helpBtn, { opacity: pressed ? 0.7 : 1 }]}
          hitSlop={8}
        >
          <Feather name="help-circle" size={20} color="rgba(255,255,255,0.5)" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {hasJurisdiction && jurisdictionLabel ? (
          <DisclaimerBanner jurisdiction={jurisdictionLabel} />
        ) : (
          <DisclaimerBanner showSetJurisdiction />
        )}

        {!currentCase ? (
          <EmptyStateCard
            illustration="risk"
            eyebrow={t("riskEmptyEyebrow")}
            title={t("riskEmptyTitle")}
            body={t("riskEmptyText")}
            features={[
              { icon: "alert-circle", label: t("riskFeature1"), tint: colors.gold },
              { icon: "list", label: t("riskFeature2"), tint: colors.gold },
              { icon: "trending-up", label: t("riskFeature3"), tint: colors.gold },
            ]}
            ctaLabel={t("ctaTitleEmpty")}
            onCta={() => router.push("/case/new")}
            ctaColor={colors.navy}
          />
        ) : (
          <>
            <View style={[styles.caseInfo, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.caseLabel, { color: colors.mutedForeground }]}>{t("analyzingCase")}</Text>
              <Text style={[styles.caseName, { color: colors.foreground }]}>{currentCase.title}</Text>
              <Text style={[styles.caseType, { color: colors.teal }]}>{currentCase.disputeType}</Text>
              <View style={styles.metadataRow}>
                {currentCase.jurisdictionDisplayName ? (
                  <View style={[styles.metaBadge, { backgroundColor: colors.tealLight, borderColor: colors.teal + "50" }]}>
                    <Feather name="map-pin" size={10} color={colors.teal} />
                    <Text style={[styles.metaBadgeText, { color: colors.teal }]}>{currentCase.jurisdictionDisplayName}</Text>
                  </View>
                ) : null}
                {currentCase.legalTopicCategory ? (
                  <View style={[styles.metaBadge, { backgroundColor: colors.goldLight, borderColor: colors.gold + "50" }]}>
                    <Feather name="tag" size={10} color={colors.gold} />
                    <Text style={[styles.metaBadgeText, { color: colors.gold }]}>{getLegalTopicLabel(currentCase.legalTopicCategory)}</Text>
                  </View>
                ) : null}
                <View style={[styles.metaBadge, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                  <Feather name="cpu" size={10} color={colors.mutedForeground} />
                  <Text style={[styles.metaBadgeText, { color: colors.mutedForeground }]}>{ANALYSIS_MODE_LABEL}</Text>
                </View>
              </View>
            </View>

            {currentCase.riskScore !== undefined && (
              <View style={[styles.meterCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <RiskMeter score={currentCase.riskScore} />
              </View>
            )}

            <Pressable
              onPress={handleAnalyze}
              disabled={isAnalyzing}
              style={({ pressed }) => [
                styles.analyzeBtn,
                {
                  backgroundColor: isPremium ? colors.navy : "#C9A227",
                  opacity: pressed ? 0.85 : isAnalyzing ? 0.7 : 1,
                },
              ]}
            >
              {isAnalyzing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Feather name={isPremium ? "search" : "lock"} size={18} color="#FFFFFF" />
              )}
              <Text style={styles.analyzeBtnText}>
                {isAnalyzing ? t("analyzing") : !isPremium ? t("unlockAnalysis") : currentCase.redFlags ? t("reanalyzeBtn") : t("analyzeBtn")}
              </Text>
            </Pressable>

            {currentCase.generalOutlook ? (
              <View style={[styles.outlookHero, { borderColor: colors.navy + "25" }]}>
                <View style={styles.outlookHeroTop}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 6 }}>
                    <View style={{ width: 4, height: 20, borderRadius: 2, backgroundColor: colors.teal }} />
                    <Text style={[styles.outlookLabel, { color: colors.teal }]}>{t("caseOutlookLabel")}</Text>
                  </View>
                  <Text style={[styles.outlookHeroText, { color: colors.foreground }]}>{currentCase.generalOutlook}</Text>
                  <Text style={[styles.outlookWhyMatters, { color: colors.mutedForeground }]}>
                    {t("caseOutlookSub")}
                  </Text>
                </View>
                <View style={[styles.outlookHeroFooter, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                  <View style={styles.outlookFooterPill}>
                    <Feather name="map-pin" size={10} color={colors.teal} />
                    <Text style={[styles.outlookFooterText, { color: colors.teal }]}>{t("basedOnJurisdiction")}</Text>
                  </View>
                  <View style={[styles.outlookFooterDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.outlookFooterPill}>
                    <Feather name="shield" size={10} color={colors.mutedForeground} />
                    <Text style={[styles.outlookFooterText, { color: colors.mutedForeground }]}>{t("aiGuidedNotLegal")}</Text>
                  </View>
                </View>
              </View>
            ) : null}

            {currentCase.possibleLegalIssues && currentCase.possibleLegalIssues.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Feather name="file-text" size={16} color={colors.navy} />
                  <Text style={[styles.sectionTitle, { color: colors.navy }]}>Possible Legal Issues</Text>
                </View>
                <Text style={[styles.sectionNote, { color: colors.mutedForeground }]}>
                  Based on your selected jurisdiction's legal framework — for context only.
                </Text>
                {currentCase.possibleLegalIssues.map((issue, i) => (
                  <View key={i} style={[styles.issueItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Feather name="circle" size={8} color={colors.navy} style={{ marginTop: 5, flexShrink: 0 }} />
                    <Text style={[styles.issueText, { color: colors.foreground }]}>{issue}</Text>
                  </View>
                ))}
              </View>
            )}

            {currentCase.relevantLegalAreas && currentCase.relevantLegalAreas.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Feather name="layers" size={16} color={colors.teal} />
                  <Text style={[styles.sectionTitle, { color: colors.teal }]}>Relevant Legal Areas</Text>
                </View>
                <View style={styles.tagsRow}>
                  {currentCase.relevantLegalAreas.map((area, i) => (
                    <View key={i} style={[styles.legalAreaTag, { backgroundColor: colors.tealLight, borderColor: colors.teal + "40" }]}>
                      <Text style={[styles.legalAreaTagText, { color: colors.teal }]}>{area}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {(currentCase.strengtheningFactors?.length || currentCase.weakeningFactors?.length) ? (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Feather name="bar-chart-2" size={16} color={colors.mutedForeground} />
                  <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Case Factors</Text>
                </View>
                <Text style={[styles.sectionNote, { color: colors.mutedForeground }]}>
                  Structured from your inputs — not legal conclusions.
                </Text>
                {currentCase.strengtheningFactors && currentCase.strengtheningFactors.length > 0 && (
                  <View style={[styles.factorsBlock, { borderLeftColor: "#22c55e" }]}>
                    <Text style={[styles.factorsLabel, { color: "#16a34a" }]}>May strengthen</Text>
                    {currentCase.strengtheningFactors.map((f, i) => (
                      <View key={i} style={styles.factorRow}>
                        <Feather name="arrow-up-circle" size={13} color="#22c55e" style={{ marginTop: 2, flexShrink: 0 }} />
                        <Text style={[styles.factorText, { color: colors.foreground }]}>{f}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {currentCase.weakeningFactors && currentCase.weakeningFactors.length > 0 && (
                  <View style={[styles.factorsBlock, { borderLeftColor: colors.alertRed, marginTop: 10 }]}>
                    <Text style={[styles.factorsLabel, { color: colors.alertRed }]}>May complicate</Text>
                    {currentCase.weakeningFactors.map((f, i) => (
                      <View key={i} style={styles.factorRow}>
                        <Feather name="alert-circle" size={13} color={colors.alertRed} style={{ marginTop: 2, flexShrink: 0 }} />
                        <Text style={[styles.factorText, { color: colors.foreground }]}>{f}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : null}

            {currentCase.riskScore !== undefined && currentCase.legalContextUsed && (() => {
              const jCountryCtx = currentCase.jurisdictionCountry || countryCodeToName(currentCase.country);
              const jRegionCtx = currentCase.jurisdictionRegion || (currentCase.country === "CA" ? (currentCase.province || "") : (currentCase.state || ""));
              const resolved = getLegalKnowledge(jCountryCtx, jRegionCtx, currentCase.legalTopicCategory);
              const topicLabel = getLegalTopicLabel(currentCase.legalTopicCategory || "other");
              return (
                <View style={styles.section}>
                  <Pressable
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                    onPress={() => setContextExpanded(v => !v)}
                    accessibilityRole="button"
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Feather name="book-open" size={16} color="#2A8A98" />
                      <Text style={[styles.sectionTitle, { color: "#2A8A98" }]}>Legal context used</Text>
                      {resolved.isFallback ? (
                        <View style={{ backgroundColor: "#f3f5f9", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                          <Text style={{ fontSize: 10, color: "#666", fontFamily: "DMSans_500Medium" }}>General</Text>
                        </View>
                      ) : (
                        <View style={{ backgroundColor: "#e6f4f6", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                          <Text style={{ fontSize: 10, color: "#2A8A98", fontFamily: "DMSans_500Medium" }}>Jurisdiction-specific</Text>
                        </View>
                      )}
                    </View>
                    <Feather name={contextExpanded ? "chevron-up" : "chevron-down"} size={16} color="#2A8A98" />
                  </Pressable>
                  <Text style={[styles.sectionNote, { color: colors.mutedForeground, marginTop: 4 }]}>
                    {resolved.jurisdiction} · {topicLabel}
                  </Text>
                  {contextExpanded && (
                    <View style={{ marginTop: 12, gap: 12 }}>
                      <View style={{ backgroundColor: "#f0f9fa", borderRadius: 10, padding: 14, borderLeftWidth: 3, borderLeftColor: "#2A8A98" }}>
                        <Text style={{ fontSize: 12, fontFamily: "DMSans_600SemiBold", color: "#2A8A98", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Overview</Text>
                        <Text style={{ fontSize: 13, color: colors.foreground, fontFamily: "DMSans_400Regular", lineHeight: 19 }}>
                          {resolved.entry.overview}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, fontFamily: "DMSans_600SemiBold", color: colors.mutedForeground, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Key legal concepts</Text>
                        {resolved.entry.keyConcepts.map((concept, i) => (
                          <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                            <Feather name="check-circle" size={13} color="#2A8A98" style={{ marginTop: 2, flexShrink: 0 }} />
                            <Text style={{ fontSize: 13, color: colors.foreground, fontFamily: "DMSans_400Regular", lineHeight: 18, flex: 1 }}>{concept}</Text>
                          </View>
                        ))}
                      </View>
                      {currentCase.confidenceLevel && (
                        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                          <View style={{ backgroundColor: "#f3f5f9", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "DMSans_500Medium" }}>
                              Confidence: <Text style={{ color: currentCase.confidenceLevel === "high" ? "#16a34a" : currentCase.confidenceLevel === "low" ? "#dc2626" : "#d97706", fontFamily: "DMSans_600SemiBold" }}>{currentCase.confidenceLevel}</Text>
                            </Text>
                          </View>
                          {currentCase.complexityLevel && (
                            <View style={{ backgroundColor: "#f3f5f9", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                              <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "DMSans_500Medium" }}>
                                Complexity: <Text style={{ color: colors.foreground, fontFamily: "DMSans_600SemiBold" }}>{currentCase.complexityLevel}</Text>
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                      {currentCase.detectedLegalTopics && currentCase.detectedLegalTopics.length > 0 && (
                        <View>
                          <Text style={{ fontSize: 12, fontFamily: "DMSans_600SemiBold", color: colors.mutedForeground, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>AI-detected topic areas</Text>
                          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                            {currentCase.detectedLegalTopics.map((topic, i) => (
                              <View key={i} style={{ backgroundColor: "#eef4ff", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                                <Text style={{ fontSize: 12, color: "#3b5fc4", fontFamily: "DMSans_500Medium" }}>{topic}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                      <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "DMSans_400Regular", fontStyle: "italic", lineHeight: 16 }}>
                        This context was used to guide the AI analysis above. It is not a legal opinion.
                      </Text>
                    </View>
                  )}
                </View>
              );
            })()}

            {currentCase.missingInformation && currentCase.missingInformation.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Feather name="help-circle" size={16} color="#7c5c28" />
                  <Text style={[styles.sectionTitle, { color: "#7c5c28" }]}>Missing Information</Text>
                </View>
                <Text style={[styles.sectionNote, { color: colors.mutedForeground }]}>
                  Facts that may be missing from your file — clarifying these may strengthen your position.
                </Text>
                {currentCase.missingInformation.map((item, i) => (
                  <View key={i} style={[styles.issueItem, { backgroundColor: "#fef9e7", borderColor: "#d4a017" + "40" }]}>
                    <Feather name="alert-triangle" size={12} color="#7c5c28" style={{ marginTop: 3, flexShrink: 0 }} />
                    <Text style={[styles.issueText, { color: colors.foreground }]}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {currentCase.redFlags && currentCase.redFlags.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Feather name="alert-circle" size={16} color={colors.alertRed} />
                  <Text style={[styles.sectionTitle, { color: colors.alertRed }]}>Documentation Concerns</Text>
                </View>
                <Text style={[styles.sectionNote, { color: colors.mutedForeground }]}>
                  Informational observations, each with a suggested action. Not legal conclusions.
                </Text>
                {currentCase.redFlags.map((flag, i) => {
                  const action = currentCase.gapActions?.[i];
                  return (
                    <View key={i} style={[styles.flagCard, { backgroundColor: colors.card, borderColor: colors.alertRed + "30" }]}>
                      <View style={styles.flagCardTop}>
                        <Feather name="alert-circle" size={14} color={colors.alertRed} style={{ marginTop: 2, flexShrink: 0 }} />
                        <Text style={[styles.flagText, { color: colors.foreground }]}>{flag}</Text>
                      </View>
                      {action && (
                        <View style={[styles.flagActionRow, { borderTopColor: colors.border, backgroundColor: colors.tealLight }]}>
                          <Feather name="arrow-right-circle" size={13} color={colors.teal} style={{ marginTop: 1, flexShrink: 0 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.flagActionLabel, { color: colors.teal }]}>Recommended Action</Text>
                            <Text style={[styles.flagActionText, { color: colors.slate }]}>{action}</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {currentCase.missingEvidence && currentCase.missingEvidence.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Feather name="file-minus" size={16} color={colors.gold} />
                  <Text style={[styles.sectionTitle, { color: colors.gold }]}>Items to Consider Adding</Text>
                </View>
                <Text style={[styles.sectionNote, { color: colors.mutedForeground }]}>
                  To help make your documentation more complete — based on your inputs.
                </Text>
                {currentCase.missingEvidence.map((item, i) => (
                  <View key={i} style={[styles.flagItem, { backgroundColor: colors.goldLight, borderColor: colors.gold + "40" }]}>
                    <Feather name="plus-circle" size={14} color={colors.gold} />
                    <Text style={[styles.flagText, { color: colors.foreground }]}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {currentCase.nextSteps && currentCase.nextSteps.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Feather name="check-square" size={16} color={colors.teal} />
                  <Text style={[styles.sectionTitle, { color: colors.teal }]}>Suggested Next Steps</Text>
                </View>
                <Text style={[styles.sectionNote, { color: colors.mutedForeground }]}>
                  Practical steps based on your case information. A clearer path forward.
                </Text>
                {currentCase.nextSteps.map((step, i) => (
                  <View key={i} style={[styles.stepItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[styles.stepNum, { backgroundColor: colors.navy }]}>
                      <Text style={styles.stepNumText}>{i + 1}</Text>
                    </View>
                    <Text style={[styles.flagText, { color: colors.foreground }]}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {currentCase.questionsToAskLawyer && currentCase.questionsToAskLawyer.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Feather name="message-circle" size={16} color={colors.navy} />
                  <Text style={[styles.sectionTitle, { color: colors.navy }]}>Questions to Ask a Lawyer</Text>
                </View>
                <Text style={[styles.sectionNote, { color: colors.mutedForeground }]}>
                  Based on your jurisdiction and what you've shared. Bring these to a consultation.
                </Text>
                {currentCase.questionsToAskLawyer.map((q, i) => (
                  <View key={i} style={[styles.stepItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[styles.stepNum, { backgroundColor: colors.navy }]}>
                      <Text style={styles.stepNumText}>{i + 1}</Text>
                    </View>
                    <Text style={[styles.flagText, { color: colors.foreground }]}>{q}</Text>
                  </View>
                ))}
              </View>
            )}

            {currentCase.verificationStatus && (
              <View style={[styles.trustStrip, {
                backgroundColor: currentCase.verificationStatus === "verified"
                  ? "rgba(46, 159, 176, 0.08)"
                  : currentCase.verificationStatus === "partial"
                    ? "rgba(212, 175, 55, 0.08)"
                    : "rgba(102, 117, 143, 0.08)",
                borderColor: currentCase.verificationStatus === "verified"
                  ? "rgba(46, 159, 176, 0.3)"
                  : currentCase.verificationStatus === "partial"
                    ? "rgba(212, 175, 55, 0.3)"
                    : colors.border,
              }]}>
                <Feather
                  name={currentCase.verificationStatus === "verified" ? "check-circle" : currentCase.verificationStatus === "partial" ? "alert-circle" : "info"}
                  size={13}
                  color={currentCase.verificationStatus === "verified" ? colors.teal : currentCase.verificationStatus === "partial" ? colors.gold : colors.mutedForeground}
                />
                <Text style={[styles.trustStripText, {
                  color: currentCase.verificationStatus === "verified" ? colors.teal : currentCase.verificationStatus === "partial" ? colors.gold : colors.mutedForeground,
                }]}>
                  {currentCase.verificationStatus === "verified"
                    ? "Key points grounded in verified jurisdiction sources"
                    : currentCase.verificationStatus === "partial"
                      ? "Some points grounded in verified sources; others are general guidance"
                      : "General guidance — no specific verified sources available for this topic"}
                  {currentCase.knowledgeLastVerified ? ` · Sources verified ${currentCase.knowledgeLastVerified}` : ""}
                </Text>
                {currentCase.knowledgeIsStale && (
                  <View style={[styles.staleTag, { backgroundColor: "rgba(212,175,55,0.15)", borderColor: "rgba(212,175,55,0.4)" }]}>
                    <Text style={[styles.staleTagText, { color: colors.gold }]}>May be outdated</Text>
                  </View>
                )}
              </View>
            )}

            {currentCase.knowledgeIsStale && (
              <View style={[styles.staleWarning, { backgroundColor: "rgba(212,175,55,0.07)", borderColor: "rgba(212,175,55,0.25)" }]}>
                <Feather name="clock" size={13} color={colors.gold} />
                <Text style={[styles.staleWarningText, { color: colors.gold }]}>
                  The legal knowledge used for this analysis{currentCase.knowledgeLastVerified ? ` was last verified on ${currentCase.knowledgeLastVerified}` : " may be outdated"}. Laws can change — you may want to verify current rules with a licensed lawyer or official government source.
                </Text>
              </View>
            )}

            {currentCase.conflictNote && (
              <View style={[styles.conflictNote, { backgroundColor: "rgba(212,175,55,0.07)", borderColor: "rgba(212,175,55,0.25)" }]}>
                <Feather name="alert-triangle" size={13} color={colors.gold} />
                <Text style={[styles.conflictNoteText, { color: colors.foreground }]}>{currentCase.conflictNote}</Text>
              </View>
            )}

            {currentCase.crossJurisdictionNote && (
              <View style={[styles.conflictNote, { backgroundColor: "rgba(20,59,109,0.06)", borderColor: "rgba(20,59,109,0.18)" }]}>
                <Feather name="globe" size={13} color={colors.navy} />
                <Text style={[styles.conflictNoteText, { color: colors.foreground }]}>{currentCase.crossJurisdictionNote}</Text>
              </View>
            )}

            {currentCase.sourceCitations && currentCase.sourceCitations.length > 0 && (
              <View style={[styles.section, { marginBottom: 8 }]}>
                <Pressable
                  style={[styles.sourcesHeader, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => setSourcesExpanded(!sourcesExpanded)}
                  hitSlop={4}
                >
                  <Feather name="book-open" size={14} color={colors.teal} />
                  <Text style={[styles.sourcesHeaderText, { color: colors.teal }]}>
                    View Sources ({currentCase.sourceCitations.length})
                  </Text>
                  <Feather name={sourcesExpanded ? "chevron-up" : "chevron-down"} size={14} color={colors.teal} />
                </Pressable>
                {sourcesExpanded && (
                  <View style={[styles.sourcesPanel, { borderColor: colors.border, backgroundColor: colors.card }]}>
                    <Text style={[styles.sourcesPanelNote, { color: colors.mutedForeground }]}>
                      These are the government and official sources the analysis was grounded in. Tap any source to view it.
                    </Text>
                    {currentCase.sourceCitations.map((source, i) => (
                      <Pressable
                        key={source.id || i}
                        style={({ pressed }) => [styles.sourceItem, { borderColor: colors.border, opacity: pressed ? 0.75 : 1 }]}
                        onPress={() => Linking.openURL(source.url)}
                      >
                        <View style={styles.sourceItemHeader}>
                          <Feather name="external-link" size={12} color={colors.teal} />
                          <Text style={[styles.sourceTitle, { color: colors.foreground }]} numberOfLines={2}>
                            {source.title}
                          </Text>
                        </View>
                        {source.section && (
                          <Text style={[styles.sourceSection, { color: colors.mutedForeground }]} numberOfLines={2}>
                            {source.section}
                          </Text>
                        )}
                        <View style={styles.sourceMetaRow}>
                          <Text style={[styles.sourceMeta, { color: colors.mutedForeground }]}>
                            {source.jurisdiction}
                          </Text>
                          {source.dateVerified && (
                            <Text style={[styles.sourceMeta, { color: colors.mutedForeground }]}>
                              · Verified {source.dateVerified}
                            </Text>
                          )}
                        </View>
                        {source.relevance && (
                          <Text style={[styles.sourceRelevance, { color: colors.mutedForeground }]} numberOfLines={3}>
                            {source.relevance}
                          </Text>
                        )}
                      </Pressable>
                    ))}
                    <Text style={[styles.sourcesDisclaimer, { color: colors.mutedForeground }]}>
                      These sources are provided for reference only. Always verify current rules directly with official sources or a licensed lawyer.
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={[styles.legalNote, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Feather name="shield" size={14} color={colors.mutedForeground} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.legalTitle, { color: colors.foreground }]}>About This Analysis</Text>
                <Text style={[styles.legalText, { color: colors.mutedForeground }]}>
                  This analysis is generated using AI supported by jurisdiction-specific legal knowledge. It's designed to give you a clearer picture of your situation — not to serve as legal advice. Language like "may suggest" or "consider adding" reflects real uncertainty in the analysis. Always consult a licensed legal professional.{currentCase.jurisdictionDisplayName ? ` Analysis guided by: ${currentCase.jurisdictionDisplayName}.` : ""}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  premiumBadgeText: {
    fontSize: 9,
    fontFamily: "DMSans_600SemiBold",
    color: "#C9A227",
    letterSpacing: 0.5,
  },
  helpBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    lineHeight: 34,
  },
  headerSub: {
    fontSize: 13.5,
    color: "rgba(255,255,255,0.65)",
    fontFamily: "DMSans_400Regular",
    marginTop: 4,
    lineHeight: 20,
  },
  jurisdictionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  jurisdictionChipText: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: "rgba(255,255,255,0.7)",
  },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 20 },
  emptyState: {
    alignItems: "center",
    padding: 40,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    gap: 12,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 22, fontFamily: "Raleway_700Bold", textAlign: "center", letterSpacing: 0.4, lineHeight: 28 },
  emptyText: { fontSize: 14, fontFamily: "DMSans_400Regular", textAlign: "center", lineHeight: 21 },
  emptyFeatures: {
    width: "100%",
    borderTopWidth: 1,
    paddingTop: 14,
    gap: 10,
    marginTop: 4,
  },
  emptyFeatureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  emptyFeatureText: {
    fontSize: 13.5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
  caseInfo: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  caseLabel: { fontSize: 11, fontFamily: "DMSans_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  caseName: { fontSize: 18, fontFamily: "Raleway_700Bold", letterSpacing: 0.4 },
  caseType: { fontSize: 13, fontFamily: "DMSans_500Medium" },
  meterCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  analyzeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
  },
  analyzeBtnText: {
    color: "#FFFFFF",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
  },
  section: { gap: 8 },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Raleway_700Bold",
    letterSpacing: 0.4,
  },
  sectionNote: {
    fontSize: 12.5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 18,
    marginBottom: 4,
  },
  flagItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  flagCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  flagCardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
  },
  flagActionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
  },
  flagActionLabel: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  flagActionText: {
    fontSize: 12.5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 18,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  stepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
  },
  flagText: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
  metadataRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  metaBadgeText: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    letterSpacing: 0.1,
  },
  outlookHero: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  outlookHeroTop: {
    padding: 20,
    paddingBottom: 16,
    gap: 10,
  },
  outlookLabel: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  outlookHeroText: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  outlookWhyMatters: {
    fontSize: 12.5,
    fontFamily: "DMSans_500Medium",
    lineHeight: 18,
    fontStyle: "italic",
    marginTop: 4,
  },
  outlookHeroFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  outlookFooterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  outlookFooterDivider: {
    width: 1,
    height: 12,
  },
  outlookFooterText: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
  },
  issueItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6,
  },
  issueText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    lineHeight: 19,
    flex: 1,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  legalAreaTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  legalAreaTagText: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
  },
  factorsBlock: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    gap: 6,
  },
  factorsLabel: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  factorRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },
  factorText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    lineHeight: 19,
    flex: 1,
  },
  legalNote: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  legalTitle: { fontSize: 13.5, fontFamily: "Raleway_600SemiBold", marginBottom: 4 },
  legalText: { fontSize: 12.5, fontFamily: "DMSans_400Regular", lineHeight: 19 },
  trustStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  trustStripText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    lineHeight: 17,
    flex: 1,
    flexShrink: 1,
  },
  staleTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  staleTagText: {
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.2,
  },
  staleWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  staleWarningText: {
    fontSize: 12.5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 18,
    flex: 1,
  },
  conflictNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  conflictNoteText: {
    fontSize: 12.5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 18,
    flex: 1,
  },
  sourcesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  sourcesHeaderText: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
    flex: 1,
  },
  sourcesPanel: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 14,
    gap: 10,
  },
  sourcesPanelNote: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    lineHeight: 17,
    marginBottom: 4,
  },
  sourceItem: {
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 4,
    gap: 4,
  },
  sourceItemHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  sourceTitle: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
    lineHeight: 18,
    flex: 1,
  },
  sourceSection: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    lineHeight: 17,
    marginLeft: 18,
  },
  sourceMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 18,
  },
  sourceMeta: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
  },
  sourceRelevance: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    lineHeight: 17,
    marginLeft: 18,
    marginTop: 2,
    fontStyle: "italic",
  },
  sourcesDisclaimer: {
    fontSize: 11.5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 16,
    marginTop: 4,
    fontStyle: "italic",
  },
});

import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
import { useCases } from "@/context/CaseContext";
import { useColors } from "@/hooks/useColors";
import { useSubscription } from "@/lib/revenuecat";
import { useTranslation } from "@/hooks/useTranslation";
import { computeNextSteps, generateCaseSummary, generateLawyerQuestions } from "@/lib/ai";
import { openSupportEmail } from "@/lib/support";

export default function AISummaryScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { activeCase, cases, updateCase, getCaseEvidence, getCaseTimeline } = useCases();
  const { hasAccessTo } = useSubscription();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [mode, setMode] = useState<"plain" | "professional">("plain");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const currentCase = activeCase || cases[0];
  const isPremium = hasAccessTo("basic");

  const jurisdictionLabel = currentCase
    ? currentCase.country === "CA"
      ? `${currentCase.province || "Canada"}, Canada`
      : `${currentCase.state || "United States"}, USA`
    : null;

  const hasJurisdiction = !!(currentCase?.province || currentCase?.state);

  const handleGenerate = async () => {
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
    setIsGenerating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const caseEvidence = getCaseEvidence(currentCase.id);
      const caseTimeline = getCaseTimeline(currentCase.id);
      const { plain, professional } = await generateCaseSummary(currentCase, caseEvidence, caseTimeline);
      updateCase(currentCase.id, { aiSummary: plain, professionalSummary: professional });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert(t("error"), t("errorSummary"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!currentCase) return;
    setIsGeneratingQuestions(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const caseEvidence = getCaseEvidence(currentCase.id);
      const questions = await generateLawyerQuestions(currentCase, caseEvidence);
      updateCase(currentCase.id, { lawyerQuestions: questions });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert(t("error"), t("errorQuestions"));
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const summary = currentCase
    ? (mode === "plain" ? currentCase.aiSummary : currentCase.professionalSummary)
    : undefined;

  const aiNextSteps = currentCase?.nextSteps ?? [];
  const lawyerQuestions = currentCase?.lawyerQuestions ?? [];

  const evidenceCount = currentCase ? getCaseEvidence(currentCase.id).length : 0;
  const timelineCount = currentCase ? getCaseTimeline(currentCase.id).length : 0;
  const computedSteps = currentCase ? computeNextSteps(currentCase, evidenceCount, timelineCount) : [];
  const hasAiSteps = aiNextSteps.length > 0;
  const displayedNextSteps = hasAiSteps ? aiNextSteps : computedSteps;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.navy }]}>
        <View style={{ flex: 1 }}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>{t("aiOrganizerTitle")}</Text>
            {!isPremium && (
              <View style={[styles.premiumBadge, { backgroundColor: "rgba(201,162,39,0.18)", borderColor: "rgba(201,162,39,0.4)" }]}>
                <Feather name="award" size={9} color="#C9A227" />
                <Text style={styles.premiumBadgeText}>BASIC+</Text>
              </View>
            )}
          </View>
          {currentCase && (
            <Text style={styles.headerSub} numberOfLines={1}>{currentCase.title}</Text>
          )}
          {jurisdictionLabel && (
            <View style={styles.jurisdictionChip}>
              <Feather name="map-pin" size={10} color="rgba(255,255,255,0.7)" />
              <Text style={styles.jurisdictionChipText}>{jurisdictionLabel}</Text>
            </View>
          )}
        </View>
        <Pressable
          onPress={() => openSupportEmail("question", "I have a question about the AI Organizer:")}
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
        {!currentCase ? (
          <EmptyStateCard
            illustration="ai"
            eyebrow={t("aiEmptyEyebrow")}
            title={t("aiEmptyTitle")}
            body={t("aiEmptyText")}
            features={[
              { icon: "file-text", label: t("aiFeature1"), tint: colors.teal },
              { icon: "check-square", label: t("aiFeature2"), tint: colors.teal },
              { icon: "help-circle", label: t("aiFeature3"), tint: colors.teal },
            ]}
            ctaLabel={t("ctaTitleEmpty")}
            onCta={() => router.push("/case/new")}
            ctaColor={colors.navy}
          />
        ) : (
          <>
            {hasJurisdiction && jurisdictionLabel ? (
              <DisclaimerBanner jurisdiction={jurisdictionLabel} />
            ) : (
              <DisclaimerBanner showSetJurisdiction />
            )}

            <View style={[styles.modeSwitch, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              {(["plain", "professional"] as const).map(m => (
                <Pressable
                  key={m}
                  onPress={() => setMode(m)}
                  style={[
                    styles.modeBtn,
                    { backgroundColor: mode === m ? colors.navy : "transparent" },
                  ]}
                >
                  <Text style={[styles.modeBtnText, { color: mode === m ? "#FFFFFF" : colors.mutedForeground }]}>
                    {m === "plain" ? t("plainLanguage") : t("professional")}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleGenerate}
              disabled={isGenerating}
              style={({ pressed }) => [
                styles.generateBtn,
                {
                  backgroundColor: isPremium ? colors.teal : colors.navy,
                  opacity: pressed ? 0.85 : isGenerating ? 0.7 : 1,
                },
              ]}
            >
              {isGenerating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Feather name={isPremium ? "zap" : "lock"} size={18} color="#FFFFFF" />
              )}
              <Text style={styles.generateBtnText}>
                {isGenerating ? t("generating") : !isPremium ? t("unlockSummary") : summary ? t("regenerateSummary") : t("generateSummary")}
              </Text>
            </Pressable>

            {summary ? (
              <View style={[styles.summaryBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.summaryHeader, { borderBottomColor: colors.border }]}>
                  <Feather name="file-text" size={16} color={colors.teal} />
                  <Text style={[styles.summaryLabel, { color: colors.teal }]}>
                    {mode === "plain" ? t("summaryLabelPlain") : t("summaryLabelPro")}
                  </Text>
                </View>
                <Text style={[styles.summaryText, { color: colors.foreground }]}>
                  {summary}
                </Text>
                <View style={[styles.summaryFooter, { borderTopColor: colors.border }]}>
                  <DisclaimerBanner compact />
                </View>
              </View>
            ) : (
              <View style={[styles.promptBox, { backgroundColor: colors.tealLight, borderColor: colors.teal }]}>
                <Feather name="info" size={16} color={colors.teal} />
                <Text style={[styles.promptText, { color: colors.slate }]}>
                  {t("summaryPrompt")}
                </Text>
              </View>
            )}

            {displayedNextSteps.length > 0 && (
              <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.sectionCardHeader}>
                  <View style={[styles.sectionIconWrap, { backgroundColor: colors.teal + "15" }]}>
                    <Feather name="check-square" size={16} color={colors.teal} />
                  </View>
                  <Text style={[styles.sectionCardTitle, { color: colors.foreground }]}>{t("nextSteps")}</Text>
                  {hasAiSteps && (
                    <View style={[styles.aiPill, { backgroundColor: colors.teal + "18" }]}>
                      <Text style={[styles.aiPillText, { color: colors.teal }]}>{t("aiGenerated")}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.sectionCardNote, { color: colors.mutedForeground }]}>
                  {hasAiSteps ? t("nextStepsAISub") : t("nextStepsBasicSub")}
                </Text>
                {displayedNextSteps.map((step, i) => (
                  <View key={i} style={[styles.listRow, { borderTopColor: colors.border }]}>
                    <View style={[styles.stepNumber, { backgroundColor: colors.navy }]}>
                      <Text style={styles.stepNumberText}>{i + 1}</Text>
                    </View>
                    <Text style={[styles.listText, { color: colors.foreground }]}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionCardHeader}>
                <View style={[styles.sectionIconWrap, { backgroundColor: colors.gold + "20" }]}>
                  <Feather name="message-circle" size={16} color={colors.gold} />
                </View>
                <Text style={[styles.sectionCardTitle, { color: colors.foreground }]}>{t("lawyerQuestionsTitle")}</Text>
              </View>
              <Text style={[styles.sectionCardNote, { color: colors.mutedForeground }]}>
                {t("lawyerQuestionsSub")}
              </Text>

              {lawyerQuestions.length > 0 ? (
                lawyerQuestions.map((q, i) => (
                  <View key={i} style={[styles.listRow, { borderTopColor: colors.border }]}>
                    <Feather name="help-circle" size={14} color={colors.gold} style={{ marginTop: 2 }} />
                    <Text style={[styles.listText, { color: colors.foreground }]}>{q}</Text>
                  </View>
                ))
              ) : (
                <View style={[styles.generatePrompt, { borderTopColor: colors.border }]}>
                  <Text style={[styles.generatePromptText, { color: colors.mutedForeground }]}>
                    {t("lawyerQuestionsPrompt")}
                  </Text>
                </View>
              )}

              <Pressable
                onPress={handleGenerateQuestions}
                disabled={isGeneratingQuestions}
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  {
                    borderColor: colors.gold,
                    opacity: pressed ? 0.85 : isGeneratingQuestions ? 0.7 : 1,
                  },
                ]}
              >
                {isGeneratingQuestions ? (
                  <ActivityIndicator size="small" color={colors.gold} />
                ) : (
                  <Feather name="refresh-cw" size={15} color={colors.gold} />
                )}
                <Text style={[styles.secondaryBtnText, { color: colors.gold }]}>
                  {isGeneratingQuestions ? t("generating") : lawyerQuestions.length > 0 ? t("regenerateQuestions") : t("generateQuestions")}
                </Text>
              </Pressable>
            </View>

            <View style={[styles.infoBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Text style={[styles.infoTitle, { color: colors.foreground }]}>{t("howAIWorksTitle")}</Text>
              <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                {"\u2022"} {t("howAIWorksBullet1")}{"\n"}
                {"\u2022"} {t("howAIWorksBullet2")}{"\n"}
                {"\u2022"} {t("howAIWorksBullet3")}{"\n"}
                {"\u2022"} {t("howAIWorksBullet4")}
              </Text>
              <View style={[styles.varianceNote, { borderTopColor: colors.border }]}>
                <Feather name="alert-circle" size={12} color={colors.mutedForeground} />
                <Text style={[styles.varianceText, { color: colors.mutedForeground }]}>
                  {t("howAIWorksVariance")}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/export");
              }}
              style={({ pressed }) => [
                styles.exportBanner,
                {
                  backgroundColor: colors.gold,
                  opacity: pressed ? 0.88 : 1,
                  shadowColor: colors.gold,
                },
              ]}
            >
              <View style={styles.exportBannerLeft}>
                <View style={styles.exportBannerIcon}>
                  <Feather name="file-text" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.exportBannerTitle}>{t("exportPDF")}</Text>
                  <Text style={styles.exportBannerSub}>{t("exportPDFSub")}</Text>
                </View>
              </View>
              <Feather name="arrow-right" size={18} color="rgba(255,255,255,0.8)" />
            </Pressable>
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
  modeSwitch: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modeBtnText: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
  },
  generateBtnText: {
    color: "#FFFFFF",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
  },
  summaryBox: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderBottomWidth: 1,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
  summaryText: {
    padding: 16,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 23,
  },
  summaryFooter: {
    padding: 12,
    borderTopWidth: 1,
  },
  promptBox: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  promptText: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 21,
  },
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    paddingBottom: 8,
    flexWrap: "wrap",
  },
  aiPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiPillText: {
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
  },
  sectionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionCardTitle: {
    fontSize: 15,
    fontFamily: "Raleway_600SemiBold",
  },
  sectionCardNote: {
    fontSize: 12.5,
    fontFamily: "DMSans_400Regular",
    paddingHorizontal: 14,
    paddingBottom: 8,
    lineHeight: 18,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
  },
  listText: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
  generatePrompt: {
    padding: 14,
    borderTopWidth: 1,
  },
  generatePromptText: {
    fontSize: 13.5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    margin: 12,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
  },
  infoText: {
    fontSize: 13.5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 21,
  },
  varianceNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
  },
  varianceText: {
    flex: 1,
    fontSize: 11.5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 16,
  },
  exportBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  exportBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    flex: 1,
  },
  exportBannerIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  exportBannerTitle: {
    fontSize: 15,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  exportBannerSub: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255,255,255,0.75)",
    marginTop: 3,
  },
});

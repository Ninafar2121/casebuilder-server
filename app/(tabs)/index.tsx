import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyStateCard } from "@/components/EmptyStateCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useCases } from "@/context/CaseContext";
import { useProfile } from "@/context/ProfileContext";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";

const NAVY = "#143B6D";
const TEAL = "#2E9FB0";
const GOLD = "#D4AF37";
const TEXT_PRIMARY = "#13233F";
const TEXT_SECONDARY = "#66758F";

function CaseCard({ caseItem }: { caseItem: any }) {
  const colors = useColors();
  const { t } = useTranslation();

  const statusColors: Record<string, string> = {
    active: TEAL,
    archived: TEXT_SECONDARY,
    exported: "#2E7D57",
  };
  const statusLabels: Record<string, string> = {
    active: t("statusActive"),
    archived: t("statusArchived"),
    exported: t("statusExported"),
  };

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/case/[id]", params: { id: caseItem.id } });
      }}
      style={({ pressed }) => [
        styles.caseCard,
        {
          backgroundColor: colors.card,
          shadowColor: colors.shadowColor,
          transform: [{ scale: pressed ? 0.985 : 1 }],
          opacity: pressed ? 0.95 : 1,
        },
      ]}
    >
      <View style={styles.caseCardTop}>
        <View style={[styles.caseIconBg, { backgroundColor: TEAL + "18" }]}>
          <Feather name="briefcase" size={18} color={TEAL} />
        </View>
        <View style={styles.caseInfo}>
          <Text style={styles.caseName} numberOfLines={1}>{caseItem.title}</Text>
          <Text style={styles.caseType}>{caseItem.disputeType}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: (statusColors[caseItem.status] || TEXT_SECONDARY) + "18" }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColors[caseItem.status] || TEXT_SECONDARY }]} />
          <Text style={[styles.statusText, { color: statusColors[caseItem.status] || TEXT_SECONDARY }]}>
            {statusLabels[caseItem.status] || caseItem.status}
          </Text>
        </View>
      </View>
      <View style={styles.caseCardBottom}>
        <View style={styles.caseMeta}>
          <Feather name="map-pin" size={11} color={TEXT_SECONDARY} />
          <Text style={styles.caseMetaText}>
            {caseItem.country === "CA" ? caseItem.province : caseItem.state}
          </Text>
        </View>
        <View style={styles.caseMeta}>
          <Feather name="refresh-cw" size={11} color={TEXT_SECONDARY} />
          <Text style={styles.caseMetaText}>
            {new Date(caseItem.updatedAt).toLocaleDateString()}
          </Text>
        </View>
        {caseItem.riskScore !== undefined && (
          <View style={[
            styles.riskBadge,
            {
              backgroundColor: caseItem.riskScore >= 70 ? "#FDEAEA" : caseItem.riskScore >= 40 ? "#F8F1D8" : "#E8F5EE",
              borderColor: caseItem.riskScore >= 70 ? "#B94141" : caseItem.riskScore >= 40 ? GOLD : "#2E7D57",
            },
          ]}>
            <Text style={{
              fontSize: 10,
              fontFamily: "DMSans_600SemiBold",
              color: caseItem.riskScore >= 70 ? "#B94141" : caseItem.riskScore >= 40 ? GOLD : "#2E7D57",
            }}>
              Score {caseItem.riskScore}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { cases, activeCase } = useCases();
  const { profile } = useProfile();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;
  const activeCases = cases.filter(c => c.status === "active");

  const QUICK_ACTIONS = [
    { icon: "folder", label: t("evidenceTitle"), subtitle: t("evidenceToolSub"), route: "/(tabs)/evidence", tint: TEAL, bg: "#EEF7FB" },
    { icon: "clock", label: t("timelineTitle"), subtitle: t("timelineToolSub"), route: "/(tabs)/timeline", tint: NAVY, bg: "#F2F5FB" },
    { icon: "cpu", label: t("aiOrganizerTitle"), subtitle: t("aiOrganizerToolSub"), route: "/(tabs)/ai", tint: TEAL, bg: "#EAF7F8", premium: "BASIC+" },
    { icon: "search", label: t("gapAnalysisTitle"), subtitle: t("gapAnalysisToolSub"), route: "/(tabs)/risk", tint: GOLD, bg: "#FCF5E3", premium: "PLUS+" },
  ] as const;

  const dashCase = activeCase || (cases.length > 0 ? cases[0] : null);
  const hasNextSteps = dashCase?.nextSteps && dashCase.nextSteps.length > 0;
  const hasGaps = dashCase?.redFlags && dashCase.redFlags.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* ── Hero Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <LinearGradient
          colors={["#0E2E57", "#143B6D", "#1F4F86"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.52, 1]}
        />
        <View style={styles.headerRule} pointerEvents="none" />

        <View style={styles.headerContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{t("greeting")}</Text>

            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>CaseBuilder</Text>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
            </View>

            <Text style={styles.headerSub}>
              {t("headerSub")}
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/(tabs)/settings")}
            style={({ pressed }) => [styles.avatarBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Feather name="user" size={18} color="rgba(255,255,255,0.85)" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad + 120 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          {[
            { label: t("statTotalCases"), value: cases.length, color: NAVY },
            { label: t("statActive"), value: activeCases.length, color: TEAL },
            { label: t("statExported"), value: cases.filter(c => c.status === "exported").length, color: GOLD },
          ].map(stat => (
            <View
              key={stat.label}
              style={[styles.statCard, { backgroundColor: colors.card, shadowColor: colors.shadowColor }]}
            >
              <Text style={[styles.statNum, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Trust Strip ── */}
        <View style={[styles.trustStrip, { shadowColor: colors.shadowColor }]}>
          {[
            { icon: "lock", label: t("trustPrivate") },
            { icon: "smartphone", label: t("trustOnDevice") },
            { icon: "check-circle", label: t("trustControl") },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <View style={styles.trustDivider} />}
              <View style={styles.trustItem}>
                <Feather name={item.icon as any} size={13} color={TEAL} />
                <Text style={styles.trustLabel}>{item.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* ── Primary CTA ── */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/case/new");
          }}
          style={[styles.ctaWrapper, { shadowColor: "#102E57" }]}
        >
          <LinearGradient
            colors={["#173E73", "#2E9FB0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <View style={styles.ctaContent}>
              <View style={styles.ctaLeft}>
                <View style={styles.ctaIconWrap}>
                  <Feather name={cases.length === 0 ? "briefcase" : "plus-circle"} size={26} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ctaTitle}>
                    {cases.length === 0 ? t("ctaTitleEmpty") : t("ctaTitle")}
                  </Text>
                  <Text style={styles.ctaSub}>
                    {cases.length === 0 ? t("ctaSubEmpty") : t("ctaSub")}
                  </Text>
                  <Text style={styles.ctaSupport}>
                    {t("ctaSupport")}
                  </Text>
                </View>
              </View>
              <View style={styles.ctaArrow}>
                <Feather name="arrow-right" size={22} color="rgba(255,255,255,0.95)" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Disclaimer chip ── */}
        <View style={styles.disclaimerChip}>
          <Feather name="info" size={13} color="#93A1B5" />
          <Text style={styles.disclaimerChipText}>
            {t("notLegalAdvice")}
          </Text>
        </View>

        {/* ── Preview cards for returning users ── */}
        {hasNextSteps && dashCase && (
          <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: TEAL + "40", shadowColor: colors.shadowColor }]}>
            <View style={styles.previewCardHeader}>
              <View style={[styles.previewIconWrap, { backgroundColor: TEAL + "15" }]}>
                <Feather name="check-square" size={15} color={TEAL} />
              </View>
              <Text style={styles.previewCardTitle}>{t("nextSteps")}</Text>
              <Pressable onPress={() => router.push("/(tabs)/ai")} style={styles.previewViewAll}>
                <Text style={[styles.previewViewAllText, { color: TEAL }]}>{t("viewAll")}</Text>
                <Feather name="chevron-right" size={13} color={TEAL} />
              </Pressable>
            </View>
            <Text style={styles.previewCaseName} numberOfLines={1}>{dashCase.title}</Text>
            {dashCase.nextSteps!.slice(0, 2).map((step, i) => (
              <View key={i} style={[styles.previewRow, i > 0 && { borderTopWidth: 1, borderTopColor: "#DCE4EF" }]}>
                <View style={[styles.previewStepNum, { backgroundColor: NAVY }]}>
                  <Text style={styles.previewStepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.previewRowText} numberOfLines={2}>{step}</Text>
              </View>
            ))}
            {dashCase.nextSteps!.length > 2 && (
              <Text style={styles.previewMore}>+{dashCase.nextSteps!.length - 2} {t("moreInAIOrganizer")}</Text>
            )}
          </View>
        )}

        {hasGaps && dashCase && (
          <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: GOLD + "40", shadowColor: colors.shadowColor }]}>
            <View style={styles.previewCardHeader}>
              <View style={[styles.previewIconWrap, { backgroundColor: GOLD + "18" }]}>
                <Feather name="alert-circle" size={15} color={GOLD} />
              </View>
              <Text style={styles.previewCardTitle}>
                {dashCase.redFlags!.length} {t("gapsDetected")}
              </Text>
              <Pressable onPress={() => router.push("/(tabs)/risk")} style={styles.previewViewAll}>
                <Text style={[styles.previewViewAllText, { color: GOLD }]}>{t("review")}</Text>
                <Feather name="chevron-right" size={13} color={GOLD} />
              </Pressable>
            </View>
            <Text style={styles.previewCaseName} numberOfLines={1}>{dashCase.title}</Text>
            {dashCase.redFlags!.slice(0, 1).map((flag, i) => (
              <View key={i} style={[styles.previewRow, { borderTopWidth: 1, borderTopColor: "#DCE4EF" }]}>
                <Feather name="alert-circle" size={13} color={GOLD} style={{ marginTop: 2, flexShrink: 0 }} />
                <Text style={styles.previewRowText} numberOfLines={2}>{flag}</Text>
              </View>
            ))}
            {dashCase.redFlags!.length > 1 && (
              <Text style={styles.previewMore}>+{dashCase.redFlags!.length - 1} {t("moreInGapAnalysis")}</Text>
            )}
          </View>
        )}

        {/* ── Cases list OR How It Works ── */}
        {cases.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title={t("sectionYourCases")} />
            {cases.slice(0, 5).map(c => (
              <CaseCard key={c.id} caseItem={c} />
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <SectionHeader title={t("sectionYourCases")} />
            <EmptyStateCard
              illustration="cases"
              eyebrow={t("casesEmptyEyebrow")}
              title={t("casesEmptyTitle")}
              body={t("casesEmptySub")}
              features={[
                { icon: "edit-3", label: t("step1Title"), tint: TEAL },
                { icon: "folder", label: t("step2Title"), tint: NAVY },
                { icon: "cpu", label: t("step3Title"), tint: TEAL },
              ]}
              note={t("notLegalAdvice")}
            />
          </View>
        )}

        {/* ── Tools Grid ── */}
        <View style={styles.section}>
          <SectionHeader title={t("sectionTools")} />
          <View style={styles.toolsGrid}>
            {QUICK_ACTIONS.map(item => (
              <Pressable
                key={item.label}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push(item.route as any);
                }}
                style={({ pressed }) => [
                  styles.toolCard,
                  {
                    backgroundColor: colors.card,
                    shadowColor: colors.shadowColor,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
              >
                <View style={styles.toolIconContainer}>
                  <View style={[styles.toolIconWrap, { backgroundColor: item.bg }]}>
                    <Feather name={item.icon as any} size={22} color={item.tint} />
                  </View>
                  {"premium" in item && (
                    <View style={styles.toolPremiumBadge}>
                      <Feather name="award" size={7} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                <Text style={styles.toolLabel}>{item.label}</Text>
                <Text style={styles.toolSubtitle}>{item.subtitle}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Lawyer Finder shortcut ── */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/lawyers");
          }}
          style={({ pressed }) => [
            styles.lawyerCard,
            {
              backgroundColor: colors.card,
              shadowColor: colors.shadowColor,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View style={styles.lawyerCardLeft}>
            <View style={styles.lawyerIconWrap}>
              <Feather name="user-check" size={20} color="#2E86AB" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.lawyerTitleRow}>
                <Text style={styles.lawyerCardTitle}>Lawyer Finder</Text>
                <View style={styles.lawyerNewBadge}>
                  <Text style={styles.lawyerNewBadgeText}>NEW</Text>
                </View>
              </View>
              <Text style={styles.lawyerCardSub}>
                Connect with verified lawyers in your province who handle your type of dispute.
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={16} color={TEXT_SECONDARY} />
        </Pressable>

        {/* ── Export shortcut ── */}
        {cases.length > 0 && (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/export");
            }}
            style={({ pressed }) => [
              styles.exportShortcut,
              {
                backgroundColor: colors.card,
                shadowColor: colors.shadowColor,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <View style={[styles.exportShortcutIcon, { backgroundColor: GOLD + "18" }]}>
              <Feather name="download" size={18} color={GOLD} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.exportShortcutTitle}>{t("exportCaseFile")}</Text>
              <Text style={styles.exportShortcutSub}>{t("exportCaseSub")}</Text>
            </View>
            <Feather name="chevron-right" size={16} color={TEXT_SECONDARY} />
          </Pressable>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* ── Hero ── */
  header: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    overflow: "hidden",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRule: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  greeting: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
    color: "rgba(255,255,255,0.78)",
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 42,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.8,
    lineHeight: 46,
  },
  aiBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(212,175,55,0.10)",
    borderWidth: 1.5,
    borderColor: "rgba(212,175,55,0.55)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  aiBadgeText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    color: "#E1BE54",
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
    color: "rgba(255,255,255,0.82)",
    marginTop: 16,
    lineHeight: 25,
    maxWidth: 280,
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, gap: 20 },

  /* ── Stats ── */
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(220,228,239,0.9)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 4,
  },
  statNum: {
    fontSize: 34,
    fontFamily: "Raleway_700Bold",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: TEXT_SECONDARY,
    textAlign: "center",
  },

  /* ── Trust Strip ── */
  trustStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: "#E4EBF3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },
  trustDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#DCE4EF",
  },
  trustLabel: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
    color: TEXT_SECONDARY,
  },

  /* ── Primary CTA ── */
  ctaWrapper: {
    borderRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 12,
  },
  ctaGradient: {
    borderRadius: 28,
    paddingVertical: 22,
    paddingHorizontal: 22,
    minHeight: 120,
  },
  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  ctaLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    flex: 1,
  },
  ctaIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  ctaTitle: {
    fontSize: 26,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.3,
    lineHeight: 30,
    marginBottom: 5,
  },
  ctaSub: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: "rgba(255,255,255,0.88)",
    lineHeight: 21,
  },
  ctaSupport: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    color: "rgba(255,255,255,0.68)",
    marginTop: 6,
  },
  ctaArrow: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  /* ── Disclaimer chip ── */
  disclaimerChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFD",
    borderWidth: 1,
    borderColor: "#E1E8F1",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  disclaimerChipText: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: "#7A889F",
    flex: 1,
    lineHeight: 17,
  },

  /* ── Preview cards ── */
  previewCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  previewCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    paddingBottom: 6,
  },
  previewIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  previewCardTitle: {
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
    color: TEXT_PRIMARY,
    flex: 1,
  },
  previewViewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  previewViewAllText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
  previewCaseName: {
    fontSize: 11.5,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  previewStepNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  previewStepNumText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "DMSans_600SemiBold",
  },
  previewRowText: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: "DMSans_400Regular",
    color: TEXT_PRIMARY,
    lineHeight: 20,
  },
  previewMore: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },

  /* ── Section wrapper ── */
  section: { gap: 6 },

  /* ── Case cards ── */
  caseCard: {
    borderRadius: 18,
    marginBottom: 12,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 22,
    elevation: 5,
  },
  caseCardTop: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  caseIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  caseInfo: { flex: 1 },
  caseName: {
    fontSize: 15,
    fontFamily: "Raleway_600SemiBold",
    color: TEXT_PRIMARY,
    letterSpacing: -0.1,
  },
  caseType: {
    fontSize: 12.5,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontFamily: "DMSans_600SemiBold" },
  caseCardBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#DCE4EF",
    backgroundColor: "#FFFFFF",
  },
  caseMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  caseMetaText: { fontSize: 11.5, fontFamily: "DMSans_400Regular", color: TEXT_SECONDARY },
  riskBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: "auto",
  },

  /* ── How It Works card ── */
  howItWorksCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E6EDF5",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 32,
    elevation: 5,
  },
  howItWorksTitle: {
    fontSize: 24,
    fontFamily: "Raleway_700Bold",
    color: TEXT_PRIMARY,
    letterSpacing: 0.2,
    lineHeight: 30,
    marginBottom: 6,
  },
  howItWorksSub: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: 20,
  },
  stepsWrap: { gap: 0 },
  onboardStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingVertical: 14,
  },
  stepNumWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    flexShrink: 0,
  },
  stepNum: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
  },
  stepIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepText: { flex: 1, paddingTop: 4 },
  stepTitle: {
    fontSize: 15,
    fontFamily: "Raleway_600SemiBold",
    color: TEXT_PRIMARY,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  stepDesc: {
    fontSize: 13.5,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  stepDivider: {
    height: 1,
    backgroundColor: "#EDF2F7",
    marginLeft: 58,
  },

  /* ── Benefits panel ── */
  benefitsPanel: {
    marginTop: 20,
    backgroundColor: "#F2FBFB",
    borderWidth: 1,
    borderColor: "#CFEDEE",
    borderRadius: 20,
    padding: 18,
    gap: 10,
  },
  benefitsPanelLabel: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    color: "#44627D",
    lineHeight: 20,
    marginBottom: 2,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: "#44627D",
    lineHeight: 20,
    flex: 1,
  },

  /* ── Tools grid ── */
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  toolCard: {
    width: "47%",
    padding: 18,
    borderRadius: 24,
    gap: 10,
    minHeight: 148,
    borderWidth: 1,
    borderColor: "#E7EEF5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 28,
    elevation: 3,
  },
  toolIconContainer: {
    position: "relative",
    alignSelf: "flex-start",
  },
  toolIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  toolPremiumBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
  toolLabel: {
    fontSize: 17,
    fontFamily: "Raleway_700Bold",
    color: TEXT_PRIMARY,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  toolSubtitle: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: "#7A889F",
    lineHeight: 19,
  },

  /* ── Export shortcut ── */
  exportShortcut: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCE4EF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  exportShortcutIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  exportShortcutTitle: {
    fontSize: 14.5,
    fontFamily: "Raleway_600SemiBold",
    color: TEXT_PRIMARY,
  },
  exportShortcutSub: {
    fontSize: 12.5,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    marginTop: 2,
  },

  /* ── Lawyer Finder shortcut ── */
  lawyerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCE4EF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  lawyerCardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  lawyerIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#2E86AB18",
    borderWidth: 1,
    borderColor: "#2E86AB30",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  lawyerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  lawyerCardTitle: {
    fontSize: 15,
    fontFamily: "Raleway_700Bold",
    color: TEXT_PRIMARY,
    letterSpacing: -0.1,
  },
  lawyerNewBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: "#2E86AB18",
    borderWidth: 1,
    borderColor: "#2E86AB35",
  },
  lawyerNewBadgeText: {
    fontSize: 9,
    fontFamily: "DMSans_600SemiBold",
    color: "#2E86AB",
    letterSpacing: 0.6,
  },
  lawyerCardSub: {
    fontSize: 12.5,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    marginTop: 3,
    lineHeight: 18,
  },
});

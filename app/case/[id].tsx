import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
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
import { EvidenceChip } from "@/components/EvidenceChip";
import { RiskMeter } from "@/components/RiskMeter";
import { SectionHeader } from "@/components/SectionHeader";
import { useCases } from "@/context/CaseContext";
import { useColors } from "@/hooks/useColors";

function CompletenessCard({
  evidenceCount,
  timelineCount,
  hasSummary,
  hasRisk,
}: {
  evidenceCount: number;
  timelineCount: number;
  hasSummary: boolean;
  hasRisk: boolean;
}) {
  const colors = useColors();

  const items = [
    { label: "Evidence added", done: evidenceCount > 0, detail: evidenceCount > 0 ? `${evidenceCount} item${evidenceCount !== 1 ? "s" : ""}` : "None yet" },
    { label: "Timeline events", done: timelineCount > 0, detail: timelineCount > 0 ? `${timelineCount} event${timelineCount !== 1 ? "s" : ""}` : "None yet" },
    { label: "AI summary", done: hasSummary, detail: hasSummary ? "Generated" : "Not yet" },
    { label: "Risk analysis", done: hasRisk, detail: hasRisk ? "Completed" : "Not yet" },
  ];

  const completedCount = items.filter(i => i.done).length;
  const pct = Math.round((completedCount / items.length) * 100);

  return (
    <View style={[completenessStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={completenessStyles.header}>
        <View>
          <Text style={[completenessStyles.title, { color: colors.foreground }]}>Case Overview</Text>
          <Text style={[completenessStyles.subtitle, { color: colors.mutedForeground }]}>
            {completedCount} of {items.length} sections complete
          </Text>
        </View>
        <View style={[completenessStyles.pctBadge, { backgroundColor: pct === 100 ? colors.successGreen + "20" : colors.teal + "15" }]}>
          <Text style={[completenessStyles.pctText, { color: pct === 100 ? colors.successGreen : colors.teal }]}>
            {pct}%
          </Text>
        </View>
      </View>

      <View style={[completenessStyles.bar, { backgroundColor: colors.secondary }]}>
        <View
          style={[
            completenessStyles.barFill,
            {
              width: `${pct}%` as any,
              backgroundColor: pct === 100 ? colors.successGreen : colors.teal,
            },
          ]}
        />
      </View>

      <View style={completenessStyles.items}>
        {items.map((item, i) => (
          <View key={i} style={[completenessStyles.itemRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <Feather
              name={item.done ? "check-circle" : "circle"}
              size={15}
              color={item.done ? colors.successGreen : colors.border}
            />
            <Text style={[completenessStyles.itemLabel, { color: item.done ? colors.foreground : colors.mutedForeground }]}>
              {item.label}
            </Text>
            <Text style={[completenessStyles.itemDetail, { color: item.done ? colors.teal : colors.mutedForeground }]}>
              {item.detail}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const completenessStyles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    paddingBottom: 10,
  },
  title: { fontSize: 15, fontFamily: "DMSans_600SemiBold" },
  subtitle: { fontSize: 12, fontFamily: "DMSans_400Regular", marginTop: 2 },
  pctBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pctText: { fontSize: 14, fontFamily: "Raleway_700Bold" },
  bar: {
    height: 4,
    marginHorizontal: 14,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 10,
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  items: {},
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  itemLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
  itemDetail: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
});

export default function CaseDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cases, setActiveCase, deleteCase, getCaseEvidence, getCaseTimeline, activeCase } = useCases();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const caseItem = cases.find(c => c.id === id);

  useEffect(() => {
    if (caseItem) setActiveCase(caseItem);
    return () => { };
  }, [id]);

  if (!caseItem) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFound, { color: colors.mutedForeground }]}>Case not found</Text>
      </View>
    );
  }

  const caseEvidence = getCaseEvidence(id);
  const caseTimeline = getCaseTimeline(id);

  const handleDelete = () => {
    Alert.alert(
      "Delete Case",
      `This will permanently delete "${caseItem.title}" and all its evidence and timeline entries. This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Permanently",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            deleteCase(id);
            router.replace("/(tabs)");
          },
        },
      ]
    );
  };

  const statusColors: Record<string, string> = {
    active: colors.teal,
    archived: colors.mutedForeground,
    exported: colors.successGreen,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.navy }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{caseItem.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[caseItem.status] + "30", borderColor: statusColors[caseItem.status] }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColors[caseItem.status] }]} />
            <Text style={[styles.statusText, { color: statusColors[caseItem.status] }]}>
              {caseItem.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <Pressable onPress={handleDelete} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Feather name="trash-2" size={20} color="rgba(255,100,100,0.85)" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.metaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Type</Text>
              <Text style={[styles.metaValue, { color: colors.teal }]}>{caseItem.disputeType}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Jurisdiction</Text>
              <Text style={[styles.metaValue, { color: colors.foreground }]}>
                {caseItem.country === "CA"
                  ? `${caseItem.province || "Canada"}, Canada`
                  : `${caseItem.state || "United States"}, USA`}
              </Text>
            </View>
          </View>
          {caseItem.description && (
            <Text style={[styles.description, { color: colors.mutedForeground, borderTopColor: colors.border }]}>
              {caseItem.description}
            </Text>
          )}
        </View>

        <CompletenessCard
          evidenceCount={caseEvidence.length}
          timelineCount={caseTimeline.length}
          hasSummary={!!caseItem.aiSummary}
          hasRisk={caseItem.riskScore !== undefined}
        />

        {caseItem.riskScore !== undefined && (
          <View style={[styles.riskCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <RiskMeter score={caseItem.riskScore} />
          </View>
        )}

        <DisclaimerBanner
          jurisdiction={
            caseItem.country === "CA"
              ? `${caseItem.province || "Canada"}, Canada`
              : `${caseItem.state || "United States"}, USA`
          }
        />

        <View style={styles.actionsGrid}>
          {[
            { icon: "folder", label: "Evidence", count: caseEvidence.length, route: "/(tabs)/evidence", color: colors.teal },
            { icon: "clock", label: "Timeline", count: caseTimeline.length, route: "/(tabs)/timeline", color: colors.navy },
            { icon: "cpu", label: "AI Organizer", count: caseItem.aiSummary ? 1 : 0, route: "/(tabs)/ai", color: colors.teal },
            { icon: "search", label: "Gap Analysis", count: caseItem.riskScore !== undefined ? 1 : 0, route: "/(tabs)/risk", color: colors.gold },
          ].map(action => (
            <Pressable
              key={action.label}
              onPress={() => router.push(action.route as any)}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + "15" }]}>
                <Feather name={action.icon as any} size={20} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>{action.label}</Text>
              {action.count > 0 && (
                <View style={[styles.actionCount, { backgroundColor: action.color }]}>
                  <Text style={styles.actionCountText}>{action.count}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {caseEvidence.length > 0 && (
          <>
            <SectionHeader
              title="Recent Evidence"
              actionLabel="View All"
              onAction={() => router.push("/(tabs)/evidence")}
            />
            {caseEvidence.slice(0, 3).map(e => (
              <EvidenceChip key={e.id} evidence={e} compact />
            ))}
          </>
        )}

        {caseTimeline.length > 0 && (
          <>
            <SectionHeader
              title="Recent Timeline"
              actionLabel="View All"
              onAction={() => router.push("/(tabs)/timeline")}
            />
            {caseTimeline.slice(-3).reverse().map(event => (
              <View key={event.id} style={[styles.timelineItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.timelineDate, { color: colors.teal }]}>{event.date}</Text>
                <Text style={[styles.timelineTitle, { color: colors.foreground }]}>{event.title}</Text>
              </View>
            ))}
          </>
        )}

        {caseItem.nextSteps && caseItem.nextSteps.length > 0 && (
          <>
            <SectionHeader title="Next Steps" />
            <View style={[styles.nextStepsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {caseItem.nextSteps.map((step, i) => (
                <View key={i} style={[styles.nextStepRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
                  <View style={[styles.stepBadge, { backgroundColor: colors.navy }]}>
                    <Text style={styles.stepBadgeText}>{i + 1}</Text>
                  </View>
                  <Text style={[styles.nextStepText, { color: colors.foreground }]}>{step}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Pressable
          onPress={() => router.push("/export")}
          style={({ pressed }) => [
            styles.exportBtn,
            { backgroundColor: colors.gold, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="download" size={18} color="#FFFFFF" />
          <Text style={styles.exportBtnText}>Export Case File</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  headerCenter: { flex: 1, gap: 4 },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  statusDot: { width: 5, height: 5, borderRadius: 2.5 },
  statusText: { fontSize: 9, fontFamily: "Raleway_700Bold", letterSpacing: 0.5 },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 14, paddingBottom: 60 },
  metaCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  metaRow: {
    flexDirection: "row",
    padding: 14,
    gap: 20,
  },
  metaItem: { flex: 1, gap: 2 },
  metaLabel: { fontSize: 10, fontFamily: "DMSans_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  metaValue: { fontSize: 14, fontFamily: "DMSans_600SemiBold" },
  description: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    lineHeight: 18,
    padding: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    color: "#6B7A8D",
  },
  riskCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionBtn: {
    width: "47%",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    position: "relative",
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  actionCount: {
    position: "absolute",
    top: 10,
    right: 10,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  actionCountText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "Raleway_700Bold",
  },
  timelineItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
    marginBottom: 4,
  },
  timelineDate: { fontSize: 11, fontFamily: "DMSans_600SemiBold" },
  timelineTitle: { fontSize: 13, fontFamily: "DMSans_500Medium" },
  nextStepsCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  nextStepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    paddingHorizontal: 14,
  },
  stepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  stepBadgeText: { color: "#FFFFFF", fontSize: 10, fontFamily: "Raleway_700Bold" },
  nextStepText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    lineHeight: 19,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  exportBtnText: {
    color: "#FFFFFF",
    fontFamily: "Raleway_600SemiBold",
    fontSize: 16,
  },
  notFound: {
    textAlign: "center",
    marginTop: 100,
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
  },
});

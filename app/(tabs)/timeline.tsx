import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
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
import { generateTimelineFromEvidence } from "@/lib/ai";
import type { TimelineEvent } from "@/lib/storage";

const IMPORTANCE_COLORS: Record<string, string> = {
  low: "#7A8694",
  medium: "#1F6F78",
  high: "#C9A227",
  critical: "#B94141",
};

function TimelineItem({ event, onDelete }: { event: TimelineEvent; onDelete: () => void }) {
  const colors = useColors();
  const { t } = useTranslation();
  const importanceColor = IMPORTANCE_COLORS[event.importance] || colors.mutedForeground;

  const importanceLabel: Record<string, string> = {
    low: t("importanceLow"),
    medium: t("importanceMedium"),
    high: t("importanceHigh"),
    critical: t("importanceCritical"),
  };

  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineLine}>
        <View style={[styles.timelineDot, { backgroundColor: importanceColor, borderColor: colors.card }]} />
        <View style={[styles.timelineConnector, { backgroundColor: colors.border }]} />
      </View>
      <View style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.eventHeader}>
          <Text style={[styles.eventDate, { color: importanceColor }]}>{event.date}</Text>
          {event.isAiGenerated && (
            <View style={[styles.aiBadge, { backgroundColor: colors.tealLight, borderColor: colors.teal }]}>
              <Feather name="cpu" size={10} color={colors.teal} />
              <Text style={[styles.aiBadgeText, { color: colors.teal }]}>{t("aiGenerated")}</Text>
            </View>
          )}
          <View style={[styles.importanceBadge, { backgroundColor: importanceColor + "20" }]}>
            <Text style={[styles.importanceText, { color: importanceColor }]}>
              {importanceLabel[event.importance] ?? event.importance.toUpperCase()}
            </Text>
          </View>
          <Pressable onPress={onDelete} style={styles.deleteBtn} hitSlop={8}>
            <Feather name="trash-2" size={14} color={colors.mutedForeground} />
          </Pressable>
        </View>
        <Text style={[styles.eventTitle, { color: colors.foreground }]}>{event.title}</Text>
        <Text style={[styles.eventDesc, { color: colors.mutedForeground }]}>{event.description}</Text>
      </View>
    </View>
  );
}

export default function TimelineScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { cases, timeline, evidence, activeCase, addTimelineEvent, deleteTimelineEvent, getCaseTimeline, getCaseEvidence } = useCases();
  const { hasAccessTo } = useSubscription();
  const isPremium = hasAccessTo("basic");
  const [isGenerating, setIsGenerating] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const displayTimeline = activeCase
    ? getCaseTimeline(activeCase.id)
    : timeline;

  const handleGenerateAI = async () => {
    if (!activeCase) {
      Alert.alert(t("selectCaseFirst"), t("selectCaseFirstMsg"));
      return;
    }
    setIsGenerating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const caseEvidence = getCaseEvidence(activeCase.id);
      const suggestions = await generateTimelineFromEvidence(caseEvidence, displayTimeline);
      suggestions.forEach(event => addTimelineEvent({ ...event, caseId: activeCase.id }));
      if (suggestions.length > 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          t("timelineUpdated"),
          t("timelineUpdatedMsg")
            .replace("{n}", String(suggestions.length))
            .replace("{s}", suggestions.length !== 1 ? "s" : "")
        );
      } else {
        Alert.alert(t("noSuggestions"), t("noSuggestionsSub"));
      }
    } catch (e) {
      Alert.alert(t("error"), t("errorTimeline"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddManual = () => {
    if (!activeCase) {
      Alert.alert(t("selectCaseFirst"), t("selectCaseFirstMsg"));
      return;
    }
    router.push("/timeline/add");
  };

  const handleDelete = (id: string) => {
    Alert.alert(t("deleteEventTitle"), t("deleteEventMsg"), [
      { text: t("cancel"), style: "cancel" },
      { text: t("delete"), style: "destructive", onPress: () => deleteTimelineEvent(id) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.navy }]}>
        <View>
          <Text style={styles.headerTitle}>{t("timelineTitle")}</Text>
          {activeCase && (
            <Text style={styles.headerSub} numberOfLines={1}>{activeCase.title}</Text>
          )}
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={handleGenerateAI}
            disabled={isGenerating}
            style={[styles.aiBtn, { backgroundColor: colors.teal }]}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather name="cpu" size={16} color="#FFFFFF" />
            )}
            <Text style={styles.aiBtnText}>{isGenerating ? t("generatingTimeline") : t("generateAITimeline")}</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={displayTimeline}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <DisclaimerBanner compact />
            {!activeCase && (
              <View style={[styles.noCaseNotice, { backgroundColor: colors.goldLight, borderColor: colors.gold }]}>
                <Feather name="info" size={14} color={colors.gold} />
                <Text style={[styles.noCaseText, { color: colors.slate }]}>
                  Open a case to see its specific timeline.
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyStateCard
            illustration="timeline"
            eyebrow={t("noTimelineEyebrow")}
            title={t("noTimeline")}
            body={t("noTimelineSub")}
            ctaLabel={t("addEvent")}
            onCta={handleAddManual}
            ctaColor={colors.navy}
          />
        }
        renderItem={({ item }) => (
          <TimelineItem event={item} onDelete={() => handleDelete(item.id)} />
        )}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad + 100 }]}
      />

      <Pressable
        onPress={handleAddManual}
        style={[styles.fab, { backgroundColor: colors.navy, bottom: bottomPad + 90 }]}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </Pressable>

      {!isPremium && (
        <View style={[styles.lockedOverlay, { backgroundColor: colors.background }]}>
          <View style={[styles.lockedCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.lockIconWrap}>
              <Feather name="clock" size={28} color="#C9A227" />
            </View>
            <Text style={[styles.lockedTitle, { color: colors.foreground }]}>Timeline is Premium</Text>
            <Text style={[styles.lockedSub, { color: colors.mutedForeground }]}>
              Track every event in your case with dates, importance levels, and AI-generated timelines.
            </Text>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/paywall");
              }}
              style={({ pressed }) => [styles.lockedBtn, { opacity: pressed ? 0.85 : 1 }]}
            >
              <Feather name="award" size={16} color="#0D1F35" />
              <Text style={styles.lockedBtnText}>Start 7-Day Free Trial</Text>
            </Pressable>
            <Text style={[styles.lockedTrial, { color: colors.mutedForeground }]}>Then $2.99/mo · Cancel anytime</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 8,
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
  headerActions: {
    position: "absolute",
    right: 24,
    bottom: 16,
  },
  aiBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  aiBtnText: {
    color: "#FFFFFF",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
  },
  listHeader: { padding: 16, gap: 10 },
  noCaseNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  noCaseText: {
    fontSize: 13.5,
    fontFamily: "DMSans_400Regular",
    flex: 1,
  },
  listContent: { paddingHorizontal: 16 },
  timelineRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 4,
  },
  timelineLine: {
    alignItems: "center",
    width: 20,
    paddingTop: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    zIndex: 1,
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  eventCard: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 6,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  eventDate: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.3,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  aiBadgeText: {
    fontSize: 9,
    fontFamily: "DMSans_600SemiBold",
  },
  importanceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  importanceText: {
    fontSize: 9,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.5,
  },
  deleteBtn: { marginLeft: "auto", padding: 2 },
  eventTitle: {
    fontSize: 14.5,
    fontFamily: "Raleway_600SemiBold",
    letterSpacing: -0.2,
  },
  eventDesc: {
    fontSize: 13.5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    margin: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    gap: 12,
  },
  emptyTitle: { fontSize: 22, fontFamily: "Raleway_700Bold", letterSpacing: 0.4, lineHeight: 28 },
  emptyText: { fontSize: 14, fontFamily: "DMSans_400Regular", textAlign: "center", lineHeight: 21 },
  emptyBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  emptyBtnText: {
    color: "#FFFFFF",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  lockedCard: {
    width: "100%",
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  lockIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(201,162,39,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(201,162,39,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  lockedTitle: {
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  lockedSub: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 21,
    textAlign: "center",
  },
  lockedBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#C9A227",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  lockedBtnText: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
    color: "#0D1F35",
  },
  lockedTrial: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },
});

import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { EmptyStateCard } from "@/components/EmptyStateCard";
import { EvidenceChip } from "@/components/EvidenceChip";
import { SectionHeader } from "@/components/SectionHeader";
import { useCases } from "@/context/CaseContext";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import type { Evidence } from "@/lib/storage";

const EVIDENCE_TYPES = ["all", "image", "pdf", "note", "email", "receipt", "voice"] as const;

export default function EvidenceScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { cases, evidence, activeCase, deleteEvidence } = useCases();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const displayEvidence = evidence.filter(e => {
    const matchCase = !activeCase || e.caseId === activeCase.id;
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || e.type === filter;
    return matchCase && matchSearch && matchFilter;
  });

  const handleDelete = (e: Evidence) => {
    Alert.alert(t("deleteEvidence"), t("deleteEvidenceMsg").replace("{name}", e.name), [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          deleteEvidence(e.id);
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.navy }]}>
        <Text style={styles.headerTitle}>{t("evidenceTitle")}</Text>
      </View>

      <View style={[styles.search, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder={t("searchEvidence")}
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Feather name="x" size={14} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={displayEvidence}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.filterRow}>
              {EVIDENCE_TYPES.map(type => (
                <Pressable
                  key={type}
                  onPress={() => setFilter(type)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: filter === type ? colors.navy : colors.card,
                      borderColor: filter === type ? colors.navy : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.filterText, { color: filter === type ? "#FFFFFF" : colors.mutedForeground }]}>
                    {t(("filter" + type.charAt(0).toUpperCase() + type.slice(1)) as any)}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={[styles.count, { color: colors.mutedForeground }]}>
              {displayEvidence.length} item{displayEvidence.length !== 1 ? "s" : ""}
            </Text>
            <DisclaimerBanner compact />
          </View>
        }
        ListEmptyComponent={
          <EmptyStateCard
            illustration="evidence"
            eyebrow={t("noEvidenceEyebrow")}
            title={t("noEvidence")}
            body={t("noEvidenceSub")}
            ctaLabel={t("addEvidence")}
            onCta={() => router.push("/evidence/add")}
            ctaColor={colors.teal}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.evidenceItem}>
            <EvidenceChip
              evidence={item}
              onPress={() => router.push({ pathname: "/evidence/[id]", params: { id: item.id } })}
              onDelete={() => handleDelete(item)}
            />
          </View>
        )}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad + 100 }]}
      />

      <Pressable
        onPress={() => router.push("/evidence/add")}
        style={[styles.fab, { backgroundColor: colors.teal, bottom: bottomPad + 90 }]}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </Pressable>
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
  headerTitle: {
    fontSize: 28,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    lineHeight: 34,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
  },
  listHeader: {
    padding: 16,
    gap: 12,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
  count: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  listContent: {},
  evidenceItem: {
    paddingHorizontal: 16,
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
  emptyTitle: {
    fontSize: 17,
    fontFamily: "Raleway_600SemiBold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 21,
  },
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
});

import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
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
import { EvidenceChip } from "@/components/EvidenceChip";
import { useCases } from "@/context/CaseContext";
import { useColors } from "@/hooks/useColors";

export default function EvidenceDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { evidence, deleteEvidence } = useCases();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const item = evidence.find(e => e.id === id);

  if (!item) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.teal }]}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Evidence</Text>
          <View style={{ width: 22 }} />
        </View>
        <Text style={[styles.notFound, { color: colors.mutedForeground }]}>Evidence not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert("Delete Evidence", `Remove "${item.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteEvidence(id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.teal }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{item.name}</Text>
        <Pressable onPress={handleDelete} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Feather name="trash-2" size={20} color="rgba(255,120,120,0.9)" />
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
              <Text style={[styles.metaValue, { color: colors.teal }]}>{item.type.toUpperCase()}</Text>
            </View>
            {item.date && (
              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Date</Text>
                <Text style={[styles.metaValue, { color: colors.foreground }]}>{item.date}</Text>
              </View>
            )}
          </View>
          {item.tags.length > 0 && (
            <View style={[styles.tagsRow, { borderTopColor: colors.border }]}>
              {item.tags.map(tag => (
                <View key={tag} style={[styles.tag, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {item.text && (
          <View style={[styles.contentBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.contentLabel, { color: colors.mutedForeground }]}>Content</Text>
            <Text style={[styles.contentText, { color: colors.foreground }]}>{item.text}</Text>
          </View>
        )}

        {item.aiSuggestion && (
          <View style={[styles.aiBox, { backgroundColor: colors.tealLight, borderColor: colors.teal }]}>
            <View style={styles.aiHeader}>
              <Feather name="cpu" size={14} color={colors.teal} />
              <Text style={[styles.aiLabel, { color: colors.teal }]}>AI Suggestion</Text>
            </View>
            <Text style={[styles.aiText, { color: colors.slate }]}>{item.aiSuggestion}</Text>
          </View>
        )}

        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteBtn,
            { backgroundColor: colors.redLight, borderColor: colors.alertRed, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="trash-2" size={16} color={colors.alertRed} />
          <Text style={[styles.deleteBtnText, { color: colors.alertRed }]}>Remove Evidence</Text>
        </Pressable>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.3,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 12,
  },
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
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    padding: 12,
    borderTopWidth: 1,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
  },
  contentBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  contentLabel: {
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  contentText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 21,
  },
  aiBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  aiLabel: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
  aiText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    lineHeight: 19,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 8,
  },
  deleteBtnText: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
  },
  notFound: {
    textAlign: "center",
    marginTop: 100,
    fontFamily: "DMSans_400Regular",
    fontSize: 16,
  },
});

import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCases } from "@/context/CaseContext";
import { useColors } from "@/hooks/useColors";
import type { Evidence } from "@/lib/storage";

const EVIDENCE_TYPES: { type: Evidence["type"]; icon: string; label: string }[] = [
  { type: "note", icon: "edit-3", label: "Note" },
  { type: "email", icon: "mail", label: "Email" },
  { type: "image", icon: "image", label: "Photo" },
  { type: "receipt", icon: "file-text", label: "Receipt" },
  { type: "pdf", icon: "file", label: "Document" },
  { type: "voice", icon: "mic", label: "Voice Note" },
];

export default function AddEvidenceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { cases, activeCase, addEvidence } = useCases();

  const [type, setType] = useState<Evidence["type"]>("note");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState("");
  const [caseId, setCaseId] = useState(activeCase?.id || cases[0]?.id || "");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert("Name Required", "Give this evidence a name.");
      return;
    }
    if (!caseId) {
      Alert.alert("Case Required", "Please create a case first.");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addEvidence({
      caseId,
      type,
      name: name.trim(),
      text: text.trim() || undefined,
      date: date.trim() || undefined,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    });
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.teal }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Feather name="x" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Add Evidence</Text>
        <Pressable onPress={handleAdd} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Text style={styles.saveText}>Add</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {cases.length > 1 && (
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Case</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.caseRow}>
                {cases.filter(c => c.status === "active").map(c => (
                  <Pressable
                    key={c.id}
                    onPress={() => setCaseId(c.id)}
                    style={[
                      styles.caseChip,
                      {
                        backgroundColor: caseId === c.id ? colors.navy : colors.card,
                        borderColor: caseId === c.id ? colors.navy : colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.caseChipText, { color: caseId === c.id ? "#FFFFFF" : colors.mutedForeground }]}>
                      {c.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Evidence Type</Text>
          <View style={styles.typeGrid}>
            {EVIDENCE_TYPES.map(et => (
              <Pressable
                key={et.type}
                onPress={() => setType(et.type)}
                style={[
                  styles.typeBtn,
                  {
                    backgroundColor: type === et.type ? colors.teal : colors.card,
                    borderColor: type === et.type ? colors.teal : colors.border,
                  },
                ]}
              >
                <Feather name={et.icon as any} size={20} color={type === et.type ? "#FFFFFF" : colors.mutedForeground} />
                <Text style={[styles.typeLabel, { color: type === et.type ? "#FFFFFF" : colors.mutedForeground }]}>
                  {et.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Name / Title *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="e.g. Email from manager, June 5"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Date (optional)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.mutedForeground}
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Content / Notes (optional)</Text>
          <TextInput
            style={[styles.textarea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="Paste text content, describe what this item shows, or add key notes..."
            placeholderTextColor={colors.mutedForeground}
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Tags (optional)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="e.g. email, refund, date, amount"
            placeholderTextColor={colors.mutedForeground}
            value={tags}
            onChangeText={setTags}
          />
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>Separate tags with commas</Text>
        </View>

        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => [
            styles.addBtn,
            { backgroundColor: colors.teal, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add to Evidence Vault</Text>
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
  },
  saveText: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
    color: "#C9A227",
  },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 18, paddingBottom: 60 },
  field: { gap: 8 },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
  },
  textarea: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    minHeight: 110,
  },
  hint: { fontSize: 11, fontFamily: "DMSans_400Regular" },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeBtn: {
    width: "30%",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    gap: 6,
  },
  typeLabel: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
  },
  caseRow: { flexDirection: "row", gap: 8 },
  caseChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  caseChipText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontFamily: "Raleway_600SemiBold",
    fontSize: 16,
  },
});

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

const IMPORTANCE_LEVELS = ["low", "medium", "high", "critical"] as const;
const IMPORTANCE_COLORS: Record<string, string> = {
  low: "#7A8694",
  medium: "#1F6F78",
  high: "#C9A227",
  critical: "#B94141",
};

export default function AddTimelineEventScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { activeCase, cases, addTimelineEvent } = useCases();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [importance, setImportance] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [caseId, setCaseId] = useState(activeCase?.id || cases[0]?.id || "");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert("Title Required", "Give this event a title.");
      return;
    }
    if (!date.trim()) {
      Alert.alert("Date Required", "Enter a date for this event.");
      return;
    }
    if (!caseId) {
      Alert.alert("Case Required", "Please create a case first.");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addTimelineEvent({
      caseId,
      title: title.trim(),
      description: description.trim(),
      date,
      importance,
      evidenceIds: [],
    });
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.navy }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Feather name="x" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Add Timeline Event</Text>
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
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Date *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.mutedForeground}
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Event Title *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="e.g. Sent complaint email to company"
            placeholderTextColor={colors.mutedForeground}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Description (optional)</Text>
          <TextInput
            style={[styles.textarea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="What happened on this date? Be specific."
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Importance</Text>
          <View style={styles.importanceRow}>
            {IMPORTANCE_LEVELS.map(level => (
              <Pressable
                key={level}
                onPress={() => setImportance(level)}
                style={[
                  styles.importanceBtn,
                  {
                    backgroundColor: importance === level ? IMPORTANCE_COLORS[level] : colors.card,
                    borderColor: importance === level ? IMPORTANCE_COLORS[level] : colors.border,
                  },
                ]}
              >
                <Text style={[
                  styles.importanceText,
                  { color: importance === level ? "#FFFFFF" : colors.mutedForeground },
                ]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => [
            styles.addBtn,
            { backgroundColor: colors.navy, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="clock" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add to Timeline</Text>
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
    minHeight: 100,
  },
  importanceRow: {
    flexDirection: "row",
    gap: 8,
  },
  importanceBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
  },
  importanceText: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
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

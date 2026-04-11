import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Evidence } from "@/lib/storage";

interface EvidenceChipProps {
  evidence: Evidence;
  onPress?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

const evidenceIcons: Record<string, { icon: string; lib: "feather" | "mci" }> = {
  image: { icon: "image", lib: "feather" },
  pdf: { icon: "file-pdf-box", lib: "mci" },
  note: { icon: "edit-3", lib: "feather" },
  email: { icon: "mail", lib: "feather" },
  receipt: { icon: "file-text", lib: "feather" },
  voice: { icon: "mic", lib: "feather" },
};

export function EvidenceChip({ evidence, onPress, onDelete, compact = false }: EvidenceChipProps) {
  const colors = useColors();
  const iconInfo = evidenceIcons[evidence.type] || { icon: "paperclip", lib: "feather" };

  const icon =
    iconInfo.lib === "mci" ? (
      <MaterialCommunityIcons name={iconInfo.icon as any} size={compact ? 12 : 16} color={colors.teal} />
    ) : (
      <Feather name={iconInfo.icon as any} size={compact ? 12 : 16} color={colors.teal} />
    );

  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.chip, { backgroundColor: colors.tealLight, borderColor: colors.teal }]}
      >
        {icon}
        <Text style={[styles.chipText, { color: colors.teal }]} numberOfLines={1}>
          {evidence.name}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: colors.tealLight }]}>
        {icon}
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {evidence.name}
        </Text>
        <Text style={[styles.meta, { color: colors.mutedForeground }]}>
          {evidence.type} {evidence.date ? `· ${evidence.date}` : ""}
        </Text>
        {evidence.tags.length > 0 && (
          <View style={styles.tags}>
            {evidence.tags.slice(0, 3).map(tag => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      {onDelete && (
        <Pressable onPress={onDelete} style={styles.deleteBtn} hitSlop={8}>
          <Feather name="x" size={14} color={colors.mutedForeground} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    maxWidth: 100,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  meta: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  tags: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
    marginTop: 2,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontFamily: "DMSans_500Medium",
  },
  deleteBtn: {
    padding: 4,
  },
});

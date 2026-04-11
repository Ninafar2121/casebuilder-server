import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: string;
}

export function SectionHeader({ title, subtitle, actionLabel, onAction, actionIcon }: SectionHeaderProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
        )}
      </View>
      {(actionLabel || actionIcon) && onAction && (
        <Pressable onPress={onAction} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <View style={[styles.action, { borderColor: colors.border, backgroundColor: colors.secondary }]}>
            {actionIcon && <Feather name={actionIcon as any} size={13} color={colors.teal} />}
            {actionLabel && <Text style={[styles.actionText, { color: colors.teal }]}>{actionLabel}</Text>}
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13.5,
    fontFamily: "DMSans_400Regular",
    marginTop: 4,
    lineHeight: 19,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
  },
});

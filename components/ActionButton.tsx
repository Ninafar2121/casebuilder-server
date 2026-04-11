import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  icon?: string;
  variant?: "primary" | "secondary" | "teal" | "gold" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function ActionButton({
  label,
  onPress,
  icon,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
}: ActionButtonProps) {
  const colors = useColors();

  const variants = {
    primary: { bg: colors.primary, text: "#FFFFFF", border: colors.primary },
    secondary: { bg: colors.secondary, text: colors.foreground, border: colors.border },
    teal: { bg: colors.teal, text: "#FFFFFF", border: colors.teal },
    gold: { bg: colors.gold, text: "#FFFFFF", border: colors.gold },
    ghost: { bg: "transparent", text: colors.primary, border: "transparent" },
    danger: { bg: colors.alertRed, text: "#FFFFFF", border: colors.alertRed },
  };

  const sizes = {
    sm: { paddingV: 9, paddingH: 16, fontSize: 13, iconSize: 14, gap: 5 },
    md: { paddingV: 13, paddingH: 22, fontSize: 15, iconSize: 17, gap: 7 },
    lg: { paddingV: 17, paddingH: 30, fontSize: 17, iconSize: 20, gap: 9 },
  };

  const v = variants[variant];
  const s = sizes[size];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          paddingVertical: s.paddingV,
          paddingHorizontal: s.paddingH,
          opacity: pressed ? 0.82 : disabled ? 0.45 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          alignSelf: fullWidth ? "stretch" : "auto",
        },
      ]}
    >
      <View style={[styles.inner, { gap: s.gap }]}>
        {loading ? (
          <ActivityIndicator size="small" color={v.text} />
        ) : icon ? (
          <Feather name={icon as any} size={s.iconSize} color={v.text} />
        ) : null}
        <Text style={[styles.label, { color: v.text, fontSize: s.fontSize }]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: -0.1,
  },
});

import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface PremiumCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: "default" | "teal" | "gold" | "navy" | "red" | "green";
  loading?: boolean;
  disabled?: boolean;
  badge?: string;
  rightIcon?: string;
}

export function PremiumCard({
  title,
  subtitle,
  children,
  onPress,
  variant = "default",
  loading = false,
  disabled = false,
  badge,
  rightIcon,
}: PremiumCardProps) {
  const colors = useColors();

  const variantStyles = {
    default: { bg: colors.card, border: colors.border, titleColor: colors.foreground },
    teal: { bg: colors.tealLight, border: colors.teal + "60", titleColor: colors.teal },
    gold: { bg: colors.goldLight, border: colors.gold + "60", titleColor: colors.gold },
    navy: { bg: colors.primary, border: colors.primary, titleColor: "#FFFFFF" },
    red: { bg: colors.redLight, border: colors.alertRed + "60", titleColor: colors.alertRed },
    green: { bg: colors.greenLight, border: colors.successGreen + "60", titleColor: colors.successGreen },
  };

  const v = variantStyles[variant];

  const content = (
    <View style={[
      styles.card,
      {
        backgroundColor: v.bg,
        borderColor: v.border,
        shadowColor: colors.shadowColor,
      },
    ]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: v.titleColor }]}>{title}</Text>
          {badge && (
            <View style={[styles.badge, { backgroundColor: v.border }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        {loading ? (
          <ActivityIndicator size="small" color={v.titleColor} />
        ) : rightIcon ? (
          <Feather name={rightIcon as any} size={18} color={v.titleColor} />
        ) : null}
      </View>
      {subtitle && (
        <Text style={[styles.subtitle, { color: variant === "navy" ? "rgba(255,255,255,0.72)" : colors.mutedForeground }]}>
          {subtitle}
        </Text>
      )}
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => ({
          opacity: pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        })}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: "Raleway_600SemiBold",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13.5,
    marginTop: 5,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontFamily: "DMSans_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

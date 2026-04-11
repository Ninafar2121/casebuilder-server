import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";

interface DisclaimerBannerProps {
  compact?: boolean;
  jurisdiction?: string;
  showSetJurisdiction?: boolean;
}

export function DisclaimerBanner({ compact = false, jurisdiction, showSetJurisdiction = false }: DisclaimerBannerProps) {
  const colors = useColors();
  const { t } = useTranslation();

  if (compact) {
    return (
      <View style={[styles.compact, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Feather name="info" size={12} color={colors.mutedForeground} />
        <Text style={[styles.compactText, { color: colors.mutedForeground }]}>
          {t("notLegalAdvice")}
        </Text>
      </View>
    );
  }

  if (jurisdiction) {
    return (
      <View style={[styles.container, { backgroundColor: colors.tealLight, borderColor: colors.teal }]}>
        <Feather name="map-pin" size={15} color={colors.teal} style={styles.icon} />
        <View style={styles.textBlock}>
          <Text style={[styles.jurisdictionLabel, { color: colors.teal }]}>
            {t("aiAnalysisBasedOn")} {jurisdiction}
          </Text>
          <Text style={[styles.text, { color: colors.slate }]}>
            {t("aiDisclaimer")}
          </Text>
          <Text style={[styles.subtext, { color: colors.slate }]}>
            {t("aiDisclaimerSub")}
          </Text>
        </View>
      </View>
    );
  }

  if (showSetJurisdiction) {
    return (
      <View style={[styles.warningContainer, { backgroundColor: colors.goldLight, borderColor: colors.gold }]}>
        <Feather name="alert-circle" size={16} color={colors.gold} style={styles.icon} />
        <View style={styles.textBlock}>
          <Text style={[styles.warningTitle, { color: colors.slate }]}>{t("jurisdictionWarningTitle")}</Text>
          <Text style={[styles.text, { color: colors.slate }]}>
            {t("jurisdictionWarningMsg")}
          </Text>
          <Pressable
            onPress={() => router.push("/jurisdiction")}
            style={({ pressed }) => [styles.setJurisdictionBtn, { backgroundColor: colors.gold, opacity: pressed ? 0.85 : 1 }]}
          >
            <Feather name="map-pin" size={12} color="#FFFFFF" />
            <Text style={styles.setJurisdictionText}>{t("setJurisdiction")}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.tealLight, borderColor: colors.teal }]}>
      <Feather name="shield" size={16} color={colors.teal} style={styles.icon} />
      <View style={styles.textBlock}>
        <Text style={[styles.text, { color: colors.slate }]}>
          {t("aiDisclaimer")}
        </Text>
        <Text style={[styles.subtext, { color: colors.slate }]}>
          {t("notLegalAdvice")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  icon: {
    marginTop: 1,
  },
  textBlock: {
    flex: 1,
    gap: 6,
  },
  jurisdictionLabel: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.1,
  },
  warningTitle: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    lineHeight: 17,
  },
  subtext: {
    flex: 1,
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    lineHeight: 16,
    opacity: 0.8,
  },
  setJurisdictionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  setJurisdictionText: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
  },
  compact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  compactText: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
  },
});

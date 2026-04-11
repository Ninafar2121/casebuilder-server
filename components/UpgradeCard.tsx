import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { useSubscription } from "@/lib/revenuecat";

export function UpgradeCard() {
  const { isSubscribed } = useSubscription();
  const { t } = useTranslation();

  if (isSubscribed) return null;

  const highlights = [
    { icon: "cpu", label: t("upgradeFeature1") },
    { icon: "search", label: t("upgradeFeature2") },
    { icon: "message-square", label: t("upgradeFeature3") },
    { icon: "file-text", label: t("upgradeFeature4") },
  ];

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push("/paywall");
      }}
      style={({ pressed }) => [{ opacity: pressed ? 0.94 : 1 }]}
    >
      <LinearGradient
        colors={["#113460", "#143B6D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View style={styles.eyebrowRow}>
            <View style={styles.crownWrap}>
              <Feather name="award" size={14} color="#D4AF37" />
            </View>
            <Text style={styles.eyebrow}>{t("upgradeEyebrow")}</Text>
          </View>
          <View style={styles.trialBadge}>
            <Text style={styles.trialText}>{t("upgradeTrial")}</Text>
          </View>
        </View>

        <Text style={styles.headline}>{t("upgradeHeadline")}</Text>
        <Text style={styles.sub}>{t("upgradeSub")}</Text>

        <View style={styles.featureList}>
          {highlights.map(h => (
            <View key={h.label} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Feather name={h.icon as any} size={13} color="#D4AF37" />
              </View>
              <Text style={styles.featureText}>{h.label}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/paywall");
          }}
          style={({ pressed }) => [styles.ctaBtn, { opacity: pressed ? 0.9 : 1 }]}
        >
          <Text style={styles.ctaBtnText}>{t("upgradeCTA")}</Text>
          <Feather name="arrow-right" size={15} color="#143B6D" />
        </Pressable>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 24,
    paddingHorizontal: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.18)",
    shadowColor: "#102E57",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 38,
    elevation: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  crownWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "rgba(212,175,55,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    color: "#D4AF37",
    letterSpacing: 1.2,
  },
  trialBadge: {
    backgroundColor: "rgba(212,175,55,0.14)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.32)",
  },
  trialText: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: "#DDBB55",
  },
  headline: {
    fontSize: 30,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.3,
    lineHeight: 36,
  },
  sub: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255,255,255,0.80)",
    lineHeight: 22,
    marginTop: -4,
  },
  featureList: { gap: 9 },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(212,175,55,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255,255,255,0.85)",
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#D4AF37",
    borderRadius: 18,
    height: 54,
    marginTop: 4,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 8,
  },
  ctaBtnText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    color: "#143B6D",
    letterSpacing: 0.2,
  },
});

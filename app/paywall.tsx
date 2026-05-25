import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import Purchases from "react-native-purchases";
import { useSubscription } from "@/lib/revenuecat";

const ALL_FEATURES = [
  { icon: "map-pin", text: "AI analysis tailored to your province or state" },
  { icon: "cpu", text: "AI case summary based on your jurisdiction's laws" },
  { icon: "search", text: "Detect documentation gaps & risks automatically" },
  { icon: "message-square", text: "AI Chat assistant for legal questions" },
  { icon: "file-text", text: "Export a professional case PDF" },
  { icon: "folder", text: "Unlimited evidence vault" },
  { icon: "clock", text: "AI-generated case timeline" },
  { icon: "globe", text: "English & French (EN/FR)" },
];

export default function PaywallScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { basicPackage, purchase, isPurchasing, restore, isRestoring, activeTier } = useSubscription();

  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handlePurchase = async () => {
    let pkg = basicPackage;
    if (!pkg) {
      try {
        const offerings = await Purchases.getOfferings();
        const available = offerings.current?.availablePackages ?? [];
        pkg = available.find((p) => p.identifier === "$rc_monthly") ?? available[0] ?? null;
      } catch (err: any) {
        Alert.alert("Connection Error", err?.message ?? "Could not load plans. Please check your connection and try again.");
        return;
      }
    }
    if (!pkg) {
      Alert.alert("Not Ready", "Plans are still loading. Please wait a moment and try again.");
      return;
    }
    try {
      await purchase(pkg);
      setPurchaseSuccess(true);
    } catch (e: any) {
      if (!e?.userCancelled) {
        setPurchaseError(e?.message ?? "Purchase failed. Please try again.");
      }
    }
  };

  const handleRestore = async () => {
    try {
      await restore();
    } catch {
      setPurchaseError("Could not restore purchases. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Feather name="x" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={[styles.heroBadge, { backgroundColor: colors.teal + "18", borderColor: colors.teal + "40" }]}>
            <Feather name="shield" size={12} color={colors.teal} />
            <Text style={[styles.heroBadgeText, { color: colors.teal }]}>CaseBuilder AI</Text>
          </View>

          <Text style={[styles.heroHeadline, { color: colors.navy }]}>
            Everything you need{"\n"}to fight your case
          </Text>

          <Text style={[styles.heroSubtext, { color: colors.mutedForeground }]}>
            AI-powered case analysis tailored to your Canadian province or U.S. state — try free for 7 days, then $2.99/month.
          </Text>

          <View style={styles.featureList}>
            {ALL_FEATURES.map((f) => (
              <View key={f.text} style={styles.featureItem}>
                <View style={[styles.featureIconWrap, { backgroundColor: colors.teal + "15" }]}>
                  <Feather name={f.icon as any} size={15} color={colors.teal} />
                </View>
                <Text style={[styles.featureItemText, { color: colors.foreground }]}>{f.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.teal, shadowColor: colors.teal }]}>
          <View style={[styles.planBadge, { backgroundColor: colors.teal }]}>
            <Text style={styles.planBadgeText}>All Features Included</Text>
          </View>

          <View style={styles.planHeader}>
            <Text style={[styles.planName, { color: colors.foreground }]}>CaseBuilder AI</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: colors.teal }]}>$2.99</Text>
              <Text style={[styles.period, { color: colors.mutedForeground }]}>/month</Text>
            </View>
            <Text style={[styles.billingNote, { color: colors.mutedForeground }]}>
              7-day free trial · Auto-renews monthly · Cancel anytime in App Store settings
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.subscribeBtn, { opacity: pressed || isPurchasing ? 0.85 : 1 }]}
            onPress={handlePurchase}
            disabled={isPurchasing || activeTier !== "free"}
          >
            <LinearGradient
              colors={["#2A8A98", "#1E3A5F"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.subscribeBtnInner}
            >
              {isPurchasing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : activeTier !== "free" ? (
                <Text style={styles.subscribeBtnText}>Active Plan</Text>
              ) : (
                <Text style={styles.subscribeBtnText}>
                  Start Free Trial — {basicPackage?.product.priceString ?? "$2.99"}/mo after
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [styles.restoreBtn, { opacity: pressed || isRestoring ? 0.6 : 1 }]}
          onPress={handleRestore}
          disabled={isRestoring}
        >
          {isRestoring ? (
            <ActivityIndicator color={colors.teal} size="small" />
          ) : (
            <Text style={[styles.restoreText, { color: colors.mutedForeground }]}>Restore Purchases</Text>
          )}
        </Pressable>

        <Text style={[styles.legalNote, { color: colors.mutedForeground }]}>
          Results are based on jurisdiction-specific laws and are for informational purposes only. Not legal advice. Not a law firm.
        </Text>

        <Text style={[styles.legalNote, { color: colors.mutedForeground }]}>
          Subscriptions auto-renew monthly. Cancel anytime in App Store settings. Billed through Apple.
        </Text>

        <View style={[styles.securityRow, { borderColor: colors.border }]}>
          <Feather name="shield" size={14} color={colors.successGreen} />
          <Text style={[styles.securityText, { color: colors.mutedForeground }]}>
            Secured by Apple · Data encrypted on device
          </Text>
        </View>

        <View style={styles.legalLinks}>
          <Pressable onPress={() => Linking.openURL("https://casebuilder-server.onrender.com/privacy")}>
            <Text style={[styles.legalLink, { color: colors.teal }]}>Privacy Policy</Text>
          </Pressable>
          <Text style={[styles.legalLinkSep, { color: colors.mutedForeground }]}>·</Text>
          <Pressable onPress={() => Linking.openURL("https://casebuilder-server.onrender.com/terms")}>
            <Text style={[styles.legalLink, { color: colors.teal }]}>Terms of Use (EULA)</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Purchase Success Modal */}
      <Modal transparent animationType="fade" visible={purchaseSuccess} onRequestClose={() => { setPurchaseSuccess(false); router.back(); }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={[styles.successIcon, { backgroundColor: colors.teal + "20" }]}>
              <Feather name="check-circle" size={32} color={colors.teal} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>You're all set!</Text>
            <Text style={[styles.modalBody, { color: colors.mutedForeground }]}>
              Your subscription is active. All features are now unlocked.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.modalConfirm, { backgroundColor: colors.teal, opacity: pressed ? 0.8 : 1 }]}
              onPress={() => { setPurchaseSuccess(false); router.back(); }}
            >
              <Text style={styles.modalConfirmText}>Get Started</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Purchase Error Modal */}
      <Modal transparent animationType="fade" visible={!!purchaseError} onRequestClose={() => setPurchaseError(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Something went wrong</Text>
            <Text style={[styles.modalBody, { color: colors.mutedForeground }]}>{purchaseError}</Text>
            <Pressable
              style={({ pressed }) => [styles.modalConfirm, { backgroundColor: colors.teal, opacity: pressed ? 0.8 : 1 }]}
              onPress={() => setPurchaseError(null)}
            >
              <Text style={styles.modalConfirmText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { paddingHorizontal: 20, paddingBottom: 8, alignItems: "flex-end" },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center", justifyContent: "center",
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16, paddingTop: 4 },
  promoBanner: {
    flexDirection: "row", alignItems: "center", gap: 8,
    padding: 12, borderRadius: 12, borderWidth: 1,
  },
  promoBannerText: { fontSize: 13, fontFamily: "DMSans_600SemiBold", flex: 1 },
  hero: { gap: 16, paddingBottom: 4 },
  heroBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1,
  },
  heroBadgeText: { fontSize: 11, fontFamily: "DMSans_600SemiBold", letterSpacing: 0.3 },
  heroHeadline: { fontSize: 32, fontFamily: "Raleway_700Bold", letterSpacing: -0.8, lineHeight: 40 },
  heroSubtext: { fontSize: 15, fontFamily: "DMSans_400Regular", lineHeight: 22 },
  featureList: { gap: 10 },
  featureItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  featureIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  featureItemText: { fontSize: 14, fontFamily: "DMSans_500Medium", flex: 1 },
  planCard: {
    borderRadius: 20, padding: 20, gap: 14,
    borderWidth: 2, position: "relative", overflow: "hidden",
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 4,
  },
  planBadge: {
    position: "absolute", top: 16, right: 16,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  planBadgeText: { color: "#FFFFFF", fontSize: 11, fontFamily: "DMSans_600SemiBold", letterSpacing: 0.3 },
  planHeader: { gap: 4, paddingRight: 120 },
  planName: { fontSize: 20, fontFamily: "Raleway_700Bold", letterSpacing: -0.4 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  price: { fontSize: 40, fontFamily: "Raleway_700Bold", letterSpacing: -1 },
  period: { fontSize: 15, fontFamily: "DMSans_400Regular" },
  billingNote: { fontSize: 11, fontFamily: "DMSans_400Regular", lineHeight: 16, marginTop: 2 },
  subscribeBtn: { borderRadius: 16, overflow: "hidden" },
  subscribeBtnInner: {
    paddingVertical: 18, alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 8,
  },
  subscribeBtnText: { color: "#FFFFFF", fontFamily: "Raleway_700Bold", fontSize: 17, letterSpacing: -0.2 },
  promoLink: {
    flexDirection: "row", alignItems: "center", gap: 6,
    justifyContent: "center", paddingVertical: 4,
  },
  promoLinkText: { fontSize: 14, fontFamily: "DMSans_500Medium" },
  restoreBtn: { alignItems: "center", paddingVertical: 8 },
  restoreText: { fontSize: 13, fontFamily: "DMSans_400Regular" },
  legalNote: { fontSize: 11, fontFamily: "DMSans_400Regular", textAlign: "center", lineHeight: 17 },
  securityRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingTop: 8, borderTopWidth: 1,
  },
  securityText: { fontSize: 12, fontFamily: "DMSans_400Regular" },
  legalLinks: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingTop: 4, paddingBottom: 8,
  },
  legalLink: { fontSize: 12, fontFamily: "DMSans_500Medium" },
  legalLinkSep: { fontSize: 12 },
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center", justifyContent: "center", padding: 24,
  },
  modalCard: {
    width: "100%", borderRadius: 20, padding: 24, gap: 14, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 24, elevation: 8,
  },
  promoIconWrap: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  promoSuccessBox: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, width: "100%" },
  promoSuccessText: { fontSize: 14, fontFamily: "DMSans_600SemiBold", flex: 1 },
  promoErrorText: { fontSize: 12, color: "#EF4444", fontFamily: "DMSans_400Regular", alignSelf: "flex-start" },
  codeInput: {
    width: "100%", borderWidth: 1.5, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 16, fontFamily: "DMSans_600SemiBold",
    letterSpacing: 2, textAlign: "center",
  },
  successIcon: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  modalTitle: { fontSize: 20, fontFamily: "Raleway_700Bold", textAlign: "center" },
  modalBody: { fontSize: 15, fontFamily: "DMSans_400Regular", textAlign: "center", lineHeight: 22 },
  modalActions: { flexDirection: "row", gap: 12, width: "100%" },
  modalCancel: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    alignItems: "center", borderWidth: 1,
  },
  modalCancelText: { fontSize: 15, fontFamily: "DMSans_600SemiBold" },
  modalConfirm: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  modalConfirmText: { color: "#FFFFFF", fontSize: 15, fontFamily: "DMSans_600SemiBold" },
});

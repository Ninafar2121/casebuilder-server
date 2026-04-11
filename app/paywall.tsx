import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { useSubscription, PACKAGE_BASIC, PACKAGE_PLUS, PACKAGE_PRO, AppTier } from "@/lib/revenuecat";
import type { PurchasesPackage } from "react-native-purchases";

const HERO_FEATURES = [
  { icon: "map-pin", text: "AI analysis tailored to your province or state" },
  { icon: "cpu", text: "AI case summary based on your jurisdiction's laws" },
  { icon: "search", text: "Detect documentation gaps & risks automatically" },
  { icon: "message-square", text: "Jurisdiction-specific questions for legal consultations" },
  { icon: "file-text", text: "Export a clean professional case file (PDF)" },
];

const PLAN_META: Record<string, {
  color: string;
  badge?: string;
  features: string[];
  tier: AppTier;
}> = {
  [PACKAGE_BASIC]: {
    tier: "basic",
    color: "#1F6F78",
    features: [
      "Up to 5 active cases",
      "Evidence vault (100 items)",
      "AI case summary",
      "Timeline builder",
      "Basic export",
      "English & French (EN/FR)",
    ],
  },
  [PACKAGE_PLUS]: {
    tier: "plus",
    color: "#C9A227",
    badge: "Most Popular",
    features: [
      "Unlimited cases",
      "Evidence vault (1,000 items)",
      "AI summary + gap analysis",
      "AI timeline generation",
      "PDF export package",
      "Jurisdiction guidance",
      "AI Chat assistant",
    ],
  },
  [PACKAGE_PRO]: {
    tier: "pro",
    color: "#16324F",
    badge: "Best Value",
    features: [
      "Everything in Plus",
      "Unlimited evidence storage",
      "Professional case packages",
      "Priority AI processing",
      "Accessibility read-aloud",
      "Unlimited exports",
      "Priority support",
    ],
  },
};

function PlanName(identifier: string) {
  if (identifier === PACKAGE_BASIC) return "Basic";
  if (identifier === PACKAGE_PLUS) return "Plus";
  if (identifier === PACKAGE_PRO) return "Pro";
  return identifier;
}

export default function PaywallScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { basicPackage, plusPackage, proPackage, purchase, isPurchasing, restore, isRestoring, activeTier } = useSubscription();

  const [pendingPackage, setPendingPackage] = useState<PurchasesPackage | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const orderedPackages = [basicPackage, plusPackage, proPackage].filter(Boolean) as PurchasesPackage[];

  const confirmPurchase = async () => {
    if (!pendingPackage) return;
    const pkg = pendingPackage;
    setPendingPackage(null);
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

  const handleContactUs = () => {
    Linking.openURL("mailto:support@casebuilder.ai?subject=CaseBuilder%20AI%20Enterprise%20Inquiry");
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
            <Text style={[styles.heroBadgeText, { color: colors.teal }]}>CaseBuilder AI Premium</Text>
          </View>

          <Text style={[styles.heroHeadline, { color: colors.navy }]}>
            AI case analysis{"\n"}tailored to your{"\n"}province or state
          </Text>

          <Text style={[styles.heroSubtext, { color: colors.mutedForeground }]}>
            Built to analyze cases using the legal framework of your selected Canadian province or U.S. state.
          </Text>

          <View style={[styles.painBox, { backgroundColor: colors.goldLight, borderColor: colors.gold + "60" }]}>
            <Feather name="alert-circle" size={14} color={colors.gold} />
            <Text style={[styles.painText, { color: colors.slate }]}>
              Most people miss key details that can weaken their case. CaseBuilder AI organizes yours — jurisdiction by jurisdiction.
            </Text>
          </View>

          <View style={styles.featureList}>
            {HERO_FEATURES.map((f) => (
              <View key={f.text} style={styles.featureItem}>
                <View style={[styles.featureIconWrap, { backgroundColor: colors.teal + "15" }]}>
                  <Feather name={f.icon as any} size={15} color={colors.teal} />
                </View>
                <Text style={[styles.featureItemText, { color: colors.foreground }]}>{f.text}</Text>
              </View>
            ))}
          </View>

          {plusPackage && (
            <Pressable
              onPress={() => setPendingPackage(plusPackage)}
              disabled={isPurchasing}
              style={({ pressed }) => [styles.heroCTAWrap, { opacity: pressed ? 0.9 : 1 }]}
            >
              <LinearGradient
                colors={["#2A8A98", "#1E3A5F"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.heroCTA}
              >
                {isPurchasing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.heroCTAText}>
                      Get Plus — {plusPackage.product.priceString}/mo
                    </Text>
                    <Feather name="arrow-right" size={18} color="#FFFFFF" />
                  </>
                )}
              </LinearGradient>
            </Pressable>
          )}

          <Text style={[styles.trustLine, { color: colors.mutedForeground }]}>
            Unlock premium features · Cancel anytime in App Store settings
          </Text>
        </View>

        <View style={styles.sectionDivider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>Choose your plan</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {orderedPackages.length === 0 ? (
          <View style={[styles.loadingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ActivityIndicator color={colors.teal} />
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading plans…</Text>
          </View>
        ) : (
          orderedPackages.map((pkg) => {
            const meta = PLAN_META[pkg.identifier];
            if (!meta) return null;
            const isActive = activeTier === meta.tier;
            const isPopular = pkg.identifier === PACKAGE_PLUS;

            return (
              <View
                key={pkg.identifier}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isPopular ? meta.color : colors.border,
                    borderWidth: isPopular ? 2 : 1,
                  },
                ]}
              >
                {meta.badge && (
                  <View style={[styles.badge, { backgroundColor: meta.color }]}>
                    <Text style={styles.badgeText}>{meta.badge}</Text>
                  </View>
                )}
                {isActive && (
                  <View style={[styles.activeBadge, { backgroundColor: colors.teal }]}>
                    <Text style={styles.badgeText}>Current Plan</Text>
                  </View>
                )}

                <View style={styles.planHeader}>
                  <Text style={[styles.planName, { color: colors.foreground }]}>{PlanName(pkg.identifier)}</Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.price, { color: meta.color }]}>{pkg.product.priceString}</Text>
                    <Text style={[styles.period, { color: colors.mutedForeground }]}>/mo</Text>
                  </View>
                </View>

                <View style={[styles.featureDivider, { backgroundColor: colors.border }]} />

                {meta.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Feather name="check" size={14} color={meta.color} />
                    <Text style={[styles.featureText, { color: colors.foreground }]}>{f}</Text>
                  </View>
                ))}

                <Pressable
                  style={({ pressed }) => [
                    styles.planBtn,
                    {
                      backgroundColor: isActive ? colors.border : meta.color,
                      opacity: pressed || isPurchasing ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => !isActive && setPendingPackage(pkg)}
                  disabled={isActive || isPurchasing}
                >
                  <Text style={[styles.planBtnText, { color: isActive ? colors.mutedForeground : "#FFFFFF" }]}>
                    {isActive ? "Active Plan" : `Subscribe — ${pkg.product.priceString}/mo`}
                  </Text>
                </Pressable>
              </View>
            );
          })
        )}

        <View style={[styles.unlimitedCard, { backgroundColor: colors.navy }]}>
          <View style={styles.unlimitedHeader}>
            <Feather name="zap" size={20} color={colors.gold} />
            <Text style={styles.unlimitedName}>Unlimited Enterprise</Text>
            <Text style={styles.unlimitedPrice}>Contact Us</Text>
          </View>
          <Text style={styles.unlimitedDesc}>
            For law firms, consumer advocacy groups, or organizations handling high volumes of cases.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.unlimitedBtn, { borderColor: colors.gold, opacity: pressed ? 0.7 : 1 }]}
            onPress={handleContactUs}
          >
            <Feather name="mail" size={14} color={colors.gold} />
            <Text style={[styles.unlimitedBtnText, { color: colors.gold }]}>Get in Touch</Text>
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
            <Text style={[styles.restoreText, { color: colors.teal }]}>Restore Purchases</Text>
          )}
        </Pressable>

        <Text style={[styles.legalNote, { color: colors.mutedForeground }]}>
          Results are based on jurisdiction-specific laws and patterns, but are provided for informational purposes only. Not legal advice. Not a law firm. Not a substitute for a licensed attorney.
        </Text>

        <Text style={[styles.legalNote, { color: colors.mutedForeground }]}>
          Subscriptions auto-renew monthly. Cancel anytime in App Store settings. Billed through Apple.
        </Text>

        <View style={[styles.securityRow, { borderColor: colors.border }]}>
          <Feather name="shield" size={14} color={colors.successGreen} />
          <Text style={[styles.securityText, { color: colors.mutedForeground }]}>
            Secured by Apple · Data encrypted on device · Cancel anytime
          </Text>
        </View>
      </ScrollView>

      <Modal transparent animationType="fade" visible={!!pendingPackage} onRequestClose={() => setPendingPackage(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Confirm Purchase</Text>
            {pendingPackage && (
              <>
                <Text style={[styles.modalBody, { color: colors.mutedForeground }]}>
                  You are about to subscribe to{" "}
                  <Text style={{ color: colors.foreground, fontFamily: "DMSans_600SemiBold" }}>
                    {PlanName(pendingPackage.identifier)}
                  </Text>{" "}
                  for{" "}
                  <Text style={{ color: colors.foreground, fontFamily: "DMSans_600SemiBold" }}>
                    {pendingPackage.product.priceString}/month
                  </Text>
                  .
                </Text>
                <Text style={[styles.modalNote, { color: colors.mutedForeground }]}>
                  This is a test purchase. Your payment method will not be charged.
                </Text>
              </>
            )}
            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [styles.modalCancel, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
                onPress={() => setPendingPackage(null)}
              >
                <Text style={[styles.modalCancelText, { color: colors.mutedForeground }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.modalConfirm, { backgroundColor: colors.teal, opacity: pressed ? 0.8 : 1 }]}
                onPress={confirmPurchase}
              >
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={purchaseSuccess} onRequestClose={() => { setPurchaseSuccess(false); router.back(); }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={[styles.successIcon, { backgroundColor: colors.teal + "20" }]}>
              <Feather name="check-circle" size={32} color={colors.teal} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>You're all set!</Text>
            <Text style={[styles.modalBody, { color: colors.mutedForeground }]}>
              Your subscription is now active. Enjoy all premium features.
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
  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16, paddingTop: 4 },
  hero: { gap: 16, paddingBottom: 8 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  heroBadgeText: { fontSize: 11, fontFamily: "DMSans_600SemiBold", letterSpacing: 0.3 },
  heroHeadline: { fontSize: 32, fontFamily: "Raleway_700Bold", letterSpacing: -0.8, lineHeight: 40 },
  heroSubtext: { fontSize: 15, fontFamily: "DMSans_400Regular", lineHeight: 22 },
  painBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  painText: { flex: 1, fontSize: 13, fontFamily: "DMSans_400Regular", lineHeight: 18 },
  featureList: { gap: 10 },
  featureItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  featureIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  featureItemText: { fontSize: 14, fontFamily: "DMSans_500Medium", flex: 1 },
  heroCTAWrap: { borderRadius: 18, overflow: "hidden", marginTop: 4 },
  heroCTA: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: 18,
  },
  heroCTAText: { color: "#FFFFFF", fontFamily: "Raleway_700Bold", fontSize: 17, letterSpacing: -0.2 },
  trustLine: { fontSize: 12, fontFamily: "DMSans_400Regular", textAlign: "center", lineHeight: 17 },
  sectionDivider: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 11, fontFamily: "DMSans_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8 },
  loadingCard: {
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
  },
  loadingText: { fontSize: 14, fontFamily: "DMSans_400Regular" },
  planCard: { borderRadius: 18, padding: 20, gap: 10, position: "relative", overflow: "hidden" },
  badge: {
    position: "absolute",
    top: 14,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { color: "#FFFFFF", fontSize: 11, fontFamily: "DMSans_600SemiBold", letterSpacing: 0.3 },
  planHeader: { gap: 4, marginBottom: 2, paddingRight: 90 },
  planName: { fontSize: 20, fontFamily: "Raleway_700Bold", letterSpacing: -0.4 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  price: { fontSize: 36, fontFamily: "Raleway_700Bold", letterSpacing: -1 },
  period: { fontSize: 15, fontFamily: "DMSans_400Regular" },
  featureDivider: { height: 1, marginVertical: 2 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  featureText: { fontSize: 14, fontFamily: "DMSans_400Regular" },
  planBtn: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    minHeight: 50,
  },
  planBtnText: { fontFamily: "Raleway_600SemiBold", fontSize: 15 },
  unlimitedCard: { borderRadius: 18, padding: 20, gap: 12 },
  unlimitedHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  unlimitedName: { fontSize: 16, fontFamily: "Raleway_600SemiBold", color: "#FFFFFF", flex: 1 },
  unlimitedPrice: { fontSize: 15, fontFamily: "DMSans_600SemiBold", color: "#C9A227" },
  unlimitedDesc: { fontSize: 13, fontFamily: "DMSans_400Regular", color: "rgba(255,255,255,0.75)", lineHeight: 19 },
  unlimitedBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 8,
  },
  unlimitedBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 14 },
  restoreBtn: { alignItems: "center", paddingVertical: 12 },
  restoreText: { fontSize: 14, fontFamily: "DMSans_500Medium" },
  legalNote: { fontSize: 11, fontFamily: "DMSans_400Regular", textAlign: "center", lineHeight: 17 },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  securityText: { fontSize: 12, fontFamily: "DMSans_400Regular" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    gap: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: { fontSize: 20, fontFamily: "Raleway_700Bold", textAlign: "center" },
  modalBody: { fontSize: 15, fontFamily: "DMSans_400Regular", textAlign: "center", lineHeight: 22 },
  modalNote: { fontSize: 12, fontFamily: "DMSans_400Regular", textAlign: "center", lineHeight: 18 },
  modalActions: { flexDirection: "row", gap: 12, width: "100%" },
  modalCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  modalCancelText: { fontSize: 15, fontFamily: "DMSans_600SemiBold" },
  modalConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalConfirmText: { color: "#FFFFFF", fontSize: 15, fontFamily: "DMSans_600SemiBold" },
});

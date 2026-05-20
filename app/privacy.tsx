import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const SECTIONS = [
  {
    title: "What We Collect",
    icon: "database" as const,
    content: `We collect only what you provide: your name, email address, and the case information you enter into the app (descriptions, evidence notes, timeline events). We do not collect your location, contacts, or any other device data.`,
  },
  {
    title: "How Your Data Is Protected",
    icon: "shield" as const,
    content: `Your case files, evidence, and notes are stored locally on your device and never uploaded to a server. When AI features transmit data, it is protected by industry-standard TLS encryption in transit. Device-level encryption (provided by iOS) protects your data at rest. You can also enable Face ID / Touch ID app lock in Settings for an additional layer of protection.`,
  },
  {
    title: "Who Can See Your Information",
    icon: "eye-off" as const,
    content: `Only you can access your case data. We do not sell, share, or disclose your personal information or case details to any third parties, advertisers, or government agencies except as required by applicable law with proper legal process.`,
  },
  {
    title: "AI Processing",
    icon: "cpu" as const,
    content: `When you use AI features (summaries, risk analysis, classification), your case descriptions are sent to our AI provider (Anthropic) for processing. This data is not used to train AI models and is subject to Anthropic's data processing agreement. AI features are opt-in — you choose when to activate them.`,
  },
  {
    title: "Data Retention",
    icon: "clock" as const,
    content: `Your data is retained as long as your account is active. You may delete your account and all associated data at any time from Settings. Upon deletion, your data is permanently removed within 30 days.`,
  },
  {
    title: "Your Rights",
    icon: "user-check" as const,
    content: `Canadian users have rights under PIPEDA and applicable provincial privacy laws. U.S. users may have rights under applicable state privacy laws (including CCPA for California residents). You have the right to access, correct, or delete your personal information at any time.`,
  },
  {
    title: "Payments",
    icon: "credit-card" as const,
    content: `All payments are processed securely through Apple's App Store. We never collect or store your payment information. Apple's privacy policy and terms govern all payment transactions. Subscriptions can be managed and cancelled at any time through your Apple ID settings.`,
  },
  {
    title: "Contact Us",
    icon: "mail" as const,
    content: `For privacy questions or to exercise your rights, contact us at: privacy@casebuilderai.com\n\nThis policy applies to users in Canada and the United States.`,
  },
];

export default function PrivacyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.navy }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.introBanner, { backgroundColor: colors.navy }]}>
          <Feather name="shield" size={24} color={colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>Your Privacy Matters</Text>
            <Text style={styles.introText}>
              CaseBuilder AI is built on the principle that your legal and personal situation is strictly private. This policy explains exactly how we handle your data.
            </Text>
          </View>
        </View>

        <Text style={[styles.lastUpdated, { color: colors.mutedForeground }]}>
          Last updated: May 2026 · Applies to Canada & United States
        </Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconWrap, { backgroundColor: colors.tealLight }]}>
                <Feather name={section.icon} size={16} color={colors.teal} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section.title}</Text>
            </View>
            <Text style={[styles.sectionContent, { color: colors.mutedForeground }]}>
              {section.content}
            </Text>
          </View>
        ))}

        <View style={[styles.disclaimer, { backgroundColor: colors.goldLight, borderColor: colors.gold }]}>
          <Feather name="info" size={14} color={colors.gold} />
          <Text style={[styles.disclaimerText, { color: colors.slate }]}>
            CaseBuilder AI provides informational and organizational tools only and does not constitute legal advice. This privacy policy does not create any legal obligations beyond what is required by applicable law.
          </Text>
        </View>
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
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 60 },
  introBanner: {
    flexDirection: "row",
    gap: 14,
    padding: 18,
    borderRadius: 16,
    alignItems: "flex-start",
  },
  introTitle: {
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  introText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255,255,255,0.8)",
    lineHeight: 18,
  },
  lastUpdated: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Raleway_700Bold",
    letterSpacing: -0.2,
  },
  sectionContent: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    lineHeight: 19,
  },
  disclaimer: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    lineHeight: 17,
  },
});

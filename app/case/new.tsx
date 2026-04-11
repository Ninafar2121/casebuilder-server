import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { useCases } from "@/context/CaseContext";
import { useProfile } from "@/context/ProfileContext";
import { useColors } from "@/hooks/useColors";
import { classifyDisputeType } from "@/lib/ai";
import { getJurisdictionDisplayName } from "@/lib/legalKnowledge";
import { LEGAL_TOPIC_OPTIONS, disputeTypeToTopicKey } from "@/lib/legalTopics";
import { validateJurisdiction, countryCodeToName } from "@/lib/legalJurisdictions";
import { ANALYSIS_MODE_LABEL, LEGAL_CONTEXT_VERSION } from "@/lib/buildLegalAnalysisPrompt";

const CANADIAN_PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon",
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois",
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

const DISPUTE_TYPES = [
  "Consumer Dispute", "Employment Issue", "Landlord-Tenant", "Insurance Claim",
  "Contract Dispute", "Product Liability", "Service Failure", "Privacy / Data",
  "Financial Dispute", "Medical / Healthcare", "Other",
];

export default function NewCaseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { createCase, setActiveCase } = useCases();
  const { profile } = useProfile();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [disputeType, setDisputeType] = useState("");
  const [country, setCountry] = useState<"CA" | "US">(profile.country || "CA");
  const [jurisdiction, setJurisdiction] = useState(profile.province || profile.state || "");
  const [parties, setParties] = useState("");
  const [topicCategory, setTopicCategory] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleClassify = async () => {
    if (!description.trim()) return;
    setIsClassifying(true);
    try {
      const type = await classifyDisputeType(description, country, jurisdiction);
      setDisputeType(type.trim());
      const suggestedTopic = disputeTypeToTopicKey(type.trim());
      if (suggestedTopic && !topicCategory) setTopicCategory(suggestedTopic);
    } catch {
      // silent fallback
    } finally {
      setIsClassifying(false);
    }
  };

  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert("Case Title Required", "Please give your case a title.");
      return;
    }
    if (!jurisdiction) {
      Alert.alert("Jurisdiction Required", "Please select your province or state before creating the case.");
      return;
    }

    const validationResult = validateJurisdiction(countryCodeToName(country), jurisdiction);
    if (!validationResult.valid) {
      Alert.alert("Invalid Jurisdiction", validationResult.warning || "Please select a valid province, territory, or state.");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const jCountry = countryCodeToName(country);
    const newCase = createCase({
      title: title.trim(),
      description: description.trim(),
      disputeType: disputeType || "General Dispute",
      country,
      province: country === "CA" ? jurisdiction : undefined,
      state: country === "US" ? jurisdiction : undefined,
      jurisdictionDisplayName: getJurisdictionDisplayName(country, jurisdiction),
      jurisdictionCountry: jCountry,
      jurisdictionRegion: jurisdiction,
      legalTopicCategory: topicCategory,
      legalContextVersion: LEGAL_CONTEXT_VERSION,
      analysisMode: "jurisdiction_guided",
      parties: parties.split(",").map(p => p.trim()).filter(Boolean),
    });

    setActiveCase(newCase);
    router.replace({ pathname: "/case/[id]", params: { id: newCase.id } });
  };

  const regions = country === "CA" ? CANADIAN_PROVINCES : US_STATES;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.navy }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Feather name="x" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>New Case</Text>
        <Pressable
          onPress={handleCreate}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Text style={styles.createText}>Create</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <DisclaimerBanner compact />

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Case Title *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="e.g. Gym refused to cancel my membership"
            placeholderTextColor={colors.mutedForeground}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Describe What Happened</Text>
          <TextInput
            style={[styles.textarea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="Describe the situation in your own words. The more detail, the better the AI can help."
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          {description.length > 30 && !disputeType && (
            <Pressable
              onPress={handleClassify}
              disabled={isClassifying}
              style={[styles.classifyBtn, { backgroundColor: colors.tealLight, borderColor: colors.teal }]}
            >
              {isClassifying ? (
                <ActivityIndicator size="small" color={colors.teal} />
              ) : (
                <Feather name="cpu" size={14} color={colors.teal} />
              )}
              <Text style={[styles.classifyText, { color: colors.teal }]}>
                {isClassifying ? "Classifying..." : "AI: Classify Dispute Type"}
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Dispute Type</Text>
          <View style={styles.typeGrid}>
            {DISPUTE_TYPES.map(type => (
              <Pressable
                key={type}
                onPress={() => setDisputeType(type)}
                style={[
                  styles.typeChip,
                  {
                    backgroundColor: disputeType === type ? colors.navy : colors.card,
                    borderColor: disputeType === type ? colors.navy : colors.border,
                  },
                ]}
              >
                <Text style={[styles.typeText, { color: disputeType === type ? "#FFFFFF" : colors.mutedForeground }]}>
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Country *</Text>
          <View style={[styles.countryRow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            {(["CA", "US"] as const).map(c => (
              <Pressable
                key={c}
                onPress={() => { setCountry(c); setJurisdiction(""); }}
                style={[styles.countryBtn, { backgroundColor: country === c ? colors.navy : "transparent" }]}
              >
                <Text style={[styles.countryText, { color: country === c ? "#FFFFFF" : colors.mutedForeground }]}>
                  {c === "CA" ? "Canada" : "United States"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
            {country === "CA" ? "Province" : "State"} *
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.regionRow}>
              {regions.map(r => (
                <Pressable
                  key={r}
                  onPress={() => setJurisdiction(r)}
                  style={[
                    styles.regionChip,
                    {
                      backgroundColor: jurisdiction === r ? colors.teal : colors.card,
                      borderColor: jurisdiction === r ? colors.teal : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.regionText, { color: jurisdiction === r ? "#FFFFFF" : colors.mutedForeground }]}>
                    {r}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldLabelRow}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Legal Topic</Text>
            <Text style={[styles.optionalBadge, { color: colors.mutedForeground, borderColor: colors.border }]}>Optional</Text>
          </View>
          <Text style={[styles.fieldHelp, { color: colors.mutedForeground }]}>
            Selecting a topic helps guide the AI analysis for your jurisdiction.
          </Text>
          <View style={styles.typeGrid}>
            {LEGAL_TOPIC_OPTIONS.map(opt => (
              <Pressable
                key={opt.key}
                onPress={() => setTopicCategory(topicCategory === opt.key ? null : opt.key)}
                style={[
                  styles.typeChip,
                  {
                    backgroundColor: topicCategory === opt.key ? colors.teal : colors.card,
                    borderColor: topicCategory === opt.key ? colors.teal : colors.border,
                  },
                ]}
              >
                <Text style={[styles.typeText, { color: topicCategory === opt.key ? "#FFFFFF" : colors.mutedForeground }]}>
                  {opt.shortLabel}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {jurisdiction ? (
          <View style={[styles.jurisdictionGuidanceRow, { backgroundColor: colors.tealLight, borderColor: colors.teal }]}>
            <Feather name="map-pin" size={13} color={colors.teal} />
            <Text style={[styles.jurisdictionGuidanceText, { color: colors.teal }]}>
              Your analysis will be guided by <Text style={{ fontFamily: "DMSans_600SemiBold" }}>{jurisdiction}, {country === "CA" ? "Canada" : "United States"}</Text>
            </Text>
          </View>
        ) : null}

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Other Parties (optional)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="e.g. ABC Gym, Property Manager"
            placeholderTextColor={colors.mutedForeground}
            value={parties}
            onChangeText={setParties}
          />
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>Separate multiple parties with commas</Text>
        </View>

        <Pressable
          onPress={handleCreate}
          style={({ pressed }) => [
            styles.createBtn,
            { backgroundColor: colors.navy, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="briefcase" size={18} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Create Case</Text>
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
  createText: {
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
    minHeight: 110,
  },
  classifyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  classifyText: { fontSize: 13, fontFamily: "DMSans_500Medium" },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeText: { fontSize: 13, fontFamily: "DMSans_500Medium" },
  countryRow: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  countryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  countryText: { fontSize: 14, fontFamily: "DMSans_600SemiBold" },
  regionRow: { flexDirection: "row", gap: 8 },
  regionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  regionText: { fontSize: 13, fontFamily: "DMSans_500Medium" },
  hint: { fontSize: 11, fontFamily: "DMSans_400Regular" },
  fieldLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  optionalBadge: {
    fontSize: 10,
    fontFamily: "DMSans_500Medium",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  fieldHelp: { fontSize: 12, fontFamily: "DMSans_400Regular", lineHeight: 17, marginTop: -2 },
  jurisdictionGuidanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    padding: 11,
    borderRadius: 10,
    borderWidth: 1,
  },
  jurisdictionGuidanceText: { fontSize: 12, fontFamily: "DMSans_400Regular", flex: 1, lineHeight: 17 },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  createBtnText: {
    color: "#FFFFFF",
    fontFamily: "Raleway_600SemiBold",
    fontSize: 16,
  },
});

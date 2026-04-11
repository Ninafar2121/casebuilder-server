import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfile } from "@/context/ProfileContext";
import { useColors } from "@/hooks/useColors";

const CANADIAN_PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon",
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming", "District of Columbia",
];

export default function JurisdictionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useProfile();
  const [country, setCountry] = useState<"CA" | "US">(profile.country || "CA");
  const [selected, setSelected] = useState(profile.province || profile.state || "");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const regions = country === "CA" ? CANADIAN_PROVINCES : US_STATES;

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (country === "CA") {
      updateProfile({ country, province: selected, state: undefined });
    } else {
      updateProfile({ country, state: selected, province: undefined });
    }
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.navy }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Feather name="x" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Jurisdiction</Text>
        <Pressable
          onPress={handleSave}
          disabled={!selected}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : !selected ? 0.4 : 1 })}
        >
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.inner}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>Country</Text>
        <View style={[styles.countryRow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          {(["CA", "US"] as const).map(c => (
            <Pressable
              key={c}
              onPress={() => { setCountry(c); setSelected(""); }}
              style={[
                styles.countryBtn,
                { backgroundColor: country === c ? colors.navy : "transparent" },
              ]}
            >
              <Text style={[styles.countryText, { color: country === c ? "#FFFFFF" : colors.mutedForeground }]}>
                {c === "CA" ? "Canada" : "United States"}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.mutedForeground }]}>
          {country === "CA" ? "Province / Territory" : "State"}
        </Text>

        <FlatList
          data={regions}
          keyExtractor={item => item}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.regionRow}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelected(item);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[
                styles.regionBtn,
                {
                  backgroundColor: selected === item ? colors.navy : colors.card,
                  borderColor: selected === item ? colors.navy : colors.border,
                },
              ]}
            >
              {selected === item && <Feather name="check" size={12} color="#FFFFFF" />}
              <Text
                style={[
                  styles.regionText,
                  { color: selected === item ? "#FFFFFF" : colors.foreground },
                ]}
                numberOfLines={2}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>
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
  saveText: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
    color: "#C9A227",
  },
  inner: { flex: 1, padding: 16, gap: 10 },
  label: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 8,
  },
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
  countryText: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  regionRow: { gap: 8, marginBottom: 8 },
  regionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 48,
  },
  regionText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    flex: 1,
  },
});

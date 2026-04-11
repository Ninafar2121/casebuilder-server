import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import { useProfile } from "@/context/ProfileContext";

const { width } = Dimensions.get("window");

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

const NAVY = "#143B6D";
const TEAL = "#2E9FB0";

export default function OnboardingScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const { profile, updateProfile } = useProfile();

  const [selectedCountry, setSelectedCountry] = useState<"CA" | "US">(profile.country || "CA");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(
    profile.province || profile.state || ""
  );

  const slides = [
    {
      id: "1",
      icon: "folder" as const,
      iconColor: "#1E3A5F",
      title: t("onboarding1Title"),
      body: t("onboarding1Body"),
      note: null,
      interactive: false,
    },
    {
      id: "2",
      icon: "map-pin" as const,
      iconColor: "#2F8F9D",
      title: t("onboardingJurisdictionTitle"),
      body: t("onboardingJurisdictionBody"),
      note: null,
      interactive: true,
    },
    {
      id: "3",
      icon: "cpu" as const,
      iconColor: "#1E3A5F",
      title: t("onboarding3Title"),
      body: t("onboarding3Body"),
      note: t("onboarding3Note"),
      interactive: false,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const isLast = currentIndex === slides.length - 1;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isLast) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updates: Parameters<typeof updateProfile>[0] = { onboardingComplete: true };
    if (selectedJurisdiction) {
      updates.country = selectedCountry;
      if (selectedCountry === "CA") {
        updates.province = selectedJurisdiction;
      } else {
        updates.state = selectedJurisdiction;
      }
    }
    updateProfile(updates);
    router.replace("/(tabs)");
  };

  const topPadding = Platform.OS === "web" ? 67 : 0;
  const regions = selectedCountry === "CA" ? CANADIAN_PROVINCES : US_STATES;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ height: topPadding }} />
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.topBar}>
          <View style={styles.stepCounter}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.stepDot,
                  {
                    backgroundColor: i === currentIndex ? colors.navy : colors.border,
                    width: i === currentIndex ? 20 : 6,
                  },
                ]}
              />
            ))}
          </View>
          {!isLast && (
            <Pressable onPress={handleGetStarted}>
              <Text style={[styles.skipText, { color: colors.mutedForeground }]}>{t("skip")}</Text>
            </Pressable>
          )}
        </View>

        <Animated.FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={e => {
            setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
          }}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}>
              <View style={[styles.iconCircle, { backgroundColor: item.iconColor + "14", borderColor: item.iconColor + "30" }]}>
                <Feather name={item.icon} size={48} color={item.iconColor} />
              </View>

              <View style={styles.textBlock}>
                <Text style={[styles.slideTitle, { color: colors.navy }]}>{item.title}</Text>
                <Text style={[styles.slideBody, { color: colors.mutedForeground }]}>{item.body}</Text>
              </View>

              {item.interactive && (
                <View style={styles.jurisdictionPicker}>
                  <Text style={[styles.pickerLabel, { color: colors.mutedForeground }]}>
                    {t("onboardingSelectCountry")}
                  </Text>
                  <View style={[styles.countryRow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                    {(["CA", "US"] as const).map(c => (
                      <Pressable
                        key={c}
                        onPress={() => {
                          Haptics.selectionAsync();
                          setSelectedCountry(c);
                          setSelectedJurisdiction("");
                        }}
                        style={[
                          styles.countryBtn,
                          { backgroundColor: selectedCountry === c ? NAVY : "transparent" },
                        ]}
                      >
                        <Text style={[styles.countryText, { color: selectedCountry === c ? "#FFFFFF" : colors.mutedForeground }]}>
                          {c === "CA" ? "🇨🇦  Canada" : "🇺🇸  United States"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <Text style={[styles.pickerLabel, { color: colors.mutedForeground, marginTop: 10 }]}>
                    {t("onboardingSelectRegion")}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.regionsScroll}>
                    <View style={styles.regionRow}>
                      {regions.map(r => (
                        <Pressable
                          key={r}
                          onPress={() => {
                            Haptics.selectionAsync();
                            setSelectedJurisdiction(r === selectedJurisdiction ? "" : r);
                          }}
                          style={[
                            styles.regionChip,
                            {
                              backgroundColor: selectedJurisdiction === r ? TEAL : colors.card,
                              borderColor: selectedJurisdiction === r ? TEAL : colors.border,
                            },
                          ]}
                        >
                          <Text style={[styles.regionText, { color: selectedJurisdiction === r ? "#FFFFFF" : colors.mutedForeground }]}>
                            {r}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>

                  {selectedJurisdiction ? (
                    <View style={[styles.jurisdictionConfirm, { backgroundColor: TEAL + "15", borderColor: TEAL + "40" }]}>
                      <Feather name="check-circle" size={14} color={TEAL} />
                      <Text style={[styles.jurisdictionConfirmText, { color: TEAL }]}>
                        {selectedJurisdiction}, {selectedCountry === "CA" ? "Canada" : "United States"}
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.setLaterText, { color: colors.mutedForeground }]}>
                      {t("onboardingSetLater")}
                    </Text>
                  )}
                </View>
              )}

              {item.note && (
                <View style={[styles.legalBadge, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                  <Feather name="alert-circle" size={13} color={colors.mutedForeground} />
                  <Text style={[styles.legalBadgeText, { color: colors.mutedForeground }]}>{item.note}</Text>
                </View>
              )}
            </View>
          )}
        />

        <View style={styles.footer}>
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.nextBtn,
              { backgroundColor: colors.navy, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.nextText}>{isLast ? t("getStarted") : t("next")}</Text>
            <Feather name={isLast ? "check" : "arrow-right"} size={17} color="#FFFFFF" />
          </Pressable>

          <Text style={[styles.footerNote, { color: colors.mutedForeground }]}>
            {t("marketNote")}
          </Text>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 8,
  },
  stepCounter: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  stepDot: {
    height: 6,
    borderRadius: 3,
  },
  skipText: {
    fontSize: 15,
    fontFamily: "DMSans_500Medium",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 20,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  textBlock: {
    gap: 10,
    alignItems: "center",
  },
  slideTitle: {
    fontSize: 26,
    fontFamily: "Raleway_700Bold",
    textAlign: "center",
    letterSpacing: -0.8,
    lineHeight: 32,
  },
  slideBody: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  legalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  legalBadgeText: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    flex: 1,
    lineHeight: 16,
  },

  jurisdictionPicker: {
    width: "100%",
    gap: 6,
  },
  pickerLabel: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  countryRow: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  countryBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  countryText: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  regionsScroll: {
    marginHorizontal: -4,
  },
  regionRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  regionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  regionText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
  },
  jurisdictionConfirm: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 2,
  },
  jurisdictionConfirmText: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
  setLaterText: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    marginTop: 2,
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    gap: 14,
    alignItems: "center",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    width: "100%",
    justifyContent: "center",
  },
  nextText: {
    fontSize: 17,
    fontFamily: "Raleway_600SemiBold",
    color: "#FFFFFF",
  },
  footerNote: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },
});

import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { useAppLock } from "@/context/AppLockContext";
import { useProfile } from "@/context/ProfileContext";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import { openSupportEmail } from "@/lib/support";
import { useSubscription } from "@/lib/revenuecat";

function SettingRow({
  icon,
  label,
  subtitle,
  value,
  onToggle,
  onPress,
  rightElement,
}: {
  icon: string;
  label: string;
  subtitle?: string;
  value?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress && !onToggle}
      style={({ pressed }) => [
        styles.settingRow,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          opacity: pressed && onPress ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon as any} size={16} color={colors.navy} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, { color: colors.foreground }]}>{label}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
        )}
      </View>
      {onToggle !== undefined && value !== undefined ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#D8DDE3", true: "#1F6F78" }}
          thumbColor="#FFFFFF"
        />
      ) : rightElement ? rightElement : onPress ? (
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      ) : null}
    </Pressable>
  );
}

function SegmentControl({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const colors = useColors();

  return (
    <View style={[styles.segmentWrap, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
      {options.map(opt => (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          style={[
            styles.segmentBtn,
            { backgroundColor: value === opt.value ? colors.card : "transparent" },
          ]}
        >
          <Text style={[
            styles.segmentText,
            { color: value === opt.value ? colors.foreground : colors.mutedForeground },
          ]}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useProfile();
  const { lockEnabled, autoLockMinutes, hasBiometrics, setLockEnabled, setAutoLockMinutes } = useAppLock();
  const { activeTier, isSubscribed } = useSubscription();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.navy }]}>
        <Text style={styles.headerTitle}>{t("settingsTitle")}</Text>
        <Feather name="settings" size={20} color="rgba(255,255,255,0.7)" />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t("sectionLanguage")}</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.settingLabel, { color: colors.foreground, padding: 14, paddingBottom: 8 }]}>{t("appLanguage")}</Text>
          <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
            <SegmentControl
              options={[{ label: "English", value: "en" }, { label: "Français", value: "fr" }]}
              value={profile.language}
              onChange={v => updateProfile({ language: v as "en" | "fr" })}
            />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t("sectionAppearance")}</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.settingLabel, { color: colors.foreground, padding: 14, paddingBottom: 8 }]}>{t("theme")}</Text>
          <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
            <SegmentControl
              options={[{ label: t("themeLight"), value: "light" }, { label: t("themeDark"), value: "dark" }, { label: t("themeSystem"), value: "system" }]}
              value={profile.theme}
              onChange={v => updateProfile({ theme: v as "light" | "dark" | "system" })}
            />
          </View>
          <Text style={[styles.settingLabel, { color: colors.foreground, padding: 14, paddingBottom: 8 }]}>{t("textSize")}</Text>
          <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
            <SegmentControl
              options={[{ label: t("textSizeSmall"), value: "small" }, { label: t("textSizeMedium"), value: "medium" }, { label: t("textSizeLarge"), value: "large" }]}
              value={profile.textSize}
              onChange={v => updateProfile({ textSize: v as "small" | "medium" | "large" })}
            />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t("sectionAccessibility")}</Text>
        <View style={[styles.cardGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="eye"
            label={t("highContrast")}
            subtitle={t("highContrastSub")}
            value={profile.highContrast}
            onToggle={v => updateProfile({ highContrast: v })}
          />
          <SettingRow
            icon="volume-2"
            label={t("readAloud")}
            subtitle={t("readAloudSub")}
            value={profile.readAloud}
            onToggle={v => updateProfile({ readAloud: v })}
          />
          <SettingRow
            icon="list"
            label={t("stepByStep")}
            subtitle={t("stepByStepSub")}
            value={profile.stepByStep}
            onToggle={v => updateProfile({ stepByStep: v })}
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t("sectionJurisdiction")}</Text>
        <View style={[styles.cardGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="map-pin"
            label={t("changeJurisdiction")}
            subtitle={profile.country ? `${profile.country} - ${profile.province || profile.state || t("notConfigured")}` : t("notConfigured")}
            onPress={() => router.push("/jurisdiction")}
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t("sectionSubscription")}</Text>
        <View style={[styles.cardGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="award"
            label={isSubscribed ? "CaseBuilder AI — Active" : "CaseBuilder AI — Free Trial"}
            subtitle={isSubscribed ? "$2.99/mo · Cancel anytime in App Store settings" : t("upgradePlanSub")}
            onPress={isSubscribed ? undefined : () => router.push("/paywall")}
            rightElement={
              <View style={[styles.tierBadge, { backgroundColor: isSubscribed ? "#1F6F78" : "#C9A227" }]}>
                <Text style={styles.tierBadgeText}>{isSubscribed ? "ACTIVE" : "UPGRADE"}</Text>
              </View>
            }
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t("sectionSecurity")}</Text>
        <View style={[styles.cardGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="lock"
            label={t("appLock")}
            subtitle={
              !hasBiometrics
                ? t("appLockDisabledSub")
                : lockEnabled
                  ? t("appLockEnabledSub")
                  : t("appLockOffSub")
            }
            value={lockEnabled}
            onToggle={hasBiometrics ? (v) => {
              if (v) {
                Alert.alert(
                  t("enableAppLock"),
                  t("enableAppLockMsg"),
                  [
                    { text: t("cancel"), style: "cancel" },
                    { text: t("enable"), onPress: () => setLockEnabled(true) },
                  ]
                );
              } else {
                setLockEnabled(false);
              }
            } : undefined}
          />
          {lockEnabled && (
            <SettingRow
              icon="clock"
              label={t("autoLock")}
              subtitle={t("autoLockSub").replace("{n}", String(autoLockMinutes)).replace("{s}", autoLockMinutes === 1 ? "" : "s")}
              onPress={() => Alert.alert(
                t("autoLockTitle"),
                t("autoLockQuestion"),
                [
                  { text: t("min1"), onPress: () => setAutoLockMinutes(1) },
                  { text: t("min5"), onPress: () => setAutoLockMinutes(5) },
                  { text: t("min15"), onPress: () => setAutoLockMinutes(15) },
                  { text: t("min30"), onPress: () => setAutoLockMinutes(30) },
                  { text: t("cancel"), style: "cancel" },
                ]
              )}
            />
          )}
          <SettingRow
            icon="eye-off"
            label={t("privacyScreen")}
            subtitle={t("privacyScreenSub")}
            rightElement={
              <View style={[styles.onBadge, { backgroundColor: "#E6F4F5", borderColor: "#2E9FB0" }]}>
                <Feather name="check" size={11} color="#2E9FB0" />
                <Text style={[styles.onBadgeText, { color: "#1F6F78" }]}>{t("alwaysOn")}</Text>
              </View>
            }
          />
          <SettingRow
            icon="shield"
            label={t("dataStorage")}
            subtitle={t("dataStorageSub")}
            onPress={() => Alert.alert(t("dataStorageTitle"), t("dataStorageMsg"), [{ text: t("gotIt") }])}
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t("sectionLegal")}</Text>
        <View style={[styles.cardGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow icon="file-text" label={t("privacyPolicy")} onPress={() => router.push("/privacy")} />
          <SettingRow
            icon="book"
            label={t("termsOfService")}
            onPress={() => Linking.openURL("https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")}
          />
          <SettingRow
            icon="alert-circle"
            label={t("importantDisclaimer")}
            subtitle={t("importantDisclaimerSub")}
            onPress={() => Alert.alert(t("legalDisclaimer"), t("legalDisclaimerMsg"), [{ text: t("ok") }])}
          />
          <SettingRow
            icon="mail"
            label={t("contactSupport")}
            subtitle={t("contactSupportSub")}
            onPress={() => Alert.alert(
              t("contactSupportTitle"),
              t("contactSupportQuestion"),
              [
                { text: t("reportBug"), onPress: () => openSupportEmail("bug") },
                { text: t("accountBilling"), onPress: () => openSupportEmail("account") },
                { text: t("subscriptionHelp"), onPress: () => openSupportEmail("subscription") },
                { text: t("generalQuestion"), onPress: () => openSupportEmail("question") },
                { text: t("cancel"), style: "cancel" },
              ],
            )}
          />
        </View>

        <DisclaimerBanner />

        <View style={[styles.marketNote, { backgroundColor: colors.navy }]}>
          <Feather name="globe" size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.marketNoteText}>
            {t("marketNote")}
          </Text>
        </View>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          {t("versionLabel")}
        </Text>
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
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    lineHeight: 34,
  },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 6 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.9,
    marginTop: 18,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGroup: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  settingInfo: { flex: 1 },
  settingLabel: {
    fontSize: 14.5,
    fontFamily: "DMSans_500Medium",
  },
  settingSubtitle: {
    fontSize: 12.5,
    fontFamily: "DMSans_400Regular",
    marginTop: 3,
    lineHeight: 17,
  },
  segmentWrap: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  segmentText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
  },
  marketNote: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  marketNoteText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255,255,255,0.75)",
    lineHeight: 18,
  },
  version: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    marginTop: 8,
  },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tierBadgeText: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  onBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  onBadgeText: {
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.5,
  },
});

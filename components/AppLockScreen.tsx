import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppLock } from "@/context/AppLockContext";

export function AppLockScreen() {
  const { isLocked, isAuthenticating, authenticate, hasBiometrics } = useAppLock();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isLocked) {
      authenticate();
    }
  }, [isLocked]);

  if (!isLocked) return null;

  return (
    <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        <Text style={styles.appName}>CaseBuilder AI</Text>
        <Text style={styles.subtitle}>Your case data is locked</Text>

        <View style={styles.lockIconWrap}>
          <Feather name="lock" size={28} color="#D4AF37" />
        </View>

        {isAuthenticating ? (
          <ActivityIndicator size="large" color="#2E9FB0" style={styles.spinner} />
        ) : (
          <TouchableOpacity
            onPress={authenticate}
            activeOpacity={0.85}
            style={styles.unlockBtn}
          >
            <Feather
              name={hasBiometrics ? "cpu" : "lock"}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.unlockBtnText}>
              {hasBiometrics ? "Unlock with Face ID / Touch ID" : "Unlock"}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.hint}>
          {hasBiometrics
            ? "Use your device biometrics or passcode to access your cases"
            : "Use your device passcode to access your cases"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0D1F35",
    zIndex: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  logoWrap: {
    width: 90,
    height: 90,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    width: 90,
    height: 90,
  },
  appName: {
    fontSize: 26,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255,255,255,0.6)",
  },
  lockIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(212,175,55,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(212,175,55,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  spinner: {
    marginVertical: 8,
  },
  unlockBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#2E9FB0",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: "100%",
    shadowColor: "#2E9FB0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  unlockBtnText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
  },
  hint: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 4,
  },
});

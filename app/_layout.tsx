import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { Raleway_600SemiBold, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold } from "@expo-google-fonts/dm-sans";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppLockScreen } from "@/components/AppLockScreen";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PrivacyScreen } from "@/components/PrivacyScreen";
import { AppLockProvider } from "@/context/AppLockContext";
import { CaseProvider } from "@/context/CaseContext";
import { ProfileProvider, useProfile } from "@/context/ProfileContext";
import { SubscriptionProvider, initializeRevenueCat } from "@/lib/revenuecat";

SplashScreen.preventAutoHideAsync();

try {
  initializeRevenueCat();
} catch (err: any) {
  console.warn("RevenueCat Unavailable:", err?.message ?? "Unknown error");
}

const queryClient = new QueryClient();

function AppContent() {
  const { profile, updateProfile, isLoading } = useProfile();

  useEffect(() => {
    if (!isLoading && !profile.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [isLoading, profile.onboardingComplete]);

  const showDisclaimer = profile.onboardingComplete && !profile.disclaimerAccepted;
  return (
    <>
      <AppStack />
      <DisclaimerModal
        visible={showDisclaimer}
        onAccept={() => updateProfile({ disclaimerAccepted: true })}
      />
    </>
  );
}

function AppStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="case/new" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="case/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="evidence/add" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="evidence/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="timeline/add" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="jurisdiction" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="export" options={{ headerShown: false }} />
      <Stack.Screen name="paywall" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="privacy" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
    </Stack>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1F35",
    alignItems: "center",
    justifyContent: "center",
  },
  glowRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#1F6F78",
  },
  icon: {
    width: 110,
    height: 110,
    borderRadius: 24,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  aiBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(201,162,39,0.18)",
    borderWidth: 1.5,
    borderColor: "rgba(201,162,39,0.6)",
  },
  aiBadgeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#C9A227",
    letterSpacing: 0.5,
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Montserrat_700Bold,
    Raleway_600SemiBold,
    Raleway_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
  });
  const [fontTimeout, setFontTimeout] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const splashFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => setFontTimeout(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const fontsReady = fontsLoaded || !!fontError || fontTimeout;

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
      // Give the splash a moment to show before fading out
      splashFadeRef.current = setTimeout(() => {
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(() => setSplashDone(true));
      }, 600);
    }
    return () => {
      if (splashFadeRef.current) clearTimeout(splashFadeRef.current);
    };
  }, [fontsReady]);

  const appContent = (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ProfileProvider>
              <SubscriptionProvider>
                <CaseProvider>
                  <AppLockProvider>
                    <AppContent />
                    <AppLockScreen />
                    <PrivacyScreen />
                  </AppLockProvider>
                </CaseProvider>
              </SubscriptionProvider>
            </ProfileProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );

  if (!fontsReady || !splashDone) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0D1F35" }}>
        {fontsReady && appContent}
        {!splashDone && (
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: splashOpacity, zIndex: 999 }]}>
            <View style={splashStyles.container}>
              <SplashIconAnimation />
            </View>
          </Animated.View>
        )}
      </View>
    );
  }

  return appContent;
}

function SplashIconAnimation() {
  const iconScale = useRef(new Animated.Value(0.7)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(iconScale, {
        toValue: 1.0,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(iconOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.35,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <>
      <Animated.View style={[splashStyles.glowRing, { opacity: glowOpacity }]} />
      <Animated.View style={{ transform: [{ scale: iconScale }], opacity: iconOpacity }}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={splashStyles.icon}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View style={[splashStyles.titleRow, { opacity: textOpacity }]}>
        <Text style={splashStyles.titleText}>CaseBuilder </Text>
        <View style={splashStyles.aiBadge}>
          <Text style={splashStyles.aiBadgeText}>AI</Text>
        </View>
      </Animated.View>
    </>
  );
}

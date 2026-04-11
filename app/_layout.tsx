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
import React, { useEffect, useState } from "react";
import { View } from "react-native";
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

  useEffect(() => {
    const timer = setTimeout(() => setFontTimeout(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError || fontTimeout) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, fontTimeout]);

  if (!fontsLoaded && !fontError && !fontTimeout) {
    return <View style={{ flex: 1, backgroundColor: "#0D1F35" }} />;
  }

  return (
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
}

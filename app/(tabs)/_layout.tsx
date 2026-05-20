import { BlurView } from "expo-blur";
import { Tabs, Redirect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { useProfile } from "@/context/ProfileContext";
import { useColors } from "@/hooks/useColors";

export default function TabLayout() {
  const { profile, isLoading } = useProfile();
  const colors = useColors();
  const isDark = profile.theme === "dark" || (profile.theme === "system" && colors.background === "#0E1F2E");
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  if (isLoading) return null;

  if (!profile.onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  let SymbolView: any = null;
  if (isIOS) {
    try {
      SymbolView = require("expo-symbols").SymbolView;
    } catch {}
  }

  const TabIcon = ({
    featherName,
    sfName,
    color,
  }: {
    featherName: string;
    sfName?: string;
    color: string;
  }) => {
    if (isIOS && SymbolView && sfName) {
      return <SymbolView name={sfName} tintColor={color} size={22} />;
    }
    return <Feather name={featherName as any} size={22} color={color} />;
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          shadowColor: "#1A2B40",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0 : 0.06,
          shadowRadius: 8,
          height: isWeb ? 84 : undefined,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={98}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        tabBarLabelStyle: {
          fontFamily: "DMSans_500Medium",
          fontSize: 10.5,
          marginTop: -1,
          letterSpacing: 0.1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabIcon featherName="home" sfName="house" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="evidence"
        options={{
          title: "Evidence",
          tabBarIcon: ({ color }) => (
            <TabIcon featherName="folder" sfName="folder" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: "Timeline",
          tabBarIcon: ({ color }) => (
            <TabIcon featherName="clock" sfName="clock" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: "AI",
          tabBarIcon: ({ color }) => (
            <TabIcon featherName="cpu" sfName="brain" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <TabIcon featherName="message-circle" sfName="bubble.left.and.bubble.right" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="risk"
        options={{
          title: "Analysis",
          tabBarIcon: ({ color }) => (
            <TabIcon featherName="search" sfName="magnifyingglass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <TabIcon featherName="settings" sfName="gear" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

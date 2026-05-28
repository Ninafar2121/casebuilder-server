import { BlurView } from "expo-blur";
import { Tabs, Redirect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
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

  const GOLD = "#C9A227";
  const NAVY = "#0D1F35";

  const TabIcon = ({
    featherName,
    sfName,
    color,
    focused,
  }: {
    featherName: string;
    sfName?: string;
    color: string;
    focused: boolean;
  }) => {
    return (
      <View style={{ alignItems: "center" }}>
        {focused && (
          <View style={{
            position: "absolute",
            top: -10,
            width: 20,
            height: 3,
            borderRadius: 2,
            backgroundColor: GOLD,
          }} />
        )}
        {isIOS && SymbolView && sfName
          ? <SymbolView name={sfName} tintColor={color} size={22} />
          : <Feather name={featherName as any} size={22} color={color} />
        }
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: GOLD,
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : NAVY,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.18,
          shadowRadius: 12,
          height: isWeb ? 84 : undefined,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={98}
              tint="dark"
              style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(13,31,53,0.85)" }]}
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
          tabBarIcon: ({ color, focused }) => (
            <TabIcon featherName="home" sfName="house" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="evidence"
        options={{
          title: "Evidence",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon featherName="folder" sfName="folder" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: "Timeline",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon featherName="clock" sfName="clock" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: "AI",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon featherName="cpu" sfName="brain" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon featherName="message-circle" sfName="bubble.left.and.bubble.right" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="risk"
        options={{
          title: "Analysis",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon featherName="search" sfName="magnifyingglass" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon featherName="settings" sfName="gear" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

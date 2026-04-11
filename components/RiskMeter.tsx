import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface RiskMeterProps {
  score: number;
  label?: string;
}

export function RiskMeter({ score, label }: RiskMeterProps) {
  const colors = useColors();
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: score / 100,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  }, [score]);

  const getColor = () => {
    if (score >= 70) return colors.alertRed;
    if (score >= 40) return colors.gold;
    return colors.successGreen;
  };

  const getLabel = () => {
    if (score >= 70) return "High Concern";
    if (score >= 40) return "Moderate Concern";
    return "Lower Concern";
  };

  const barWidth = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Risk Assessment</Text>
        <Text style={[styles.score, { color: getColor() }]}>{score}/100</Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <Animated.View
          style={[styles.bar, { width: barWidth, backgroundColor: getColor() }]}
        />
      </View>
      <Text style={[styles.label, { color: getColor() }]}>{label || getLabel()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  score: {
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
    letterSpacing: -0.5,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
});

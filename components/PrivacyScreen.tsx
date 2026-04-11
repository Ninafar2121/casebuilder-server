import React, { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, StyleSheet, View } from "react-native";

export function PrivacyScreen() {
  const [hidden, setHidden] = useState(false);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      const prev = appStateRef.current;
      appStateRef.current = next;

      if (next === "inactive" || next === "background") {
        setHidden(true);
      } else if (next === "active" && (prev === "inactive" || prev === "background")) {
        setHidden(false);
      }
    });
    return () => sub.remove();
  }, []);

  if (!hidden) return null;

  return <View style={styles.screen} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0D1F35",
    zIndex: 9998,
  },
});

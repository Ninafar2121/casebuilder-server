import { useColorScheme } from "react-native";

import colors from "@/constants/colors";

let _profileTheme: string | null = null;

/**
 * Call this from ProfileContext so the hook can read the profile theme
 * without creating a circular dependency.
 */
export function setProfileTheme(theme: string | null) {
  _profileTheme = theme;
}

/**
 * Returns the design tokens for the current color scheme.
 * Respects the user's in-app theme preference (light / dark / system).
 * Falls back to the device system setting when the preference is "system".
 */
export function useColors() {
  const deviceScheme = useColorScheme();

  let scheme: "light" | "dark";

  if (_profileTheme === "light") {
    scheme = "light";
  } else if (_profileTheme === "dark") {
    scheme = "dark";
  } else {
    scheme = deviceScheme === "dark" ? "dark" : "light";
  }

  const palette =
    scheme === "dark" && "dark" in colors
      ? (colors as Record<string, typeof colors.light>).dark
      : colors.light;

  return { ...palette, radius: colors.radius };
}

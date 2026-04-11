import Constants from "expo-constants";
import { Linking, Platform } from "react-native";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";
const SUPPORT_EMAIL = "support@casebuilder.ai";

export type SupportCategory =
  | "bug"
  | "account"
  | "subscription"
  | "question"
  | "feedback";

const CATEGORY_SUBJECTS: Record<SupportCategory, string> = {
  bug: "Bug Report — CaseBuilder AI",
  account: "Account Issue — CaseBuilder AI",
  subscription: "Subscription Help — CaseBuilder AI",
  question: "General Question — CaseBuilder AI",
  feedback: "Feedback — CaseBuilder AI",
};

function deviceLine(): string {
  const os = Platform.OS === "ios" ? "iOS" : Platform.OS === "android" ? "Android" : "Web";
  const osVersion = typeof Platform.Version === "number"
    ? String(Platform.Version)
    : Platform.Version ?? "unknown";
  return `Device: ${os} ${osVersion}`;
}

function buildEmailBody(category: SupportCategory, extra?: string): string {
  const lines = [
    extra ? extra : "Please describe your issue below:",
    "",
    "—",
    `App Version: ${APP_VERSION}`,
    deviceLine(),
  ];
  return lines.join("\n");
}

export async function openSupportEmail(category: SupportCategory, extra?: string) {
  const subject = encodeURIComponent(CATEGORY_SUBJECTS[category]);
  const body = encodeURIComponent(buildEmailBody(category, extra));
  const url = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  } else {
    await Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  }
}

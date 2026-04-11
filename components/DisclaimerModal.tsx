import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface Props {
  visible: boolean;
  onAccept: () => void;
}

export function DisclaimerModal({ visible, onAccept }: Props) {
  const colors = useColors();

  const handleAccept = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAccept();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          <View style={[styles.iconWrap, { backgroundColor: colors.navy + "15" }]}>
            <Feather name="shield" size={32} color={colors.navy} />
          </View>

          <Text style={[styles.title, { color: colors.navy }]}>
            Before You Begin
          </Text>

          <Text style={[styles.body, { color: colors.foreground }]}>
            CaseBuilder AI helps you organize your case details, evidence, and timeline in one place.
          </Text>

          <View style={[styles.noticeBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Text style={[styles.noticeHeading, { color: colors.foreground }]}>
              Important Notice
            </Text>
            {[
              "CaseBuilder AI does not provide legal advice.",
              "AI-generated outputs may contain errors or omissions.",
              "Always consult a qualified legal professional for legal guidance.",
              "You control what information you add and share.",
            ].map((line, i) => (
              <View key={i} style={styles.noticeRow}>
                <View style={[styles.noticeDot, { backgroundColor: colors.teal }]} />
                <Text style={[styles.noticeLine, { color: colors.mutedForeground }]}>{line}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.privacy, { color: colors.mutedForeground }]}>
            Your information stays on your device and is never shared without your permission.
          </Text>

          <Pressable
            onPress={handleAccept}
            style={({ pressed }) => [
              styles.acceptBtn,
              { backgroundColor: colors.navy, opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <Feather name="check" size={18} color="#FFFFFF" />
            <Text style={styles.acceptText}>I Understand — Continue</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10,20,35,0.72)",
    justifyContent: "flex-end",
    padding: 16,
    paddingBottom: 32,
  },
  sheet: {
    borderRadius: 24,
    padding: 28,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "Raleway_700Bold",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  noticeBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  noticeHeading: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  noticeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  noticeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
    flexShrink: 0,
  },
  noticeLine: {
    flex: 1,
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    lineHeight: 19,
  },
  privacy: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 17,
  },
  acceptBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 4,
  },
  acceptText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
  },
});

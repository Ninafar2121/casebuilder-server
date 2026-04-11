import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

const NAVY = "#143B6D";
const TEAL = "#2E9FB0";
const GOLD = "#D4AF37";

function EvidenceIllustration({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={ill.evidenceWrap}>
      <View style={[ill.doc, ill.docBack, { backgroundColor: colors.secondary, borderColor: TEAL + "30" }]}>
        <View style={[ill.docLine, { backgroundColor: TEAL + "35", width: "70%" }]} />
        <View style={[ill.docLine, { backgroundColor: TEAL + "25", width: "50%" }]} />
        <View style={[ill.docLine, { backgroundColor: TEAL + "20", width: "60%" }]} />
      </View>
      <View style={[ill.doc, ill.docMid, { backgroundColor: colors.card, borderColor: NAVY + "25" }]}>
        <View style={[ill.docLine, { backgroundColor: NAVY + "30", width: "75%" }]} />
        <View style={[ill.docLine, { backgroundColor: NAVY + "20", width: "55%" }]} />
        <View style={[ill.docLine, { backgroundColor: NAVY + "15", width: "65%" }]} />
      </View>
      <View style={[ill.doc, ill.docFront, { backgroundColor: "#FFFFFF", borderColor: TEAL + "60" }]}>
        <View style={[ill.docIconRow]}>
          <View style={[ill.docIconDot, { backgroundColor: TEAL }]} />
          <View style={[ill.docLine, { backgroundColor: TEAL + "50", flex: 1 }]} />
        </View>
        <View style={[ill.docLine, { backgroundColor: "#DCE4EF", width: "70%" }]} />
        <View style={[ill.docLine, { backgroundColor: "#DCE4EF", width: "50%" }]} />
        <View style={[ill.docCheckRow]}>
          <Feather name="check" size={9} color={TEAL} />
          <View style={[ill.docLine, { backgroundColor: TEAL + "40", flex: 1 }]} />
        </View>
      </View>
    </View>
  );
}

function TimelineIllustration({ colors }: { colors: ReturnType<typeof useColors> }) {
  const dots = [
    { filled: true, color: TEAL, size: 16 },
    { filled: true, color: NAVY, size: 12 },
    { filled: false, color: "#DCE4EF", size: 12 },
    { filled: false, color: "#DCE4EF", size: 10 },
  ];
  return (
    <View style={ill.timelineWrap}>
      <View style={[ill.timelineLine, { backgroundColor: "#DCE4EF" }]} />
      {dots.map((d, i) => (
        <View
          key={i}
          style={[
            ill.timelineDot,
            {
              width: d.size,
              height: d.size,
              borderRadius: d.size / 2,
              backgroundColor: d.filled ? d.color : colors.card,
              borderWidth: d.filled ? 0 : 2,
              borderColor: d.color,
              shadowColor: d.filled ? d.color : "transparent",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: d.filled ? 0.35 : 0,
              shadowRadius: 4,
              elevation: d.filled ? 3 : 0,
            },
          ]}
        />
      ))}
      <View style={[ill.timelinePulse, { borderColor: TEAL + "25", backgroundColor: TEAL + "08" }]} />
    </View>
  );
}

function AIIllustration({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={ill.aiWrap}>
      <View style={[ill.aiOrb, { backgroundColor: TEAL + "12", borderColor: TEAL + "30" }]}>
        <View style={[ill.aiOrbInner, { backgroundColor: TEAL + "18", borderColor: TEAL + "40" }]}>
          <Feather name="cpu" size={28} color={TEAL} />
        </View>
      </View>
      <View style={[ill.aiRay, ill.aiRayTL, { backgroundColor: TEAL + "25" }]} />
      <View style={[ill.aiRay, ill.aiRayTR, { backgroundColor: NAVY + "25" }]} />
      <View style={[ill.aiRay, ill.aiRayBL, { backgroundColor: NAVY + "20" }]} />
      <View style={[ill.aiRay, ill.aiRayBR, { backgroundColor: TEAL + "20" }]} />
      <View style={[ill.aiDot, ill.aiDot1, { backgroundColor: TEAL }]} />
      <View style={[ill.aiDot, ill.aiDot2, { backgroundColor: GOLD }]} />
      <View style={[ill.aiDot, ill.aiDot3, { backgroundColor: NAVY }]} />
    </View>
  );
}

function CasesIllustration({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={ill.casesWrap}>
      <View style={[ill.caseDocBack, { backgroundColor: TEAL + "12", borderColor: TEAL + "35" }]} />
      <View style={[ill.caseDocMid, { backgroundColor: colors.card, borderColor: NAVY + "22" }]}>
        <View style={[ill.caseDocLine, { backgroundColor: NAVY + "22", width: "80%" }]} />
        <View style={[ill.caseDocLine, { backgroundColor: NAVY + "14", width: "55%" }]} />
      </View>
      <View style={[ill.casesFolder, { backgroundColor: NAVY + "08", borderColor: NAVY + "38" }]}>
        <View style={[ill.casesFolderTab, { backgroundColor: NAVY + "18", borderColor: NAVY + "32" }]} />
        <View style={ill.casesFolderInner}>
          <View style={[ill.casesFolderLine, { backgroundColor: TEAL, width: 44 }]} />
          <View style={[ill.casesFolderLine, { backgroundColor: NAVY + "28", width: 32 }]} />
          <View style={[ill.casesFolderLine, { backgroundColor: NAVY + "18", width: 38 }]} />
        </View>
      </View>
      <View style={[ill.casesActiveDot, { backgroundColor: TEAL, borderColor: colors.card }]} />
    </View>
  );
}

function RiskIllustration({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={ill.riskWrap}>
      <View style={[ill.riskLens, { backgroundColor: colors.card, borderColor: NAVY + "40" }]}>
        <View style={[ill.riskLensInner, { borderColor: NAVY + "20" }]}>
          <View style={[ill.riskDot, { backgroundColor: GOLD }]} />
          <View style={[ill.riskDot, { backgroundColor: TEAL + "80" }]} />
          <View style={[ill.riskDot, { backgroundColor: NAVY + "60" }]} />
        </View>
      </View>
      <View style={[ill.riskHandle, { backgroundColor: NAVY + "50" }]} />
      <View style={[ill.riskGlow, { backgroundColor: GOLD + "10", borderColor: GOLD + "20" }]} />
    </View>
  );
}

interface Feature {
  icon: string;
  label: string;
  tint: string;
}

interface EmptyStateCardProps {
  illustration: "evidence" | "timeline" | "ai" | "risk" | "cases";
  eyebrow?: string;
  title: string;
  body: string;
  ctaLabel?: string;
  onCta?: () => void;
  ctaColor?: string;
  features?: Feature[];
  note?: string;
}

export function EmptyStateCard({
  illustration,
  eyebrow,
  title,
  body,
  ctaLabel,
  onCta,
  ctaColor,
  features,
  note,
}: EmptyStateCardProps) {
  const colors = useColors();

  const IllustrationComponent = {
    evidence: EvidenceIllustration,
    timeline: TimelineIllustration,
    ai: AIIllustration,
    risk: RiskIllustration,
    cases: CasesIllustration,
  }[illustration];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadowColor }]}>
      <View style={styles.illustrationWrap}>
        <IllustrationComponent colors={colors} />
      </View>

      {eyebrow && (
        <Text style={[styles.eyebrow, { color: TEAL }]}>{eyebrow}</Text>
      )}

      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.body, { color: colors.mutedForeground }]}>{body}</Text>

      {features && features.length > 0 && (
        <View style={[styles.featuresWrap, { borderTopColor: colors.border }]}>
          {features.map(f => (
            <View key={f.label} style={styles.featureRow}>
              <View style={[styles.featureIconWrap, { backgroundColor: f.tint + "15" }]}>
                <Feather name={f.icon as any} size={12} color={f.tint} />
              </View>
              <Text style={[styles.featureText, { color: colors.mutedForeground }]}>{f.label}</Text>
            </View>
          ))}
        </View>
      )}

      {ctaLabel && onCta && (
        <Pressable
          onPress={onCta}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: ctaColor || TEAL, opacity: pressed ? 0.87 : 1 },
          ]}
        >
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </Pressable>
      )}

      {note && (
        <View style={styles.noteRow}>
          <Feather name="info" size={11} color={colors.mutedForeground} />
          <Text style={[styles.noteText, { color: colors.mutedForeground }]}>{note}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 20,
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
  },
  illustrationWrap: {
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 22,
    fontFamily: "Raleway_700Bold",
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  body: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  featuresWrap: {
    width: "100%",
    borderTopWidth: 1,
    paddingTop: 14,
    gap: 10,
    marginTop: 2,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    flex: 1,
  },
  cta: {
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 2,
  },
  ctaText: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    paddingHorizontal: 4,
  },
  noteText: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    flex: 1,
    lineHeight: 16,
    textAlign: "center",
  },
});

const ill = StyleSheet.create({
  /* ── Evidence ── */
  evidenceWrap: {
    width: 130,
    height: 90,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  doc: {
    position: "absolute",
    width: 80,
    height: 65,
    borderRadius: 10,
    borderWidth: 1.5,
    padding: 8,
    gap: 5,
  },
  docBack: {
    transform: [{ rotate: "-8deg" }, { translateX: -22 }, { translateY: 6 }],
  },
  docMid: {
    transform: [{ rotate: "5deg" }, { translateX: 18 }, { translateY: 4 }],
  },
  docFront: {
    transform: [{ rotate: "-1deg" }],
    zIndex: 2,
    shadowColor: "#1A2B40",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  docLine: {
    height: 4,
    borderRadius: 2,
  },
  docIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  docIconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  docCheckRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  /* ── Timeline ── */
  timelineWrap: {
    width: 220,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 2,
    borderRadius: 1,
  },
  timelineDot: {
    zIndex: 2,
  },
  timelinePulse: {
    position: "absolute",
    left: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    zIndex: 1,
  },

  /* ── AI ── */
  aiWrap: {
    width: 110,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  aiOrb: {
    width: 76,
    height: 76,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  aiOrbInner: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  aiRay: {
    position: "absolute",
    width: 14,
    height: 3,
    borderRadius: 2,
    zIndex: 1,
  },
  aiRayTL: { top: 8, left: 2, transform: [{ rotate: "45deg" }] },
  aiRayTR: { top: 8, right: 2, transform: [{ rotate: "-45deg" }] },
  aiRayBL: { bottom: 8, left: 2, transform: [{ rotate: "-45deg" }] },
  aiRayBR: { bottom: 8, right: 2, transform: [{ rotate: "45deg" }] },
  aiDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    zIndex: 3,
  },
  aiDot1: { top: 4, right: 16 },
  aiDot2: { bottom: 6, left: 12 },
  aiDot3: { top: 14, left: 4 },

  /* ── Cases ── */
  casesWrap: {
    width: 150,
    height: 95,
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  casesFolder: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    marginLeft: -50,
    width: 100,
    height: 66,
    borderRadius: 10,
    borderWidth: 1.5,
    zIndex: 2,
  },
  casesFolderTab: {
    position: "absolute",
    top: -13,
    left: 0,
    width: 38,
    height: 14,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 10,
    borderWidth: 1.5,
    borderBottomWidth: 0,
  },
  casesFolderInner: {
    paddingTop: 14,
    paddingHorizontal: 12,
    gap: 6,
  },
  casesFolderLine: {
    height: 4,
    borderRadius: 2,
  },
  caseDocBack: {
    position: "absolute",
    top: 2,
    right: 12,
    width: 52,
    height: 58,
    borderRadius: 8,
    borderWidth: 1.5,
    transform: [{ rotate: "10deg" }],
    zIndex: 0,
  },
  caseDocMid: {
    position: "absolute",
    top: 0,
    right: 22,
    width: 58,
    height: 62,
    borderRadius: 8,
    borderWidth: 1.5,
    zIndex: 1,
    padding: 10,
    gap: 7,
  },
  caseDocLine: {
    height: 4,
    borderRadius: 2,
  },
  casesActiveDot: {
    position: "absolute",
    bottom: 10,
    right: 22,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2.5,
    zIndex: 4,
  },

  /* ── Risk ── */
  riskWrap: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  riskGlow: {
    position: "absolute",
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    zIndex: 0,
  },
  riskLens: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  riskLensInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
  },
  riskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  riskHandle: {
    position: "absolute",
    bottom: 4,
    right: 8,
    width: 22,
    height: 6,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
    zIndex: 2,
  },
});

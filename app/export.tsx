import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Print from "expo-print";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { useCases } from "@/context/CaseContext";
import { useColors } from "@/hooks/useColors";
import type { Case, Evidence, TimelineEvent } from "@/lib/storage";

function buildHtml(
  caseData: Case,
  evidence: Evidence[],
  timeline: TimelineEvent[],
): string {
  const exportDate = new Date().toLocaleString();
  const jurisdiction = caseData.jurisdictionDisplayName
    || (caseData.country === "CA"
      ? `${caseData.province || "Canada"}, Canada`
      : `${caseData.state || "United States"}, United States`);
  const legalTopicLabel = caseData.legalTopicCategory
    ? caseData.legalTopicCategory.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
    : null;
  const analysisMode = "Jurisdiction-Guided Analysis";

  const escHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const timelineRows = timeline
    .map(
      e => `
      <tr>
        <td class="date">${escHtml(e.date)}</td>
        <td>
          <strong>${escHtml(e.title)}</strong>
          ${e.description ? `<br/><span class="muted">${escHtml(e.description)}</span>` : ""}
          ${e.isAiGenerated ? `<span class="ai-badge">AI-suggested</span>` : ""}
        </td>
        <td><span class="importance imp-${e.importance}">${e.importance}</span></td>
      </tr>`,
    )
    .join("");

  const evidenceRows = evidence
    .map(
      (e, i) => `
      <tr>
        <td class="num">${i + 1}</td>
        <td><span class="ev-type">${escHtml(e.type.toUpperCase())}</span></td>
        <td>
          <strong>${escHtml(e.name)}</strong>
          ${e.date ? `<br/><span class="muted">${escHtml(e.date)}</span>` : ""}
          ${e.tags.length ? `<br/><span class="muted">Tags: ${escHtml(e.tags.join(", "))}</span>` : ""}
          ${e.text ? `<br/><span class="muted note-text">${escHtml(e.text.slice(0, 200))}${e.text.length > 200 ? "…" : ""}</span>` : ""}
        </td>
      </tr>`,
    )
    .join("");

  const flagRows = (caseData.redFlags || [])
    .map(
      (flag, i) => {
        const action = caseData.gapActions?.[i];
        return `
      <div class="flag-card">
        <div class="flag-top">
          <span class="flag-dot">⚠</span>
          <span>${escHtml(flag)}</span>
        </div>
        ${action ? `<div class="flag-action"><strong>Recommended Action:</strong> ${escHtml(action)}</div>` : ""}
      </div>`;
      },
    )
    .join("");

  const missingRows = (caseData.missingEvidence || [])
    .map(item => `<li>${escHtml(item)}</li>`)
    .join("");

  const nextStepsRows = (caseData.nextSteps || [])
    .map((step, i) => `<li><strong>${i + 1}.</strong> ${escHtml(step)}</li>`)
    .join("");

  const mergedLawyerQuestions = [
    ...(caseData.questionsToAskLawyer || []),
    ...(caseData.lawyerQuestions || []),
  ].filter((q, idx, arr) => arr.indexOf(q) === idx);
  const lawyerQRows = mergedLawyerQuestions
    .map((q, i) => `<li><strong>${i + 1}.</strong> ${escHtml(q)}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>CaseBuilder AI — ${escHtml(caseData.title)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
    font-size: 12px;
    line-height: 1.6;
    color: #1a2b40;
    background: #fff;
    padding: 0 32px 40px;
  }

  /* ── Header ── */
  .doc-header {
    background: linear-gradient(135deg, #1E3A5F 0%, #2F8F9D 100%);
    margin: 0 -32px;
    padding: 28px 32px 22px;
    color: #fff;
    margin-bottom: 28px;
  }
  .doc-header h1 { font-size: 20px; font-weight: 700; letter-spacing: -0.4px; }
  .doc-header .app-name { font-size: 11px; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .doc-header .meta { margin-top: 12px; display: flex; gap: 20px; font-size: 11px; opacity: 0.8; }
  .doc-header .meta span { display: flex; align-items: center; gap: 4px; }

  /* ── Disclaimer banner ── */
  .disclaimer-banner {
    background: #FFF8E7;
    border: 1px solid #C9A227;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 11px;
    color: #7a5e0a;
    margin-bottom: 24px;
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  /* ── Section headers ── */
  .section { margin-bottom: 28px; }
  .section-title {
    font-size: 13px;
    font-weight: 700;
    color: #1E3A5F;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border-bottom: 2px solid #1E3A5F;
    padding-bottom: 5px;
    margin-bottom: 14px;
  }
  .section-note {
    font-size: 10px;
    color: #6b7280;
    margin-bottom: 10px;
    font-style: italic;
  }

  /* ── Case info grid ── */
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .info-item { background: #f6f8fb; border-radius: 6px; padding: 10px 12px; }
  .info-label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .info-value { font-size: 13px; font-weight: 600; color: #1a2b40; }

  /* ── Description box ── */
  .desc-box { background: #f6f8fb; border-radius: 8px; padding: 14px; font-size: 12px; line-height: 1.7; }

  /* ── Tables ── */
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background: #1E3A5F; color: #fff; padding: 8px 10px; text-align: left; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 8px 10px; border-bottom: 1px solid #e8ecf2; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  tr:nth-child(even) td { background: #f9fafc; }
  .date { color: #2F8F9D; font-weight: 600; white-space: nowrap; width: 90px; }
  .num { color: #6b7280; width: 24px; text-align: center; }
  .muted { color: #6b7280; font-size: 10px; }
  .note-text { font-style: italic; }
  .ev-type { background: #e5f4f6; color: #1E6B7A; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; white-space: nowrap; }
  .ai-badge { background: #E8F5E9; color: #2E7D32; padding: 1px 5px; border-radius: 3px; font-size: 9px; font-weight: 600; margin-left: 6px; }
  .importance { padding: 1px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
  .imp-critical { background: #fde8e8; color: #c0392b; }
  .imp-high { background: #fff3e0; color: #e65100; }
  .imp-medium { background: #fff8e1; color: #f57f17; }
  .imp-low { background: #e8f5e9; color: #2e7d32; }

  /* ── AI summary ── */
  .ai-label {
    display: inline-block;
    background: #e5f4f6;
    color: #1E6B7A;
    border: 1px solid #2F8F9D40;
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 10px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .summary-box { background: #f6f8fb; border-radius: 8px; padding: 14px; font-size: 12px; line-height: 1.8; color: #1a2b40; }

  /* ── Risk score ── */
  .risk-score-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .risk-badge {
    font-size: 22px;
    font-weight: 800;
    padding: 8px 16px;
    border-radius: 10px;
  }
  .risk-desc { font-size: 11px; color: #6b7280; line-height: 1.5; }

  /* ── Flag cards ── */
  .flag-card { border: 1px solid #f5b7b1; border-radius: 8px; margin-bottom: 10px; overflow: hidden; }
  .flag-top { display: flex; gap: 8px; padding: 10px 12px; background: #fdf2f2; font-size: 12px; }
  .flag-dot { color: #e74c3c; flex-shrink: 0; margin-top: 1px; }
  .flag-action { padding: 8px 12px; background: #e5f4f6; border-top: 1px solid #c8e6ea; font-size: 11px; color: #1a5f6b; }

  /* ── Lists ── */
  ol, ul { padding-left: 4px; }
  li { margin-bottom: 7px; font-size: 12px; list-style: none; display: flex; gap: 6px; align-items: flex-start; }
  li strong { flex-shrink: 0; }

  /* ── Missing evidence ── */
  .missing-item { display: flex; gap: 8px; align-items: flex-start; padding: 8px 12px; background: #fffbf0; border: 1px solid #C9A22740; border-radius: 8px; margin-bottom: 8px; font-size: 12px; }
  .missing-dot { color: #C9A227; flex-shrink: 0; }

  /* ── Footer ── */
  .doc-footer {
    margin-top: 32px;
    border-top: 2px solid #e8ecf2;
    padding-top: 16px;
  }
  .footer-title { font-size: 13px; font-weight: 700; color: #1E3A5F; margin-bottom: 8px; }
  .footer-text { font-size: 10px; color: #6b7280; line-height: 1.7; }
  .export-meta { margin-top: 12px; font-size: 10px; color: #9ca3af; }

  @media print {
    body { padding: 0 20px 20px; }
    .doc-header { margin: 0 -20px; }
  }
</style>
</head>
<body>

<div class="doc-header">
  <div class="app-name">CaseBuilder AI — Case Documentation File</div>
  <h1>${escHtml(caseData.title)}</h1>
  <div class="meta">
    <span>📋 ${escHtml(caseData.disputeType)}</span>
    <span>📍 ${escHtml(jurisdiction)}</span>
    <span>📅 ${escHtml(new Date(caseData.createdAt).toLocaleDateString())}</span>
    <span>Status: ${escHtml(caseData.status)}</span>
  </div>
</div>

<div class="disclaimer-banner">
  <span>⚠</span>
  <div>
    <strong>Important:</strong> Built to analyze cases using the legal framework of your selected Canadian province or U.S. state (<strong>${escHtml(jurisdiction)}</strong>).
    Results are based on jurisdiction-specific laws and patterns, but are provided for informational purposes only.
    Not legal advice. Not a law firm. Not a substitute for a licensed attorney.
    AI-generated content may contain errors or omissions. Always consult a qualified legal professional before taking any action.
  </div>
</div>

<!-- Case Details -->
<div class="section">
  <div class="section-title">Case Details</div>
  <div class="info-grid">
    <div class="info-item">
      <div class="info-label">Case Title</div>
      <div class="info-value">${escHtml(caseData.title)}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Dispute Type</div>
      <div class="info-value">${escHtml(caseData.disputeType)}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Jurisdiction</div>
      <div class="info-value">${escHtml(jurisdiction)}</div>
    </div>
    ${legalTopicLabel ? `<div class="info-item">
      <div class="info-label">Legal Topic</div>
      <div class="info-value">${escHtml(legalTopicLabel)}</div>
    </div>` : ""}
    <div class="info-item">
      <div class="info-label">Analysis Mode</div>
      <div class="info-value">${escHtml(analysisMode)}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Case Created</div>
      <div class="info-value">${escHtml(new Date(caseData.createdAt).toLocaleDateString())}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Exported</div>
      <div class="info-value">${escHtml(exportDate)}</div>
    </div>
  </div>
</div>

${caseData.description ? `
<div class="section">
  <div class="section-title">Background &amp; Description</div>
  <div class="desc-box">${escHtml(caseData.description)}</div>
</div>` : ""}

${timeline.length > 0 ? `
<div class="section">
  <div class="section-title">Timeline of Events (${timeline.length})</div>
  <table>
    <thead><tr><th>Date</th><th>Event</th><th>Importance</th></tr></thead>
    <tbody>${timelineRows}</tbody>
  </table>
</div>` : ""}

${evidence.length > 0 ? `
<div class="section">
  <div class="section-title">Evidence Inventory (${evidence.length} item${evidence.length !== 1 ? "s" : ""})</div>
  <table>
    <thead><tr><th>#</th><th>Type</th><th>Details</th></tr></thead>
    <tbody>${evidenceRows}</tbody>
  </table>
</div>` : ""}

${caseData.aiSummary ? `
<div class="section">
  <div class="section-title">AI-Organized Summary</div>
  <div class="section-note">The following summary was generated by AI based on the information you provided.</div>
  <span class="ai-label">✦ AI-Generated — Informational Purposes Only</span>
  <div class="summary-box">${escHtml(caseData.aiSummary)}</div>
</div>` : ""}

${caseData.professionalSummary ? `
<div class="section">
  <div class="section-title">Professional Format Summary</div>
  <div class="section-note">Formatted for sharing with a lawyer or consumer protection agency.</div>
  <span class="ai-label">✦ AI-Generated — Informational Purposes Only</span>
  <div class="summary-box">${escHtml(caseData.professionalSummary)}</div>
</div>` : ""}

${(caseData.redFlags && caseData.redFlags.length > 0) || caseData.riskScore !== undefined ? `
<div class="section">
  <div class="section-title">Gap &amp; Risk Analysis</div>
  <div class="section-note">AI-generated analysis of potential documentation gaps and concerns. These are organizational observations, not legal conclusions.</div>
  ${caseData.riskScore !== undefined ? `
  <div class="risk-score-row">
    <span class="risk-badge" style="background:${caseData.riskScore >= 70 ? "#fde8e8;color:#c0392b" : caseData.riskScore >= 40 ? "#fff3e0;color:#e65100" : "#e8f5e9;color:#2e7d32"}">
      ${caseData.riskScore}/100
    </span>
    <span class="risk-desc">
      ${caseData.riskScore >= 70 ? "High concern level — significant documentation gaps identified." : caseData.riskScore >= 40 ? "Moderate concern level — some gaps worth addressing." : "Lower concern level — case appears reasonably documented."}
    </span>
  </div>` : ""}
  ${caseData.redFlags && caseData.redFlags.length > 0 ? `
  <div style="margin-bottom:8px;font-weight:600;font-size:12px;color:#c0392b;">Potential Concerns</div>
  ${flagRows}` : ""}
</div>` : ""}

${caseData.missingEvidence && caseData.missingEvidence.length > 0 ? `
<div class="section">
  <div class="section-title">Items to Consider Adding</div>
  <div class="section-note">These items may help make your documentation more complete.</div>
  ${caseData.missingEvidence.map(item => `
  <div class="missing-item">
    <span class="missing-dot">+</span>
    <span>${escHtml(item)}</span>
  </div>`).join("")}
</div>` : ""}

${caseData.nextSteps && caseData.nextSteps.length > 0 ? `
<div class="section">
  <div class="section-title">Suggested Next Steps</div>
  <div class="section-note">AI-generated organizational suggestions only — not legal recommendations.</div>
  <ol>${nextStepsRows}</ol>
</div>` : ""}

${caseData.missingInformation && caseData.missingInformation.length > 0 ? `
<div class="section">
  <div class="section-title">Missing Information</div>
  <div class="section-note">Gaps in the available facts that limit the AI analysis. Clarifying these may improve your case documentation.</div>
  ${caseData.missingInformation.map(item => `
  <div class="missing-item">
    <span class="missing-dot">?</span>
    <span>${escHtml(item)}</span>
  </div>`).join("")}
</div>` : ""}

${mergedLawyerQuestions.length > 0 ? `
<div class="section">
  <div class="section-title">Questions to Ask a Lawyer</div>
  <div class="section-note">AI-suggested questions based on your jurisdiction (${escHtml(jurisdiction)}) and case facts. Bring these to a legal consultation. These are organizational aids, not legal advice.</div>
  <ol>${lawyerQRows}</ol>
</div>` : ""}

<div class="doc-footer">
  <div class="footer-title">Legal Disclaimer</div>
  <div class="footer-text">
    This document was created using CaseBuilder AI, a case organization and documentation tool available in Canada and the United States.
    CaseBuilder AI does not provide legal advice. AI-generated content (summaries, analysis, questions, suggested next steps) may contain errors, omissions, or inaccuracies.
    The information in this document is for organizational and informational purposes only.
    Always consult a qualified legal professional before taking any legal action or making decisions based on this content.
  </div>
  <div class="export-meta">Exported: ${escHtml(exportDate)} · CaseBuilder AI</div>
</div>

</body>
</html>`;
}

export default function ExportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { activeCase, cases, getCaseEvidence, getCaseTimeline } = useCases();
  const [isExporting, setIsExporting] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const currentCase = activeCase || cases[0];

  const evidence = currentCase ? getCaseEvidence(currentCase.id) : [];
  const timeline = currentCase ? getCaseTimeline(currentCase.id) : [];

  const checklist = currentCase
    ? [
        { label: "Case description & type", done: !!currentCase.description },
        { label: "Chronological timeline", done: timeline.length > 0 },
        { label: "Evidence inventory", done: evidence.length > 0 },
        { label: "AI-organized summary", done: !!currentCase.aiSummary },
        { label: "Gap & risk analysis", done: currentCase.riskScore !== undefined },
        { label: "Recommended actions per concern", done: !!(currentCase.gapActions?.length) },
        { label: "Suggested next steps", done: !!(currentCase.nextSteps?.length) },
        { label: "Questions to ask a lawyer", done: !!(currentCase.lawyerQuestions?.length) },
        { label: "Legal disclaimer", done: true },
      ]
    : [];

  const completedCount = checklist.filter(c => c.done).length;
  const completionPct = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const handleExport = async () => {
    if (!currentCase) {
      Alert.alert("No Case", "Create a case first before exporting.");
      return;
    }
    setIsExporting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const html = buildHtml(currentCase, evidence, timeline);

      if (Platform.OS === "web") {
        // Web: open HTML in new tab for browser print-to-PDF
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Native: generate real PDF and share
        const { uri } = await Print.printToFileAsync({ html, base64: false });
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: "application/pdf",
            dialogTitle: `CaseBuilder AI — ${currentCase.title}`,
            UTI: "com.adobe.pdf",
          });
        } else {
          await Share.share({ message: `Case file: ${currentCase.title}`, url: uri });
        }
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      Alert.alert("Export Error", "Could not generate the PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.navy }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Export Case File</Text>
        <Feather name="file-text" size={20} color={colors.gold} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!currentCase ? (
          <View style={[styles.emptyState, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <View style={[styles.emptyIconWrap, { backgroundColor: colors.gold + "18" }]}>
              <Feather name="file-text" size={32} color={colors.gold} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No case to export</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Create a case and add your evidence, timeline, and AI summary before generating your documentation file.
            </Text>
          </View>
        ) : (
          <>
            {/* Case card */}
            <View style={[styles.casePreview, { backgroundColor: colors.navy }]}>
              <View style={styles.casePreviewTop}>
                <View>
                  <Text style={styles.previewLabel}>Exporting Case</Text>
                  <Text style={styles.previewTitle}>{currentCase.title}</Text>
                  <Text style={styles.previewType}>{currentCase.disputeType}</Text>
                </View>
                <View style={[styles.completionCircle, {
                  borderColor: completionPct === 100 ? colors.successGreen : colors.gold,
                }]}>
                  <Text style={[styles.completionPct, {
                    color: completionPct === 100 ? colors.successGreen : colors.gold,
                  }]}>{completionPct}%</Text>
                  <Text style={styles.completionLabel}>ready</Text>
                </View>
              </View>
            </View>

            {/* Checklist */}
            <View style={[styles.checklistCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.checklistTitle, { color: colors.foreground }]}>Document includes</Text>
              <View style={styles.checklistRows}>
                {checklist.map(item => (
                  <View key={item.label} style={styles.checkRow}>
                    <Feather
                      name={item.done ? "check-circle" : "circle"}
                      size={15}
                      color={item.done ? colors.successGreen : colors.border}
                    />
                    <Text style={[
                      styles.checkLabel,
                      { color: item.done ? colors.foreground : colors.mutedForeground },
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>
              {completionPct < 100 && (
                <View style={[styles.completionHint, { backgroundColor: colors.tealLight, borderColor: colors.teal + "40" }]}>
                  <Feather name="info" size={13} color={colors.teal} />
                  <Text style={[styles.completionHintText, { color: colors.slate }]}>
                    {`${checklist.filter(c => !c.done).length} section${checklist.filter(c => !c.done).length !== 1 ? "s" : ""} not yet complete — the file will export with what you have.`}
                  </Text>
                </View>
              )}
            </View>

            <DisclaimerBanner />

            {/* Export button */}
            <Pressable
              onPress={handleExport}
              disabled={isExporting}
              style={({ pressed }) => [
                styles.exportBtn,
                { backgroundColor: colors.gold, opacity: pressed ? 0.85 : isExporting ? 0.7 : 1 },
              ]}
            >
              {isExporting ? (
                <View style={styles.exportBtnInner}>
                  <Feather name="loader" size={18} color="#FFFFFF" />
                  <Text style={styles.exportBtnText}>Generating PDF…</Text>
                </View>
              ) : (
                <View style={styles.exportBtnInner}>
                  <Feather name="share" size={18} color="#FFFFFF" />
                  <Text style={styles.exportBtnText}>
                    {Platform.OS === "web" ? "Open PDF in Browser" : "Share PDF File"}
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Info box */}
            <View style={[styles.noteBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Text style={[styles.noteTitle, { color: colors.foreground }]}>What you'll get</Text>
              <Text style={[styles.noteText, { color: colors.mutedForeground }]}>
                {Platform.OS === "web"
                  ? "• An HTML file will open in a new tab — use your browser's Print → Save as PDF option.\n• All sections are formatted for clean printing."
                  : "• A professionally formatted PDF file ready to share.\n• Opens in your device's share sheet — save, email, or send to your lawyer.\n• AI-generated sections are clearly labeled throughout."}
              </Text>
            </View>

            <View style={[styles.warningBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="shield" size={14} color={colors.mutedForeground} />
              <Text style={[styles.warningText, { color: colors.mutedForeground }]}>
                Review carefully before sharing. AI outputs may contain errors. Consult a legal professional before submitting this to any authority or agency.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 14, paddingBottom: 60 },

  emptyState: {
    alignItems: "center",
    padding: 40,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    gap: 14,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 16, fontFamily: "DMSans_600SemiBold", textAlign: "center" },
  emptyText: { fontSize: 13, fontFamily: "DMSans_400Regular", textAlign: "center", lineHeight: 19 },

  casePreview: {
    borderRadius: 16,
    padding: 18,
    overflow: "hidden",
  },
  casePreviewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: {
    fontSize: 10,
    fontFamily: "DMSans_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "rgba(255,255,255,0.55)",
    marginBottom: 4,
  },
  previewTitle: {
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  previewType: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: "rgba(255,255,255,0.7)",
  },
  completionCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  completionPct: {
    fontSize: 15,
    fontFamily: "Raleway_700Bold",
  },
  completionLabel: {
    fontSize: 8,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
  },

  checklistCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  checklistTitle: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  checklistRows: { gap: 9 },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkLabel: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    flex: 1,
  },
  completionHint: {
    flexDirection: "row",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "flex-start",
    marginTop: 4,
  },
  completionHintText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    lineHeight: 17,
  },

  exportBtn: {
    borderRadius: 14,
    paddingVertical: 17,
    shadowColor: "#C9A227",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  exportBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  exportBtnText: {
    color: "#FFFFFF",
    fontFamily: "Raleway_700Bold",
    fontSize: 16,
    letterSpacing: -0.2,
  },

  noteBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  noteTitle: { fontSize: 13, fontFamily: "DMSans_600SemiBold" },
  noteText: { fontSize: 12, fontFamily: "DMSans_400Regular", lineHeight: 19 },

  warningBox: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    lineHeight: 17,
  },
});

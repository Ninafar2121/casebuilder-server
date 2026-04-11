import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Case,
  Evidence,
  TimelineEvent,
  generateId,
  loadCases,
  loadEvidence,
  loadTimeline,
  saveCases,
  saveEvidence,
  saveTimeline,
} from "@/lib/storage";
import { getJurisdictionDisplayName } from "@/lib/legalKnowledge";
import { countryCodeToName } from "@/lib/legalJurisdictions";
import { LEGAL_CONTEXT_VERSION, ANALYSIS_MODE_LABEL } from "@/lib/buildLegalAnalysisPrompt";

interface CaseContextValue {
  cases: Case[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  activeCase: Case | null;
  setActiveCase: (c: Case | null) => void;
  createCase: (data: Partial<Case>) => Case;
  updateCase: (id: string, data: Partial<Case>) => void;
  deleteCase: (id: string) => void;
  addEvidence: (data: Partial<Evidence>) => Evidence;
  updateEvidence: (id: string, data: Partial<Evidence>) => void;
  deleteEvidence: (id: string) => void;
  addTimelineEvent: (data: Partial<TimelineEvent>) => TimelineEvent;
  updateTimelineEvent: (id: string, data: Partial<TimelineEvent>) => void;
  deleteTimelineEvent: (id: string) => void;
  getCaseEvidence: (caseId: string) => Evidence[];
  getCaseTimeline: (caseId: string) => TimelineEvent[];
  isLoading: boolean;
}

const CaseContext = createContext<CaseContextValue | null>(null);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<Case[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [c, e, t] = await Promise.all([loadCases(), loadEvidence(), loadTimeline()]);
      setCases(c);
      setEvidence(e);
      setTimeline(t);
      setIsLoading(false);
    }
    load();
  }, []);

  const createCase = (data: Partial<Case>): Case => {
    const country = data.country || "US";
    const region = country === "CA" ? (data.province || "") : (data.state || "");
    const newCase: Case = {
      id: generateId(),
      title: data.title || "Untitled Case",
      description: data.description || "",
      disputeType: data.disputeType || "General Dispute",
      status: "active",
      country,
      province: data.province,
      state: data.state,
      jurisdictionDisplayName: data.jurisdictionDisplayName || getJurisdictionDisplayName(country, region),
      jurisdictionCountry: data.jurisdictionCountry || countryCodeToName(country),
      jurisdictionRegion: data.jurisdictionRegion || region,
      legalTopicCategory: data.legalTopicCategory ?? null,
      legalContextVersion: LEGAL_CONTEXT_VERSION,
      analysisMode: "jurisdiction_guided",
      parties: data.parties || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    const updated = [newCase, ...cases];
    setCases(updated);
    saveCases(updated);
    return newCase;
  };

  const updateCase = (id: string, data: Partial<Case>) => {
    const updated = cases.map(c =>
      c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
    );
    setCases(updated);
    saveCases(updated);
    if (activeCase?.id === id) {
      setActiveCase(updated.find(c => c.id === id) || null);
    }
  };

  const deleteCase = (id: string) => {
    const updatedCases = cases.filter(c => c.id !== id);
    const updatedEvidence = evidence.filter(e => e.caseId !== id);
    const updatedTimeline = timeline.filter(t => t.caseId !== id);
    setCases(updatedCases);
    setEvidence(updatedEvidence);
    setTimeline(updatedTimeline);
    saveCases(updatedCases);
    saveEvidence(updatedEvidence);
    saveTimeline(updatedTimeline);
    if (activeCase?.id === id) setActiveCase(null);
  };

  const addEvidence = (data: Partial<Evidence>): Evidence => {
    const newEvidence: Evidence = {
      id: generateId(),
      caseId: data.caseId || "",
      type: data.type || "note",
      name: data.name || "Evidence",
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      ...data,
    };
    const updated = [...evidence, newEvidence];
    setEvidence(updated);
    saveEvidence(updated);
    return newEvidence;
  };

  const updateEvidence = (id: string, data: Partial<Evidence>) => {
    const updated = evidence.map(e => e.id === id ? { ...e, ...data } : e);
    setEvidence(updated);
    saveEvidence(updated);
  };

  const deleteEvidence = (id: string) => {
    const updated = evidence.filter(e => e.id !== id);
    setEvidence(updated);
    saveEvidence(updated);
  };

  const addTimelineEvent = (data: Partial<TimelineEvent>): TimelineEvent => {
    const newEvent: TimelineEvent = {
      id: generateId(),
      caseId: data.caseId || "",
      date: data.date || new Date().toISOString().split("T")[0],
      title: data.title || "Event",
      description: data.description || "",
      evidenceIds: data.evidenceIds || [],
      importance: data.importance || "medium",
      createdAt: new Date().toISOString(),
      ...data,
    };
    const updated = [...timeline, newEvent].sort((a, b) => a.date.localeCompare(b.date));
    setTimeline(updated);
    saveTimeline(updated);
    return newEvent;
  };

  const updateTimelineEvent = (id: string, data: Partial<TimelineEvent>) => {
    const updated = timeline.map(t => t.id === id ? { ...t, ...data } : t)
      .sort((a, b) => a.date.localeCompare(b.date));
    setTimeline(updated);
    saveTimeline(updated);
  };

  const deleteTimelineEvent = (id: string) => {
    const updated = timeline.filter(t => t.id !== id);
    setTimeline(updated);
    saveTimeline(updated);
  };

  const getCaseEvidence = (caseId: string) => evidence.filter(e => e.caseId === caseId);
  const getCaseTimeline = (caseId: string) => timeline.filter(t => t.caseId === caseId);

  return (
    <CaseContext.Provider value={{
      cases, evidence, timeline, activeCase, setActiveCase,
      createCase, updateCase, deleteCase,
      addEvidence, updateEvidence, deleteEvidence,
      addTimelineEvent, updateTimelineEvent, deleteTimelineEvent,
      getCaseEvidence, getCaseTimeline,
      isLoading,
    }}>
      {children}
    </CaseContext.Provider>
  );
}

export function useCases() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCases must be used within CaseProvider");
  return ctx;
}

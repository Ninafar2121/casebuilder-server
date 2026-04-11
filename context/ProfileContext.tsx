import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, loadProfile, saveProfile } from "@/lib/storage";
import { setProfileTheme } from "@/hooks/useColors";

interface ProfileContextValue {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    onboardingComplete: false,
    disclaimerAccepted: false,
    language: "en",
    theme: "system",
    textSize: "medium",
    highContrast: false,
    readAloud: false,
    stepByStep: false,
    tier: "free",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile().then(p => {
      setProfile(p);
      setProfileTheme(p.theme ?? "system");
      setIsLoading(false);
    });
  }, []);

  const updateProfile = (data: Partial<UserProfile>) => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    saveProfile(updated);
    if (data.theme !== undefined) {
      setProfileTheme(data.theme);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}

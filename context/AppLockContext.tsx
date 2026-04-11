import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";

const LOCK_ENABLED_KEY = "@casebuilder:app_lock_enabled";
const AUTO_LOCK_MINUTES_KEY = "@casebuilder:auto_lock_minutes";
const DEFAULT_AUTO_LOCK_MINUTES = 5;

interface AppLockContextValue {
  isLocked: boolean;
  lockEnabled: boolean;
  autoLockMinutes: number;
  hasBiometrics: boolean;
  isAuthenticating: boolean;
  setLockEnabled: (enabled: boolean) => Promise<void>;
  setAutoLockMinutes: (minutes: number) => Promise<void>;
  authenticate: () => Promise<boolean>;
  lock: () => void;
}

const AppLockContext = createContext<AppLockContextValue | null>(null);

export function AppLockProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false);
  const [lockEnabled, setLockEnabledState] = useState(false);
  const [autoLockMinutes, setAutoLockMinutesState] = useState(DEFAULT_AUTO_LOCK_MINUTES);
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [ready, setReady] = useState(false);

  const lastActiveRef = useRef<number>(Date.now());
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    async function init() {
      const [enabledRaw, minutesRaw, hasHardware, enrolled] = await Promise.all([
        AsyncStorage.getItem(LOCK_ENABLED_KEY),
        AsyncStorage.getItem(AUTO_LOCK_MINUTES_KEY),
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);

      const enabled = enabledRaw === "true";
      const minutes = minutesRaw ? parseInt(minutesRaw, 10) : DEFAULT_AUTO_LOCK_MINUTES;

      setLockEnabledState(enabled);
      setAutoLockMinutesState(minutes);
      setHasBiometrics(hasHardware && enrolled);

      if (enabled) {
        setIsLocked(true);
      }

      setReady(true);
    }
    init();
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!hasBiometrics) return true;
    setIsAuthenticating(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock CaseBuilder AI",
        fallbackLabel: "Use Device Passcode",
        disableDeviceFallback: false,
        cancelLabel: "Cancel",
      });
      if (result.success) {
        setIsLocked(false);
        lastActiveRef.current = Date.now();
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [hasBiometrics]);

  const lock = useCallback(() => {
    if (lockEnabled) setIsLocked(true);
  }, [lockEnabled]);

  useEffect(() => {
    if (!ready || !lockEnabled) return;

    const sub = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;

      if (nextState === "active" && (prev === "background" || prev === "inactive")) {
        const elapsed = (Date.now() - lastActiveRef.current) / 1000 / 60;
        if (elapsed >= autoLockMinutes) {
          setIsLocked(true);
        }
      }

      if (nextState === "background" || nextState === "inactive") {
        lastActiveRef.current = Date.now();
      }
    });

    return () => sub.remove();
  }, [ready, lockEnabled, autoLockMinutes]);

  const setLockEnabled = useCallback(async (enabled: boolean) => {
    await AsyncStorage.setItem(LOCK_ENABLED_KEY, enabled ? "true" : "false");
    setLockEnabledState(enabled);
    if (!enabled) setIsLocked(false);
  }, []);

  const setAutoLockMinutes = useCallback(async (minutes: number) => {
    await AsyncStorage.setItem(AUTO_LOCK_MINUTES_KEY, String(minutes));
    setAutoLockMinutesState(minutes);
  }, []);

  return (
    <AppLockContext.Provider
      value={{
        isLocked,
        lockEnabled,
        autoLockMinutes,
        hasBiometrics,
        isAuthenticating,
        setLockEnabled,
        setAutoLockMinutes,
        authenticate,
        lock,
      }}
    >
      {children}
    </AppLockContext.Provider>
  );
}

export function useAppLock() {
  const ctx = useContext(AppLockContext);
  if (!ctx) throw new Error("useAppLock must be used within AppLockProvider");
  return ctx;
}

import * as SecureStore from "expo-secure-store";

const PROMO_KEY = "casebuilder_promo";
const DEVICE_ID_KEY = "casebuilder_device_id";
const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN ?? "casebuilderai.replit.app"}`;

export interface PromoAccess {
  expiresAt: string;
  label: string;
}

async function getDeviceId(): Promise<string> {
  let id = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
  }
  return id;
}

export async function redeemPromoCode(code: string): Promise<{ success: boolean; message: string; access?: PromoAccess }> {
  const deviceId = await getDeviceId();
  const res = await fetch(`${API_BASE}/api/promo/redeem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: code.trim().toUpperCase(), deviceId }),
  });
  const data = await res.json();
  if (!data.valid) {
    return { success: false, message: data.error ?? "Invalid promo code" };
  }
  const access: PromoAccess = { expiresAt: data.expiresAt, label: data.label };
  await SecureStore.setItemAsync(PROMO_KEY, JSON.stringify(access));
  return { success: true, message: `${data.label} activated!`, access };
}

export async function getPromoAccess(): Promise<PromoAccess | null> {
  try {
    const raw = await SecureStore.getItemAsync(PROMO_KEY);
    if (!raw) return null;
    const access: PromoAccess = JSON.parse(raw);
    if (new Date(access.expiresAt) < new Date()) {
      await SecureStore.deleteItemAsync(PROMO_KEY);
      return null;
    }
    return access;
  } catch {
    return null;
  }
}

export async function clearPromoAccess(): Promise<void> {
  await SecureStore.deleteItemAsync(PROMO_KEY);
}

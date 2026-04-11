import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const WEB_STORAGE_KEY = "casebuilder_encrypted_store";

function simpleXOR(text: string, key: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
}

function simpleXORDecrypt(encoded: string, key: string): string {
  try {
    const text = atob(encoded);
    let result = "";
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch {
    return encoded;
  }
}

const ENCRYPTION_KEY_NAME = "casebuilder_enc_key";

async function getOrCreateEncryptionKey(): Promise<string> {
  if (Platform.OS === "web") {
    let key = localStorage.getItem(ENCRYPTION_KEY_NAME);
    if (!key) {
      key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
      localStorage.setItem(ENCRYPTION_KEY_NAME, key);
    }
    return key;
  }

  try {
    let key = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
    if (!key) {
      key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
      await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, key);
    }
    return key;
  } catch {
    return "casebuilder-fallback-key-2025";
  }
}

export async function encryptData(data: string): Promise<string> {
  try {
    const key = await getOrCreateEncryptionKey();
    return simpleXOR(data, key);
  } catch {
    return data;
  }
}

export async function decryptData(encrypted: string): Promise<string> {
  try {
    const key = await getOrCreateEncryptionKey();
    return simpleXORDecrypt(encrypted, key);
  } catch {
    return encrypted;
  }
}

export async function secureSet(storageKey: string, value: string): Promise<void> {
  const encrypted = await encryptData(value);
  if (Platform.OS === "web") {
    try {
      const store = JSON.parse(localStorage.getItem(WEB_STORAGE_KEY) || "{}");
      store[storageKey] = encrypted;
      localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(store));
    } catch {}
    return;
  }
  try {
    await SecureStore.setItemAsync(storageKey, encrypted, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch {
    const { default: AsyncStorage } = await import("@react-native-async-storage/async-storage");
    await AsyncStorage.setItem(`sec_${storageKey}`, encrypted);
  }
}

export async function secureGet(storageKey: string): Promise<string | null> {
  let encrypted: string | null = null;
  if (Platform.OS === "web") {
    try {
      const store = JSON.parse(localStorage.getItem(WEB_STORAGE_KEY) || "{}");
      encrypted = store[storageKey] ?? null;
    } catch {}
  } else {
    try {
      encrypted = await SecureStore.getItemAsync(storageKey);
    } catch {
      const { default: AsyncStorage } = await import("@react-native-async-storage/async-storage");
      encrypted = await AsyncStorage.getItem(`sec_${storageKey}`);
    }
  }
  if (!encrypted) return null;
  return decryptData(encrypted);
}

export async function secureDelete(storageKey: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      const store = JSON.parse(localStorage.getItem(WEB_STORAGE_KEY) || "{}");
      delete store[storageKey];
      localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(store));
    } catch {}
    return;
  }
  try {
    await SecureStore.deleteItemAsync(storageKey);
  } catch {
    const { default: AsyncStorage } = await import("@react-native-async-storage/async-storage");
    await AsyncStorage.removeItem(`sec_${storageKey}`);
  }
}

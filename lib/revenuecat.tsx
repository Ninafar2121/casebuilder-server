import React, { createContext, useContext } from "react";
import { Platform } from "react-native";
import Purchases, { CustomerInfo, PurchasesPackage } from "react-native-purchases";
import { useMutation, useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";

const REVENUECAT_TEST_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY;
const REVENUECAT_IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? "appl_BHeATwhfMgftFQYHROmqFoYAvjc";
const REVENUECAT_ANDROID_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;

export const ENTITLEMENT_BASIC = "basic";
export const ENTITLEMENT_PLUS = "plus";
export const ENTITLEMENT_PRO = "pro";

export const PACKAGE_BASIC = "$rc_monthly";
export const PACKAGE_PLUS = "plus_monthly";
export const PACKAGE_PRO = "pro_monthly";

export const PRODUCT_ID_BASIC = "com.casebuilderai.pro.monthly.299";
export const PRODUCT_ID_PLUS = "com.casebuilderai.plus.monthly";
export const PRODUCT_ID_PRO = "com.casebuilderai.pro.monthly";

export type AppTier = "free" | "basic" | "plus" | "pro";
const TIER_ORDER: AppTier[] = ["free", "basic", "plus", "pro"];

function getRevenueCatApiKey(): string {
  if (Platform.OS === "ios") {
    const key = REVENUECAT_IOS_API_KEY ?? REVENUECAT_TEST_API_KEY;
    if (!key) throw new Error("RevenueCat iOS API Key not found");
    return key;
  }
  if (Platform.OS === "android") {
    const key = REVENUECAT_ANDROID_API_KEY ?? REVENUECAT_TEST_API_KEY;
    if (!key) throw new Error("RevenueCat Android API Key not found");
    return key;
  }
  const key = REVENUECAT_TEST_API_KEY ?? REVENUECAT_IOS_API_KEY;
  if (!key) throw new Error("RevenueCat API Key not found");
  return key;
}

export function initializeRevenueCat() {
  const apiKey = getRevenueCatApiKey();
  Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey });
  console.log("Configured RevenueCat");
}

function deriveTier(customerInfo: CustomerInfo | undefined): AppTier {
  if (!customerInfo) return "free";
  const entitlements = customerInfo.entitlements.active;
  if (entitlements[ENTITLEMENT_PRO]) return "pro";
  if (entitlements[ENTITLEMENT_PLUS]) return "plus";
  if (entitlements[ENTITLEMENT_BASIC]) return "basic";
  return "free";
}

function checkAccess(activeTier: AppTier, required: "basic" | "plus" | "pro"): boolean {
  return TIER_ORDER.indexOf(activeTier) >= TIER_ORDER.indexOf(required);
}

function useSubscriptionContext() {
  const customerInfoQuery = useQuery({
    queryKey: ["revenuecat", "customer-info"],
    queryFn: async () => {
      const info = await Purchases.getCustomerInfo();
      return info;
    },
    staleTime: 60 * 1000,
  });

  const offeringsQuery = useQuery({
    queryKey: ["revenuecat", "offerings"],
    queryFn: async () => {
      const offerings = await Purchases.getOfferings();
      return offerings;
    },
    staleTime: 300 * 1000,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (pkg: PurchasesPackage) => {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return customerInfo;
    },
    onSuccess: () => customerInfoQuery.refetch(),
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      return Purchases.restorePurchases();
    },
    onSuccess: () => customerInfoQuery.refetch(),
  });

  const activeTier = deriveTier(customerInfoQuery.data);
  const isSubscribed = activeTier !== "free";

  const packages = offeringsQuery.data?.current?.availablePackages ?? [];
  const basicPackage = packages.find((p) => p.identifier === PACKAGE_BASIC) ?? packages[0] ?? null;
  const plusPackage = packages.find((p) => p.identifier === PACKAGE_PLUS) ?? null;
  const proPackage = packages.find((p) => p.identifier === PACKAGE_PRO) ?? null;

  return {
    customerInfo: customerInfoQuery.data,
    offerings: offeringsQuery.data,
    packages,
    basicPackage,
    plusPackage,
    proPackage,
    activeTier,
    isSubscribed,
    isLoading: customerInfoQuery.isLoading || offeringsQuery.isLoading,
    hasAccessTo: (required: "basic" | "plus" | "pro") => checkAccess(activeTier, required),
    purchase: purchaseMutation.mutateAsync,
    restore: restoreMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
    isRestoring: restoreMutation.isPending,
    refetchCustomerInfo: customerInfoQuery.refetch,
  };
}

type SubscriptionContextValue = ReturnType<typeof useSubscriptionContext>;
const Context = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const value = useSubscriptionContext();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSubscription() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useSubscription must be used within a SubscriptionProvider");
  return ctx;
}

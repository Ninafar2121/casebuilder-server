import { useSubscription } from "@/lib/revenuecat";

export function useAccess() {
  const sub = useSubscription();

  return {
    ...sub,
    hasPromo: true,
    isPremium: true,
    hasAccessTo: (_required: "basic" | "plus" | "pro"): boolean => true,
  };
}

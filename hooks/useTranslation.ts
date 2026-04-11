import { useProfile } from "@/context/ProfileContext";
import { getTranslations, TranslationKey } from "@/lib/i18n";

export function useTranslation() {
  const { profile } = useProfile();
  const lang = profile.language ?? "en";
  const strings = getTranslations(lang);

  function t(key: TranslationKey): string {
    return (strings as Record<string, string>)[key] ?? (getTranslations("en") as Record<string, string>)[key] ?? key;
  }

  return { t, lang };
}

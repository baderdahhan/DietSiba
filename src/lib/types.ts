// Localized text stored in Supabase JSONB columns. Tiers are only
// maintained in English and Arabic; other locales fall back to English.
export type LocalizedText = { en: string; ar: string } & Partial<Record<string, string>>;

export type Tier = {
  id: string;
  slug: string;
  name: LocalizedText;
  price: number;
  currency: string;
  features: LocalizedText[];
};

/** Resolve a localized string for the given locale, falling back to English. */
export function localized(text: LocalizedText | null | undefined, locale: string): string {
  if (!text) return '';
  return text[locale] || text.en || '';
}

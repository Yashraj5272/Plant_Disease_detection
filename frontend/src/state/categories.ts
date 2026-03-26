export type Lang = "en" | "mr" | "hi";

export type Category = {
  key: string;
  emoji: string;
  title: Record<Lang, string>;
};

export const CATEGORIES: readonly Category[] = [
  {
    key: "crop",
    emoji: "🌱",
    title: { en: "Crop Management", mr: "पीक व्यवस्थापन", hi: "फसल प्रबंधन" },
  },
  {
    key: "livestock",
    emoji: "🐄",
    title: { en: "Livestock Care", mr: "पशुधन काळजी", hi: "पशुधन देखभाल" },
  },
  {
    key: "pest",
    emoji: "🪲",
    title: { en: "Pest Control", mr: "किड नियंत्रण", hi: "कीट नियंत्रण" },
  },
  {
    key: "soil",
    emoji: "🌿",
    title: { en: "Soil Health", mr: "माती आरोग्य", hi: "मिट्टी स्वास्थ्य" },
  },
  {
    key: "weather",
    emoji: "🌦️",
    title: { en: "Weather & Climate", mr: "हवामान", hi: "मौसम" },
  },
  {
    key: "irrigation",
    emoji: "💧",
    title: { en: "Irrigation", mr: "सिंचन", hi: "सिंचाई" },
  },
  {
    key: "equipment",
    emoji: "🚜",
    title: { en: "Equipment", mr: "उपकरणे", hi: "उपकरण" },
  },
  {
    key: "market",
    emoji: "🪙",
    title: { en: "Market Prices", mr: "बाजारभाव", hi: "बाजार भाव" },
  },
] as const;

// ✅ used in other pages
export function categoryByKey(key: string) {
  return CATEGORIES.find((c) => c.key === key);
}

// ✅ single safe function to show title
export function categoryTitle(c: Category | undefined, lang: Lang) {
  return c?.title?.[lang] ?? c?.title?.en ?? "";
}
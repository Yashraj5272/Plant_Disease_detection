const memoryCache = new Map<string, string>();

function getCacheKey(text: string, lang: string) {
  return `farmassist_translate_${lang}_${text}`;
}

export async function translateText(text: string, lang: string): Promise<string> {
  if (!text) return "";
  if (lang === "en") return text;

  const trimmed = text.trim();
  if (!trimmed) return "";

  const cacheKey = getCacheKey(trimmed, lang);

  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  const stored = localStorage.getItem(cacheKey);
  if (stored) {
    memoryCache.set(cacheKey, stored);
    return stored;
  }

  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(
        trimmed
      )}`
    );

    if (!res.ok) {
      return text;
    }

    const data = await res.json();

    const translated =
      Array.isArray(data?.[0])
        ? data[0].map((item: any) => item?.[0] ?? "").join("")
        : text;

    const finalText = translated || text;

    memoryCache.set(cacheKey, finalText);
    localStorage.setItem(cacheKey, finalText);

    return finalText;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}
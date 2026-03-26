import { useEffect, useState } from "react";

export type Lang = "en" | "mr" | "hi";

const KEY = "farmassist_lang";
const DEFAULT_LANG: Lang = "en";

export function getLang(): Lang {
  const v = localStorage.getItem(KEY);

  // ✅ support all languages
  if (v === "mr") return "mr";
  if (v === "hi") return "hi";
  return DEFAULT_LANG;
}

export function setLang(lang: Lang) {
  localStorage.setItem(KEY, lang);
  window.dispatchEvent(new Event("farmassist_lang_change"));
}

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>(getLang());

  useEffect(() => {
    const onChange = () => setLangState(getLang());
    window.addEventListener("farmassist_lang_change", onChange);

    // ✅ sync between multiple tabs/windows too
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setLangState(getLang());
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("farmassist_lang_change", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return [lang, setLang];
}
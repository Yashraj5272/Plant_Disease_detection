import { useLang } from "../state/lang";

export default function Header() {
  const [lang, setLang] = useLang();

  const t = {
    brandSub:
      lang === "mr"
        ? "शेतकरी प्रश्न समर्थन आणि सल्ला"
        : lang === "hi"
        ? "किसान प्रश्न सहायता और सलाह"
        : "Farmer Query Support & Advisory",

    langLabel:
      lang === "mr"
        ? "भाषा"
        : lang === "hi"
        ? "भाषा"
        : "Language",

    en: "English",
    mr: "मराठी",
    hi: "हिंदी",
  };

  return (
    <header className="header">
      <div
        className="headerInner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div className="brand">
          <span className="logo">🌾</span>
          <div>
            <div className="brandTitle">FarmAssist AI</div>
            <div className="brandSub">{t.brandSub}</div>
          </div>
        </div>

        {/* Language Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="muted small" style={{ fontWeight: 800 }}>
            {t.langLabel}
          </div>

          <div
            style={{
              display: "inline-flex",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 999,
              overflow: "hidden",
              background: "rgba(255,255,255,0.85)",
            }}
          >
            <button
              className="btnSmall"
              onClick={() => setLang("en")}
              style={{
                border: "0",
                borderRadius: 0,
                fontWeight: 900,
                background:
                  lang === "en"
                    ? "rgba(22,163,74,0.14)"
                    : "transparent",
              }}
            >
              {t.en}
            </button>

            <button
              className="btnSmall"
              onClick={() => setLang("mr")}
              style={{
                border: "0",
                borderRadius: 0,
                fontWeight: 900,
                background:
                  lang === "mr"
                    ? "rgba(22,163,74,0.14)"
                    : "transparent",
              }}
            >
              {t.mr}
            </button>

            <button
              className="btnSmall"
              onClick={() => setLang("hi")}
              style={{
                border: "0",
                borderRadius: 0,
                fontWeight: 900,
                background:
                  lang === "hi"
                    ? "rgba(22,163,74,0.14)"
                    : "transparent",
              }}
            >
              {t.hi}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
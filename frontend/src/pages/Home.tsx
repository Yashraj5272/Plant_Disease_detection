import { useNavigate } from "react-router-dom";
import { useFarm } from "../state/FarmContext";
import { CATEGORIES } from "../state/categories";
import { useLang } from "../state/lang";

type Lang = "en" | "mr" | "hi";

type CategoryItem = {
  key: string;
  emoji: string;
  title?: Partial<Record<Lang, string>>;
};

export default function Home() {
  const nav = useNavigate();
  const { queries } = useFarm();
  const [lang] = useLang();

  const total = queries.length;
  const pending = queries.filter((q) => q.status === "Pending").length;
  const answered = total - pending;
  const recent = queries.slice(0, 3);

  const TEXT: Record<string, Record<Lang, string>> = {
    heroTitle: {
      en: "AI Farming Advisory",
      mr: "AI शेती सल्ला",
      hi: "AI कृषि सलाह",
    },
    heroSub: {
      en: "Ask farming questions and get quick guidance in seconds. Get help on crop diseases, irrigation, soil health, pests, market prices and more.",
      mr: "शेतीविषयक प्रश्न विचारा आणि सेकंदात मार्गदर्शन मिळवा. पिकांचे रोग, सिंचन, माती आरोग्य, किडी, बाजारभाव इत्यादींवर मदत मिळवा.",
      hi: "कृषि प्रश्न पूछें और सेकंडों में मार्गदर्शन पाएं। फसल रोग, सिंचाई, मिट्टी स्वास्थ्य, कीट, बाजार भाव आदि पर सहायता लें।",
    },
    askBtn: {
      en: "Ask a Question",
      mr: "प्रश्न विचारा",
      hi: "प्रश्न पूछें",
    },
    detectBtn: {
      en: "Detect Disease",
      mr: "रोग ओळखा",
      hi: "रोग पहचानें",
    },
    libraryBtn: {
      en: "Open Library",
      mr: "लायब्ररी उघडा",
      hi: "लाइब्रेरी खोलें",
    },
    totalQueries: {
      en: "Total Queries",
      mr: "एकूण प्रश्न",
      hi: "कुल प्रश्न",
    },
    pending: {
      en: "Pending",
      mr: "प्रलंबित",
      hi: "लंबित",
    },
    answered: {
      en: "Answered",
      mr: "उत्तर दिले",
      hi: "उत्तर दिया",
    },
    quickCategories: {
      en: "Quick Categories",
      mr: "त्वरित विभाग",
      hi: "त्वरित श्रेणियाँ",
    },
    recentQueries: {
      en: "Recent Queries",
      mr: "अलीकडचे प्रश्न",
      hi: "हाल के प्रश्न",
    },
    noQueries: {
      en: "No queries yet. Ask your first question!",
      mr: "अजून प्रश्न नाहीत. तुमचा पहिला प्रश्न विचारा!",
      hi: "अभी तक कोई प्रश्न नहीं। अपना पहला प्रश्न पूछें!",
    },
    howItWorks: {
      en: "How it Works",
      mr: "कसे कार्य करते",
      hi: "यह कैसे काम करता है",
    },
    step1Title: {
      en: "Choose category",
      mr: "विभाग निवडा",
      hi: "श्रेणी चुनें",
    },
    step1Sub: {
      en: "Crop, pests, soil, irrigation, and more.",
      mr: "पीक, किडी, माती, सिंचन इत्यादी.",
      hi: "फसल, कीट, मिट्टी, सिंचाई आदि।",
    },
    step2Title: {
      en: "Ask your query",
      mr: "तुमचा प्रश्न विचारा",
      hi: "अपना प्रश्न लिखें",
    },
    step2Sub: {
      en: "Write symptoms, crop age, location.",
      mr: "लक्षणे, पिकाचे वय, ठिकाण लिहा.",
      hi: "लक्षण, फसल की उम्र, स्थान लिखें।",
    },
    step3Title: {
      en: "Get AI guidance",
      mr: "AI मार्गदर्शन मिळवा",
      hi: "AI सलाह पाएं",
    },
    step3Sub: {
      en: "Instant response + helpful next steps.",
      mr: "त्वरित उत्तर + पुढील उपयुक्त पावले.",
      hi: "तुरंत उत्तर + उपयोगी अगले कदम।",
    },
  };

  const tr = (key: keyof typeof TEXT) => TEXT[key][lang] ?? TEXT[key].en;

  const statusText = (status: string) => {
    if (status === "Answered") return tr("answered");
    return tr("pending");
  };

  const catTitle = (c: CategoryItem) => c.title?.[lang] ?? c.title?.en ?? "";

  return (
    <div className="homeBg">
      {/* HERO */}
      <section className="homeHero">
        <div>
          <h1>{tr("heroTitle")}</h1>
          <p>{tr("heroSub")}</p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" onClick={() => nav("/ask")}>
              {tr("askBtn")}
            </button>
            <button className="btnOutline" onClick={() => nav("/detect")}>
              {tr("detectBtn")}
            </button>
            <button className="btnOutline" onClick={() => nav("/advisory")}>
              {tr("libraryBtn")}
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="homeStats">
        <div className="statCard">
          <div className="num">{total}</div>
          <div className="label">{tr("totalQueries")}</div>
        </div>
        <div className="statCard">
          <div className="num">{pending}</div>
          <div className="label">{tr("pending")}</div>
        </div>
        <div className="statCard">
          <div className="num">{answered}</div>
          <div className="label">{tr("answered")}</div>
        </div>
      </section>

      {/* QUICK CATEGORIES */}
      <h2 className="homeSectionTitle">{tr("quickCategories")}</h2>
      <div className="quickCats">
        {CATEGORIES.map((c: CategoryItem) => (
          <button
            key={c.key}
            className="quickCatBtn"
            onClick={() => nav(`/ask?cat=${c.key}`)}
          >
            <span className="quickCatEmoji">{c.emoji}</span>
            <span className="quickCatText">{catTitle(c)}</span>
          </button>
        ))}
      </div>

      {/* RECENT QUERIES */}
      <h2 className="homeSectionTitle">{tr("recentQueries")}</h2>
      <div className="recentCard">
        {recent.length === 0 ? (
          <div style={{ padding: 16 }} className="muted">
            {tr("noQueries")}
          </div>
        ) : (
          recent.map((q) => (
            <div
              key={q.id}
              className="recentRow"
              onClick={() => nav(`/queries/${q.id}`)}
            >
              <div style={{ minWidth: 0 }}>
                <div className="recentTitle">
                  {q.question.length > 70
                    ? q.question.slice(0, 70) + "..."
                    : q.question}
                </div>
                <div className="recentMeta">
                  {new Date(q.createdAt).toLocaleString()}
                </div>
              </div>

              <span
                className={
                  "statusPill " +
                  (q.status === "Answered" ? "answered" : "pending")
                }
              >
                {statusText(q.status)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* HOW IT WORKS */}
      <h2 className="homeSectionTitle">{tr("howItWorks")}</h2>
      <div className="grid3">
        <div className="card" style={{ borderRadius: 18 }}>
          <div
            style={{
              display: "inline-flex",
              width: 38,
              height: 38,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 1000,
              background: "rgba(22,163,74,.12)",
              border: "1px solid rgba(22,163,74,.18)",
              marginBottom: 10,
            }}
          >
            1
          </div>
          <div className="title">{tr("step1Title")}</div>
          <div className="muted">{tr("step1Sub")}</div>
        </div>

        <div className="card" style={{ borderRadius: 18 }}>
          <div
            style={{
              display: "inline-flex",
              width: 38,
              height: 38,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 1000,
              background: "rgba(22,163,74,.12)",
              border: "1px solid rgba(22,163,74,.18)",
              marginBottom: 10,
            }}
          >
            2
          </div>
          <div className="title">{tr("step2Title")}</div>
          <div className="muted">{tr("step2Sub")}</div>
        </div>

        <div className="card" style={{ borderRadius: 18 }}>
          <div
            style={{
              display: "inline-flex",
              width: 38,
              height: 38,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 1000,
              background: "rgba(22,163,74,.12)",
              border: "1px solid rgba(22,163,74,.18)",
              marginBottom: 10,
            }}
          >
            3
          </div>
          <div className="title">{tr("step3Title")}</div>
          <div className="muted">{tr("step3Sub")}</div>
        </div>
      </div>

      <div style={{ height: 80 }} />
    </div>
  );
}
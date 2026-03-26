import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star } from "lucide-react";
import { ARTICLES } from "../state/advisoryData";
import { useLang } from "../state/lang";

type Lang = "en" | "mr" | "hi";

export default function Advisory() {
  const nav = useNavigate();
  const [lang] = useLang();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const TEXT: Record<string, Record<Lang, string>> = {
    pageTitle: { en: "Advisory Library", mr: "सल्ला लायब्ररी", hi: "सलाह लाइब्रेरी" },
    pageSub: {
      en: "Browse guides and best practices.",
      mr: "मार्गदर्शक आणि उत्तम पद्धती पाहा.",
      hi: "गाइड और सर्वोत्तम तरीके देखें।",
    },
    searchPh: {
      en: "Search articles (tomato, drip, soil...)",
      mr: "लेख शोधा (टोमॅटो, ड्रिप, माती...)",
      hi: "लेख खोजें (टमाटर, ड्रिप, मिट्टी...)",
    },
    allCats: { en: "All Categories", mr: "सर्व विभाग", hi: "सभी श्रेणियाँ" },
    topPicks: { en: "Top picks", mr: "टॉप निवडी", hi: "टॉप चयन" },
    featured: { en: "Featured Resources", mr: "वैशिष्ट्यपूर्ण संसाधने", hi: "विशेष संसाधन" },
    allArticles: { en: "All Articles", mr: "सर्व लेख", hi: "सभी लेख" },
    empty: {
      en: "No articles found. Try another keyword.",
      mr: "लेख सापडले नाहीत. दुसरा शब्द वापरा.",
      hi: "कोई लेख नहीं मिला। दूसरा शब्द आज़माएँ।",
    },
    imgNA: { en: "Image not available", mr: "प्रतिमा उपलब्ध नाही", hi: "छवि उपलब्ध नहीं" },
  };

  const tr = (k: keyof typeof TEXT) => TEXT[k][lang] ?? TEXT[k].en;

  // Build category list from ARTICLES (translated labels)
  const categories = useMemo(() => {
    const set = new Map<string, string>();
    ARTICLES.forEach((a) => {
      const lbl = a.categoryLabel?.[lang] ?? a.categoryLabel?.en ?? a.categoryKey;
      set.set(a.categoryKey, lbl);
    });
    return Array.from(set.entries()).map(([key, label]) => ({ key, label }));
  }, [lang]);

  // Search in current language + tags
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return ARTICLES.filter((a) => {
      const title = a.title?.[lang] ?? a.title?.en ?? "";
      const desc = a.description?.[lang] ?? a.description?.en ?? "";
      const tagText = (a.tags || []).join(" ");

      const hit =
        !query ||
        title.toLowerCase().includes(query) ||
        desc.toLowerCase().includes(query) ||
        tagText.toLowerCase().includes(query);

      const catOk = cat === "all" || a.categoryKey === cat;
      return hit && catOk;
    });
  }, [q, cat, lang]);

  const featured = useMemo(() => {
    const f = filtered.filter((a) => a.featured);
    if (f.length > 0) return f.slice(0, 3);
    return filtered.slice(0, 3);
  }, [filtered]);

  const allArticles = useMemo(() => {
    const featuredIds = new Set(featured.map((a) => a.id));
    return filtered.filter((a) => !featuredIds.has(a.id));
  }, [filtered, featured]);

  return (
    <div className="page">
      <div className="pageHeader">
        <h2>{tr("pageTitle")}</h2>
        <div className="muted">{tr("pageSub")}</div>
      </div>

      <div className="toolbar">
        <div className="searchBox">
          <Search size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr("searchPh")} />
        </div>

        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">{tr("allCats")}</option>
          {categories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>

        <div className="rowInline" style={{ fontWeight: 800, gap: 8 }}>
          <Star size={18} /> {tr("topPicks")}
        </div>
      </div>

      <h3 className="sectionTitle">{tr("featured")}</h3>
      <div className="grid">
        {featured.map((a) => (
          <ArticleCard key={a.id} a={a} onOpen={() => nav(`/advisory/${a.id}`)} lang={lang} imgNA={tr("imgNA")} />
        ))}
      </div>

      <h3 className="sectionTitle">{tr("allArticles")}</h3>
      <div className="grid">
        {allArticles.map((a) => (
          <ArticleCard key={a.id} a={a} onOpen={() => nav(`/advisory/${a.id}`)} lang={lang} imgNA={tr("imgNA")} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty" style={{ marginTop: 12 }}>
          {tr("empty")}
        </div>
      )}
    </div>
  );
}

function ArticleCard({
  a,
  onOpen,
  lang,
  imgNA,
}: {
  a: (typeof ARTICLES)[number];
  onOpen: () => void;
  lang: Lang;
  imgNA: string;
}) {
  const [broken, setBroken] = useState(false);

  const title = a.title?.[lang] ?? a.title?.en ?? "";
  const description = a.description?.[lang] ?? a.description?.en ?? "";
  const categoryLabel = a.categoryLabel?.[lang] ?? a.categoryLabel?.en ?? a.categoryKey;

  return (
    <button className="articleCard card" onClick={onOpen}>
      {!broken && a.image ? (
        <img className="articleImg" src={a.image} alt={title} loading="lazy" onError={() => setBroken(true)} />
      ) : (
        <div
          className="articleImgFallback"
          style={{
            height: 170,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            opacity: 0.8,
          }}
        >
          {imgNA}
        </div>
      )}

      <div className="cardBody">
        <div className="rowBetween">
          <span className="pill" style={{ background: "rgba(22,163,74,0.12)", color: "#14532d" }}>
            {categoryLabel}
          </span>
          <span className="muted small">{a.readTime}</span>
        </div>

        <div className="title">{title}</div>
        <div className="muted" style={{ marginTop: 6 }}>
          {description}
        </div>

        <div className="tagRow">
          {a.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
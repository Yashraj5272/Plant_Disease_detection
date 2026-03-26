import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ARTICLES } from "../state/advisoryData";
import { useLang } from "../state/lang";

type Lang = "en" | "mr" | "hi";

export default function AdvisoryDetail() {
  const nav = useNavigate();
  const { id } = useParams();
  const [lang] = useLang();

  const TEXT: Record<string, Record<Lang, string>> = {
    back: { en: "Back", mr: "मागे", hi: "वापस" },
    notFoundTitle: { en: "Article not found.", mr: "लेख सापडला नाही.", hi: "लेख नहीं मिला।" },
    notFoundSub: {
      en: "The article ID in the URL doesn’t match the IDs in advisoryData.",
      mr: "URL मधील लेख ID advisoryData मधील IDs शी जुळत नाही.",
      hi: "URL वाला लेख ID advisoryData के IDs से मेल नहीं खाता।",
    },
    goLibrary: { en: "Go to Library", mr: "लायब्ररीला जा", hi: "लाइब्रेरी जाएँ" },
    imgNA: { en: "Image not available", mr: "प्रतिमा उपलब्ध नाही", hi: "छवि उपलब्ध नहीं" },
    keyPoints: { en: "Key Points", mr: "महत्त्वाचे मुद्दे", hi: "मुख्य बिंदु" },
    noContent: {
      en: "No content available for this article.",
      mr: "या लेखासाठी सामग्री उपलब्ध नाही.",
      hi: "इस लेख के लिए सामग्री उपलब्ध नहीं है।",
    },
    needHelp: { en: "Need personalized help?", mr: "वैयक्तिक मदत हवी आहे?", hi: "व्यक्तिगत मदद चाहिए?" },
    needHelpSub: {
      en: "Ask your question and get instant guidance.",
      mr: "प्रश्न विचारा आणि त्वरित मार्गदर्शन मिळवा.",
      hi: "अपना प्रश्न पूछें और तुरंत मार्गदर्शन पाएं।",
    },
    askNow: { en: "Ask Now", mr: "आता विचारा", hi: "अभी पूछें" },
  };

  const tr = (k: keyof typeof TEXT) => TEXT[k][lang] ?? TEXT[k].en;

  const article = useMemo(() => {
    if (!id) return undefined;
    return ARTICLES.find((a) => a.id === id);
  }, [id]);

  if (!article) {
    return (
      <div className="page">
        <button className="btnGhost" onClick={() => nav(-1)}>
          <ArrowLeft size={18} /> {tr("back")}
        </button>

        <div className="card" style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>{tr("notFoundTitle")}</div>
          <div className="muted" style={{ marginTop: 6 }}>
            {tr("notFoundSub")}
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => nav("/advisory")}>
              {tr("goLibrary")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const title = article.title?.[lang] ?? article.title?.en ?? "";
  const description = article.description?.[lang] ?? article.description?.en ?? "";
  const categoryLabel = article.categoryLabel?.[lang] ?? article.categoryLabel?.en ?? article.categoryKey;
  const points: string[] = article.content?.[lang] ?? article.content?.en ?? [];

  return (
    <div className="page">
      <button className="btnGhost" onClick={() => nav(-1)}>
        <ArrowLeft size={18} /> {tr("back")}
      </button>

      <div className="detailHero" style={{ marginTop: 12 }}>
        {article.image ? (
          <img
            className="detailImg"
            src={article.image}
            alt={title}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              const next = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (next) next.style.display = "flex";
            }}
          />
        ) : null}

        <div
          className="detailImgFallback"
          style={{
            display: article.image ? "none" : "flex",
            height: 260,
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.18)",
            color: "#fff",
            fontWeight: 900,
          }}
        >
          {tr("imgNA")}
        </div>

        <div className="detailOverlay">
          <div className="row wrap">
            <span className="pill" style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}>
              {categoryLabel}
            </span>
            <span style={{ opacity: 0.9, fontWeight: 800 }}>{article.readTime}</span>
          </div>

          <h2 style={{ margin: "10px 0 0 0" }}>{title}</h2>
          <div style={{ opacity: 0.95, marginTop: 6 }}>{description}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>{tr("keyPoints")}</h3>

        {points.length > 0 ? (
          <ul className="list">
            {points.map((p, i) => (
              <li key={i} style={{ marginBottom: 8 }}>
                {p}
              </li>
            ))}
          </ul>
        ) : (
          <div className="muted">{tr("noContent")}</div>
        )}

        <div className="ctaCard">
          <div>
            <div style={{ fontWeight: 900 }}>{tr("needHelp")}</div>
            <div className="muted">{tr("needHelpSub")}</div>
          </div>
          <button className="btn" onClick={() => nav("/ask")}>
            {tr("askNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
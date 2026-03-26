import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { categoryByKey } from "../state/categories";
import { useFarm } from "../state/FarmContext";
import { toast } from "../components/toast";
import { ArrowLeft, CheckCircle2, Clock, Copy, Share2 } from "lucide-react";
import { useLang } from "../state/lang";
import { translateText } from "../utils/translator";

type Lang = "en" | "mr" | "hi";

export default function QueryDetail() {
  const nav = useNavigate();
  const { id } = useParams();
  const { getById } = useFarm();
  const [lang] = useLang();

  const [translatedQuestion, setTranslatedQuestion] = useState("");
  const [translatedAnswer, setTranslatedAnswer] = useState("");
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const TEXT: Record<string, Record<Lang, string>> = {
    queryNotFound: {
      en: "Query not found",
      mr: "प्रश्न सापडला नाही",
      hi: "प्रश्न नहीं मिला",
    },
    back: { en: "Back", mr: "मागे", hi: "वापस" },

    answered: { en: "Answered", mr: "उत्तर दिले", hi: "उत्तर दिया" },
    pending: { en: "Pending", mr: "प्रलंबित", hi: "लंबित" },

    questionLabel: { en: "Question", mr: "प्रश्न", hi: "प्रश्न" },
    aiAnswerTitle: { en: "AI Answer", mr: "AI उत्तर", hi: "AI उत्तर" },

    copy: { en: "Copy", mr: "कॉपी", hi: "कॉपी" },
    share: { en: "Share", mr: "शेअर", hi: "शेयर" },

    copied: {
      en: "Copied answer!",
      mr: "उत्तर कॉपी झाले!",
      hi: "उत्तर कॉपी हो गया!",
    },
    shared: { en: "Shared!", mr: "शेअर झाले!", hi: "शेयर हो गया!" },
    shareNotSupported: {
      en: "Share not supported, copied instead!",
      mr: "शेअर सपोर्ट नाही, म्हणून कॉपी केले!",
      hi: "शेयर सपोर्ट नहीं है, इसलिए कॉपी कर दिया!",
    },

    preparing: {
      en: "Preparing your answer… (polling updates)",
      mr: "तुमचे उत्तर तयार होत आहे… (अपडेट तपासत आहे)",
      hi: "आपका उत्तर तैयार हो रहा है… (अपडेट चेक कर रहे हैं)",
    },
    usuallyReady: {
      en: "Usually ready in ~2 seconds.",
      mr: "साधारण ~2 सेकंदात तयार होते.",
      hi: "आमतौर पर ~2 सेकंड में तैयार हो जाता है।",
    },

    translating: {
      en: "Translating...",
      mr: "भाषांतर होत आहे...",
      hi: "अनुवाद हो रहा है...",
    },

    disclaimer: {
      en: "Disclaimer: This advice is AI-generated. For severe cases, consult a local agriculture expert.",
      mr: "सूचना: हा सल्ला AI ने तयार केला आहे. गंभीर परिस्थितीत स्थानिक कृषी तज्ञांचा सल्ला घ्या.",
      hi: "सूचना: यह सलाह AI द्वारा बनाई गई है। गंभीर स्थिति में स्थानीय कृषि विशेषज्ञ से सलाह लें।",
    },

    askAnother: {
      en: "Ask another question",
      mr: "दुसरा प्रश्न विचारा",
      hi: "एक और प्रश्न पूछें",
    },
    browseAdvisory: {
      en: "Browse Advisory",
      mr: "सल्ला लायब्ररी पहा",
      hi: "सलाह लाइब्रेरी देखें",
    },
  };

  const tr = (key: keyof typeof TEXT) => TEXT[key][lang] ?? TEXT[key].en;

  const q = id ? getById(id) : undefined;
  const cat = useMemo(() => (q ? categoryByKey(q.category) : null), [q]);

  useEffect(() => {
    let cancelled = false;

    async function runTranslation() {
      if (!q) return;

      if (q.status !== "Answered") {
        setTranslatedQuestion(q.question || "");
        setTranslatedAnswer(q.answer || "");
        return;
      }

      setLoadingTranslation(true);

      try {
        const [qText, aText] = await Promise.all([
          translateText(q.question || "", lang),
          translateText(q.answer || "", lang),
        ]);

        if (!cancelled) {
          setTranslatedQuestion(qText || q.question || "");
          setTranslatedAnswer(aText || q.answer || "");
        }
      } finally {
        if (!cancelled) {
          setLoadingTranslation(false);
        }
      }
    }

    runTranslation();

    return () => {
      cancelled = true;
    };
  }, [q?.question, q?.answer, q?.status, lang]);

  if (!q || !cat) {
    return (
      <div className="card">
        <div className="title">{tr("queryNotFound")}</div>
        <button className="btn" onClick={() => nav("/queries")}>
          {tr("back")}
        </button>
      </div>
    );
  }

  const query = q;
  const isAnswered = query.status === "Answered";

  async function copyAnswer() {
    const textToCopy = translatedAnswer || query.answer;
    if (!textToCopy) return;

    await navigator.clipboard.writeText(textToCopy);
    toast(tr("copied"));
  }

  async function shareAnswer() {
    const questionText = translatedQuestion || query.question;
    const answerText = translatedAnswer || query.answer;

    if (!answerText) return;

    const text = `FarmAssist AI Advice:\n\nQ: ${questionText}\n\nA: ${answerText}`;

    // @ts-ignore
    if (navigator.share) {
      // @ts-ignore
      await navigator.share({ title: "FarmAssist AI", text });
      toast(tr("shared"));
    } else {
      await navigator.clipboard.writeText(text);
      toast(tr("shareNotSupported"));
    }
  }

  const catTitle = (cat.title?.[lang] ?? cat.title?.en ?? "") as string;

  return (
    <div>
      <button className="btnBack" onClick={() => nav(-1)}>
        <ArrowLeft size={18} /> {tr("back")}
      </button>

      <div className="card">
        <div className="rowBetween">
          <div className="title">
            <span className="catEmoji">{cat.emoji}</span> {catTitle}
          </div>

          <span className={"badge " + (isAnswered ? "ok" : "warn")}>
            {isAnswered ? (
              <span className="rowInline">
                <CheckCircle2 size={16} /> {tr("answered")}
              </span>
            ) : (
              <span className="rowInline">
                <Clock size={16} /> {tr("pending")}
              </span>
            )}
          </span>
        </div>

        <div className="questionBox" style={{ marginTop: 12 }}>
          <div className="muted small">{tr("questionLabel")}</div>
          <div className="questionText" style={{ fontWeight: 800 }}>
            {translatedQuestion || query.question}
          </div>
        </div>

        <div
          className={"answerBox " + (isAnswered ? "answered" : "pending")}
          style={{ marginTop: 12 }}
        >
          <div className="rowBetween" style={{ gap: 12, flexWrap: "wrap" }}>
            <div className="title aiAnswerTitle" style={{ fontWeight: 950 }}>
              {tr("aiAnswerTitle")}
            </div>

            {isAnswered && (
              <div className="rowInline" style={{ flexShrink: 0 }}>
                <button className="btnSmall" onClick={copyAnswer}>
                  <Copy size={16} /> {tr("copy")}
                </button>
                <button className="btnSmall" onClick={shareAnswer}>
                  <Share2 size={16} /> {tr("share")}
                </button>
              </div>
            )}
          </div>

          {!isAnswered ? (
            <div className="loading">
              <div className="pulse" />
              <div>
                {tr("preparing")}
                <div className="muted small">{tr("usuallyReady")}</div>
              </div>
            </div>
          ) : (
            <>
              <div
                className="aiAnswer"
                style={{
                  marginTop: 10,
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(0,0,0,0.10)",
                  fontWeight: 700,
                  lineHeight: 1.7,
                  fontSize: 15,
                  color: "#0f172a",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                  maxWidth: "100%",
                }}
              >
                {loadingTranslation ? tr("translating") : translatedAnswer || query.answer}
              </div>

              <div className="disclaimer" style={{ marginTop: 10, fontWeight: 700 }}>
                {tr("disclaimer")}
              </div>
            </>
          )}
        </div>

        <div
          className="rowBetween"
          style={{ marginTop: 14, gap: 12, flexWrap: "wrap" }}
        >
          <button className="btnOutline" onClick={() => nav("/ask")}>
            {tr("askAnother")}
          </button>
          <button className="btn" onClick={() => nav("/advisory")}>
            {tr("browseAdvisory")}
          </button>
        </div>
      </div>

      <div style={{ height: 80 }} />
    </div>
  );
}
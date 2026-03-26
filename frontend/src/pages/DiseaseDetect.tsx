import { useMemo, useState } from "react";
import axios from "axios";
import { UploadCloud, Leaf, ShieldCheck, Download, X } from "lucide-react";
import { useLang } from "../state/lang";

const API = "http://127.0.0.1:8000/predict";

/** Old format (your UI initially supported this) */
type RemedyObjOld = {
  en?: string;
  mr?: string;
  dosageEn?: string;
  dosageMr?: string;
  precautionsEn?: string;
  precautionsMr?: string;
};

/** New format (your current remedies.json uses this) */
type RemedyObjNew = {
  title?: string;
  advice?: string[];
  medicine?: {
    chemical?: string[];
    organic?: string[];
    notes?: string[];
  };
};

type RemedyAny = string | RemedyObjOld | RemedyObjNew;

type PredictResp = {
  best_label: string;
  best_confidence: number;
  top_predictions: { label: string; confidence: number }[];
  remedy?: RemedyAny;
  filename?: string;
  bytes?: number;
};

async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function normalizeLabelForDisplay(s: string) {
  return s.replaceAll("___", " / ").replaceAll("__", " / ").replaceAll("_", " ");
}

function isRemedyNew(remedy: any): remedy is RemedyObjNew {
  return remedy && typeof remedy === "object" && ("advice" in remedy || "medicine" in remedy || "title" in remedy);
}

function isRemedyOld(remedy: any): remedy is RemedyObjOld {
  return remedy && typeof remedy === "object" && ("en" in remedy || "mr" in remedy || "dosageEn" in remedy || "precautionsEn" in remedy);
}

export default function DiseaseDetect() {
  const [lang] = useLang();

  const t = {
    title: lang === "mr" ? "वनस्पती रोग ओळख" : "Plant Disease Detection",
    sub:
      lang === "mr"
        ? "पानाचा फोटो अपलोड करा → रोग + कॉन्फिडन्स + उपाय त्वरित मिळवा."
        : "Upload a leaf image → get disease + confidence + remedy instantly.",
    uploadTitle: lang === "mr" ? "फोटो अपलोड करा" : "Upload Image",
    dragTitle: lang === "mr" ? "पानाचा फोटो इथे ड्रॅग & ड्रॉप करा" : "Drag & drop leaf image here",
    dragSub: lang === "mr" ? "किंवा क्लिक करून फाइल निवडा" : "or click to choose a file",
    previewHint: lang === "mr" ? "इथे प्रिव्ह्यू दिसेल" : "Preview will appear here",
    detectBtn: lang === "mr" ? "रोग ओळखा" : "Detect Disease",
    detecting: lang === "mr" ? "ओळख चालू आहे..." : "Detecting...",
    viewHistory: lang === "mr" ? "इतिहास पहा" : "View History",
    tip:
      lang === "mr"
        ? "✅ टिप: स्पष्ट क्लोज-अप फोटो वापरा (चांगला प्रकाश, ब्लर नाही, पूर्ण पान दिसेल)."
        : "✅ Tip: Use a clear close-up leaf photo (good light, no blur, full leaf visible).",
    outputTitle: lang === "mr" ? "निकाल" : "Prediction Output",
    download: lang === "mr" ? "रिपोर्ट डाउनलोड" : "Download Report",
    empty:
      lang === "mr"
        ? "फोटो अपलोड करा आणि 'रोग ओळखा' वर क्लिक करा."
        : "Upload image and click Detect.",
    best: lang === "mr" ? "सर्वोत्तम अंदाज" : "Best prediction",
    conf: lang === "mr" ? "कॉन्फिडन्स" : "Confidence",
    meter: lang === "mr" ? "कॉन्फिडन्स मीटर" : "Confidence Meter",
    top: lang === "mr" ? "टॉप अंदाज" : "Top Predictions",
    remedyTitle: lang === "mr" ? "उपाय / सल्ला" : "Remedy / Advice",
    dosageTitle: lang === "mr" ? "औषधाचे प्रमाण (Dosage)" : "Medicine Quantity (Dosage)",
    precautionsTitle: lang === "mr" ? "काळजी / सूचना" : "Precautions",
    medicineTitle: lang === "mr" ? "औषधे" : "Medicines",
    chemical: lang === "mr" ? "रासायनिक" : "Chemical",
    organic: lang === "mr" ? "सेंद्रिय" : "Organic",
    notes: lang === "mr" ? "टीपा" : "Notes",
    modelBadge: lang === "mr" ? "MobileNetV2 CNN" : "MobileNetV2 CNN",
    stackBadge: lang === "mr" ? "FastAPI + TensorFlow" : "FastAPI + TensorFlow",
    badFile:
      lang === "mr"
        ? "कृपया वैध इमेज फाइल अपलोड करा (JPG/PNG/WebP)."
        : "Please upload a valid image file (JPG/PNG/WebP).",
    noRemedy: lang === "mr" ? "उपाय उपलब्ध नाही." : "No remedy available.",
  };

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<PredictResp | null>(null);
  const [err, setErr] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [dragOver, setDragOver] = useState(false);

  const info = useMemo(() => {
    if (!file) return null;
    return { name: file.name, bytes: file.size };
  }, [file]);

  function resetAll() {
    setFile(null);
    setPreview("");
    setResp(null);
    setErr("");
    setProgress(0);
  }

  function onPick(f: File | null) {
    setFile(f);
    setResp(null);
    setErr("");
    setProgress(0);
    if (!f) return setPreview("");
    setPreview(URL.createObjectURL(f));
  }

  function acceptFile(f: File) {
    if (!f.type.startsWith("image/")) {
      setErr(t.badFile);
      return;
    }
    onPick(f);
  }

  // ---------- OLD helper text getters (kept for backward compatibility) ----------
  function getDosageText(remedy: RemedyAny): string {
    if (!remedy || typeof remedy === "string") return "";
    if (!isRemedyOld(remedy)) return "";
    return (lang === "mr" ? remedy.dosageMr : remedy.dosageEn) || remedy.dosageEn || remedy.dosageMr || "";
  }

  function getPrecautionsText(remedy: RemedyAny): string {
    if (!remedy || typeof remedy === "string") return "";
    if (!isRemedyOld(remedy)) return "";
    return (lang === "mr" ? remedy.precautionsMr : remedy.precautionsEn) || remedy.precautionsEn || remedy.precautionsMr || "";
  }

  // ---------- New renderer for remedy (supports both formats) ----------
  function renderRemedy(remedy: RemedyAny) {
    if (!remedy) return <div className="remedyText">{t.noRemedy}</div>;

    // If backend returns a plain string
    if (typeof remedy === "string") {
      return <div className="remedyText">{remedy || t.noRemedy}</div>;
    }

    // New format (title/advice/medicine)
    if (isRemedyNew(remedy)) {
      const title = remedy.title || (lang === "mr" ? "उपाय" : "Advice");
      const advice = remedy.advice || [];
      const chemical = remedy.medicine?.chemical || [];
      const organic = remedy.medicine?.organic || [];
      const notes = remedy.medicine?.notes || [];

      return (
        <div>
          <div className="remedyText" style={{ fontWeight: 800, marginBottom: 8 }}>
            {title}
          </div>

          {advice.length ? (
            <ul style={{ marginLeft: 18, marginTop: 0 }}>
              {advice.map((a, idx) => (
                <li key={idx}>{a}</li>
              ))}
            </ul>
          ) : (
            <div className="remedyText">{t.noRemedy}</div>
          )}

          {(chemical.length || organic.length || notes.length) ? (
            <div style={{ marginTop: 10 }}>
              <div className="title" style={{ fontSize: 14 }}>
                {t.medicineTitle}
              </div>

              {chemical.length ? (
                <>
                  <div className="muted" style={{ fontWeight: 800, marginTop: 6 }}>
                    {t.chemical}
                  </div>
                  <ul style={{ marginLeft: 18, marginTop: 4 }}>
                    {chemical.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              {organic.length ? (
                <>
                  <div className="muted" style={{ fontWeight: 800, marginTop: 6 }}>
                    {t.organic}
                  </div>
                  <ul style={{ marginLeft: 18, marginTop: 4 }}>
                    {organic.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              {notes.length ? (
                <>
                  <div className="muted" style={{ fontWeight: 800, marginTop: 6 }}>
                    {t.notes}
                  </div>
                  <ul style={{ marginLeft: 18, marginTop: 4 }}>
                    {notes.map((n, idx) => (
                      <li key={idx}>{n}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      );
    }

    // Old bilingual format (en/mr + dosage/precautions)
    if (isRemedyOld(remedy)) {
      const text =
        (lang === "mr" ? remedy.mr : remedy.en) ||
        remedy.en ||
        remedy.mr ||
        t.noRemedy;

      return (
        <div>
          <div className="remedyText">{text}</div>

          {getDosageText(remedy) && (
            <div style={{ marginTop: 10 }}>
              <div className="title" style={{ fontSize: 14 }}>
                {t.dosageTitle}
              </div>
              <div className="muted" style={{ fontWeight: 800 }}>
                {getDosageText(remedy)}
              </div>
            </div>
          )}

          {getPrecautionsText(remedy) && (
            <div style={{ marginTop: 10 }}>
              <div className="title" style={{ fontSize: 14 }}>
                {t.precautionsTitle}
              </div>
              <div className="muted">{getPrecautionsText(remedy)}</div>
            </div>
          )}
        </div>
      );
    }

    return <div className="remedyText">{t.noRemedy}</div>;
  }

  async function detect() {
    if (!file) return;

    setLoading(true);
    setErr("");
    setResp(null);
    setProgress(0);

    // simple progress animation (UI only)
    let alive = true;
    const timer = setInterval(() => {
      if (!alive) return;
      setProgress((p) => (p >= 92 ? p : p + Math.max(1, Math.round((92 - p) * 0.12))));
    }, 120);

    try {
      const form = new FormData();
      form.append("file", file);

      const r = await axios.post(API, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = r.data as PredictResp;
      setResp(data);
      setProgress(100);

      // ✅ SAVE HISTORY (base64 so it doesn't break after refresh)
      const imgBase64 = await fileToDataURL(file);
      const old = JSON.parse(localStorage.getItem("detect_history") || "[]");

      const item = {
        image: imgBase64,
        label: data.best_label,
        confidence: data.best_confidence,
        remedy: data.remedy,
        time: new Date().toLocaleString(),
      };

      localStorage.setItem("detect_history", JSON.stringify([item, ...old]));
    } catch (e: any) {
      setErr(e?.message || "Prediction failed");
      setProgress(0);
    } finally {
      alive = false;
      clearInterval(timer);
      setLoading(false);
    }
  }

  function downloadReport() {
    if (!resp) return;

    const report = {
      project: "FarmAssist AI - Plant Disease Detection",
      timestamp: new Date().toISOString(),
      input: {
        filename: info?.name || resp.filename || "unknown",
        bytes: info?.bytes || resp.bytes || 0,
      },
      result: resp,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "farmassist_report.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  const bestPct = resp ? Math.round(resp.best_confidence * 100) : 0;

  return (
    <div>
      <div className="detectHeader">
        <div>
          <div className="detectTitle">{t.title}</div>
          <div className="detectSub">{t.sub}</div>
        </div>

        <div className="detectBadges">
          <span className="pillBadge">
            <Leaf size={16} /> {t.modelBadge}
          </span>
          <span className="pillBadge">
            <ShieldCheck size={16} /> {t.stackBadge}
          </span>
        </div>
      </div>

      <div className="grid2 detectGrid">
        {/* LEFT */}
        <div className="card detectCard">
          <div className="rowBetween">
            <div className="title">{t.uploadTitle}</div>
            {file && (
              <button className="iconBtn" onClick={resetAll} title="Remove">
                <X size={16} />
              </button>
            )}
          </div>

          <div
            className={"dropZone " + (dragOver ? "dragOver" : "")}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) acceptFile(f);
            }}
          >
            <UploadCloud size={34} />
            <div className="dropTitle">{t.dragTitle}</div>
            <div className="dropSub">{t.dragSub}</div>

            <input
              className="fileInput"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) acceptFile(f);
              }}
            />
          </div>

          <div className="imageBox detectImageBox">
            {preview ? <img className="previewImg" src={preview} alt="preview" /> : <div className="muted">{t.previewHint}</div>}
          </div>

          <button className="btn detectBtn" onClick={detect} disabled={!file || loading}>
            {loading ? t.detecting : t.detectBtn}
          </button>

          <button className="btnOutline" style={{ marginTop: 10 }} onClick={() => (window.location.href = "/history")}>
            {t.viewHistory}
          </button>

          {loading && (
            <div className="progressWrap">
              <div className="progressBar">
                <div className="progressFill" style={{ width: `${progress}%` }} />
              </div>
              <div className="muted small">
                {lang === "mr" ? "इमेज विश्लेषण चालू आहे…" : "Analyzing image…"} {progress}%
              </div>
            </div>
          )}

          {info && (
            <div className="miniInfo">
              <div>
                <b>{lang === "mr" ? "फाइल" : "File"}:</b> {info.name}
              </div>
              <div>
                <b>{lang === "mr" ? "आकार" : "Size"}:</b> {info.bytes} bytes
              </div>
            </div>
          )}

          <div className="note">{t.tip}</div>

          {err && <div className="errorBox">{err}</div>}
        </div>

        {/* RIGHT */}
        <div className="card detectCard">
          <div className="rowBetween">
            <div className="title">{t.outputTitle}</div>
            {resp && (
              <button className="btnSmall" onClick={downloadReport}>
                <Download size={16} /> {t.download}
              </button>
            )}
          </div>

          {!resp ? (
            <div className="muted detectEmpty">{t.empty}</div>
          ) : (
            <div className="resultBox detectResult">
              <div className="bigResult detectBig">
                <div style={{ minWidth: 0 }}>
                  <div className="resultLabel" style={{ wordBreak: "break-word" }}>
                    {normalizeLabelForDisplay(resp.best_label)}
                  </div>
                  <div className="muted small">{t.best}</div>
                </div>

                <div className="scoreRing">
                  <div className="scoreNum">{bestPct}%</div>
                  <div className="scoreSub">{t.conf}</div>
                </div>
              </div>

              <div className="confWrap">
                <div className="confLabel">
                  {t.meter} <span className="muted small">({bestPct}%)</span>
                </div>
                <div className="confBar">
                  <div className="confFill" style={{ width: `${bestPct}%` }} />
                </div>
              </div>

              <div className="title" style={{ marginTop: 12 }}>
                {t.top}
              </div>

              <div className="topList">
                {resp.top_predictions?.map((p) => {
                  const pct = Math.round(p.confidence * 100);
                  return (
                    <div key={p.label} className="topRow detectTopRow">
                      <div className="topLeft">
                        <div className="topName">{normalizeLabelForDisplay(p.label)}</div>
                        <div className="topMiniBar">
                          <div className="topMiniFill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="topPct">{pct}%</div>
                    </div>
                  );
                })}
              </div>

              {/* Remedy */}
              <div className="remedyBox detectRemedy">
                <div className="title">{t.remedyTitle}</div>
                {renderRemedy(resp.remedy ?? "")}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ height: 80 }} />
    </div>
  );
}
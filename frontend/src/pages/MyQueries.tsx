import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../state/categories";
import { useFarm } from "../state/FarmContext";
import { useLang } from "../state/lang";

type Lang = "en" | "mr" | "hi";

export default function MyQueries() {
  const nav = useNavigate();
  const { queries } = useFarm();
  const [lang] = useLang();

  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const TEXT: Record<string, Record<Lang, string>> = {
    title: { en: "My Queries", mr: "माझे प्रश्न", hi: "मेरे प्रश्न" },
    searchPh: { en: "Search questions...", mr: "प्रश्न शोधा...", hi: "प्रश्न खोजें..." },
    clearAll: { en: "Clear All", mr: "सर्व हटवा", hi: "सब हटाएं" },
    allCategories: { en: "All Categories", mr: "सर्व विभाग", hi: "सभी श्रेणियाँ" },
    allStatus: { en: "All Status", mr: "सर्व स्थिती", hi: "सभी स्थिति" },
    answered: { en: "Answered", mr: "उत्तर दिले", hi: "उत्तर दिया" },
    pending: { en: "Pending", mr: "प्रलंबित", hi: "लंबित" },
    empty: {
      en: "No queries yet. Ask your first question!",
      mr: "अजून प्रश्न नाहीत. तुमचा पहिला प्रश्न विचारा!",
      hi: "अभी तक कोई प्रश्न नहीं। अपना पहला प्रश्न पूछें!",
    },
  };

  const tr = (k: keyof typeof TEXT) => TEXT[k][lang] ?? TEXT[k].en;

  const catTitle = (c: any) => (c?.title?.[lang] ?? c?.title?.en ?? "");

  const filtered = useMemo(() => {
    const q = (queries || []).slice();

    return q.filter((item: any) => {
      const s = search.trim().toLowerCase();
      const matchSearch = !s
        ? true
        : String(item.question || "").toLowerCase().includes(s);

      const matchCat = cat === "all" ? true : item.category === cat;

      const matchStatus =
        status === "all"
          ? true
          : status === "Answered"
          ? item.status === "Answered"
          : item.status !== "Answered";

      return matchSearch && matchCat && matchStatus;
    });
  }, [queries, search, cat, status]);

  function clearAll() {
    const ok = window.confirm(
      lang === "mr"
        ? "सर्व प्रश्न हटवायचे आहेत का?"
        : lang === "hi"
        ? "क्या आप सभी प्रश्न हटाना चाहते हैं?"
        : "Do you want to delete all queries?"
    );
    if (!ok) return;

    // ✅ works with your localStorage approach
    localStorage.removeItem("queries");
    localStorage.removeItem("farm_queries");
    window.location.reload();
  }

  function statusText(s: string) {
    return s === "Answered" ? tr("answered") : tr("pending");
  }

  return (
    <div>
      <h2 className="pageTitle">{tr("title")}</h2>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="rowBetween" style={{ gap: 12, flexWrap: "wrap" }}>
          <input
            className="input"
            placeholder={tr("searchPh")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 240 }}
          />

          <button className="btnOutline" onClick={clearAll}>
            {tr("clearAll")}
          </button>
        </div>

        <div className="rowBetween" style={{ gap: 12, marginTop: 12, flexWrap: "wrap" }}>
          <select
            className="select"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            style={{ minWidth: 220 }}
          >
            <option value="all">{tr("allCategories")}</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {/* ✅ IMPORTANT: string only */}
                {catTitle(c)}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ minWidth: 180 }}
          >
            <option value="all">{tr("allStatus")}</option>
            <option value="Answered">{tr("answered")}</option>
            <option value="Pending">{tr("pending")}</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="muted" style={{ padding: 12 }}>
            {tr("empty")}
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((q: any) => {
            const catObj = CATEGORIES.find((c) => c.key === q.category);
            const title = catObj ? catTitle(catObj) : q.category;

            return (
              <div
                key={q.id}
                className="card"
                style={{ cursor: "pointer" }}
                onClick={() => nav(`/queries/${q.id}`)}
              >
                <div className="rowBetween" style={{ gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="title" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span className="catEmoji">{catObj?.emoji ?? "🌾"}</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {q.question}
                      </span>
                    </div>
                    <div className="muted small">
                      {new Date(q.createdAt).toLocaleString()} • {title}
                    </div>
                  </div>

                  <span className={"statusPill " + (q.status === "Answered" ? "answered" : "pending")}>
                    {statusText(q.status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ height: 80 }} />
    </div>
  );
}
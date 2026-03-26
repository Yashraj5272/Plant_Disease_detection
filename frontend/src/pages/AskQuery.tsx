import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CATEGORIES } from "../state/categories";
import { useFarm } from "../state/FarmContext";
import type { CategoryKey } from "../state/types";
import { toast } from "../components/toast";
import { useLang } from "../state/lang";

type Lang = "en" | "mr" | "hi";

const EXAMPLES: Array<{ cat: CategoryKey; text: Record<Lang, string> }> = [
  {
    cat: "crop",
    text: {
      en: "My tomato leaves have dark spots and curling. What should I do?",
      mr: "माझ्या टोमॅटोच्या पानांवर काळे डाग आणि वळणे दिसत आहे. काय करावे?",
      hi: "मेरे टमाटर के पत्तों पर काले धब्बे और मुड़ना दिख रहा है। क्या करूँ?",
    },
  },
  {
    cat: "pest",
    text: {
      en: "There are tiny insects under leaves and plants are weak. How to control?",
      mr: "पानांच्या खाली छोटे किडे आहेत आणि झाडे कमकुवत आहेत. नियंत्रण कसे करावे?",
      hi: "पत्तों के नीचे छोटे कीड़े हैं और पौधे कमजोर हैं। नियंत्रण कैसे करें?",
    },
  },
  {
    cat: "soil",
    text: {
      en: "Soil is hard and water is not absorbing well. How to improve soil health?",
      mr: "माती घट्ट आहे आणि पाणी शोषले जात नाही. माती आरोग्य कसे सुधारावे?",
      hi: "मिट्टी सख्त है और पानी अच्छे से नहीं सोख रही। मिट्टी कैसे सुधारें?",
    },
  },
  {
    cat: "market",
    text: {
      en: "What is a good time to sell onions? How to track price trends?",
      mr: "कांदे विकण्यासाठी योग्य वेळ कोणती? बाजारभाव ट्रेंड कसा पाहावा?",
      hi: "प्याज बेचने का सही समय क्या है? कीमत का ट्रेंड कैसे देखें?",
    },
  },
];

export default function AskQuery() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const pre = params.get("cat") as CategoryKey | null;

  const { addQuery } = useFarm();
  const [lang] = useLang();

  const [category, setCategory] = useState<CategoryKey>(pre ?? "crop");
  const [question, setQuestion] = useState("");

  const TEXT: Record<string, Record<Lang, string>> = {
    pageTitle: { en: "Ask Query", mr: "प्रश्न विचारा", hi: "प्रश्न पूछें" },
    chooseCategory: { en: "Choose Category", mr: "विभाग निवडा", hi: "श्रेणी चुनें" },
    writeQuestion: { en: "Write your question", mr: "तुमचा प्रश्न लिहा", hi: "अपना प्रश्न लिखें" },
    selected: { en: "Selected", mr: "निवडलेले", hi: "चयनित" },
    placeholder: {
      en: "Describe your problem in detail (symptoms, crop age, location, watering, etc.)",
      mr: "तुमची समस्या सविस्तर लिहा (लक्षणे, पिकाचे वय, ठिकाण, पाणी देणे इ.)",
      hi: "अपनी समस्या विस्तार से लिखें (लक्षण, फसल की उम्र, स्थान, सिंचाई आदि)",
    },
    submit: { en: "Submit Query", mr: "प्रश्न सबमिट करा", hi: "प्रश्न जमा करें" },
    minToast: {
      en: "Please write at least 10 characters.",
      mr: "किमान 10 अक्षरे लिहा.",
      hi: "कम से कम 10 अक्षर लिखें।",
    },
    submittedToast: {
      en: "Query submitted! AI is preparing your answer...",
      mr: "प्रश्न सबमिट झाला! AI उत्तर तयार करत आहे...",
      hi: "प्रश्न जमा हो गया! AI उत्तर तैयार कर रहा है...",
    },
    tipsTitle: { en: "Tips", mr: "टिप्स", hi: "टिप्स" },
    tip1: { en: "Mention crop/animal type + age", mr: "पीक/प्राणी प्रकार + वय लिहा", hi: "फसल/पशु प्रकार + उम्र लिखें" },
    tip2: { en: "Tell symptoms (spots, curling, yellowing, worms, etc.)", mr: "लक्षणे लिहा (डाग, वळणे, पिवळेपणा, इ.)", hi: "लक्षण लिखें (धब्बे, मुड़ना, पीलापन, आदि)" },
    tip3: { en: "Share recent weather / irrigation changes", mr: "हवामान/सिंचन बदल सांगा", hi: "हाल का मौसम/सिंचाई बदलाव बताएं" },
    examplesTitle: { en: "Examples", mr: "उदाहरणे", hi: "उदाहरण" },
    exampleAdded: { en: "Example added!", mr: "उदाहरण जोडले!", hi: "उदाहरण जोड़ दिया!" },
  };

  const tr = (k: keyof typeof TEXT) => TEXT[k][lang] ?? TEXT[k].en;

  const count = question.length;
  const isValid = count >= 10;

  const catObj = useMemo(
    () => CATEGORIES.find((c) => c.key === category)!,
    [category]
  );

  const catTitle = (c: any) => (c?.title?.[lang] ?? c?.title?.en ?? "");

  function submit() {
    if (!isValid) {
      toast(tr("minToast"));
      return;
    }
    const id = addQuery(category, question.trim());
    toast(tr("submittedToast"));
    nav(`/queries/${id}`);
  }

  return (
    <div>
      <h2 className="pageTitle">{tr("pageTitle")}</h2>

      <div className="grid2">
        <div className="card">
          <div className="title">{tr("chooseCategory")}</div>

          <div className="catPick">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                className={"catPickBtn " + (c.key === category ? "active" : "")}
                onClick={() => setCategory(c.key as CategoryKey)}
              >
                <span className="catEmoji">{c.emoji}</span>
                {/* ✅ IMPORTANT: render string, not object */}
                <span>{catTitle(c)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="title">{tr("writeQuestion")}</div>

          <div className="muted small">
            {tr("selected")}: <b>{catTitle(catObj)}</b>
          </div>

          <textarea
            className="textarea"
            placeholder={tr("placeholder")}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={500}
          />

          <div className="rowBetween">
            <div className={"muted small " + (isValid ? "okText" : "warnText")}>
              {count}/500 (min 10)
            </div>

            <button className="btn" onClick={submit}>
              {tr("submit")}
            </button>
          </div>

          <div className="tips">
            <div className="title">{tr("tipsTitle")}</div>
            <ul>
              <li>{tr("tip1")}</li>
              <li>{tr("tip2")}</li>
              <li>{tr("tip3")}</li>
            </ul>
          </div>

          <div className="title" style={{ marginTop: 12 }}>
            {tr("examplesTitle")}
          </div>

          <div className="exampleRow">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                className="chip"
                onClick={() => {
                  setCategory(ex.cat);
                  setQuestion(ex.text[lang] ?? ex.text.en);
                  toast(tr("exampleAdded"));
                }}
              >
                {ex.text[lang] ?? ex.text.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: 80 }} />
    </div>
  );
}
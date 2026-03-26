import type { Lang } from "./state/lang";

type Dict = Record<string, Record<Lang, string>>;

export const TEXT: Dict = {
  // Common
  language: { en: "Language", mr: "भाषा", hi: "भाषा" },

  // Home
  home_title: { en: "AI Farming Advisory", mr: "AI शेती सल्ला", hi: "AI कृषि सलाह" },
  home_sub: {
    en: "Ask farming questions and get quick guidance in seconds. Get help on crop diseases, irrigation, soil health, pests, market prices and more.",
    mr: "शेतीविषयक प्रश्न विचारा आणि सेकंदात मार्गदर्शन मिळवा. पिकांचे रोग, सिंचन, माती, किडी, बाजारभाव इत्यादींवर मदत मिळवा.",
    hi: "कृषि प्रश्न पूछें और सेकंडों में मार्गदर्शन पाएं। फसल रोग, सिंचाई, मिट्टी, कीट, बाजार भाव आदि पर सहायता लें।"
  },
  home_ask: { en: "Ask a Question", mr: "प्रश्न विचारा", hi: "प्रश्न पूछें" },
  home_detect: { en: "Detect Disease", mr: "रोग ओळखा", hi: "रोग पहचानें" },
  home_library: { en: "Open Library", mr: "लायब्ररी उघडा", hi: "लाइब्रेरी खोलें" },

  total_queries: { en: "Total Queries", mr: "एकूण प्रश्न", hi: "कुल प्रश्न" },
  pending: { en: "Pending", mr: "प्रलंबित", hi: "लंबित" },
  answered: { en: "Answered", mr: "उत्तर दिले", hi: "उत्तर दिया" },

  quick_categories: { en: "Quick Categories", mr: "त्वरित विभाग", hi: "त्वरित श्रेणियाँ" },

  // Detect page
  detect_upload: { en: "Upload Image", mr: "फोटो अपलोड करा", hi: "छवि अपलोड करें" },
  detect_drag: { en: "Drag & drop leaf image here", mr: "पानाचा फोटो इथे ड्रॅग & ड्रॉप करा", hi: "पत्ते की छवि यहाँ ड्रैग & ड्रॉप करें" },
  detect_drag_sub: { en: "or click to choose a file", mr: "किंवा क्लिक करून फाइल निवडा", hi: "या फ़ाइल चुनने के लिए क्लिक करें" },
  detect_btn: { en: "Detect Disease", mr: "रोग ओळखा", hi: "रोग पहचानें" },
  detecting: { en: "Detecting...", mr: "ओळख चालू आहे...", hi: "पहचान हो रही है..." },

  prediction_output: { en: "Prediction Output", mr: "निकाल", hi: "परिणाम" },
  top_predictions: { en: "Top Predictions", mr: "टॉप अंदाज", hi: "शीर्ष अनुमान" },
  remedy: { en: "Remedy / Advice", mr: "उपाय / सल्ला", hi: "उपाय / सलाह" },

  // Queries page
  my_queries: { en: "My Queries", mr: "माझे प्रश्न", hi: "मेरे प्रश्न" },
  search_questions: { en: "Search questions...", mr: "प्रश्न शोधा...", hi: "प्रश्न खोजें..." },
  clear_all: { en: "Clear All", mr: "सगळं हटवा", hi: "सब हटाएं" },

  // Advisory page
  advisory_library: { en: "Advisory Library", mr: "सल्ला लायब्ररी", hi: "सलाह लाइब्रेरी" },
  browse_guides: { en: "Browse guides and best practices.", mr: "मार्गदर्शक आणि उत्तम पद्धती पहा.", hi: "गाइड और सर्वोत्तम अभ्यास देखें।" },
  search_articles: {
    en: "Search articles (tomato, drip, soil...)",
    mr: "लेख शोधा (टोमॅटो, ड्रिप, माती...)",
    hi: "लेख खोजें (टमाटर, ड्रिप, मिट्टी...)"
  }
};

export function tr(lang: Lang, key: keyof typeof TEXT): string {
  return TEXT[key][lang] ?? TEXT[key].en;
}
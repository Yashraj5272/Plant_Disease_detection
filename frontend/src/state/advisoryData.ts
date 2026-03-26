export type Lang = "en" | "mr" | "hi";

export type L10nString = Record<Lang, string>;

export type AdvisoryArticle = {
  id: string; // MUST match route /advisory/:id
  categoryKey: string;

  // ✅ Multilingual
  categoryLabel: L10nString;
  title: L10nString;
  description: L10nString;
  content: Record<Lang, string[]>;

  // ✅ Keep tags English for best search
  tags: string[];

  readTime: string; // you can keep this as "5 min" for all languages (or translate later)
  image: string; // can be empty, we handle fallback
  featured?: boolean;
};

export const ARTICLES: AdvisoryArticle[] = [
  {
    id: "blight-tomato",
    categoryKey: "crop",
    categoryLabel: {
      en: "Crop Management",
      mr: "पीक व्यवस्थापन",
      hi: "फसल प्रबंधन",
    },
    title: {
      en: "Preventing Blight in Tomato",
      mr: "टोमॅटोमध्ये ब्लाईट टाळणे",
      hi: "टमाटर में ब्लाइट से बचाव",
    },
    description: {
      en: "Simple steps to reduce fungal spread and protect yield.",
      mr: "बुरशीचा प्रसार कमी करून उत्पादन वाचवण्यासाठी सोपी पावले.",
      hi: "फफूंद के प्रसार को कम करके उपज बचाने के आसान उपाय।",
    },
    tags: ["tomato", "fungus", "spray"],
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1400&q=60",
    featured: true,
    content: {
      en: [
        "Remove infected leaves and destroy them (do not compost).",
        "Avoid overhead irrigation; water at the base in the morning.",
        "Maintain plant spacing and pruning for better airflow.",
        "Use mulch to reduce soil splash onto leaves.",
        "Apply recommended fungicide (as per label) early when symptoms start.",
      ],
      mr: [
        "संक्रमित पाने काढून नष्ट करा (कंपोस्टमध्ये टाकू नका).",
        "वरून पाणी देणे टाळा; सकाळी झाडाच्या मुळाशी पाणी द्या.",
        "हवा खेळती राहण्यासाठी अंतर ठेवा आणि आवश्यक तेवढी छाटणी करा.",
        "मातीचे उडणे कमी करण्यासाठी मल्च वापरा.",
        "लक्षणे दिसताच लेबलप्रमाणे शिफारस केलेले बुरशीनाशक लवकर फवारणी करा.",
      ],
      hi: [
        "संक्रमित पत्तों को हटाकर नष्ट करें (कंपोस्ट न करें)।",
        "ऊपर से सिंचाई से बचें; सुबह जड़ों के पास पानी दें।",
        "बेहतर हवा के लिए पौधों में दूरी रखें और छंटाई करें।",
        "पत्तों पर मिट्टी के छींटे कम करने के लिए मल्च का उपयोग करें।",
        "लक्षण दिखते ही लेबल अनुसार अनुशंसित फफूंदनाशक का जल्दी छिड़काव करें।",
      ],
    },
  },

  {
    id: "soil-health-basics",
    categoryKey: "soil",
    categoryLabel: {
      en: "Soil Health",
      mr: "माती आरोग्य",
      hi: "मिट्टी स्वास्थ्य",
    },
    title: {
      en: "Soil Health Basics",
      mr: "माती आरोग्य मूलतत्त्वे",
      hi: "मिट्टी स्वास्थ्य की मूल बातें",
    },
    description: {
      en: "Improve soil structure, pH balance, and organic matter.",
      mr: "मातीची रचना, pH संतुलन आणि सेंद्रिय पदार्थ सुधारण्याचे उपाय.",
      hi: "मिट्टी की बनावट, pH संतुलन और जैविक पदार्थ सुधारें।",
    },
    tags: ["compost", "pH", "NPK"],
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1400&q=60",
    featured: true,
    content: {
      en: [
        "Test soil pH once per season and correct slowly (lime/sulfur as needed).",
        "Add compost or well-rotted manure to improve organic matter.",
        "Avoid over-tilling; it breaks soil structure and reduces microbes.",
        "Use crop rotation and cover crops to maintain nutrients.",
        "Apply NPK based on soil test, not guesswork.",
      ],
      mr: [
        "प्रत्येक हंगामात एकदा मातीचा pH तपासा आणि हळूहळू दुरुस्त करा (गरजेनुसार चुना/सल्फर).",
        "सेंद्रिय पदार्थ वाढवण्यासाठी कंपोस्ट किंवा कुजलेले शेणखत वापरा.",
        "अति नांगरणी टाळा; त्यामुळे मातीची रचना बिघडते आणि सूक्ष्मजीव कमी होतात.",
        "पोषक तत्त्वे टिकवण्यासाठी पीक फेरपालट आणि कव्हर क्रॉप्स वापरा.",
        "अंदाजाने नाही; माती चाचणी अहवालानुसारच NPK द्या.",
      ],
      hi: [
        "हर मौसम में एक बार मिट्टी का pH टेस्ट करें और धीरे-धीरे सुधारें (आवश्यकतानुसार चूना/सल्फर)।",
        "जैविक पदार्थ बढ़ाने के लिए कंपोस्ट या अच्छी तरह सड़ी हुई गोबर खाद डालें।",
        "अधिक जुताई से बचें; इससे मिट्टी की संरचना टूटती है और सूक्ष्मजीव घटते हैं।",
        "पोषक तत्व बनाए रखने के लिए फसल चक्र और कवर क्रॉप्स अपनाएं।",
        "अंदाज से नहीं; मिट्टी परीक्षण के आधार पर ही NPK दें।",
      ],
    },
  },

  {
    id: "drip-irrigation-guide",
    categoryKey: "irrigation",
    categoryLabel: {
      en: "Irrigation",
      mr: "सिंचन",
      hi: "सिंचाई",
    },
    title: {
      en: "Drip Irrigation Guide",
      mr: "ड्रिप सिंचन मार्गदर्शक",
      hi: "ड्रिप सिंचाई गाइड",
    },
    description: {
      en: "Save water and increase efficiency using drip systems.",
      mr: "ड्रिप प्रणालीने पाणी वाचवा आणि कार्यक्षमता वाढवा.",
      hi: "ड्रिप सिस्टम से पानी बचाएं और दक्षता बढ़ाएं।",
    },
    tags: ["drip", "water", "efficiency"],
    readTime: "7 min",
    image:
      "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    content: {
      en: [
        "Use a filter to prevent clogging in drip emitters.",
        "Place emitters near root zones; expand as the plant grows.",
        "Run drip in early morning to reduce evaporation.",
        "Check pressure and leaks weekly for uniform watering.",
        "Fertigation can be added using a venturi injector (as per guidelines).",
      ],
      mr: [
        "ड्रिप इमिटर堵 होऊ नये म्हणून फिल्टर वापरा.",
        "इमिटर मुळांच्या जवळ ठेवा; झाड वाढल्यावर आवश्यकतेनुसार पुढे वाढवा.",
        "बाष्पीभवन कमी करण्यासाठी सकाळी लवकर ड्रिप चालवा.",
        "समान पाणी मिळण्यासाठी दर आठवड्याला प्रेशर आणि गळती तपासा.",
        "मार्गदर्शक सूचनांनुसार व्हेंटुरी इंजेक्टरने फर्टिगेशन जोडता येते.",
      ],
      hi: [
        "ड्रिप एमिटर जाम होने से बचाने के लिए फिल्टर लगाएं।",
        "एमिटर जड़ों के पास रखें; पौधा बढ़ने पर जरूरत अनुसार आगे बढ़ाएं।",
        "वाष्पीकरण कम करने के लिए सुबह जल्दी ड्रिप चलाएं।",
        "समान सिंचाई के लिए हर सप्ताह प्रेशर और लीकेज जांचें।",
        "निर्देशों के अनुसार वेंचुरी इंजेक्टर से फर्टिगेशन जोड़ा जा सकता है।",
      ],
    },
  },

  {
    id: "selling-smart-mandis",
    categoryKey: "market",
    categoryLabel: {
      en: "Market Prices",
      mr: "बाजारभाव",
      hi: "बाजार भाव",
    },
    title: {
      en: "Selling Smart in Mandis",
      mr: "मंडीत स्मार्ट विक्री",
      hi: "मंडी में स्मार्ट बिक्री",
    },
    description: {
      en: "Track rates, grade quality, and pick best selling time.",
      mr: "दर ट्रॅक करा, दर्जा ठरवा आणि योग्य विक्री वेळ निवडा.",
      hi: "भाव ट्रैक करें, गुणवत्ता ग्रेड करें और सही समय पर बेचें।",
    },
    tags: ["prices", "mandi", "profit"],
    readTime: "4 min",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=60",
    content: {
      en: [
        "Track daily prices and arrivals for 7–10 days to spot a trend.",
        "Grade produce properly; better sorting often gives better rate.",
        "Avoid peak arrival days if possible; supply high means price low.",
        "Keep transport + packing costs in calculation before deciding.",
      ],
      mr: [
        "ट्रेंड समजण्यासाठी 7–10 दिवस रोजचे दर आणि आवक नोंदवा.",
        "मालाचा दर्जा योग्यरीत्या ठरवा; चांगली वर्गवारी केल्याने दर वाढू शकतो.",
        "शक्य असल्यास जास्त आवकेच्या दिवशी विक्री टाळा; पुरवठा जास्त म्हणजे दर कमी.",
        "निर्णय घेण्यापूर्वी वाहतूक + पॅकिंग खर्च गणनेत घ्या.",
      ],
      hi: [
        "ट्रेंड समझने के लिए 7–10 दिन तक दैनिक भाव और आवक देखें।",
        "उत्पाद की सही ग्रेडिंग करें; बेहतर छंटाई से अक्सर बेहतर दाम मिलता है।",
        "संभव हो तो पीक आवक वाले दिन से बचें; ज्यादा सप्लाई = कम भाव।",
        "फैसला लेने से पहले परिवहन + पैकिंग लागत जोड़ें।",
      ],
    },
  },

  {
    id: "pest-control-ipm",
    categoryKey: "pest",
    categoryLabel: {
      en: "Pest Control",
      mr: "किड नियंत्रण",
      hi: "कीट नियंत्रण",
    },
    title: {
      en: "IPM: Integrated Pest Management",
      mr: "IPM: एकात्मिक किड व्यवस्थापन",
      hi: "IPM: एकीकृत कीट प्रबंधन",
    },
    description: {
      en: "Control pests with prevention first, chemicals last.",
      mr: "प्रथम प्रतिबंध, शेवटी रसायने — अशी किड नियंत्रण पद्धत.",
      hi: "पहले रोकथाम, अंत में रसायन — यही बेहतर तरीका है।",
    },
    tags: ["IPM", "traps", "neem"],
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1400&q=60",
    content: {
      en: [
        "Start with monitoring: check underside of leaves weekly.",
        "Use yellow sticky traps for flying insects like whiteflies.",
        "Neem/insecticidal soap works well for early infestations (as per label).",
        "Rotate chemical groups to prevent resistance if spraying is needed.",
      ],
      mr: [
        "निरीक्षणाने सुरुवात करा: दर आठवड्याला पानांचा खालचा भाग तपासा.",
        "पांढरी माशी सारख्या उडणाऱ्या किडीसाठी पिवळे स्टिकी ट्रॅप्स वापरा.",
        "प्रारंभिक प्रादुर्भावात नीम/इन्सेक्टिसाइडल साबण (लेबलप्रमाणे) उपयुक्त ठरतो.",
        "फवारणी आवश्यक असल्यास प्रतिकार टाळण्यासाठी रसायनांचे गट बदलून वापरा.",
      ],
      hi: [
        "निगरानी से शुरू करें: हर सप्ताह पत्तों के नीचे वाला भाग देखें।",
        "सफेद मक्खी जैसे उड़ने वाले कीड़ों के लिए पीले स्टिकी ट्रैप लगाएं।",
        "शुरुआती संक्रमण में नीम/इंसेक्टिसाइडल साबुन (लेबल अनुसार) अच्छा काम करता है।",
        "यदि छिड़काव जरूरी हो तो प्रतिरोध से बचने के लिए रसायनों के समूह बदलें।",
      ],
    },
  },

  {
    id: "equipment-maintenance",
    categoryKey: "equipment",
    categoryLabel: {
      en: "Equipment",
      mr: "उपकरणे",
      hi: "उपकरण",
    },
    title: {
      en: "Basic Farm Equipment Maintenance",
      mr: "शेती उपकरणांची मूलभूत देखभाल",
      hi: "कृषि उपकरणों की बुनियादी देखभाल",
    },
    description: {
      en: "Reduce breakdowns and save fuel with simple checks.",
      mr: "सोप्या तपासण्यांनी बिघाड कमी करा आणि इंधन बचत करा.",
      hi: "सरल जांच से खराबी कम करें और ईंधन बचाएं।",
    },
    tags: ["tractor", "oil", "service"],
    readTime: "5 min",
    image:
      "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_452,h_450/https://eworkorders.com/eworkorders/wp-content/uploads/farm-maintenance-checklist-e1693399032404.jpg",
    content: {
      en: [
        "Check engine oil, coolant, and air filter weekly.",
        "Keep tyre pressure correct to reduce fuel use.",
        "Lubricate moving parts (grease points) regularly.",
        "Clean dust from radiators to avoid overheating.",
      ],
      mr: [
        "दर आठवड्याला इंजिन ऑइल, कूलंट आणि एअर फिल्टर तपासा.",
        "इंधन बचतीसाठी टायरचा दाब योग्य ठेवा.",
        "हलणाऱ्या भागांना (ग्रीस पॉइंट्स) नियमित ग्रीस/लुब्रिकेशन द्या.",
        "ओव्हरहिटिंग टाळण्यासाठी रेडिएटरमधील धूळ स्वच्छ करा.",
      ],
      hi: [
        "हर सप्ताह इंजन ऑयल, कूलेंट और एयर फिल्टर जांचें।",
        "ईंधन बचाने के लिए टायर प्रेशर सही रखें।",
        "चलने वाले हिस्सों (ग्रीस पॉइंट्स) को नियमित लुब्रिकेट करें।",
        "ओवरहीटिंग से बचने के लिए रेडिएटर की धूल साफ करें।",
      ],
    },
  },
];
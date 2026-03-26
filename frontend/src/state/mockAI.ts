import type { CategoryKey } from "./types";

const baseTips = [
  "Share crop variety, age, and location for better accuracy.",
  "Avoid overuse of chemicals—follow label dosage and safety.",
  "If symptoms spread fast, isolate affected plants immediately.",
];

export function generateAIAnswer(category: CategoryKey, question: string) {
  const q = question.toLowerCase();

  const catAnswer: Record<CategoryKey, string> = {
    crop:
      "For crops: check leaf spots, yellowing, wilting, and nutrient deficiency signs. Remove infected leaves, avoid overhead watering, and improve airflow. If fungal, use a recommended fungicide as per label.",
    livestock:
      "For livestock: monitor feed intake, water, temperature, and stool. Isolate sick animals. Maintain hygiene and consult a vet if fever or breathing issues appear.",
    pest:
      "For pests: inspect underside of leaves early morning. Use neem oil/soap spray for mild infestations, and rotate pesticides only if severe. Remove heavily infested leaves.",
    soil:
      "For soil: check pH, organic matter, and drainage. Add compost, avoid waterlogging, and apply balanced NPK based on soil test.",
    weather:
      "For weather: plan irrigation and spraying based on humidity/wind. Avoid spraying before rain. Use mulching in heat and drainage channels in heavy rain.",
    irrigation:
      "For irrigation: ensure uniform watering, avoid over-watering, and use drip where possible. Water early morning. Check for clogging and pressure issues.",
    equipment:
      "For equipment: do basic maintenance—oil, filters, belts, and tyre pressure. For faults, share model number and error symptoms.",
    market:
      "For market: check nearby mandi rates daily, consider storage cost, quality grading, and timing. Diversify buyers and track demand trends.",
  };

  let extra = "";
  if (q.includes("tomato")) extra = " Since you mentioned tomato, watch for early/late blight signs and avoid wet leaves at night.";
  if (q.includes("yellow")) extra += " Yellowing can also be nitrogen deficiency or root stress—check watering and soil.";

  return `${catAnswer[category]}${extra}\n\nQuick tips:\n- ${baseTips.join("\n- ")}`;
}

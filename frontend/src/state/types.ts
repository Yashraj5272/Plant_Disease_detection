export type CategoryKey =
  | "crop"
  | "livestock"
  | "pest"
  | "soil"
  | "weather"
  | "irrigation"
  | "equipment"
  | "market";

export type QueryStatus = "Pending" | "Answered";

export type FarmQuery = {
  id: string;
  category: CategoryKey;
  question: string;
  createdAt: number;
  status: QueryStatus;
  answer?: string;
  answeredAt?: number;
};

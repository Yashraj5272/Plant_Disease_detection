import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { FarmQuery, CategoryKey } from "./types";
import { generateAIAnswer } from "./mockAI";

type FarmState = {
  queries: FarmQuery[];
  addQuery: (category: CategoryKey, question: string) => string; // returns id
  getById: (id: string) => FarmQuery | undefined;
  clearAll: () => void;
};

const FarmContext = createContext<FarmState | null>(null);

const LS_KEY = "farmassist_queries_v1";

export function FarmProvider({ children }: { children: React.ReactNode }) {
  const [queries, setQueries] = useState<FarmQuery[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as FarmQuery[]) : [];
    } catch {
      return [];
    }
  });

  // persist
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(queries));
  }, [queries]);

  // polling simulation: if pending exists, auto-answer after ~2s from creation
  useEffect(() => {
    const t = setInterval(() => {
      setQueries((prev) =>
        prev.map((q) => {
          if (q.status === "Pending") {
            const age = Date.now() - q.createdAt;
            if (age >= 2000) {
              return {
                ...q,
                status: "Answered",
                answer: generateAIAnswer(q.category, q.question),
                answeredAt: Date.now(),
              };
            }
          }
          return q;
        })
      );
    }, 600);

    return () => clearInterval(t);
  }, []);

  const api = useMemo<FarmState>(
    () => ({
      queries,
      addQuery: (category, question) => {
        const id = crypto.randomUUID();
        const item: FarmQuery = {
          id,
          category,
          question,
          createdAt: Date.now(),
          status: "Pending",
        };
        setQueries((prev) => [item, ...prev]);
        return id;
      },
      getById: (id) => queries.find((q) => q.id === id),
      clearAll: () => setQueries([]),
    }),
    [queries]
  );

  return <FarmContext.Provider value={api}>{children}</FarmContext.Provider>;
}

export function useFarm() {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error("useFarm must be used inside FarmProvider");
  return ctx;
}

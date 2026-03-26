import { useEffect, useState } from "react";

type Item = {
  image: string;
  label: string;
  confidence: number;
  remedy: string;
  time: string;
};

export default function DetectionHistory() {
  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("detect_history") || "[]");
    setData(stored);
  }, []);

  return (
    <div>
      <h2 className="pageTitle">Detection History</h2>

      {data.length === 0 ? (
        <div className="card">No history yet</div>
      ) : (
        <div className="grid2">
          {data.map((item, i) => (
            <div key={i} className="card">
              <img src={item.image} className="previewImg" />

              <div className="title">{item.label}</div>
              <div>{(item.confidence * 100).toFixed(2)}%</div>

              <div className="muted" style={{ marginTop: 6 }}>
                {item.remedy}
              </div>

              <div className="muted small" style={{ marginTop: 8 }}>
                {item.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

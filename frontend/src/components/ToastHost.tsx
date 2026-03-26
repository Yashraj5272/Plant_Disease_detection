import { useEffect, useState } from "react";
import { onToast, ToastItem } from "./toast";

export default function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    return onToast((t) => {
      setItems((prev) => [t, ...prev].slice(0, 3));
      setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== t.id));
      }, 3000);
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="toastWrap">
      {items.map((t) => (
        <div key={t.id} className="toast">
          {t.message}
        </div>
      ))}
    </div>
  );
}

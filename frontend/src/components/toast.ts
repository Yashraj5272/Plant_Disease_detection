export type ToastItem = { id: number; message: string };

let listeners: ((t: ToastItem) => void)[] = [];

export function toast(message: string) {
  const t: ToastItem = { id: Date.now(), message };
  listeners.forEach((l) => l(t));
}

export function onToast(cb: (t: ToastItem) => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

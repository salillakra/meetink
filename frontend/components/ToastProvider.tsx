"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  type?: "success" | "error" | "info";
};

type ToastContextValue = {
  toast: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
    const newToast: Toast = { id, ...t };
    setToasts((s) => [newToast, ...s]);
    // auto remove after 4s
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-3 rounded-xl shadow-lg border border-white/10 text-sm backdrop-blur-sm transition-all transform" + (t.type === "success" ? " bg-green-600/90" : t.type === "error" ? " bg-red-600/90" : " bg-gray-800/90")`}
          >
            {t.title && <div className="font-semibold mb-1">{t.title}</div>}
            {t.description && (
              <div className="text-xs text-white/90">{t.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

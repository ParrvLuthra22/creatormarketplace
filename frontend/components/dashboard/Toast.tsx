"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} className="shrink-0 text-(--accent)" />,
  error: <AlertCircle size={16} className="shrink-0 text-(--warning)" />,
  info: <Info size={16} className="shrink-0 text-(--text-primary)" />,
};

const accentBorder: Record<ToastType, string> = {
  success: "border-l-2 border-l-(--accent)",
  error: "border-l-2 border-l-(--warning)",
  info: "border-l-2 border-l-(--text-primary)",
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).slice(2);
      // Max 3 visible at once — drop the oldest as new ones stack in.
      setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast display — fixed top-right */}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border border-(--border) bg-(--bg-surface) px-4 py-3 shadow-lg max-w-sm min-w-[280px]",
                accentBorder[t.type]
              )}
            >
              {icons[t.type]}
              <span className="flex-1 text-sm text-(--text-primary) leading-snug">
                {t.message}
              </span>
              <button
                onClick={() => remove(t.id)}
                aria-label="Dismiss"
                className="text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-150 shrink-0 focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

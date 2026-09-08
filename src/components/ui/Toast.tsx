import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

const toastConfig: Record<ToastType, { icon: ReactNode; color: string; bg: string; border: string }> = {
  success: {
    icon: <CheckCircle size={15} />,
    color: "var(--status-available)",
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.25)",
  },
  error: {
    icon: <XCircle size={15} />,
    color: "var(--status-error)",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.25)",
  },
  warning: {
    icon: <AlertTriangle size={15} />,
    color: "var(--status-busy)",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.25)",
  },
  info: {
    icon: <Info size={15} />,
    color: "var(--status-info)",
    bg: "rgba(59,130,246,0.06)",
    border: "rgba(59,130,246,0.25)",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { ...opts, id }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const success = useCallback((title: string, description?: string) => toast({ type: "success", title, description }), [toast]);
  const error = useCallback((title: string, description?: string) => toast({ type: "error", title, description }), [toast]);
  const warning = useCallback((title: string, description?: string) => toast({ type: "warning", title, description }), [toast]);
  const info = useCallback((title: string, description?: string) => toast({ type: "info", title, description }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const cfg = toastConfig[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-lg border"
                style={{
                  background: "var(--card)",
                  borderColor: cfg.border,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                }}
              >
                <span
                  className="mt-0.5 shrink-0 p-1.5 rounded-lg"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {t.title}
                  </p>
                  {t.description && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {t.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="mt-0.5 p-0.5 rounded shrink-0 transition-colors hover:bg-[var(--muted)]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <X size={13} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

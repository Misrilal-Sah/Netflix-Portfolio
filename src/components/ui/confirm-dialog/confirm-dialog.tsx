"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

// ─── Imperative API ───────────────────────────────────────────────────────────

export type ConfirmOptions = {
  confirmLabel?: string;
  cancelLabel?: string;
  /** true = red Trash icon (destructive), false = amber AlertTriangle */
  danger?: boolean;
};

type DialogState = {
  open: boolean;
  message: string;
  title: string;
  opts: ConfirmOptions;
};

// Module-level singleton — safe in a client bundle
let _resolver: ((v: boolean) => void) | null = null;
let _openDialog: ((message: string, title: string, opts: ConfirmOptions) => void) | null = null;

/**
 * Call this anywhere inside an admin client component.
 * Returns a promise that resolves to true (confirmed) or false (cancelled).
 *
 * @example
 * const ok = await openConfirm("Delete this item?");
 * if (!ok) return;
 */
export function openConfirm(
  message: string,
  opts: ConfirmOptions & { title?: string } = {}
): Promise<boolean> {
  return new Promise((resolve) => {
    _resolver = resolve;
    _openDialog?.(message, opts.title ?? "Are you sure?", opts);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ConfirmDialog() {
  const [state, setState] = useState<DialogState>({
    open: false,
    message: "",
    title: "Are you sure?",
    opts: {},
  });

  useEffect(() => {
    _openDialog = (message, title, opts) => {
      setState({ open: true, message, title, opts });
    };
    return () => {
      _openDialog = null;
    };
  }, []);

  function answer(ok: boolean) {
    setState((s) => ({ ...s, open: false }));
    _resolver?.(ok);
    _resolver = null;
  }

  const isDanger = state.opts.danger !== false;

  return (
    <AnimatePresence>
      {state.open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.80)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) answer(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[400px] bg-[#1c1c1c] border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden shadow-2xl"
          >
            {/* Red top accent bar */}
            <div
              className="h-[3px]"
              style={{
                background: isDanger
                  ? "linear-gradient(90deg, #E50914, #ff3d47)"
                  : "linear-gradient(90deg, #f59e0b, #fbbf24)",
              }}
            />

            {/* Close button */}
            <button
              onClick={() => answer(false)}
              className="absolute top-3 right-3 p-1 text-[#555] hover:text-white transition-colors rounded-sm hover:bg-[#2a2a2a]"
              aria-label="Cancel"
            >
              <X size={15} />
            </button>

            <div className="p-6">
              {/* Icon + title */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: isDanger
                      ? "rgba(229,9,20,0.12)"
                      : "rgba(245,158,11,0.12)",
                    border: isDanger
                      ? "1px solid rgba(229,9,20,0.3)"
                      : "1px solid rgba(245,158,11,0.3)",
                  }}
                >
                  {isDanger ? (
                    <Trash2 size={16} className="text-[#E50914]" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-400" />
                  )}
                </div>
                <h3 className="text-white font-bold text-[15px]">{state.title}</h3>
              </div>

              {/* Message */}
              <p className="text-[#909090] text-sm leading-relaxed pl-12 mb-6">
                {state.message}
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-2.5 justify-end">
                <button
                  onClick={() => answer(false)}
                  className="px-4 py-2 bg-transparent border border-[rgba(255,255,255,0.12)] text-[#808080] hover:text-white hover:border-[rgba(255,255,255,0.35)] text-sm font-semibold rounded-md transition-all"
                >
                  {state.opts.cancelLabel ?? "Cancel"}
                </button>
                <button
                  autoFocus
                  onClick={() => answer(true)}
                  className="px-4 py-2 text-white text-sm font-bold rounded-md transition-all"
                  style={{
                    background: isDanger ? "#E50914" : "#d97706",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = isDanger
                      ? "#f40d1a"
                      : "#b45309";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = isDanger
                      ? "#E50914"
                      : "#d97706";
                  }}
                >
                  {state.opts.confirmLabel ?? (isDanger ? "Delete" : "Confirm")}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  heroImage?: string;
  children: ReactNode;
}

export function ContentModal({
  isOpen,
  onClose,
  title,
  heroImage,
  children,
}: ContentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store the previously focused element
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus close button after mount
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // Focus trap & Escape
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    },
    [onClose]
  );

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center pt-[2vh] overflow-y-auto"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-overlay backdrop-blur-[4px]"
            onClick={onClose}
            aria-hidden
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn(
              "relative w-[min(850px,90vw)] bg-surface rounded-lg overflow-hidden",
              "shadow-[var(--shadow-modal)]"
            )}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute top-md right-md z-[var(--z-modal-close)] w-9 h-9 rounded-full bg-surface flex items-center justify-center hover:bg-surface-hover transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-text" />
            </button>

            {/* Hero area */}
            {heroImage && (
              <div
                className="h-[200px] bg-cover bg-center relative"
                style={{ backgroundImage: `url(${heroImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                <h2 className="absolute bottom-lg left-lg text-[length:var(--font-size-title)] font-bold text-text">
                  {title}
                </h2>
              </div>
            )}

            {!heroImage && (
              <div className="p-lg border-b border-border">
                <h2 className="text-[length:var(--font-size-title)] font-bold text-text">
                  {title}
                </h2>
              </div>
            )}

            {/* Content */}
            <div className="p-lg text-text">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

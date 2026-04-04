"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleEnter = useCallback(() => {
    if (phase !== "ready") return;

    setPhase("playing");

    // Play tudum sound
    try {
      audioRef.current = new Audio("/sounds/tudum.mp3");
      audioRef.current.play().catch(() => {
        // Audio play may fail silently — that's OK
      });
    } catch {
      // Audio not available
    }

    if (shouldReduceMotion) {
      // Skip animation for reduced motion
      setTimeout(() => {
        localStorage.setItem("intro_seen", "true");
        setPhase("done");
        onComplete();
      }, 100);
      return;
    }

    // Animation timeline: 1.2s scale + 0.5s hold + 0.8s fade = 2.5s
    setTimeout(() => {
      localStorage.setItem("intro_seen", "true");
      setPhase("done");
      onComplete();
    }, 2500);
  }, [phase, onComplete, shouldReduceMotion]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[var(--z-intro)] bg-black flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          {phase === "ready" && (
            <motion.button
              onClick={handleEnter}
              className="flex flex-col items-center gap-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[80px] lg:text-[120px] font-bold text-accent leading-none">
                M
              </span>
              <span className="text-[length:var(--font-size-body)] font-bold text-text tracking-[0.05em]">
                Click to Enter
              </span>
            </motion.button>
          )}

          {phase === "playing" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
              className="text-[120px] lg:text-[200px] font-bold text-accent leading-none"
            >
              N
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Play tudum sound
    try {
      const audio = new Audio("/sounds/tudum.mp3");
      audio.play().catch(() => {});
    } catch {}

    const delay = shouldReduceMotion ? 100 : 2800;
    const timer = setTimeout(() => {
      sessionStorage.setItem("intro_seen", "true");
      onComplete();
    }, delay);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        className="fixed inset-0 z-[var(--z-intro)] bg-black flex items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      >
        <motion.span
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: [0.3, 1.12, 1], opacity: [0, 1, 1] }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 1.6,
            times: [0, 0.65, 1],
            ease: "easeOut",
          }}
          className="select-none font-black tracking-[0.06em] uppercase text-accent"
          style={{
            fontSize: "clamp(36px, 9vw, 108px)",
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            letterSpacing: "0.08em",
          }}
        >
          Misrilal Sah
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
}

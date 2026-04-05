"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Total animation duration in ms — controls both CSS animation and navigation delay
const ANIM_DURATION_MS = 2200;

// Sound hosted on Supabase Storage; fallback to local for dev without env var
const TUDUM_URL =
  process.env.NEXT_PUBLIC_TUDUM_URL || "/sounds/tudum.mp3";

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preload audio on mount — preloading is allowed without user gesture
  useEffect(() => {
    const audio = new Audio(TUDUM_URL);
    audio.preload = "auto";
    audio.volume = 0.7;
    audioRef.current = audio;
    return () => {
      audioRef.current = null;
    };
  }, []);

  const handleClick = useCallback(() => {
    if (isAnimating) return;

    // Play via user gesture — satisfies browser autoplay policy
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("Tudum audio playback blocked:", err);
      });
    }

    setIsAnimating(true);

    setTimeout(() => {
      sessionStorage.setItem("intro_seen", "true");
      onComplete();
    }, ANIM_DURATION_MS);
  }, [isAnimating, onComplete]);

  return (
    <div
      className="fixed inset-0 z-[var(--z-intro)] bg-black flex items-center justify-center cursor-pointer select-none overflow-hidden"
      onClick={handleClick}
    >
      {/* Fade-to-black overlay that appears on click */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ zIndex: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIM_DURATION_MS / 1000, ease: "easeIn" }}
        />
      )}

      {/* Logo */}
      <motion.div
        style={{ zIndex: 2, position: "relative" }}
        animate={
          isAnimating
            ? { scale: [1, 1.15, 15], opacity: [1, 1, 0] }
            : {}
        }
        transition={
          isAnimating
            ? {
                duration: ANIM_DURATION_MS / 1000,
                ease: "easeOut",
                times: [0, 0.4, 1],
              }
            : {}
        }
        whileHover={
          !isAnimating
            ? { scale: 1.05, filter: "drop-shadow(0 0 10px rgba(229,9,20,0.7))" }
            : {}
        }
      >
        <Image
          src="/images/logo-2.png"
          alt="Misrilal Sah"
          width={300}
          height={75}
          priority
          style={{ width: "min(300px, 80vw)", height: "auto" }}
        />
      </motion.div>
    </div>
  );
}

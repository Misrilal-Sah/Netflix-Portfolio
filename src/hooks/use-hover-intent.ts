"use client";

import { useRef, useState, useCallback } from "react";

export function useHoverIntent(delay = 300) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, delay);
  }, [delay]);

  const onMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(false);
  }, []);

  return { isHovered, onMouseEnter, onMouseLeave };
}

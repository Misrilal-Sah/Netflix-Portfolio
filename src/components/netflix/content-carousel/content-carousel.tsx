"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentCarouselProps {
  children: ReactNode;
  className?: string;
}

export function ContentCarousel({ children, className }: ContentCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    align: "start",
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("group relative", className)}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-sm">{children}</div>
      </div>

      {/* Previous Arrow */}
      {canScrollPrev && (
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-0 top-0 bottom-0 w-12 z-[var(--z-carousel-arrow)] bg-[rgba(20,20,20,0.7)] opacity-0 group-hover:opacity-100 transition-opacity duration-fast flex items-center justify-center"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
      )}

      {/* Next Arrow */}
      {canScrollNext && (
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-0 top-0 bottom-0 w-12 z-[var(--z-carousel-arrow)] bg-[rgba(20,20,20,0.7)] opacity-0 group-hover:opacity-100 transition-opacity duration-fast flex items-center justify-center"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      )}
    </div>
  );
}

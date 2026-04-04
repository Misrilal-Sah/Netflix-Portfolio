import { cn } from "@/lib/utils";

interface SkeletonProps {
  variant?: "card" | "text" | "avatar";
  className?: string;
}

export function Skeleton({ variant = "card", className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-skeleton-base",
        variant === "card" && "rounded-md",
        variant === "text" && "h-3 rounded-sm",
        variant === "avatar" && "rounded-full",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(90deg, var(--color-skeleton-base) 25%, var(--color-skeleton-shine) 50%, var(--color-skeleton-base) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    />
  );
}

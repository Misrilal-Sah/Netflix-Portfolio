import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="min-h-screen pt-[68px] px-[4vw] py-xl max-w-4xl">
      <Skeleton variant="text" className="w-28 h-7 mb-lg" />
      <div className="space-y-sm">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="text" className={`h-4 ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function SkillsLoading() {
  return (
    <div className="min-h-screen pt-[68px] px-[4vw] py-xl">
      <Skeleton variant="text" className="w-36 h-7 mb-lg" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-sm">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-20 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen pt-[68px] px-[4vw]">
      <div className="py-xl">
        <Skeleton variant="text" className="w-48 h-7 mb-lg" />
        <div className="flex gap-sm flex-wrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="flex-shrink-0 w-[260px] aspect-video" />
          ))}
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileHomeLoading() {
  return (
    <div className="min-h-screen pt-0">
      {/* Hero skeleton */}
      <Skeleton variant="card" className="w-full h-[70vh]" />

      {/* Top Picks row */}
      <div className="px-[4vw] py-xl">
        <Skeleton variant="text" className="w-52 h-5 mb-lg" />
        <div className="flex gap-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="flex-shrink-0 w-[200px] aspect-video" />
          ))}
        </div>
      </div>

      {/* Projects row */}
      <div className="px-[4vw] py-xl">
        <Skeleton variant="text" className="w-36 h-5 mb-lg" />
        <div className="flex gap-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="flex-shrink-0 w-[200px] aspect-video" />
          ))}
        </div>
      </div>
    </div>
  );
}

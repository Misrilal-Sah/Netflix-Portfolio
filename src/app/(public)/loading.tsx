import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return (
    <div className="min-h-screen pt-[68px] px-[4vw]">
      {/* Hero skeleton */}
      <Skeleton variant="card" className="w-full h-[70vh] mb-xl" />

      {/* Row skeleton */}
      <div className="py-xl">
        <Skeleton variant="text" className="w-48 h-5 mb-lg" />
        <div className="flex gap-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="card"
              className="flex-shrink-0 w-[250px] aspect-video"
            />
          ))}
        </div>
      </div>

      {/* Second row skeleton */}
      <div className="py-xl">
        <Skeleton variant="text" className="w-40 h-5 mb-lg" />
        <div className="flex gap-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="card"
              className="flex-shrink-0 w-[250px] aspect-video"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

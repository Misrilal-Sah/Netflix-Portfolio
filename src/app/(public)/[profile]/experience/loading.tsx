import { Skeleton } from "@/components/ui/skeleton";

export default function ExperienceLoading() {
  return (
    <div className="min-h-screen pt-[68px] px-[4vw] py-xl">
      <Skeleton variant="text" className="w-44 h-7 mb-lg" />
      <div className="space-y-md">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="w-full h-40 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

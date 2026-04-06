import { Skeleton } from "@/components/ui/skeleton";

export default function ContactLoading() {
  return (
    <div className="min-h-screen pt-[68px] px-[4vw] py-xl max-w-2xl">
      <Skeleton variant="text" className="w-32 h-7 mb-lg" />
      <div className="space-y-md">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-14 rounded-lg" />
        ))}
        <Skeleton variant="card" className="h-32 rounded-lg mt-md" />
      </div>
    </div>
  );
}

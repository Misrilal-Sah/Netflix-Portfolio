import { Skeleton } from "@/components/ui/skeleton";

export default function CertificationsLoading() {
  return (
    <div className="min-h-screen pt-[68px] px-[4vw] py-xl">
      <Skeleton variant="text" className="w-52 h-7 mb-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-48 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

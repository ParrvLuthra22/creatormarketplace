import Skeleton, { SkeletonCard } from "@/components/dashboard/Skeleton";

export default function BrandDashboardLoading() {
  return (
    <div className="space-y-6" aria-label="Loading">
      <Skeleton className="h-8 w-48" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

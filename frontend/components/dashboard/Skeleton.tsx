import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-(--bg-surface) rounded-lg animate-pulse",
        className
      )}
      aria-hidden
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonCreatorCard() {
  return (
    <div className="rounded-xl overflow-hidden border border-(--border)">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-4 space-y-2 bg-(--bg-secondary)">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

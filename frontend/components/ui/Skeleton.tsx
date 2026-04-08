import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-zinc-200 rounded-sm",
                className
            )}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-white border border-zinc-100 rounded-sm p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-md" />
                    <Skeleton className="w-24 h-4" />
                </div>
                <Skeleton className="w-20 h-6 rounded-md" />
            </div>
            <Skeleton className="w-full h-8 mb-4" />
            <div className="space-y-2">
                <Skeleton className="w-3/4 h-3" />
                <Skeleton className="w-1/2 h-3" />
            </div>
        </div>
    );
}

export function SkeletonStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-zinc-100 rounded-sm p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-md" />
                            <Skeleton className="w-20 h-3" />
                        </div>
                    </div>
                    <Skeleton className="w-32 h-10 mb-2" />
                    <Skeleton className="w-40 h-4" />
                </div>
            ))}
        </div>
    );
}

export function SkeletonCreatorCard() {
    return (
        <div className="aspect-[3/4.2] rounded-sm bg-white border border-zinc-100 overflow-hidden shadow-sm">
            <div className="h-2/3 bg-zinc-100 animate-pulse" />
            <div className="p-6">
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-1/2 h-4 mb-4" />
                <div className="flex justify-between items-center mt-auto">
                    <Skeleton className="w-10 h-10 rounded-full" />
                </div>
            </div>
        </div>
    );
}

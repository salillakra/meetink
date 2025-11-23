import { Skeleton } from "@/components/ui/skeleton";

export default function ConfessionsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="relative bg-linear-to-br from-gray-500/20 to-slate-500/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl overflow-hidden"
        >
          {/* Header - Category and Time */}
          <div className="flex justify-between items-start gap-3 mb-4">
            <Skeleton className="h-7 w-24 rounded-full bg-white/10" />
            <Skeleton className="h-7 w-28 rounded-full bg-white/10" />
          </div>

          {/* Content - Confession Text */}
          <div className="space-y-2 mb-6 min-h-20">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-3/4 bg-white/10" />
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/10">
            <Skeleton className="w-12 h-12 rounded-full bg-white/10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32 bg-white/10" />
              <Skeleton className="h-3 w-24 bg-white/10" />
            </div>
          </div>

          {/* Actions - Like and Comment Buttons */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-20 rounded-xl bg-white/10" />
            <Skeleton className="h-10 w-20 rounded-xl bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

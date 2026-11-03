
import { Skeleton } from "@/components/ui/skeleton"

function EventCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-3xl border border-border/50 bg-card">
            {/* Thumbnail */}
            <Skeleton className="h-52 w-full rounded-none" />

            <div className="space-y-4 p-5">
                {/* Category */}
                <Skeleton className="h-5 w-24 rounded-full" />

                {/* Title */}
                <div className="space-y-2">
                    <Skeleton className="h-6 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Location and Date */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                </div>

                {/* Button */}
                <Skeleton className="h-11 w-full rounded-full" />
            </div>
        </div>
    )
}

export default function UpcomingEventsSkeleton() {
    return (
        <div className="space-y-6">

            {/* Hero Skeleton */}
            <div className="relative overflow-hidden rounded-3xl bg-[#06382a] px-6 py-9 sm:px-10 sm:py-12">
                <Skeleton className="h-6 w-40 rounded-full bg-white/20" />

                <Skeleton className="mt-5 h-11 w-72 max-w-full bg-white/20" />

                <Skeleton className="mt-4 h-5 w-80 max-w-full bg-white/20" />

                {/* Search */}
                <Skeleton className="mt-7 h-13 w-full max-w-xl rounded-full bg-white/20" />
            </div>

            {/* Categories Skeleton */}
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: 7 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className="h-9 w-24 rounded-full"
                    />
                ))}
            </div>

            {/* Result Count */}
            <Skeleton className="h-4 w-40" />

            {/* Events Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <EventCardSkeleton key={index} />
                ))}
            </div>

        </div>
    )
}

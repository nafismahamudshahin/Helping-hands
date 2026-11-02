import { Skeleton } from "@/components/ui/skeleton"

export default function EventDetailsLoading() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading event details"
      className="min-h-full bg-[#f2faf5] px-4 py-4 text-[#12382d] dark:bg-[#081b15] dark:text-[#eff8f2] sm:px-6 sm:py-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1240px]">
        <Skeleton className="h-[190px] w-full rounded-[22px] sm:h-[250px] lg:h-[310px]" />

        <div className="grid gap-7 py-5 sm:py-7 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
          <div className="space-y-5">
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4 max-w-[440px]" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-full max-w-[420px]" />
            </div>

            <div className="space-y-3 pt-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-full max-w-[720px]" />
              <Skeleton className="h-4 w-11/12 max-w-[680px]" />
            </div>

            <div className="space-y-3 pt-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-10/12 max-w-[600px]" />
              <Skeleton className="h-4 w-9/12 max-w-[540px]" />
              <Skeleton className="h-4 w-8/12 max-w-[480px]" />
            </div>
          </div>

          <aside className="h-fit space-y-4 rounded-[22px] border border-[#e5efe8] bg-white p-5 shadow-[0_12px_30px_-20px_rgba(15,65,42,0.35)] dark:border-white/10 dark:bg-[#10251b] sm:p-6 lg:mt-2">
            <Skeleton className="h-11 w-full rounded-full" />
            <Skeleton className="h-4 w-32" />
            <div className="h-px bg-[#e8f0eb] dark:bg-white/10" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-2/3" />
          </aside>
        </div>
      </div>
    </section>
  )
}

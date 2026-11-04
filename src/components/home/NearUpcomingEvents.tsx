import Link from "next/link"
import { ArrowRight, CalendarOff } from "lucide-react"
import { connection } from "next/server"
import { Suspense } from "react"

import EventCard from "@/components/events/EventCard"
import { Skeleton } from "@/components/ui/skeleton"
import type { EventType } from "@/types"

async function getNearUpcomingEvents(): Promise<EventType[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/near-upcoming-events`,
            { cache: "no-store" }
        )

        if (!res.ok) throw new Error("Failed to fetch near upcoming events")

        const data = await res.json()

        return Array.isArray(data) ? data : data.events || []
    } catch (error) {
        console.error(error)
        return []
    }
}

async function UpcomingEventsGrid() {
    await connection()
    const events = await getNearUpcomingEvents()

    if (events.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center rounded-3xl border border-dashed border-emerald-900/15 bg-white/60 px-6 py-14 text-center backdrop-blur dark:border-white/15 dark:bg-white/3">
                <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                    <CalendarOff className="size-7" aria-hidden="true" />
                </span>
                <p className="text-base font-semibold">No upcoming events near you right now</p>
                <p className="mt-1 text-sm text-[#557368] dark:text-[#b3c9bf]">Check back soon!</p>
            </div>
        )
    }

    return events.map((event) => <EventCard key={event._id} event={event} />)
}

function EventsGridSkeleton() {
    return Array.from({ length: 3 }, (_, index) => (
        <div
            key={index}
            aria-hidden="true"
            className="overflow-hidden rounded-3xl border border-white/80 bg-white shadow-sm dark:border-white/10 dark:bg-[#10251b]"
        >
            <Skeleton className="aspect-16/10 w-full rounded-none" />
            <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/5" />
                <div className="flex items-center justify-between border-t pt-4">
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-8 w-28 rounded-full" />
                </div>
            </div>
        </div>
    ))
}

export default function NearUpcomingEvents() {
    return (
        <section className="bg-[#f4fbf6] px-5 pb-14 pt-4 text-[#092d23] transition-colors dark:bg-[#081b16] dark:text-[#f1f8f3] sm:px-8 sm:pb-20 lg:px-[6.65%]">
            <div className="mx-auto container">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#159b50] dark:text-[#55d788]">
                            Happening soon
                        </p>
                        <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                            Upcoming Events Near You
                        </h2>
                    </div>
                    <Link
                        href="/upcoming-events"
                        className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white/80 px-4 py-2 text-xs font-semibold text-[#078344] backdrop-blur transition hover:border-emerald-500 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-[#55d788] dark:hover:bg-white/10 sm:text-sm"
                    >
                        See All Events
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Suspense fallback={<EventsGridSkeleton />}>
                        <UpcomingEventsGrid />
                    </Suspense>
                </div>
            </div>
        </section>
    )
}
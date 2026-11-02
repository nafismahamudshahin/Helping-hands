import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, CalendarDays, Heart, MapPin, Users } from "lucide-react"

import type { EventType } from "@/types"
import { Button } from "@/components/ui/button"

const categoryStyles: Record<string, { pill: string; dot: string }> = {
    Environment: { pill: "text-green-800 dark:text-green-300", dot: "bg-green-500" },
    Education: { pill: "text-sky-800 dark:text-sky-300", dot: "bg-sky-500" },
    Health: { pill: "text-rose-700 dark:text-rose-300", dot: "bg-rose-500" },
    "Food Support": { pill: "text-lime-800 dark:text-lime-300", dot: "bg-lime-500" },
    "Winter Support": { pill: "text-emerald-800 dark:text-emerald-300", dot: "bg-emerald-500" },
    Community: { pill: "text-violet-800 dark:text-violet-300", dot: "bg-violet-500" },
}

const fallbackStyle = categoryStyles["Winter Support"]

function getDate(value: string) {
    const key = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
    const d = key ? new Date(`${key}T00:00:00`) : null
    return d && !Number.isNaN(d.getTime()) ? d : null
}

const EventCard = ({ event }: { event: EventType }) => {
    const style = categoryStyles[event.category] ?? fallbackStyle
    const d = getDate(event.date)

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_10px_40px_-24px_rgba(15,65,42,0.45)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(15,65,42,0.55)] dark:border-white/10 dark:bg-[#10251b]">
            {/* Cover */}
            <div className="relative aspect-[16/10] overflow-hidden bg-emerald-100 dark:bg-[#183629]">
                <Image
                    src={event.thumbnailUrl}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                    className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold shadow-sm backdrop-blur dark:bg-black/50 ${style.pill}`}>
                    <span className={`size-1.5 rounded-full ${style.dot}`} />
                    {event.category}
                </span>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Save ${event.title}`}
                    className="absolute right-3 top-3 size-9 rounded-full bg-white/90 text-[#38594a] shadow-sm backdrop-blur transition hover:scale-110 hover:bg-white hover:text-rose-600 dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
                >
                    <Heart className="size-4" />
                </Button>

                {d && (
                    <div className="absolute bottom-3 right-3 flex flex-col items-center rounded-2xl bg-white/95 px-3 py-1.5 text-center leading-none shadow-md backdrop-blur dark:bg-black/60">
                        <span className="text-lg font-bold text-[#0f3325] dark:text-white">
                            {d.toLocaleDateString("en-GB", { day: "2-digit" })}
                        </span>
                        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                            {d.toLocaleDateString("en-GB", { month: "short" })}
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-5">
                <h2 className="line-clamp-1 text-lg font-bold tracking-tight text-[#0f3325] dark:text-[#eff8f2]">
                    {event.title}
                </h2>

                <div className="mt-3 space-y-1.5 text-sm text-[#71877c] dark:text-[#a6bcb0]">
                    <p className="flex items-center gap-2">
                        <MapPin className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        <span className="truncate">{event.location}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <CalendarDays className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        {d
                            ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                            : event.date}
                    </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-emerald-900/10 pt-4 dark:border-white/10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        <Users className="size-3.5" aria-hidden="true" />
                        {event.joined} joined
                    </span>

                    <Button
                        render={<Link href={`/events/${encodeURIComponent(event._id)}`} />}
                        nativeButton={false}
                        size="sm"
                        className="rounded-full bg-emerald-600/10 px-4 text-xs font-semibold text-emerald-700 hover:bg-emerald-600 hover:text-white dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-500 dark:hover:text-white"
                    >
                        View Event
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Button>
                </div>
            </div>
        </article>
    )
}

export default EventCard
import Image from "next/image"
import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import {
    AlertTriangle,
    ArrowUpRight,
    CalendarCheck2,
    CalendarDays,
    CalendarOff,
    CheckCircle2,
    Clock3,
    History,
    MapPin,
    Sparkles,
} from "lucide-react"

import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LeaveEventButton } from "@/components/events/LeaveEventButton"
import { formatDate, getDate } from "@/commonfeatures/common-function"

type JoinRecord = {
    _id: string
    eventId: string
    joinDate: string
}

type EventInfo = {
    title: string
    date: string
    location: string
    thumbnail?: string
}

type JoinedItem = { join: JoinRecord; event: EventInfo | null }

type Status = "Upcoming" | "Ongoing" | "Completed"

const FALLBACK_IMG = "/images/event-community-volunteers.jpg"

const STATUS_STYLES: Record<Status, { pill: string; dot: string }> = {
    Upcoming: { pill: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
    Ongoing: { pill: "text-sky-700 dark:text-sky-300", dot: "bg-sky-500 animate-pulse" },
    Completed: { pill: "text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
}

const TONES = {
    green: "from-emerald-400 to-green-600 shadow-emerald-500/30",
    blue: "from-sky-400 to-blue-600 shadow-sky-500/30",
    slate: "from-slate-400 to-slate-600 shadow-slate-500/30",
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

/** Fetch a single event once. Returns null if deleted / unreachable. */
async function getEvent(apiUrl: string, eventId: string, token: string): Promise<EventInfo | null> {
    try {
        const res = await fetch(`${apiUrl}/events/${encodeURIComponent(eventId)}`, {
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        if (!res.ok) return null

        const payload: unknown = await res.json()
        const record = isRecord(payload) && isRecord(payload.event) ? payload.event : payload
        if (!isRecord(record)) return null

        if (
            typeof record.title !== "string" ||
            typeof record.date !== "string" ||
            typeof record.location !== "string"
        ) return null

        const thumbnail = record.thumbnailUrl ?? record.thumbnail ?? record.image
        return {
            title: record.title,
            date: record.date,
            location: record.location,
            thumbnail: typeof thumbnail === "string" ? thumbnail : undefined,
        }
    } catch {
        return null
    }
}

async function getJoinedEvents(userId: string): Promise<{ items: JoinedItem[]; error?: string }> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) return { items: [], error: "The events service is not configured." }

    try {
        const { token } = await auth.api.getToken({ headers: await headers() })
        if (!token) throw new Error("No authentication token is available.")

        const res = await fetch(`${apiUrl}/participants/me/${encodeURIComponent(userId)}`, {
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        if (!res.ok) throw new Error(`Joined events request failed with status ${res.status}.`)

        const payload: unknown = await res.json()
        const records = Array.isArray(payload)
            ? payload
            : isRecord(payload) && Array.isArray(payload.events)
                ? payload.events
                : []

        const joins = records.flatMap((r): JoinRecord[] => {
            if (!isRecord(r)) return []
            if (typeof r._id !== "string" || typeof r.eventId !== "string") return []
            return [{
                _id: r._id,
                eventId: r.eventId,
                joinDate: typeof r.joinDate === "string" ? r.joinDate : "",
            }]
        })

        // newest joins first
        joins.sort((a, b) => b.joinDate.localeCompare(a.joinDate))

        // fetch each unique event once, in parallel
        const uniqueIds = [...new Set(joins.map((j) => j.eventId))]
        const entries = await Promise.all(
            uniqueIds.map(async (id) => [id, await getEvent(apiUrl, id, token)] as const),
        )
        const eventMap = new Map(entries)
        return { items: joins.map((join) => ({ join, event: eventMap.get(join.eventId) ?? null })) }
    } catch (error) {
        console.error("Unable to load joined events:", error)
        return { items: [], error: "We couldn’t load your joined events. Please try again later." }
    }
}

// en-CA gives YYYY-MM-DD


function getStatus(date: string, today: string): Status {
    const key = dateKey(date)
    if (!key || key > today) return "Upcoming"
    return key === today ? "Ongoing" : "Completed"
}

function StateBox({ icon: Icon, title, text, children, alert }: {
    icon: typeof CalendarOff
    title: string
    text: string
    children?: React.ReactNode
    alert?: boolean
}) {
    return (
        <div
            role={alert ? "alert" : undefined}
            className="flex flex-col items-center rounded-3xl border border-dashed border-emerald-900/15 bg-white/60 px-6 py-16 text-center backdrop-blur dark:border-white/15 dark:bg-white/3"
        >
            <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                <Icon className="size-7" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{text}</p>
            {children}
        </div>
    )
}
const dhakaFmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
}) // en-CA => YYYY-MM-DD

export function todayInDhaka(): string {
    return dhakaFmt.format(new Date())
}
export function dateKey(value: string): string | null {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return null
    return dhakaFmt.format(d)
}

export default async function MyJoinEventsPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) redirect("/login")

    const { items, error } = await getJoinedEvents(session.user.id)
    const today = todayInDhaka()
    const sortedItems = [...items].sort((a, b) => {
        const ak = a.event ? dateKey(a.event.date) : null
        const bk = b.event ? dateKey(b.event.date) : null

        // Deleted/invalid events go last
        if (!ak && !bk) return 0
        if (!ak) return 1
        if (!bk) return -1

        const aDone = ak < today
        const bDone = bk < today

        // Upcoming/ongoing before completed
        if (aDone !== bDone) return aDone ? 1 : -1

        // Upcoming: soonest first. Completed: most recent first.
        return aDone ? bk.localeCompare(ak) : ak.localeCompare(bk)
    })

    const statusOf = (i: JoinedItem) => (i.event ? getStatus(i.event.date, today) : null)
    const count = (s: Status) => sortedItems.filter((i) => statusOf(i) === s).length

    const summary = [
        { label: "Events joined", value: sortedItems.length, Icon: CalendarCheck2, tone: "green" },
        { label: "Upcoming", value: count("Upcoming") + count("Ongoing"), Icon: Clock3, tone: "blue" },
        { label: "Attended", value: count("Completed"), Icon: CheckCircle2, tone: "slate" },
    ] as const

    return (
        <section className="relative isolate min-h-full overflow-hidden bg-linear-to-b from-[#e9f8ef] via-[#f5fbf7] to-[#f5fbf7] px-5 py-8 text-[#0f3325] dark:from-[#06150f] dark:via-[#081b16] dark:to-[#081b16] dark:text-[#eff8f2] sm:px-8 sm:py-12 lg:px-[6.65%]">
            {/* Decorative glow */}
            <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-140 -translate-x-1/2 rounded-full bg-emerald-400/25 blur-[120px] dark:bg-emerald-500/15" />

            <div className="mx-auto container space-y-10">
                {/* Header */}
                <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/15 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 backdrop-blur dark:border-emerald-300/20 dark:bg-white/5 dark:text-emerald-300">
                            <Sparkles className="size-3.5" aria-hidden="true" />
                            Your impact
                        </span>
                        <h1 className="mt-4 bg-linear-to-r from-[#0f3325] via-emerald-700 to-emerald-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-white dark:via-emerald-200 dark:to-emerald-400 md:text-5xl">
                            Joined Events
                        </h1>
                        <p className="mt-3 max-w-xl text-base text-muted-foreground">
                            Every event you&apos;ve signed up for, all in one place.
                        </p>
                    </div>

                    <Button
                        render={<Link href="/upcoming-events" />}
                        nativeButton={false}
                        className="h-11 rounded-full bg-linear-to-r from-emerald-500 to-green-600 px-6 text-white shadow-lg shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/40"
                    >
                        <History className="size-4" aria-hidden="true" />
                        Find more events
                    </Button>
                </header>

                {/* Stats */}
                <dl className="grid gap-4 sm:grid-cols-3">
                    {summary.map(({ label, value, Icon, tone }) => (
                        <div
                            key={label}
                            className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_10px_40px_-20px_rgba(15,65,42,0.35)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(15,65,42,0.45)] dark:border-white/10 dark:bg-white/4"
                        >
                            <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg ${TONES[tone]}`}>
                                <Icon className="size-6" aria-hidden="true" />
                            </span>
                            <div>
                                <dd className="text-3xl font-bold leading-none tracking-tight">{value}</dd>
                                <dt className="mt-1.5 text-sm font-medium text-muted-foreground">{label}</dt>
                            </div>
                        </div>
                    ))}
                </dl>

                {/* Events */}
                {error ? (
                    <StateBox alert icon={AlertTriangle} title="Events unavailable" text={error} />
                ) : sortedItems.length === 0 ? (
                    <StateBox icon={CalendarOff} title="No Joined Events" text="You haven't joined any events yet. Find one that matters to you.">
                        <Button
                            render={<Link href="/events" />}
                            nativeButton={false}
                            className="mt-6 rounded-full bg-linear-to-r from-emerald-500 to-green-600 px-6 text-white shadow-md shadow-emerald-600/30"
                        >
                            Browse Events
                        </Button>
                    </StateBox>
                ) : (
                    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {sortedItems.map(({ join, event }) => {
                            const status = event ? getStatus(event.date, today) : null
                            const style = status ? STATUS_STYLES[status] : null
                            const d = event ? getDate(event.date) : null

                            return (
                                <li key={join._id}>
                                    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_10px_40px_-24px_rgba(15,65,42,0.45)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(15,65,42,0.55)] dark:border-white/10 dark:bg-[#10251b]">
                                        {/* Cover */}
                                        <div className="relative aspect-16/10 overflow-hidden bg-emerald-100 dark:bg-[#183629]">
                                            <Image
                                                src={event?.thumbnail || FALLBACK_IMG}
                                                alt=""
                                                fill
                                                sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
                                                unoptimized
                                                className="object-cover transition duration-500 group-hover:scale-105"
                                            />
                                            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                                            {status && style && (
                                                <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur dark:bg-black/50 ${style.pill}`}>
                                                    <span className={`size-1.5 rounded-full ${style.dot}`} />
                                                    {status}
                                                </span>
                                            )}

                                            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
                                                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                                                Joined
                                            </span>

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
                                            <h3 className="line-clamp-1 text-lg font-bold tracking-tight">
                                                {event?.title ?? "Event no longer available"}
                                            </h3>

                                            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                                                {event && (
                                                    <>
                                                        <p className="flex items-center gap-2">
                                                            <CalendarDays className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                                            {formatDate(event.date)}
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <MapPin className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                                            <span className="truncate">{event.location}</span>
                                                        </p>
                                                    </>
                                                )}
                                                {join.joinDate && (
                                                    <p className="flex items-center gap-2">
                                                        <Clock3 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                                        Joined on {formatDate(join.joinDate)}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="mt-5 flex items-center justify-between gap-2 border-t border-emerald-900/10 pt-4 dark:border-white/10">
                                                {event ? (
                                                    <Button
                                                        render={<Link href={`/events/${encodeURIComponent(join.eventId)}`} />}
                                                        nativeButton={false}
                                                        size="sm"
                                                        className="rounded-full bg-emerald-600/10 px-4 text-emerald-700 hover:bg-emerald-600 hover:text-white dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-500 dark:hover:text-white"
                                                    >
                                                        View Event
                                                        <ArrowUpRight className="size-4" aria-hidden="true" />
                                                    </Button>
                                                ) : (
                                                    <span />
                                                )}

                                                {status !== "Completed" && (
                                                    <LeaveEventButton joinId={join._id} event={event as EventInfo} />
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </section>
    )
}

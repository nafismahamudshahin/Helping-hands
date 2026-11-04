import Image from "next/image"
import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import {
    AlertTriangle,
    ArrowUpRight,
    CalendarDays,
    CalendarOff,
    CalendarRange,
    CheckCircle2,
    Clock3,
    MapPin,
    Plus,
    Sparkles,
} from "lucide-react"

import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import EditEvent from "@/components/events/EditEvent"
import { EventType } from "@/types"
import DeleteEvent from "@/components/events/ DeleteEvent"
import { getServerJwtToken } from "@/lib/getServerJwtToken"


type Status = "Upcoming" | "Ongoing" | "Completed"

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

async function getMyEvents(userId: string): Promise<{ events: EventType[]; error?: string }> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return { events: [], error: "The events service is not configured." }
    const token = await getServerJwtToken();
    console.log("Token: ", token)
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/my/${userId}`, {
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (!res.ok) throw new Error(`Events request failed with status ${res.status}.`)
        const data: EventType[] = await res.json();
        const events = data
        return { events }
    } catch (error) {
        console.error("Unable to load the user's events:", error)
        return { events: [], error: "We couldn’t load your events. Please try again later." }
    }
}

const dateKey = (v: string) => v.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? null

// en-CA gives YYYY-MM-DD
const todayInDhaka = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(new Date())

function getDate(v: string) {
    const key = dateKey(v)
    const d = key ? new Date(`${key}T00:00:00`) : null
    return d && !Number.isNaN(d.getTime()) ? d : null
}

function formatEventDate(v: string) {
    return getDate(v)?.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) ?? v
}

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

export default async function ManageEventPage() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) redirect("/login")

    const { events, error } = await getMyEvents(session.user.id)
    const sortedEvents = events.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const today = todayInDhaka()
    const count = (s: Status) => events.filter((e) => dateKey(e.date) && getStatus(e.date, today) === s).length

    const summary = [
        { label: "Total events", value: events.length, Icon: CalendarRange, tone: "green" },
        { label: "Upcoming", value: count("Upcoming"), Icon: Clock3, tone: "blue" },
        { label: "Completed", value: count("Completed"), Icon: CheckCircle2, tone: "slate" },
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
                            Your workspace
                        </span>
                        <h1 className="mt-4 bg-linear-to-r from-[#0f3325] via-emerald-700 to-emerald-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-white dark:via-emerald-200 dark:to-emerald-400 md:text-5xl">
                            Manage Events
                        </h1>
                        <p className="mt-3 max-w-xl text-base text-muted-foreground">
                            Track, review and organize every event you have created in one place.
                        </p>
                    </div>

                    <Button
                        render={<Link href="/create-event" />}
                        nativeButton={false}
                        className="h-11 rounded-full bg-linear-to-r from-emerald-500 to-green-600 px-6 text-white shadow-lg shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/40"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Create Event
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
                ) : sortedEvents.length === 0 ? (
                    <StateBox icon={CalendarOff} title="No Events Found" text="You haven't created any events yet. Start with your first one.">
                        <Button
                            render={<Link href="/create-event" />}
                            nativeButton={false}
                            className="mt-6 rounded-full bg-linear-to-r from-emerald-500 to-green-600 px-6 text-white shadow-md shadow-emerald-600/30"
                        >
                            Create Your First Event
                        </Button>
                    </StateBox>
                ) : (
                    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {sortedEvents.map((event) => {
                            const status = getStatus(event.date, today)
                            const style = STATUS_STYLES[status]
                            const d = getDate(event.date)

                            return (
                                <li key={event._id}>
                                    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_10px_40px_-24px_rgba(15,65,42,0.45)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(15,65,42,0.55)] dark:border-white/10 dark:bg-[#10251b]">
                                        {/* Cover */}
                                        <div className="relative aspect-16/10 overflow-hidden bg-emerald-100 dark:bg-[#183629]">
                                            <Image
                                                src={event.thumbnailUrl}
                                                alt=""
                                                fill
                                                sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
                                                unoptimized
                                                className="object-cover transition duration-500 group-hover:scale-105"
                                            />
                                            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                                            <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur dark:bg-black/50 ${style.pill}`}>
                                                <span className={`size-1.5 rounded-full ${style.dot}`} />
                                                {status}
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
                                            <h3 className="line-clamp-1 text-lg font-bold tracking-tight">{event.title}</h3>

                                            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                                                <p className="flex items-center gap-2">
                                                    <CalendarDays className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                                    {formatEventDate(event.date)}
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <MapPin className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                                    <span className="truncate">{event.location}</span>
                                                </p>
                                            </div>

                                            <div className="mt-5 flex items-center justify-between border-t border-emerald-900/10 pt-4 dark:border-white/10">
                                                <Button
                                                    render={<Link href={`/events/${encodeURIComponent(event._id)}`} />}
                                                    nativeButton={false}
                                                    size="sm"
                                                    className="rounded-full bg-emerald-600/10 px-4 text-emerald-700 hover:bg-emerald-600 hover:text-white dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-500 dark:hover:text-white"
                                                >
                                                    View Event
                                                    <ArrowUpRight className="size-4" aria-hidden="true" />
                                                </Button>

                                                <div className="flex gap-1">
                                                    <EditEvent event={event}></EditEvent>
                                                    <DeleteEvent event={event}></DeleteEvent>
                                                </div>
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

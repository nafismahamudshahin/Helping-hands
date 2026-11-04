"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, CalendarOff, ChevronDown, Search, SearchX, Sparkles, X } from "lucide-react"

import EventCard from "@/components/events/EventCard"
import type { EventType } from "@/types"

const categories = [
    "All Events",
    "Environment",
    "Education",
    "Health",
    "Food Support",
    "Winter Support",
    "Community",
]

const statuses = ["All", "Upcoming", "Ongoing", "Completed"] as const
type StatusFilter = (typeof statuses)[number]

const sorts = {
    soonest: "Soonest first",
    latest: "Latest first",
    popular: "Most joined",
} as const
type SortKey = keyof typeof sorts

const dateKey = (v: string) => v.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? null

// en-CA gives YYYY-MM-DD
const todayInDhaka = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(new Date())

function getStatus(date: string, today: string): Exclude<StatusFilter, "All"> {
    const key = dateKey(date)
    if (!key || key > today) return "Upcoming"
    return key === today ? "Ongoing" : "Completed"
}

function StateBox({
    icon: Icon,
    title,
    text,
    tone = "green",
    alert,
}: {
    icon: typeof CalendarOff
    title: string
    text: string
    tone?: "green" | "red"
    alert?: boolean
}) {
    const red = tone === "red"
    return (
        <div
            role={alert ? "alert" : undefined}
            className={`col-span-full flex flex-col items-center rounded-3xl border border-dashed px-6 py-16 text-center backdrop-blur ${red
                ? "border-red-300/60 bg-red-50/60 dark:border-red-900/60 dark:bg-red-950/20"
                : "border-emerald-900/15 bg-white/60 dark:border-white/15 dark:bg-white/[0.03]"
                }`}
        >
            <span className={`mb-4 flex size-14 items-center justify-center rounded-2xl ${red ? "bg-red-500/10 text-red-600 dark:text-red-300" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"}`}>
                <Icon className="size-7" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{text}</p>
        </div>
    )
}

export function AllEventsBrowser({ events, error }: { events: EventType[]; error?: string }) {
    const [category, setCategory] = useState("All Events")
    const [status, setStatus] = useState<StatusFilter>("All")
    const [sort, setSort] = useState<SortKey>("soonest")
    const [query, setQuery] = useState("")

    const today = useMemo(todayInDhaka, [])

    const counts = useMemo(() => {
        const c = { Upcoming: 0, Ongoing: 0, Completed: 0 }
        events.forEach((e) => c[getStatus(e.date, today)]++)
        return c
    }, [events, today])

    const filtered = useMemo(() => {
        const q = query.trim().toLocaleLowerCase()

        return events
            .filter((e) => {
                const matchesCategory = category === "All Events" || e.category === category
                const matchesStatus = status === "All" || getStatus(e.date, today) === status
                const matchesSearch =
                    !q || [e.title, e.category, e.location].some((v) => v?.toLocaleLowerCase().includes(q))
                return matchesCategory && matchesStatus && matchesSearch
            })
            .sort((a, b) => {
                if (sort === "popular") return (b.joined ?? 0) - (a.joined ?? 0)
                const diff = (dateKey(a.date) ?? "").localeCompare(dateKey(b.date) ?? "")
                return sort === "soonest" ? diff : -diff
            })
    }, [events, category, status, sort, query, today])

    const hasFilters = category !== "All Events" || status !== "All" || query !== ""
    const reset = () => {
        setCategory("All Events")
        setStatus("All")
        setQuery("")
    }

    return (
        <>
            {/* Hero */}
            <div className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-[#06382a] via-[#0a5a41] to-[#12915a] px-6 py-9 text-white shadow-[0_24px_60px_-28px_rgba(8,70,51,0.8)] sm:px-8 sm:py-12">
                <div aria-hidden="true" className="absolute -right-16 -top-20 -z-10 size-72 rounded-full bg-emerald-300/25 blur-3xl" />
                <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />

                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100 backdrop-blur">
                            <Sparkles className="size-3.5" aria-hidden="true" />
                            Everything in one place
                        </span>
                        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">All Events</h1>
                        <p className="mt-3 max-w-xl text-base text-emerald-50/85">
                            Browse every social development event, past, present and upcoming.
                        </p>
                    </div>

                    <dl className="grid w-full grid-cols-3 gap-2 sm:gap-3 md:flex md:w-auto">
                        {[
                            ["Total", events.length],
                            ["Upcoming", counts.Upcoming],
                            ["Done", counts.Completed],
                        ].map(([label, value]) => (
                            <div key={label} className="min-w-0 rounded-2xl border border-white/20 bg-white/10 px-2 py-3 text-center backdrop-blur sm:px-4 md:min-w-20">
                                <dd className="text-xl font-extrabold leading-none sm:text-2xl">{value}</dd>
                                <dt className="mt-1 text-[11px] font-medium text-emerald-100/80">{label}</dt>
                            </div>
                        ))}
                    </dl>
                </div>

                <label className="relative mt-7 block max-w-xl">
                    <span className="sr-only">Search events</span>
                    <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-emerald-700" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by title, category or location"
                        className="h-13 w-full rounded-full border border-white/30 bg-white/95 py-3.5 pl-12 pr-11 text-sm text-[#183c30] shadow-xl shadow-black/10 outline-none transition placeholder:text-[#8a9b92] focus-visible:ring-4 focus-visible:ring-emerald-300/50 [&::-webkit-search-cancel-button]:hidden"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-[#71877d] transition hover:bg-emerald-100 hover:text-emerald-800"
                        >
                            <X className="size-4" aria-hidden="true" />
                        </button>
                    )}
                </label>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div role="group" aria-label="Event status" className="grid w-full grid-cols-4 rounded-full border border-emerald-900/10 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:inline-flex sm:w-fit">
                    {statuses.map((s) => (
                        <button
                            key={s}
                            type="button"
                            aria-pressed={status === s}
                            onClick={() => setStatus(s)}
                            className={`rounded-full px-1 py-1.5 text-[11px] font-semibold transition sm:px-4 sm:text-xs ${status === s
                                ? "bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-600/30"
                                : "text-[#315747] hover:bg-emerald-50 dark:text-[#d5eadc] dark:hover:bg-white/10"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <label className="relative flex w-full items-center sm:inline-flex sm:w-fit">
                    <span className="sr-only">Sort events</span>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        className="h-10 w-full cursor-pointer appearance-none rounded-full border border-emerald-900/10 bg-white/80 py-2 pl-4 pr-10 text-xs font-semibold text-[#315747] shadow-sm outline-none backdrop-blur transition hover:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-500/15 dark:border-white/10 dark:bg-[#10251b] dark:text-[#d5eadc]"
                    >
                        {Object.entries(sorts).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 size-4 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
                </label>
            </div>

            <nav aria-label="Event categories" className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
                {categories.map((c) => {
                    const active = category === c
                    return (
                        <button
                            key={c}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setCategory(c)}
                            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition duration-200 ${active
                                ? "border-transparent bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-600/30"
                                : "border-emerald-900/10 bg-white/80 text-[#315747] hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/5 dark:text-[#d5eadc] dark:hover:bg-white/10"
                                }`}
                        >
                            {c}
                        </button>
                    )
                })}
            </nav>

            {!error && events.length > 0 && (
                <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted-foreground" aria-live="polite">
                    <p>
                        Showing <span className="font-semibold text-[#0f3325] dark:text-[#eff8f2]">{filtered.length}</span> of {events.length} events
                    </p>
                    {hasFilters && (
                        <button type="button" onClick={reset} className="shrink-0 font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300">
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* Grid */}
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {error ? (
                    <StateBox alert tone="red" icon={AlertTriangle} title="Events couldn’t be loaded" text={error} />
                ) : filtered.length ? (
                    filtered.map((event) => <EventCard key={event._id} event={event} />)
                ) : events.length ? (
                    <StateBox icon={SearchX} title="No matching events" text="Try another search term, status or category." />
                ) : (
                    <StateBox icon={CalendarOff} title="No events available" text="Check back later for new events." />
                )}
            </div>
        </>
    )
}
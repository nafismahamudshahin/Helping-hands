"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, CalendarOff, SearchX, Search, Sparkles, X } from "lucide-react"

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
        : "border-emerald-900/15 bg-white/60 dark:border-white/15 dark:bg-white/3"
        }`}
    >
      <span
        className={`mb-4 flex size-14 items-center justify-center rounded-2xl ${red
          ? "bg-red-500/10 text-red-600 dark:text-red-300"
          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
          }`}
      >
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-semibold text-[#0f3325] dark:text-[#eff8f2]">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export function UpcomingEventsBrowser({ events, error }: {
  events: EventType[]
  error?: string
}) {
  const [activeCategory, setActiveCategory] = useState("All Events")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase()

    return events.filter((event) => {
      const matchesCategory =
        activeCategory === "All Events" || event.category === activeCategory
      const matchesSearch =
        !query ||
        [event.title, event.category, event.location].some((value) =>
          value.toLocaleLowerCase().includes(query)
        )

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, events, searchQuery])

  return (
    <>
      {/* Hero */}
      <div className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-[#06382a] via-[#0a5a41] to-[#12915a] px-6 py-9 text-white shadow-[0_24px_60px_-28px_rgba(8,70,51,0.8)] sm:px-10 sm:py-12">
        <div aria-hidden="true" className="absolute -right-16 -top-20 -z-10 size-72 rounded-full bg-emerald-300/25 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-24 left-1/3 -z-10 size-72 rounded-full bg-green-200/15 blur-3xl" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.08] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[22px_22px]"
        />

        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100 backdrop-blur">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Make a difference nearby
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Upcoming Events
        </h1>
        <p className="mt-3 max-w-xl text-base text-emerald-50/85">
          Find and join social development events near you.
        </p>

        <label className="relative mt-7 block max-w-xl">
          <span className="sr-only">Search events</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-emerald-700"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search events (e.g. tree plantation, food drive)"
            className="h-13 w-full rounded-full border border-white/30 bg-white/95 py-3.5 pl-12 pr-11 text-sm text-[#183c30] shadow-xl shadow-black/10 outline-none transition placeholder:text-[#8a9b92] focus-visible:ring-4 focus-visible:ring-emerald-300/50 [&::-webkit-search-cancel-button]:hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-[#71877d] transition hover:bg-emerald-100 hover:text-emerald-800"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </label>
      </div>

      {/* Categories */}
      <nav
        aria-label="Event categories"
        className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition duration-200 ${isActive
                ? "border-transparent bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-600/30"
                : "border-emerald-900/10 bg-white/80 text-[#315747] hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/5 dark:text-[#d5eadc] dark:hover:bg-white/10"
                }`}
            >
              {category}
            </button>
          )
        })}
      </nav>

      {!error && events.length > 0 && (
        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          Showing <span className="font-semibold text-[#0f3325] dark:text-[#eff8f2]">{filteredEvents.length}</span>{" "}
          of {events.length} events
        </p>
      )}

      {/* Grid */}
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {error ? (
          <StateBox alert tone="red" icon={AlertTriangle} title="Events couldn’t be loaded" text={error} />
        ) : filteredEvents.length ? (
          filteredEvents.map((event) => <EventCard key={event._id} event={event} />)
        ) : events.length ? (
          <StateBox icon={SearchX} title="No matching events" text="Try another search term or category." />
        ) : (
          <StateBox icon={CalendarOff} title="No events available" text="Check back later for upcoming events." />
        )}
      </div>
    </>
  )
}
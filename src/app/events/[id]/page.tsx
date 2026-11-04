import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
    ArrowLeft,
    BadgeCheck,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock3,
    HandHeart,
    HeartHandshake,
    MapPin,
    ShieldCheck,
    Sparkles,
    Users,
} from "lucide-react"
import JoinAction from "@/components/events/JoinAction"

async function getEvent(id: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) throw new Error("The events service is not configured.")

    const res = await fetch(`${apiUrl}/events/${id}`, {
        cache: "no-store",
    })

    // Missing or invalid ID -> treat as not found
    if (res.status === 404 || res.status === 400) return null
    if (!res.ok) throw new Error(`Failed to fetch event (status ${res.status})`)

    const data = await res.json()
    const event = data?.event ?? data

    if (!event || typeof event !== "object" || !event.title) return null

    return event
}

const FALLBACK_IMG = "/images/event-community-volunteers.jpg"

const SCHEDULE = [
    { step: "Arrival & check-in", note: "Meet the team, grab your volunteer badge and a quick welcome." },
    { step: "Safety briefing", note: "A short introduction to the goals, roles and safety guidelines." },
    { step: "Main activity", note: "Work together in small groups with an experienced team lead." },
    { step: "Wrap-up & thanks", note: "Share the day’s impact, take a group photo and say goodbye." },
]

const BRING = [
    { emoji: "💧", label: "Water bottle" },
    { emoji: "👟", label: "Comfortable shoes" },
    { emoji: "🧢", label: "Hat or cap" },
    { emoji: "🧴", label: "Sunscreen" },
    { emoji: "🪪", label: "Photo ID" },
    { emoji: "😊", label: "Positive attitude" },
]

const FAQ = [
    { q: "Do I need any prior experience?", a: "No. Every volunteer gets a short briefing and support from a team lead on the day." },
    { q: "Is food or water provided?", a: "Light refreshments are usually available, but we recommend bringing your own water bottle." },
    { q: "What if I can’t make it anymore?", a: "You can leave the event any time from your Joined Events page so someone else can take your spot." },
]

const ORGANIZER = { name: "HelpingHands Community Team", role: "Verified organizer", initials: "HH" }

const AVATARS = [
    { i: "AR", c: "from-emerald-400 to-green-600" },
    { i: "SN", c: "from-sky-400 to-blue-600" },
    { i: "MK", c: "from-amber-400 to-orange-500" },
    { i: "TJ", c: "from-fuchsia-400 to-pink-600" },
]

function formatLongDate(v?: string) {
    if (!v) return null
    const key = v.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
    const d = key ? new Date(`${key}T00:00:00`) : null
    if (!d || Number.isNaN(d.getTime())) return v
    return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

const CARD =
    "rounded-3xl border border-white/80 bg-white shadow-[0_10px_40px_-24px_rgba(15,65,42,0.45)] dark:border-white/10 dark:bg-[#10251b]"

function SectionTitle({ icon: Icon, children }: { icon: typeof Sparkles; children: React.ReactNode }) {
    return (
        <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                <Icon className="size-[18px]" aria-hidden="true" />
            </span>
            {children}
        </h2>
    )
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                <Icon className="size-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-sm font-semibold leading-snug">{value}</p>
            </div>
        </div>
    )
}


export default async function EventDetailsPage({ params }: PageProps<"/events/[id]">) {
    const { id } = await params

    const event = await getEvent(id)
    if (!event) notFound()

    const joined: number = Number(event.joined ?? 0)
    const slots: number | null = event.volunteerSlots != null ? Number(event.volunteerSlots) : null
    const pct = slots && slots > 0 ? Math.min(100, Math.round((joined / slots) * 100)) : null
    const spotsLeft = slots != null ? Math.max(0, slots - joined) : null
    const activities: string[] = Array.isArray(event.activities) ? event.activities : []
    const longDate = formatLongDate(event.date)

    return (
        <section className="relative isolate min-h-screen overflow-hidden bg-gradient-to-b from-[#e9f8ef] via-[#f5fbf7] to-[#f5fbf7] px-5 py-6 text-[#0f3325] dark:from-[#06150f] dark:via-[#081b16] dark:to-[#081b16] dark:text-[#eff8f2] sm:px-8 sm:py-8 lg:px-[6.65%]">
            <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[560px] -translate-x-1/2 rounded-full bg-emerald-400/25 blur-[120px] dark:bg-emerald-500/15" />

            <div className="mx-auto container space-y-8">
                {/* Back link */}
                <Link
                    href="/upcoming-events"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur transition hover:text-emerald-700 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-emerald-300"
                >
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                    All events
                </Link>

                {/* Hero */}
                <header className="relative isolate overflow-hidden rounded-[2rem] shadow-[0_30px_70px_-30px_rgba(5,80,50,0.6)]">
                    <div className="relative h-[320px] sm:h-[400px]">
                        <Image
                            src={event.thumbnailUrl || FALLBACK_IMG}
                            alt=""
                            fill
                            priority
                            unoptimized
                            sizes="(min-width: 1280px) 1240px, 100vw"
                            className="object-cover"
                        />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#04150d]/90 via-[#04150d]/40 to-transparent" />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                        <div className="flex flex-wrap items-center gap-2">
                            {event.category && (
                                <span className="rounded-full bg-emerald-500 px-3.5 py-1 text-xs font-semibold shadow-lg shadow-emerald-900/30">
                                    {event.category}
                                </span>
                            )}
                            {spotsLeft != null && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold backdrop-blur">
                                    <span className={`size-1.5 rounded-full ${spotsLeft > 0 ? "bg-emerald-300 animate-pulse" : "bg-red-400"}`} />
                                    {spotsLeft > 0 ? `${spotsLeft} spots left` : "Fully booked"}
                                </span>
                            )}
                        </div>

                        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight drop-shadow sm:text-5xl">
                            {event.title}
                        </h1>

                        <div className="mt-4 flex flex-wrap gap-2 text-sm">
                            {longDate && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 backdrop-blur">
                                    <CalendarDays className="size-4" aria-hidden="true" />
                                    {longDate}
                                </span>
                            )}
                            {event.time && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 backdrop-blur">
                                    <Clock3 className="size-4" aria-hidden="true" />
                                    {event.time}
                                </span>
                            )}
                            {event.location && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 backdrop-blur">
                                    <MapPin className="size-4" aria-hidden="true" />
                                    {event.location}
                                </span>
                            )}
                        </div>
                    </div>
                </header>

                <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
                    {/* ------------------------------ Main column ------------------------------ */}
                    <div className="space-y-8">
                        {/* Quick stats */}
                        <dl className="grid grid-cols-3 gap-3 sm:gap-4">
                            {[
                                { Icon: Users, value: joined, label: "Joined" },
                                { Icon: HandHeart, value: slots ?? "Open", label: "Volunteer slots" },
                                { Icon: Clock3, value: "3–4 hrs", label: "Time needed" },
                            ].map(({ Icon, value, label }) => (
                                <div key={label} className={`${CARD} p-4 text-center sm:p-5`}>
                                    <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/30">
                                        <Icon className="size-5" aria-hidden="true" />
                                    </span>
                                    <dd className="mt-3 text-xl font-extrabold leading-none sm:text-2xl">{value}</dd>
                                    <dt className="mt-1.5 text-xs font-medium text-muted-foreground">{label}</dt>
                                </div>
                            ))}
                        </dl>

                        {/* About */}
                        {event.description && (
                            <article className={`${CARD} space-y-4 p-6 sm:p-8`}>
                                <SectionTitle icon={Sparkles}>About this event</SectionTitle>
                                <p className="whitespace-pre-line leading-8 text-muted-foreground">{event.description}</p>
                            </article>
                        )}

                        {/* Activities */}
                        {activities.length > 0 && (
                            <article className={`${CARD} space-y-5 p-6 sm:p-8`}>
                                <SectionTitle icon={HeartHandshake}>What you&apos;ll do</SectionTitle>
                                <ul className="grid gap-3 sm:grid-cols-2">
                                    {activities.map((activity, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 rounded-2xl bg-emerald-50/80 p-4 transition hover:bg-emerald-100/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
                                        >
                                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                            <span className="text-sm font-medium leading-6">{activity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        )}

                        {/* Schedule (static) */}
                        <article className={`${CARD} space-y-6 p-6 sm:p-8`}>
                            <SectionTitle icon={Clock3}>How the day works</SectionTitle>
                            <ol className="relative space-y-6 border-l-2 border-dashed border-emerald-500/30 pl-7">
                                {SCHEDULE.map((s, i) => (
                                    <li key={s.step} className="relative">
                                        <span className="absolute -left-[2.35rem] flex size-8 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-green-600 text-sm font-bold text-white shadow-md shadow-emerald-500/30 ring-4 ring-white dark:ring-[#10251b]">
                                            {i + 1}
                                        </span>
                                        <h3 className="font-bold">{s.step}</h3>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{s.note}</p>
                                    </li>
                                ))}
                            </ol>
                        </article>

                        {/* What to bring (static) */}
                        <article className={`${CARD} space-y-5 p-6 sm:p-8`}>
                            <SectionTitle icon={BadgeCheck}>What to bring</SectionTitle>
                            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {BRING.map((b) => (
                                    <li key={b.label} className="flex items-center gap-3 rounded-2xl border border-emerald-900/10 px-4 py-3 text-sm font-medium dark:border-white/10">
                                        <span className="text-xl" aria-hidden="true">{b.emoji}</span>
                                        {b.label}
                                    </li>
                                ))}
                            </ul>
                        </article>

                        {/* FAQ (static, no JS needed) */}
                        <article className={`${CARD} space-y-5 p-6 sm:p-8`}>
                            <SectionTitle icon={ShieldCheck}>Good to know</SectionTitle>
                            <div className="divide-y divide-emerald-900/10 dark:divide-white/10">
                                {FAQ.map((f) => (
                                    <details key={f.q} className="group py-4 first:pt-0 last:pb-0">
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                                            {f.q}
                                            <ChevronDown className="size-5 shrink-0 text-emerald-600 transition-transform group-open:rotate-180 dark:text-emerald-400" aria-hidden="true" />
                                        </summary>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{f.a}</p>
                                    </details>
                                ))}
                            </div>
                        </article>
                    </div>

                    {/* ------------------------------ Sidebar ------------------------------ */}
                    <aside className="space-y-6 lg:sticky lg:top-24">
                        <div className={`${CARD} overflow-hidden`}>
                            <div className="h-1.5 bg-linear-to-r from-emerald-400 via-green-500 to-emerald-700" />
                            <div className="space-y-5 p-6">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-300">
                                        Reserve your spot
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">Free to join. Takes less than a minute.</p>
                                </div>

                                <JoinAction event={event} />

                                {/* Avatars + count */}
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {AVATARS.map((a) => (
                                            <span
                                                key={a.i}
                                                className={`flex size-8 items-center justify-center rounded-full bg-linear-to-br ${a.c} text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#10251b]`}
                                            >
                                                {a.i}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-sm font-medium">
                                        <span className="font-bold">{joined}</span> {joined === 1 ? "person" : "people"} joined
                                    </p>
                                </div>

                                {/* Slots progress */}
                                {pct != null && (
                                    <div>
                                        <div className="mb-2 flex justify-between text-xs font-medium text-muted-foreground">
                                            <span>{joined} / {slots} slots filled</span>
                                            <span>{pct}%</span>
                                        </div>
                                        <div
                                            role="progressbar"
                                            aria-valuenow={pct}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            className="h-2.5 overflow-hidden rounded-full bg-emerald-900/10 dark:bg-white/10"
                                        >
                                            <div
                                                className="h-full rounded-full bg-linear-to-r from-emerald-400 to-green-600 transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Event info */}
                        <div className={`${CARD} space-y-5 p-6`}>
                            <h2 className="font-bold">Event information</h2>
                            {longDate && <InfoRow icon={CalendarDays} label="Date" value={longDate} />}
                            {event.time && <InfoRow icon={Clock3} label="Time" value={event.time} />}
                            {event.location && <InfoRow icon={MapPin} label="Location" value={event.location} />}
                            {slots != null && <InfoRow icon={Users} label="Volunteer slots" value={`${slots} total`} />}
                        </div>

                        {/* Organizer (static) */}
                        <div className={`${CARD} flex items-center gap-4 p-5`}>
                            <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 to-green-700 text-sm font-bold text-white shadow-lg shadow-emerald-600/30">
                                {event?.organizerPhoto ? (
                                    <Image
                                        src={event.organizerPhoto}
                                        alt={event?.organizer ?? ORGANIZER.name}
                                        fill
                                        sizes="48px"
                                        unoptimized
                                        className="object-cover"
                                    />
                                ) : (
                                    (event?.organizer ?? ORGANIZER.name).charAt(0).toUpperCase()
                                )}
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">Organized by</p>
                                <p className="truncate font-semibold">{event?.organizer ?? ORGANIZER.name}</p>
                                <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                                    {ORGANIZER.role}
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}

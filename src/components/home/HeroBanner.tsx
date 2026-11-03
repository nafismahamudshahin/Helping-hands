import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarCheck, Sparkles, Users } from "lucide-react"

const HeroBanner = () => {
    return (
        <section className="relative isolate overflow-hidden bg-linear-to-b from-[#e6f7ed] via-[#f4fbf6] to-[#f4fbf6] text-[#092d23] transition-colors dark:from-[#06150f] dark:via-[#081b16] dark:to-[#081b16] dark:text-[#f1f8f3]">
            <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 -z-10 size-115 rounded-full bg-emerald-400/25 blur-[120px] dark:bg-emerald-500/15" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 -z-10 size-105 rounded-full bg-green-300/25 blur-[120px] dark:bg-green-500/10" />

            <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 py-12 sm:px-2 md:px-0 md:grid-cols-[0.98fr_1.02fr] md:py-10  lg:py-0">
                <div className="relative z-10 max-w-140">
                    <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-600/15 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#075b3c] backdrop-blur dark:border-emerald-300/20 dark:bg-white/5 dark:text-[#a8e4bd]">
                        <Sparkles className="size-3.5" aria-hidden="true" />
                        Social Development Events Platform
                    </span>

                    <h1 className="text-[clamp(2.75rem,5.5vw,4rem)] font-extrabold leading-[1.05] tracking-tighter">
                        Make Every
                        <br />
                        <span className="bg-linear-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent dark:from-emerald-300 dark:via-green-300 dark:to-teal-300">
                            Small Action
                        </span>
                        <br />
                        Matter
                    </h1>

                    <p className="mt-6 max-w-117.5 text-base leading-relaxed text-[#56716a] dark:text-[#b3c9bf]">
                        Discover, join, and create meaningful social service events in your
                        community. Together, we build a kinder, healthier and more inclusive
                        Bangladesh.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                            href="/upcoming-events"
                            className="group inline-flex h-12 items-center gap-2 rounded-full bg-linear-to-r from-emerald-600 to-green-600 px-7 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/40"
                        >
                            Explore Events
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                        <Link
                            href="/create-event"
                            className="inline-flex h-12 items-center rounded-full border border-emerald-900/15 bg-white/70 px-7 text-sm font-semibold text-[#123d30] backdrop-blur transition hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-[#e4f2e9] dark:hover:bg-white/10"
                        >
                            Create an Event
                        </Link>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-162.5">
                    <div aria-hidden="true" className="absolute -inset-3 -z-10 rotate-2 bg-linear-to-br from-emerald-300/50 to-green-200/20 dark:from-emerald-500/20 dark:to-transparent" style={{ borderRadius: "60px 240px 60px 60px" }} />
                    <div className="relative h-785 w-full sm:h-95 md:h-115">
                        <Image
                            src="/images/hero-volunteers-tree-plantation.jpg"
                            alt="Volunteers planting a tree together"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 55vw"
                            className="object-cover shadow-2xl shadow-emerald-900/25"
                            style={{ borderRadius: "60px 240px 60px 60px", display: "block" }}
                        />
                    </div>

                    <div className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 pr-5 shadow-xl backdrop-blur sm:-left-4 dark:border-white/10 dark:bg-[#10251b]/90">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-green-600 text-white">
                            <CalendarCheck className="size-5" aria-hidden="true" />
                        </span>
                        <div className="leading-tight">
                            <p className="text-lg font-bold">1,280+</p>
                            <p className="text-xs text-muted-foreground">Events organized</p>
                        </div>
                    </div>

                    <div className="absolute -top-3 right-4 hidden items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 pr-5 shadow-xl backdrop-blur sm:flex dark:border-white/10 dark:bg-[#10251b]/90">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-sky-400 to-blue-600 text-white">
                            <Users className="size-5" aria-hidden="true" />
                        </span>
                        <div className="leading-tight">
                            <p className="text-lg font-bold">52,300+</p>
                            <p className="text-xs text-muted-foreground">Volunteers joined</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroBanner
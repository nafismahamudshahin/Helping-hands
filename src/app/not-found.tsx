import Link from "next/link"
import { ArrowLeft, CalendarSearch, Compass, Home } from "lucide-react"

export const metadata = {
    title: "Page not found | HelpingHands",
}

export default function NotFound() {
    return (
        <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden bg-linear-to-b from-[#e6f7ed] via-[#f4fbf6] to-[#f4fbf6] px-5 py-16 text-[#092d23] dark:from-[#06150f] dark:via-[#081b16] dark:to-[#081b16] dark:text-[#f1f8f3]">
            <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 -z-10 size-105 rounded-full bg-emerald-400/25 blur-[120px] dark:bg-emerald-500/15" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 -z-10 size-100 rounded-full bg-green-300/25 blur-[120px] dark:bg-green-500/10" />
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 opacity-[0.06] bg-[radial-gradient(#0a5a41_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-[0.08] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]"
            />

            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                <div className="relative">
                    <p className="select-none bg-linear-to-b from-emerald-500 to-emerald-700/20 bg-clip-text text-[clamp(7rem,22vw,12rem)] font-black leading-none tracking-[-0.06em] text-transparent dark:from-emerald-300 dark:to-emerald-500/10">
                        404
                    </p>
                    <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-green-600 text-white shadow-xl shadow-emerald-600/40 sm:size-20">
                        <Compass className="size-8 sm:size-10" aria-hidden="true" />
                    </span>
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Looks like you’re lost
                </h1>
                <p className="mt-3 max-w-md text-base leading-relaxed text-[#56716a] dark:text-[#b3c9bf]">
                    The page you’re looking for doesn’t exist or may have been moved or deleted.
                    Let’s get you back to making a difference.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="group inline-flex h-12 items-center gap-2 rounded-full bg-linear-to-r from-emerald-600 to-green-600 px-7 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/40"
                    >
                        <Home className="size-4" aria-hidden="true" />
                        Back to Home
                    </Link>
                    <Link
                        href="/events"
                        className="inline-flex h-12 items-center gap-2 rounded-full border border-emerald-900/15 bg-white/70 px-7 text-sm font-semibold text-[#123d30] backdrop-blur transition hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-[#e4f2e9] dark:hover:bg-white/10"
                    >
                        <CalendarSearch className="size-4" aria-hidden="true" />
                        Browse Events
                    </Link>
                </div>

                <Link
                    href="/upcoming-events"
                    className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#078344] transition-colors hover:text-[#045d30] dark:text-[#55d788] dark:hover:text-[#8fe9ae]"
                >
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                    See upcoming events
                </Link>
            </div>
        </section>
    )
}

import { connection } from "next/server"

import { AllEventsBrowser } from "@/components/events/AllEventsBrowser"
import type { EventType } from "@/types"

async function getAllEvents(): Promise<{ events: EventType[]; error?: string }> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) return { events: [], error: "The events service is not configured." }

    try {
        const res = await fetch(`${apiUrl}/events`, { cache: "no-store" })
        if (!res.ok) throw new Error(`Events request failed with status ${res.status}.`)

        const data = await res.json()
        return { events: Array.isArray(data) ? data : data.events ?? [] }
    } catch (error) {
        console.error("Unable to load events:", error)
        return { events: [], error: "We couldn’t load events. Please try again later." }
    }
}

export const metadata = {
    title: "All Events | HelpingHands",
    description: "Browse every social development event on HelpingHands.",
}

export default async function AllEventsPage() {
    await connection()

    const { events, error } = await getAllEvents()

    return (
        <section className="relative isolate min-h-full overflow-hidden bg-linear-to-b from-[#e9f8ef] via-[#f5fbf7] to-[#f5fbf7] px-5 py-8 text-[#0f3325] dark:from-[#06150f] dark:via-[#081b16] dark:to-[#081b16] dark:text-[#eff8f2] sm:px-8 sm:py-12 lg:px-[6.65%]">
            <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-140 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[120px] dark:bg-emerald-500/10" />
            <div className="mx-auto container">
                <AllEventsBrowser events={events} error={error} />
            </div>
        </section>
    )
}
